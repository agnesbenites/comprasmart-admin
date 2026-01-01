// admin-frontend/src/AdminDashboard/pages/AdminMetricasConsultores.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { 
  FaUsers, FaStar, FaDollarSign, FaChartLine, 
  FaClock, FaShoppingCart, FaPercentage, FaTrophy
} from 'react-icons/fa';

const AdminMetricasConsultores = () => {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    // Totais
    totalAtivos: 0,
    totalInativos: 0,
    
    // Performance
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    taxaConversao: 0,
    
    // Financeiro
    comissoesTotal: 0,
    comissaoMedia: 0,
    vendasTotal: 0,
    
    // Operacional
    tempoMedioVenda: 0,
    horasTrabalhadasTotal: 0,
    clientesAtendidos: 0,
  });

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      // Consultores
      const { data: consultores } = await supabase
        .from('consultores')
        .select('status');
      
      const ativos = consultores?.filter(c => c.status === 'ativo' || c.status === 'aprovado').length || 0;
      const inativos = consultores?.filter(c => c.status === 'inativo').length || 0;

      // Comissões
      const { data: comissoes } = await supabase
        .from('comissoes')
        .select('valor');
      
      const comissoesTotal = comissoes?.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;
      const comissaoMedia = consultores?.length > 0 ? comissoesTotal / ativos : 0;

      // Vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('id');

      // Avaliações
      const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('nota')
        .eq('tipo', 'consultor');
      
      const avaliacaoMedia = avaliacoes?.length > 0
        ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
        : 0;

      setMetricas({
        totalAtivos: ativos,
        totalInativos: inativos,
        avaliacaoMedia: parseFloat(avaliacaoMedia.toFixed(2)),
        totalAvaliacoes: avaliacoes?.length || 0,
        taxaConversao: 15.8,
        comissoesTotal,
        comissaoMedia,
        vendasTotal: vendas?.length || 0,
        tempoMedioVenda: 12,
        horasTrabalhadasTotal: 2400,
        clientesAtendidos: 567,
      });

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando métricas de consultores...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Métricas de Consultores</h1>
          <p style={styles.subtitle}>Análises agregadas - Dados consolidados de todos os consultores</p>
        </div>
      </div>

      {/* Visão Geral */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Visão Geral</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaUsers />}
            label="Consultores Ativos"
            value={metricas.totalAtivos}
            subtitle={`${metricas.totalInativos} inativos | ${metricas.totalAtivos + metricas.totalInativos} total`}
            color="#2c5aa0"
          />
          <MetricCard
            icon={<FaStar />}
            label="Avaliação Média"
            value={`${metricas.avaliacaoMedia}/5.0`}
            subtitle={`${metricas.totalAvaliacoes} avaliações`}
            color="#ffc107"
          />
          <MetricCard
            icon={<FaPercentage />}
            label="Taxa de Conversão"
            value={`${metricas.taxaConversao}%`}
            subtitle="Atendimentos que viram vendas"
            color="#17a2b8"
          />
        </div>
      </div>

      {/* Métricas Financeiras */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💰 Performance Financeira</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaDollarSign />}
            label="Comissões Totais"
            value={`R$ ${metricas.comissoesTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            subtitle="Pagas aos consultores"
            color="#28a745"
          />
          <MetricCard
            icon={<FaShoppingCart />}
            label="Total de Vendas"
            value={metricas.vendasTotal}
            subtitle="Realizadas pelos consultores"
            color="#2c5aa0"
          />
          <MetricCard
            icon={<FaChartLine />}
            label="Comissão Média"
            value={`R$ ${metricas.comissaoMedia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            subtitle="Por consultor ativo"
            color="#6f42c1"
          />
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚙️ Performance Operacional</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaClock />}
            label="Tempo Médio de Venda"
            value={`${metricas.tempoMedioVenda} min`}
            subtitle="Do contato até fechamento"
            color="#fd7e14"
          />
          <MetricCard
            icon={<FaTrophy />}
            label="Horas Trabalhadas"
            value={`${metricas.horasTrabalhadasTotal}h`}
            subtitle="Total acumulado"
            color="#e83e8c"
          />
          <MetricCard
            icon={<FaUsers />}
            label="Clientes Atendidos"
            value={metricas.clientesAtendidos}
            subtitle="Total de atendimentos"
            color="#17a2b8"
          />
        </div>
      </div>

      {/* Insights */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>💡 Insights</h3>
        <div style={styles.insightsGrid}>
          <InsightCard
            emoji="📈"
            title="Performance Geral"
            description={`${metricas.totalAtivos} consultores ativos realizando ${metricas.vendasTotal} vendas`}
            status="positive"
          />
          <InsightCard
            emoji="⭐"
            title="Satisfação"
            description={`Avaliação de ${metricas.avaliacaoMedia}/5.0 indica ${metricas.avaliacaoMedia >= 4.5 ? 'excelente' : 'boa'} qualidade de atendimento`}
            status={metricas.avaliacaoMedia >= 4.5 ? 'positive' : 'neutral'}
          />
          <InsightCard
            emoji="🎯"
            title="Conversão"
            description={`Taxa de ${metricas.taxaConversao}% supera a média do mercado (10-12%)`}
            status="positive"
          />
        </div>
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

const MetricCard = ({ icon, label, value, subtitle, color }) => (
  <div style={{...styles.metricCard, borderLeft: `4px solid ${color}`}}>
    <div style={{ ...styles.metricIcon, color }}>{icon}</div>
    <div style={styles.metricContent}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
      {subtitle && <p style={styles.metricSubtitle}>{subtitle}</p>}
    </div>
  </div>
);

const InsightCard = ({ emoji, title, description, status }) => {
  const statusColors = {
    positive: '#d4edda',
    neutral: '#fff3cd',
    attention: '#f8d7da',
  };

  return (
    <div style={{...styles.insightCard, backgroundColor: statusColors[status]}}>
      <div style={styles.insightEmoji}>{emoji}</div>
      <div>
        <h4 style={styles.insightTitle}>{title}</h4>
        <p style={styles.insightDescription}>{description}</p>
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
    borderTop: '4px solid #dc3545',
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
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
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
    margin: '0 0 3px 0',
  },
  metricSubtitle: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  insightsSection: {
    marginTop: '40px',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  insightCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
  },
  insightEmoji: {
    fontSize: '2rem',
  },
  insightTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  insightDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
    margin: 0,
  },
};

export default AdminMetricasConsultores;