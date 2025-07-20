from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext
import uuid
import httpx
import json
import base64
from typing import Union
import qrcode
from io import BytesIO
import asyncio
import numpy as np

# Perplexity AI Configuration
PERPLEXITY_API_KEY = "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"
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Tournament Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.tournament_db

# Collections
users_collection = db.users
tournaments_collection = db.tournaments
registrations_collection = db.registrations
matches_collection = db.matches
payments_collection = db.payments
notifications_collection = db.notifications

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    full_name: str
    free_fire_uid: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TournamentCreate(BaseModel):
    name: str
    game_type: str  # "free_fire", "bgmi", "pubg"
    tournament_type: str  # "battle_royale", "clash_squad", "single_elimination", etc.
    entry_fee: float
    prize_pool: float
    max_participants: int
    start_time: datetime
    registration_deadline: datetime
    mode: str  # "solo", "duo", "squad"
    country: str
    description: str

class TournamentFilter(BaseModel):
    game_type: Optional[str] = None
    country: Optional[str] = None
    mode: Optional[str] = None
    status: Optional[str] = None

class PaymentCreate(BaseModel):
    tournament_id: str
    amount: float

class FreeFrieUserVerify(BaseModel):
    free_fire_uid: str

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"user_id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# AI-Powered Analytics Functions
def calculate_player_skill_score(player_stats: Dict[str, Any]) -> float:
    """Calculate a comprehensive skill score for matchmaking"""
    try:
        wins = player_stats.get('wins', 0)
        total_matches = player_stats.get('total_matches', 1)
        kills = player_stats.get('kills', 0)
        avg_damage = player_stats.get('avg_damage', 0)
        headshot_rate = float(player_stats.get('headshot_rate', '0%').replace('%', '')) / 100
        survival_rate = float(player_stats.get('survival_rate', '0%').replace('%', '')) / 100
        
        # Weighted skill calculation
        win_rate = wins / max(total_matches, 1)
        kd_ratio = kills / max(total_matches, 1)
        
        skill_score = (
            win_rate * 0.3 +
            survival_rate * 0.25 +
            (kd_ratio / 10) * 0.2 +  # Normalize kills per match
            (avg_damage / 2000) * 0.15 +  # Normalize average damage
            headshot_rate * 0.1
        ) * 100
        
        return min(skill_score, 100.0)  # Cap at 100
    except:
        return 50.0  # Default average skill

def predict_tournament_winner(tournament_participants: List[Dict]) -> Dict[str, Any]:
    """AI prediction for tournament winner based on player stats"""
    if not tournament_participants:
        return {"error": "No participants"}
    
    predictions = []
    total_skill = 0
    
    for participant in tournament_participants:
        player_stats = participant.get('free_fire_data', {})
        skill_score = calculate_player_skill_score(player_stats)
        total_skill += skill_score
        
        predictions.append({
            'user_id': participant['user_id'],
            'username': participant.get('username', 'Unknown'),
            'skill_score': skill_score,
            'recent_form': calculate_recent_form(participant),
            'prediction_factors': {
                'consistency': min(skill_score * 0.8, 95),
                'recent_performance': calculate_recent_form(participant),
                'tournament_experience': min(participant.get('tournaments_played', 0) * 2, 50)
            }
        })
    
    # Calculate win probabilities
    for prediction in predictions:
        if total_skill > 0:
            base_probability = (prediction['skill_score'] / total_skill) * 100
            # Add randomness and recent form influence
            recent_form_boost = prediction['recent_form'] * 0.15
            prediction['win_probability'] = min(base_probability + recent_form_boost, 85.0)
        else:
            prediction['win_probability'] = 100.0 / len(predictions)
    
    # Sort by win probability
    predictions.sort(key=lambda x: x['win_probability'], reverse=True)
    
    return {
        'top_contender': predictions[0] if predictions else None,
        'all_predictions': predictions,
        'confidence_level': calculate_prediction_confidence(predictions)
    }

def calculate_recent_form(participant: Dict) -> float:
    """Calculate recent performance form (0-100)"""
    # Mock recent form calculation - in production, this would analyze recent match history
    base_skill = calculate_player_skill_score(participant.get('free_fire_data', {}))
    # Add some realistic variation
    import random
    form_variation = random.uniform(-15, 15)
    return max(0, min(100, base_skill + form_variation))

def calculate_prediction_confidence(predictions: List[Dict]) -> float:
    """Calculate confidence level of predictions"""
    if len(predictions) < 2:
        return 50.0
    
    # Higher confidence when there's a clear skill gap
    top_prob = predictions[0]['win_probability']
    second_prob = predictions[1]['win_probability']
    skill_gap = top_prob - second_prob
    
    # More participants = lower confidence
    participant_factor = max(0, 100 - len(predictions) * 5)
    
    confidence = min(95.0, 50.0 + skill_gap + participant_factor)
    return confidence

