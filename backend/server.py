from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import httpx
from datetime import datetime
from typing import Dict
import asyncio

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
                
                # Check if we have valid player info
                if "basicInfo" in data:
                    basic_info = data.get("basicInfo", {})
                    clan_basic_info = data.get("clanBasicInfo", {})
                    
                    return {
                        "uid": uid,
                        "region": region.upper(),
                        "nickname": basic_info.get("nickname", "Unknown"),
                        "level": basic_info.get("level", 1),
                        "avatarId": basic_info.get("avatarId", "1"),
                        "liked": data.get("liked", 0),
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