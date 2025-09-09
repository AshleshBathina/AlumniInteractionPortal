import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// Jobs Services
export const jobService = {
  getAllJobs: () => api.get('/jobs'),
  
  getJob: (id) => api.get(`/jobs/${id}`),
  
  createJob: (jobData) => api.post('/jobs', jobData),
  
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// Applications Services
export const applicationService = {
  applyForJob: (jobId, formData) => {
    return api.post(`/applications/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  
  getMyApplications: () => api.get('/applications/my-applications'),
  
  updateApplicationStatus: (id, status) => 
    api.put(`/applications/${id}/status`, { status })
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  getNotifications: () => api.get('/users/notifications'),
  
  markNotificationAsRead: (id) => api.put(`/users/notifications/${id}/read`)
};

const apiServices = {
  authService,
  jobService,
  applicationService,
  userService
};

export default apiServices;