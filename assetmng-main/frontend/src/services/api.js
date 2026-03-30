import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
    createProfile: async (profileData) => {
        return await axios.post(`${API_URL}/profiles/`, profileData);
    },
    
    getProfile: async (name) => {
        return await axios.get(`${API_URL}/profiles/${name}`);
    },
    
    updateExpenses: async (name, expenses) => {
        return await axios.put(`${API_URL}/profiles/${name}/expenses`, expenses);
    }
};