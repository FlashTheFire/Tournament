from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import httpx
from datetime import datetime, timedelta
from typing import Dict, Optional
import asyncio
import hashlib
import secrets
import hmac
import json
import time
import base64
from collections import defaultdict

app = FastAPI(title="Free Fire Tournament API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Configuration
API_SECRET_KEY = secrets.token_urlsafe(32)  # Generate random secret key
API_CACHE = {}  # In-memory cache for API keys
RATE_LIMIT_CACHE = defaultdict(list)  # Rate limiting cache
MAX_REQUESTS_PER_MINUTE = 60  # Rate limit per client

# Security Classes
class APIKeySecurity:
    @staticmethod
    def generate_api_key(client_id: str, expires_in_minutes: int = 60) -> dict:
        """Generate encrypted API key for client"""
        timestamp = int(time.time())
        expiry = timestamp + (expires_in_minutes * 60)
        
        # Create payload
        payload = {
            "client_id": client_id,
            "timestamp": timestamp,
            "expires": expiry,
            "nonce": secrets.token_hex(8)
        }
        
        # Create signature
        payload_str = json.dumps(payload, sort_keys=True)
        signature = hmac.new(
            API_SECRET_KEY.encode(),
            payload_str.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Combine payload and signature
        api_key_data = {
            "payload": payload,
            "signature": signature
        }
        
        # Encode to base64
        api_key = base64.b64encode(
            json.dumps(api_key_data).encode()
        ).decode()
        
        # Store in cache
        API_CACHE[api_key] = {
            "client_id": client_id,
            "created_at": timestamp,
            "expires_at": expiry,
            "active": True
        }
        
        return {
            "api_key": api_key,
            "expires_at": expiry,
            "expires_in": expires_in_minutes * 60
        }
    
    @staticmethod
    def validate_api_key(api_key: str) -> dict:
        """Validate API key and return client info"""
        try:
            # Decode base64
            decoded_data = base64.b64decode(api_key.encode()).decode()
            api_key_data = json.loads(decoded_data)
            
            payload = api_key_data["payload"]
            signature = api_key_data["signature"]
            
            # Verify signature
            payload_str = json.dumps(payload, sort_keys=True)
            expected_signature = hmac.new(
                API_SECRET_KEY.encode(),
                payload_str.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                return {"valid": False, "error": "Invalid signature"}
            
            # Check expiry
            current_time = int(time.time())
            if current_time > payload["expires"]:
                return {"valid": False, "error": "API key expired"}
            
            # Check cache
            if api_key in API_CACHE and API_CACHE[api_key]["active"]:
                return {
                    "valid": True,
                    "client_id": payload["client_id"],
                    "expires_at": payload["expires"]
                }
            
            return {"valid": False, "error": "API key not found or inactive"}
            
        except Exception as e:
            return {"valid": False, "error": f"Invalid API key format: {str(e)}"}

    @staticmethod 
    def check_rate_limit(client_id: str) -> bool:
        """Check if client has exceeded rate limit"""
        current_time = time.time()
        minute_ago = current_time - 60
        
        # Clean old requests
        RATE_LIMIT_CACHE[client_id] = [
            req_time for req_time in RATE_LIMIT_CACHE[client_id]
            if req_time > minute_ago
        ]
        
        # Check if under limit
        if len(RATE_LIMIT_CACHE[client_id]) >= MAX_REQUESTS_PER_MINUTE:
            return False
        
        # Add current request
        RATE_LIMIT_CACHE[client_id].append(current_time)
        return True

# Security Dependencies
security = HTTPBearer(auto_error=False)

async def verify_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Verify API key from Authorization header"""
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="API key required. Please include Authorization header with Bearer token."
        )
    
    api_key = credentials.credentials
    validation_result = APIKeySecurity.validate_api_key(api_key)
    
    if not validation_result["valid"]:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid API key: {validation_result['error']}"
        )
    
    client_id = validation_result["client_id"]
    
    # Check rate limiting
    if not APIKeySecurity.check_rate_limit(client_id):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Maximum 60 requests per minute."
        )
    
    return validation_result

# Free Fire API configuration
FREE_FIRE_API_BASE = "https://region-info-api.vercel.app"

async def validate_free_fire_uid_api(uid: str, region: str) -> dict:
    """
    Validate Free Fire UID using the region info API
    Returns player info if valid, raises HTTPException if invalid
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(
                f"{FREE_FIRE_API_BASE}/player-info",
                params={"uid": uid, "region": region.lower()}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if we have valid player info with the correct structure
                if "player_info" in data and "basicInfo" in data["player_info"]:
                    player_info = data["player_info"]
                    basic_info = player_info.get("basicInfo", {})
                    clan_basic_info = player_info.get("clanBasicInfo", {})
                    profile_info = player_info.get("profileInfo", {})
                    
                    return {
                        "uid": uid,
                        "region": region.upper(),
                        "nickname": basic_info.get("nickname", "Unknown"),
                        "level": basic_info.get("level", 1),
                        "avatarId": profile_info.get("avatarId", "102000007"),
                        "liked": basic_info.get("liked", 0),
                        "exp": basic_info.get("exp", 0),
                        "clan_name": clan_basic_info.get("clanName", "No Guild"),
                        "clan_level": clan_basic_info.get("clanLevel", 1),
                        "validated_at": datetime.utcnow().isoformat()
                    }
                else:
                    return None
            else:
                return None
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=408, detail="Free Fire API timeout - please try again")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Free Fire API connection error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/validate-freefire")
async def validate_freefire_uid(uid: str, region: str):
    """
    Validate Free Fire UID and return player information
    """
    try:
        # Validate UID format (8-12 digits)
        if not uid.isdigit() or not (8 <= len(uid) <= 12):
            return {
                "valid": False, 
                "error": "Free Fire UID must be 8-12 digits"
            }
        
        # Call the Free Fire API
        player_info = await validate_free_fire_uid_api(uid, region)
        
        if player_info:
            return {
                "valid": True,
                "player_info": player_info,
                "clanBasicInfo": {
                    "clanName": player_info["clan_name"],
                    "clanLevel": player_info["clan_level"]
                },
                "profileInfo": {
                    "avatarId": player_info["avatarId"]
                }
            }
        else:
            return {
                "valid": False,
                "error": "Invalid Free Fire UID or region"
            }
            
    except HTTPException as he:
        return {
            "valid": False,
            "error": he.detail
        }
    except Exception as e:
        return {
            "valid": False,
            "error": f"Server error: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)