def generate_matchmaking_recommendations(user_stats: Dict, available_tournaments: List[Dict]) -> List[Dict]:
    """Generate AI-powered tournament recommendations for a user"""
    user_skill = calculate_player_skill_score(user_stats.get('free_fire_data', {}))
    recommendations = []
    
    for tournament in available_tournaments:
        if tournament.get('status') != 'upcoming':
            continue
            
        # Get tournament participants for skill analysis
        participants = list(registrations_collection.find({"tournament_id": tournament.get('tournament_id', '')}))
        
        if not participants:
            # New tournament - recommend based on entry fee and user skill
            match_score = calculate_tournament_match_score(tournament, user_skill, [])
        else:
            # Calculate average skill of current participants
            avg_tournament_skill = 0
            participant_skills = []
            
            for reg in participants:
                participant = users_collection.find_one({"user_id": reg["user_id"]})
                if participant:
                    skill = calculate_player_skill_score(participant.get('free_fire_data', {}))
                    participant_skills.append(skill)
            
            if participant_skills:
                avg_tournament_skill = sum(participant_skills) / len(participant_skills)
            
            match_score = calculate_tournament_match_score(tournament, user_skill, participant_skills)
        
        if match_score > 30:  # Only recommend tournaments with decent match score
            recommendation = {
                'tournament': tournament,
                'match_score': match_score,
                'recommended_reason': get_recommendation_reason(match_score, user_skill, tournament),
                'win_probability': calculate_user_win_probability(user_skill, participant_skills if 'participant_skills' in locals() else []),
                'skill_level_match': get_skill_level_description(match_score)
            }
            recommendations.append(recommendation)
    
    # Sort by match score
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    return recommendations[:5]  # Return top 5 recommendations

def calculate_tournament_match_score(tournament: Dict, user_skill: float, participant_skills: List[float]) -> float:
    """Calculate how well a tournament matches a user's skill level"""
    base_score = 50.0
    
    # Entry fee vs skill alignment
    entry_fee = tournament.get('entry_fee', 0)
    if entry_fee == 0:
        fee_score = 20  # Free tournaments are always somewhat suitable
    elif user_skill > 70 and entry_fee > 200:
        fee_score = 30  # High skill players in premium tournaments
    elif user_skill < 50 and entry_fee < 100:
        fee_score = 30  # Beginners in low-stakes tournaments
    elif 50 <= user_skill <= 70 and 100 <= entry_fee <= 200:
        fee_score = 30  # Medium skill in medium stakes
    else:
        fee_score = 10  # Mismatched skill and stakes
    
    # Skill level compared to current participants
    if participant_skills:
        avg_participant_skill = sum(participant_skills) / len(participant_skills)
        skill_difference = abs(user_skill - avg_participant_skill)
        
        if skill_difference <= 10:
            skill_score = 30  # Very close skill match
        elif skill_difference <= 20:
            skill_score = 20  # Good skill match
        else:
            skill_score = 5   # Poor skill match
    else:
        skill_score = 15  # No participants yet
    
    # Tournament size factor
    current_participants = tournament.get('current_participants', 0)
    max_participants = tournament.get('max_participants', 100)
    
    if current_participants < max_participants * 0.7:
        size_score = 10  # Good chance to get in
    else:
        size_score = 5   # Tournament filling up
    
    return base_score + fee_score + skill_score + size_score

def get_recommendation_reason(match_score: float, user_skill: float, tournament: Dict) -> str:
    """Generate human-readable recommendation reason"""
    if match_score > 80:
        return "Perfect skill match! This tournament is ideal for your current level."
    elif match_score > 65:
        return "Great match! Your skills align well with this tournament's competition level."
    elif match_score > 50:
        return "Good opportunity to test your skills against similar-level players."
    elif user_skill > 70:
        return "Challenge yourself in this competitive tournament!"
    else:
        return "Good learning opportunity to improve your gameplay."

def calculate_user_win_probability(user_skill: float, participant_skills: List[float]) -> float:
    """Calculate user's probability of winning in a tournament"""
    if not participant_skills:
        # Base probability for empty tournament
        return min(85.0, user_skill * 0.8 + 15)
    
    # Count how many participants the user is better than
    better_than = sum(1 for skill in participant_skills if user_skill > skill)
    total_participants = len(participant_skills) + 1  # +1 for the user
    
    base_probability = (better_than + 1) / total_participants * 100
    
    # Adjust based on skill level
    if user_skill > 80:
        base_probability *= 1.2  # Boost for highly skilled players
    elif user_skill < 40:
        base_probability *= 0.8  # Reduce for low-skilled players
    
    return min(85.0, base_probability)

def get_skill_level_description(match_score: float) -> str:
    """Get human-readable skill level match description"""
    if match_score > 80:
        return "Perfect Match"
    elif match_score > 65:
        return "Great Match"
    elif match_score > 50:
        return "Good Match"
    elif match_score > 35:
        return "Challenging"
    else:
        return "High Risk"

