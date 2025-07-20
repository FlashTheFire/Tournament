#!/usr/bin/env python3
"""
Seed data script for Free Fire Tournament Platform
Creates realistic sample data for development and testing
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pymongo import MongoClient
from datetime import datetime, timedelta
import uuid
import random
from passlib.context import CryptContext
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/tournament_db")
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

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def clear_all_data():
    """Clear all existing data"""
    print("Clearing existing data...")
    users_collection.delete_many({})
    tournaments_collection.delete_many({})
    registrations_collection.delete_many({})
    matches_collection.delete_many({})
    payments_collection.delete_many({})
    notifications_collection.delete_many({})
    leaderboards_collection.delete_many({})
    print("✅ Data cleared")

def create_admin_user():
    """Create admin user"""
    print("Creating admin user...")
    admin_id = str(uuid.uuid4())
    admin_user = {
        "user_id": admin_id,
        "email": "admin@tournament.com",
        "username": "admin",
        "full_name": "Tournament Administrator",
        "password_hash": hash_password("admin123"),
        "free_fire_uid": "999999999",
        "wallet_balance": 10000.0,
        "is_verified": True,
        "is_admin": True,
        "free_fire_data": {
            "uid": "999999999",
            "username": "Admin_FF",
            "level": 80,
            "rank": "Heroic",
            "total_matches": 2500,
            "wins": 875,
            "kills": 18500,
            "survival_rate": "35.0%",
            "avg_damage": 2400,
            "headshot_rate": "28.5%",
            "is_verified": True
        },
        "tournament_stats": {
            "tournaments_played": 50,
            "tournaments_won": 15,
            "total_earnings": 25000.0,
            "avg_placement": 3.2,
            "skill_rating": 95.0
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    users_collection.insert_one(admin_user)
    print("✅ Admin user created: admin@tournament.com / admin123")
    return admin_id

def create_demo_user():
    """Create demo user"""
    print("Creating demo user...")
    demo_id = str(uuid.uuid4())
    demo_user = {
        "user_id": demo_id,
        "email": "demo@tournament.com",
        "username": "demo_player",
        "full_name": "Demo Player",
        "password_hash": hash_password("demo123"),
        "free_fire_uid": "123456789",
        "wallet_balance": 5000.0,
        "is_verified": True,
        "is_admin": False,
        "free_fire_data": {
            "uid": "123456789",
            "username": "DemoGamer_FF",
            "level": 65,
            "rank": "Elite",
            "total_matches": 1250,
            "wins": 342,
            "kills": 8750,
            "survival_rate": "27.4%",
            "avg_damage": 1847,
            "headshot_rate": "18.5%",
            "is_verified": True
        },
        "tournament_stats": {
            "tournaments_played": 25,
            "tournaments_won": 5,
            "total_earnings": 8500.0,
            "avg_placement": 4.8,
            "skill_rating": 78.5
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    users_collection.insert_one(demo_user)
    print("✅ Demo user created: demo@tournament.com / demo123")
    return demo_id

def create_sample_users(count=50):
    """Create sample users for realistic data"""
    print(f"Creating {count} sample users...")
    users = []
    
    # Sample names and data
    first_names = ["Arjun", "Rahul", "Priya", "Ankit", "Sneha", "Vikash", "Pooja", "Rohit", "Kajal", "Amit", 
                  "Neha", "Suresh", "Kavya", "Deepak", "Riya", "Manish", "Divya", "Rajesh", "Swati", "Karan"]
    last_names = ["Kumar", "Singh", "Sharma", "Gupta", "Verma", "Yadav", "Mishra", "Tiwari", "Chauhan", "Jain"]
    
    ff_ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Elite", "Master", "Heroic", "Grand Master"]
    
    for i in range(count):
        user_id = str(uuid.uuid4())
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        username = f"{first_name.lower()}_{random.randint(100, 999)}"
        
        # Generate realistic stats
        level = random.randint(30, 75)
        total_matches = random.randint(200, 2000)
        wins = random.randint(int(total_matches * 0.1), int(total_matches * 0.4))
        kills = random.randint(total_matches * 2, total_matches * 8)
        survival_rate = round(random.uniform(15.0, 35.0), 1)
        avg_damage = random.randint(800, 2200)
        headshot_rate = round(random.uniform(10.0, 25.0), 1)
        
        user = {
            "user_id": user_id,
            "email": f"{username}@example.com",
            "username": username,
            "full_name": f"{first_name} {last_name}",
            "password_hash": hash_password("password123"),
            "free_fire_uid": str(random.randint(100000000, 999999999)),
            "wallet_balance": round(random.uniform(0, 10000), 2),
            "is_verified": random.choice([True, True, True, False]),  # 75% verified
            "is_admin": False,
            "free_fire_data": {
                "uid": str(random.randint(100000000, 999999999)),
                "username": f"{username}_FF",
                "level": level,
                "rank": random.choice(ff_ranks),
                "total_matches": total_matches,
                "wins": wins,
                "kills": kills,
                "survival_rate": f"{survival_rate}%",
                "avg_damage": avg_damage,
                "headshot_rate": f"{headshot_rate}%",
                "is_verified": random.choice([True, False])
            },
            "tournament_stats": {
                "tournaments_played": random.randint(0, 30),
                "tournaments_won": random.randint(0, 8),
                "total_earnings": round(random.uniform(0, 15000), 2),
                "avg_placement": round(random.uniform(1.5, 8.0), 1),
                "skill_rating": round(random.uniform(30.0, 90.0), 1)
            },
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 365)),
            "updated_at": datetime.utcnow()
        }
        users.append(user)
    
    users_collection.insert_many(users)
    print(f"✅ {count} sample users created")
    return [user["user_id"] for user in users]

def create_tournaments(admin_id, user_ids):
    """Create realistic tournaments"""
    print("Creating tournaments...")
    tournaments = []
    
    tournament_names = [
        "Battle Royale Championship",
        "Elite Warriors Tournament",
        "Free Fire Clash Squad",
        "Ultimate Gaming Arena",
        "Pro Players Battle",
        "Weekend Warriors Cup",
        "Mobile Gaming Championship",
        "Fire Squad Tournament",
        "Elite Battle Royale",
        "Champions League FF",
        "Victory Royale Tournament",
        "Gaming Masters Cup",
        "Free Fire Pro League",
        "Battle Ground Championship",
        "Elite Gaming Tournament"
    ]
    
    tournament_types = ["battle_royale", "clash_squad", "single_elimination", "double_elimination"]
    modes = ["solo", "duo", "squad"]
    countries = ["India", "Global", "Asia", "SEA"]
    
    # Create mix of past, current, and future tournaments
    for i in range(30):
        tournament_id = str(uuid.uuid4())
        
        # Random timing - past, present, future
        time_offset = random.randint(-60, 60)  # Days
        start_time = datetime.utcnow() + timedelta(days=time_offset, hours=random.randint(0, 23))
        reg_deadline = start_time - timedelta(hours=random.randint(1, 48))
        
        status = "upcoming"
        if time_offset < -1:
            status = "completed"
        elif time_offset < 0:
            status = "live"
        
        entry_fee = random.choice([50, 100, 250, 500, 1000])
        max_participants = random.choice([32, 64, 100, 128])
        current_participants = 0
        if status in ["live", "completed"]:
            current_participants = random.randint(int(max_participants * 0.6), max_participants)
        elif status == "upcoming":
            current_participants = random.randint(0, int(max_participants * 0.8))
        
        tournament = {
            "tournament_id": tournament_id,
            "name": random.choice(tournament_names),
            "game_type": "free_fire",
            "tournament_type": random.choice(tournament_types),
            "entry_fee": entry_fee,
            "prize_pool": entry_fee * current_participants * 0.9,  # 90% of entry fees as prize
            "max_participants": max_participants,
            "current_participants": current_participants,
            "start_time": start_time,
            "registration_deadline": reg_deadline,
            "mode": random.choice(modes),
            "country": random.choice(countries),
            "description": f"Competitive Free Fire tournament with ₹{entry_fee * current_participants * 0.9:,.0f} prize pool",
            "status": status,
            "created_by": admin_id,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 90)),
            "updated_at": datetime.utcnow(),
            "rules": [
                "No cheating or hacking allowed",
                "Must use registered Free Fire UID",
                "Match will be played on Bermuda map",
                "Winners determined by elimination order",
                "Disputes resolved by tournament admin"
            ],
            "prizes": {
                "1st": entry_fee * current_participants * 0.5,
                "2nd": entry_fee * current_participants * 0.3,
                "3rd": entry_fee * current_participants * 0.1
            }
        }
        tournaments.append(tournament)
    
    tournaments_collection.insert_many(tournaments)
    print(f"✅ {len(tournaments)} tournaments created")
    return tournaments

def create_registrations_and_matches(tournaments, user_ids):
    """Create registrations and match results"""
    print("Creating registrations and matches...")
    
    registrations = []
    matches = []
    payments = []
    
    for tournament in tournaments:
        if tournament["current_participants"] > 0:
            # Create registrations
            registered_users = random.sample(user_ids, min(tournament["current_participants"], len(user_ids)))
            
            for user_id in registered_users:
                reg_id = str(uuid.uuid4())
                order_id = f"ORD_{tournament['tournament_id']}_{user_id}_{uuid.uuid4().hex[:8]}"
                
                registration = {
                    "registration_id": reg_id,
                    "tournament_id": tournament["tournament_id"],
                    "user_id": user_id,
                    "payment_order_id": order_id,
                    "registered_at": tournament["start_time"] - timedelta(hours=random.randint(1, 72)),
                    "status": "confirmed"
                }
                registrations.append(registration)
                
                # Create payment record
                payment = {
                    "order_id": order_id,
                    "user_id": user_id,
                    "tournament_id": tournament["tournament_id"],
                    "amount": tournament["entry_fee"],
                    "status": "success",
                    "transaction_id": f"TXN_{order_id}_{uuid.uuid4().hex[:8]}",
                    "created_at": registration["registered_at"],
                    "updated_at": registration["registered_at"]
                }
                payments.append(payment)
            
            # Create match results for completed tournaments
            if tournament["status"] == "completed":
                # Create realistic match results
                placements = list(range(1, len(registered_users) + 1))
                random.shuffle(placements)
                
                for i, user_id in enumerate(registered_users):
                    match = {
                        "match_id": str(uuid.uuid4()),
                        "tournament_id": tournament["tournament_id"],
                        "user_id": user_id,
                        "placement": placements[i],
                        "kills": random.randint(0, 15),
                        "damage": random.randint(500, 3000),
                        "survival_time": random.randint(300, 1800),  # seconds
                        "earnings": 0.0,
                        "played_at": tournament["start_time"] + timedelta(minutes=random.randint(0, 120)),
                        "updated_at": datetime.utcnow()
                    }
                    
                    # Calculate earnings for top 3
                    if placements[i] == 1:
                        match["earnings"] = tournament["prizes"]["1st"]
                    elif placements[i] == 2:
                        match["earnings"] = tournament["prizes"]["2nd"] 
                    elif placements[i] == 3:
                        match["earnings"] = tournament["prizes"]["3rd"]
                    
                    matches.append(match)
    
    if registrations:
        registrations_collection.insert_many(registrations)
        print(f"✅ {len(registrations)} registrations created")
    
    if payments:
        payments_collection.insert_many(payments)
        print(f"✅ {len(payments)} payment records created")
    
    if matches:
        matches_collection.insert_many(matches)
        print(f"✅ {len(matches)} match results created")

def create_leaderboards(user_ids):
    """Create leaderboard data"""
    print("Creating leaderboard data...")
    
    # Get all users with their tournament performance
    all_users = list(users_collection.find({"user_id": {"$in": user_ids}}))
    
    leaderboard_entries = []
    
    for user in all_users:
        # Calculate actual performance from matches
        user_matches = list(matches_collection.find({"user_id": user["user_id"]}))
        
        if user_matches:
            total_earnings = sum(match.get("earnings", 0) for match in user_matches)
            avg_placement = sum(match.get("placement", 10) for match in user_matches) / len(user_matches)
            total_kills = sum(match.get("kills", 0) for match in user_matches)
            tournaments_won = sum(1 for match in user_matches if match.get("placement") == 1)
        else:
            total_earnings = user.get("tournament_stats", {}).get("total_earnings", 0)
            avg_placement = user.get("tournament_stats", {}).get("avg_placement", 5.0)
            total_kills = user.get("free_fire_data", {}).get("kills", 0)
            tournaments_won = user.get("tournament_stats", {}).get("tournaments_won", 0)
        
        skill_rating = user.get("tournament_stats", {}).get("skill_rating", 50.0)
        
        leaderboard_entry = {
            "leaderboard_id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "rank": 0,  # Will be calculated after sorting
            "skill_rating": skill_rating,
            "total_earnings": total_earnings,
            "tournaments_played": len(user_matches),
            "tournaments_won": tournaments_won,
            "avg_placement": round(avg_placement, 1),
            "total_kills": total_kills,
            "season": "2025_Q1",
            "updated_at": datetime.utcnow()
        }
        leaderboard_entries.append(leaderboard_entry)
    
    # Sort by skill rating and assign ranks
    leaderboard_entries.sort(key=lambda x: x["skill_rating"], reverse=True)
    for i, entry in enumerate(leaderboard_entries):
        entry["rank"] = i + 1
    
    leaderboards_collection.insert_many(leaderboard_entries)
    print(f"✅ {len(leaderboard_entries)} leaderboard entries created")

def update_user_wallets():
    """Update user wallet balances based on earnings"""
    print("Updating user wallet balances...")
    
    # Get all match earnings
    pipeline = [
        {"$group": {
            "_id": "$user_id",
            "total_earnings": {"$sum": "$earnings"}
        }}
    ]
    
    earnings_by_user = {doc["_id"]: doc["total_earnings"] for doc in matches_collection.aggregate(pipeline)}
    
    # Update user wallets
    updated = 0
    for user_id, earnings in earnings_by_user.items():
        if earnings > 0:
            users_collection.update_one(
                {"user_id": user_id},
                {"$inc": {"wallet_balance": earnings}}
            )
            updated += 1
    
    print(f"✅ Updated wallet balances for {updated} users")

def main():
    """Main function to seed the database"""
    print("🚀 Starting database seeding...")
    print("=" * 50)
    
    try:
        # Clear existing data
        clear_all_data()
        
        # Create users
        admin_id = create_admin_user()
        demo_id = create_demo_user()
        user_ids = create_sample_users(50)
        all_user_ids = [admin_id, demo_id] + user_ids
        
        # Create tournaments
        tournaments = create_tournaments(admin_id, all_user_ids)
        
        # Create registrations and matches
        create_registrations_and_matches(tournaments, all_user_ids)
        
        # Create leaderboards
        create_leaderboards(all_user_ids)
        
        # Update user wallets
        update_user_wallets()
        
        print("=" * 50)
        print("✅ Database seeding completed successfully!")
        print("\n🔑 Login Credentials:")
        print("Admin: admin@tournament.com / admin123")
        print("Demo:  demo@tournament.com / demo123")
        print(f"\n📊 Data Summary:")
        print(f"Users: {users_collection.count_documents({})}")
        print(f"Tournaments: {tournaments_collection.count_documents({})}")
        print(f"Registrations: {registrations_collection.count_documents({})}")
        print(f"Matches: {matches_collection.count_documents({})}")
        print(f"Payments: {payments_collection.count_documents({})}")
        print(f"Leaderboard Entries: {leaderboards_collection.count_documents({})}")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        raise

if __name__ == "__main__":
    main()