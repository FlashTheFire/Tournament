#!/usr/bin/env python3
"""
Database seeding script for Free Fire Tournament Platform
Creates comprehensive real data for all collections
"""

from pymongo import MongoClient
from datetime import datetime, timedelta
import uuid
import random
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/tournament_db")
client = MongoClient(MONGO_URL)
db = client.tournament_db

# Collections
users_collection = db.users
tournaments_collection = db.tournaments
leaderboards_collection = db.leaderboards
transactions_collection = db.transactions

def clear_collections():
    """Clear existing data"""
    print("🧹 Clearing existing collections...")
    users_collection.delete_many({})
    tournaments_collection.delete_many({})
    leaderboards_collection.delete_many({})
    transactions_collection.delete_many({})
    print("✅ Collections cleared!")

def seed_tournaments():
    """Create realistic tournament data"""
    print("🏆 Seeding tournaments...")
    
    tournament_names = [
        "Free Fire World Championship 2025",
        "Clash Squad Masters Pro",
        "Battle Royale Elite Cup",
        "Rush Hour Speed Tournament", 
        "Lone Wolf Challenge",
        "Squad Supremacy Battle",
        "Desert Storm Championship",
        "Purgatory Legends Cup",
        "Bermuda Masters League",
        "Kalahari Combat Series",
        "Alpine Warriors Tournament",
        "Nextera Future Cup",
        "Elite Squad Showdown",
        "Victory Royale Championship",
        "Free Fire India League",
        "Global Gaming Championship",
        "Battle Arena Pro Series",
        "Combat Legends Cup",
        "Warrior Elite Tournament",
        "Free Fire Battle Fest"
    ]
    
    game_types = ["battle_royale", "clash_squad", "rush_hour", "lone_wolf"]
    modes = ["solo", "duo", "squad"]
    countries = ["IN", "BR", "ID", "TH", "MY", "SG", "VN", "PK", "BD"]
    statuses = ["upcoming", "live", "completed"]
    
    tournaments = []
    for i, name in enumerate(tournament_names):
        tournament_id = str(uuid.uuid4())
        
        # Random tournament properties
        entry_fee = random.choice([50, 100, 150, 200, 250, 300, 500, 750, 1000])
        max_participants = random.choice([32, 64, 100, 128, 200, 256])
        current_participants = random.randint(int(max_participants * 0.3), max_participants)
        
        # Time calculations
        start_offset = random.randint(-7, 30)  # Some past, some future
        start_time = datetime.utcnow() + timedelta(days=start_offset, hours=random.randint(0, 23))
        reg_deadline = start_time - timedelta(hours=2)
        
        # Status based on time
        if start_time < datetime.utcnow():
            if start_time > datetime.utcnow() - timedelta(hours=3):
                status = "live"
            else:
                status = "completed"
        else:
            status = "upcoming"
        
        tournament = {
            "tournament_id": tournament_id,
            "name": name,
            "description": f"Elite {random.choice(['Battle Royale', 'Clash Squad', 'Combat'])} tournament with massive prizes and professional competition.",
            "game_type": random.choice(game_types),
            "tournament_type": random.choice(["elimination", "league", "speed"]),
            "entry_fee": entry_fee,
            "prize_pool": entry_fee * current_participants * random.uniform(0.8, 1.2),
            "max_participants": max_participants,
            "current_participants": current_participants,
            "start_time": start_time,
            "registration_deadline": reg_deadline,
            "mode": random.choice(modes),
            "country": random.choice(countries),
            "status": status,
            "participants": [str(uuid.uuid4()) for _ in range(current_participants)],
            "battle_map": random.choice([
                "Bermuda Remastered", "Purgatory", "Kalahari", 
                "Alpine", "Nextera", "Desert Storm"
            ]),
            "created_by": "admin",
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            "updated_at": datetime.utcnow()
        }
        tournaments.append(tournament)
    
    tournaments_collection.insert_many(tournaments)
    print(f"✅ Created {len(tournaments)} tournaments!")

