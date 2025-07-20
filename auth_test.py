#!/usr/bin/env python3
"""
Focused Authentication Testing for Tournament Platform
Tests authentication endpoints specifically as requested in the review
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

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

    def test_demo_user_registration(self):
        """Test registering the demo user"""
        print("\n=== Testing Demo User Registration ===")
        
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
            return None
        
        print(f"Registration Response Status: {response.status_code}")
        print(f"Registration Response Body: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.log_result("Demo User Registration", True, "Demo user registered successfully")
                    return data["access_token"]
                else:
                    self.log_result("Demo User Registration", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo User Registration", False, "Invalid JSON response")
        elif response.status_code == 400:
            # User might already exist, which is fine
            self.log_result("Demo User Registration", True, "Demo user already exists (expected)")
        else:
            self.log_result("Demo User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_demo_credentials_login(self):
        """Test login with demo credentials (demo@tournament.com / demo123)"""
        print("\n=== Testing Demo Credentials Login ===")
        
        login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", login_data)
        
        if not success:
            self.log_result("Demo Credentials Login", False, f"Request failed: {error}")
            return None
        
        print(f"Login Response Status: {response.status_code}")
        print(f"Login Response Body: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    self.log_result("Demo Credentials Login", True, "Demo login successful")
                    return data["access_token"]
                else:
                    self.log_result("Demo Credentials Login", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo Credentials Login", False, "Invalid JSON response")
        else:
            self.log_result("Demo Credentials Login", False, f"Status code: {response.status_code}, Response: {response.text}")
        
        return None

    def test_invalid_credentials(self):
        """Test login with invalid credentials to see error response format"""
        print("\n=== Testing Invalid Credentials ===")
        
        invalid_credentials = [
            {
                "name": "Wrong Email",
                "data": {"email": "nonexistent@tournament.com", "password": "demo123"}
            },
            {
                "name": "Wrong Password", 
                "data": {"email": "demo@tournament.com", "password": "wrongpassword"}
            },
            {
                "name": "Both Wrong",
                "data": {"email": "wrong@email.com", "password": "wrongpass"}
            },
            {
                "name": "Empty Email",
                "data": {"email": "", "password": "demo123"}
            },
            {
                "name": "Empty Password",
                "data": {"email": "demo@tournament.com", "password": ""}
            }
        ]
        
        for test_case in invalid_credentials:
            print(f"\n--- Testing {test_case['name']} ---")
            response, success, error = self.make_request("POST", "/auth/login", test_case['data'])
            
            if not success:
                self.log_result(f"Invalid Credentials - {test_case['name']}", False, f"Request failed: {error}")
                continue
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            print(f"Response Body: {response.text}")
            
            # Check if it's a proper error response
            if response.status_code == 401:
                try:
                    error_data = response.json()
                    print(f"Error Response Structure: {json.dumps(error_data, indent=2)}")
                    self.log_result(f"Invalid Credentials - {test_case['name']}", True, f"Correct 401 response: {error_data}")
                except json.JSONDecodeError:
                    self.log_result(f"Invalid Credentials - {test_case['name']}", False, "401 but invalid JSON response")
            elif response.status_code == 422:
                try:
                    validation_error = response.json()
                    print(f"Validation Error Structure: {json.dumps(validation_error, indent=2)}")
                    self.log_result(f"Invalid Credentials - {test_case['name']}", True, f"Validation error (422): {validation_error}")
                except json.JSONDecodeError:
                    self.log_result(f"Invalid Credentials - {test_case['name']}", False, "422 but invalid JSON response")
            else:
                self.log_result(f"Invalid Credentials - {test_case['name']}", False, f"Expected 401/422, got {response.status_code}")

    def test_token_validation(self, token: str):
        """Test JWT token validation with /auth/me endpoint"""
        print("\n=== Testing Token Validation ===")
        
        if not token:
            self.log_result("Token Validation", False, "No token available for testing")
            return
        
        headers = {"Authorization": f"Bearer {token}"}
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("Token Validation", False, f"Request failed: {error}")
            return
        
        print(f"Token Validation Status: {response.status_code}")
        print(f"Token Validation Response: {response.text}")
        
        if response.status_code == 200:
            try:
                user_data = response.json()
                if "user_id" in user_data and "email" in user_data:
                    self.log_result("Token Validation", True, f"Token valid, user: {user_data.get('username', 'Unknown')}")
                    print(f"User Data Structure: {json.dumps(user_data, indent=2)}")
                else:
                    self.log_result("Token Validation", False, f"Missing required user fields: {user_data}")
            except json.JSONDecodeError:
                self.log_result("Token Validation", False, "Invalid JSON response")
        else:
            self.log_result("Token Validation", False, f"Status code: {response.status_code}")

    def test_invalid_token_scenarios(self):
        """Test various invalid token scenarios"""
        print("\n=== Testing Invalid Token Scenarios ===")
        
        invalid_token_tests = [
            {
                "name": "No Authorization Header",
                "headers": {}
            },
            {
                "name": "Empty Bearer Token",
                "headers": {"Authorization": "Bearer "}
            },
            {
                "name": "Invalid Token Format",
                "headers": {"Authorization": "Bearer invalid_token_here"}
            },
            {
                "name": "Malformed Authorization Header",
                "headers": {"Authorization": "InvalidFormat token_here"}
            },
            {
                "name": "Expired Token (Mock)",
                "headers": {"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjAwMDAwMDAwfQ.invalid"}
            }
        ]
        
        for test_case in invalid_token_tests:
            print(f"\n--- Testing {test_case['name']} ---")
            response, success, error = self.make_request("GET", "/auth/me", headers=test_case['headers'])
            
            if not success:
                self.log_result(f"Invalid Token - {test_case['name']}", False, f"Request failed: {error}")
                continue
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            if response.status_code in [401, 403]:
                try:
                    error_data = response.json()
                    print(f"Error Response Structure: {json.dumps(error_data, indent=2)}")
                    self.log_result(f"Invalid Token - {test_case['name']}", True, f"Correct error response: {error_data}")
                except json.JSONDecodeError:
                    self.log_result(f"Invalid Token - {test_case['name']}", True, f"Correct status {response.status_code} but no JSON")
            else:
                self.log_result(f"Invalid Token - {test_case['name']}", False, f"Expected 401/403, got {response.status_code}")

    def check_demo_user_in_database(self):
        """Check if demo user exists by attempting login"""
        print("\n=== Checking Demo User Existence ===")
        
        # Try to login to see if user exists
        login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", login_data)
        
        if not success:
            self.log_result("Demo User Existence Check", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            self.log_result("Demo User Existence Check", True, "Demo user exists and can login")
            return True
        elif response.status_code == 401:
            self.log_result("Demo User Existence Check", False, "Demo user does not exist or wrong credentials")
            return False
        else:
            self.log_result("Demo User Existence Check", False, f"Unexpected status: {response.status_code}")
            return False

    def test_error_response_structure(self):
        """Test the exact error response structure that might be causing React errors"""
        print("\n=== Testing Error Response Structure ===")
        
        # Test various endpoints that should return errors
        error_tests = [
            {
                "name": "Login with Invalid JSON",
                "method": "POST",
                "endpoint": "/auth/login",
                "data": {"invalid": "data"}
            },
            {
                "name": "Registration with Missing Fields",
                "method": "POST", 
                "endpoint": "/auth/register",
                "data": {"email": "test@test.com"}  # Missing required fields
            },
            {
                "name": "Protected Endpoint Without Auth",
                "method": "GET",
                "endpoint": "/auth/me",
                "data": None
            }
        ]
        
        for test in error_tests:
            print(f"\n--- Testing {test['name']} ---")
            response, success, error = self.make_request(test['method'], test['endpoint'], test['data'])
            
            if not success:
                print(f"Request failed: {error}")
                continue
            
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'Not specified')}")
            print(f"Response Body: {response.text}")
            
            # Check if response is valid JSON
            try:
                error_data = response.json()
                print(f"Parsed JSON Structure: {json.dumps(error_data, indent=2)}")
                
                # Check for FastAPI validation error structure
                if "detail" in error_data:
                    print(f"FastAPI Error Detail: {error_data['detail']}")
                    if isinstance(error_data['detail'], list):
                        print("This is a FastAPI validation error with list format")
                        for detail_item in error_data['detail']:
                            if isinstance(detail_item, dict):
                                print(f"  - Field: {detail_item.get('loc', 'unknown')}")
                                print(f"  - Message: {detail_item.get('msg', 'no message')}")
                                print(f"  - Type: {detail_item.get('type', 'no type')}")
                
            except json.JSONDecodeError:
                print("Response is not valid JSON - this could cause React errors!")
                self.log_result(f"Error Structure - {test['name']}", False, "Non-JSON error response")
                continue
            
            self.log_result(f"Error Structure - {test['name']}", True, f"Valid JSON error response with status {response.status_code}")

    def run_authentication_tests(self):
        """Run all authentication-focused tests"""
        print("🔐 Starting Authentication-Focused Backend Testing")
        print(f"Backend URL: {self.api_url}")
        print("=" * 60)
        
        # First, check if demo user exists
        demo_exists = self.check_demo_user_in_database()
        
        # If demo user doesn't exist, try to register it
        demo_token = None
        if not demo_exists:
            demo_token = self.test_demo_user_registration()
        
        # Test demo credentials login
        if not demo_token:
            demo_token = self.test_demo_credentials_login()
        
        # Test invalid credentials and error formats
        self.test_invalid_credentials()
        
        # Test token validation if we have a token
        if demo_token:
            self.test_token_validation(demo_token)
        
        # Test invalid token scenarios
        self.test_invalid_token_scenarios()
        
        # Test error response structures
        self.test_error_response_structure()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 AUTHENTICATION TEST SUMMARY")
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
    tester = AuthenticationTester()
    results = tester.run_authentication_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)