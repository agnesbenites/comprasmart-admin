// admin-frontend/src/AdminDashboard/pages/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ADMIN_PRIMARY = "#dc3545";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verificar se é admin
      const userRole = data.user?.user_metadata?.role;
      
      if (userRole !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('❌ Acesso negado! Apenas administradores.');
      }

      // Salvar token e redirecionar
      localStorage.setItem('adminToken', data.session.access_token);
      navigate('/dashboard');

    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🛒</span>
          </div>
          <h1 style={styles.title}>Painel Administrativo</h1>
          <p style={styles.subtitle}>CompraSmart</p>
        </div>

        <div style={styles.alert}>
          <span style={styles.alertIcon}>⚠️</span>
          <div>
            <strong>Acesso Restrito</strong>
            <br />
            Esta área é exclusiva para administradores do sistema.
          </div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={styles.errorAlert}>
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? '⏳ Entrando...' : '🔐 Entrar'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ℹ️ Apenas emails autorizados podem acessar esta área.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '4rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: ADMIN_PRIMARY,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  alert: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '25px',
    display: 'flex',
    gap: '12px',
    fontSize: '0.9rem',
    color: '#856404',
  },
  alertIcon: {
    fontSize: '1.2rem',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '0.9rem',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
  },
  footerText: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
  },
};

export default AdminLogin;