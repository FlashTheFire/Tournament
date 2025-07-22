const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Helper method to get headers
  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Helper method for API calls
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        free_fire_uid: userData.free_fire_uid,
        region: userData.region
      }),
    });
    
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async login(identifier, password) {
    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier, // Can be email or Free Fire UID
        password
      }),
    });
    
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getCurrentUser() {
    return await this.makeRequest('/api/auth/me');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Free Fire validation
  async validateFreeFireUID(uid, region) {
    return await this.makeRequest(`/api/validate-freefire?uid=${uid}&region=${region}`);
  }

  // Tournament endpoints
  async getTournaments(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.makeRequest(`/api/tournaments${queryString}`);
  }

  async getTournament(tournamentId) {
    return await this.makeRequest(`/api/tournaments/${tournamentId}`);
  }

  async createTournament(tournamentData) {
    return await this.makeRequest('/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });
  }

  // Leaderboards
  async getLeaderboards(category = 'overall') {
    return await this.makeRequest(`/api/leaderboards?category=${category}`);
  }

  // Live statistics
  async getLiveStats() {
    return await this.makeRequest('/api/live-stats');
  }

  // Dashboard data
  async getDashboardData() {
    return await this.makeRequest('/api/dashboard-data');
  }

  // Wallet and transactions
  async getWalletTransactions() {
    return await this.makeRequest('/api/wallet/transactions');
  }

  async addFunds(amount) {
    return await this.makeRequest('/api/wallet/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // AI predictions
  async getAIPredictions() {
    return await this.makeRequest('/api/ai-predictions');
  }

  // Payment endpoints
  async generateQRPayment(amount) {
    return await this.makeRequest('/api/payments', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async checkPaymentStatus(orderId) {
    return await this.makeRequest(`/api/payments/${orderId}/status`);
  }

  // Health check
  async healthCheck() {
    return await this.makeRequest('/api/health');
  }
}

export const apiService = new ApiService();
export default apiService;