def generate_player_analytics(user_data: Dict) -> Dict[str, Any]:
    """Generate comprehensive analytics for a player"""
    ff_data = user_data.get('free_fire_data', {})
    skill_score = calculate_player_skill_score(ff_data)
    
    # Get user's tournament history
    user_tournaments = list(registrations_collection.find({"user_id": user_data["user_id"]}))
    tournaments_played = len(user_tournaments)
    
    analytics = {
        'overall_performance': {
            'skill_score': round(skill_score, 1),
            'skill_tier': get_skill_tier(skill_score),
            'rank_position': calculate_rank_position(skill_score),
            'tournaments_played': tournaments_played,
            'estimated_rank': get_estimated_ff_rank(skill_score)
        },
        'combat_stats': {
            'kill_efficiency': calculate_kill_efficiency(ff_data),
            'survival_mastery': calculate_survival_mastery(ff_data),
            'accuracy_grade': get_accuracy_grade(ff_data.get('headshot_rate', '0%')),
            'damage_consistency': calculate_damage_consistency(ff_data)
        },
        'improvement_insights': generate_improvement_suggestions(ff_data, skill_score),
        'performance_trends': {
            'recent_form': calculate_recent_form(user_data),
            'skill_progression': 'Improving' if skill_score > 60 else 'Developing',
            'consistency_rating': get_consistency_rating(ff_data)
        },
        'competitive_analysis': {
            'vs_similar_players': compare_with_similar_players(skill_score),
            'tournament_readiness': assess_tournament_readiness(skill_score, tournaments_played),
            'recommended_focus_areas': get_focus_areas(ff_data, skill_score)
        }
    }
    
    return analytics

def get_skill_tier(skill_score: float) -> str:
    """Get skill tier based on score"""
    if skill_score >= 85:
        return "Grandmaster"
    elif skill_score >= 75:
        return "Master"
    elif skill_score >= 65:
        return "Diamond"
    elif skill_score >= 55:
        return "Platinum"
    elif skill_score >= 45:
        return "Gold"
    elif skill_score >= 35:
        return "Silver"
    else:
        return "Bronze"

def calculate_rank_position(skill_score: float) -> str:
    """Calculate approximate rank position"""
    if skill_score >= 85:
        return "Top 5%"
    elif skill_score >= 75:
        return "Top 15%"
    elif skill_score >= 65:
        return "Top 30%"
    elif skill_score >= 55:
        return "Top 50%"
    else:
        return "Bottom 50%"

def get_estimated_ff_rank(skill_score: float) -> str:
    """Get estimated Free Fire rank"""
    if skill_score >= 85:
        return "Grandmaster"
    elif skill_score >= 75:
        return "Heroic"
    elif skill_score >= 65:
        return "Elite"
    elif skill_score >= 55:
        return "Master"
    elif skill_score >= 45:
        return "Expert"
    else:
        return "Gold"

def calculate_kill_efficiency(ff_data: Dict) -> float:
    """Calculate kill efficiency score"""
    kills = ff_data.get('kills', 0)
    matches = ff_data.get('total_matches', 1)
    avg_kills_per_match = kills / max(matches, 1)
    # Normalize to 0-100 scale (assuming 5+ kills per match is excellent)
    return min(100, (avg_kills_per_match / 5.0) * 100)

def calculate_survival_mastery(ff_data: Dict) -> float:
    """Calculate survival mastery score"""
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    # Survival rate is already a percentage, adjust for Free Fire standards
    if survival_rate >= 30:
        return 95
    elif survival_rate >= 25:
        return 80
    elif survival_rate >= 20:
        return 65
    elif survival_rate >= 15:
        return 50
    else:
        return max(20, survival_rate * 2)

def get_accuracy_grade(headshot_rate: str) -> str:
    """Get accuracy grade based on headshot rate"""
    rate = float(headshot_rate.replace('%', ''))
    if rate >= 25:
        return "S+"
    elif rate >= 20:
        return "S"
    elif rate >= 18:
        return "A+"
    elif rate >= 15:
        return "A"
    elif rate >= 12:
        return "B+"
    elif rate >= 10:
        return "B"
    else:
        return "C"

def calculate_damage_consistency(ff_data: Dict) -> float:
    """Calculate damage consistency score"""
    avg_damage = ff_data.get('avg_damage', 0)
    # Free Fire damage consistency (assuming 1500+ avg damage is excellent)
    consistency_score = min(100, (avg_damage / 1500) * 100)
    return max(10, consistency_score)

