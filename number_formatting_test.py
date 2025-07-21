#!/usr/bin/env python3
"""
Number Formatting Implementation Testing
Focus on testing numerical data endpoints and demo credentials as requested in review
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class NumberFormattingTester:
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
        
        print(f"🎯 Testing Number Formatting Implementation at: {self.api_url}")
        
        # Test data storage
        self.demo_token = None
        self.demo_user_id = None
        
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
            else:
                return None, False, "Unsupported HTTP method"
            
            return response, True, ""
        except requests.exceptions.RequestException as e:
            return None, False, str(e)

    def get_demo_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers with demo JWT token"""
        if not self.demo_token:
            return {}
        return {"Authorization": f"Bearer {self.demo_token}"}

    def test_demo_credentials_authentication(self):
        """Test demo@tournament.com / demo123 login as requested in review"""
        print("\n=== Testing Demo Credentials Authentication ===")
        
        # First try to register demo user if not exists
        demo_register_data = {
            "email": "demo@tournament.com",
            "password": "demo123",
            "username": "DemoUser",
            "full_name": "Demo Tournament User",
            "free_fire_uid": "987654321"
        }
        
        response, success, error = self.make_request("POST", "/auth/register", demo_register_data)
        
        if success and response.status_code == 200:
            print("📝 Demo user registered successfully")
        elif success and response.status_code == 400:
            print("📝 Demo user already exists, proceeding to login")
        else:
            print(f"⚠️ Demo user registration issue: {response.status_code if success else error}")
        
        # Now test login with demo credentials
        demo_login_data = {
            "email": "demo@tournament.com",
            "password": "demo123"
        }
        
        response, success, error = self.make_request("POST", "/auth/login", demo_login_data)
        
        if not success:
            self.log_result("Demo Credentials Authentication", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.demo_token = data["access_token"]
                    self.demo_user_id = data["user_id"]
                    self.log_result("Demo Credentials Authentication", True, 
                                  f"demo@tournament.com / demo123 login successful, token length: {len(self.demo_token)}")
                else:
                    self.log_result("Demo Credentials Authentication", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Demo Credentials Authentication", False, "Invalid JSON response")
        else:
            self.log_result("Demo Credentials Authentication", False, 
                          f"Status code: {response.status_code}, Response: {response.text}")

    def test_live_stats_numerical_data(self):
        """Test Live Stats API for proper numerical data formatting"""
        print("\n=== Testing Live Stats Numerical Data ===")
        
        response, success, error = self.make_request("GET", "/live-stats")
        
        if not success:
            self.log_result("Live Stats Numerical Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                required_fields = ["totalTournaments", "totalPrizePool", "activePlayers", "liveMatches"]
                
                if all(field in data for field in required_fields):
                    # Verify numerical data types and values
                    total_tournaments = data["totalTournaments"]
                    total_prize_pool = data["totalPrizePool"]
                    active_players = data["activePlayers"]
                    live_matches = data["liveMatches"]
                    
                    # Check if all values are proper numbers
                    if (isinstance(total_tournaments, (int, float)) and 
                        isinstance(total_prize_pool, (int, float)) and 
                        isinstance(active_players, (int, float)) and 
                        isinstance(live_matches, (int, float))):
                        
                        self.log_result("Live Stats Numerical Data", True, 
                                      f"All numerical fields properly formatted: tournaments={total_tournaments}, "
                                      f"prize_pool=₹{total_prize_pool:,.0f}, players={active_players}, matches={live_matches}")
                    else:
                        self.log_result("Live Stats Numerical Data", False, 
                                      f"Non-numeric values detected: {type(total_tournaments)}, {type(total_prize_pool)}, "
                                      f"{type(active_players)}, {type(live_matches)}")
                else:
                    self.log_result("Live Stats Numerical Data", False, f"Missing required fields: {data}")
            except json.JSONDecodeError:
                self.log_result("Live Stats Numerical Data", False, "Invalid JSON response")
        else:
            self.log_result("Live Stats Numerical Data", False, f"Status code: {response.status_code}")

    def test_tournaments_numerical_data(self):
        """Test Tournaments API for proper numerical data formatting"""
        print("\n=== Testing Tournaments Numerical Data ===")
        
        response, success, error = self.make_request("GET", "/tournaments")
        
        if not success:
            self.log_result("Tournaments Numerical Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "tournaments" in data:
                    tournaments = data["tournaments"]
                    
                    if len(tournaments) > 0:
                        # Check numerical fields in first tournament
                        first_tournament = tournaments[0]
                        numerical_fields = ["entry_fee", "prize_pool", "max_participants", "current_participants"]
                        
                        numerical_data_valid = True
                        field_values = {}
                        
                        for field in numerical_fields:
                            if field in first_tournament:
                                value = first_tournament[field]
                                field_values[field] = value
                                if not isinstance(value, (int, float)):
                                    numerical_data_valid = False
                                    break
                        
                        if numerical_data_valid:
                            self.log_result("Tournaments Numerical Data", True, 
                                          f"Tournament numerical fields properly formatted: {field_values}")
                        else:
                            self.log_result("Tournaments Numerical Data", False, 
                                          f"Invalid numerical data types in tournament: {field_values}")
                    else:
                        self.log_result("Tournaments Numerical Data", True, 
                                      "No tournaments available, but endpoint structure is correct")
                else:
                    self.log_result("Tournaments Numerical Data", False, f"Missing tournaments field: {data}")
            except json.JSONDecodeError:
                self.log_result("Tournaments Numerical Data", False, "Invalid JSON response")
        else:
            self.log_result("Tournaments Numerical Data", False, f"Status code: {response.status_code}")

    def test_leaderboards_numerical_data(self):
        """Test Leaderboards API for proper numerical data formatting"""
        print("\n=== Testing Leaderboards Numerical Data ===")
        
        response, success, error = self.make_request("GET", "/leaderboards")
        
        if not success:
            self.log_result("Leaderboards Numerical Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "leaderboard" in data and isinstance(data["leaderboard"], list):
                    leaderboard = data["leaderboard"]
                    
                    if len(leaderboard) > 0:
                        # Check numerical fields in first leaderboard entry
                        first_entry = leaderboard[0]
                        numerical_fields = ["rank", "skill_rating", "total_earnings", "tournaments_won"]
                        
                        numerical_data_valid = True
                        field_values = {}
                        
                        for field in numerical_fields:
                            if field in first_entry:
                                value = first_entry[field]
                                field_values[field] = value
                                if not isinstance(value, (int, float)):
                                    numerical_data_valid = False
                                    break
                        
                        if numerical_data_valid:
                            self.log_result("Leaderboards Numerical Data", True, 
                                          f"Leaderboard numerical fields properly formatted: {field_values}")
                        else:
                            self.log_result("Leaderboards Numerical Data", False, 
                                          f"Invalid numerical data types in leaderboard: {field_values}")
                    else:
                        self.log_result("Leaderboards Numerical Data", True, 
                                      "No leaderboard entries available, but endpoint structure is correct")
                else:
                    self.log_result("Leaderboards Numerical Data", False, f"Invalid leaderboard format: {data}")
            except json.JSONDecodeError:
                self.log_result("Leaderboards Numerical Data", False, "Invalid JSON response")
        else:
            self.log_result("Leaderboards Numerical Data", False, f"Status code: {response.status_code}")

    def test_dashboard_data_numerical_formatting(self):
        """Test Dashboard Data API for proper numerical formatting (requires auth)"""
        print("\n=== Testing Dashboard Data Numerical Formatting ===")
        
        if not self.demo_token:
            self.log_result("Dashboard Data Numerical Formatting", False, "No demo auth token available")
            return
        
        headers = self.get_demo_auth_headers()
        response, success, error = self.make_request("GET", "/dashboard-data", headers=headers)
        
        if not success:
            self.log_result("Dashboard Data Numerical Formatting", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "stats" in data:
                    stats = data["stats"]
                    numerical_fields = ["tournamentsJoined", "totalWinnings", "currentRank", "winRate"]
                    
                    numerical_data_valid = True
                    field_values = {}
                    
                    for field in numerical_fields:
                        if field in stats:
                            value = stats[field]
                            field_values[field] = value
                            if not isinstance(value, (int, float)):
                                numerical_data_valid = False
                                break
                    
                    if numerical_data_valid:
                        self.log_result("Dashboard Data Numerical Formatting", True, 
                                      f"Dashboard stats properly formatted: {field_values}")
                    else:
                        self.log_result("Dashboard Data Numerical Formatting", False, 
                                      f"Invalid numerical data types in dashboard: {field_values}")
                else:
                    self.log_result("Dashboard Data Numerical Formatting", False, f"Missing stats field: {data}")
            except json.JSONDecodeError:
                self.log_result("Dashboard Data Numerical Formatting", False, "Invalid JSON response")
        else:
            self.log_result("Dashboard Data Numerical Formatting", False, f"Status code: {response.status_code}")

    def test_ai_predictions_numerical_data(self):
        """Test AI Predictions API for proper numerical formatting (requires auth)"""
        print("\n=== Testing AI Predictions Numerical Data ===")
        
        if not self.demo_token:
            self.log_result("AI Predictions Numerical Data", False, "No demo auth token available")
            return
        
        headers = self.get_demo_auth_headers()
        response, success, error = self.make_request("GET", "/ai-predictions", headers=headers)
        
        if not success:
            self.log_result("AI Predictions Numerical Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "predictions" in data and isinstance(data["predictions"], list):
                    predictions = data["predictions"]
                    
                    if len(predictions) > 0:
                        # Check numerical fields in first prediction
                        first_prediction = predictions[0]
                        
                        if "confidence" in first_prediction:
                            confidence = first_prediction["confidence"]
                            if isinstance(confidence, (int, float)):
                                self.log_result("AI Predictions Numerical Data", True, 
                                              f"AI prediction confidence properly formatted: {confidence}%")
                            else:
                                self.log_result("AI Predictions Numerical Data", False, 
                                              f"Invalid confidence data type: {type(confidence)}")
                        else:
                            self.log_result("AI Predictions Numerical Data", False, 
                                          "Missing confidence field in prediction")
                    else:
                        self.log_result("AI Predictions Numerical Data", True, 
                                      "No predictions available, but endpoint structure is correct")
                else:
                    self.log_result("AI Predictions Numerical Data", False, f"Invalid predictions format: {data}")
            except json.JSONDecodeError:
                self.log_result("AI Predictions Numerical Data", False, "Invalid JSON response")
        else:
            self.log_result("AI Predictions Numerical Data", False, f"Status code: {response.status_code}")

    def test_user_profile_numerical_data(self):
        """Test User Profile API for proper numerical formatting (requires auth)"""
        print("\n=== Testing User Profile Numerical Data ===")
        
        if not self.demo_token:
            self.log_result("User Profile Numerical Data", False, "No demo auth token available")
            return
        
        headers = self.get_demo_auth_headers()
        response, success, error = self.make_request("GET", "/auth/me", headers=headers)
        
        if not success:
            self.log_result("User Profile Numerical Data", False, f"Request failed: {error}")
            return
        
        if response.status_code == 200:
            try:
                data = response.json()
                numerical_fields = ["wallet_balance"]
                
                numerical_data_valid = True
                field_values = {}
                
                for field in numerical_fields:
                    if field in data:
                        value = data[field]
                        field_values[field] = value
                        if not isinstance(value, (int, float)):
                            numerical_data_valid = False
                            break
                
                if numerical_data_valid:
                    self.log_result("User Profile Numerical Data", True, 
                                  f"User profile numerical fields properly formatted: {field_values}")
                else:
                    self.log_result("User Profile Numerical Data", False, 
                                  f"Invalid numerical data types in user profile: {field_values}")
            except json.JSONDecodeError:
                self.log_result("User Profile Numerical Data", False, "Invalid JSON response")
        else:
            self.log_result("User Profile Numerical Data", False, f"Status code: {response.status_code}")

    def test_database_seeding_status(self):
        """Test if database has been properly seeded with numerical data"""
        print("\n=== Testing Database Seeding Status ===")
        
        # Check multiple endpoints to see if database is seeded
        endpoints_to_check = [
            ("/tournaments", "tournaments"),
            ("/leaderboards", "leaderboard"),
            ("/live-stats", None)
        ]
        
        seeded_endpoints = 0
        total_endpoints = len(endpoints_to_check)
        
        for endpoint, data_key in endpoints_to_check:
            response, success, error = self.make_request("GET", endpoint)
            
            if success and response.status_code == 200:
                try:
                    data = response.json()
                    
                    if data_key:
                        # Check if data array has entries
                        if data_key in data and isinstance(data[data_key], list) and len(data[data_key]) > 0:
                            seeded_endpoints += 1
                            print(f"  ✅ {endpoint}: {len(data[data_key])} entries found")
                        else:
                            print(f"  ❌ {endpoint}: No data entries found")
                    else:
                        # For live-stats, check if values are non-zero
                        if any(data.get(field, 0) > 0 for field in ["totalTournaments", "totalPrizePool", "activePlayers"]):
                            seeded_endpoints += 1
                            print(f"  ✅ {endpoint}: Non-zero values found")
                        else:
                            print(f"  ❌ {endpoint}: All values are zero (fallback data)")
                            
                except json.JSONDecodeError:
                    print(f"  ❌ {endpoint}: Invalid JSON response")
            else:
                print(f"  ❌ {endpoint}: Request failed")
        
        if seeded_endpoints == total_endpoints:
            self.log_result("Database Seeding Status", True, 
                          f"All {total_endpoints} endpoints have seeded data")
        elif seeded_endpoints > 0:
            self.log_result("Database Seeding Status", False, 
                          f"Only {seeded_endpoints}/{total_endpoints} endpoints have seeded data")
        else:
            self.log_result("Database Seeding Status", False, 
                          "No endpoints have seeded data - database appears empty")

    def run_number_formatting_tests(self):
        """Run all number formatting specific tests"""
        print("🎯 STARTING NUMBER FORMATTING IMPLEMENTATION TESTING")
        print(f"Backend URL: {self.api_url}")
        print("=" * 70)
        
        # Test sequence focused on number formatting requirements
        self.test_demo_credentials_authentication()
        self.test_database_seeding_status()
        self.test_live_stats_numerical_data()
        self.test_tournaments_numerical_data()
        self.test_leaderboards_numerical_data()
        self.test_dashboard_data_numerical_formatting()
        self.test_ai_predictions_numerical_data()
        self.test_user_profile_numerical_data()
        
        # Print summary
        print("\n" + "=" * 70)
        print("🏁 NUMBER FORMATTING TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']} ✅")
        print(f"Failed: {self.results['failed']} ❌")
        print(f"Success Rate: {(self.results['passed']/self.results['total_tests']*100):.1f}%")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        print("\n" + "=" * 70)
        
        return self.results

if __name__ == "__main__":
    tester = NumberFormattingTester()
    results = tester.run_number_formatting_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)