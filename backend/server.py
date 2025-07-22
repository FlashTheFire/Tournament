from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import httpx
from datetime import datetime, timedelta
from typing import Dict, Optional, List
import hashlib
import uuid
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Free Fire Tournament API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client.tournament_db

# Collections
users_collection = db.users
tournaments_collection = db.tournaments
leaderboards_collection = db.leaderboards
registrations_collection = db.registrations
payments_collection = db.payments

# In-memory user storage (in production, use a proper database) - keeping for backward compatibility
users_db = {}
active_sessions = {}

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
    Register a new user with Free Fire validation and save data
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
        
        # Check if user already exists
        if email in users_db:
            return {
                "success": False,
                "error": "User with this email already exists"
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
        
        # Generate user ID and hash password (simplified)
        user_id = str(uuid.uuid4())
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Save user data to in-memory database
        users_db[email] = {
            "id": user_id,
            "email": email,
            "password_hash": password_hash,
            "free_fire_uid": free_fire_uid,
            "region": region,
            "nickname": player_info["nickname"],
            "level": player_info["level"],
            "avatar_id": player_info["avatarId"],
            "liked": player_info["liked"],
            "exp": player_info["exp"],
            "clan_name": player_info["clan_name"],
            "clan_level": player_info["clan_level"],
            "is_admin": False,
            "created_at": datetime.utcnow().isoformat(),
            "player_info": player_info  # Store complete player info
        }
        
        # Generate session token
        import base64
        import json
        import time
        
        token_data = {
            "user_id": user_id,
            "email": email,
            "exp": time.time() + 86400  # 24 hours
        }
        
        token = base64.b64encode(json.dumps(token_data).encode()).decode()
        active_sessions[token] = user_id
        
        return {
            "success": True,
            "message": f"Welcome to the Arena, {player_info['nickname']}! 🎉🔥",
            "token": token,
            "user": {
                "id": user_id,
                "email": email,
                "nickname": player_info["nickname"],
                "level": player_info["level"],
                "avatar_id": player_info["avatarId"],
                "free_fire_uid": free_fire_uid,
                "region": region,
                "liked": player_info["liked"],
                "exp": player_info["exp"],
                "clan_name": player_info["clan_name"],
                "clan_level": player_info["clan_level"],
                "is_admin": False
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
    Login user with email/password and return their saved data
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
                "exp": time.time() + 86400  # 24 hours
            }
            
            token = base64.b64encode(json.dumps(token_data).encode()).decode()
            active_sessions[token] = "demo_user_123"
            
            return {
                "success": True,
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": "demo_user_123",
                    "email": "demo@tournament.com",
                    "nickname": "DemoWarrior",
                    "level": 45,
                    "avatar_id": "102000007",
                    "free_fire_uid": "1234567890",
                    "region": "IND",
                    "liked": 15000,
                    "exp": 500000,
                    "clan_name": "Elite Squad",
                    "clan_level": 10,
                    "is_admin": True
                }
            }
        
        # Check registered users
        if email in users_db:
            user = users_db[email]
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            if user["password_hash"] == password_hash:
                # Generate session token
                import base64
                import json
                import time
                
                token_data = {
                    "user_id": user["id"],
                    "email": email,
                    "exp": time.time() + 86400  # 24 hours
                }
                
                token = base64.b64encode(json.dumps(token_data).encode()).decode()
                active_sessions[token] = user["id"]
                
                return {
                    "success": True,
                    "message": "Login successful",
                    "token": token,
                    "user": {
                        "id": user["id"],
                        "email": user["email"],
                        "nickname": user["nickname"],
                        "level": user["level"],
                        "avatar_id": user["avatar_id"],
                        "free_fire_uid": user["free_fire_uid"],
                        "region": user["region"],
                        "liked": user["liked"],
                        "exp": user["exp"],
                        "clan_name": user["clan_name"],
                        "clan_level": user["clan_level"],
                        "is_admin": user["is_admin"]
                    }
                }
        
        # Invalid credentials
        return {
            "success": False,
            "error": "Invalid email or password"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Login failed: {str(e)}"
        }

def get_user_from_token(authorization: str = None):
    """Extract user from authorization token"""
    if not authorization or not authorization.startswith('Bearer '):
        return None
    
    try:
        token = authorization.split(' ')[1]
        if token not in active_sessions:
            return None
            
        user_id = active_sessions[token]
        
        # Check for demo user
        if user_id == "demo_user_123":
            return {
                "id": "demo_user_123",
                "email": "demo@tournament.com",
                "nickname": "DemoWarrior",
                "level": 45,
                "avatar_id": "102000007",
                "free_fire_uid": "1234567890",
                "region": "IND",
                "liked": 15000,
                "exp": 500000,
                "clan_name": "Elite Squad",
                "clan_level": 10,
                "is_admin": True
            }
        
        # Find registered user
        for email, user_data in users_db.items():
            if user_data["id"] == user_id:
                return {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "nickname": user_data["nickname"],
                    "level": user_data["level"],
                    "avatar_id": user_data["avatar_id"],
                    "free_fire_uid": user_data["free_fire_uid"],
                    "region": user_data["region"],
                    "liked": user_data["liked"],
                    "exp": user_data["exp"],
                    "clan_name": user_data["clan_name"],
                    "clan_level": user_data["clan_level"],
                    "is_admin": user_data["is_admin"],
                    "created_at": user_data["created_at"]
                }
        
        return None
    except:
        return None

@app.get("/api/auth/me")
async def get_current_user(authorization: str = None):
    """
    Get current authenticated user information
    """
    try:
        # Extract authorization header manually since we're not using FastAPI's Depends
        # In a real app, use proper dependency injection
        user = get_user_from_token(authorization)
        
        if not user:
            return {
                "success": False,
                "error": "Not authenticated"
            }
        
        return {
            "success": True,
            "user": user
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get user info: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)