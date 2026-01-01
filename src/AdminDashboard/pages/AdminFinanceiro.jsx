// admin-frontend/src/AdminDashboard/pages/AdminFinanceiro.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { FaDollarSign, FaChartLine, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminFinanceiro = () => {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    faturamentoTotal: 0,
    vendasTotal: 0,
    comissoesTotal: 0,
    ticketMedio: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total');

      const faturamento = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;
      const ticket = vendas?.length > 0 ? faturamento / vendas.length : 0;

      // Comissões
      const { data: comissoes } = await supabase
        .from('comissoes')
        .select('valor');

      const totalComissoes = comissoes?.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;

      setMetricas({
        faturamentoTotal: faturamento,
        vendasTotal: vendas?.length || 0,
        comissoesTotal: totalComissoes,
        ticketMedio: ticket,
      });

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💰 Financeiro</h1>
        <p style={styles.subtitle}>Visão consolidada de faturamento e comissões</p>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard
          icon={<FaDollarSign />}
          label="Faturamento Total"
          value={`R$ ${metricas.faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
          color="#28a745"
        />
        <MetricCard
          icon={<FaShoppingCart />}
          label="Total de Vendas"
          value={metricas.vendasTotal}
          color="#2c5aa0"
        />
        <MetricCard
          icon={<FaChartLine />}
          label="Ticket Médio"
          value={`R$ ${metricas.ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
          color="#ffc107"
        />
        <MetricCard
          icon={<FaMoneyBillWave />}
          label="Comissões Pagas"
          value={`R$ ${metricas.comissoesTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
          color="#17a2b8"
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

const MetricCard = ({ icon, label, value, color }) => (
  <div style={{...styles.metricCard, borderLeft: `4px solid ${color}`}}>
    <div style={{ ...styles.metricIcon, color }}>{icon}</div>
    <div style={styles.metricContent}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
    </div>
  </div>
);

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: `4px solid ${ADMIN_PRIMARY}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  metricCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  metricIcon: {
    fontSize: '2.5rem',
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
};

export default AdminFinanceiro;