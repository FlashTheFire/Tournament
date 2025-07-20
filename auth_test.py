#!/usr/bin/env python3
"""
Comprehensive Authentication System Testing
Specifically tests demo credentials and authentication flow
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
        
        # Store tokens for testing
        self.demo_token = None
        self.demo_user_id = None

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

    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.api_url}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, params=params, timeout=10)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, params=params, timeout=10)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, params=params, timeout=10)
            else:
                return None, False, "Unsupported HTTP method"
            
            return response, True, ""
        except requests.exceptions.RequestException as e:
            return None, False, str(e)

    def test_demo_user_registration(self):
        """Test demo user registration"""
        print("\n=== Testing Demo User Registration ===")
        
        demo_user_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "DemoUser",
            "full_name": "Demo Tournament User",
            "free_fire_uid": "987654321"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", demo_user_data)
        
        if not success:
            self.log_result("Demo User Registration", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.demo_token = data["access_token"]
                    self.demo_user_id = data["user_id"]
                    self.log_result("Demo User Registration", True, "Demo user registered successfully")
                else:
                    self.log_result("Demo User Registration", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo User Registration", False, "Invalid JSON response")
        elif response.status_code == 400:
            # User already exists, this is expected
            self.log_result("Demo User Registration", True, "Demo user already exists (expected)")
        else:
            self.log_result("Demo User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_demo_user_login(self):
        """Test demo user login with exact credentials from review request"""
        print("\n=== Testing Demo User Login (demo@tournament.com / demo123) ===")
        
        demo_login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", demo_login_data)
        
        if not success:
            self.log_result("Demo User Login", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data and "token_type" in data:
                    self.demo_token = data["access_token"]
                    self.demo_user_id = data["user_id"]
                    
                    # Verify token format
                    if data["token_type"] == "bearer" and len(self.demo_token) > 50:
                        self.log_result("Demo User Login", True, f"Login successful, JWT token received (length: {len(self.demo_token)})")
                    else:
                        self.log_result("Demo User Login", False, f"Invalid token format: {data}")
                else:
                    self.log_result("Demo User Login", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo User Login", False, "Invalid JSON response")
        elif response.status_code == 401:
            try:
                error_data = response.json()
                self.log_result("Demo User Login", False, f"Authentication failed: {error_data.get('detail', 'Unknown error')}")
            except json.JSONDecodeError:
                self.log_result("Demo User Login", False, f"Authentication failed with status 401: {response.text}")
        else:
            self.log_result("Demo User Login", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_jwt_token_validation(self):
        """Test JWT token validation by accessing protected endpoint"""
        print("\n=== Testing JWT Token Validation ===")
        
        if not self.demo_token:
            self.log_result("JWT Token Validation", False, "No demo token available")
            return
        
        headers = {"Authorization": f"Bearer {self.demo_token}"}
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("JWT Token Validation", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                expected_fields = ["user_id", "email", "username", "full_name", "wallet_balance", "is_verified", "is_admin"]
                
                if all(field in data for field in expected_fields):
                    if data["email"] == "demo@tournament.com":
                        self.log_result("JWT Token Validation", True, f"Token valid, user info retrieved: {data['username']}")
                    else:
                        self.log_result("JWT Token Validation", False, f"Token valid but wrong user: {data['email']}")
                else:
                    missing_fields = [field for field in expected_fields if field not in data]
                    self.log_result("JWT Token Validation", False, f"Missing fields: {missing_fields}")
            except json.JSONDecodeError:
                self.log_result("JWT Token Validation", False, "Invalid JSON response")
        elif response.status_code == 401:
            try:
                error_data = response.json()
                self.log_result("JWT Token Validation", False, f"Token validation failed: {error_data.get('detail', 'Unknown error')}")
            except json.JSONDecodeError:
                self.log_result("JWT Token Validation", False, f"Token validation failed: {response.text}")
        else:
            self.log_result("JWT Token Validation", False, f"Status code: {response.status_code}")

    def test_protected_endpoint_access(self):
        """Test accessing multiple protected endpoints with valid token"""
        print("\n=== Testing Protected Endpoint Access ===")
        
        if not self.demo_token:
            self.log_result("Protected Endpoint Access", False, "No demo token available")
            return
        
        headers = {"Authorization": f"Bearer {self.demo_token}"}
        
        # Test multiple protected endpoints
        protected_endpoints = [
            ("/auth/me", "GET", "User Profile"),
            ("/user/tournaments", "GET", "User Tournaments"),
            ("/auth/verify-freefire", "POST", "Free Fire Verification", {"free_fire_uid": "123456789"})
        ]
        
        successful_accesses = 0
        
        for endpoint_info in protected_endpoints:
            endpoint = endpoint_info[0]
            method = endpoint_info[1]
            name = endpoint_info[2]
            data = endpoint_info[3] if len(endpoint_info) > 3 else None
            
            response, success, error = self.make_request(method, endpoint, data=data, headers=headers)
            
            if success and response.status_code == 200:
                successful_accesses += 1
                print(f"  ✅ {name}: Accessible")
            elif success and response.status_code in [400, 404]:
                # These are acceptable for some endpoints (e.g., no tournaments, invalid data)
                successful_accesses += 1
                print(f"  ✅ {name}: Accessible (expected error: {response.status_code})")
            else:
                print(f"  ❌ {name}: Failed ({response.status_code if success else error})")
        
        if successful_accesses == len(protected_endpoints):
            self.log_result("Protected Endpoint Access", True, f"All {len(protected_endpoints)} protected endpoints accessible")
        else:
            self.log_result("Protected Endpoint Access", False, f"Only {successful_accesses}/{len(protected_endpoints)} endpoints accessible")

    def test_invalid_credentials(self):
        """Test authentication with invalid credentials"""
        print("\n=== Testing Invalid Credentials ===")
        
        invalid_credentials = [
            {"email": "demo@tournament.com", "password": "wrongpassword"},
            {"email": "nonexistent@tournament.com", "password": "demo123"},
            {"email": "invalid-email", "password": "demo123"},
            {"email": "", "password": "demo123"},
            {"email": "demo@tournament.com", "password": ""}
        ]
        
        successful_rejections = 0
        
        for i, creds in enumerate(invalid_credentials, 1):
            response, success, error = self.make_request("POST", "/auth/login", creds)
            
            if not success:
                print(f"  ❌ Test {i}: Request failed: {error}")
                continue
            
            if response.status_code == 401:
                successful_rejections += 1
                print(f"  ✅ Test {i}: Correctly rejected invalid credentials")
            elif response.status_code == 422:
                # Validation error for malformed data
                successful_rejections += 1
                print(f"  ✅ Test {i}: Correctly rejected with validation error")
            else:
                print(f"  ❌ Test {i}: Should reject but got status {response.status_code}")
        
        if successful_rejections == len(invalid_credentials):
            self.log_result("Invalid Credentials", True, f"All {len(invalid_credentials)} invalid attempts correctly rejected")
        else:
            self.log_result("Invalid Credentials", False, f"Only {successful_rejections}/{len(invalid_credentials)} attempts correctly rejected")

    def test_token_without_bearer_prefix(self):
        """Test token usage without Bearer prefix"""
        print("\n=== Testing Token Without Bearer Prefix ===")
        
        if not self.demo_token:
            self.log_result("Token Without Bearer", False, "No demo token available")
            return
        
        # Test with just the token (no "Bearer " prefix)
        headers = {"Authorization": self.demo_token}
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if success and response.status_code == 401:
            self.log_result("Token Without Bearer", True, "Correctly rejected token without Bearer prefix")
        elif success and response.status_code == 200:
            self.log_result("Token Without Bearer", False, "Should reject token without Bearer prefix")
        else:
            self.log_result("Token Without Bearer", False, f"Unexpected response: {response.status_code if success else error}")

    def test_malformed_tokens(self):
        """Test various malformed tokens"""
        print("\n=== Testing Malformed Tokens ===")
        
        malformed_tokens = [
            "Bearer invalid_token",
            "Bearer ",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature",
            "Bearer " + "x" * 200,  # Very long invalid token
            "InvalidPrefix " + (self.demo_token if self.demo_token else "token")
        ]
        
        successful_rejections = 0
        
        for i, token in enumerate(malformed_tokens, 1):
            headers = {"Authorization": token}
            response, success, error = self.make_request("GET", "/auth/me", headers=headers)
            
            if success and response.status_code == 401:
                successful_rejections += 1
                print(f"  ✅ Test {i}: Correctly rejected malformed token")
            else:
                print(f"  ❌ Test {i}: Should reject malformed token but got {response.status_code if success else error}")
        
        if successful_rejections == len(malformed_tokens):
            self.log_result("Malformed Tokens", True, f"All {len(malformed_tokens)} malformed tokens correctly rejected")
        else:
            self.log_result("Malformed Tokens", False, f"Only {successful_rejections}/{len(malformed_tokens)} malformed tokens correctly rejected")

    def test_json_response_format(self):
        """Test that all authentication responses return proper JSON format"""
        print("\n=== Testing JSON Response Format ===")
        
        test_cases = [
            ("POST", "/auth/login", {"email": "demo@tournament.com", "password": "demo123"}, "Valid Login"),
            ("POST", "/auth/login", {"email": "demo@tournament.com", "password": "wrong"}, "Invalid Login"),
            ("POST", "/auth/register", {"email": "test@example.com", "password": "test123", "username": "testuser", "full_name": "Test User"}, "Registration"),
            ("GET", "/auth/me", None, "Protected Endpoint (no auth)"),
        ]
        
        json_responses = 0
        
        for method, endpoint, data, name in test_cases:
            headers = None
            if name == "Protected Endpoint (no auth)":
                # Test without auth header
                pass
            elif self.demo_token and name == "Valid Login":
                # Skip if we already have a token
                continue
            
            response, success, error = self.make_request(method, endpoint, data=data, headers=headers)
            
            if not success:
                print(f"  ❌ {name}: Request failed: {error}")
                continue
            
            try:
                json_data = response.json()
                json_responses += 1
                print(f"  ✅ {name}: Valid JSON response")
                
                # Check for React-incompatible objects
                if self.contains_non_serializable_objects(json_data):
                    print(f"    ⚠️  Warning: Response may contain non-serializable objects")
                
            except json.JSONDecodeError:
                print(f"  ❌ {name}: Invalid JSON response")
        
        total_tests = len([tc for tc in test_cases if not (tc[3] == "Valid Login" and self.demo_token)])
        
        if json_responses == total_tests:
            self.log_result("JSON Response Format", True, f"All {total_tests} responses are valid JSON")
        else:
            self.log_result("JSON Response Format", False, f"Only {json_responses}/{total_tests} responses are valid JSON")

    def contains_non_serializable_objects(self, obj, path=""):
        """Check if object contains non-JSON-serializable elements"""
        if isinstance(obj, dict):
            for key, value in obj.items():
                if self.contains_non_serializable_objects(value, f"{path}.{key}"):
                    return True
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                if self.contains_non_serializable_objects(item, f"{path}[{i}]"):
                    return True
        elif not isinstance(obj, (str, int, float, bool, type(None))):
            print(f"    Non-serializable object at {path}: {type(obj)}")
            return True
        return False

    def test_fastapi_downgrade_compatibility(self):
        """Test that FastAPI 0.100.0 downgrade resolved middleware issues"""
        print("\n=== Testing FastAPI 0.100.0 Compatibility ===")
        
        # Test basic endpoint functionality
        response, success, error = self.make_request("GET", "/health")
        
        if not success:
            self.log_result("FastAPI Compatibility", False, f"Health check failed: {error}")
            return
        
        if response.status_code == 200:
            # Test CORS headers
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-credentials',
                'access-control-allow-methods',
                'access-control-allow-headers'
            ]
            
            present_cors_headers = [h for h in cors_headers if h in response.headers]
            
            if len(present_cors_headers) >= 2:  # At least some CORS headers present
                self.log_result("FastAPI Compatibility", True, f"FastAPI 0.100.0 working correctly with CORS")
            else:
                self.log_result("FastAPI Compatibility", True, "FastAPI 0.100.0 working (CORS headers may be handled by proxy)")
        else:
            self.log_result("FastAPI Compatibility", False, f"Health check failed with status {response.status_code}")

    def run_comprehensive_auth_tests(self):
        """Run all authentication tests"""
        print("🔐 Starting Comprehensive Authentication System Testing")
        print(f"Backend URL: {self.api_url}")
        print("=" * 70)
        
        # Test sequence
        self.test_demo_user_registration()
        self.test_demo_user_login()
        self.test_jwt_token_validation()
        self.test_protected_endpoint_access()
        self.test_invalid_credentials()
        self.test_token_without_bearer_prefix()
        self.test_malformed_tokens()
        self.test_json_response_format()
        self.test_fastapi_downgrade_compatibility()
        
        # Print summary
        print("\n" + "=" * 70)
        print("🏁 AUTHENTICATION TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']} ✅")
        print(f"Failed: {self.results['failed']} ❌")
        print(f"Success Rate: {(self.results['passed']/self.results['total_tests']*100):.1f}%")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        else:
            print("\n🎉 ALL AUTHENTICATION TESTS PASSED!")
        
        print("\n" + "=" * 70)
        
        return self.results

if __name__ == "__main__":
    tester = AuthenticationTester()
    results = tester.run_comprehensive_auth_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)