def generate_improvement_suggestions(ff_data: Dict, skill_score: float) -> List[Dict]:
    """Generate personalized improvement suggestions"""
    suggestions = []
    
    # Analyze different aspects and provide targeted advice
    kill_efficiency = calculate_kill_efficiency(ff_data)
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    headshot_rate = float(ff_data.get('headshot_rate', '0%').replace('%', ''))
    avg_damage = ff_data.get('avg_damage', 0)
    
    if kill_efficiency < 50:
        suggestions.append({
            'category': 'Combat Skills',
            'priority': 'High',
            'suggestion': 'Focus on aggressive early-game positioning to secure more eliminations',
            'specific_tip': 'Practice hot-dropping in popular locations like Clock Tower or Peak'
        })
    
    if survival_rate < 20:
        suggestions.append({
            'category': 'Survival Strategy',
            'priority': 'Critical',
            'suggestion': 'Improve positioning and zone management to increase survival rate',
            'specific_tip': 'Stay near zone edges and avoid open areas during rotations'
        })
    
    if headshot_rate < 15:
        suggestions.append({
            'category': 'Aim Training',
            'priority': 'Medium',
            'suggestion': 'Enhance accuracy through headshot-focused training',
            'specific_tip': 'Use training mode with AK47 and M4A1 for 15 minutes daily'
        })
    
    if avg_damage < 1200:
        suggestions.append({
            'category': 'Engagement',
            'priority': 'Medium', 
            'suggestion': 'Increase damage output through better weapon selection and positioning',
            'specific_tip': 'Prefer AR weapons and engage from mid-range when possible'
        })
    
    # Skill-level specific suggestions
    if skill_score < 40:
        suggestions.append({
            'category': 'Foundation',
            'priority': 'High',
            'suggestion': 'Master basic movement mechanics and weapon handling',
            'specific_tip': 'Practice slide-shooting and jump-shooting techniques'
        })
    elif skill_score < 70:
        suggestions.append({
            'category': 'Tactical Awareness',
            'priority': 'Medium',
            'suggestion': 'Develop better game sense and team coordination',
            'specific_tip': 'Study minimap more frequently and communicate enemy positions'
        })
    
    return suggestions

def get_consistency_rating(ff_data: Dict) -> str:
    """Get consistency rating based on performance variance"""
    # Mock consistency calculation - in production would analyze match history variance
    skill_score = calculate_player_skill_score(ff_data)
    
    if skill_score >= 75:
        return "Very Consistent"
    elif skill_score >= 60:
        return "Consistent"
    elif skill_score >= 45:
        return "Somewhat Consistent"
    else:
        return "Inconsistent"

def compare_with_similar_players(skill_score: float) -> Dict:
    """Compare player with others in similar skill bracket"""
    # Mock comparison - in production would query database for similar players
    skill_tier = get_skill_tier(skill_score)
    
    return {
        'skill_tier': skill_tier,
        'percentile_rank': f"Top {100 - skill_score:.0f}%",
        'tier_average': {
            'kills_per_match': 3.2 + (skill_score / 100) * 2,
            'survival_rate': 15 + (skill_score / 100) * 15,
            'avg_damage': 1000 + (skill_score / 100) * 800
        },
        'comparison_summary': get_comparison_summary(skill_score)
    }

def get_comparison_summary(skill_score: float) -> str:
    """Get comparison summary text"""
    if skill_score >= 80:
        return "You're among the elite players! Your skills are exceptional."
    elif skill_score >= 65:
        return "You're performing better than most players in your tier."
    elif skill_score >= 50:
        return "You're around average for your skill level with room for improvement."
    else:
        return "Focus on fundamental skills to climb up the rankings."

def assess_tournament_readiness(skill_score: float, tournaments_played: int) -> Dict:
    """Assess if player is ready for competitive tournaments"""
    readiness_score = 0
    
    # Base skill assessment
    if skill_score >= 70:
        readiness_score += 40
    elif skill_score >= 55:
        readiness_score += 25
    else:
        readiness_score += 10
    
    # Experience factor
    if tournaments_played >= 10:
        readiness_score += 30
    elif tournaments_played >= 5:
        readiness_score += 20
    elif tournaments_played >= 1:
        readiness_score += 10
    
    # Consistency factor
    readiness_score += min(30, skill_score * 0.4)
    
    readiness_level = "Not Ready"
    if readiness_score >= 80:
        readiness_level = "Highly Ready"
    elif readiness_score >= 65:
        readiness_level = "Ready"
    elif readiness_score >= 45:
        readiness_level = "Somewhat Ready"
    
    return {
        'readiness_score': readiness_score,
        'readiness_level': readiness_level,
        'recommended_entry_fee': get_recommended_entry_fee(skill_score),
        'suitable_tournament_types': get_suitable_tournament_types(skill_score)
    }

def get_recommended_entry_fee(skill_score: float) -> str:
    """Get recommended tournament entry fee range"""
    if skill_score >= 80:
        return "₹200-500 (Premium tournaments)"
    elif skill_score >= 65:
        return "₹100-250 (Competitive tournaments)"
    elif skill_score >= 50:
        return "₹50-150 (Intermediate tournaments)"
    else:
        return "₹0-75 (Practice tournaments)"

def get_suitable_tournament_types(skill_score: float) -> List[str]:
    """Get suitable tournament types for player skill level"""
    if skill_score >= 75:
        return ["Battle Royale Championship", "Clash Squad Pro", "Elite Tournaments"]
    elif skill_score >= 60:
        return ["Standard Battle Royale", "Clash Squad", "Weekly Competitions"]
    elif skill_score >= 45:
        return ["Practice Tournaments", "Beginner Battle Royale", "Casual Clash Squad"]
    else:
        return ["Training Tournaments", "Skill Development", "Free Entry Events"]

