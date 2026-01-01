// src/pages/AdminDashboard/pages/AdminLogin.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient";

const ADMIN_PRIMARY = "#dc3545";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    verificarSeJaEstaLogado();
  }, []);

  const verificarSeJaEstaLogado = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Verificar se é admin
        const admins = [
          'comprasmartconsult@gmail.com',
          'agnes@comprasmart.com',
          // Adicione mais emails admin aqui
        ];

        if (admins.includes(user.email)) {
          navigate('/admin/dashboard');
        } else {
          setError('Você não tem permissão de administrador.');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Fazer login com Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/callback`,
        },
      });

      if (error) throw error;

    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🔧</div>
          <h2 style={styles.title}>Painel Administrativo</h2>
          <p style={styles.subtitle}>CompraSmart</p>
        </div>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <strong>⚠️ Acesso Restrito</strong><br />
            Esta área é exclusiva para administradores do sistema.
          </p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>❌ {error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.loginButton,
            backgroundColor: loading ? '#6c757d' : ADMIN_PRIMARY,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '🔄 Redirecionando...' : '🔑 Entrar com Google'}
        </button>

        <div style={styles.info}>
          <p style={styles.infoText}>
            ℹ️ Apenas emails autorizados podem acessar esta área.
          </p>
        </div>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>
            ← Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    maxWidth: '450px',
    width: '100%',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '4rem',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: ADMIN_PRIMARY,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ffc107',
  },
  warningText: {
    margin: 0,
    fontSize: '14px',
    color: '#856404',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #dc3545',
  },
  errorText: {
    margin: 0,
    fontSize: '14px',
    color: '#721c24',
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  info: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    border: '1px solid #b3d9ff',
  },
  infoText: {
    margin: 0,
    fontSize: '13px',
    color: '#004085',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '25px',
  },
  backLink: {
    color: '#2c5aa0',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default AdminLogin;