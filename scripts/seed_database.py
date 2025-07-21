#!/usr/bin/env python3
"""
Database Seeder Script for Tournament Platform
Populates MongoDB with realistic tournament, user, and leaderboard data
"""

import os
import sys
import asyncio
from datetime import datetime, timedelta
import random
import uuid
from dotenv import load_dotenv
from pymongo import MongoClient
from passlib.context import CryptContext
import json

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

# Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    print("Error: MONGO_URL not found in environment variables")
    sys.exit(1)

# MongoDB connection
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

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Sample data
REAL_TOURNAMENT_DATA = [
    {
        "name": "Free Fire World Championship 2025",
        "game_type": "free_fire",
        "tournament_type": "battle_royale",
        "entry_fee": 500.0,
        "prize_pool": 150000.0,
        "max_participants": 200,
        "current_participants": 187,
        "mode": "squad",
        "country": "India",
        "description": "The ultimate Free Fire championship with the biggest prize pool of the year",
        "status": "live",
        "battle_map": "Bermuda Remastered"
    },
    {
        "name": "Clash Squad Masters Pro",
        "game_type": "free_fire", 
        "tournament_type": "clash_squad",
        "entry_fee": 250.0,
        "prize_pool": 75000.0,
        "max_participants": 128,
        "current_participants": 124,
        "mode": "squad",
        "country": "India",
        "description": "Elite Clash Squad tournament for the most skilled players",
        "status": "live",
        "battle_map": "Purgatory"
    },
    {
        "name": "Elite Battle Royale Weekly",
        "game_type": "free_fire",
        "tournament_type": "battle_royale", 
        "entry_fee": 150.0,
        "prize_pool": 25000.0,
        "max_participants": 100,
        "current_participants": 89,
        "mode": "solo",
        "country": "India",
        "description": "Weekly tournament for solo battle royale champions",
        "status": "upcoming",
        "battle_map": "Kalahari"
    },
    {
        "name": "Free Fire Legends Cup",
        "game_type": "free_fire",
        "tournament_type": "battle_royale",
        "entry_fee": 300.0,
        "prize_pool": 100000.0,
        "max_participants": 150,
        "current_participants": 143,
        "mode": "duo",
        "country": "India", 
        "description": "Legendary tournament for duo teams with massive rewards",
        "status": "upcoming",
        "battle_map": "Alps"
    },
    {
        "name": "Booyah Championship",
        "game_type": "free_fire",
        "tournament_type": "battle_royale",
        "entry_fee": 100.0,
        "prize_pool": 50000.0,
        "max_participants": 80,
        "current_participants": 76,
        "mode": "squad",
        "country": "India",
        "description": "Squad-based championship with exciting gameplay",
        "status": "upcoming",
        "battle_map": "Bermuda"
    },
    {
        "name": "Pro Gaming Arena",
        "game_type": "free_fire",
        "tournament_type": "clash_squad",
        "entry_fee": 200.0,
        "prize_pool": 60000.0,
        "max_participants": 64,
        "current_participants": 58,
        "mode": "squad",
        "country": "India",
        "description": "Intense Clash Squad battles for professional gamers",
        "status": "live",
        "battle_map": "Clash Arena"
    },
    {
        "name": "Headshot Masters",
        "game_type": "free_fire",
        "tournament_type": "battle_royale",
        "entry_fee": 75.0,
        "prize_pool": 15000.0,
        "max_participants": 60,
        "current_participants": 48,
        "mode": "solo",
        "country": "India",
        "description": "Solo tournament focusing on precision and skill",
        "status": "upcoming",
        "battle_map": "Kalahari"
    },
    {
        "name": "Squad Domination", 
        "game_type": "free_fire",
        "tournament_type": "battle_royale",
        "entry_fee": 400.0,
        "prize_pool": 125000.0,
        "max_participants": 120,
        "current_participants": 112,
        "mode": "squad",
        "country": "India",
        "description": "Premium squad tournament with high-stakes gameplay",
        "status": "live",
        "battle_map": "Bermuda Remastered"
    }
]

