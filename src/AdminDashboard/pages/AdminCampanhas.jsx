// admin-frontend/src/AdminDashboard/pages/AdminCampanhas.jsx - COMPLETO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FaBullhorn, FaPlus, FaEdit, FaTrash, FaPause, FaPlay,
  FaEye, FaChartLine, FaCalendar, FaUsers
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminCampanhas = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [campanhaEditando, setCampanhaEditando] = useState(null);
  const [novaCampanha, setNovaCampanha] = useState({
    nome: '',
    descricao: '',
    tipo: 'desconto',
    valor_desconto: 0,
    data_inicio: '',
    data_fim: '',
    status: 'ativa',
    publico_alvo: 'todos',
  });

  useEffect(() => {
    carregarCampanhas();
  }, []);

  const carregarCampanhas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .select('*');

      if (error) throw error;
      setCampanhas(data || []);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (campanha = null) => {
    if (campanha) {
      setCampanhaEditando(campanha);
      setNovaCampanha(campanha);
    } else {
      setCampanhaEditando(null);
      setNovaCampanha({
        nome: '',
        descricao: '',
        tipo: 'desconto',
        valor_desconto: 0,
        data_inicio: '',
        data_fim: '',
        status: 'ativa',
        publico_alvo: 'todos',
      });
    }
    setModalAberto(true);
  };

  const salvarCampanha = async () => {
    try {
      if (campanhaEditando) {
        // Editar
        const { error } = await supabase
          .from('campanhas_marketing')
          .update(novaCampanha)
          .eq('id', campanhaEditando.id);

        if (error) throw error;
        alert('✅ Campanha atualizada com sucesso!');
      } else {
        // Criar
        const { error } = await supabase
          .from('campanhas_marketing')
          .insert([novaCampanha]);

        if (error) throw error;
        alert('✅ Campanha criada com sucesso!');
      }

      setModalAberto(false);
      carregarCampanhas();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      alert('❌ Erro ao salvar campanha');
    }
  };

  const excluirCampanha = async (id) => {
    if (!window.confirm('Deseja excluir esta campanha?')) return;

    try {
      const { error } = await supabase
        .from('campanhas_marketing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Campanha excluída!');
      carregarCampanhas();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('❌ Erro ao excluir campanha');
    }
  };

  const toggleStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'ativa' ? 'pausada' : 'ativa';

    try {
      const { error } = await supabase
        .from('campanhas_marketing')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) throw error;
      alert(`✅ Campanha ${novoStatus === 'ativa' ? 'ativada' : 'pausada'}!`);
      carregarCampanhas();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('❌ Erro ao alterar status');
    }
  };

  const estatisticas = {
    total: campanhas.length,
    ativas: campanhas.filter(c => c.status === 'ativa').length,
    pausadas: campanhas.filter(c => c.status === 'pausada').length,
    finalizadas: campanhas.filter(c => c.status === 'finalizada').length,
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando campanhas...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📢 Campanhas de Marketing</h1>
          <p style={styles.subtitle}>Gerencie suas campanhas publicitárias</p>
        </div>
        <button onClick={() => abrirModal()} style={styles.addButton}>
          <FaPlus /> Nova Campanha
        </button>
      </div>

      {/* Estatísticas */}
      <div style={styles.statsGrid}>
        <StatCard label="Total" value={estatisticas.total} color="#2563eb" />
        <StatCard label="Ativas" value={estatisticas.ativas} color="#28a745" />
        <StatCard label="Pausadas" value={estatisticas.pausadas} color="#ffc107" />
        <StatCard label="Finalizadas" value={estatisticas.finalizadas} color="#6c757d" />
      </div>

      {/* Lista de Campanhas */}
      <div style={styles.campanhasGrid}>
        {campanhas.length === 0 ? (
          <div style={styles.emptyState}>
            <FaBullhorn size={60} color="#ccc" />
            <p style={styles.emptyText}>Nenhuma campanha criada ainda</p>
            <button onClick={() => abrirModal()} style={styles.emptyButton}>
              <FaPlus /> Criar Primeira Campanha
            </button>
          </div>
        ) : (
          campanhas.map(campanha => (
            <CampanhaCard
              key={campanha.id}
              campanha={campanha}
              onEdit={() => abrirModal(campanha)}
              onDelete={() => excluirCampanha(campanha.id)}
              onToggleStatus={() => toggleStatus(campanha.id, campanha.status)}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {campanhaEditando ? 'Editar Campanha' : 'Nova Campanha'}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Campanha</label>
              <input
                type="text"
                value={novaCampanha.nome}
                onChange={(e) => setNovaCampanha({...novaCampanha, nome: e.target.value})}
                style={styles.input}
                placeholder="Ex: Black Friday 2025"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                value={novaCampanha.descricao}
                onChange={(e) => setNovaCampanha({...novaCampanha, descricao: e.target.value})}
                style={{...styles.input, minHeight: '80px'}}
                placeholder="Descreva a campanha..."
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Campanha</label>
                <select
                  value={novaCampanha.tipo}
                  onChange={(e) => setNovaCampanha({...novaCampanha, tipo: e.target.value})}
                  style={styles.input}
                >
                  <option value="desconto">Desconto</option>
                  <option value="frete_gratis">Frete Grátis</option>
                  <option value="cashback">Cashback</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do Desconto (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={novaCampanha.valor_desconto}
                  onChange={(e) => setNovaCampanha({...novaCampanha, valor_desconto: parseFloat(e.target.value)})}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Início</label>
                <input
                  type="date"
                  value={novaCampanha.data_inicio}
                  onChange={(e) => setNovaCampanha({...novaCampanha, data_inicio: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Data Fim</label>
                <input
                  type="date"
                  value={novaCampanha.data_fim}
                  onChange={(e) => setNovaCampanha({...novaCampanha, data_fim: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Público Alvo</label>
                <select
                  value={novaCampanha.publico_alvo}
                  onChange={(e) => setNovaCampanha({...novaCampanha, publico_alvo: e.target.value})}
                  style={styles.input}
                >
                  <option value="todos">Todos</option>
                  <option value="novos_clientes">Novos Clientes</option>
                  <option value="clientes_fieis">Clientes Fiéis</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={novaCampanha.status}
                  onChange={(e) => setNovaCampanha({...novaCampanha, status: e.target.value})}
                  style={styles.input}
                >
                  <option value="ativa">Ativa</option>
                  <option value="pausada">Pausada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setModalAberto(false)} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={salvarCampanha} style={styles.saveButton}>
                {campanhaEditando ? '💾 Salvar' : '✨ Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{...styles.statValue, color}}>{value}</p>
  </div>
);

const CampanhaCard = ({ campanha, onEdit, onDelete, onToggleStatus }) => (
  <div style={styles.campanhaCard}>
    <div style={styles.campanhaHeader}>
      <div>
        <h3 style={styles.campanhaNome}>{campanha.nome}</h3>
        <p style={styles.campanhaDescricao}>{campanha.descricao}</p>
      </div>
      <span
        style={{
          ...styles.statusBadge,
          backgroundColor: 
            campanha.status === 'ativa' ? '#d4edda' :
            campanha.status === 'pausada' ? '#fff3cd' : '#f8d7da',
          color:
            campanha.status === 'ativa' ? '#155724' :
            campanha.status === 'pausada' ? '#856404' : '#721c24',
        }}
      >
        {campanha.status === 'ativa' ? '✅ Ativa' :
         campanha.status === 'pausada' ? '⏸️ Pausada' : '🏁 Finalizada'}
      </span>
    </div>

    <div style={styles.campanhaInfo}>
      <div style={styles.infoItem}>
        <FaBullhorn color="#666" size={16} />
        <span>{campanha.tipo}</span>
      </div>
      <div style={styles.infoItem}>
        <FaChartLine color="#666" size={16} />
        <span>{campanha.valor_desconto}% desconto</span>
      </div>
      <div style={styles.infoItem}>
        <FaCalendar color="#666" size={16} />
        <span>{campanha.data_inicio} até {campanha.data_fim}</span>
      </div>
      <div style={styles.infoItem}>
        <FaUsers color="#666" size={16} />
        <span>{campanha.publico_alvo}</span>
      </div>
    </div>

    <div style={styles.campanhaActions}>
      <button onClick={onToggleStatus} style={styles.actionButton}>
        {campanha.status === 'ativa' ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={onEdit} style={styles.actionButton}>
        <FaEdit color="#2563eb" />
      </button>
      <button onClick={onDelete} style={styles.actionButton}>
        <FaTrash color="#dc3545" />
      </button>
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
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  campanhasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  campanhaCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  campanhaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  campanhaNome: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  campanhaDescricao: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  campanhaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: '#666',
  },
  campanhaActions: {
    display: 'flex',
    gap: '10px',
    paddingTop: '15px',
    borderTop: '1px solid #e9ecef',
  },
  actionButton: {
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#999',
    margin: '20px 0',
  },
  emptyButton: {
    padding: '12px 24px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AdminCampanhas;