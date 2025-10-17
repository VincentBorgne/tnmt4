import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// New tournament registration API
export const registrationApi = {
  // Create registration
  create: async (tournamentId: string, data: any) => {
    const response = await api.post(`/api/registration/${tournamentId}`, data);
    return response.data;
  },

  // Search partner
  searchPartner: async (tournamentId: string, whatsapp: string) => {
    const response = await api.get(
      `/api/registration/${tournamentId}/partner/search`,
      { params: { whatsapp } }
    );
    return response.data;
  },

  // Get stats (for admin)
  getStats: async (tournamentId: string) => {
    const response = await api.get(`/api/registration/${tournamentId}/stats`);
    return response.data;
  },
};