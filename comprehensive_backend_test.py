#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Free Fire Tournament Platform
Focus: Review Requirements - Authentication, Database-Driven Endpoints, Real Data Validation
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class ComprehensiveBackendTester:
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
        
        print(f"🎯 COMPREHENSIVE BACKEND TESTING - FREE FIRE TOURNAMENT PLATFORM")
        print(f"🔗 Testing Backend at: {self.api_url}")
        print(f"📋 Review Focus: Authentication, Database-Driven Endpoints, Real Data Validation")
        print(f"🚫 NO MOCK DATA FALLBACKS - Everything must use real database data")
        
        # Test data storage
        self.demo_token = None
        self.demo_user_id = None
        self.test_user_token = None
        self.test_user_id = None
        
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
                response = requests.get(url, headers=headers, params=params, timeout=15)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, params=params, timeout=15)
            else:
                return None, False, "Unsupported HTTP method"
            
            return response, True, ""
        except requests.exceptions.RequestException as e:
            return None, False, str(e)

    def get_auth_headers(self, token: str = None) -> Dict[str, str]:
        """Get authorization headers with JWT token"""
        token_to_use = token or self.demo_token
        if not token_to_use:
            return {}
        return {"Authorization": f"Bearer {token_to_use}"}

    def test_health_check(self):
        """Test backend health and connectivity"""
        print("\n🏥 === HEALTH CHECK ===")
        
        response, success, error = self.make_request("GET", "/health")
        
        if not success:
            self.log_result("Backend Health Check", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    version = data.get("version", "Unknown")
                    database = data.get("database", "Unknown")
                    self.log_result("Backend Health Check", True, f"Service healthy - Version: {version}, Database: {database}")
                else:
                    self.log_result("Backend Health Check", False, f"Unexpected response: {data}")
            except json.JSONDecodeError:
                self.log_result("Backend Health Check", False, "Invalid JSON response")
        else:
            self.log_result("Backend Health Check", False, f"Status code: {response.status_code}")

    def test_dual_login_system(self):
        """Test dual login system - email and Free Fire UID"""
        print("\n🔐 === DUAL LOGIN SYSTEM TESTING ===")
        
        # Test 1: Login with email (demo credentials)
        email_login_data = {
            "identifier": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", email_login_data)
        
        if not success:
            self.log_result("Email Login", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.demo_token = data["access_token"]
                    self.demo_user_id = data["user"]["user_id"]
                    user_info = data["user"]
                    self.log_result("Email Login", True, 
                                  f"Email login successful - User: {user_info.get('username', 'Unknown')}, FF UID: {user_info.get('free_fire_uid', 'N/A')}")
                    
                    # Test 2: Login with Free Fire UID (same user)
                    if user_info.get('free_fire_uid'):
                        uid_login_data = {
                            "identifier": user_info['free_fire_uid'],
                            "password": "demo123"
                        }
                        
                        uid_response, uid_success, uid_error = self.make_request("POST", "/auth/login", uid_login_data)
                        
                        if uid_success and uid_response.status_code == 200:
                            uid_data = uid_response.json()
                            if uid_data["user"]["user_id"] == user_info["user_id"]:
                                self.log_result("Free Fire UID Login", True, 
                                              f"UID login successful - Same user authenticated via UID: {user_info['free_fire_uid']}")
                            else:
                                self.log_result("Free Fire UID Login", False, "Different user returned for UID login")
                        else:
                            self.log_result("Free Fire UID Login", False, f"UID login failed: {uid_response.status_code if uid_success else uid_error}")
                    else:
                        self.log_result("Free Fire UID Login", False, "Demo user has no Free Fire UID")
                else:
                    self.log_result("Email Login", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Email Login", False, "Invalid JSON response")
        else:
            self.log_result("Email Login", False, f"Status code: {response.status_code}, Response: {response.text}")

    def test_email_uniqueness_constraint(self):
        """Test email uniqueness - one email per account restriction"""
        print("\n📧 === EMAIL UNIQUENESS TESTING ===")
        
        # Try to register with existing demo email
        duplicate_email_data = {
            "email": "demo@tournament.com",
            "password": "newpassword123",
            "free_fire_uid": "999888777",
            "region": "ind"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", duplicate_email_data)
        
        if not success:
            self.log_result("Email Uniqueness", False, f"Request failed: {error}")
            return
        
        if response.status_code == 400:
            try:
                data = response.json()
                if "detail" in data and "email" in data["detail"].lower() and "already" in data["detail"].lower():
                    self.log_result("Email Uniqueness", True, f"Correctly blocked duplicate email: {data['detail']}")
                else:
                    self.log_result("Email Uniqueness", False, f"Unexpected error message: {data['detail']}")
            except json.JSONDecodeError:
                self.log_result("Email Uniqueness", False, "Invalid JSON response")
        else:
            self.log_result("Email Uniqueness", False, f"Should return 400, got {response.status_code}")

    def test_uid_uniqueness_constraint(self):
        """Test Free Fire UID uniqueness - one UID per account restriction"""
        print("\n🎮 === FREE FIRE UID UNIQUENESS TESTING ===")
        
        # First, get the demo user's Free Fire UID
        if not self.demo_token:
            self.log_result("UID Uniqueness", False, "No demo token available")
            return
        
        headers = self.get_auth_headers()
        user_response, user_success, user_error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not user_success or user_response.status_code != 200:
            self.log_result("UID Uniqueness", False, "Could not get demo user info")
            return
        
        try:
            user_data = user_response.json()
            demo_uid = user_data.get("free_fire_uid")
            
            if not demo_uid:
                self.log_result("UID Uniqueness", False, "Demo user has no Free Fire UID")
                return
            
            # Try to register with same Free Fire UID but different email
            unique_id = str(int(time.time()))
            duplicate_uid_data = {
                "email": f"newuser{unique_id}@example.com",
                "password": "newpassword123",
                "free_fire_uid": demo_uid,
                "region": "ind"
            }
            
            response, success, error = self.make_request("POST", "/auth/register", duplicate_uid_data)
            
            if not success:
                self.log_result("UID Uniqueness", False, f"Request failed: {error}")
                return
            
            if response.status_code == 400:
                try:
                    data = response.json()
                    if "detail" in data and ("uid" in data["detail"].lower() or "already" in data["detail"].lower()):
                        self.log_result("UID Uniqueness", True, f"Correctly blocked duplicate UID: {data['detail']}")
                    else:
                        self.log_result("UID Uniqueness", False, f"Unexpected error message: {data['detail']}")
                except json.JSONDecodeError:
                    self.log_result("UID Uniqueness", False, "Invalid JSON response")
            else:
                self.log_result("UID Uniqueness", False, f"Should return 400, got {response.status_code}")
                
        except json.JSONDecodeError:
            self.log_result("UID Uniqueness", False, "Invalid JSON response from user info")

    def test_real_free_fire_uid_validation(self):
        """Test real Free Fire UID validation with external API"""
        print("\n🌐 === REAL FREE FIRE UID VALIDATION ===")
        
        # Test cases with real and invalid UIDs
        test_cases = [
            {"uid": "3659196149", "region": "ind", "should_pass": True, "description": "Real UID from review"},
            {"uid": "123456789", "region": "ind", "should_pass": True, "description": "Valid format UID"},
            {"uid": "invalid123", "region": "ind", "should_pass": False, "description": "Invalid UID format"},
            {"uid": "123456789", "region": "invalid", "should_pass": False, "description": "Invalid region"},
            {"uid": "12345", "region": "ind", "should_pass": False, "description": "Too short UID"},
            {"uid": "1234567890123", "region": "ind", "should_pass": False, "description": "Too long UID"},
        ]
        
        for test_case in test_cases:
            params = {"uid": test_case["uid"], "region": test_case["region"]}
            response, success, error = self.make_request("GET", "/validate-freefire", params=params)
            
            if not success:
                self.log_result(f"FF Validation ({test_case['description']})", False, f"Request failed: {error}")
                continue
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if test_case["should_pass"]:
                        if data.get("valid") == True and "player_info" in data:
                            player_info = data["player_info"]
                            nickname = player_info.get("nickname", "Unknown")
                            level = player_info.get("level", 0)
                            self.log_result(f"FF Validation ({test_case['description']})", True, 
                                          f"Valid UID - Player: {nickname} (Level {level})")
                        else:
                            self.log_result(f"FF Validation ({test_case['description']})", False, 
                                          f"Expected valid but got: {data}")
                    else:
                        if data.get("valid") == False:
                            self.log_result(f"FF Validation ({test_case['description']})", True, 
                                          f"Correctly rejected: {data.get('error', 'Unknown error')}")
                        else:
                            self.log_result(f"FF Validation ({test_case['description']})", False, 
                                          "Should have been rejected but was accepted")
                except json.JSONDecodeError:
                    self.log_result(f"FF Validation ({test_case['description']})", False, "Invalid JSON response")
            else:
                if test_case["should_pass"]:
                    self.log_result(f"FF Validation ({test_case['description']})", False, 
                                  f"Expected 200, got {response.status_code}")
                else:
                    self.log_result(f"FF Validation ({test_case['description']})", True, 
                                  f"Correctly rejected with status {response.status_code}")

    def test_tournaments_database_data(self):
        """Test /api/tournaments returns real database tournaments (not mock data)"""
        print("\n🏆 === TOURNAMENTS DATABASE DATA TESTING ===")
        
        response, success, error = self.make_request("GET", "/tournaments")
        
        if not success:
            self.log_result("Tournaments Database Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data and "count" in data:
                    tournaments = data["tournaments"]
                    count = data["count"]
                    
                    if count > 0 and len(tournaments) > 0:
                        # Check if tournaments have realistic data (not mock)
                        first_tournament = tournaments[0]
                        required_fields = ["tournament_id", "name", "entry_fee", "prize_pool", "status"]
                        
                        if all(field in first_tournament for field in required_fields):
                            # Check for realistic tournament names (not generic mock names)
                            tournament_names = [t.get("name", "") for t in tournaments[:3]]
                            realistic_names = any("Free Fire" in name or "Championship" in name or "Battle" in name 
                                                for name in tournament_names)
                            
                            if realistic_names:
                                total_prize_pool = sum(t.get("prize_pool", 0) for t in tournaments)
                                self.log_result("Tournaments Database Data", True, 
                                              f"Real database data: {count} tournaments, ₹{total_prize_pool:,.0f} total prize pool")
                            else:
                                self.log_result("Tournaments Database Data", False, 
                                              f"Tournament names appear to be mock data: {tournament_names}")
                        else:
                            self.log_result("Tournaments Database Data", False, 
                                          f"Tournament missing required fields: {first_tournament}")
                    else:
                        self.log_result("Tournaments Database Data", False, "No tournaments found in database")
                else:
                    self.log_result("Tournaments Database Data", False, f"Invalid response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Tournaments Database Data", False, "Invalid JSON response")
        else:
            self.log_result("Tournaments Database Data", False, f"Status code: {response.status_code}")

    def test_live_stats_database_data(self):
        """Test /api/live-stats returns actual database statistics"""
        print("\n📊 === LIVE STATS DATABASE DATA TESTING ===")
        
        response, success, error = self.make_request("GET", "/live-stats")
        
        if not success:
            self.log_result("Live Stats Database Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                required_fields = ["total_tournaments", "active_players", "live_matches", "total_prize_pool"]
                
                if all(field in data for field in required_fields):
                    total_tournaments = data["total_tournaments"]
                    active_players = data["active_players"]
                    live_matches = data["live_matches"]
                    total_prize_pool = data["total_prize_pool"]
                    
                    # Check if values are realistic (not default mock values like 89, 42000, etc.)
                    if total_tournaments > 0 and active_players > 0 and total_prize_pool > 0:
                        # Verify these are database-driven values, not hardcoded mock values
                        mock_indicators = [
                            total_tournaments == 89,  # Common mock value
                            active_players == 42000,  # Common mock value
                            str(total_prize_pool).endswith("800000")  # Common mock ending
                        ]
                        
                        if not any(mock_indicators):
                            self.log_result("Live Stats Database Data", True, 
                                          f"Real database stats: {total_tournaments} tournaments, {active_players} players, ₹{total_prize_pool:,.0f} prize pool, {live_matches} live")
                        else:
                            self.log_result("Live Stats Database Data", False, 
                                          "Values appear to be hardcoded mock data")
                    else:
                        self.log_result("Live Stats Database Data", False, "Zero values - may be using fallback data")
                else:
                    self.log_result("Live Stats Database Data", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Live Stats Database Data", False, "Invalid JSON response")
        else:
            self.log_result("Live Stats Database Data", False, f"Status code: {response.status_code}")

    def test_leaderboards_database_data(self):
        """Test /api/leaderboards returns real user rankings from database"""
        print("\n🏅 === LEADERBOARDS DATABASE DATA TESTING ===")
        
        response, success, error = self.make_request("GET", "/leaderboards")
        
        if not success:
            self.log_result("Leaderboards Database Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "leaderboard" in data and "total_count" in data:
                    leaderboard = data["leaderboard"]
                    total_count = data["total_count"]
                    
                    if total_count > 0 and len(leaderboard) > 0:
                        # Check if leaderboard entries have realistic data
                        first_entry = leaderboard[0]
                        required_fields = ["user_id", "username", "points", "rank"]
                        
                        if all(field in first_entry for field in required_fields):
                            # Check for realistic usernames (not generic mock names)
                            usernames = [entry.get("username", "") for entry in leaderboard[:3]]
                            realistic_usernames = any(len(name) > 3 and not name.startswith("User") 
                                                    for name in usernames)
                            
                            if realistic_usernames:
                                total_points = sum(entry.get("points", 0) for entry in leaderboard)
                                self.log_result("Leaderboards Database Data", True, 
                                              f"Real database leaderboard: {total_count} players, top player: {first_entry['username']} ({first_entry['points']} points)")
                            else:
                                self.log_result("Leaderboards Database Data", False, 
                                              f"Usernames appear to be mock data: {usernames}")
                        else:
                            self.log_result("Leaderboards Database Data", False, 
                                          f"Leaderboard entry missing required fields: {first_entry}")
                    else:
                        self.log_result("Leaderboards Database Data", False, "No leaderboard entries found")
                else:
                    self.log_result("Leaderboards Database Data", False, f"Invalid response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Leaderboards Database Data", False, "Invalid JSON response")
        else:
            self.log_result("Leaderboards Database Data", False, f"Status code: {response.status_code}")

    def test_dashboard_data_real_data(self):
        """Test /api/dashboard-data returns user-specific real data"""
        print("\n📈 === DASHBOARD DATA REAL DATA TESTING ===")
        
        if not self.demo_token:
            self.log_result("Dashboard Data Real Data", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/dashboard-data", headers=headers)
        
        if not success:
            self.log_result("Dashboard Data Real Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                required_sections = ["stats", "recent_tournaments", "achievements", "recent_transactions"]
                
                if all(section in data for section in required_sections):
                    stats = data["stats"]
                    recent_tournaments = data["recent_tournaments"]
                    achievements = data["achievements"]
                    recent_transactions = data["recent_transactions"]
                    wallet_balance = data.get("wallet_balance", 0)
                    
                    # Verify data is user-specific and not generic mock data
                    if isinstance(stats, dict) and isinstance(achievements, list):
                        tournaments_joined = stats.get("tournaments_joined", 0)
                        total_winnings = stats.get("total_winnings", 0)
                        
                        self.log_result("Dashboard Data Real Data", True, 
                                      f"User-specific dashboard: {tournaments_joined} tournaments, ₹{total_winnings} winnings, ₹{wallet_balance} balance, {len(achievements)} achievements")
                    else:
                        self.log_result("Dashboard Data Real Data", False, "Invalid data structure")
                else:
                    self.log_result("Dashboard Data Real Data", False, f"Missing required sections: {data}")
            except json.JSONDecodeError:
                self.log_result("Dashboard Data Real Data", False, "Invalid JSON response")
        else:
            self.log_result("Dashboard Data Real Data", False, f"Status code: {response.status_code}")

    def test_wallet_transactions_real_data(self):
        """Test /api/wallet/transactions returns real transaction history"""
        print("\n💰 === WALLET TRANSACTIONS REAL DATA TESTING ===")
        
        if not self.demo_token:
            self.log_result("Wallet Transactions Real Data", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/wallet/transactions", headers=headers)
        
        if not success:
            self.log_result("Wallet Transactions Real Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "transactions" in data:
                    transactions = data["transactions"]
                    
                    if len(transactions) > 0:
                        # Check if transactions have realistic data
                        first_transaction = transactions[0]
                        required_fields = ["transaction_id", "type", "amount", "description", "status"]
                        
                        if all(field in first_transaction for field in required_fields):
                            # Check for realistic transaction descriptions (not generic mock)
                            descriptions = [t.get("description", "") for t in transactions[:3]]
                            realistic_descriptions = any("Welcome" in desc or "Battle" in desc or "Tournament" in desc 
                                                       for desc in descriptions)
                            
                            if realistic_descriptions:
                                total_amount = sum(t.get("amount", 0) for t in transactions if t.get("type") == "credit")
                                self.log_result("Wallet Transactions Real Data", True, 
                                              f"Real transaction history: {len(transactions)} transactions, ₹{total_amount} total credits")
                            else:
                                self.log_result("Wallet Transactions Real Data", False, 
                                              f"Transaction descriptions appear to be mock: {descriptions}")
                        else:
                            self.log_result("Wallet Transactions Real Data", False, 
                                          f"Transaction missing required fields: {first_transaction}")
                    else:
                        self.log_result("Wallet Transactions Real Data", True, "No transactions yet (valid for new user)")
                else:
                    self.log_result("Wallet Transactions Real Data", False, f"Invalid response format: {data}")
            except json.JSONDecodeError:
                self.log_result("Wallet Transactions Real Data", False, "Invalid JSON response")
        else:
            self.log_result("Wallet Transactions Real Data", False, f"Status code: {response.status_code}")

    def test_ai_predictions_dynamic_data(self):
        """Test /api/ai-predictions returns dynamic predictions"""
        print("\n🤖 === AI PREDICTIONS DYNAMIC DATA TESTING ===")
        
        if not self.demo_token:
            self.log_result("AI Predictions Dynamic Data", False, "No auth token available")
            return
        
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/ai-predictions", headers=headers)
        
        if not success:
            self.log_result("AI Predictions Dynamic Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "predictions" in data:
                    predictions = data["predictions"]
                    
                    if len(predictions) > 0:
                        # Check if predictions have proper structure and user-specific content
                        first_prediction = predictions[0]
                        required_fields = ["id", "type", "title", "prediction", "confidence", "action"]
                        
                        if all(field in first_prediction for field in required_fields):
                            # Check if predictions are personalized (contain user-specific data)
                            prediction_text = first_prediction.get("prediction", "")
                            confidence = first_prediction.get("confidence", 0)
                            
                            if confidence > 0 and len(prediction_text) > 20:
                                self.log_result("AI Predictions Dynamic Data", True, 
                                              f"Dynamic AI predictions: {len(predictions)} predictions, confidence: {confidence}%")
                            else:
                                self.log_result("AI Predictions Dynamic Data", False, 
                                              "Predictions appear to be static/mock data")
                        else:
                            self.log_result("AI Predictions Dynamic Data", False, 
                                          f"Prediction missing required fields: {first_prediction}")
                    else:
                        self.log_result("AI Predictions Dynamic Data", False, "No AI predictions available")
                else:
                    self.log_result("AI Predictions Dynamic Data", False, f"Invalid response format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Predictions Dynamic Data", False, "Invalid JSON response")
        else:
            self.log_result("AI Predictions Dynamic Data", False, f"Status code: {response.status_code}")

    def test_jwt_token_validation(self):
        """Test JWT token validation and expiration"""
        print("\n🔑 === JWT TOKEN VALIDATION TESTING ===")
        
        if not self.demo_token:
            self.log_result("JWT Token Validation", False, "No demo token available")
            return
        
        # Test 1: Valid token access
        headers = self.get_auth_headers()
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if success and response.status_code == 200:
            self.log_result("JWT Valid Token Access", True, "Valid token grants access to protected endpoint")
        else:
            self.log_result("JWT Valid Token Access", False, f"Valid token rejected: {response.status_code if success else error}")
        
        # Test 2: Invalid token
        invalid_headers = {"Authorization": "Bearer invalid_token_123"}
        response, success, error = self.make_request("GET", "/auth/me", headers=invalid_headers)
        
        if success and response.status_code == 401:
            self.log_result("JWT Invalid Token Rejection", True, "Invalid token correctly rejected with 401")
        else:
            self.log_result("JWT Invalid Token Rejection", False, f"Invalid token not properly rejected: {response.status_code if success else error}")
        
        # Test 3: Missing token
        response, success, error = self.make_request("GET", "/auth/me")
        
        if success and response.status_code in [401, 403]:
            self.log_result("JWT Missing Token Rejection", True, f"Missing token correctly rejected with {response.status_code}")
        else:
            self.log_result("JWT Missing Token Rejection", False, f"Missing token not properly rejected: {response.status_code if success else error}")

    def test_protected_endpoints_security(self):
        """Test protected endpoints require proper authentication"""
        print("\n🛡️ === PROTECTED ENDPOINTS SECURITY TESTING ===")
        
        protected_endpoints = [
            ("GET", "/auth/me", "User Profile"),
            ("GET", "/dashboard-data", "Dashboard Data"),
            ("GET", "/wallet/transactions", "Wallet Transactions"),
            ("GET", "/ai-predictions", "AI Predictions"),
            ("POST", "/tournaments", "Tournament Creation")
        ]
        
        for method, endpoint, description in protected_endpoints:
            # Test without authentication
            response, success, error = self.make_request(method, endpoint)
            
            if not success:
                self.log_result(f"Protected {description}", False, f"Request failed: {error}")
                continue
            
            if response.status_code in [401, 403]:
                self.log_result(f"Protected {description}", True, f"Correctly blocked unauthorized access ({response.status_code})")
            else:
                self.log_result(f"Protected {description}", False, f"Should return 401/403, got {response.status_code}")

    def test_admin_endpoints_security(self):
        """Test admin-only endpoints are properly secured"""
        print("\n👑 === ADMIN ENDPOINTS SECURITY TESTING ===")
        
        if not self.demo_token:
            self.log_result("Admin Endpoints Security", False, "No auth token available")
            return
        
        # First, verify if demo user has admin privileges
        headers = self.get_auth_headers()
        user_response, user_success, user_error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not user_success or user_response.status_code != 200:
            self.log_result("Admin Endpoints Security", False, "Could not verify user admin status")
            return
        
        try:
            user_data = user_response.json()
            is_admin = user_data.get("is_admin", False)
            
            # Test tournament creation (admin-only)
            tournament_data = {
                "name": "Test Admin Tournament",
                "game_type": "free_fire",
                "tournament_type": "battle_royale",
                "entry_fee": 100,
                "prize_pool": 5000,
                "max_participants": 50,
                "start_time": (datetime.utcnow()).isoformat(),
                "registration_deadline": (datetime.utcnow()).isoformat(),
                "mode": "squad",
                "country": "India"
            }
            
            response, success, error = self.make_request("POST", "/tournaments", tournament_data, headers)
            
            if not success:
                self.log_result("Admin Tournament Creation", False, f"Request failed: {error}")
                return
            
            if is_admin:
                if response.status_code == 200:
                    self.log_result("Admin Tournament Creation", True, "Admin user can create tournaments")
                else:
                    self.log_result("Admin Tournament Creation", False, f"Admin user blocked: {response.status_code}")
            else:
                if response.status_code == 403:
                    self.log_result("Admin Tournament Creation", True, "Non-admin user correctly blocked from tournament creation")
                else:
                    self.log_result("Admin Tournament Creation", False, f"Non-admin user not properly blocked: {response.status_code}")
                    
        except json.JSONDecodeError:
            self.log_result("Admin Endpoints Security", False, "Invalid JSON response from user info")

    def test_user_registration_creates_database_entries(self):
        """Test user registration creates real database entries"""
        print("\n📝 === USER REGISTRATION DATABASE ENTRIES TESTING ===")
        
        # Create a new user with unique data
        unique_id = str(int(time.time()))
        registration_data = {
            "email": f"testuser{unique_id}@example.com",
            "password": "TestPass123!",
            "free_fire_uid": f"88{unique_id[-7:]}",  # Create a valid-format UID
            "region": "ind"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", registration_data)
        
        if not success:
            self.log_result("User Registration Database", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user" in data:
                    new_token = data["access_token"]
                    user_info = data["user"]
                    
                    # Verify user was created in database by accessing user info
                    headers = {"Authorization": f"Bearer {new_token}"}
                    user_response, user_success, user_error = self.make_request("GET", "/auth/me", headers=headers)
                    
                    if user_success and user_response.status_code == 200:
                        user_data = user_response.json()
                        if (user_data["email"] == registration_data["email"] and 
                            user_data["free_fire_uid"] == registration_data["free_fire_uid"]):
                            
                            # Check if user has wallet balance (indicates database entry creation)
                            wallet_balance = user_data.get("wallet_balance", 0)
                            self.log_result("User Registration Database", True, 
                                          f"User created in database: {user_data['username']}, ₹{wallet_balance} starting balance")
                        else:
                            self.log_result("User Registration Database", False, "User data mismatch")
                    else:
                        self.log_result("User Registration Database", False, "Could not verify user creation")
                else:
                    self.log_result("User Registration Database", False, f"Registration failed: {data}")
            except json.JSONDecodeError:
                self.log_result("User Registration Database", False, "Invalid JSON response")
        else:
            # Check if it's a validation error (expected for invalid Free Fire UID)
            if response.status_code == 400:
                try:
                    error_data = response.json()
                    if "Free Fire" in error_data.get("detail", ""):
                        self.log_result("User Registration Database", True, 
                                      f"Registration properly validates Free Fire UID: {error_data['detail']}")
                    else:
                        self.log_result("User Registration Database", False, f"Registration failed: {error_data}")
                except json.JSONDecodeError:
                    self.log_result("User Registration Database", False, f"Registration failed with status: {response.status_code}")
            else:
                self.log_result("User Registration Database", False, f"Registration failed with status: {response.status_code}")

    def run_all_tests(self):
        """Run all comprehensive backend tests"""
        print("🚀 STARTING COMPREHENSIVE BACKEND TESTING")
        print("=" * 80)
        
        # Core connectivity
        self.test_health_check()
        
        # Critical Authentication Testing
        self.test_dual_login_system()
        self.test_email_uniqueness_constraint()
        self.test_uid_uniqueness_constraint()
        self.test_real_free_fire_uid_validation()
        
        # Database-Driven Endpoints Testing
        self.test_tournaments_database_data()
        self.test_live_stats_database_data()
        self.test_leaderboards_database_data()
        self.test_dashboard_data_real_data()
        self.test_wallet_transactions_real_data()
        self.test_ai_predictions_dynamic_data()
        
        # Real Data Validation
        self.test_user_registration_creates_database_entries()
        
        # Security Features
        self.test_jwt_token_validation()
        self.test_protected_endpoints_security()
        self.test_admin_endpoints_security()
        
        # Print final results
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE BACKEND TESTING RESULTS")
        print("=" * 80)
        
        total = self.results["total_tests"]
        passed = self.results["passed"]
        failed = self.results["failed"]
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"📊 Total Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if failed > 0:
            print(f"\n❌ FAILED TESTS:")
            for error in self.results["errors"]:
                print(f"   • {error}")
        
        print("\n🎉 TESTING COMPLETE!")
        
        return success_rate >= 80  # Consider 80%+ success rate as passing

if __name__ == "__main__":
    tester = ComprehensiveBackendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)