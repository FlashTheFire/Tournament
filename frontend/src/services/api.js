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

// API Key Management
class APIKeyManager {
  static API_KEY_STORAGE_KEY = 'ff_api_key';
  static API_CLIENT_ID_KEY = 'ff_client_id';

  static async generateAPIKey() {
    try {
      const clientData = {
        client_id: `ff_client_${Date.now()}`,
        app_name: 'Free Fire Tournament Platform'
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/generate-key`,
        clientData
      );

      if (response.data.success) {
        localStorage.setItem(this.API_KEY_STORAGE_KEY, response.data.api_key);
        localStorage.setItem(this.API_CLIENT_ID_KEY, response.data.client_id);
        console.log('✅ API Key generated and stored');
        return response.data.api_key;
      }
    } catch (error) {
      console.error('❌ Failed to generate API key:', error);
      throw error;
    }
  }

  static getAPIKey() {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static getClientId() {
    return localStorage.getItem(this.API_CLIENT_ID_KEY);
  }

  static async ensureAPIKey() {
    let apiKey = this.getAPIKey();
    if (!apiKey) {
      console.log('🔑 Generating new API key...');
      apiKey = await this.generateAPIKey();
    }
    return apiKey;
  }
}

// Request interceptor to add auth token and API key
api.interceptors.request.use(
  async (config) => {
    // Add JWT token for authenticated endpoints
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add API key for secure endpoints (like Free Fire validation)
    if (config.url && config.url.includes('/api/validate-freefire')) {
      try {
        const apiKey = await APIKeyManager.ensureAPIKey();
        config.headers.Authorization = `Bearer ${apiKey}`;
        console.log('🔑 Added API key to request');
      } catch (error) {
        console.error('❌ Failed to get API key:', error);
        throw new Error('Failed to authenticate API request');
      }
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
    console.log('🔵 API Response interceptor success:', response.data);
    return response.data;
  },
  (error) => {
    console.error('🔴 API Interceptor Error:', error);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle different types of error structures
    let errorMessage = 'An error occurred';
    
    console.log('🔵 Processing error response:', error.response?.data);
    console.log('🔵 Response status:', error.response?.status);
    
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      console.log('🔵 Error detail:', detail);
      console.log('🔵 Detail type:', typeof detail);
      console.log('🔵 Detail is array:', Array.isArray(detail));
      
      // Handle FastAPI validation errors (array of error objects)
      if (Array.isArray(detail)) {
        console.log('🔵 Processing array of validation errors');
        const errorMessages = detail.map(err => {
          console.log('🔵 Individual error:', err, 'Type:', typeof err);
          if (err && typeof err === 'object' && err.msg) {
            return String(err.msg);
          }
          return typeof err === 'string' ? err : 'Validation error';
        });
        errorMessage = errorMessages.join(', ');
      } 
      // Handle simple string errors
      else if (typeof detail === 'string') {
        console.log('🔵 Processing string error');
        errorMessage = detail;
      }
      // Handle error objects with message/msg
      else if (detail && typeof detail === 'object') {
        console.log('🔵 Processing object error');
        errorMessage = String(detail.message || detail.msg || 'Invalid request');
      }
      // Fallback for any other detail type
      else {
        console.log('🔵 Unknown detail type, converting to string');
        errorMessage = String(detail || 'Unknown error');
      }
    } else if (error.response?.data) {
      console.log('🔵 No detail, using data directly');
      const data = error.response.data;
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || 'Request failed';
      }
    } else if (error.message) {
      console.log('🔵 Using error message');
      errorMessage = String(error.message);
    }
    
    console.log('🔵 Final processed error message:', errorMessage);
    console.log('🔵 Error message type:', typeof errorMessage);
    
    // Ensure errorMessage is always a string
    if (typeof errorMessage !== 'string') {
      console.error('🔴 ERROR: errorMessage is not a string:', errorMessage);
      errorMessage = 'An error occurred';
    }
    
    console.log('🔵 Final error message (guaranteed string):', errorMessage);
    
    // Store clean error message for components to use
    error.cleanMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

// API Service object with all methods
export const apiService = {
  // =====================
  // Utility Functions
  // =====================
  
  // Set authentication token
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  },

  // =====================
  // Authentication APIs
  // =====================
  
  async login(credentials) {
    console.log('🔵 API Service login called with:', credentials);
    const response = await api.post('/api/auth/login', credentials);
    console.log('🔵 API Service login response:', response);
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

  // Alias for consistency with Home.js
  async getLeaderboard(gameType = 'free_fire', tournamentId = null, limit = 50) {
    return this.getLeaderboards(gameType, tournamentId, limit);
  },

  // =====================
  // Live Stats APIs
  // =====================

  async getLiveStats() {
    const response = await api.get('/api/live-stats');
    return response;
  },

  // =====================
  // AI Predictions APIs
  // =====================

  async getAIPredictions() {
    const response = await api.get('/api/ai-predictions');
    return response;
  },

  // =====================
  // Dashboard APIs
  // =====================

  async getDashboardData() {
    const response = await api.get('/api/dashboard-data');
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