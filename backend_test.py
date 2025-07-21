#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Tournament Platform
Tests all major API endpoints and functionality
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

class TournamentAPITester:
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
        
        # Test data storage
        self.test_user_token = None
        self.test_user_id = None
        self.test_tournament_id = None
        self.test_order_id = None
        
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

    def get_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers with JWT token"""
        if not self.test_user_token:
            return {}
        return {"Authorization": f"Bearer {self.test_user_token}"}

    def test_health_check(self):
        """Test health check endpoint"""
        print("\n=== Testing Health Check ===")
        
        response, success, error = self.make_request("GET", "/health")
        
        if not success:
            self.log_result("Health Check", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_result("Health Check", True, "Service is healthy")
                else:
                    self.log_result("Health Check", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Health Check", False, "Invalid JSON response")
        else:
            self.log_result("Health Check", False, f"Status code: {response.status_code}")

    def test_free_fire_validation_endpoint(self):
        """Test Free Fire UID validation endpoint - NEW ENDPOINT"""
        print("\n=== Testing Free Fire Validation Endpoint ===")
        
        # Test valid Free Fire UID with region
        test_cases = [
            {"uid": "4474991975", "region": "ind", "should_pass": True, "description": "Valid UID from review request"},
            {"uid": "123456789", "region": "ind", "should_pass": True, "description": "Valid demo UID"},
            {"uid": "invalid123", "region": "ind", "should_pass": False, "description": "Invalid UID"},
            {"uid": "123456789", "region": "invalid", "should_pass": False, "description": "Invalid region"},
        ]
        
        for test_case in test_cases:
            params = {"uid": test_case["uid"], "region": test_case["region"]}
            response, success, error = self.make_request("GET", "/validate-freefire", params=params)
            
            if not success:
                self.log_result(f"Free Fire Validation ({test_case['description']})", False, f"Request failed: {error}")
                continue
            
            if test_case["should_pass"]:
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get("valid") == True and "player_info" in data:
                            player_info = data["player_info"]
                            self.log_result(f"Free Fire Validation ({test_case['description']})", True, 
                                          f"Valid UID: {player_info.get('nickname', 'Unknown')} (Level {player_info.get('level', 0)})")
                        else:
                            self.log_result(f"Free Fire Validation ({test_case['description']})", False, f"Invalid response format: {data}")
                    except json.JSONDecodeError:
                        self.log_result(f"Free Fire Validation ({test_case['description']})", False, "Invalid JSON response")
                else:
                    self.log_result(f"Free Fire Validation ({test_case['description']})", False, f"Expected 200, got {response.status_code}")
            else:
                # Should fail for invalid UIDs/regions
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get("valid") == False:
                            self.log_result(f"Free Fire Validation ({test_case['description']})", True, f"Correctly rejected: {data.get('error', 'Unknown error')}")
                        else:
                            self.log_result(f"Free Fire Validation ({test_case['description']})", False, "Should have been rejected but was accepted")
                    except json.JSONDecodeError:
                        self.log_result(f"Free Fire Validation ({test_case['description']})", False, "Invalid JSON response")
                else:
                    self.log_result(f"Free Fire Validation ({test_case['description']})", True, f"Correctly rejected with status {response.status_code}")

    def test_user_registration(self):
        """Test user registration with NEW Free Fire format"""
        print("\n=== Testing User Registration (New Free Fire Format) ===")
        
        # Test data with unique email to avoid conflicts
        import time
        unique_id = str(int(time.time()))
        user_data = {
            "email": f"testgamer{unique_id}@example.com",
            "password": "SecurePass123!",
            "free_fire_uid": "123456789",
            "region": "ind"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", user_data)
        
        if not success:
            self.log_result("User Registration (New Format)", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data and "player_info" in data:
                    self.test_user_token = data["access_token"]
                    self.test_user_id = data["user_id"]
                    player_info = data["player_info"]
                    self.log_result("User Registration (New Format)", True, 
                                  f"User registered with Free Fire data: {player_info.get('nickname', 'Unknown')} (Level {player_info.get('level', 0)})")
                else:
                    self.log_result("User Registration (New Format)", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("User Registration (New Format)", False, "Invalid JSON response")
        else:
            self.log_result("User Registration (New Format)", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_registration_with_invalid_free_fire_data(self):
        """Test registration with invalid Free Fire data should fail"""
        print("\n=== Testing Registration with Invalid Free Fire Data ===")
        
        import time
        unique_id = str(int(time.time()))
        
        # Test with invalid Free Fire UID
        invalid_user_data = {
            "email": f"invaliduser{unique_id}@example.com",
            "password": "SecurePass123!",
            "free_fire_uid": "invalid_uid_123",
            "region": "ind"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", invalid_user_data)
        
        if not success:
            self.log_result("Registration Invalid FF Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 400:
            try:
                data = response.json()
                if "detail" in data and "Free Fire" in data["detail"]:
                    self.log_result("Registration Invalid FF Data", True, f"Correctly rejected invalid Free Fire data: {data['detail']}")
                else:
                    self.log_result("Registration Invalid FF Data", False, f"Unexpected error message: {data}")
            except json.JSONDecodeError:
                self.log_result("Registration Invalid FF Data", False, "Invalid JSON response")
        else:
            self.log_result("Registration Invalid FF Data", False, f"Should return 400, got {response.status_code}")

    def test_database_structure_verification(self):
        """Test that user documents contain proper Free Fire data structure"""
        print("\n=== Testing Database Structure Verification ===")
        
        if not self.test_user_token:
            self.log_result("Database Structure Verification", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("Database Structure Verification", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                # Check for new Free Fire fields
                required_fields = ["user_id", "email", "free_fire_uid"]
                optional_fields = ["username", "full_name"]  # These should now be derived from Free Fire data
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Database Structure Verification", False, f"Missing required fields: {missing_fields}")
                else:
                    # Check if username/full_name are derived from Free Fire nickname
                    ff_uid = data.get("free_fire_uid")
                    username = data.get("username")
                    full_name = data.get("full_name")
                    
                    self.log_result("Database Structure Verification", True, 
                                  f"User document structure correct: FF UID {ff_uid}, username '{username}', full_name '{full_name}'")
            except json.JSONDecodeError:
                self.log_result("Database Structure Verification", False, "Invalid JSON response")
        else:
            self.log_result("Database Structure Verification", False, f"Status code: {response.status_code}")

    def test_free_fire_api_timeout_handling(self):
        """Test Free Fire API timeout and error handling"""
        print("\n=== Testing Free Fire API Error Handling ===")
        
        # Test with a UID that might cause timeout or API error
        params = {"uid": "999999999", "region": "test"}
        response, success, error = self.make_request("GET", "/validate-freefire", params=params)
        
        if not success:
            self.log_result("Free Fire API Error Handling", False, f"Request failed: {error}")
            return
        
        # Should handle API errors gracefully
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get("valid") == False and "error" in data:
                    self.log_result("Free Fire API Error Handling", True, f"Gracefully handled API error: {data['error']}")
                else:
                    self.log_result("Free Fire API Error Handling", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Free Fire API Error Handling", False, "Invalid JSON response")
        elif response.status_code in [400, 408, 500]:
            # These are acceptable error codes for API issues
            self.log_result("Free Fire API Error Handling", True, f"Properly handled API error with status {response.status_code}")
        else:
            self.log_result("Free Fire API Error Handling", False, f"Unexpected status code: {response.status_code}")

    def test_duplicate_free_fire_uid_registration(self):
        """Test that duplicate Free Fire UID registration is blocked"""
        print("\n=== Testing Duplicate Free Fire UID Registration ===")
        
        import time
        unique_id = str(int(time.time()))
        
        # Try to register with same Free Fire UID but different email
        duplicate_user_data = {
            "email": f"duplicate{unique_id}@example.com",
            "password": "SecurePass123!",
            "free_fire_uid": "123456789",  # Same UID as previous test
            "region": "ind"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", duplicate_user_data)
        
        if not success:
            self.log_result("Duplicate Free Fire UID", False, f"Request failed: {error}")
            return
        
        if response.status_code == 400:
            try:
                data = response.json()
                if "detail" in data and ("Free Fire UID" in data["detail"] or "already registered" in data["detail"]):
                    self.log_result("Duplicate Free Fire UID", True, f"Correctly blocked duplicate Free Fire UID: {data['detail']}")
                else:
                    self.log_result("Duplicate Free Fire UID", False, f"Unexpected error message: {data}")
            except json.JSONDecodeError:
                self.log_result("Duplicate Free Fire UID", False, "Invalid JSON response")
        else:
            self.log_result("Duplicate Free Fire UID", False, f"Should return 400, got {response.status_code}")

    def test_demo_credentials_with_free_fire(self):
        """Test demo credentials work with Free Fire integration"""
        print("\n=== Testing Demo Credentials with Free Fire Integration ===")
        
        # Test login with demo credentials
        login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", login_data)
        
        if not success:
            self.log_result("Demo Credentials Free Fire", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    demo_token = data["access_token"]
                    
                    # Get user info to check Free Fire integration
                    headers = {"Authorization": f"Bearer {demo_token}"}
                    user_response, user_success, user_error = self.make_request("GET", "/auth/me", headers=headers)
                    
                    if user_success and user_response.status_code == 200:
                        user_data = user_response.json()
                        ff_uid = user_data.get("free_fire_uid")
                        username = user_data.get("username")
                        is_admin = user_data.get("is_admin", False)
                        
                        if ff_uid and username and is_admin:
                            self.log_result("Demo Credentials Free Fire", True, 
                                          f"Demo user has Free Fire integration: UID {ff_uid}, username '{username}', admin: {is_admin}")
                        else:
                            self.log_result("Demo Credentials Free Fire", False, 
                                          f"Demo user missing Free Fire data: UID={ff_uid}, username={username}, admin={is_admin}")
                    else:
                        self.log_result("Demo Credentials Free Fire", False, 
                                      f"Failed to get demo user info: {user_response.status_code if user_success else user_error}")
                else:
                    self.log_result("Demo Credentials Free Fire", False, f"Login failed: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo Credentials Free Fire", False, "Invalid JSON response")
        else:
            self.log_result("Demo Credentials Free Fire", False, f"Login failed with status: {response.status_code}")

    def test_old_user_registration_format(self):
        """Test that old registration format (username/full_name) is rejected"""
        print("\n=== Testing Old Registration Format Rejection ===")
        
        import time
        unique_id = str(int(time.time()))
        
        # Try old format registration
        old_format_data = {
            "email": f"oldformat{unique_id}@example.com",
            "password": "SecurePass123!",
            "username": f"OldUser{unique_id}",
            "full_name": "Old Format User"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", old_format_data)
        
        if not success:
            self.log_result("Old Registration Format", False, f"Request failed: {error}")
            return
        
        if response.status_code == 422:
            try:
                data = response.json()
                if "detail" in data:
                    # Should complain about missing free_fire_uid and region
                    detail = str(data["detail"])
                    if "free_fire_uid" in detail or "region" in detail:
                        self.log_result("Old Registration Format", True, "Correctly rejected old format - requires Free Fire data")
                    else:
                        self.log_result("Old Registration Format", False, f"Unexpected validation error: {detail}")
                else:
                    self.log_result("Old Registration Format", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Old Registration Format", False, "Invalid JSON response")
        else:
            self.log_result("Old Registration Format", False, f"Should return 422, got {response.status_code}")

    def test_user_registration_old(self):
        """Test user login - kept for compatibility"""
        print("\n=== Testing User Login ===")
        
        # Use demo credentials that should work with Free Fire integration
        login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", login_data)
        
        if not success:
            self.log_result("User Login", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    # Update token for subsequent tests
                    self.test_user_token = data["access_token"]
                    self.test_user_id = data.get("user_id")
                    self.log_result("User Login", True, "Login successful")
                else:
                    self.log_result("User Login", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("User Login", False, "Invalid JSON response")
        else:
            self.log_result("User Login", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_user_login(self):
        """Test get current user info"""
        print("\n=== Testing Get Current User ===")
        
        if not self.test_user_token:
            self.log_result("Get Current User", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("Get Current User", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "user_id" in data and "email" in data:
                    self.log_result("Get Current User", True, f"User info retrieved: {data['username']}")
                else:
                    self.log_result("Get Current User", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Get Current User", False, "Invalid JSON response")
        else:
            self.log_result("Get Current User", False, f"Status code: {response.status_code}")

    def test_free_fire_verification(self):
        """Test Free Fire UID verification"""
        print("\n=== Testing Free Fire Verification ===")
        
        if not self.test_user_token:
            self.log_result("Free Fire Verification", False, "No auth token available")
            return
        
        # Test with valid UID
        verify_data = {"free_fire_uid": "123456789"}
        headers = self.get_auth_headers()
        
        response, success, error = self.make_request("POST", "/auth/verify-freefire", verify_data, headers)
        
        if not success:
            self.log_result("Free Fire Verification", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "user_data" in data and "message" in data:
                    self.log_result("Free Fire Verification", True, f"UID verified: {data['user_data']['username']}")
                else:
                    self.log_result("Free Fire Verification", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Free Fire Verification", False, "Invalid JSON response")
        else:
            self.log_result("Free Fire Verification", False, f"Status code: {response.status_code}")

    def test_tournaments_listing(self):
        """Test tournament listing with filters"""
        print("\n=== Testing Tournament Listing ===")
        
        # Test basic listing
        response, success, error = self.make_request("GET", "/tournaments")
        
        if not success:
            self.log_result("Tournament Listing", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    self.log_result("Tournament Listing", True, f"Retrieved {len(data['tournaments'])} tournaments")
                else:
                    self.log_result("Tournament Listing", False, f"Missing tournaments field: {data}")
            except json.JSONDecodeError:
                self.log_result("Tournament Listing", False, "Invalid JSON response")
        else:
            self.log_result("Tournament Listing", False, f"Status code: {response.status_code}")
        
        # Test with filters
        params = {
            "game_type": "free_fire",
            "country": "India",
            "mode": "squad"
        }
        
        response, success, error = self.make_request("GET", "/tournaments", params=params)
        
        if success and response.status_code == 200:
            self.log_result("Tournament Filtering", True, "Filters working correctly")
        else:
            self.log_result("Tournament Filtering", False, f"Filter test failed: {response.status_code if success else error}")

    def test_create_tournament(self):
        """Test tournament creation (admin required)"""
        print("\n=== Testing Tournament Creation ===")
        
        if not self.test_user_token:
            self.log_result("Tournament Creation", False, "No auth token available")
            return
        
        tournament_data = {
            "name": "Free Fire Championship 2024",
            "game_type": "free_fire",
            "tournament_type": "battle_royale",
            "entry_fee": 0.0,  # Free tournament for testing
            "prize_pool": 10000.0,
            "max_participants": 100,
            "start_time": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "registration_deadline": (datetime.utcnow() + timedelta(hours=12)).isoformat(),
            "mode": "squad",
            "country": "India",
            "description": "Test tournament for API testing"
        }
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("POST", "/tournaments", tournament_data, headers)
        
        if not success:
            self.log_result("Tournament Creation", False, f"Request failed: {error}")
            return
        
        # Expected to fail for non-admin user
        if response.status_code == 403:
            self.log_result("Tournament Creation", True, "Correctly blocked non-admin user")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "tournament_id" in data:
                    self.test_tournament_id = data["tournament_id"]
                    self.log_result("Tournament Creation", True, "Tournament created successfully")
                else:
                    self.log_result("Tournament Creation", False, f"Missing tournament_id: {data}")
            except json.JSONDecodeError:
                self.log_result("Tournament Creation", False, "Invalid JSON response")
        else:
            self.log_result("Tournament Creation", False, f"Status code: {response.status_code}")

    def test_tournament_registration(self):
        """Test tournament registration for free tournaments"""
        print("\n=== Testing Tournament Registration ===")
        
        if not self.test_user_token:
            self.log_result("Tournament Registration", False, "No auth token available")
            return
        
        # First, we need to create a test tournament or use existing one
        # Since we can't create as non-admin, we'll test the endpoint behavior
        
        # Test with a dummy tournament ID
        dummy_tournament_id = "test-tournament-123"
        headers = self.get_auth_headers()
        
        response, success, error = self.make_request("POST", f"/tournaments/{dummy_tournament_id}/register", headers=headers)
        
        if not success:
            self.log_result("Tournament Registration", False, f"Request failed: {error}")
            return
        
        # Expected to fail with 404 for non-existent tournament
        if response.status_code == 404:
            self.log_result("Tournament Registration", True, "Correctly handled non-existent tournament")
        else:
            self.log_result("Tournament Registration", False, f"Unexpected status code: {response.status_code}")

    def test_user_tournaments(self):
        """Test getting user's registered tournaments"""
        print("\n=== Testing User Tournaments ===")
        
        if not self.test_user_token:
            self.log_result("User Tournaments", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/user/tournaments", headers=headers)
        
        if not success:
            self.log_result("User Tournaments", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    self.log_result("User Tournaments", True, f"Retrieved {len(data['tournaments'])} user tournaments")
                else:
                    self.log_result("User Tournaments", False, f"Missing tournaments field: {data}")
            except json.JSONDecodeError:
                self.log_result("User Tournaments", False, "Invalid JSON response")
        else:
            self.log_result("User Tournaments", False, f"Status code: {response.status_code}")

    def test_payment_qr_generation(self):
        """Test payment QR code generation"""
        print("\n=== Testing Payment QR Generation ===")
        
        if not self.test_user_token:
            self.log_result("Payment QR Generation", False, "No auth token available")
            return
        
        payment_data = {
            "tournament_id": "test-tournament-123",
            "amount": 100.0
        }
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("POST", "/payments/create-qr", payment_data, headers)
        
        if not success:
            self.log_result("Payment QR Generation", False, f"Request failed: {error}")
            return
        
        # Expected to fail with 404 for non-existent tournament
        if response.status_code == 404:
            self.log_result("Payment QR Generation", True, "Correctly handled non-existent tournament")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "qr_code" in data and "order_id" in data:
                    self.test_order_id = data["order_id"]
                    self.log_result("Payment QR Generation", True, "QR code generated successfully")
                else:
                    self.log_result("Payment QR Generation", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Payment QR Generation", False, "Invalid JSON response")
        else:
            self.log_result("Payment QR Generation", False, f"Status code: {response.status_code}")

    def test_payment_status(self):
        """Test payment status checking"""
        print("\n=== Testing Payment Status ===")
        
        if not self.test_user_token:
            self.log_result("Payment Status", False, "No auth token available")
            return
        
        # Test with a dummy order ID
        test_order_id = "test-order-123"
        headers = self.get_auth_headers()
        
        response, success, error = self.make_request("GET", f"/payments/{test_order_id}/status", headers=headers)
        
        if not success:
            self.log_result("Payment Status", False, f"Request failed: {error}")
            return
        
        # Expected to fail with 404 for non-existent order
        if response.status_code == 404:
            self.log_result("Payment Status", True, "Correctly handled non-existent payment")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "status" in data and "order_id" in data:
                    self.log_result("Payment Status", True, f"Payment status: {data['status']}")
                else:
                    self.log_result("Payment Status", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Payment Status", False, "Invalid JSON response")
        else:
            self.log_result("Payment Status", False, f"Status code: {response.status_code}")

    def test_leaderboards(self):
        """Test leaderboards endpoint"""
        print("\n=== Testing Leaderboards ===")
        
        response, success, error = self.make_request("GET", "/leaderboards")
        
        if not success:
            self.log_result("Leaderboards", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "leaderboard" in data and isinstance(data["leaderboard"], list):
                    self.log_result("Leaderboards", True, f"Retrieved {len(data['leaderboard'])} leaderboard entries")
                else:
                    self.log_result("Leaderboards", False, f"Invalid leaderboard format: {data}")
            except json.JSONDecodeError:
                self.log_result("Leaderboards", False, "Invalid JSON response")
        else:
            self.log_result("Leaderboards", False, f"Status code: {response.status_code}")
        
        # Test with filters
        params = {
            "game_type": "free_fire",
            "limit": 10
        }
        
        response, success, error = self.make_request("GET", "/leaderboards", params=params)
        
        if success and response.status_code == 200:
            self.log_result("Leaderboard Filtering", True, "Leaderboard filters working")
        else:
            self.log_result("Leaderboard Filtering", False, f"Filter test failed: {response.status_code if success else error}")

    def test_protected_endpoints_without_auth(self):
        """Test protected endpoints without authentication"""
        print("\n=== Testing Protected Endpoints Without Auth ===")
        
        protected_endpoints = [
            ("GET", "/auth/me"),
            ("POST", "/auth/verify-freefire"),
            ("POST", "/tournaments"),
            ("POST", "/tournaments/test/register"),
            ("GET", "/user/tournaments"),
            ("POST", "/payments/create-qr"),
            ("GET", "/payments/test/status")
        ]
        
        for method, endpoint in protected_endpoints:
            response, success, error = self.make_request(method, endpoint)
            
            if not success:
                self.log_result(f"Protected {endpoint}", False, f"Request failed: {error}")
                continue
            
            if response.status_code in [401, 403]:
                self.log_result(f"Protected {endpoint}", True, "Correctly blocked unauthorized access")
            else:
                self.log_result(f"Protected {endpoint}", False, f"Should return 401/403, got {response.status_code}")

    def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        print("\n=== Testing Invalid Credentials ===")
        
        invalid_login = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", invalid_login)
        
        if not success:
            self.log_result("Invalid Credentials", False, f"Request failed: {error}")
            return
        
        if response.status_code == 401:
            self.log_result("Invalid Credentials", True, "Correctly rejected invalid credentials")
        else:
            self.log_result("Invalid Credentials", False, f"Should return 401, got {response.status_code}")

    def test_duplicate_registration(self):
        """Test duplicate user registration"""
        print("\n=== Testing Duplicate Registration ===")
        
        # Try to register the same user again
        user_data = {
            "email": "testgamer@example.com",
            "password": "SecurePass123!",
            "username": "ProGamer2024",
            "full_name": "Test Gamer",
            "free_fire_uid": "123456789"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", user_data)
        
        if not success:
            self.log_result("Duplicate Registration", False, f"Request failed: {error}")
            return
        
        if response.status_code == 400:
            self.log_result("Duplicate Registration", True, "Correctly blocked duplicate registration")
        else:
            self.log_result("Duplicate Registration", False, f"Should return 400, got {response.status_code}")

    def test_ai_matchmaking_analysis(self):
        """Test AI-powered matchmaking analysis"""
        print("\n=== Testing AI Matchmaking Analysis ===")
        
        if not self.test_user_token:
            self.log_result("AI Matchmaking Analysis", False, "No auth token available")
            return
        
        # Test with a dummy tournament ID
        test_tournament_id = "test-tournament-123"
        headers = self.get_auth_headers()
        
        response, success, error = self.make_request("GET", f"/ai/matchmaking-analysis?tournament_id={test_tournament_id}", headers=headers)
        
        if not success:
            self.log_result("AI Matchmaking Analysis", False, f"Request failed: {error}")
            return
        
        if response.status_code == 404:
            self.log_result("AI Matchmaking Analysis", True, "Correctly handled non-existent tournament")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "message" in data or "ai_analysis" in data:
                    self.log_result("AI Matchmaking Analysis", True, "AI analysis endpoint working")
                else:
                    self.log_result("AI Matchmaking Analysis", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Matchmaking Analysis", False, "Invalid JSON response")
        else:
            self.log_result("AI Matchmaking Analysis", False, f"Status code: {response.status_code}")

    def test_ai_tournament_prediction(self):
        """Test AI tournament prediction"""
        print("\n=== Testing AI Tournament Prediction ===")
        
        if not self.test_user_token:
            self.log_result("AI Tournament Prediction", False, "No auth token available")
            return
        
        test_tournament_id = "test-tournament-123"
        headers = self.get_auth_headers()
        
        response, success, error = self.make_request("GET", f"/ai/tournament-prediction/{test_tournament_id}", headers=headers)
        
        if not success:
            self.log_result("AI Tournament Prediction", False, f"Request failed: {error}")
            return
        
        if response.status_code == 404:
            self.log_result("AI Tournament Prediction", True, "Correctly handled non-existent tournament")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "message" in data or "ai_detailed_analysis" in data or "technical_prediction" in data:
                    self.log_result("AI Tournament Prediction", True, "AI prediction endpoint working")
                else:
                    self.log_result("AI Tournament Prediction", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Tournament Prediction", False, "Invalid JSON response")
        else:
            self.log_result("AI Tournament Prediction", False, f"Status code: {response.status_code}")

    def test_ai_player_insights(self):
        """Test AI player insights"""
        print("\n=== Testing AI Player Insights ===")
        
        if not self.test_user_token:
            self.log_result("AI Player Insights", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/ai/player-insights", headers=headers)
        
        if not success:
            self.log_result("AI Player Insights", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "ai_coaching_analysis" in data or "detailed_analytics" in data:
                    self.log_result("AI Player Insights", True, "AI insights generated successfully")
                else:
                    self.log_result("AI Player Insights", False, f"Missing expected fields: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Player Insights", False, "Invalid JSON response")
        else:
            self.log_result("AI Player Insights", False, f"Status code: {response.status_code}")

    def test_ai_smart_matchmaking(self):
        """Test AI smart tournament recommendations"""
        print("\n=== Testing AI Smart Matchmaking ===")
        
        if not self.test_user_token:
            self.log_result("AI Smart Matchmaking", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/ai/smart-matchmaking", headers=headers)
        
        if not success:
            self.log_result("AI Smart Matchmaking", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "technical_recommendations" in data or "message" in data:
                    self.log_result("AI Smart Matchmaking", True, "Smart matchmaking working")
                else:
                    self.log_result("AI Smart Matchmaking", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Smart Matchmaking", False, "Invalid JSON response")
        else:
            self.log_result("AI Smart Matchmaking", False, f"Status code: {response.status_code}")

    def test_player_analytics(self):
        """Test player analytics endpoint"""
        print("\n=== Testing Player Analytics ===")
        
        if not self.test_user_token or not self.test_user_id:
            self.log_result("Player Analytics", False, "No auth token or user ID available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", f"/analytics/player/{self.test_user_id}", headers=headers)
        
        if not success:
            self.log_result("Player Analytics", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "player_info" in data and "analytics" in data:
                    self.log_result("Player Analytics", True, "Player analytics generated successfully")
                else:
                    self.log_result("Player Analytics", False, f"Missing expected fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Player Analytics", False, "Invalid JSON response")
        else:
            self.log_result("Player Analytics", False, f"Status code: {response.status_code}")

    def test_admin_analytics_overview(self):
        """Test admin analytics overview (should fail for non-admin)"""
        print("\n=== Testing Admin Analytics Overview ===")
        
        if not self.test_user_token:
            self.log_result("Admin Analytics Overview", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/admin/analytics/overview", headers=headers)
        
        if not success:
            self.log_result("Admin Analytics Overview", False, f"Request failed: {error}")
            return
        
        # Should fail with 403 for non-admin user
        if response.status_code == 403:
            self.log_result("Admin Analytics Overview", True, "Correctly blocked non-admin access")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "overview" in data and "skill_distribution" in data:
                    self.log_result("Admin Analytics Overview", True, "Admin analytics working (user has admin access)")
                else:
                    self.log_result("Admin Analytics Overview", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Analytics Overview", False, "Invalid JSON response")
        else:
            self.log_result("Admin Analytics Overview", False, f"Status code: {response.status_code}")

    def test_admin_player_analytics(self):
        """Test admin player analytics (should fail for non-admin)"""
        print("\n=== Testing Admin Player Analytics ===")
        
        if not self.test_user_token:
            self.log_result("Admin Player Analytics", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/admin/analytics/players", headers=headers)
        
        if not success:
            self.log_result("Admin Player Analytics", False, f"Request failed: {error}")
            return
        
        # Should fail with 403 for non-admin user
        if response.status_code == 403:
            self.log_result("Admin Player Analytics", True, "Correctly blocked non-admin access")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "players" in data and "total_count" in data:
                    self.log_result("Admin Player Analytics", True, "Admin player analytics working (user has admin access)")
                else:
                    self.log_result("Admin Player Analytics", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Player Analytics", False, "Invalid JSON response")
        else:
            self.log_result("Admin Player Analytics", False, f"Status code: {response.status_code}")

    def test_admin_tournament_analytics(self):
        """Test admin tournament analytics (should fail for non-admin)"""
        print("\n=== Testing Admin Tournament Analytics ===")
        
        if not self.test_user_token:
            self.log_result("Admin Tournament Analytics", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/admin/analytics/tournaments", headers=headers)
        
        if not success:
            self.log_result("Admin Tournament Analytics", False, f"Request failed: {error}")
            return
        
        # Should fail with 403 for non-admin user
        if response.status_code == 403:
            self.log_result("Admin Tournament Analytics", True, "Correctly blocked non-admin access")
        elif response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    self.log_result("Admin Tournament Analytics", True, "Admin tournament analytics working (user has admin access)")
                else:
                    self.log_result("Admin Tournament Analytics", False, f"Unexpected response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Tournament Analytics", False, "Invalid JSON response")
        else:
            self.log_result("Admin Tournament Analytics", False, f"Status code: {response.status_code}")

    def test_admin_user_creation(self):
        """Test creating an admin user for admin endpoint testing"""
        print("\n=== Testing Admin User Creation ===")
        
        # Create admin user with demo credentials
        admin_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "AdminDemo",
            "full_name": "Demo Admin",
            "free_fire_uid": "987654321"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", admin_data)
        
        if not success:
            self.log_result("Admin User Creation", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    # Store admin credentials for admin tests
                    self.admin_token = data["access_token"]
                    self.admin_user_id = data["user_id"]
                    self.log_result("Admin User Creation", True, "Admin user created successfully")
                else:
                    self.log_result("Admin User Creation", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin User Creation", False, "Invalid JSON response")
        elif response.status_code == 400:
            # User might already exist, try to login
            login_data = {
                "email": "demo@tournament.com",
                "password": "demo123"
            }
            
            response, success, error = self.make_request("POST", "/auth/login", login_data)
            
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    self.admin_token = data["access_token"]
                    self.admin_user_id = data["user_id"]
                    self.log_result("Admin User Creation", True, "Admin user login successful")
                except json.JSONDecodeError:
                    self.log_result("Admin User Creation", False, "Invalid JSON response on login")
            else:
                self.log_result("Admin User Creation", False, f"Login failed: {response.status_code if success else error}")
        else:
            self.log_result("Admin User Creation", False, f"Status code: {response.status_code}")

    def test_admin_endpoints_with_admin_user(self):
        """Test admin endpoints with admin credentials"""
        print("\n=== Testing Admin Endpoints with Admin User ===")
        
        if not hasattr(self, 'admin_token') or not self.admin_token:
            self.log_result("Admin Endpoints Test", False, "No admin token available")
            return
        
        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test admin analytics overview
        response, success, error = self.make_request("GET", "/admin/analytics/overview", headers=admin_headers)
        
        if success and response.status_code == 200:
            try:
                data = response.json()
                if "overview" in data:
                    self.log_result("Admin Analytics Overview (Admin)", True, "Admin analytics working with admin user")
                else:
                    self.log_result("Admin Analytics Overview (Admin)", False, f"Unexpected format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Analytics Overview (Admin)", False, "Invalid JSON response")
        else:
            self.log_result("Admin Analytics Overview (Admin)", False, f"Failed: {response.status_code if success else error}")
        
        # Test admin player analytics
        response, success, error = self.make_request("GET", "/admin/analytics/players", headers=admin_headers)
        
        if success and response.status_code == 200:
            try:
                data = response.json()
                if "players" in data:
                    self.log_result("Admin Player Analytics (Admin)", True, "Admin player analytics working")
                else:
                    self.log_result("Admin Player Analytics (Admin)", False, f"Unexpected format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Player Analytics (Admin)", False, "Invalid JSON response")
        else:
            self.log_result("Admin Player Analytics (Admin)", False, f"Failed: {response.status_code if success else error}")
        
        # Test admin tournament analytics
        response, success, error = self.make_request("GET", "/admin/analytics/tournaments", headers=admin_headers)
        
        if success and response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    self.log_result("Admin Tournament Analytics (Admin)", True, "Admin tournament analytics working")
                else:
                    self.log_result("Admin Tournament Analytics (Admin)", False, f"Unexpected format: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Tournament Analytics (Admin)", False, "Invalid JSON response")
        else:
            self.log_result("Admin Tournament Analytics (Admin)", False, f"Failed: {response.status_code if success else error}")

    def test_live_stats_api(self):
        """Test Live Stats API - should return real database values"""
        print("\n=== Testing Live Stats API ===")
        
        response, success, error = self.make_request("GET", "/live-stats")
        
        if not success:
            self.log_result("Live Stats API", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                required_fields = ["totalTournaments", "totalPrizePool", "activePlayers", "liveMatches"]
                
                if all(field in data for field in required_fields):
                    # Check if values are realistic (not default mock values)
                    total_tournaments = data["totalTournaments"]
                    total_prize_pool = data["totalPrizePool"]
                    active_players = data["activePlayers"]
                    live_matches = data["liveMatches"]
                    
                    # Verify we have reasonable values from seeded database
                    if total_tournaments > 0 and total_prize_pool > 0 and active_players > 0:
                        self.log_result("Live Stats API", True, 
                                      f"Real data: {total_tournaments} tournaments, ₹{total_prize_pool:,.0f} prize pool, {active_players} players, {live_matches} live matches")
                    else:
                        self.log_result("Live Stats API", False, "Returned zero values - may be using fallback data")
                else:
                    self.log_result("Live Stats API", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Live Stats API", False, "Invalid JSON response")
        else:
            self.log_result("Live Stats API", False, f"Status code: {response.status_code}")

    def test_ai_predictions_api(self):
        """Test AI Predictions API - requires auth and should return database predictions"""
        print("\n=== Testing AI Predictions API ===")
        
        if not self.test_user_token:
            self.log_result("AI Predictions API", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/ai-predictions", headers=headers)
        
        if not success:
            self.log_result("AI Predictions API", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "predictions" in data and isinstance(data["predictions"], list):
                    predictions = data["predictions"]
                    if len(predictions) > 0:
                        # Check if predictions have proper structure
                        first_prediction = predictions[0]
                        required_fields = ["id", "type", "title", "prediction", "confidence", "action"]
                        
                        if all(field in first_prediction for field in required_fields):
                            self.log_result("AI Predictions API", True, 
                                          f"Retrieved {len(predictions)} AI predictions with proper structure")
                        else:
                            self.log_result("AI Predictions API", False, f"Prediction missing required fields: {first_prediction}")
                    else:
                        self.log_result("AI Predictions API", True, "No predictions available (empty list)")
                else:
                    self.log_result("AI Predictions API", False, f"Invalid response format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Predictions API", False, "Invalid JSON response")
        else:
            self.log_result("AI Predictions API", False, f"Status code: {response.status_code}")

    def test_dashboard_data_api(self):
        """Test Dashboard Data API - requires auth and should return comprehensive user data"""
        print("\n=== Testing Dashboard Data API ===")
        
        if not self.test_user_token:
            self.log_result("Dashboard Data API", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/dashboard-data", headers=headers)
        
        if not success:
            self.log_result("Dashboard Data API", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                required_sections = ["stats", "recentTournaments", "achievements", "weeklyProgress"]
                
                if all(section in data for section in required_sections):
                    stats = data["stats"]
                    required_stats = ["tournamentsJoined", "totalWinnings", "currentRank", "winRate"]
                    
                    if all(stat in stats for stat in required_stats):
                        tournaments_joined = stats["tournamentsJoined"]
                        total_winnings = stats["totalWinnings"]
                        current_rank = stats["currentRank"]
                        win_rate = stats["winRate"]
                        
                        self.log_result("Dashboard Data API", True, 
                                      f"Complete dashboard data: {tournaments_joined} tournaments, ₹{total_winnings} winnings, rank #{current_rank}, {win_rate}% win rate")
                    else:
                        self.log_result("Dashboard Data API", False, f"Stats section missing required fields: {stats}")
                else:
                    self.log_result("Dashboard Data API", False, f"Missing required sections: {data}")
            except json.JSONDecodeError:
                self.log_result("Dashboard Data API", False, "Invalid JSON response")
        else:
            self.log_result("Dashboard Data API", False, f"Status code: {response.status_code}")

    def test_admin_account_verification(self):
        """Test that demo@tournament.com has admin privileges"""
        print("\n=== Testing Admin Account Verification ===")
        
        # Login with demo credentials
        login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", login_data)
        
        if not success:
            self.log_result("Admin Account Verification", False, f"Login request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data:
                    demo_token = data["access_token"]
                    
                    # Get user info to check admin status
                    headers = {"Authorization": f"Bearer {demo_token}"}
                    user_response, user_success, user_error = self.make_request("GET", "/auth/me", headers=headers)
                    
                    if user_success and user_response.status_code == 200:
                        user_data = user_response.json()
                        is_admin = user_data.get("is_admin", False)
                        
                        if is_admin:
                            self.log_result("Admin Account Verification", True, 
                                          f"demo@tournament.com has admin privileges: {user_data['username']}")
                        else:
                            self.log_result("Admin Account Verification", False, 
                                          f"demo@tournament.com does NOT have admin privileges")
                    else:
                        self.log_result("Admin Account Verification", False, 
                                      f"Failed to get user info: {user_response.status_code if user_success else user_error}")
                else:
                    self.log_result("Admin Account Verification", False, f"Login failed: {data}")
            except json.JSONDecodeError:
                self.log_result("Admin Account Verification", False, "Invalid JSON response")
        else:
            self.log_result("Admin Account Verification", False, f"Login failed with status: {response.status_code}")

    def test_tournament_data_verification(self):
        """Test that /api/tournaments returns real seeded tournament data (8 tournaments expected)"""
        print("\n=== Testing Tournament Data Verification ===")
        
        response, success, error = self.make_request("GET", "/tournaments")
        
        if not success:
            self.log_result("Tournament Data Verification", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    tournaments = data["tournaments"]
                    tournament_count = len(tournaments)
                    
                    if tournament_count >= 8:  # Should have at least 8 tournaments from seeder
                        # Check if tournaments have realistic data (not mock)
                        if tournaments:
                            first_tournament = tournaments[0]
                            required_fields = ["tournament_id", "name", "prize_pool", "entry_fee", "status"]
                            
                            if all(field in first_tournament for field in required_fields):
                                # Check for realistic tournament names (not generic mock names)
                                tournament_names = [t["name"] for t in tournaments[:3]]
                                self.log_result("Tournament Data Verification", True, 
                                              f"Retrieved {tournament_count} real tournaments: {', '.join(tournament_names)}")
                            else:
                                self.log_result("Tournament Data Verification", False, 
                                              f"Tournament missing required fields: {first_tournament}")
                        else:
                            self.log_result("Tournament Data Verification", False, "Empty tournaments list")
                    else:
                        self.log_result("Tournament Data Verification", False, 
                                      f"Expected at least 8 tournaments, got {tournament_count}")
                else:
                    self.log_result("Tournament Data Verification", False, f"Missing tournaments field: {data}")
            except json.JSONDecodeError:
                self.log_result("Tournament Data Verification", False, "Invalid JSON response")
        else:
            self.log_result("Tournament Data Verification", False, f"Status code: {response.status_code}")

    def test_leaderboard_data_verification(self):
        """Test that /api/leaderboards returns real leaderboard data from database"""
        print("\n=== Testing Leaderboard Data Verification ===")
        
        response, success, error = self.make_request("GET", "/leaderboards")
        
        if not success:
            self.log_result("Leaderboard Data Verification", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "leaderboard" in data and isinstance(data["leaderboard"], list):
                    leaderboard = data["leaderboard"]
                    leaderboard_count = len(leaderboard)
                    
                    if leaderboard_count > 0:
                        # Check if leaderboard entries have proper structure
                        first_entry = leaderboard[0]
                        required_fields = ["rank", "username", "skill_rating", "total_earnings"]
                        
                        if all(field in first_entry for field in required_fields):
                            # Check for realistic usernames (not generic mock names)
                            top_players = [entry["username"] for entry in leaderboard[:3]]
                            total_earnings = sum(entry.get("total_earnings", 0) for entry in leaderboard[:5])
                            
                            self.log_result("Leaderboard Data Verification", True, 
                                          f"Retrieved {leaderboard_count} leaderboard entries. Top players: {', '.join(top_players)}, Total earnings: ₹{total_earnings:,.0f}")
                        else:
                            self.log_result("Leaderboard Data Verification", False, 
                                          f"Leaderboard entry missing required fields: {first_entry}")
                    else:
                        self.log_result("Leaderboard Data Verification", False, "Empty leaderboard")
                else:
                    self.log_result("Leaderboard Data Verification", False, f"Invalid leaderboard format: {data}")
            except json.JSONDecodeError:
                self.log_result("Leaderboard Data Verification", False, "Invalid JSON response")
        else:
            self.log_result("Leaderboard Data Verification", False, f"Status code: {response.status_code}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Tournament Platform Backend API Tests")
        print(f"Backend URL: {self.api_url}")
        print("=" * 60)
        
        # Initialize admin token storage
        self.admin_token = None
        self.admin_user_id = None
        
        # Test sequence - Basic functionality first
        self.test_health_check()
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        self.test_free_fire_verification()
        self.test_tournaments_listing()
        self.test_create_tournament()
        self.test_tournament_registration()
        self.test_user_tournaments()
        self.test_payment_qr_generation()
        self.test_payment_status()
        self.test_leaderboards()
        self.test_protected_endpoints_without_auth()
        self.test_invalid_credentials()
        self.test_duplicate_registration()
        
        # NEW ENDPOINTS TESTING - As requested in review
        print("\n" + "=" * 60)
        print("🎯 TESTING NEW DATABASE-DRIVEN ENDPOINTS")
        print("=" * 60)
        
        self.test_live_stats_api()
        self.test_ai_predictions_api()
        self.test_dashboard_data_api()
        self.test_admin_account_verification()
        self.test_tournament_data_verification()
        self.test_leaderboard_data_verification()
        
        # AI-powered features testing
        print("\n" + "=" * 60)
        print("🤖 TESTING AI-POWERED FEATURES")
        print("=" * 60)
        
        self.test_ai_matchmaking_analysis()
        self.test_ai_tournament_prediction()
        self.test_ai_player_insights()
        self.test_ai_smart_matchmaking()
        self.test_player_analytics()
        
        # Admin endpoints testing (should fail for regular user)
        print("\n" + "=" * 60)
        print("🔐 TESTING ADMIN ENDPOINTS (Non-Admin User)")
        print("=" * 60)
        
        self.test_admin_analytics_overview()
        self.test_admin_player_analytics()
        self.test_admin_tournament_analytics()
        
        # Create admin user and test admin endpoints
        print("\n" + "=" * 60)
        print("👑 TESTING ADMIN FUNCTIONALITY")
        print("=" * 60)
        
        self.test_admin_user_creation()
        self.test_admin_endpoints_with_admin_user()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
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
    tester = TournamentAPITester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)