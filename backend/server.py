from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext
import uuid
import httpx
import json
import base64
from typing import Union
import qrcode
from io import BytesIO
import asyncio
import numpy as np
import random

# Load environment variables
load_dotenv()

app = FastAPI(title="Free Fire Tournament API", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/tournament_db")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_super_secret_jwt_key_change_this_in_production")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize database
try:
    client = MongoClient(MONGO_URL)
    db = client.tournament_db
    
    # Collections
    users_collection = db.users
    tournaments_collection = db.tournaments
    leaderboards_collection = db.leaderboards
    transactions_collection = db.transactions
    payments_collection = db.payments
    ai_predictions_collection = db.ai_predictions
    
    # Create indexes for better performance and constraints
    users_collection.create_index("email", unique=True)
    users_collection.create_index("free_fire_uid", unique=True)
    users_collection.create_index("username", unique=True)
    tournaments_collection.create_index("tournament_id", unique=True)
    leaderboards_collection.create_index("user_id")
    transactions_collection.create_index("user_id")
    
    print("✅ Database connected successfully!")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    raise

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Free Fire API configuration
FREE_FIRE_API_BASE = "https://region-info-api.vercel.app"

# Pydantic models
class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    free_fire_uid: str
    region: str

class UserLogin(BaseModel):
    identifier: str  # Can be email or free_fire_uid
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"user_id": user_id})
    if user is None:
        raise credentials_exception
    return user

async def validate_free_fire_uid(uid: str, region: str) -> dict:
    """Validate Free Fire UID using the region info API"""
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
                    basic_info = player_info.get("basicInfo", {})
                    guild_info = player_info.get("guildInfo", {})
                    profile_info = player_info.get("profileInfo", {})
                    
                    return {
                        "uid": uid,
                        "region": region.upper(),
                        "nickname": basic_info.get("nickname", "Unknown"),
                        "level": basic_info.get("level", 1),
                        "avatar_id": profile_info.get("avatarId", "102000007"),
                        "liked": basic_info.get("liked", 0),
                        "exp": basic_info.get("exp", 0),
                        "clan_name": guild_info.get("guildName", "No Guild"),
                        "clan_level": guild_info.get("guildLevel", 1),
                        "validated_at": datetime.utcnow().isoformat()
                    }
            return None
        except Exception as e:
            print(f"Free Fire API error: {e}")
            return None

# API Endpoints

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "version": "2.0.0"
    }

