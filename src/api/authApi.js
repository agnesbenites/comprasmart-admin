// web-consultor/src/api/authApi.js

import axios from 'axios';

const RENDER_URL = 'https://plataforma-consultoria-mvp.onrender.com';
const BASE_URL = `${RENDER_URL}/api`; 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const loginConsultor = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        return response.data; 
    } catch (error) {
        throw error.response 
              ? error.response.data 
              : new Error('Erro de rede ou conexao com o servidor.');
    }
};