def seed_users_and_leaderboard():
    """Create realistic user and leaderboard data"""
    print("👥 Seeding users and leaderboard...")
    
    usernames = [
        "FF_LEGEND_2025", "BOOYAH_MASTER", "HEADSHOT_KING", "ELITE_WARRIOR",
        "COMBAT_PRO", "BATTLE_CHAMPION", "SQUAD_LEADER", "VICTORY_HUNTER",
        "FIRE_STORM", "ALPHA_GAMER", "RUSH_MASTER", "CLUTCH_HERO",
        "SNIPER_ELITE", "BATTLE_BEAST", "GAMING_LEGEND", "FF_DOMINATOR",
        "ARENA_KING", "CLASH_MASTER", "ELITE_SNIPER", "BATTLE_FURY",
        "COMBAT_GENIUS", "SQUAD_ACE", "VICTORY_SEEKER", "GAME_CHANGER",
        "FIRE_POWER", "ELITE_FORCE", "BATTLE_STORM", "CHAMPION_X",
        "LEGEND_KILLER", "ARENA_BEAST", "GAMING_GOD", "FF_PHANTOM",
        "BATTLE_HAWK", "ELITE_SHADOW", "VICTORY_BLADE", "COMBAT_STORM",
        "SQUAD_PHANTOM", "LEGEND_SLAYER", "ARENA_WOLF", "GAMING_TITAN"
    ]
    
    regions = ["IND", "BR", "ID", "TH", "MY", "SG"]
    
    users = []
    leaderboard_entries = []
    
    for i, username in enumerate(usernames):
        user_id = str(uuid.uuid4())
        
        # User stats
        tournaments_joined = random.randint(5, 50)
        tournaments_won = random.randint(0, tournaments_joined // 3)
        total_winnings = tournaments_won * random.randint(500, 5000)
        kills_total = random.randint(100, 2000)
        matches_played = random.randint(50, 500)
        win_rate = (tournaments_won / tournaments_joined * 100) if tournaments_joined > 0 else 0
        
        user = {
            "user_id": user_id,
            "email": f"{username.lower()}@example.com",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGBzPZa4S8zZ.k.",  # "password123"
            "free_fire_uid": str(random.randint(1000000000, 9999999999)),
            "region": random.choice(regions),
            "username": username,
            "nickname": username,
            "level": random.randint(30, 80),
            "avatar_id": str(random.randint(102000001, 102000020)),
            "liked": random.randint(1000, 50000),
            "exp": random.randint(50000, 999999),
            "clan_name": random.choice([
                "ELITE SQUAD", "LEGEND KILLERS", "ALPHA WARRIORS", "BATTLE MASTERS",
                "FIRE STORM", "VICTORY HUNTERS", "CLASH TITANS", "COMBAT HEROES",
                "No Guild"
            ]),
            "clan_level": random.randint(1, 15),
            "wallet_balance": random.randint(500, 50000),
            "is_admin": i == 0,  # First user is admin
            "is_verified": True,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 365)),
            "updated_at": datetime.utcnow(),
            "last_login": datetime.utcnow() - timedelta(hours=random.randint(1, 72)),
            "stats": {
                "tournaments_joined": tournaments_joined,
                "tournaments_won": tournaments_won,
                "total_winnings": total_winnings,
                "kills_total": kills_total,
                "matches_played": matches_played,
                "win_rate": round(win_rate, 1),
                "average_rank": random.randint(5, 25)
            }
        }
        users.append(user)
        
        # Leaderboard entry
        points = tournaments_won * 100 + kills_total + random.randint(0, 1000)
        leaderboard = {
            "user_id": user_id,
            "username": username,
            "points": points,
            "rank": 0,  # Will be calculated after insertion
            "level": user["level"],
            "wins": tournaments_won,
            "kills": kills_total,
            "avatar": f"https://freefireinfo.vercel.app/icon?id={user['avatar_id']}",
            "created_at": user["created_at"],
            "updated_at": datetime.utcnow()
        }
        leaderboard_entries.append(leaderboard)
    
    # Insert users
    users_collection.insert_many(users)
    
    # Sort leaderboard by points and assign ranks
    leaderboard_entries.sort(key=lambda x: x["points"], reverse=True)
    for i, entry in enumerate(leaderboard_entries):
        entry["rank"] = i + 1
    
    leaderboards_collection.insert_many(leaderboard_entries)
    print(f"✅ Created {len(users)} users and leaderboard entries!")

def seed_transactions():
    """Create realistic transaction data"""
    print("💰 Seeding transactions...")
    
    users = list(users_collection.find({}, {"user_id": 1, "username": 1}))
    
    transaction_types = [
        ("credit", "prize", "🏆 Victory Prize - Tournament Championship"),
        ("credit", "bonus", "🎁 Daily Login Bonus"),
        ("credit", "topup", "💎 Battle Funds Added via UPI"),
        ("credit", "referral", "🤝 Referral Bonus - Friend Joined"),
        ("debit", "entry", "⚔️ Tournament Entry Fee"),
        ("debit", "purchase", "🛒 Battle Pass Premium"),
        ("debit", "entry", "🔥 Elite Tournament Registration"),
    ]
    
    transactions = []
    for user in users:
        # Generate 5-15 transactions per user
        num_transactions = random.randint(5, 15)
        
        for _ in range(num_transactions):
            transaction_type, category, base_description = random.choice(transaction_types)
            
            # Amount based on transaction type
            if category == "prize":
                amount = random.randint(500, 10000)
            elif category == "topup":
                amount = random.choice([100, 250, 500, 1000, 2000, 5000])
            elif category == "entry":
                amount = random.randint(50, 500)
            elif category == "bonus":
                amount = random.randint(50, 200)
            else:
                amount = random.randint(100, 1000)
            
            transaction = {
                "transaction_id": str(uuid.uuid4()),
                "user_id": user["user_id"],
                "type": transaction_type,
                "amount": amount,
                "description": base_description,
                "category": category,
                "status": "completed",
                "payment_method": random.choice(["UPI", "Wallet", "Card"]) if transaction_type == "credit" else "Wallet",
                "created_at": datetime.utcnow() - timedelta(days=random.randint(0, 60))
            }
            transactions.append(transaction)
    
    transactions_collection.insert_many(transactions)
    print(f"✅ Created {len(transactions)} transactions!")

def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    clear_collections()
    
    # Seed data
    seed_tournaments()
    seed_users_and_leaderboard()
    seed_transactions()
    
    # Create indexes
    print("📊 Creating database indexes...")
    users_collection.create_index("email", unique=True)
    users_collection.create_index("free_fire_uid", unique=True)
    users_collection.create_index("username", unique=True)
    tournaments_collection.create_index("tournament_id", unique=True)
    leaderboards_collection.create_index("user_id")
    leaderboards_collection.create_index("points")
    transactions_collection.create_index("user_id")
    
    print("✅ Database seeding completed!")
    print(f"📊 Summary:")
    print(f"   - Users: {users_collection.count_documents({})}")
    print(f"   - Tournaments: {tournaments_collection.count_documents({})}")
    print(f"   - Leaderboard Entries: {leaderboards_collection.count_documents({})}")
    print(f"   - Transactions: {transactions_collection.count_documents({})}")

if __name__ == "__main__":
    main()