from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import httpx
from datetime import datetime
from typing import Dict, Optional

app = FastAPI(title="Free Fire Tournament API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                        "validated_at": datetime.utcnow().isoformat(),
                        "profileInfo": {"avatarId": profile_info.get("avatarId", "102000007")}
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
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/auth/generate-key")
async def generate_api_key(client_data: dict):
    """Generate a simple API key for testing"""
    import base64
    import time
    
    client_id = client_data.get("client_id", "default_client")
    api_key = base64.b64encode(f"ff_key_{client_id}_{int(time.time())}".encode()).decode()
    
    return {
        "success": True,
        "api_key": api_key,
        "client_id": client_id,
        "expires_at": datetime.fromtimestamp(time.time() + 86400).isoformat(),
        "expires_in_seconds": 86400
    }

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
                "timestamp": datetime.utcnow().isoformat()
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

@app.post("/api/auth/register")
async def register_user(user_data: dict):
    """
    Register a new user with Free Fire validation
    """
    try:
        # Extract user data
        email = user_data.get("email")
        password = user_data.get("password")
        free_fire_uid = user_data.get("free_fire_uid")
        region = user_data.get("region")
        
        # Basic validation
        if not all([email, password, free_fire_uid, region]):
            return {
                "success": False,
                "error": "All fields are required"
            }
        
        # Validate Free Fire UID
        if not free_fire_uid.isdigit() or not (8 <= len(free_fire_uid) <= 12):
            return {
                "success": False,
                "error": "Free Fire UID must be 8-12 digits"
            }
        
        # Validate Free Fire player info
        player_info = await validate_free_fire_uid_api(free_fire_uid, region)
        
        if not player_info:
            return {
                "success": False,
                "error": "Invalid Free Fire UID or region"
            }
        
        # Simulate successful registration
        # In a real app, you would:
        # 1. Hash the password
        # 2. Store user in database
        # 3. Generate JWT token
        
        return {
            "success": True,
            "message": f"Welcome to the Arena, {player_info['nickname']}! 🎉🔥",
            "user": {
                "email": email,
                "free_fire_uid": free_fire_uid,
                "region": region,
                "nickname": player_info["nickname"],
                "level": player_info["level"]
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Registration failed: {str(e)}"
        }

@app.post("/api/auth/login")
async def login_user(credentials: dict):
    """
    Login user with email/password or Free Fire UID/password
    """
    try:
        # Extract credentials
        email = credentials.get("email", "")
        password = credentials.get("password", "")
        
        # Basic validation
        if not email or not password:
            return {
                "success": False,
                "error": "Email and password are required"
            }
        
        # Demo user credentials for testing
        if email == "demo@tournament.com" and password == "demo123":
            # Generate a simple JWT-like token
            import base64
            import json
            import time
            
            token_data = {
                "user_id": "demo_user_123",
                "email": "demo@tournament.com",
                "nickname": "DemoWarrior",
                "exp": time.time() + 86400  # 24 hours
            }
            
            token = base64.b64encode(json.dumps(token_data).encode()).decode()
            
            return {
                "success": True,
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": "demo_user_123",
                    "email": "demo@tournament.com",
                    "nickname": "DemoWarrior",
                    "level": 45,
                    "is_admin": True
                }
            }
        
        # For other credentials, simulate authentication failure
        return {
            "success": False,
            "error": "Invalid email or password"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Login failed: {str(e)}"
        }

@app.get("/api/auth/me")
async def get_current_user():
    """
    Get current authenticated user information
    """
    try:
        # In a real app, you would:
        # 1. Verify JWT token from Authorization header
        # 2. Extract user ID from token
        # 3. Fetch user from database
        
        # For demo purposes, return demo user data
        return {
            "success": True,
            "user": {
                "id": "demo_user_123",
                "email": "demo@tournament.com",
                "nickname": "DemoWarrior",
                "level": 45,
                "is_admin": True,
                "free_fire_uid": "1234567890",
                "region": "IND"
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get user info: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)