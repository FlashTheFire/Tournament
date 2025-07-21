from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Tournament Platform API", version="1.0.0")

# Free Fire API configuration
FREE_FIRE_API_BASE = "https://region-info-api.vercel.app"

async def validate_free_fire_uid(uid: str, region: str) -> dict:
    """
    Validate Free Fire UID using the region info API
    Returns player info if valid, raises HTTPException if invalid
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f"{FREE_FIRE_API_BASE}/player-info",
                params={"uid": uid, "region": region.lower()}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "player_info" in data:
                    player_info = data["player_info"]
                    # Extract essential player information
                    basic_info = player_info.get("basicInfo", {})
                    
                    # Extract guild/clan information
                    guild_info = player_info.get("guildInfo", {})
                    clan_name = guild_info.get("guildName", "No Guild")
                    clan_level = guild_info.get("guildLevel", 1)
                    
                    # Extract avatar/head picture information
                    head_pic = basic_info.get("headPic", "1") # Default avatar ID
                    
                    return {
                        "uid": uid,
                        "region": region.upper(),
                        "nickname": basic_info.get("nickname", "Unknown"),
                        "level": basic_info.get("level", 0),
                        "rank": basic_info.get("rank", 0),
                        "clan_name": clan_name,
                        "clan_level": clan_level,
                        "head_pic": head_pic,
                        "account_id": basic_info.get("accountId", ""),
                        "last_login": basic_info.get("lastLoginAt", ""),
                        "validated_at": datetime.utcnow().isoformat(),
                        "full_info": player_info  # Store complete info for admin use
                    }
                else:
                    raise HTTPException(status_code=400, detail="Invalid Free Fire UID or region")
            else:
                raise HTTPException(status_code=400, detail="Free Fire UID validation failed")
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=408, detail="Free Fire API timeout - please try again")
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Free Fire API connection error")

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    free_fire_uid: str
    region: str  # Free Fire region code
    player_info: dict = None  # Store validated Free Fire player info

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/api/validate-freefire")
async def validate_freefire_uid(uid: str, region: str):
    """
    Real-time validation endpoint for Free Fire UID and region
    Used by frontend for instant validation feedback
    """
    try:
        player_info = await validate_free_fire_uid(uid, region)
        return {
            "valid": True,
            "player_info": {
                "nickname": player_info["nickname"],
                "level": player_info["level"],
                "rank": player_info["rank"],
                "region": player_info["region"],
                "account_id": player_info["account_id"]
            }
        }
    except HTTPException as e:
        return {
            "valid": False,
            "error": e.detail
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    # Validate Free Fire UID and region first
    try:
        player_info = await validate_free_fire_uid(user_data.free_fire_uid, user_data.region)
        return {
            "message": "Free Fire validation successful",
            "player_info": {
                "nickname": player_info["nickname"],
                "level": player_info["level"],
                "rank": player_info["rank"],
                "region": player_info["region"]
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Free Fire validation error: {str(e)}")