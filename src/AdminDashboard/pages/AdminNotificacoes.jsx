// admin-frontend/src/AdminDashboard/pages/AdminNotificacoes.jsx

import React from 'react';
import { FaBell } from 'react-icons/fa';

const AdminNotificacoes = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaBell size={40} color="#2c5aa0" />
        <h1 style={styles.title}>Notificações</h1>
        <p style={styles.subtitle}>Sistema de notificações em desenvolvimento</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🚧 Em Construção</h2>
        <p style={styles.cardText}>
          O sistema de notificações está sendo desenvolvido e estará disponível em breve.
        </p>
        <p style={styles.cardText}>
          Funcionalidades planejadas:
        </p>
        <ul style={styles.list}>
          <li>Notificações push para lojistas</li>
          <li>Alertas de novos cadastros</li>
          <li>Notificações de vendas realizadas</li>
          <li>Alertas de sistema</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '20px',
  },
  cardText: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  list: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.8',
    paddingLeft: '20px',
  },
};

export default AdminNotificacoes;