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
                    return {
                        "uid": uid,
                        "region": region.upper(),
                        "nickname": basic_info.get("nickname", "Unknown"),
                        "level": basic_info.get("level", 0),
                        "rank": basic_info.get("rank", 0),
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

# Initialize FastAPI app
app = FastAPI(title="Tournament Platform API", version="1.0.0")

# Add CORS middleware properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.tournament_db

# Collections
users_collection = db.users
tournaments_collection = db.tournaments
registrations_collection = db.registrations
matches_collection = db.matches
payments_collection = db.payments
notifications_collection = db.notifications
leaderboards_collection = db.leaderboards

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    free_fire_uid: str
    region: str  # Free Fire region code
    player_info: Optional[Dict] = None  # Store validated Free Fire player info

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TournamentCreate(BaseModel):
    name: str
    game_type: str  # "free_fire", "bgmi", "pubg"
    tournament_type: str  # "battle_royale", "clash_squad", "single_elimination", etc.
    entry_fee: float
    prize_pool: float
    max_participants: int
    start_time: datetime
    registration_deadline: datetime
    mode: str  # "solo", "duo", "squad"
    country: str
    description: str

class TournamentFilter(BaseModel):
    game_type: Optional[str] = None
    country: Optional[str] = None
    mode: Optional[str] = None
    status: Optional[str] = None

class PaymentCreate(BaseModel):
    tournament_id: str
    amount: float

# Enhanced Pydantic models for admin operations
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    wallet_balance: Optional[float] = None
    is_verified: Optional[bool] = None
    is_admin: Optional[bool] = None

class TournamentUpdate(BaseModel):
    name: Optional[str] = None
    entry_fee: Optional[float] = None
    prize_pool: Optional[float] = None
    max_participants: Optional[int] = None
    start_time: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    status: Optional[str] = None
    description: Optional[str] = None

class AdminStats(BaseModel):
    total_users: int
    total_tournaments: int
    total_revenue: float
    active_tournaments: int
    pending_payments: int
    new_users_today: int
    tournaments_today: int

class FreeFrieUserVerify(BaseModel):
    free_fire_uid: str

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"user_id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Demo Paytm API functions
async def generate_qr_code(amount: float, order_id: str) -> str:
    """Demo Paytm API - generates mock QR code for payments"""
    await asyncio.sleep(0.1)  # Simulate API delay
    
    # Create a simple QR code with payment details
    qr_data = f"upi://pay?pa=merchant@paytm&pn=Tournament&am={amount}&tr={order_id}&tn=Tournament Entry"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64 string
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return qr_base64

async def initiate_payment(amount: float, order_id: str) -> Dict[str, Any]:
    """Demo Paytm API - returns mock payment initiation response"""
    await asyncio.sleep(0.2)  # Simulate API delay
    
    return {
        "qr_code": await generate_qr_code(amount, order_id),
        "order_id": order_id,
        "amount": amount,
        "status": "pending",
        "expires_at": (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    }

async def check_payment_status(order_id: str) -> Dict[str, Any]:
    """Demo Paytm API - returns mock payment status"""
    await asyncio.sleep(0.2)
    
    # Simulate different payment statuses based on order_id
    if "success" in order_id.lower():
        status = "success"
    elif "failed" in order_id.lower():
        status = "failed"
    else:
        # Random status for demo
        import random
        status = random.choice(["success", "pending", "failed"])
    
    return {
        "order_id": order_id,
        "status": status,
        "transaction_id": f"TXN_{order_id}_{uuid.uuid4().hex[:8]}",
        "amount": 100.0,  # Mock amount
        "timestamp": datetime.utcnow().isoformat()
    }

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    # Validate Free Fire UID and region first
    try:
        player_info = await validate_free_fire_uid(user_data.free_fire_uid, user_data.region)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Free Fire validation error: {str(e)}")
    
    # Check if user exists (by email or Free Fire UID)
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_ff_user = users_collection.find_one({"free_fire_uid": user_data.free_fire_uid})
    if existing_ff_user:
        raise HTTPException(status_code=400, detail="Free Fire UID already registered")
    
    # Create new user with validated Free Fire data
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    # Check if this is the demo admin user
    is_admin = user_data.email == "demo@tournament.com"
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password_hash": hashed_password,
        "free_fire_uid": user_data.free_fire_uid,
        "region": user_data.region.upper(),
        # Use Free Fire nickname as username and full_name
        "username": player_info["nickname"],
        "full_name": player_info["nickname"],
        "player_info": player_info,
        "wallet_balance": 0.0,
        "is_verified": True,  # Auto-verified since Free Fire UID is validated
        "is_admin": is_admin,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "user_id": user_id,
        "token_type": "bearer",
        "player_info": {
            "nickname": player_info["nickname"],
            "level": player_info["level"],
            "rank": player_info["rank"],
            "region": player_info["region"]
        }
    }

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

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # If this is demo@tournament.com, ensure they have admin privileges
    if user_data.email == "demo@tournament.com" and not user.get("is_admin", False):
        users_collection.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"is_admin": True, "updated_at": datetime.utcnow()}}
        )
    
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    return {
        "access_token": access_token,
        "user_id": user["user_id"],
        "token_type": "bearer"
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    # Remove sensitive information
    user_info = {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "full_name": current_user["full_name"],
        "free_fire_uid": current_user.get("free_fire_uid"),
        "wallet_balance": current_user["wallet_balance"],
        "is_verified": current_user["is_verified"],
        "is_admin": current_user.get("is_admin", False)
    }
    return user_info

@app.post("/api/tournaments")
async def create_tournament(tournament_data: TournamentCreate, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    tournament_id = str(uuid.uuid4())
    tournament_doc = {
        "tournament_id": tournament_id,
        "name": tournament_data.name,
        "game_type": tournament_data.game_type,
        "tournament_type": tournament_data.tournament_type,
        "entry_fee": tournament_data.entry_fee,
        "prize_pool": tournament_data.prize_pool,
        "max_participants": tournament_data.max_participants,
        "current_participants": 0,
        "start_time": tournament_data.start_time,
        "registration_deadline": tournament_data.registration_deadline,
        "mode": tournament_data.mode,
        "country": tournament_data.country,
        "description": tournament_data.description,
        "status": "upcoming",  # upcoming, live, completed, cancelled
        "created_by": current_user["user_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    tournaments_collection.insert_one(tournament_doc)
    
    return {"message": "Tournament created successfully", "tournament_id": tournament_id}

@app.get("/api/tournaments")
async def get_tournaments(
    skip: int = 0,
    limit: int = 20,
    game_type: Optional[str] = None,
    country: Optional[str] = None,
    mode: Optional[str] = None,
    status: Optional[str] = None
):
    # Build filter query
    filter_query = {}
    if game_type:
        filter_query["game_type"] = game_type
    if country:
        filter_query["country"] = country
    if mode:
        filter_query["mode"] = mode
    if status:
        filter_query["status"] = status
    
    # Get tournaments
    tournaments = list(tournaments_collection.find(filter_query).skip(skip).limit(limit).sort("created_at", -1))
    
    # Remove MongoDB ObjectIds and format response
    for tournament in tournaments:
        tournament.pop("_id", None)
        # Format dates for frontend
        tournament["start_time"] = tournament["start_time"].isoformat()
        tournament["registration_deadline"] = tournament["registration_deadline"].isoformat()
        tournament["created_at"] = tournament["created_at"].isoformat()
        tournament["updated_at"] = tournament["updated_at"].isoformat()
    
    return {"tournaments": tournaments, "total": len(tournaments)}

@app.get("/api/live-stats")
async def get_live_stats():
    """Get live statistics from database"""
    try:
        # Count actual tournaments from database
        total_tournaments = tournaments_collection.count_documents({})
        active_tournaments = tournaments_collection.count_documents({"status": "live"})
        upcoming_tournaments = tournaments_collection.count_documents({"status": "upcoming"})
        
        # Count actual users
        total_users = users_collection.count_documents({})
        
        # Calculate prize pool from actual tournaments
        pipeline = [
            {"$group": {"_id": None, "total_prize": {"$sum": "$prize_pool"}}}
        ]
        prize_result = list(tournaments_collection.aggregate(pipeline))
        total_prize_pool = prize_result[0]["total_prize"] if prize_result else 0
        
        # Get current live matches (mock data for now)
        live_matches = max(1, active_tournaments)
        
        return {
            "live_battles": max(1, active_tournaments),
            "total_players": max(1, total_users),
            "prize_pool": max(1000, total_prize_pool),
            "tournaments": max(1, total_tournaments),
            "upcoming_tournaments": upcoming_tournaments,
            "live_matches": live_matches
        }
    except Exception as e:
        # Fallback to minimum values if database query fails
        return {
            "live_battles": 1,
            "total_players": 1,
            "prize_pool": 1000,
            "tournaments": 1,
            "upcoming_tournaments": 0,
            "live_matches": 1
        }

@app.get("/api/payments/{order_id}/status")
async def get_payment_status(order_id: str):
    """Get payment status for an order"""
    try:
        status_data = await check_payment_status(order_id)
        return status_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch payment status")

@app.post("/api/payments")
async def create_payment(payment_data: PaymentCreate, current_user: dict = Depends(get_current_user)):
    """Create a new payment for tournament entry"""
    try:
        # Check if tournament exists
        tournament = tournaments_collection.find_one({"tournament_id": payment_data.tournament_id})
        if not tournament:
            raise HTTPException(status_code=404, detail="Tournament not found")
        
        # Generate order ID
        order_id = f"ORD_{uuid.uuid4().hex[:8]}_{int(datetime.utcnow().timestamp())}"
        
        # Initiate payment with demo Paytm API
        payment_response = await initiate_payment(payment_data.amount, order_id)
        
        # Store payment record in database
        payment_doc = {
            "order_id": order_id,
            "user_id": current_user["user_id"],
            "tournament_id": payment_data.tournament_id,
            "amount": payment_data.amount,
            "status": "pending",
            "payment_method": "upi",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        payments_collection.insert_one(payment_doc)
        
        return {
            "message": "Payment initiated successfully",
            "order_id": order_id,
            "qr_code": payment_response["qr_code"],
            "amount": payment_data.amount,
            "expires_at": payment_response["expires_at"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create payment")

# Add leaderboards endpoint
@app.get("/api/leaderboards")
async def get_leaderboards(
    skip: int = 0,
    limit: int = 50,
    game_type: Optional[str] = None,
    time_period: Optional[str] = None
):
    """Get leaderboards with optional filtering"""
    try:
        # Build filter query
        filter_query = {}
        if game_type:
            filter_query["game_type"] = game_type
        if time_period:
            # Add time-based filtering if needed
            pass
        
        # Get leaderboard entries
        leaderboards = list(leaderboards_collection.find(filter_query).skip(skip).limit(limit).sort("total_earnings", -1))
        
        # Remove MongoDB ObjectIds
        for entry in leaderboards:
            entry.pop("_id", None)
        
        return {"leaderboards": leaderboards, "total": len(leaderboards)}
    except Exception as e:
        # Return sample leaderboard data if database query fails
        return {
            "leaderboards": [
                {
                    "rank": 1,
                    "username": "FF_LEGEND_2025",
                    "total_earnings": 125000,
                    "tournaments_won": 15,
                    "games_played": 89,
                    "skill_rating": 2850
                }
            ],
            "total": 1
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)