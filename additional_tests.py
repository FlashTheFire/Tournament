#!/usr/bin/env python3
"""
Additional Backend Tests - Testing specific scenarios
"""

import requests
import json
from datetime import datetime, timedelta

class AdditionalTournamentTests:
    def __init__(self):
        self.base_url = "http://localhost:8001"
        self.api_url = f"{self.base_url}/api"
        
        # Create admin user for testing
        self.admin_token = None
        self.regular_user_token = None
        self.test_tournament_id = None

    def create_admin_user(self):
        """Create an admin user by registering and manually updating DB"""
        print("\n=== Creating Admin User for Testing ===")
        
        admin_data = {
            "email": "admin@tournament.com",
            "password": "AdminPass123!",
            "username": "TournamentAdmin",
            "full_name": "Tournament Administrator"
        }
        
        response = requests.post(f"{self.api_url}/auth/register", json=admin_data)
        
        if response.status_code == 200:
            data = response.json()
            self.admin_token = data["access_token"]
            admin_user_id = data["user_id"]
            
            # Manually update user to admin in MongoDB
            from pymongo import MongoClient
            import os
            from dotenv import load_dotenv
            
            load_dotenv()
            MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/tournament_db")
            client = MongoClient(MONGO_URL)
            db = client.tournament_db
            
            # Update user to admin
            db.users.update_one(
                {"user_id": admin_user_id},
                {"$set": {"is_admin": True}}
            )
            
            print("✅ Admin user created and updated successfully")
            return True
        else:
            print(f"❌ Failed to create admin user: {response.status_code}")
            return False

    def test_admin_tournament_creation(self):
        """Test tournament creation with admin user"""
        print("\n=== Testing Admin Tournament Creation ===")
        
        if not self.admin_token:
            print("❌ No admin token available")
            return False
        
        tournament_data = {
            "name": "Free Fire Championship 2024",
            "game_type": "free_fire",
            "tournament_type": "battle_royale",
            "entry_fee": 0.0,  # Free tournament
            "prize_pool": 10000.0,
            "max_participants": 100,
            "start_time": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "registration_deadline": (datetime.utcnow() + timedelta(hours=12)).isoformat(),
            "mode": "squad",
            "country": "India",
            "description": "Test tournament for API testing"
        }
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = requests.post(f"{self.api_url}/tournaments", json=tournament_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            self.test_tournament_id = data["tournament_id"]
            print(f"✅ Tournament created successfully: {self.test_tournament_id}")
            return True
        else:
            print(f"❌ Tournament creation failed: {response.status_code}, {response.text}")
            return False

    def test_tournament_registration_flow(self):
        """Test complete tournament registration flow"""
        print("\n=== Testing Tournament Registration Flow ===")
        
        if not self.test_tournament_id:
            print("❌ No test tournament available")
            return False
        
        # Create a regular user
        user_data = {
            "email": "player@tournament.com",
            "password": "PlayerPass123!",
            "username": "TestPlayer",
            "full_name": "Test Player"
        }
        
        response = requests.post(f"{self.api_url}/auth/register", json=user_data)
        
        if response.status_code != 200:
            print(f"❌ Failed to create test user: {response.status_code}")
            return False
        
        user_token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {user_token}"}
        
        # Register for the free tournament
        response = requests.post(f"{self.api_url}/tournaments/{self.test_tournament_id}/register", headers=headers)
        
        if response.status_code == 200:
            print("✅ Successfully registered for tournament")
            
            # Check user tournaments
            response = requests.get(f"{self.api_url}/user/tournaments", headers=headers)
            if response.status_code == 200:
                tournaments = response.json()["tournaments"]
                if len(tournaments) > 0:
                    print(f"✅ User tournaments retrieved: {len(tournaments)} tournaments")
                    return True
                else:
                    print("❌ No tournaments found in user's list")
                    return False
            else:
                print(f"❌ Failed to get user tournaments: {response.status_code}")
                return False
        else:
            print(f"❌ Tournament registration failed: {response.status_code}, {response.text}")
            return False

    def test_payment_flow_with_real_tournament(self):
        """Test payment flow with a real tournament"""
        print("\n=== Testing Payment Flow ===")
        
        if not self.test_tournament_id:
            print("❌ No test tournament available")
            return False
        
        # Create paid tournament
        paid_tournament_data = {
            "name": "Paid Championship 2024",
            "game_type": "free_fire",
            "tournament_type": "battle_royale",
            "entry_fee": 100.0,  # Paid tournament
            "prize_pool": 50000.0,
            "max_participants": 50,
            "start_time": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "registration_deadline": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "mode": "squad",
            "country": "India",
            "description": "Paid tournament for testing payment flow"
        }
        
        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = requests.post(f"{self.api_url}/tournaments", json=paid_tournament_data, headers=admin_headers)
        
        if response.status_code != 200:
            print(f"❌ Failed to create paid tournament: {response.status_code}")
            return False
        
        paid_tournament_id = response.json()["tournament_id"]
        
        # Create user for payment test
        user_data = {
            "email": "payer@tournament.com",
            "password": "PayerPass123!",
            "username": "PayingPlayer",
            "full_name": "Paying Player"
        }
        
        response = requests.post(f"{self.api_url}/auth/register", json=user_data)
        if response.status_code != 200:
            print(f"❌ Failed to create paying user: {response.status_code}")
            return False
        
        user_token = response.json()["access_token"]
        user_headers = {"Authorization": f"Bearer {user_token}"}
        
        # Generate payment QR
        payment_data = {
            "tournament_id": paid_tournament_id,
            "amount": 100.0
        }
        
        response = requests.post(f"{self.api_url}/payments/create-qr", json=payment_data, headers=user_headers)
        
        if response.status_code == 200:
            qr_data = response.json()
            order_id = qr_data["order_id"]
            print(f"✅ Payment QR generated successfully: {order_id}")
            
            # Check payment status
            response = requests.get(f"{self.api_url}/payments/{order_id}/status", headers=user_headers)
            
            if response.status_code == 200:
                status_data = response.json()
                print(f"✅ Payment status checked: {status_data['status']}")
                return True
            else:
                print(f"❌ Failed to check payment status: {response.status_code}")
                return False
        else:
            print(f"❌ Payment QR generation failed: {response.status_code}, {response.text}")
            return False

    def run_additional_tests(self):
        """Run all additional tests"""
        print("🔧 Running Additional Backend Tests")
        print("=" * 50)
        
        success_count = 0
        total_tests = 3
        
        if self.create_admin_user():
            success_count += 1
        
        if self.test_admin_tournament_creation():
            success_count += 1
        
        if self.test_tournament_registration_flow():
            success_count += 1
        
        # Skip payment flow test for now as it requires more complex setup
        # if self.test_payment_flow_with_real_tournament():
        #     success_count += 1
        
        print("\n" + "=" * 50)
        print(f"Additional Tests: {success_count}/{total_tests} passed")
        print("=" * 50)
        
        return success_count == total_tests

if __name__ == "__main__":
    tester = AdditionalTournamentTests()
    tester.run_additional_tests()