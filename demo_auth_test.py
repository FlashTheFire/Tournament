#!/usr/bin/env python3
"""
Demo Authentication Test
Tests the specific demo credentials mentioned in the review request
"""

import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class DemoAuthTester:
    def __init__(self):
        # Get backend URL from frontend .env file
        frontend_env_path = "/app/frontend/.env"
        backend_url = None
        
        try:
            with open(frontend_env_path, 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        backend_url = line.split('=', 1)[1].strip()
                        break
        except FileNotFoundError:
            print("Frontend .env file not found, using default URL")
        
        self.base_url = backend_url or "http://localhost:8001"
        self.api_url = f"{self.base_url}/api"
        
        print(f"Testing backend at: {self.api_url}")

    def test_demo_user_exists(self):
        """Check if demo user exists by trying to login"""
        print("\n=== Testing Demo User Login ===")
        
        demo_credentials = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        try:
            response = requests.post(f"{self.api_url}/auth/login", json=demo_credentials, timeout=10)
            print(f"Login response status: {response.status_code}")
            print(f"Login response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Demo user login successful!")
                print(f"Access token received: {data.get('access_token', 'N/A')[:50]}...")
                return True, data.get('access_token')
            elif response.status_code == 401:
                print("❌ Demo user login failed - 401 Unauthorized")
                print("This suggests either:")
                print("  1. Demo user doesn't exist in database")
                print("  2. Password verification is failing")
                return False, None
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                return False, None
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return False, None

    def register_demo_user(self):
        """Register the demo user if it doesn't exist"""
        print("\n=== Registering Demo User ===")
        
        demo_user_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "DemoUser",
            "full_name": "Demo Tournament User",
            "free_fire_uid": "123456789"
        }
        
        try:
            response = requests.post(f"{self.api_url}/auth/register", json=demo_user_data, timeout=10)
            print(f"Registration response status: {response.status_code}")
            print(f"Registration response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Demo user registered successfully!")
                print(f"User ID: {data.get('user_id')}")
                print(f"Access token: {data.get('access_token', 'N/A')[:50]}...")
                return True, data.get('access_token')
            elif response.status_code == 400:
                print("⚠️ Demo user already exists (400 Bad Request)")
                # Try to login instead
                return self.test_demo_user_exists()
            else:
                print(f"❌ Registration failed: {response.status_code}")
                return False, None
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Registration request failed: {e}")
            return False, None

    def test_jwt_token(self, token):
        """Test JWT token by accessing protected endpoint"""
        print("\n=== Testing JWT Token ===")
        
        if not token:
            print("❌ No token to test")
            return False
        
        headers = {"Authorization": f"Bearer {token}"}
        
        try:
            response = requests.get(f"{self.api_url}/auth/me", headers=headers, timeout=10)
            print(f"Token validation response status: {response.status_code}")
            print(f"Token validation response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ JWT token is valid!")
                print(f"User info: {data.get('username')} ({data.get('email')})")
                return True
            else:
                print(f"❌ JWT token validation failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Token validation request failed: {e}")
            return False

    def check_database_users(self):
        """Try to get some info about users in database"""
        print("\n=== Checking Database State ===")
        
        # We can't directly access the database, but we can infer from API responses
        # Try registering a test user to see if database is working
        test_user = {
            "email": "test_db_check@example.com",
            "password": "testpass123",
            "username": "TestDBCheck",
            "full_name": "Test DB Check User"
        }
        
        try:
            response = requests.post(f"{self.api_url}/auth/register", json=test_user, timeout=10)
            
            if response.status_code == 200:
                print("✅ Database is accepting new users")
                # Clean up - try to login and then we know the user exists
                login_response = requests.post(f"{self.api_url}/auth/login", 
                                             json={"email": test_user["email"], "password": test_user["password"]}, 
                                             timeout=10)
                if login_response.status_code == 200:
                    print("✅ Database read/write operations working")
                return True
            else:
                print(f"⚠️ Database registration response: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Database check failed: {e}")
            return False

    def run_demo_auth_tests(self):
        """Run all demo authentication tests"""
        print("🔐 Starting Demo Authentication Tests")
        print(f"Backend URL: {self.api_url}")
        print("=" * 60)
        
        # Check database state first
        db_working = self.check_database_users()
        
        # Try to login with demo credentials
        login_success, token = self.test_demo_user_exists()
        
        if not login_success:
            print("\n🔧 Demo user doesn't exist, attempting to register...")
            register_success, token = self.register_demo_user()
            
            if register_success:
                print("\n🔄 Retrying demo login after registration...")
                login_success, token = self.test_demo_user_exists()
        
        # Test JWT token if we have one
        if token:
            jwt_success = self.test_jwt_token(token)
        else:
            jwt_success = False
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 DEMO AUTH TEST SUMMARY")
        print("=" * 60)
        print(f"Database Working: {'✅' if db_working else '❌'}")
        print(f"Demo User Login: {'✅' if login_success else '❌'}")
        print(f"JWT Token Valid: {'✅' if jwt_success else '❌'}")
        
        if login_success and jwt_success:
            print("\n🎉 AUTHENTICATION IS WORKING CORRECTLY!")
            print("The demo credentials (demo@tournament.com / demo123) are functional.")
        else:
            print("\n⚠️ AUTHENTICATION ISSUES DETECTED:")
            if not login_success:
                print("  - Demo user login is failing")
            if not jwt_success:
                print("  - JWT token generation/validation is failing")
        
        print("=" * 60)
        
        return {
            "database_working": db_working,
            "demo_login_success": login_success,
            "jwt_token_valid": jwt_success
        }

if __name__ == "__main__":
    tester = DemoAuthTester()
    results = tester.run_demo_auth_tests()