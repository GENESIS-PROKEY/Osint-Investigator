import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

export default api;

// API methods
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const search = {
  search: (query, type) => api.get('/api/search', { params: { q: query, type } }),
  stats: () => api.get('/api/stats'),
};

export const admin = {
  getUsers: () => api.get('/admin/users'),
  getTeams: () => api.get('/admin/teams'),
  getAnalytics: () => api.get('/admin/analytics'),
  uploadData: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload-data', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createTeam: (name, plan_type, total_searches, limit_allocation, admin_user_id) =>
    api.post('/admin/teams', null, {
      params: { name, plan_type, total_searches, limit_allocation, admin_user_id },
    }),
  updateTeam: (teamId, updates) =>
    api.put(`/admin/teams/${teamId}`, null, { params: updates }),
  addTeamMember: (teamId, userId) =>
    api.post(`/admin/teams/${teamId}/members`, null, { params: { user_id: userId } }),
  removeTeamMember: (teamId, userId) =>
    api.delete(`/admin/teams/${teamId}/members/${userId}`),
};

export const billing = {
  createCheckoutSession: (planKey, successUrl, cancelUrl) =>
    api.post('/billing/create-checkout-session', {
      plan_key: planKey,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
};
