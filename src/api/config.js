// app-frontend/src/api/config.js

// ====================================
// CONFIGURACAO NICA DA API
// ====================================

export const API_CONFIG = {
    baseURL: 'https://plataforma-consultoria-mvp.onrender.com',
    timeout: 30000, // 30 segundos
    
    endpoints: {
        // CONSULTOR
        consultor: {
            register: '/api/consultores/register',
            login: '/api/consultores/login',
            profile: '/api/consultores/profile',
            metricas: (id, periodo) => `/api/consultores/metricas/${id}?periodo=${periodo}`,
            lojas: '/api/consultores/lojas',
        },
        
        // LOJISTA
        lojista: {
            register: '/api/lojistas/register',
            login: '/api/lojistas/login',
            profile: '/api/lojistas/profile',
            produtos: '/api/lojistas/produtos',
            vendedores: '/api/lojistas/vendedores',
            filiais: '/api/lojistas/filiais',
        },
        
        // VENDEDOR
        vendedor: {
            register: '/api/vendedores/register',
            login: '/api/vendedores/login',
            profile: '/api/vendedores/profile',
        },
        
        // COMPARTILHADOS
        vendas: {
            criar: '/api/vendas/criar',
            listar: (consultorId) => `/api/vendas/consultor/${consultorId}`,
            buscar: (id) => `/api/vendas/${id}`,
            enviarQRCode: '/api/vendas/enviar-qrcode',
        },
        
        payment: {
            create: '/api/payment/create',
            webhook: '/api/webhooks/stripe',
        },
    },
};

// ====================================
// HELPER FUNCTIONS
// ====================================

export const getFullUrl = (endpoint) => {
    return `${API_CONFIG.baseURL}${endpoint}`;
};

export const makeRequest = async (endpoint, options = {}) => {
    const url = getFullUrl(endpoint);
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };
    
    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(' Erro na requisicao:', error);
        throw error;
    }
};

export default API_CONFIG;
