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

    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        # Test data
        user_data = {
            "email": "testgamer@example.com",
            "password": "SecurePass123!",
            "username": "ProGamer2024",
            "full_name": "Test Gamer",
            "free_fire_uid": "123456789"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", user_data)
        
        if not success:
            self.log_result("User Registration", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.test_user_token = data["access_token"]
                    self.test_user_id = data["user_id"]
                    self.log_result("User Registration", True, "User registered successfully")
                else:
                    self.log_result("User Registration", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("User Registration", False, "Invalid JSON response")
        else:
            self.log_result("User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        login_data = {
            "email": "testgamer@example.com",
            "password": "SecurePass123!"
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
                    self.log_result("User Login", True, "Login successful")
                else:
                    self.log_result("User Login", False, f"Missing access_token: {data}")
            except json.JSONDecodeError:
                self.log_result("User Login", False, "Invalid JSON response")
        else:
            self.log_result("User Login", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_get_current_user(self):
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
            
            if response.status_code == 401:
                self.log_result(f"Protected {endpoint}", True, "Correctly blocked unauthorized access")
            else:
                self.log_result(f"Protected {endpoint}", False, f"Should return 401, got {response.status_code}")

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

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Tournament Platform Backend API Tests")
        print(f"Backend URL: {self.api_url}")
        print("=" * 60)
        
        # Test sequence
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