import axios from "axios";
import { supabase } from '../supabaseClient'; // NOVO: Importa o cliente Supabase

//  Ler a variavel de ambiente do Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(" Base URL do Axios:", API_BASE_URL);

// Criar inst¢ncia do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false, 
});

// Interceptor para adicionar token JWT do SUPABASE
api.interceptors.request.use(
  async (config) => {
    // Tenta obter o token da sessao atual do Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    const token = session?.access_token;
    
    if (token) {
      // Adiciona o token do Supabase para o seu Backend
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros de autenticacao
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(' Token expirado ou invalido. Redirecionando para login.');
      
      // Usa a funcao de Sign Out do Supabase (que tambem limpa a sessao)
      supabase.auth.signOut();
      
      // Redireciona para a pagina de login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Funcoes utilitarias do Supabase nao sao mais necessarias
// setSupabaseClient, setAuthToken sao removidas.

export default api;