def get_focus_areas(ff_data: Dict, skill_score: float) -> List[str]:
    """Get recommended focus areas for improvement"""
    focus_areas = []
    
    kill_efficiency = calculate_kill_efficiency(ff_data)
    survival_mastery = calculate_survival_mastery(ff_data)
    accuracy = float(ff_data.get('headshot_rate', '0%').replace('%', ''))
    damage_consistency = calculate_damage_consistency(ff_data)
    
    # Identify weakest areas
    areas_scores = [
        ("Combat Skills", kill_efficiency),
        ("Survival Strategy", survival_mastery),
        ("Aim & Accuracy", accuracy * 4),  # Scale to 0-100
        ("Damage Output", damage_consistency)
    ]
    
    # Sort by lowest scores first
    areas_scores.sort(key=lambda x: x[1])
    
    # Add top 3 weakest areas
    for area, score in areas_scores[:3]:
        if score < 70:  # Only suggest areas that need improvement
            focus_areas.append(area)
    
    return focus_areas if focus_areas else ["Overall Game Sense"]

# Helper functions for analytics
def calculate_kill_efficiency(ff_data: Dict) -> str:
    """Calculate kill efficiency rating"""
    kills = ff_data.get('kills', 0)
    total_matches = ff_data.get('total_matches', 1)
    kd_ratio = kills / max(total_matches, 1)
    
    if kd_ratio >= 8:
        return "Exceptional"
    elif kd_ratio >= 6:
        return "Excellent"
    elif kd_ratio >= 4:
        return "Good"
    elif kd_ratio >= 2:
        return "Average"
    else:
        return "Needs Improvement"

def calculate_survival_mastery(ff_data: Dict) -> str:
    """Calculate survival mastery rating"""
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    
    if survival_rate >= 35:
        return "Master Survivor"
    elif survival_rate >= 25:
        return "Skilled Survivor"
    elif survival_rate >= 20:
        return "Good Survivor"
    elif survival_rate >= 15:
        return "Average Survivor"
    else:
        return "Needs Practice"

def get_accuracy_grade(headshot_rate: str) -> str:
    """Get accuracy grade based on headshot rate"""
    rate = float(headshot_rate.replace('%', ''))
    
    if rate >= 25:
        return "S+"
    elif rate >= 20:
        return "S"
    elif rate >= 15:
        return "A"
    elif rate >= 10:
        return "B"
    elif rate >= 5:
        return "C"
    else:
        return "D"

def calculate_damage_consistency(ff_data: Dict) -> str:
    """Calculate damage consistency rating"""
    avg_damage = ff_data.get('avg_damage', 0)
    
    if avg_damage >= 2000:
        return "Highly Consistent"
    elif avg_damage >= 1500:
        return "Consistent"
    elif avg_damage >= 1000:
        return "Moderately Consistent"
    elif avg_damage >= 500:
        return "Inconsistent"
    else:
        return "Very Inconsistent"

def generate_improvement_suggestions(ff_data: Dict, skill_score: float) -> List[str]:
    """Generate improvement suggestions based on player stats"""
    suggestions = []
    
    # Analyze headshot rate
    headshot_rate = float(ff_data.get('headshot_rate', '0%').replace('%', ''))
    if headshot_rate < 15:
        suggestions.append("Practice aim training to improve headshot accuracy")
    
    # Analyze survival rate
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    if survival_rate < 20:
        suggestions.append("Focus on positioning and map awareness to survive longer")
    
    # Analyze damage
    avg_damage = ff_data.get('avg_damage', 0)
    if avg_damage < 1200:
        suggestions.append("Work on weapon mastery and engagement tactics")
    
    # Analyze win rate
    wins = ff_data.get('wins', 0)
    total_matches = ff_data.get('total_matches', 1)
    win_rate = (wins / max(total_matches, 1)) * 100
    if win_rate < 25:
        suggestions.append("Focus on end-game strategies and clutch situations")
    
    # General suggestions based on skill score
    if skill_score < 40:
        suggestions.append("Consider watching pro player streams and tutorials")
    elif skill_score < 60:
        suggestions.append("Practice in training mode daily to refine mechanics")
    
    return suggestions[:3]  # Return top 3 suggestions

def get_consistency_rating(ff_data: Dict) -> str:
    """Get overall consistency rating"""
    # Simple consistency calculation based on multiple factors
    headshot_rate = float(ff_data.get('headshot_rate', '0%').replace('%', ''))
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    avg_damage = ff_data.get('avg_damage', 0)
    
    consistency_score = (headshot_rate * 2 + survival_rate + avg_damage / 50) / 4
    
    if consistency_score >= 20:
        return "Very Consistent"
    elif consistency_score >= 15:
        return "Consistent"
    elif consistency_score >= 10:
        return "Moderately Consistent"
    else:
        return "Inconsistent"