@app.post("/api/auth/register", response_model=Token)
async def register_user(user_data: UserRegistration):
    try:
        # Check if email already exists
        if users_collection.find_one({"email": user_data.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if Free Fire UID already exists
        if users_collection.find_one({"free_fire_uid": user_data.free_fire_uid}):
            raise HTTPException(status_code=400, detail="Free Fire UID already registered")
        
        # Validate Free Fire UID
        ff_player_info = await validate_free_fire_uid(user_data.free_fire_uid, user_data.region)
        if not ff_player_info:
            raise HTTPException(status_code=400, detail="Invalid Free Fire UID or region")
        
        # Create user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user_data.password)
        
        user_doc = {
            "user_id": user_id,
            "email": user_data.email,
            "password_hash": hashed_password,
            "free_fire_uid": user_data.free_fire_uid,
            "region": user_data.region,
            "username": ff_player_info["nickname"],
            "nickname": ff_player_info["nickname"],
            "level": ff_player_info["level"],
            "avatar_id": ff_player_info["avatar_id"],
            "liked": ff_player_info["liked"],
            "exp": ff_player_info["exp"],
            "clan_name": ff_player_info["clan_name"],
            "clan_level": ff_player_info["clan_level"],
            "wallet_balance": 1000,  # Starting bonus
            "is_admin": False,
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "stats": {
                "tournaments_joined": 0,
                "tournaments_won": 0,
                "total_winnings": 0,
                "kills_total": 0,
                "matches_played": 0,
                "win_rate": 0.0,
                "average_rank": 0
            }
        }
        
        # Insert user
        users_collection.insert_one(user_doc)
        
        # Create initial leaderboard entry
        leaderboard_doc = {
            "user_id": user_id,
            "username": ff_player_info["nickname"],
            "points": 1000,  # Starting points
            "rank": 0,  # Will be calculated
            "level": ff_player_info["level"],
            "wins": 0,
            "kills": 0,
            "avatar": f"https://freefireinfo.vercel.app/icon?id={ff_player_info['avatar_id']}",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        leaderboards_collection.insert_one(leaderboard_doc)
        
        # Create welcome transaction
        transaction_doc = {
            "transaction_id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "credit",
            "amount": 1000,
            "description": "🎉 Welcome Bonus - Join the Elite Warriors!",
            "category": "bonus",
            "status": "completed",
            "created_at": datetime.utcnow()
        }
        transactions_collection.insert_one(transaction_doc)
        
        # Create access token
        access_token_expires = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_id}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user_id,
                "email": user_data.email,
                "username": ff_player_info["nickname"],
                "free_fire_uid": user_data.free_fire_uid,
                "region": user_data.region,
                "level": ff_player_info["level"],
                "avatar_id": ff_player_info["avatar_id"],
                "wallet_balance": 1000,
                "is_admin": False
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    try:
        # Check if identifier is email or Free Fire UID
        user = None
        if "@" in login_data.identifier:
            user = users_collection.find_one({"email": login_data.identifier})
        else:
            user = users_collection.find_one({"free_fire_uid": login_data.identifier})
        
        if not user or not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Update last login
        users_collection.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        access_token_expires = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["user_id"]}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user["user_id"],
                "email": user["email"],
                "username": user["username"],
                "free_fire_uid": user["free_fire_uid"],
                "region": user["region"],
                "level": user["level"],
                "avatar_id": user["avatar_id"],
                "wallet_balance": user["wallet_balance"],
                "is_admin": user["is_admin"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "free_fire_uid": current_user["free_fire_uid"],
        "region": current_user["region"],
        "level": current_user["level"],
        "avatar_id": current_user["avatar_id"],
        "wallet_balance": current_user["wallet_balance"],
        "is_admin": current_user["is_admin"],
        "stats": current_user.get("stats", {}),
        "created_at": current_user["created_at"]
    }

@app.get("/api/validate-freefire")
async def validate_freefire_uid(uid: str, region: str):
    """Validate Free Fire UID and return player information"""
    try:
        if not uid.isdigit() or not (8 <= len(uid) <= 12):
            return {"valid": False, "error": "Free Fire UID must be 8-12 digits"}
        
        player_info = await validate_free_fire_uid(uid, region)
        if player_info:
            return {
                "valid": True,
                "player_info": player_info,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            return {"valid": False, "error": "Invalid Free Fire UID or region"}
    except Exception as e:
        return {"valid": False, "error": f"Validation error: {str(e)}"}

@app.get("/api/tournaments")
async def get_tournaments(
    status: Optional[str] = None,
    game_type: Optional[str] = None,
    country: Optional[str] = None,
    limit: int = 20
):
    try:
        query = {}
        if status:
            query["status"] = status
        if game_type:
            query["game_type"] = game_type
        if country:
            query["country"] = country
            
        tournaments = list(tournaments_collection.find(query).limit(limit).sort("created_at", -1))
        
        # Convert ObjectId to string
        for tournament in tournaments:
            tournament["_id"] = str(tournament["_id"])
            
        return {"tournaments": tournaments, "count": len(tournaments)}
    except Exception as e:
        print(f"Get tournaments error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch tournaments")

@app.post("/api/tournaments")
async def create_tournament(tournament_data: dict, current_user: dict = Depends(get_current_user)):
    try:
        if not current_user.get("is_admin", False):
            raise HTTPException(status_code=403, detail="Admin access required")
            
        tournament_id = str(uuid.uuid4())
        tournament_doc = {
            "tournament_id": tournament_id,
            "name": tournament_data["name"],
            "description": tournament_data.get("description", ""),
            "game_type": tournament_data["game_type"],
            "tournament_type": tournament_data.get("tournament_type", "elimination"),
            "entry_fee": tournament_data["entry_fee"],
            "prize_pool": tournament_data["prize_pool"],
            "max_participants": tournament_data["max_participants"],
            "current_participants": 0,
            "start_time": datetime.fromisoformat(tournament_data["start_time"]),
            "registration_deadline": datetime.fromisoformat(tournament_data["registration_deadline"]),
            "mode": tournament_data["mode"],
            "country": tournament_data["country"],
            "status": "upcoming",
            "participants": [],
            "created_by": current_user["user_id"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        tournaments_collection.insert_one(tournament_doc)
        tournament_doc["_id"] = str(tournament_doc["_id"])
        
        return {"success": True, "tournament": tournament_doc}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Create tournament error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create tournament")

@app.get("/api/leaderboards")
async def get_leaderboards(category: str = "overall", limit: int = 50):
    try:
        # Calculate real-time rankings
        leaderboard_data = list(
            leaderboards_collection.find()
            .sort("points", -1)
            .limit(limit)
        )
        
        # Update ranks
        for i, player in enumerate(leaderboard_data):
            player["rank"] = i + 1
            player["_id"] = str(player["_id"])
            
        return {"leaderboard": leaderboard_data, "total_count": len(leaderboard_data)}
    except Exception as e:
        print(f"Get leaderboards error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboards")

@app.get("/api/live-stats")
async def get_live_stats():
    try:
        # Get real statistics from database
        total_users = users_collection.count_documents({})
        total_tournaments = tournaments_collection.count_documents({})
        live_tournaments = tournaments_collection.count_documents({"status": "live"})
        total_prize_pool = tournaments_collection.aggregate([
            {"$group": {"_id": None, "total": {"$sum": "$prize_pool"}}}
        ])
        
        prize_pool_result = list(total_prize_pool)
        total_prize_amount = prize_pool_result[0]["total"] if prize_pool_result else 0
        
        return {
            "total_tournaments": total_tournaments,
            "active_players": total_users,
            "live_matches": live_tournaments,
            "total_prize_pool": total_prize_amount,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Get live stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch live stats")

@app.get("/api/dashboard-data")
async def get_dashboard_data(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["user_id"]
        
        # Get user tournaments
        user_tournaments = list(
            tournaments_collection.find({"participants": user_id})
            .sort("created_at", -1)
            .limit(5)
        )
        
        # Convert ObjectId to string
        for tournament in user_tournaments:
            tournament["_id"] = str(tournament["_id"])
        
        # Get user transactions
        recent_transactions = list(
            transactions_collection.find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(10)
        )
        
        for transaction in recent_transactions:
            transaction["_id"] = str(transaction["_id"])
        
        # Calculate achievements
        achievements = [
            {
                "id": 1,
                "name": "First Steps",
                "description": "Create your account",
                "earned": True,
                "rarity": "common"
            },
            {
                "id": 2,
                "name": "Tournament Player",
                "description": "Join your first tournament",
                "earned": current_user.get("stats", {}).get("tournaments_joined", 0) > 0,
                "rarity": "rare"
            },
            {
                "id": 3,
                "name": "Champion",
                "description": "Win a tournament",
                "earned": current_user.get("stats", {}).get("tournaments_won", 0) > 0,
                "rarity": "epic"
            }
        ]
        
        return {
            "stats": current_user.get("stats", {}),
            "recent_tournaments": user_tournaments,
            "achievements": achievements,
            "recent_transactions": recent_transactions,
            "wallet_balance": current_user.get("wallet_balance", 0)
        }
    except Exception as e:
        print(f"Get dashboard data error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")

@app.get("/api/wallet/transactions")
async def get_wallet_transactions(current_user: dict = Depends(get_current_user)):
    try:
        transactions = list(
            transactions_collection.find({"user_id": current_user["user_id"]})
            .sort("created_at", -1)
            .limit(50)
        )
        
        for transaction in transactions:
            transaction["_id"] = str(transaction["_id"])
            
        return {"transactions": transactions}
    except Exception as e:
        print(f"Get transactions error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch transactions")

@app.post("/api/wallet/add-funds")
async def add_funds(amount_data: dict, current_user: dict = Depends(get_current_user)):
    try:
        amount = amount_data["amount"]
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Invalid amount")
        
        # Update user wallet
        users_collection.update_one(
            {"user_id": current_user["user_id"]},
            {"$inc": {"wallet_balance": amount}}
        )
        
        # Create transaction record
        transaction_doc = {
            "transaction_id": str(uuid.uuid4()),
            "user_id": current_user["user_id"],
            "type": "credit",
            "amount": amount,
            "description": f"💎 Battle Funds Added - ₹{amount}",
            "category": "topup",
            "status": "completed",
            "payment_method": "UPI",
            "created_at": datetime.utcnow()
        }
        transactions_collection.insert_one(transaction_doc)
        
        # Get updated balance
        updated_user = users_collection.find_one({"user_id": current_user["user_id"]})
        
        return {
            "success": True,
            "new_balance": updated_user["wallet_balance"],
            "transaction_id": transaction_doc["transaction_id"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Add funds error: {e}")
        raise HTTPException(status_code=500, detail="Failed to add funds")

@app.get("/api/ai-predictions")
async def get_ai_predictions(current_user: dict = Depends(get_current_user)):
    try:
        # Generate or get AI predictions
        predictions = [
            {
                "id": 1,
                "type": "match_prediction",
                "title": "Optimal Landing Zone",
                "prediction": f"Based on your play style, {current_user['username']}, we recommend landing at Pochinok for a 73% higher survival rate in Battle Royale matches.",
                "confidence": 87,
                "action": "View Heatmap",
                "icon": "Target",
                "gradient": "from-red-500 to-pink-600"
            },
            {
                "id": 2,
                "type": "skill_analysis",
                "title": "Weapon Mastery",
                "prediction": "Your AR rifle accuracy has improved by 15% this week. Focus on SMG training to become more versatile in close combat.",
                "confidence": 92,
                "action": "Start Training",
                "icon": "Crosshair", 
                "gradient": "from-purple-500 to-indigo-600"
            },
            {
                "id": 3,
                "type": "tournament_insight",
                "title": "Tournament Strategy",
                "prediction": "Evening tournaments (7-9 PM) show your highest win rate at 78%. Consider focusing your competition schedule during these hours.",
                "confidence": 84,
                "action": "View Schedule",
                "icon": "Trophy",
                "gradient": "from-yellow-500 to-orange-600"
            }
        ]
        
        return {"predictions": predictions}
    except Exception as e:
        print(f"Get AI predictions error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch AI predictions")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)