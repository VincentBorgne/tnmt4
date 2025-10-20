import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4174';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tournament ID from environment
export const TOURNAMENT_ID = import.meta.env.VITE_TOURNAMENT_ID || 'aims-nov-2025';

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

  // Get registration report
  getReport: async (tournamentId: string) => {
    const response = await api.get(`/api/registration/${tournamentId}/report`);
    return response.data;
  },
};