def compare_with_similar_players(skill_score: float) -> str:
    """Compare player with similar skill level players"""
    if skill_score >= 80:
        return "Top tier - competing with the best players"
    elif skill_score >= 65:
        return "Above average - better than most players"
    elif skill_score >= 50:
        return "Average - typical skill level"
    elif skill_score >= 35:
        return "Below average - room for improvement"
    else:
        return "Beginner level - focus on fundamentals"

def assess_tournament_readiness(skill_score: float, tournaments_played: int) -> str:
    """Assess if player is ready for tournaments"""
    if skill_score >= 70 and tournaments_played >= 5:
        return "Tournament Ready - compete in high-stakes events"
    elif skill_score >= 55 and tournaments_played >= 2:
        return "Moderately Ready - try medium-stakes tournaments"
    elif skill_score >= 40:
        return "Beginner Ready - start with free tournaments"
    else:
        return "Not Ready - practice more before competing"

def get_focus_areas(ff_data: Dict, skill_score: float) -> List[str]:
    """Get recommended focus areas for improvement"""
    focus_areas = []
    
    headshot_rate = float(ff_data.get('headshot_rate', '0%').replace('%', ''))
    survival_rate = float(ff_data.get('survival_rate', '0%').replace('%', ''))
    avg_damage = ff_data.get('avg_damage', 0)
    
    if headshot_rate < 15:
        focus_areas.append("Aim Training")
    if survival_rate < 20:
        focus_areas.append("Positioning")
    if avg_damage < 1200:
        focus_areas.append("Combat Tactics")
    if skill_score < 50:
        focus_areas.append("Game Fundamentals")
    
    return focus_areas[:3]  # Return top 3 focus areas

