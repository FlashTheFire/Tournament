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

@app.post("/api/auth/verify-freefire")
async def verify_free_fire_uid(verify_data: FreeFrieUserVerify, current_user: dict = Depends(get_current_user)):
    """Verify Free Fire UID and get user information"""
    try:
        # Call demo Free Fire API
        ff_user_data = await get_free_fire_user_info(verify_data.free_fire_uid)
        
        # Update user's Free Fire information
        users_collection.update_one(
            {"user_id": current_user["user_id"]},
            {
                "$set": {
                    "free_fire_uid": verify_data.free_fire_uid,
                    "free_fire_data": ff_user_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "message": "Free Fire UID verified successfully",
            "user_data": ff_user_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to verify Free Fire UID: {str(e)}")

@app.post("/api/payments/create-qr")
async def create_payment_qr(payment_data: PaymentCreate, current_user: dict = Depends(get_current_user)):
    """Generate Paytm QR code for tournament registration"""
    # Check if tournament exists
    tournament = tournaments_collection.find_one({"tournament_id": payment_data.tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Check if user already registered
    existing_registration = registrations_collection.find_one({
        "tournament_id": payment_data.tournament_id,
        "user_id": current_user["user_id"]
    })
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this tournament")
    
    # Create order ID
    order_id = f"ORD_{payment_data.tournament_id}_{current_user['user_id']}_{uuid.uuid4().hex[:8]}"
    
    try:
        # Generate QR code using demo Paytm API
        qr_data = await generate_paytm_qr(order_id, payment_data.amount)
        
        # Save payment record
        payment_doc = {
            "order_id": order_id,
            "user_id": current_user["user_id"],
            "tournament_id": payment_data.tournament_id,
            "amount": payment_data.amount,
            "status": "pending",
            "qr_code": qr_data["qr_code"],
            "expires_at": datetime.fromisoformat(qr_data["expires_at"]),
            "created_at": datetime.utcnow()
        }
        
        payments_collection.insert_one(payment_doc)
        
        return {
            "order_id": order_id,
            "qr_code": qr_data["qr_code"],
            "amount": payment_data.amount,
            "expires_at": qr_data["expires_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create payment: {str(e)}")

@app.get("/api/payments/{order_id}/status")
async def check_payment(order_id: str, current_user: dict = Depends(get_current_user)):
    """Check payment status"""
    # Find payment record
    payment = payments_collection.find_one({"order_id": order_id, "user_id": current_user["user_id"]})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    try:
        # Check status using demo Paytm API
        status_data = await check_payment_status(order_id)
        
        # Update payment status
        payments_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "status": status_data["status"],
                    "transaction_id": status_data.get("transaction_id"),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # If payment successful, register user for tournament
        if status_data["status"] == "success":
            tournament_id = payment["tournament_id"]
            
            # Check if not already registered
            existing_registration = registrations_collection.find_one({
                "tournament_id": tournament_id,
                "user_id": current_user["user_id"]
            })
            
            if not existing_registration:
                # Create registration
                registration_doc = {
                    "registration_id": str(uuid.uuid4()),
                    "tournament_id": tournament_id,
                    "user_id": current_user["user_id"],
                    "payment_order_id": order_id,
                    "registered_at": datetime.utcnow(),
                    "status": "confirmed"
                }
                registrations_collection.insert_one(registration_doc)
                
                # Update tournament participant count
                tournaments_collection.update_one(
                    {"tournament_id": tournament_id},
                    {"$inc": {"current_participants": 1}}
                )
                
                # Update user wallet balance (add any refund if needed)
                # For now, just track successful payment
        
        return {
            "order_id": order_id,
            "status": status_data["status"],
            "transaction_id": status_data.get("transaction_id"),
            "amount": payment["amount"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to check payment status: {str(e)}")

@app.post("/api/tournaments/{tournament_id}/register")
async def register_for_tournament(tournament_id: str, current_user: dict = Depends(get_current_user)):
    """Register for a tournament (free tournaments or with confirmed payment)"""
    tournament = tournaments_collection.find_one({"tournament_id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Check if tournament is full
    if tournament["current_participants"] >= tournament["max_participants"]:
        raise HTTPException(status_code=400, detail="Tournament is full")
    
    # Check if registration deadline passed
    if datetime.utcnow() > tournament["registration_deadline"]:
        raise HTTPException(status_code=400, detail="Registration deadline has passed")
    
    # Check if user already registered
    existing_registration = registrations_collection.find_one({
        "tournament_id": tournament_id,
        "user_id": current_user["user_id"]
    })
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this tournament")
    
    # For free tournaments (entry_fee = 0)
    if tournament["entry_fee"] == 0:
        registration_doc = {
            "registration_id": str(uuid.uuid4()),
            "tournament_id": tournament_id,
            "user_id": current_user["user_id"],
            "payment_order_id": None,
            "registered_at": datetime.utcnow(),
            "status": "confirmed"
        }
        registrations_collection.insert_one(registration_doc)
        
        # Update participant count
        tournaments_collection.update_one(
            {"tournament_id": tournament_id},
            {"$inc": {"current_participants": 1}}
        )
        
        return {"message": "Successfully registered for tournament", "registration_id": registration_doc["registration_id"]}
    else:
        # For paid tournaments, require payment first
        raise HTTPException(status_code=400, detail="Payment required for this tournament. Use /api/payments/create-qr endpoint first.")

@app.get("/api/user/tournaments")
async def get_user_tournaments(current_user: dict = Depends(get_current_user)):
    """Get user's registered tournaments"""
    # Get user's registrations
    registrations = list(registrations_collection.find({"user_id": current_user["user_id"]}))
    
    # Get tournament details for each registration
    user_tournaments = []
    for registration in registrations:
        tournament = tournaments_collection.find_one({"tournament_id": registration["tournament_id"]})
        if tournament:
            tournament.pop("_id", None)
            tournament["start_time"] = tournament["start_time"].isoformat()
            tournament["registration_deadline"] = tournament["registration_deadline"].isoformat() 
            tournament["created_at"] = tournament["created_at"].isoformat()
            tournament["updated_at"] = tournament["updated_at"].isoformat()
            tournament["registration_status"] = registration["status"]
            tournament["registered_at"] = registration["registered_at"].isoformat()
            user_tournaments.append(tournament)
    
    return {"tournaments": user_tournaments}

@app.get("/api/leaderboards")
async def get_leaderboards(
    game_type: Optional[str] = "free_fire",
    tournament_id: Optional[str] = None,
    limit: int = 50
):
    """Get leaderboards - demo data for now"""
    # Mock leaderboard data
    mock_leaderboard = [
        {
            "rank": 1,
            "user_id": "user1",
            "username": "ProGamer_FF",
            "kills": 245,
            "wins": 89,
            "points": 8750,
            "level": 65,
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        },
        {
            "rank": 2,
            "user_id": "user2", 
            "username": "FF_Champion",
            "kills": 220,
            "wins": 82,
            "points": 8200,
            "level": 72,
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        },
        # Add more mock data...
    ]
    
    # Add more mock entries
    for i in range(3, limit + 1):
        mock_leaderboard.append({
            "rank": i,
            "user_id": f"user{i}",
            "username": f"Player_{i:03d}",
            "kills": max(10, 250 - (i * 5)),
            "wins": max(5, 90 - (i * 2)),
            "points": max(100, 9000 - (i * 50)),
            "level": max(10, 70 - i),
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        })
    
    return {
        "leaderboard": mock_leaderboard[:limit],
        "game_type": game_type,
        "tournament_id": tournament_id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)