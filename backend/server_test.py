from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/validate-freefire")
async def validate_freefire_uid(uid: str, region: str):
    # Mock response for testing frontend changes
    if uid == "123456789":
        return {
            "valid": True,
            "player_info": {
                "uid": uid,
                "region": region.upper(),
                "nickname": "TestPlayer", 
                "level": 45,
                "rank": 1250,
                "clan_name": "Elite Warriors",
                "clan_level": 8,
                "head_pic": "123"
            }
        }
    else:
        return {"valid": False, "error": "Invalid UID or region"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)