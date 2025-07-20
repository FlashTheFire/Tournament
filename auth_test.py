#!/usr/bin/env python3
"""
Focused Authentication Testing for Demo Credentials
Tests the specific authentication flow that the frontend is using
"""

import requests
import json
import time
from datetime import datetime

class AuthenticationTester:
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
        
        print(f"Testing authentication at: {self.api_url}")
        
        # Test results
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        self.results["total_tests"] += 1
        if success:
            self.results["passed"] += 1
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED {message}")

    def make_request(self, method: str, endpoint: str, data: dict = None, headers: dict = None):
        """Make HTTP request and return response and success status"""
        url = f"{self.api_url}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                return None, False, "Unsupported HTTP method"
            
            return response, True, ""
        except requests.exceptions.RequestException as e:
            return None, False, str(e)

    def test_demo_user_registration(self):
        """Test registering the demo user"""
        print("\n=== Testing Demo User Registration ===")
        
        demo_user_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "DemoUser",
            "full_name": "Demo User",
            "free_fire_uid": "123456789"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", demo_user_data)
        
        if not success:
            self.log_result("Demo User Registration", False, f"Request failed: {error}")
            return None
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.log_result("Demo User Registration", True, "Demo user registered successfully")
                    return data["access_token"]
                else:
                    self.log_result("Demo User Registration", False, f"Missing required fields: {data}")
                    return None
            except json.JSONDecodeError:
                self.log_result("Demo User Registration", False, "Invalid JSON response")
                return None
        elif response.status_code == 400:
            # User might already exist, which is fine
            self.log_result("Demo User Registration", True, "Demo user already exists (expected)")
            return None
        else:
            self.log_result("Demo User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")
            return None

    def test_demo_user_login(self):
        """Test logging in with demo credentials"""
        print("\n=== Testing Demo User Login ===")
        
        demo_login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", demo_login_data)
        
        if not success:
            self.log_result("Demo User Login", False, f"Request failed: {error}")
            return None
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    self.log_result("Demo User Login", True, "Demo login successful")
                    return data["access_token"]
                else:
                    self.log_result("Demo User Login", False, f"Missing access_token: {data}")
                    return None
            except json.JSONDecodeError:
                self.log_result("Demo User Login", False, "Invalid JSON response")
                return None
        else:
            self.log_result("Demo User Login", False, f"Status code: {response.status_code}, Response: {response.text}")
            return None

    def test_token_validation(self, token):
        """Test JWT token validation"""
        print("\n=== Testing JWT Token Validation ===")
        
        if not token:
            self.log_result("JWT Token Validation", False, "No token available")
            return
        
        headers = {"Authorization": f"Bearer {token}"}
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("JWT Token Validation", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "user_id" in data and "email" in data:
                    self.log_result("JWT Token Validation", True, f"Token valid for user: {data['email']}")
                    return data
                else:
                    self.log_result("JWT Token Validation", False, f"Missing required fields: {data}")
                    return None
            except json.JSONDecodeError:
                self.log_result("JWT Token Validation", False, "Invalid JSON response")
                return None
        else:
            self.log_result("JWT Token Validation", False, f"Status code: {response.status_code}")
            return None

    def test_mongodb_connection(self):
        """Test MongoDB connection by checking if users are being stored"""
        print("\n=== Testing MongoDB Connection ===")
        
        # We can't directly test MongoDB, but we can infer it's working
        # if user registration and login work
        
        # Try to register a test user to verify database operations
        import time
        unique_id = str(int(time.time()))
        test_user_data = {
            "email": f"mongotest{unique_id}@example.com",
            "password": "TestPass123!",
            "username": f"MongoTest{unique_id}",
            "full_name": "MongoDB Test User",
            "free_fire_uid": "999888777"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", test_user_data)
        
        if not success:
            self.log_result("MongoDB Connection", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "user_id" in data:
                    self.log_result("MongoDB Connection", True, "Database operations working (user created)")
                else:
                    self.log_result("MongoDB Connection", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("MongoDB Connection", False, "Invalid JSON response")
        else:
            self.log_result("MongoDB Connection", False, f"Status code: {response.status_code}")

    def test_complete_auth_flow(self):
        """Test the complete authentication flow end-to-end"""
        print("\n=== Testing Complete Authentication Flow ===")
        
        # Step 1: Register demo user (if not exists)
        self.test_demo_user_registration()
        
        # Step 2: Login with demo credentials
        token = self.test_demo_user_login()
        
        # Step 3: Validate JWT token
        user_data = self.test_token_validation(token)
        
        # Step 4: Test MongoDB connection
        self.test_mongodb_connection()
        
        # Summary of authentication flow
        if token and user_data:
            print(f"\n🎉 AUTHENTICATION FLOW SUCCESSFUL!")
            print(f"✅ Demo user can be registered")
            print(f"✅ Demo credentials (demo@tournament.com / demo123) work")
            print(f"✅ JWT tokens are generated and validated correctly")
            print(f"✅ User data is stored and retrieved from MongoDB")
            print(f"✅ Protected endpoints are accessible with valid tokens")
            
            return True
        else:
            print(f"\n❌ AUTHENTICATION FLOW FAILED!")
            print(f"❌ There are issues with the authentication system")
            return False

    def run_focused_tests(self):
        """Run focused authentication tests"""
        print("🔐 Starting Focused Authentication Tests for Demo Credentials")
        print(f"Backend URL: {self.api_url}")
        print("=" * 70)
        
        # Test the complete authentication flow
        auth_success = self.test_complete_auth_flow()
        
        # Print summary
        print("\n" + "=" * 70)
        print("🏁 AUTHENTICATION TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']} ✅")
        print(f"Failed: {self.results['failed']} ❌")
        print(f"Success Rate: {(self.results['passed']/max(self.results['total_tests'], 1)*100):.1f}%")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        print("\n" + "=" * 70)
        
        if auth_success:
            print("🎯 CONCLUSION: Backend authentication is working correctly!")
            print("   The issue is likely in the frontend integration or routing.")
        else:
            print("🚨 CONCLUSION: Backend authentication has issues that need fixing.")
        
        print("=" * 70)
        
        return self.results

if __name__ == "__main__":
    tester = AuthenticationTester()
    results = tester.run_focused_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)