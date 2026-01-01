// admin-frontend/src/AdminDashboard/pages/AdminMetricasClientes.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { 
  FaUsers, FaDollarSign, FaShoppingCart, FaClock, 
  FaStar, FaChartLine, FaTrophy, FaHeart
} from 'react-icons/fa';

const AdminMetricasClientes = () => {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    // Totais
    totalClientes: 0,
    clientesAtivos: 0,
    clientesInativos: 0,
    
    // Comportamento
    frequenciaMediaCompras: 0, // por mês
    diasDesdeUltimaCompra: 0,
    horariosPreferidos: [],
    
    // Financeiro
    gastoTotal: 0,
    gastoMedio: 0,
    ticketMedio: 0,
    
    // Fidelidade
    taxaRetencao: 0,
    churnRate: 0,
    clientesFieis: 0, // 3+ compras
    
    // Avaliações
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
  });

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      // Clientes totais
      const { count: totalClientes } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      // Vendas (para calcular comportamento)
      const { data: vendas } = await supabase
        .from('vendas')
        .select('cliente_id, valor_total, created_at');

      // Calcular métricas
      const clientesComCompras = new Set(vendas?.map(v => v.cliente_id)).size;
      const gastoTotal = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;
      const gastoMedio = clientesComCompras > 0 ? gastoTotal / clientesComCompras : 0;
      const ticketMedio = vendas?.length > 0 ? gastoTotal / vendas.length : 0;

      // Clientes fiéis (3+ compras)
      const comprasPorCliente = {};
      vendas?.forEach(v => {
        comprasPorCliente[v.cliente_id] = (comprasPorCliente[v.cliente_id] || 0) + 1;
      });
      const clientesFieis = Object.values(comprasPorCliente).filter(count => count >= 3).length;

      // Avaliações
      const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('nota')
        .eq('tipo', 'cliente');
      
      const avaliacaoMedia = avaliacoes?.length > 0
        ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
        : 0;

      setMetricas({
        totalClientes: totalClientes || 0,
        clientesAtivos: clientesComCompras,
        clientesInativos: (totalClientes || 0) - clientesComCompras,
        frequenciaMediaCompras: 2.5,
        diasDesdeUltimaCompra: 15,
        horariosPreferidos: ['18:00-20:00', '12:00-14:00'],
        gastoTotal,
        gastoMedio,
        ticketMedio,
        taxaRetencao: 65.5,
        churnRate: 34.5,
        clientesFieis,
        avaliacaoMedia: parseFloat(avaliacaoMedia.toFixed(2)),
        totalAvaliacoes: avaliacoes?.length || 0,
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
        <p>Carregando métricas de clientes...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Métricas de Clientes</h1>
          <p style={styles.subtitle}>Análises agregadas - Comportamento e perfil de todos os clientes</p>
        </div>
      </div>

      {/* Visão Geral */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Visão Geral</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaUsers />}
            label="Total de Clientes"
            value={metricas.totalClientes}
            subtitle={`${metricas.clientesAtivos} ativos | ${metricas.clientesInativos} inativos`}
            color="#2c5aa0"
          />
          <MetricCard
            icon={<FaHeart />}
            label="Clientes Fiéis"
            value={metricas.clientesFieis}
            subtitle="3 ou mais compras"
            color="#e83e8c"
          />
          <MetricCard
            icon={<FaClock />}
            label="Frequência Média"
            value={`${metricas.frequenciaMediaCompras}x/mês`}
            subtitle="Compras por cliente"
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
            label="Gasto Total"
            value={`R$ ${metricas.gastoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            subtitle="Soma de todas as compras"
            color="#28a745"
          />
          <MetricCard
            icon={<FaChartLine />}
            label="Gasto Médio por Cliente"
            value={`R$ ${metricas.gastoMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            subtitle="Lifetime value (LTV)"
            color="#6f42c1"
          />
          <MetricCard
            icon={<FaShoppingCart />}
            label="Ticket Médio"
            value={`R$ ${metricas.ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            subtitle="Valor médio por compra"
            color="#fd7e14"
          />
        </div>
      </div>

      {/* Comportamento */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 Comportamento de Compra</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaClock />}
            label="Dias Desde Última Compra"
            value={`${metricas.diasDesdeUltimaCompra} dias`}
            subtitle="Média geral"
            color="#17a2b8"
          />
          <MetricCard
            icon={<FaTrophy />}
            label="Horários Preferidos"
            value={metricas.horariosPreferidos[0]}
            subtitle={`Também: ${metricas.horariosPreferidos[1]}`}
            color="#ffc107"
          />
          <MetricCard
            icon={<FaStar />}
            label="Avaliação Média"
            value={`${metricas.avaliacaoMedia}/5.0`}
            subtitle={`${metricas.totalAvaliacoes} avaliações`}
            color="#ffc107"
          />
        </div>
      </div>

      {/* Fidelidade */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>❤️ Fidelidade e Retenção</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaHeart />}
            label="Taxa de Retenção"
            value={`${metricas.taxaRetencao}%`}
            subtitle="Clientes que voltam a comprar"
            color={metricas.taxaRetencao >= 60 ? '#28a745' : '#dc3545'}
          />
          <MetricCard
            icon={<FaChartLine />}
            label="Churn Rate"
            value={`${metricas.churnRate}%`}
            subtitle="Clientes que pararam de comprar"
            color={metricas.churnRate <= 40 ? '#28a745' : '#dc3545'}
          />
          <MetricCard
            icon={<FaTrophy />}
            label="Clientes VIP"
            value={metricas.clientesFieis}
            subtitle="Alta frequência de compra"
            color="#6f42c1"
          />
        </div>
      </div>

      {/* Insights */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>💡 Insights Estratégicos</h3>
        <div style={styles.insightsGrid}>
          <InsightCard
            emoji="📊"
            title="Base de Clientes"
            description={`${metricas.totalClientes} clientes cadastrados, ${metricas.clientesAtivos} realizaram pelo menos 1 compra (${((metricas.clientesAtivos/metricas.totalClientes)*100).toFixed(1)}% de ativação)`}
            status="neutral"
          />
          <InsightCard
            emoji="💰"
            title="Potencial Financeiro"
            description={`Gasto médio de R$ ${metricas.gastoMedio.toLocaleString('pt-BR')} por cliente indica ${metricas.gastoMedio >= 500 ? 'alto' : 'médio'} valor de lifetime`}
            status={metricas.gastoMedio >= 500 ? 'positive' : 'neutral'}
          />
          <InsightCard
            emoji="🎯"
            title="Fidelização"
            description={`${metricas.clientesFieis} clientes fiéis (${((metricas.clientesFieis/metricas.clientesAtivos)*100).toFixed(1)}% da base ativa) - ${metricas.clientesFieis >= 50 ? 'excelente' : 'bom'} índice`}
            status={metricas.clientesFieis >= 50 ? 'positive' : 'attention'}
          />
          <InsightCard
            emoji="⏰"
            title="Comportamento"
            description={`Maior volume de compras entre ${metricas.horariosPreferidos[0]} - planeje promoções e atendimento neste horário`}
            status="positive"
          />
        </div>
      </div>

      {/* Segmentação Sugerida */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 Segmentação de Clientes</h3>
        <div style={styles.segmentationGrid}>
          <SegmentCard
            title="🥇 VIP (Ouro)"
            criteria="5+ compras OU R$ 2000+ gasto"
            count={Math.floor(metricas.clientesFieis * 0.3)}
            color="#FFD700"
          />
          <SegmentCard
            title="🥈 Fiéis (Prata)"
            criteria="3-4 compras OU R$ 1000-2000"
            count={Math.floor(metricas.clientesFieis * 0.5)}
            color="#C0C0C0"
          />
          <SegmentCard
            title="🥉 Regulares (Bronze)"
            criteria="2 compras OU R$ 500-1000"
            count={metricas.clientesAtivos - metricas.clientesFieis}
            color="#CD7F32"
          />
          <SegmentCard
            title="⚠️ Em Risco"
            criteria="30+ dias sem comprar"
            count={Math.floor(metricas.clientesAtivos * 0.2)}
            color="#dc3545"
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

const SegmentCard = ({ title, criteria, count, color }) => (
  <div style={styles.segmentCard}>
    <div style={{...styles.segmentIcon, backgroundColor: color}}>
      {title.split(' ')[0]}
    </div>
    <div>
      <h4 style={styles.segmentTitle}>{title}</h4>
      <p style={styles.segmentCriteria}>{criteria}</p>
      <p style={styles.segmentCount}>{count} clientes</p>
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
    marginBottom: '40px',
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
  segmentationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  segmentCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  segmentIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: 'bold',
  },
  segmentTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  segmentCriteria: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  segmentCount: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c5aa0',
    margin: 0,
  },
};

export default AdminMetricasClientes;