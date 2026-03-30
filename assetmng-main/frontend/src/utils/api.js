import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getProfile: () => api.get('/auth/me'),
};

export const userAPI = {
  getFinancialProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addExpense: (expense) => api.post('/users/expenses', expense),
  deleteExpense: (index) => api.delete(`/users/expenses/${index}`),
};

export const investmentAPI = {
  getRecommendations: () => api.get('/investments/recommendations'),
  getRiskProfiles: () => api.get('/investments/risk-profiles'),
};

export const stockAPI = {
  getLiveStocks: () => api.get('/stocks/live'),
  getTrending: () => api.get('/stocks/trending'),
  searchStock: (symbol) => api.get(`/stocks/search/${symbol}`),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio/'),
  addInvestment: (investment) => api.post('/portfolio/investment', investment),
  removeInvestment: (symbol) => api.delete(`/portfolio/investment/${symbol}`),
  getSummary: () => api.get('/portfolio/summary'),
  getPerformance: () => api.get('/portfolio/performance'),
};

export default api;