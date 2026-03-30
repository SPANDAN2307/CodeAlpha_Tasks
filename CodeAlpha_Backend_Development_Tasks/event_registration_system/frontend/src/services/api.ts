import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEvents = () => api.get('/events');
export const getEventById = (id: string) => api.get(`/events/${id}`);
export const registerForEvent = (data: { eventId: string; userName: string; userEmail: string }) => 
  api.post('/registrations', data);
export const getUserRegistrations = (email: string) => api.get(`/registrations/user?email=${email}`);
export const cancelRegistration = (id: string) => api.delete(`/registrations/${id}`);

export default api;
