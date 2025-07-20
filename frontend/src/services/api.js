import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error Message:', errorMessage);
    
    return Promise.reject(error);
  }
);

// API Service object with all methods
export const apiService = {
  // =====================
  // Authentication APIs
  // =====================
  
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response;
  },

  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response;
  },

  async verifyFireFireUID(data) {
    const response = await api.post('/api/auth/verify-freefire', data);
    return response;
  },

  // =====================
  // Tournament APIs
  // =====================

  async getTournaments(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/api/tournaments?${queryParams}`);
    return response;
  },

  async getTournament(tournamentId) {
    const response = await api.get(`/api/tournaments/${tournamentId}`);
    return response;
  },

  async createTournament(tournamentData) {
    const response = await api.post('/api/tournaments', tournamentData);
    return response;
  },

  async registerForTournament(tournamentId) {
    const response = await api.post(`/api/tournaments/${tournamentId}/register`);
    return response;
  },

  async getUserTournaments() {
    const response = await api.get('/api/user/tournaments');
    return response;
  },

  // =====================
  // Payment APIs
  // =====================

  async createPaymentQR(paymentData) {
    const response = await api.post('/api/payments/create-qr', paymentData);
    return response;
  },

  async checkPaymentStatus(orderId) {
    const response = await api.get(`/api/payments/${orderId}/status`);
    return response;
  },

  // =====================
  // Leaderboard APIs
  // =====================

  async getLeaderboards(gameType = 'free_fire', tournamentId = null, limit = 50) {
    const params = new URLSearchParams({ 
      game_type: gameType,
      limit: limit.toString()
    });
    if (tournamentId) {
      params.append('tournament_id', tournamentId);
    }
    const response = await api.get(`/api/leaderboards?${params.toString()}`);
    return response;
  },

  // =====================
  // AI Analytics APIs
  // =====================

  async getMatchmakingAnalysis(tournamentId) {
    const response = await api.get(`/api/ai/matchmaking-analysis?tournament_id=${tournamentId}`);
    return response;
  },

  async getTournamentPrediction(tournamentId) {
    const response = await api.get(`/api/ai/tournament-prediction/${tournamentId}`);
    return response;
  },

  async getPlayerAnalytics(userId) {
    const response = await api.get(`/api/ai/player-analytics/${userId}`);
    return response;
  },

  // =====================
  // Admin APIs
  // =====================

  async getAdminStats() {
    const response = await api.get('/api/admin/stats');
    return response;
  },

  async getAdminUsers(skip = 0, limit = 20, params = {}) {
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...params
    }).toString();
    const response = await api.get(`/api/admin/users?${queryParams}`);
    return response;
  },

  async updateUser(userId, updateData) {
    const response = await api.put(`/api/admin/users/${userId}`, updateData);
    return response;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response;
  },

  async getAdminTournaments(skip = 0, limit = 20, params = {}) {
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...params
    }).toString();
    const response = await api.get(`/api/admin/tournaments?${queryParams}`);
    return response;
  },

  async updateTournament(tournamentId, updateData) {
    const response = await api.put(`/api/admin/tournaments/${tournamentId}`, updateData);
    return response;
  },

  async deleteTournament(tournamentId) {
    const response = await api.delete(`/api/admin/tournaments/${tournamentId}`);
    return response;
  },

  async getAdminPayments(skip = 0, limit = 20, params = {}) {
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...params
    }).toString();
    const response = await api.get(`/api/admin/payments?${queryParams}`);
    return response;
  },

  async getAdminAnalyticsOverview() {
    const response = await api.get('/api/admin/analytics/overview');
    return response;
  },

  async getAdminPlayerAnalytics(skip = 0, limit = 50, skillFilter = null) {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    if (skillFilter) {
      params.append('skill_filter', skillFilter);
    }
    const response = await api.get(`/api/admin/analytics/players?${params.toString()}`);
    return response;
  },

  async getAdminTournamentAnalytics() {
    const response = await api.get('/api/admin/analytics/tournaments');
    return response;
  },

  // =====================
  // Utility Functions
  // =====================

  // Health check
  async healthCheck() {
    const response = await api.get('/api/health');
    return response;
  },

  // File upload helper (if needed)
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }
};

// Export default for easier importing
export default apiService;