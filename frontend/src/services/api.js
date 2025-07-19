import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
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

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.Authorization;
    }
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/api/health');
    return response.data;
  }

  // Authentication
  async login(email, password) {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/api/auth/register', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  async verifyFreeFire(uid) {
    const response = await this.client.post('/api/auth/verify-freefire', { 
      free_fire_uid: uid 
    });
    return response.data;
  }

  // Tournaments
  async getTournaments(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await this.client.get(`/api/tournaments?${params}`);
    return response.data;
  }

  async getTournament(id) {
    const response = await this.client.get(`/api/tournaments/${id}`);
    return response.data;
  }

  async createTournament(tournamentData) {
    const response = await this.client.post('/api/tournaments', tournamentData);
    return response.data;
  }

  async registerForTournament(tournamentId) {
    const response = await this.client.post(`/api/tournaments/${tournamentId}/register`);
    return response.data;
  }

  async getUserTournaments() {
    const response = await this.client.get('/api/user/tournaments');
    return response.data;
  }

  // Payments
  async createPaymentQR(tournamentId, amount) {
    const response = await this.client.post('/api/payments/create-qr', {
      tournament_id: tournamentId,
      amount: amount
    });
    return response.data;
  }

  async checkPaymentStatus(orderId) {
    const response = await this.client.get(`/api/payments/${orderId}/status`);
    return response.data;
  }

  // Leaderboards
  async getLeaderboards(gameType = 'free_fire', tournamentId = null) {
    const params = new URLSearchParams();
    if (gameType) params.append('game_type', gameType);
    if (tournamentId) params.append('tournament_id', tournamentId);
    
    const response = await this.client.get(`/api/leaderboards?${params}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;