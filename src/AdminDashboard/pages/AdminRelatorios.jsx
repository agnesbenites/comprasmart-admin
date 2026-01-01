// admin-frontend/src/AdminDashboard/pages/AdminRelatorios.jsx - COMPLETO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FaChartBar, FaDownload, FaCalendar, FaFilter, 
  FaFileExcel, FaFilePdf, FaChartLine, FaShoppingCart
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminRelatorios = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes'); // dia, semana, mes, ano
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  
  const [relatorios, setRelatorios] = useState({
    vendasPorDia: [],
    topConsultores: [],
    topLojistas: [],
    faturamentoPorCategoria: [],
    resumoGeral: {
      totalVendas: 0,
      faturamentoTotal: 0,
      ticketMedio: 0,
      comissoesTotais: 0,
    }
  });

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('*');

      const totalVendas = vendas?.length || 0;
      const faturamento = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;
      const ticket = totalVendas > 0 ? faturamento / totalVendas : 0;

      // Comissões
      const { data: comissoes } = await supabase
        .from('comissoes')
        .select('valor');
      
      const totalComissoes = comissoes?.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;

      setRelatorios({
        vendasPorDia: [],
        topConsultores: [],
        topLojistas: [],
        faturamentoPorCategoria: [],
        resumoGeral: {
          totalVendas,
          faturamentoTotal: faturamento,
          ticketMedio: ticket,
          comissoesTotais: totalComissoes,
        }
      });

    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    alert('📊 Exportando para Excel...\n\nFuncionalidade em desenvolvimento');
  };

  const exportarPDF = () => {
    alert('📄 Exportando para PDF...\n\nFuncionalidade em desenvolvimento');
  };

  const exportarCSV = () => {
    const csv = `
Relatório CompraSmart
Data: ${new Date().toLocaleDateString('pt-BR')}

Resumo Geral:
Total de Vendas,${relatorios.resumoGeral.totalVendas}
Faturamento Total,R$ ${relatorios.resumoGeral.faturamentoTotal.toFixed(2)}
Ticket Médio,R$ ${relatorios.resumoGeral.ticketMedio.toFixed(2)}
Comissões Pagas,R$ ${relatorios.resumoGeral.comissoesTotais.toFixed(2)}
    `.trim();

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-comprasmart-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Relatórios e Análises</h1>
          <p style={styles.subtitle}>Dashboards e análises detalhadas</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={exportarExcel} style={styles.exportButton}>
            <FaFileExcel /> Excel
          </button>
          <button onClick={exportarPDF} style={styles.exportButton}>
            <FaFilePdf /> PDF
          </button>
          <button onClick={exportarCSV} style={styles.exportButtonPrimary}>
            <FaDownload /> CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filtersCard}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            <FaCalendar /> Período:
          </label>
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            style={styles.select}
          >
            <option value="dia">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
            <option value="customizado">Customizado</option>
          </select>
        </div>

        {periodo === 'customizado' && (
          <>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>De:</label>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Até:</label>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.dateInput}
              />
            </div>
          </>
        )}

        <button onClick={carregarDados} style={styles.filterButton}>
          <FaFilter /> Aplicar Filtros
        </button>
      </div>

      {/* Resumo Geral */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📈 Resumo Geral</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaShoppingCart />}
            label="Total de Vendas"
            value={relatorios.resumoGeral.totalVendas}
            color="#2c5aa0"
          />
          <MetricCard
            icon={<FaChartLine />}
            label="Faturamento Total"
            value={`R$ ${relatorios.resumoGeral.faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#28a745"
          />
          <MetricCard
            icon={<FaChartBar />}
            label="Ticket Médio"
            value={`R$ ${relatorios.resumoGeral.ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#ffc107"
          />
          <MetricCard
            icon={<FaChartLine />}
            label="Comissões Pagas"
            value={`R$ ${relatorios.resumoGeral.comissoesTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#17a2b8"
          />
        </div>
      </div>

      {/* Gráficos Placeholder */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Análise de Vendas</h3>
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Vendas por Dia</h4>
            <div style={styles.chartPlaceholder}>
              <FaChartLine size={60} color="#ccc" />
              <p style={styles.chartText}>Gráfico em desenvolvimento</p>
            </div>
          </div>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Faturamento por Categoria</h4>
            <div style={styles.chartPlaceholder}>
              <FaChartBar size={60} color="#ccc" />
              <p style={styles.chartText}>Gráfico em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🏆 Rankings</h3>
        <div style={styles.rankingsGrid}>
          <div style={styles.rankingCard}>
            <h4 style={styles.rankingTitle}>Top 5 Consultores</h4>
            <div style={styles.rankingPlaceholder}>
              <p style={styles.rankingText}>Dados serão carregados do Supabase</p>
            </div>
          </div>
          <div style={styles.rankingCard}>
            <h4 style={styles.rankingTitle}>Top 5 Lojistas</h4>
            <div style={styles.rankingPlaceholder}>
              <p style={styles.rankingText}>Dados serão carregados do Supabase</p>
            </div>
          </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
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
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  exportButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#333',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  exportButtonPrimary: {
    padding: '10px 20px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filtersCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '30px',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  select: {
    padding: '10px 15px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    minWidth: '150px',
  },
  dateInput: {
    padding: '10px 15px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  filterButton: {
    padding: '10px 20px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  chartPlaceholder: {
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  chartText: {
    fontSize: '0.95rem',
    color: '#999',
    marginTop: '15px',
  },
  rankingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  rankingCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  rankingTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  rankingPlaceholder: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  rankingText: {
    fontSize: '0.95rem',
    color: '#999',
  },
};

export default AdminRelatorios;