// admin-frontend/src/AdminDashboard/pages/AdminDashboard.jsx
// DASHBOARD FUNCIONAL - CONTROLE TOTAL + EXPORTAÇÃO

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import { 
  FaStore, FaUsers, FaDownload, FaToggleOn, FaToggleOff, 
  FaFileExcel, FaFilePdf, FaBell, FaCog, FaEye, FaEyeSlash
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // MÉTRICAS BÁSICAS
  const [metricas, setMetricas] = useState({
    lojistasAtivos: 0,
    lojistasTotal: 0,
    consultoresAtivos: 0,
    consultoresTotal: 0,
    vendasTotal: 0,
    faturamentoTotal: 0,
  });

  // CONTROLES DE FEATURES (SALVO NO SUPABASE)
  const [features, setFeatures] = useState({
    // Frontend Consultor
    consultorChatIA: true,
    consultorComissoes: true,
    consultorRanking: true,
    consultorTreinamentos: true,
    
    // Frontend Lojista
    lojistaCampanhas: true,
    lojistaRelatorios: true,
    lojistaVendedores: true,
    lojistaIndicacoes: true,
    
    // Sistema Geral
    sistemaNotificacoes: true,
    sistemaPagamentos: true,
    sistemaBiometria: true,
  });

  useEffect(() => {
    carregarDados();
    carregarFeatures();
  }, []);

  const carregarDados = async () => {
    try {
      // Lojas
      const { data: lojas } = await supabase
        .from('lojas_corrigida')
        .select('status');
      
      const lojistasAtivos = lojas?.filter(l => l.status === 'ativo').length || 0;

      // Consultores
      const { data: consultores } = await supabase
        .from('consultores')
        .select('status');
      
      const consultoresAtivos = consultores?.filter(c => c.status === 'ativo' || c.status === 'aprovado').length || 0;

      // Vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total');
      
      const faturamento = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;

      setMetricas({
        lojistasAtivos,
        lojistasTotal: lojas?.length || 0,
        consultoresAtivos,
        consultoresTotal: consultores?.length || 0,
        vendasTotal: vendas?.length || 0,
        faturamentoTotal: faturamento,
      });

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('features')
        .single();

      if (data && data.features) {
        setFeatures(data.features);
      }
    } catch (error) {
      console.log('Usando features padrão');
    }
  };

  const salvarFeatures = async () => {
    try {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .upsert({ 
          id: 1,
          features: features,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar features:', error);
        alert('⚠️ Não foi possível salvar. Tabela configuracoes_sistema não existe.');
      } else {
        alert('✅ Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const toggleFeature = (featureName) => {
    setFeatures(prev => ({ ...prev, [featureName]: !prev[featureName] }));
  };

  const exportarExcel = async () => {
    alert('📊 Exportando relatório em Excel...\n\nFuncionalidade em desenvolvimento.');
  };

  const exportarPDF = async () => {
    alert('📄 Exportando relatório em PDF...\n\nFuncionalidade em desenvolvimento.');
  };

  const exportarDadosCompletos = async () => {
    try {
      // Buscar todos os dados
      const [lojas, consultores, vendas] = await Promise.all([
        supabase.from('lojas_corrigida').select('*'),
        supabase.from('consultores').select('*'),
        supabase.from('vendas').select('*'),
      ]);

      const dados = {
        lojas: lojas.data || [],
        consultores: consultores.data || [],
        vendas: vendas.data || [],
        exportadoEm: new Date().toISOString(),
      };

      // Criar JSON e baixar
      const dataStr = JSON.stringify(dados, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprasmart-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert('✅ Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('❌ Erro ao exportar dados');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER COM AÇÕES PRINCIPAIS */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>⚙️ Painel de Controle Admin</h1>
          <p style={styles.subtitle}>Gerenciamento e Exportação de Dados</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={exportarExcel} style={styles.exportButton}>
            <FaFileExcel /> Excel
          </button>
          <button onClick={exportarPDF} style={styles.exportButton}>
            <FaFilePdf /> PDF
          </button>
          <button onClick={exportarDadosCompletos} style={styles.exportButtonPrimary}>
            <FaDownload /> Exportar Tudo
          </button>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS */}
      <div style={styles.quickMetrics}>
        <QuickMetric
          icon={<FaStore />}
          label="Lojistas Ativos"
          value={metricas.lojistasAtivos}
          total={metricas.lojistasTotal}
          color="#2563eb"
          onClick={() => navigate('/lojistas')}
        />
        <QuickMetric
          icon={<FaUsers />}
          label="Consultores Ativos"
          value={metricas.consultoresAtivos}
          total={metricas.consultoresTotal}
          color="#2c5aa0"
          onClick={() => navigate('/consultores')}
        />
        <QuickMetric
          icon={<FaDownload />}
          label="Vendas"
          value={metricas.vendasTotal}
          subtitle={`R$ ${metricas.faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
          color="#28a745"
          onClick={() => navigate('/financeiro')}
        />
      </div>

      {/* CONTROLES DE FEATURES - CONSULTOR */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>👤 Frontend do Consultor</h3>
          <p style={styles.sectionSubtitle}>Controle o que os consultores podem ver/fazer</p>
        </div>
        <div style={styles.featuresGrid}>
          <FeatureToggle
            name="consultorChatIA"
            label="Chat com IA"
            description="Permite consultor usar chat IA para atender clientes"
            active={features.consultorChatIA}
            onToggle={() => toggleFeature('consultorChatIA')}
          />
          <FeatureToggle
            name="consultorComissoes"
            label="Ver Comissões"
            description="Consultor visualiza suas comissões em tempo real"
            active={features.consultorComissoes}
            onToggle={() => toggleFeature('consultorComissoes')}
          />
          <FeatureToggle
            name="consultorRanking"
            label="Ranking de Vendas"
            description="Mostra ranking de consultores no dashboard"
            active={features.consultorRanking}
            onToggle={() => toggleFeature('consultorRanking')}
          />
          <FeatureToggle
            name="consultorTreinamentos"
            label="Acessar Treinamentos"
            description="Libera acesso aos materiais de treinamento"
            active={features.consultorTreinamentos}
            onToggle={() => toggleFeature('consultorTreinamentos')}
          />
        </div>
      </div>

      {/* CONTROLES DE FEATURES - LOJISTA */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>🏪 Frontend do Lojista</h3>
          <p style={styles.sectionSubtitle}>Controle o que os lojistas podem ver/fazer</p>
        </div>
        <div style={styles.featuresGrid}>
          <FeatureToggle
            name="lojistaCampanhas"
            label="Criar Campanhas"
            description="Permite lojista criar campanhas de marketing"
            active={features.lojistaCampanhas}
            onToggle={() => toggleFeature('lojistaCampanhas')}
          />
          <FeatureToggle
            name="lojistaRelatorios"
            label="Relatórios Avançados"
            description="Acesso a relatórios detalhados de vendas"
            active={features.lojistaRelatorios}
            onToggle={() => toggleFeature('lojistaRelatorios')}
          />
          <FeatureToggle
            name="lojistaVendedores"
            label="Cadastrar Vendedores"
            description="Permite cadastrar vendedores internos"
            active={features.lojistaVendedores}
            onToggle={() => toggleFeature('lojistaVendedores')}
          />
          <FeatureToggle
            name="lojistaIndicacoes"
            label="Sistema de Indicações"
            description="Permite indicar outros lojistas (bonificação)"
            active={features.lojistaIndicacoes}
            onToggle={() => toggleFeature('lojistaIndicacoes')}
          />
        </div>
      </div>

      {/* CONTROLES GERAIS DO SISTEMA */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>🔧 Sistema Geral</h3>
          <p style={styles.sectionSubtitle}>Funcionalidades globais da plataforma</p>
        </div>
        <div style={styles.featuresGrid}>
          <FeatureToggle
            name="sistemaNotificacoes"
            label="Notificações Push"
            description="Envia notificações para todos os usuários"
            active={features.sistemaNotificacoes}
            onToggle={() => toggleFeature('sistemaNotificacoes')}
          />
          <FeatureToggle
            name="sistemaPagamentos"
            label="Pagamentos Online"
            description="Processamento de pagamentos via Stripe"
            active={features.sistemaPagamentos}
            onToggle={() => toggleFeature('sistemaPagamentos')}
          />
          <FeatureToggle
            name="sistemaBiometria"
            label="Autenticação Biométrica"
            description="Login com biometria facial"
            active={features.sistemaBiometria}
            onToggle={() => toggleFeature('sistemaBiometria')}
          />
        </div>
      </div>

      {/* BOTÃO SALVAR CONFIGURAÇÕES */}
      <div style={styles.saveSection}>
        <button onClick={salvarFeatures} style={styles.saveButton}>
          <FaCog /> Salvar Todas as Configurações
        </button>
        <p style={styles.saveNote}>
          ⚠️ As alterações só terão efeito após salvar
        </p>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚡ Ações Rápidas</h3>
        <div style={styles.actionsGrid}>
          <ActionButton icon="🏪" label="Gerenciar Lojistas" onClick={() => navigate('/lojistas')} />
          <ActionButton icon="👥" label="Gerenciar Consultores" onClick={() => navigate('/consultores')} />
          <ActionButton icon="💰" label="Financeiro" onClick={() => navigate('/financeiro')} />
          <ActionButton icon="📢" label="Campanhas" onClick={() => navigate('/campanhas')} />
          <ActionButton icon="📚" label="Treinamentos" onClick={() => navigate('/treinamentos')} />
          <ActionButton icon="📊" label="Relatórios" onClick={() => navigate('/relatorios')} />
          <ActionButton icon="🛠️" label="Manutenção" onClick={() => navigate('/manutencao')} />
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

// COMPONENTES

const QuickMetric = ({ icon, label, value, total, subtitle, color, onClick }) => (
  <div style={{...styles.quickMetricCard, borderTop: `4px solid ${color}`}} onClick={onClick}>
    <div style={{ ...styles.quickMetricIcon, color }}>{icon}</div>
    <div>
      <p style={styles.quickMetricLabel}>{label}</p>
      <p style={styles.quickMetricValue}>
        {value} {total && <span style={styles.quickMetricTotal}>/ {total}</span>}
      </p>
      {subtitle && <p style={styles.quickMetricSubtitle}>{subtitle}</p>}
    </div>
  </div>
);

const FeatureToggle = ({ name, label, description, active, onToggle }) => (
  <div style={styles.featureCard}>
    <div style={styles.featureInfo}>
      <div style={styles.featureHeader}>
        {active ? <FaEye color="#28a745" /> : <FaEyeSlash color="#999" />}
        <h4 style={styles.featureLabel}>{label}</h4>
      </div>
      <p style={styles.featureDescription}>{description}</p>
    </div>
    <button
      onClick={onToggle}
      style={{
        ...styles.featureToggleButton,
        backgroundColor: active ? '#28a745' : '#dc3545',
      }}
    >
      {active ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
    </button>
  </div>
);

const ActionButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={styles.actionButton}>
    <span style={styles.actionIcon}>{icon}</span>
    <span style={styles.actionLabel}>{label}</span>
  </button>
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
  quickMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  quickMetricCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  quickMetricIcon: {
    fontSize: '2.5rem',
  },
  quickMetricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  quickMetricValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  quickMetricTotal: {
    fontSize: '1.2rem',
    color: '#999',
    fontWeight: 'normal',
  },
  quickMetricSubtitle: {
    fontSize: '0.85rem',
    color: '#999',
    margin: '5px 0 0 0',
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '15px',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
  },
  featureInfo: {
    flex: 1,
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  featureLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  featureDescription: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
    lineHeight: '1.4',
  },
  featureToggleButton: {
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px',
  },
  saveSection: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  saveButton: {
    padding: '15px 40px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },
  saveNote: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '15px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '15px',
  },
  actionButton: {
    padding: '20px',
    backgroundColor: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s',
  },
  actionIcon: {
    fontSize: '2rem',
  },
  actionLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
};

export default AdminDashboard;