# Demo API Functions
async def get_free_fire_user_info(uid: str) -> Dict[str, Any]:
    """Demo Free Fire API - returns mock user data"""
    # Simulate API call delay
    await asyncio.sleep(0.5)
    
    # Mock user data based on UID
    mock_users = {
        "123456789": {
            "uid": "123456789",
            "username": "ProGamer_FF",
            "level": 65,
            "rank": "Heroic",
            "total_matches": 1250,
            "wins": 342,
            "kills": 8750,
            "survival_rate": "27.4%",
            "avg_damage": 1847,
            "headshot_rate": "18.5%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        },
        "987654321": {
            "uid": "987654321", 
            "username": "FF_Champion",
            "level": 72,
            "rank": "Grand Master",
            "total_matches": 2100,
            "wins": 689,
            "kills": 15420,
            "survival_rate": "32.8%",
            "avg_damage": 2156,
            "headshot_rate": "22.1%",
            "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "is_verified": True
        }
    }
    
    # Return mock data or default
    return mock_users.get(uid, {
        "uid": uid,
        "username": f"Player_{uid[-4:]}",
        "level": 45,
        "rank": "Elite",
        "total_matches": 850,
        "wins": 187,
        "kills": 4250,
        "survival_rate": "22.0%",
        "avg_damage": 1456,
        "headshot_rate": "15.2%",
        "profile_pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "is_verified": False
    })

async def generate_paytm_qr(order_id: str, amount: float) -> Dict[str, Any]:
    """Demo Paytm API - generates mock QR code"""
    await asyncio.sleep(0.3)
    
    # Generate a simple QR code with order info
    qr_data = f"paytm://pay?order_id={order_id}&amount={amount}&merchant=demo"
    
    # Create QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Convert to base64 image
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        "qr_code": f"data:image/png;base64,{qr_base64}",
        "order_id": order_id,
        "amount": amount,
        "status": "pending",
        "expires_at": (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    }

async def check_payment_status(order_id: str) -> Dict[str, Any]:
    """Demo Paytm API - returns mock payment status"""
    await asyncio.sleep(0.2)
    
    # Simulate different payment statuses based on order_id
    if "success" in order_id.lower():
        status = "success"
    elif "failed" in order_id.lower():
        status = "failed"
    else:
        # Random status for demo
        import random
        status = random.choice(["success", "pending", "failed"])
    
    return {
        "order_id": order_id,
        "status": status,
        "transaction_id": f"TXN_{order_id}_{uuid.uuid4().hex[:8]}",
        "amount": 100.0,  # Mock amount
        "timestamp": datetime.utcnow().isoformat()
    }

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name,
        "password_hash": hashed_password,
        "free_fire_uid": user_data.free_fire_uid,
        "wallet_balance": 0.0,
        "is_verified": False,
        "is_admin": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "user_id": user_id,
        "token_type": "bearer"
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    return {
        "access_token": access_token,
        "user_id": user["user_id"],
        "token_type": "bearer"
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    # Remove sensitive information
    user_info = {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "full_name": current_user["full_name"],
        "free_fire_uid": current_user.get("free_fire_uid"),
        "wallet_balance": current_user["wallet_balance"],
        "is_verified": current_user["is_verified"],
        "is_admin": current_user.get("is_admin", False)
    }
    return user_info

@app.post("/api/tournaments")
async def create_tournament(tournament_data: TournamentCreate, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    tournament_id = str(uuid.uuid4())
    tournament_doc = {
        "tournament_id": tournament_id,
        "name": tournament_data.name,
        "game_type": tournament_data.game_type,
        "tournament_type": tournament_data.tournament_type,
        "entry_fee": tournament_data.entry_fee,
        "prize_pool": tournament_data.prize_pool,
        "max_participants": tournament_data.max_participants,
        "current_participants": 0,
        "start_time": tournament_data.start_time,
        "registration_deadline": tournament_data.registration_deadline,
        "mode": tournament_data.mode,
        "country": tournament_data.country,
        "description": tournament_data.description,
        "status": "upcoming",  # upcoming, live, completed, cancelled
        "created_by": current_user["user_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    tournaments_collection.insert_one(tournament_doc)
    
    return {"message": "Tournament created successfully", "tournament_id": tournament_id}

@app.get("/api/tournaments")
async def get_tournaments(
    skip: int = 0,
    limit: int = 20,
    game_type: Optional[str] = None,
    country: Optional[str] = None,
    mode: Optional[str] = None,
    status: Optional[str] = None
):
    # Build filter query
    filter_query = {}
    if game_type:
        filter_query["game_type"] = game_type
    if country:
        filter_query["country"] = country
    if mode:
        filter_query["mode"] = mode
    if status:
        filter_query["status"] = status
    
    # Get tournaments
    tournaments = list(tournaments_collection.find(filter_query).skip(skip).limit(limit).sort("created_at", -1))
    
    # Remove MongoDB ObjectIds and format response
    for tournament in tournaments:
        tournament.pop("_id", None)
        # Format dates for frontend
        tournament["start_time"] = tournament["start_time"].isoformat()
        tournament["registration_deadline"] = tournament["registration_deadline"].isoformat()
        tournament["created_at"] = tournament["created_at"].isoformat()
        tournament["updated_at"] = tournament["updated_at"].isoformat()
    
    return {"tournaments": tournaments, "total": len(tournaments)}

@app.get("/api/tournaments/{tournament_id}")
async def get_tournament(tournament_id: str):
    tournament = tournaments_collection.find_one({"tournament_id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    tournament.pop("_id", None)
    tournament["start_time"] = tournament["start_time"].isoformat()
    tournament["registration_deadline"] = tournament["registration_deadline"].isoformat()
    tournament["created_at"] = tournament["created_at"].isoformat()
    tournament["updated_at"] = tournament["updated_at"].isoformat()
    
    return tournament

@app.post("/api/auth/verify-freefire")
async def verify_free_fire_uid(verify_data: FreeFrieUserVerify, current_user: dict = Depends(get_current_user)):
    """Verify Free Fire UID and get user information"""
    try:
        # Call demo Free Fire API
        ff_user_data = await get_free_fire_user_info(verify_data.free_fire_uid)
        
        # Update user's Free Fire information
        users_collection.update_one(
            {"user_id": current_user["user_id"]},
            {
                "$set": {
                    "free_fire_uid": verify_data.free_fire_uid,
                    "free_fire_data": ff_user_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "message": "Free Fire UID verified successfully",
            "user_data": ff_user_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to verify Free Fire UID: {str(e)}")

@app.post("/api/payments/create-qr")
async def create_payment_qr(payment_data: PaymentCreate, current_user: dict = Depends(get_current_user)):
    """Generate Paytm QR code for tournament registration"""
    # Check if tournament exists
    tournament = tournaments_collection.find_one({"tournament_id": payment_data.tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Check if user already registered
    existing_registration = registrations_collection.find_one({
        "tournament_id": payment_data.tournament_id,
        "user_id": current_user["user_id"]
    })
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this tournament")
    
    # Create order ID
    order_id = f"ORD_{payment_data.tournament_id}_{current_user['user_id']}_{uuid.uuid4().hex[:8]}"
    
    try:
        # Generate QR code using demo Paytm API
        qr_data = await generate_paytm_qr(order_id, payment_data.amount)
        
        # Save payment record
        payment_doc = {
            "order_id": order_id,
            "user_id": current_user["user_id"],
            "tournament_id": payment_data.tournament_id,
            "amount": payment_data.amount,
            "status": "pending",
            "qr_code": qr_data["qr_code"],
            "expires_at": datetime.fromisoformat(qr_data["expires_at"]),
            "created_at": datetime.utcnow()
        }
        
        payments_collection.insert_one(payment_doc)
        
        return {
            "order_id": order_id,
            "qr_code": qr_data["qr_code"],
            "amount": payment_data.amount,
            "expires_at": qr_data["expires_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create payment: {str(e)}")

@app.get("/api/payments/{order_id}/status")
async def check_payment(order_id: str, current_user: dict = Depends(get_current_user)):
    """Check payment status"""
    # Find payment record
    payment = payments_collection.find_one({"order_id": order_id, "user_id": current_user["user_id"]})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    try:
        # Check status using demo Paytm API
        status_data = await check_payment_status(order_id)
        
        # Update payment status
        payments_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "status": status_data["status"],
                    "transaction_id": status_data.get("transaction_id"),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # If payment successful, register user for tournament
        if status_data["status"] == "success":
            tournament_id = payment["tournament_id"]
            
            # Check if not already registered
            existing_registration = registrations_collection.find_one({
                "tournament_id": tournament_id,
                "user_id": current_user["user_id"]
            })
            
            if not existing_registration:
                # Create registration
                registration_doc = {
                    "registration_id": str(uuid.uuid4()),
                    "tournament_id": tournament_id,
                    "user_id": current_user["user_id"],
                    "payment_order_id": order_id,
                    "registered_at": datetime.utcnow(),
                    "status": "confirmed"
                }
                registrations_collection.insert_one(registration_doc)
                
                # Update tournament participant count
                tournaments_collection.update_one(
                    {"tournament_id": tournament_id},
                    {"$inc": {"current_participants": 1}}
                )
                
                # Update user wallet balance (add any refund if needed)
                # For now, just track successful payment
        
        return {
            "order_id": order_id,
            "status": status_data["status"],
            "transaction_id": status_data.get("transaction_id"),
            "amount": payment["amount"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to check payment status: {str(e)}")

@app.post("/api/tournaments/{tournament_id}/register")
async def register_for_tournament(tournament_id: str, current_user: dict = Depends(get_current_user)):
    """Register for a tournament (free tournaments or with confirmed payment)"""
    tournament = tournaments_collection.find_one({"tournament_id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Check if tournament is full
    if tournament["current_participants"] >= tournament["max_participants"]:
        raise HTTPException(status_code=400, detail="Tournament is full")
    
    # Check if registration deadline passed
    if datetime.utcnow() > tournament["registration_deadline"]:
        raise HTTPException(status_code=400, detail="Registration deadline has passed")
    
    # Check if user already registered
    existing_registration = registrations_collection.find_one({
        "tournament_id": tournament_id,
        "user_id": current_user["user_id"]
    })
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this tournament")
    
    # For free tournaments (entry_fee = 0)
    if tournament["entry_fee"] == 0:
        registration_doc = {
            "registration_id": str(uuid.uuid4()),
            "tournament_id": tournament_id,
            "user_id": current_user["user_id"],
            "payment_order_id": None,
            "registered_at": datetime.utcnow(),
            "status": "confirmed"
        }
        registrations_collection.insert_one(registration_doc)
        
        # Update participant count
        tournaments_collection.update_one(
            {"tournament_id": tournament_id},
            {"$inc": {"current_participants": 1}}
        )
        
        return {"message": "Successfully registered for tournament", "registration_id": registration_doc["registration_id"]}
    else:
        # For paid tournaments, require payment first
        raise HTTPException(status_code=400, detail="Payment required for this tournament. Use /api/payments/create-qr endpoint first.")

@app.get("/api/user/tournaments")
async def get_user_tournaments(current_user: dict = Depends(get_current_user)):
    """Get user's registered tournaments"""
    # Get user's registrations
    registrations = list(registrations_collection.find({"user_id": current_user["user_id"]}))
    
    # Get tournament details for each registration
    user_tournaments = []
    for registration in registrations:
        tournament = tournaments_collection.find_one({"tournament_id": registration["tournament_id"]})
        if tournament:
            tournament.pop("_id", None)
            tournament["start_time"] = tournament["start_time"].isoformat()
            tournament["registration_deadline"] = tournament["registration_deadline"].isoformat() 
            tournament["created_at"] = tournament["created_at"].isoformat()
            tournament["updated_at"] = tournament["updated_at"].isoformat()
            tournament["registration_status"] = registration["status"]
            tournament["registered_at"] = registration["registered_at"].isoformat()
            user_tournaments.append(tournament)
    
    return {"tournaments": user_tournaments}

@app.get("/api/leaderboards")
async def get_leaderboards(
    game_type: Optional[str] = "free_fire",
    tournament_id: Optional[str] = None,
    limit: int = 50
):
    """Get leaderboards - demo data for now"""
    # Mock leaderboard data
    mock_leaderboard = [
        {
            "rank": 1,
            "user_id": "user1",
            "username": "ProGamer_FF",
            "kills": 245,
            "wins": 89,
            "points": 8750,
            "level": 65,
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        },
        {
            "rank": 2,
            "user_id": "user2", 
            "username": "FF_Champion",
            "kills": 220,
            "wins": 82,
            "points": 8200,
            "level": 72,
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        },
        # Add more mock data...
    ]
    
    # Add more mock entries
    for i in range(3, limit + 1):
        mock_leaderboard.append({
            "rank": i,
            "user_id": f"user{i}",
            "username": f"Player_{i:03d}",
            "kills": max(10, 250 - (i * 5)),
            "wins": max(5, 90 - (i * 2)),
            "points": max(100, 9000 - (i * 50)),
            "level": max(10, 70 - i),
            "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        })
    
    return {
        "leaderboard": mock_leaderboard[:limit],
        "game_type": game_type,
        "tournament_id": tournament_id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)