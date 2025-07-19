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

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Tournament Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
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
    username: str
    full_name: str
    free_fire_uid: Optional[str] = None

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

# Demo API Functions
async def get_free_fire_user_info(uid: str) -> Dict[str, Any]:
    """Demo Free Fire API - returns mock user data"""
    # Simulate API call delay
    await asyncio.sleep(0.5)
    
    # Mock user data based on UID
    mock_users = {
        "123456789": {
            "uid": "123456789",
            "username": "ProGamer_FF",
            "level": 65,
            "rank": "Heroic",
            "total_matches": 1250,
            "wins": 342,
            "kills": 8750,
            "survival_rate": "27.4%",
            "avg_damage": 1847,
            "headshot_rate": "18.5%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        },
        "987654321": {
            "uid": "987654321", 
            "username": "FF_Champion",
            "level": 72,
            "rank": "Grand Master",
            "total_matches": 2100,
            "wins": 689,
            "kills": 15420,
            "survival_rate": "32.8%",
            "avg_damage": 2156,
            "headshot_rate": "22.1%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    }
    
    # Return mock data or default
    return mock_users.get(uid, {
        "uid": uid,
        "username": f"Player_{uid[-4:]}",
        "level": 45,
        "rank": "Elite",
        "total_matches": 850,
        "wins": 187,
        "kills": 4250,
        "survival_rate": "22.0%",
        "avg_damage": 1456,
        "headshot_rate": "15.2%",
        "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "is_verified": False
    })

async def generate_paytm_qr(order_id: str, amount: float) -> Dict[str, Any]:
    """Demo Paytm API - generates mock QR code"""
    await asyncio.sleep(0.3)
    
    # Generate a simple QR code with order info
    qr_data = f"paytm://pay?order_id={order_id}&amount={amount}&merchant=demo"
    
    # Create QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Convert to base64 image
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        "qr_code": f"data:image/png;base64,{qr_base64}",
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
    # Check if user exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name,
        "password_hash": hashed_password,
        "free_fire_uid": user_data.free_fire_uid,
        "wallet_balance": 0.0,
        "is_verified": False,
        "is_admin": False,
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
        "token_type": "bearer"
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
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

@app.get("/api/tournaments/{tournament_id}")
async def get_tournament(tournament_id: str):
    tournament = tournaments_collection.find_one({"tournament_id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    tournament.pop("_id", None)
    tournament["start_time"] = tournament["start_time"].isoformat()
    tournament["registration_deadline"] = tournament["registration_deadline"].isoformat()
    tournament["created_at"] = tournament["created_at"].isoformat()
    tournament["updated_at"] = tournament["updated_at"].isoformat()
    
    return tournament

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)