REAL_USERS_DATA = [
    {
        "email": "demo@tournament.com",
        "username": "DemoAdmin",
        "full_name": "Tournament Admin",
        "password": "demo123", 
        "is_admin": True,
        "wallet_balance": 5000.0,
        "free_fire_uid": "123456789",
        "free_fire_data": {
            "uid": "123456789",
            "username": "ProGamer_FF", 
            "level": 75,
            "rank": "Grandmaster",
            "total_matches": 2500,
            "wins": 875,
            "kills": 18750,
            "survival_rate": "35.0%",
            "avg_damage": 2156,
            "headshot_rate": "24.5%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    },
    {
        "email": "elite.warrior@freefire.com",
        "username": "FF_LEGEND_2025",
        "full_name": "Arjun Singh",
        "password": "player123",
        "is_admin": False,
        "wallet_balance": 2500.0,
        "free_fire_uid": "987654321",
        "free_fire_data": {
            "uid": "987654321",
            "username": "FF_LEGEND_2025",
            "level": 72,
            "rank": "Heroic", 
            "total_matches": 2100,
            "wins": 756,
            "kills": 16800,
            "survival_rate": "36.0%",
            "avg_damage": 2089,
            "headshot_rate": "23.8%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    },
    {
        "email": "booyah.master@freefire.com",
        "username": "BOOYAH_MASTER",
        "full_name": "Rohit Kumar",
        "password": "player123",
        "is_admin": False,
        "wallet_balance": 1800.0,
        "free_fire_uid": "456789123",
        "free_fire_data": {
            "uid": "456789123",
            "username": "BOOYAH_MASTER",
            "level": 68,
            "rank": "Heroic",
            "total_matches": 1850,
            "wins": 629,
            "kills": 14200,
            "survival_rate": "34.0%",
            "avg_damage": 1987,
            "headshot_rate": "22.1%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    },
    {
        "email": "headshot.king@freefire.com",
        "username": "HEADSHOT_KING",
        "full_name": "Vikas Sharma",
        "password": "player123",
        "is_admin": False,
        "wallet_balance": 1500.0,
        "free_fire_uid": "789123456", 
        "free_fire_data": {
            "uid": "789123456",
            "username": "HEADSHOT_KING",
            "level": 65,
            "rank": "Elite",
            "total_matches": 1600,
            "wins": 512,
            "kills": 12800,
            "survival_rate": "32.0%",
            "avg_damage": 1876,
            "headshot_rate": "26.5%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    },
    {
        "email": "elite.sniper@freefire.com",
        "username": "ELITE_SNIPER",
        "full_name": "Amit Patel",
        "password": "player123",
        "is_admin": False,
        "wallet_balance": 1200.0,
        "free_fire_uid": "321654987",
        "free_fire_data": {
            "uid": "321654987", 
            "username": "ELITE_SNIPER",
            "level": 62,
            "rank": "Elite",
            "total_matches": 1400,
            "wins": 434,
            "kills": 11200,
            "survival_rate": "31.0%",
            "avg_damage": 1798,
            "headshot_rate": "25.2%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    }
]

REAL_LEADERBOARD_DATA = [
    {
        "rank": 1,
        "user_id": None,  # Will be filled with actual user_id
        "username": "FF_LEGEND_2025",
        "full_name": "Arjun Singh",
        "skill_rating": 95.2,
        "total_earnings": 85000.0,
        "tournaments_played": 45,
        "tournaments_won": 18,
        "avg_placement": 2.3,
        "total_kills": 16800,
        "points": 24500,
        "wins": 756,
        "kills": 16800,
        "level": 72
    },
    {
        "rank": 2,
        "user_id": None,
        "username": "BOOYAH_MASTER", 
        "full_name": "Rohit Kumar",
        "skill_rating": 92.8,
        "total_earnings": 68000.0,
        "tournaments_played": 42,
        "tournaments_won": 15,
        "avg_placement": 2.8,
        "total_kills": 14200,
        "points": 23800,
        "wins": 629,
        "kills": 14200,
        "level": 68
    },
    {
        "rank": 3,
        "user_id": None,
        "username": "HEADSHOT_KING",
        "full_name": "Vikas Sharma", 
        "skill_rating": 89.4,
        "total_earnings": 52000.0,
        "tournaments_played": 38,
        "tournaments_won": 12,
        "avg_placement": 3.2,
        "total_kills": 12800,
        "points": 22950,
        "wins": 512,
        "kills": 12800,
        "level": 65
    },
    {
        "rank": 4,
        "user_id": None,
        "username": "ELITE_SNIPER",
        "full_name": "Amit Patel",
        "skill_rating": 86.1,
        "total_earnings": 41000.0,
        "tournaments_played": 35,
        "tournaments_won": 9,
        "avg_placement": 3.8,
        "total_kills": 11200,
        "points": 22100,
        "wins": 434,
        "kills": 11200,
        "level": 62
    },
    {
        "rank": 5,
        "user_id": None,
        "username": "SQUAD_LEADER",
        "full_name": "Priya Verma",
        "skill_rating": 83.7,
        "total_earnings": 36000.0,
        "tournaments_played": 32,
        "tournaments_won": 8,
        "avg_placement": 4.1,
        "total_kills": 9800,
        "points": 21650,
        "wins": 392,
        "kills": 9800,
        "level": 58
    }
]

AI_PREDICTIONS_DATA = [
    {
        "id": "ai-1",
        "type": "matchmaking",
        "title": "Perfect Match Found",
        "prediction": "AI has identified optimal opponents with 96% skill compatibility for intense competition",
        "confidence": 96,
        "action": "Start Elite Battle",
        "gradient": "from-cyan-500 to-blue-600",
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=2)
    },
    {
        "id": "ai-2",
        "type": "performance",
        "title": "Victory Prediction High",
        "prediction": "Based on recent performance data, you have an 84% chance of winning your next tournament",
        "confidence": 84,
        "action": "View Strategy Guide",
        "gradient": "from-green-500 to-emerald-600",
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=4)
    },
    {
        "id": "ai-3",
        "type": "tournament",
        "title": "Premium Tournament Alert",
        "prediction": "High-prize tournament (₹150K pool) registrations open - Perfect match for your skill level",
        "confidence": 100,
        "action": "Register Now",
        "gradient": "from-yellow-500 to-orange-600",
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=6)
    }
]

def clear_database():
    """Clear existing data"""
    print("🗑️  Clearing existing database data...")
    users_collection.delete_many({})
    tournaments_collection.delete_many({})
    registrations_collection.delete_many({})
    matches_collection.delete_many({})
    payments_collection.delete_many({})
    notifications_collection.delete_many({})
    leaderboards_collection.delete_many({})
    print("✅ Database cleared successfully")

def seed_users():
    """Seed real users including admin account"""
    print("👥 Seeding users...")
    
    inserted_users = {}
    
    for user_data in REAL_USERS_DATA:
        user_id = str(uuid.uuid4())
        
        user_doc = {
            "user_id": user_id,
            "email": user_data["email"],
            "username": user_data["username"], 
            "full_name": user_data["full_name"],
            "password_hash": hash_password(user_data["password"]),
            "free_fire_uid": user_data["free_fire_uid"],
            "free_fire_data": user_data["free_fire_data"],
            "wallet_balance": user_data["wallet_balance"],
            "is_verified": True,
            "is_admin": user_data["is_admin"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        users_collection.insert_one(user_doc)
        inserted_users[user_data["username"]] = user_id
        
        print(f"  ✅ Created user: {user_data['username']} ({'Admin' if user_data['is_admin'] else 'Player'})")
    
    # Create additional players for leaderboard
    for i in range(6, 21):  # Create users for ranks 6-20
        user_id = str(uuid.uuid4())
        skill_rating = 80 - (i-5) * 2.5
        
        user_doc = {
            "user_id": user_id,
            "email": f"player{i}@freefire.com",
            "username": f"PLAYER_{i:02d}",
            "full_name": f"Player {i}",
            "password_hash": hash_password("player123"),
            "free_fire_uid": f"{100000000 + i}",
            "free_fire_data": {
                "uid": f"{100000000 + i}",
                "username": f"PLAYER_{i:02d}",
                "level": 60 - i,
                "rank": "Elite" if i < 10 else "Master",
                "total_matches": 1000 + i * 50,
                "wins": 300 + i * 15,
                "kills": 8000 + i * 200,
                "survival_rate": f"{28 - i * 0.5:.1f}%",
                "avg_damage": 1600 - i * 30,
                "headshot_rate": f"{20 - i * 0.3:.1f}%",
                "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                "is_verified": True
            },
            "wallet_balance": 1000 - i * 20,
            "is_verified": True,
            "is_admin": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        users_collection.insert_one(user_doc)
        inserted_users[f"PLAYER_{i:02d}"] = user_id
    
    print(f"✅ Created {len(inserted_users)} users total")
    return inserted_users

def seed_tournaments():
    """Seed real tournaments"""
    print("🏆 Seeding tournaments...")
    
    inserted_tournaments = []
    
    for i, tournament_data in enumerate(REAL_TOURNAMENT_DATA):
        tournament_id = str(uuid.uuid4())
        
        # Set realistic start times
        if tournament_data["status"] == "live":
            start_time = datetime.utcnow() - timedelta(hours=random.randint(1, 6))
            registration_deadline = start_time - timedelta(hours=1)
        elif tournament_data["status"] == "upcoming":
            start_time = datetime.utcnow() + timedelta(hours=random.randint(2, 48))
            registration_deadline = start_time - timedelta(hours=2)
        else:  # completed
            start_time = datetime.utcnow() - timedelta(days=random.randint(1, 30))
            registration_deadline = start_time - timedelta(hours=2)
            
        tournament_doc = {
            "tournament_id": tournament_id,
            "name": tournament_data["name"],
            "game_type": tournament_data["game_type"],
            "tournament_type": tournament_data["tournament_type"],
            "entry_fee": tournament_data["entry_fee"],
            "prize_pool": tournament_data["prize_pool"],
            "max_participants": tournament_data["max_participants"],
            "current_participants": tournament_data["current_participants"],
            "start_time": start_time,
            "registration_deadline": registration_deadline,
            "mode": tournament_data["mode"],
            "country": tournament_data["country"],
            "description": tournament_data["description"],
            "status": tournament_data["status"],
            "battle_map": tournament_data["battle_map"],
            "created_by": "system",
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 7)),
            "updated_at": datetime.utcnow()
        }
        
        tournaments_collection.insert_one(tournament_doc)
        inserted_tournaments.append(tournament_id)
        
        print(f"  ✅ Created tournament: {tournament_data['name']} ({tournament_data['status']})")
    
    print(f"✅ Created {len(inserted_tournaments)} tournaments")
    return inserted_tournaments

def seed_leaderboard(inserted_users):
    """Seed real leaderboard data"""
    print("🏅 Seeding leaderboard...")
    
    # Update leaderboard data with actual user IDs
    for entry in REAL_LEADERBOARD_DATA:
        if entry["username"] in inserted_users:
            entry["user_id"] = inserted_users[entry["username"]]
    
    # Add remaining leaderboard entries for additional users
    for i in range(6, 21):
        username = f"PLAYER_{i:02d}"
        if username in inserted_users:
            skill_rating = 80 - (i-5) * 2.5
            REAL_LEADERBOARD_DATA.append({
                "rank": i,
                "user_id": inserted_users[username],
                "username": username,
                "full_name": f"Player {i}",
                "skill_rating": skill_rating,
                "total_earnings": max(0, 30000 - i * 1500),
                "tournaments_played": max(5, 35 - i),
                "tournaments_won": max(0, 10 - i // 2),
                "avg_placement": 2.5 + i * 0.2,
                "total_kills": max(1000, 8000 - i * 200),
                "points": max(1000, 21000 - i * 400),
                "wins": max(50, 300 - i * 10),
                "kills": max(1000, 8000 - i * 200),
                "level": max(30, 60 - i)
            })
    
    # Insert leaderboard data
    leaderboard_docs = []
    for entry in REAL_LEADERBOARD_DATA:
        if entry["user_id"]:  # Only insert if we have a valid user_id
            leaderboard_doc = {
                **entry,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            leaderboard_docs.append(leaderboard_doc)
    
    if leaderboard_docs:
        leaderboards_collection.insert_many(leaderboard_docs)
        print(f"✅ Created {len(leaderboard_docs)} leaderboard entries")
    
    return len(leaderboard_docs)

def seed_registrations_and_matches(inserted_users, inserted_tournaments):
    """Seed tournament registrations and match results"""
    print("📝 Seeding registrations and matches...")
    
    registration_count = 0
    match_count = 0
    
    # Register top players in tournaments
    top_players = list(inserted_users.values())[:10]
    
    for tournament_id in inserted_tournaments:
        tournament = tournaments_collection.find_one({"tournament_id": tournament_id})
        if not tournament:
            continue
            
        # Register random players for this tournament
        participants_needed = tournament["current_participants"]
        registered_players = random.sample(top_players, min(participants_needed, len(top_players)))
        
        for user_id in registered_players:
            registration_doc = {
                "registration_id": str(uuid.uuid4()),
                "tournament_id": tournament_id,
                "user_id": user_id,
                "registration_date": tournament["created_at"] + timedelta(hours=random.randint(1, 48)),
                "payment_status": "completed",
                "team_members": [],
                "status": "confirmed"
            }
            
            registrations_collection.insert_one(registration_doc)
            registration_count += 1
            
            # Create match results for completed tournaments
            if tournament["status"] == "completed":
                match_doc = {
                    "match_id": str(uuid.uuid4()),
                    "tournament_id": tournament_id,
                    "user_id": user_id,
                    "placement": random.randint(1, participants_needed),
                    "kills": random.randint(0, 15),
                    "damage_dealt": random.randint(800, 2500),
                    "survival_time": random.randint(60, 1800),
                    "earnings": random.uniform(0, tournament["prize_pool"] * 0.1),
                    "match_date": tournament["start_time"] + timedelta(hours=2),
                    "created_at": datetime.utcnow()
                }
                
                matches_collection.insert_one(match_doc)
                match_count += 1
    
    print(f"✅ Created {registration_count} registrations and {match_count} match results")
    return registration_count, match_count

def seed_ai_predictions():
    """Seed AI predictions data"""
    print("🤖 Seeding AI predictions...")
    
    # Create a collection for AI predictions if it doesn't exist
    ai_predictions_collection = db.ai_predictions
    ai_predictions_collection.delete_many({})  # Clear existing
    
    prediction_docs = []
    for prediction_data in AI_PREDICTIONS_DATA:
        prediction_doc = {
            **prediction_data,
            "prediction_id": str(uuid.uuid4()),
            "is_active": True
        }
        prediction_docs.append(prediction_doc)
    
    ai_predictions_collection.insert_many(prediction_docs)
    print(f"✅ Created {len(prediction_docs)} AI predictions")
    return len(prediction_docs)

def update_live_stats():
    """Update live stats based on actual data"""
    print("📊 Updating live stats...")
    
    stats_collection = db.live_stats
    stats_collection.delete_many({})  # Clear existing
    
    # Calculate real stats from database
    total_tournaments = tournaments_collection.count_documents({})
    active_tournaments = tournaments_collection.count_documents({"status": "live"})
    total_users = users_collection.count_documents({})
    total_registrations = registrations_collection.count_documents({})
    
    # Calculate prize pool
    total_prize_pool = 0
    for tournament in tournaments_collection.find({}):
        total_prize_pool += tournament.get("prize_pool", 0)
    
    live_stats_doc = {
        "stats_id": "global_stats",
        "total_tournaments": total_tournaments,
        "active_tournaments": active_tournaments,
        "total_users": total_users,
        "total_registrations": total_registrations,
        "total_prize_pool": total_prize_pool,
        "live_matches": active_tournaments,
        "active_players": total_users,
        "updated_at": datetime.utcnow()
    }
    
    stats_collection.insert_one(live_stats_doc)
    print(f"✅ Updated live stats: {total_tournaments} tournaments, ₹{total_prize_pool:,.0f} prize pool")

def main():
    """Main seeding function"""
    print("🚀 Starting database seeding...")
    print("="*60)
    
    try:
        # Clear existing data
        clear_database()
        
        # Seed data in order
        inserted_users = seed_users()
        inserted_tournaments = seed_tournaments()
        leaderboard_count = seed_leaderboard(inserted_users)
        registration_count, match_count = seed_registrations_and_matches(inserted_users, inserted_tournaments)
        prediction_count = seed_ai_predictions()
        update_live_stats()
        
        print("="*60)
        print("🎉 Database seeding completed successfully!")
        print(f"📊 Summary:")
        print(f"   - Users: {len(inserted_users)}")
        print(f"   - Tournaments: {len(inserted_tournaments)}")
        print(f"   - Leaderboard entries: {leaderboard_count}")
        print(f"   - Registrations: {registration_count}")
        print(f"   - Match results: {match_count}")
        print(f"   - AI predictions: {prediction_count}")
        print()
        print("🔐 Admin Account:")
        print("   Email: demo@tournament.com")
        print("   Password: demo123")
        print("   Status: Admin with full privileges")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)