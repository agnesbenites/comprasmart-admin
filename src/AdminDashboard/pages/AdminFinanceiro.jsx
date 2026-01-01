// admin-frontend/src/AdminDashboard/pages/AdminFinanceiro.jsx - COMPLETO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FaDollarSign, FaChartLine, FaShoppingCart, FaPercent,
  FaCalendar, FaDownload, FaFilter, FaStore, FaUsers,
  FaMoneyBillWave, FaCreditCard, FaFileInvoiceDollar
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminFinanceiro = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [financeiro, setFinanceiro] = useState({
    // Resumo Geral
    faturamentoTotal: 0,
    totalVendas: 0,
    ticketMedio: 0,
    comissoesTotais: 0,
    comissoesAPagar: 0,
    comissoesPagas: 0,

    // Detalhamento
    faturamentoPorLoja: [],
    comissoesPorConsultor: [],
    vendasPorDia: [],
    metodoPagamento: [],

    // Taxas e Margens
    taxaComissaoMedia: 0,
    margemLucro: 0,
    crescimentoMensal: 0,
  });

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // 1. VENDAS TOTAIS
      const { data: vendas, error: vendasError } = await supabase
        .from('vendas')
        .select('*');

      if (vendasError) throw vendasError;

      const totalVendas = vendas?.length || 0;
      const faturamento = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;
      const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

      // 2. COMISSÕES
      const { data: comissoes, error: comissoesError } = await supabase
        .from('comissoes')
        .select('*');

      if (comissoesError) throw comissoesError;

      const totalComissoes = comissoes?.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;
      
      const comissoesPagas = comissoes
        ?.filter(c => c.status === 'paga')
        .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;

      const comissoesAPagar = comissoes
        ?.filter(c => c.status === 'pendente')
        .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;

      // 3. FATURAMENTO POR LOJA
      const { data: lojas } = await supabase
        .from('lojas_corrigida')
        .select('id, nome_fantasia, nome');

      const faturamentoPorLoja = lojas?.map(loja => {
        const vendasLoja = vendas?.filter(v => v.loja_id === loja.id) || [];
        const total = vendasLoja.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0);
        return {
          loja: loja.nome_fantasia || loja.nome,
          faturamento: total,
          quantidade: vendasLoja.length,
        };
      }).filter(l => l.faturamento > 0)
        .sort((a, b) => b.faturamento - a.faturamento)
        .slice(0, 10) || [];

      // 4. COMISSÕES POR CONSULTOR
      const { data: consultores } = await supabase
        .from('consultores')
        .select('id, nome');

      const comissoesPorConsultor = consultores?.map(consultor => {
        const comissoesConsultor = comissoes?.filter(c => c.consultor_id === consultor.id) || [];
        const total = comissoesConsultor.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0);
        const pendente = comissoesConsultor
          .filter(c => c.status === 'pendente')
          .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0);
        
        return {
          consultor: consultor.nome,
          total,
          pendente,
          pago: total - pendente,
          quantidade: comissoesConsultor.length,
        };
      }).filter(c => c.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10) || [];

      // 5. CÁLCULOS
      const taxaComissaoMedia = faturamento > 0 ? (totalComissoes / faturamento) * 100 : 0;
      const margemLucro = faturamento > 0 ? ((faturamento - totalComissoes) / faturamento) * 100 : 0;

      setFinanceiro({
        faturamentoTotal: faturamento,
        totalVendas,
        ticketMedio,
        comissoesTotais: totalComissoes,
        comissoesAPagar,
        comissoesPagas,
        faturamentoPorLoja,
        comissoesPorConsultor,
        vendasPorDia: [],
        metodoPagamento: [],
        taxaComissaoMedia,
        margemLucro,
        crescimentoMensal: 0,
      });

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarRelatorio = () => {
    const csv = `
RELATÓRIO FINANCEIRO - COMPRASMART
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO GERAL
Faturamento Total,R$ ${financeiro.faturamentoTotal.toFixed(2)}
Total de Vendas,${financeiro.totalVendas}
Ticket Médio,R$ ${financeiro.ticketMedio.toFixed(2)}
Comissões Totais,R$ ${financeiro.comissoesTotais.toFixed(2)}
Comissões Pagas,R$ ${financeiro.comissoesPagas.toFixed(2)}
Comissões a Pagar,R$ ${financeiro.comissoesAPagar.toFixed(2)}
Taxa de Comissão Média,${financeiro.taxaComissaoMedia.toFixed(2)}%
Margem de Lucro,${financeiro.margemLucro.toFixed(2)}%

FATURAMENTO POR LOJA
${financeiro.faturamentoPorLoja.map(l => 
  `${l.loja},R$ ${l.faturamento.toFixed(2)},${l.quantidade} vendas`
).join('\n')}

COMISSÕES POR CONSULTOR
${financeiro.comissoesPorConsultor.map(c => 
  `${c.consultor},Total: R$ ${c.total.toFixed(2)},Pago: R$ ${c.pago.toFixed(2)},Pendente: R$ ${c.pendente.toFixed(2)}`
).join('\n')}
    `.trim();

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeiro-comprasmart-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 Financeiro</h1>
          <p style={styles.subtitle}>Análise completa de faturamento e comissões</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={carregarDados} style={styles.refreshButton}>
            🔄 Atualizar
          </button>
          <button onClick={exportarRelatorio} style={styles.exportButton}>
            <FaDownload /> Exportar CSV
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
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
            <option value="tudo">Todo o Período</option>
          </select>
        </div>
        <button onClick={carregarDados} style={styles.filterButton}>
          <FaFilter /> Aplicar
        </button>
      </div>

      {/* Cards Principais */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Resumo Geral</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaDollarSign />}
            label="Faturamento Total"
            value={`R$ ${financeiro.faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#28a745"
            sublabel={`${financeiro.totalVendas} vendas`}
          />
          <MetricCard
            icon={<FaShoppingCart />}
            label="Ticket Médio"
            value={`R$ ${financeiro.ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#2c5aa0"
            sublabel="Por venda"
          />
          <MetricCard
            icon={<FaMoneyBillWave />}
            label="Comissões Totais"
            value={`R$ ${financeiro.comissoesTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#ffc107"
            sublabel={`${financeiro.taxaComissaoMedia.toFixed(1)}% do faturamento`}
          />
          <MetricCard
            icon={<FaPercent />}
            label="Margem de Lucro"
            value={`${financeiro.margemLucro.toFixed(1)}%`}
            color="#17a2b8"
            sublabel="Após comissões"
          />
        </div>
      </div>

      {/* Comissões Detalhadas */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💳 Situação de Comissões</h3>
        <div style={styles.comissoesGrid}>
          <ComissaoCard
            icon={<FaFileInvoiceDollar />}
            label="Comissões Pagas"
            value={`R$ ${financeiro.comissoesPagas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#28a745"
            status="success"
          />
          <ComissaoCard
            icon={<FaCreditCard />}
            label="Comissões a Pagar"
            value={`R$ ${financeiro.comissoesAPagar.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#dc3545"
            status="warning"
          />
        </div>
      </div>

      {/* Tabelas */}
      <div style={styles.tablesGrid}>
        {/* Faturamento por Loja */}
        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>
            <FaStore /> Top 10 Lojas por Faturamento
          </h3>
          {financeiro.faturamentoPorLoja.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma venda registrada</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Loja</th>
                  <th style={styles.th}>Vendas</th>
                  <th style={styles.th}>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {financeiro.faturamentoPorLoja.map((loja, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{loja.loja}</td>
                    <td style={styles.td}>{loja.quantidade}</td>
                    <td style={styles.tdBold}>
                      R$ {loja.faturamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Comissões por Consultor */}
        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>
            <FaUsers /> Top 10 Consultores por Comissão
          </h3>
          {financeiro.comissoesPorConsultor.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma comissão registrada</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Consultor</th>
                  <th style={styles.th}>Pago</th>
                  <th style={styles.th}>Pendente</th>
                  <th style={styles.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {financeiro.comissoesPorConsultor.map((consultor, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{consultor.consultor}</td>
                    <td style={{...styles.td, color: '#28a745'}}>
                      R$ {consultor.pago.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td style={{...styles.td, color: '#dc3545'}}>
                      R$ {consultor.pendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td style={styles.tdBold}>
                      R$ {consultor.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

const MetricCard = ({ icon, label, value, color, sublabel }) => (
  <div style={{...styles.metricCard, borderLeft: `4px solid ${color}`}}>
    <div style={{ ...styles.metricIcon, color }}>{icon}</div>
    <div style={styles.metricContent}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
      {sublabel && <p style={styles.metricSublabel}>{sublabel}</p>}
    </div>
  </div>
);

const ComissaoCard = ({ icon, label, value, color, status }) => (
  <div style={styles.comissaoCard}>
    <div style={{...styles.comissaoIcon, backgroundColor: color}}>
      {icon}
    </div>
    <div>
      <p style={styles.comissaoLabel}>{label}</p>
      <p style={{...styles.comissaoValue, color}}>{value}</p>
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
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exportButton: {
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
  filterButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
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
    margin: '0 0 3px 0',
  },
  metricSublabel: {
    fontSize: '0.8rem',
    color: '#999',
    margin: 0,
  },
  comissoesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  comissaoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  comissaoIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    color: 'white',
  },
  comissaoLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  comissaoValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0,
  },
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '20px',
  },
  tableCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem',
    borderBottom: '2px solid #e9ecef',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '12px',
    fontSize: '0.9rem',
    color: '#666',
  },
  tdBold: {
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '1rem',
  },
};

export default AdminFinanceiro;