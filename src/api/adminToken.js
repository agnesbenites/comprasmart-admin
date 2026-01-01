// src/api/axiosConfig.js

import axios from "axios";

// Variavel de ambiente do CodeSandbox/React. Certifique-se que o nome 'REACT_APP_API_BASE_URL'
// corresponde ao que voca colocou no seu arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(" Base URL do Axios:", API_BASE_URL);
// Cria a inst¢ncia do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptador para adicionar o token de autenticacao em cada requisicao (Se necessario)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // Assumindo que voca guarda o token aqui
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

