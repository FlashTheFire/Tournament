#!/usr/bin/env python3
"""
Free Fire UID Testing - Test specific UIDs mentioned in requirements
"""

import requests
import json

class FreeFrieUIDTester:
    def __init__(self):
        self.base_url = "http://localhost:8001"
        self.api_url = f"{self.base_url}/api"
        self.user_token = None

    def create_test_user(self):
        """Create a test user for UID verification"""
        user_data = {
            "email": "ffplayer@test.com",
            "password": "FFPlayer123!",
            "username": "FFTestPlayer",
            "full_name": "Free Fire Test Player"
        }
        
        response = requests.post(f"{self.api_url}/auth/register", json=user_data)
        
        if response.status_code == 200:
            self.user_token = response.json()["access_token"]
            print("✅ Test user created for FF UID testing")
            return True
        else:
            print(f"❌ Failed to create test user: {response.status_code}")
            return False

    def test_specific_uids(self):
        """Test the specific UIDs mentioned in requirements"""
        print("\n=== Testing Specific Free Fire UIDs ===")
        
        if not self.user_token:
            print("❌ No user token available")
            return
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Test UIDs from requirements
        test_uids = ["123456789", "987654321", "111111111"]  # Third one should be unknown
        
        for uid in test_uids:
            print(f"\nTesting UID: {uid}")
            
            verify_data = {"free_fire_uid": uid}
            response = requests.post(f"{self.api_url}/auth/verify-freefire", json=verify_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                user_data = data["user_data"]
                print(f"✅ UID {uid} verified successfully")
                print(f"   Username: {user_data['username']}")
                print(f"   Level: {user_data['level']}")
                print(f"   Rank: {user_data['rank']}")
                print(f"   Verified: {user_data['is_verified']}")
            else:
                print(f"❌ UID {uid} verification failed: {response.status_code}")

    def test_leaderboard_details(self):
        """Test leaderboard with different filters"""
        print("\n=== Testing Leaderboard Filters ===")
        
        # Test different game types
        game_types = ["free_fire", "bgmi", "pubg"]
        
        for game_type in game_types:
            params = {"game_type": game_type, "limit": 10}
            response = requests.get(f"{self.api_url}/leaderboards", params=params)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Leaderboard for {game_type}: {len(data['leaderboard'])} entries")
            else:
                print(f"❌ Leaderboard for {game_type} failed: {response.status_code}")

    def run_ff_tests(self):
        """Run Free Fire specific tests"""
        print("🎮 Running Free Fire Specific Tests")
        print("=" * 40)
        
        if self.create_test_user():
            self.test_specific_uids()
        
        self.test_leaderboard_details()
        
        print("\n" + "=" * 40)
        print("Free Fire tests completed")

if __name__ == "__main__":
    tester = FreeFrieUIDTester()
    tester.run_ff_tests()