// admin-frontend/src/AdminDashboard/pages/AdminLojistas.jsx - CORRIGIDO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaStore, FaCheckCircle, FaBan, FaEdit, FaTrash, FaSearch, FaEnvelope } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminLojistas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [lojaEditando, setLojaEditando] = useState(null);

  useEffect(() => {
    carregarLojas();
  }, []);

  const carregarLojas = async () => {
    setLoading(true);
    try {
      // QUERY SIMPLIFICADA SEM JOIN
      const { data, error } = await supabase
        .from('lojas_corrigida')
        .select('*');

      if (error) throw error;

      setLojas(data || []);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      alert('❌ Erro ao carregar lojas');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (lojaId) => {
    if (!window.confirm('Aprovar esta loja?')) return;

    try {
      const { error } = await supabase
        .from('lojas_corrigida')
        .update({ status: 'ativo' })
        .eq('id', lojaId);

      if (error) throw error;

      alert('✅ Loja aprovada com sucesso!');
      carregarLojas();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('❌ Erro ao aprovar loja');
    }
  };

  const handleBloquear = async (lojaId, statusAtual) => {
    const novoStatus = statusAtual === 'bloqueado' ? 'ativo' : 'bloqueado';
    const acao = novoStatus === 'bloqueado' ? 'bloquear' : 'desbloquear';

    if (!window.confirm(`Deseja ${acao} esta loja?`)) return;

    try {
      const { error } = await supabase
        .from('lojas_corrigida')
        .update({ status: novoStatus })
        .eq('id', lojaId);

      if (error) throw error;

      alert(`✅ Loja ${novoStatus === 'bloqueado' ? 'bloqueada' : 'desbloqueada'} com sucesso!`);
      carregarLojas();
    } catch (error) {
      console.error(`Erro ao ${acao}:`, error);
      alert(`❌ Erro ao ${acao} loja`);
    }
  };

  const handleExcluir = async (lojaId) => {
    if (!window.confirm('⚠️ ATENÇÃO: Excluir permanentemente esta loja? Esta ação não pode ser desfeita!')) return;

    const confirmacao = prompt('Digite "CONFIRMAR" para excluir:');
    if (confirmacao !== 'CONFIRMAR') return;

    try {
      const { error } = await supabase
        .from('lojas_corrigida')
        .delete()
        .eq('id', lojaId);

      if (error) throw error;

      alert('✅ Loja excluída com sucesso!');
      carregarLojas();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('❌ Erro ao excluir loja');
    }
  };

  const handleEditar = (loja) => {
    setLojaEditando(loja);
  };

  const handleSalvarEdicao = async () => {
    try {
      const { error } = await supabase
        .from('lojas_corrigida')
        .update({
          nome_fantasia: lojaEditando.nome_fantasia,
          razao_social: lojaEditando.razao_social,
          cnpj: lojaEditando.cnpj,
          telefone: lojaEditando.telefone,
          endereco: lojaEditando.endereco,
        })
        .eq('id', lojaEditando.id);

      if (error) throw error;

      alert('✅ Loja atualizada com sucesso!');
      setLojaEditando(null);
      carregarLojas();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar alterações');
    }
  };

  const handleEnviarNotificacao = (loja) => {
    const mensagem = prompt(`Enviar notificação para ${loja.nome_fantasia}:`);
    if (!mensagem) return;

    console.log('Enviando notificação:', { loja: loja.id, mensagem });
    alert('✅ Notificação enviada!');
  };

  const lojasFiltradas = lojas
    .filter(loja => {
      if (filtro === 'todos') return true;
      return loja.status === filtro;
    })
    .filter(loja => {
      if (!busca) return true;
      const searchLower = busca.toLowerCase();
      return (
        loja.nome_fantasia?.toLowerCase().includes(searchLower) ||
        loja.cnpj?.includes(busca)
      );
    });

  const estatisticas = {
    total: lojas.length,
    ativos: lojas.filter(l => l.status === 'ativo').length,
    pendentes: lojas.filter(l => l.status === 'pendente').length,
    bloqueados: lojas.filter(l => l.status === 'bloqueado').length,
  };

  if (loading) {
    return <div style={styles.loading}>Carregando lojas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏪 Gerenciar Lojas</h1>
          <p style={styles.subtitle}>
            {lojasFiltradas.length} de {lojas.length} lojas
          </p>
        </div>
        <button onClick={carregarLojas} style={styles.refreshButton}>
          🔄 Atualizar
        </button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Total" value={estatisticas.total} color="#2563eb" />
        <StatCard label="Ativas" value={estatisticas.ativos} color="#28a745" />
        <StatCard label="Pendentes" value={estatisticas.pendentes} color="#ffc107" />
        <StatCard label="Bloqueadas" value={estatisticas.bloqueados} color="#dc3545" />
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <FaSearch color="#666" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterButtons}>
          {['todos', 'ativo', 'pendente', 'bloqueado'].map(status => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              style={{
                ...styles.filterButton,
                backgroundColor: filtro === status ? 
                  (status === 'todos' ? ADMIN_PRIMARY : 
                   status === 'ativo' ? '#28a745' :
                   status === 'pendente' ? '#ffc107' : '#dc3545') : '#f8f9fa',
                color: filtro === status ? 'white' : '#333',
              }}
            >
              {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tableContainer}>
        {lojasFiltradas.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Nenhuma loja encontrada</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Loja</th>
                <th style={styles.th}>CNPJ</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lojasFiltradas.map(loja => (
                <tr key={loja.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>
                      <p style={styles.lojaNome}>{loja.nome_fantasia || loja.nome}</p>
                      <p style={styles.lojaRazao}>{loja.razao_social}</p>
                    </div>
                  </td>
                  <td style={styles.td}>{loja.cnpj}</td>
                  <td style={styles.td}>{loja.email || '-'}</td>
                  <td style={styles.td}>{loja.telefone || '-'}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(loja.status),
                      }}
                    >
                      {getStatusLabel(loja.status)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsContainer}>
                      {loja.status === 'pendente' && (
                        <button
                          onClick={() => handleAprovar(loja.id)}
                          style={styles.iconButton}
                          title="Aprovar"
                        >
                          <FaCheckCircle color="#28a745" size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleBloquear(loja.id, loja.status)}
                        style={styles.iconButton}
                        title={loja.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                      >
                        <FaBan color={loja.status === 'bloqueado' ? '#28a745' : '#dc3545'} size={18} />
                      </button>
                      <button
                        onClick={() => handleEditar(loja)}
                        style={styles.iconButton}
                        title="Editar"
                      >
                        <FaEdit color="#2563eb" size={18} />
                      </button>
                      <button
                        onClick={() => handleEnviarNotificacao(loja)}
                        style={styles.iconButton}
                        title="Enviar Notificação"
                      >
                        <FaEnvelope color="#ffc107" size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(loja.id)}
                        style={styles.iconButton}
                        title="Excluir"
                      >
                        <FaTrash color="#dc3545" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Edição */}
      {lojaEditando && (
        <div style={styles.modalOverlay} onClick={() => setLojaEditando(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>✏️ Editar Loja</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome Fantasia</label>
                <input
                  type="text"
                  value={lojaEditando.nome_fantasia || ''}
                  onChange={(e) => setLojaEditando({...lojaEditando, nome_fantasia: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Razão Social</label>
                <input
                  type="text"
                  value={lojaEditando.razao_social || ''}
                  onChange={(e) => setLojaEditando({...lojaEditando, razao_social: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>CNPJ</label>
                <input
                  type="text"
                  value={lojaEditando.cnpj || ''}
                  onChange={(e) => setLojaEditando({...lojaEditando, cnpj: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefone</label>
                <input
                  type="text"
                  value={lojaEditando.telefone || ''}
                  onChange={(e) => setLojaEditando({...lojaEditando, telefone: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Endereço</label>
                <input
                  type="text"
                  value={lojaEditando.endereco || ''}
                  onChange={(e) => setLojaEditando({...lojaEditando, endereco: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setLojaEditando(null)} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSalvarEdicao} style={styles.saveButton}>
                💾 Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes Auxiliares
const StatCard = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const getStatusColor = (status) => {
  const colors = {
    ativo: '#d4edda',
    pendente: '#fff3cd',
    bloqueado: '#f8d7da',
  };
  return colors[status] || '#f8f9fa';
};

const getStatusLabel = (status) => {
  const labels = {
    ativo: '✅ Ativo',
    pendente: '⏳ Pendente',
    bloqueado: '🔒 Bloqueado',
  };
  return labels[status] || status;
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '1.2rem',
    color: '#666',
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
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
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
  filtersContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
  },
  filterButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem',
    borderBottom: '2px solid #e9ecef',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '15px',
    fontSize: '0.9rem',
    color: '#666',
  },
  lojaNome: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 3px 0',
  },
  lojaRazao: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  actionsContainer: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#999',
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
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AdminLojistas;