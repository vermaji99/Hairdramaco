import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  loginWithGoogle: (token: string) => api.post('/auth/google', { token }),
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const userService = {
  getUsers: (search?: string) => api.get('/users', { params: { search } }),
};

export const taskService = {
  getTasks: (filter?: string) => api.get('/tasks', { params: { filter } }),
  getTask: (id: number) => api.get(`/tasks/${id}`),
  createTask: (data: any) => api.post('/tasks', data),
  updateTask: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
  completeTask: (id: number) => api.patch(`/tasks/${id}/complete`),
};

export default api;
