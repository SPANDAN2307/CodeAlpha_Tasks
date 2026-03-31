import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getEvents = () => api.get('/events');
export const getEventById = (id: string) => api.get(`/events/${id}`);
export const registerForEvent = (data: { eventId: string; userName: string }) => 
  api.post('/registrations', data);
export const getUserRegistrations = () => api.get(`/registrations/user`);
export const cancelRegistration = (id: string) => api.delete(`/registrations/${id}`);
export const createEvent = (data: any) => api.post('/events', data);

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);

export default api;
