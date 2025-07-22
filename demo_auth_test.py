#!/usr/bin/env python3
"""
Specific Authentication Testing for Demo Credentials
Tests the exact credentials mentioned in the review request
"""

import requests
import json
from typing import Dict, Any

class DemoAuthTester:
    def __init__(self):
        self.base_url = "https://1513f77a-90a1-48d4-a136-cea7b92934d9.preview.emergentagent.com"
        self.api_url = f"{self.base_url}/api"
        
        print(f"Testing demo authentication at: {self.api_url}")
        
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

    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
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

    def test_backend_health(self):
        """Test backend health check on port 8001"""
        print("\n=== 1. Backend Health Check ===")
        
        response, success, error = self.make_request("GET", "/health")
        
        if not success:
            self.log_result("Backend Health Check", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_result("Backend Health Check", True, f"Backend running properly - {data}")
                else:
                    self.log_result("Backend Health Check", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Backend Health Check", False, "Invalid JSON response")
        else:
            self.log_result("Backend Health Check", False, f"Status code: {response.status_code}")

    def test_database_connection(self):
        """Test MongoDB connection by checking if we can retrieve tournaments"""
        print("\n=== 2. Database Connection Test ===")
        
        response, success, error = self.make_request("GET", "/tournaments")
        
        if not success:
            self.log_result("Database Connection", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    tournament_count = len(data["tournaments"])
                    self.log_result("Database Connection", True, f"MongoDB connected - {tournament_count} tournaments found")
                else:
                    self.log_result("Database Connection", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Database Connection", False, "Invalid JSON response")
        else:
            self.log_result("Database Connection", False, f"Status code: {response.status_code}")

    def test_demo_user_registration(self):
        """Register demo user if not exists"""
        print("\n=== 3. Demo User Registration ===")
        
        # Try to register demo user
        demo_user_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "DemoUser",
            "full_name": "Demo Tournament User",
            "free_fire_uid": "123456789"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", demo_user_data)
        
        if not success:
            self.log_result("Demo User Registration", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    self.log_result("Demo User Registration", True, "Demo user registered successfully")
                    return data["access_token"]
                else:
                    self.log_result("Demo User Registration", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo User Registration", False, "Invalid JSON response")
        elif response.status_code == 400:
            # User already exists, which is fine
            self.log_result("Demo User Registration", True, "Demo user already exists")
        else:
            self.log_result("Demo User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_demo_user_login(self):
        """Test demo user login with demo@tournament.com / demo123"""
        print("\n=== 4. Demo User Authentication ===")
        
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
                    self.log_result("Demo User Login", True, f"Demo credentials work perfectly - User ID: {data.get('user_id', 'N/A')}")
                    return data["access_token"]
                else:
                    self.log_result("Demo User Login", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo User Login", False, "Invalid JSON response")
        else:
            self.log_result("Demo User Login", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_admin_user_registration(self):
        """Register admin user if not exists"""
        print("\n=== 5. Admin User Registration ===")
        
        # Try to register admin user
        admin_user_data = {
            "email": "admin@tournament.com",
            "password": "admin123",
            "username": "AdminUser",
            "full_name": "Admin Tournament User",
            "free_fire_uid": "987654321"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", admin_user_data)
        
        if not success:
            self.log_result("Admin User Registration", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    self.log_result("Admin User Registration", True, "Admin user registered successfully")
                    return data["access_token"]
                else:
                    self.log_result("Admin User Registration", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin User Registration", False, "Invalid JSON response")
        elif response.status_code == 400:
            # User already exists, which is fine
            self.log_result("Admin User Registration", True, "Admin user already exists")
        else:
            self.log_result("Admin User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_admin_user_login(self):
        """Test admin user login with admin@tournament.com / admin123"""
        print("\n=== 6. Admin User Authentication ===")
        
        admin_login_data = {
            "email": "admin@tournament.com",
            "password": "admin123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", admin_login_data)
        
        if not success:
            self.log_result("Admin User Login", False, f"Request failed: {error}")
            return None
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    self.log_result("Admin User Login", True, f"Admin credentials work perfectly - User ID: {data.get('user_id', 'N/A')}")
                    return data["access_token"]
                else:
                    self.log_result("Admin User Login", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin User Login", False, "Invalid JSON response")
        else:
            self.log_result("Admin User Login", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_user_verification_in_database(self, token: str):
        """Test if demo user exists in database with correct credentials"""
        print("\n=== 7. User Verification in Database ===")
        
        if not token:
            self.log_result("User Database Verification", False, "No auth token available")
            return
        
        headers = {"Authorization": f"Bearer {token}"}
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("User Database Verification", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "user_id" in data and "email" in data:
                    email = data["email"]
                    username = data.get("username", "N/A")
                    is_verified = data.get("is_verified", False)
                    self.log_result("User Database Verification", True, f"User exists in DB - Email: {email}, Username: {username}, Verified: {is_verified}")
                else:
                    self.log_result("User Database Verification", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("User Database Verification", False, "Invalid JSON response")
        else:
            self.log_result("User Database Verification", False, f"Status code: {response.status_code}")

    def run_demo_authentication_tests(self):
        """Run all demo authentication tests"""
        print("🔐 Starting Demo Authentication System Testing")
        print("Testing specific credentials requested in review:")
        print("- Demo: demo@tournament.com / demo123")
        print("- Admin: admin@tournament.com / admin123")
        print("=" * 60)
        
        # Test sequence
        self.test_backend_health()
        self.test_database_connection()
        
        # Register and test demo user
        self.test_demo_user_registration()
        demo_token = self.test_demo_user_login()
        if demo_token:
            self.test_user_verification_in_database(demo_token)
        
        # Register and test admin user
        self.test_admin_user_registration()
        admin_token = self.test_admin_user_login()
        if admin_token:
            self.test_user_verification_in_database(admin_token)
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 DEMO AUTHENTICATION TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']} ✅")
        print(f"Failed: {self.results['failed']} ❌")
        print(f"Success Rate: {(self.results['passed']/self.results['total_tests']*100):.1f}%")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        print("\n" + "=" * 60)
        
        return self.results

if __name__ == "__main__":
    tester = DemoAuthTester()
    results = tester.run_demo_authentication_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)