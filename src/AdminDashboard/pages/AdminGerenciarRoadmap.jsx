// admin-frontend/src/AdminDashboard/pages/AdminGerenciarRoadmap.jsx

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaRocket, FaSave } from 'react-icons/fa';

const AdminGerenciarRoadmap = () => {
  const [roadmapItems, setRoadmapItems] = useState([
    // IMPLEMENTADO
    { id: 1, nome: 'Sistema de Comissões Automáticas', status: 'implementado', data: '2024-10', prioridade: 'alta', categoria: 'financeiro' },
    { id: 2, nome: 'Campanhas de Marketing', status: 'implementado', data: '2024-11', prioridade: 'alta', categoria: 'marketing' },
    { id: 3, nome: 'Autenticação Biométrica', status: 'implementado', data: '2024-12', prioridade: 'media', categoria: 'seguranca' },
    { id: 4, nome: 'Chat IA com Consultores', status: 'implementado', data: '2024-12', prioridade: 'alta', categoria: 'ia' },
    { id: 5, nome: 'Dashboard Mobile', status: 'implementado', data: '2025-01', prioridade: 'alta', categoria: 'mobile' },
    
    // EM DESENVOLVIMENTO
    { id: 6, nome: 'Dashboards de Performance', status: 'desenvolvimento', data: '2025-01', prioridade: 'alta', categoria: 'analytics', progresso: 80 },
    { id: 7, nome: 'Sistema de Avaliações Completo', status: 'desenvolvimento', data: '2025-01', prioridade: 'alta', categoria: 'engagement', progresso: 60 },
    { id: 8, nome: 'Gamificação para Consultores', status: 'desenvolvimento', data: '2025-02', prioridade: 'alta', categoria: 'engagement', progresso: 40 },
    
    // PLANEJADO
    { id: 9, nome: 'Sistema de Fidelidade/Cashback', status: 'planejado', data: '2025-02', prioridade: 'alta', categoria: 'fidelidade' },
    { id: 10, nome: 'Live Commerce', status: 'planejado', data: '2025-03', prioridade: 'alta', categoria: 'vendas' },
    { id: 11, nome: 'Agendamento Completo', status: 'planejado', data: '2025-02', prioridade: 'media', categoria: 'operacional' },
    { id: 12, nome: 'Geolocalização Avançada', status: 'planejado', data: '2025-03', prioridade: 'media', categoria: 'tecnologia' },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    status: 'planejado',
    data: '',
    prioridade: 'media',
    categoria: 'geral',
    progresso: 0,
  });

  const abrirModal = (item = null) => {
    if (item) {
      setItemEditando(item);
      setNovoItem(item);
    } else {
      setItemEditando(null);
      setNovoItem({
        nome: '',
        status: 'planejado',
        data: '',
        prioridade: 'media',
        categoria: 'geral',
        progresso: 0,
      });
    }
    setModalAberto(true);
  };

  const salvarItem = () => {
    if (itemEditando) {
      // Editar
      setRoadmapItems(roadmapItems.map(item => 
        item.id === itemEditando.id ? { ...novoItem, id: item.id } : item
      ));
    } else {
      // Adicionar
      setRoadmapItems([...roadmapItems, { ...novoItem, id: Date.now() }]);
    }
    setModalAberto(false);
    alert('✅ Item salvo com sucesso!');
  };

  const excluirItem = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setRoadmapItems(roadmapItems.filter(item => item.id !== id));
      alert('🗑️ Item excluído!');
    }
  };

  const marcarComoConcluido = (id) => {
    setRoadmapItems(roadmapItems.map(item =>
      item.id === id ? { ...item, status: 'implementado', progresso: 100 } : item
    ));
    alert('✅ Marcado como concluído!');
  };

  const implementados = roadmapItems.filter(i => i.status === 'implementado');
  const emDesenvolvimento = roadmapItems.filter(i => i.status === 'desenvolvimento');
  const planejados = roadmapItems.filter(i => i.status === 'planejado');

  const prioridadeColors = {
    alta: '#dc3545',
    media: '#ffc107',
    baixa: '#17a2b8',
  };

  const categoriaIcons = {
    financeiro: '💰',
    marketing: '📢',
    seguranca: '🔒',
    ia: '🤖',
    mobile: '📱',
    analytics: '📊',
    engagement: '⭐',
    fidelidade: '🎁',
    vendas: '🛒',
    operacional: '⚙️',
    tecnologia: '🚀',
    geral: '📋',
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🗺️ Gerenciar Roadmap</h1>
          <p style={styles.subtitle}>Controle completo das melhorias da plataforma</p>
        </div>
        <button onClick={() => abrirModal()} style={styles.addButton}>
          <FaPlus /> Nova Melhoria
        </button>
      </div>

      {/* Resumo */}
      <div style={styles.resumoGrid}>
        <div style={styles.resumoCard}>
          <FaCheck color="#28a745" size={24} />
          <div>
            <p style={styles.resumoLabel}>Implementado</p>
            <p style={styles.resumoValue}>{implementados.length}</p>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <FaClock color="#ffc107" size={24} />
          <div>
            <p style={styles.resumoLabel}>Em Desenvolvimento</p>
            <p style={styles.resumoValue}>{emDesenvolvimento.length}</p>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <FaRocket color="#2c5aa0" size={24} />
          <div>
            <p style={styles.resumoLabel}>Planejado</p>
            <p style={styles.resumoValue}>{planejados.length}</p>
          </div>
        </div>
      </div>

      {/* Grid de Colunas */}
      <div style={styles.columnsGrid}>
        {/* IMPLEMENTADO */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaCheck color="#28a745" size={20} />
            <h3 style={styles.columnTitle}>Implementado</h3>
          </div>
          {implementados.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              prioridadeColors={prioridadeColors}
              categoriaIcons={categoriaIcons}
              onEdit={() => abrirModal(item)}
              onDelete={() => excluirItem(item.id)}
            />
          ))}
        </div>

        {/* EM DESENVOLVIMENTO */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaClock color="#ffc107" size={20} />
            <h3 style={styles.columnTitle}>Em Desenvolvimento</h3>
          </div>
          {emDesenvolvimento.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              prioridadeColors={prioridadeColors}
              categoriaIcons={categoriaIcons}
              onEdit={() => abrirModal(item)}
              onDelete={() => excluirItem(item.id)}
              onComplete={() => marcarComoConcluido(item.id)}
            />
          ))}
        </div>

        {/* PLANEJADO */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaRocket color="#2c5aa0" size={20} />
            <h3 style={styles.columnTitle}>Planejado</h3>
          </div>
          {planejados.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              prioridadeColors={prioridadeColors}
              categoriaIcons={categoriaIcons}
              onEdit={() => abrirModal(item)}
              onDelete={() => excluirItem(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {itemEditando ? 'Editar Melhoria' : 'Nova Melhoria'}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Melhoria</label>
              <input
                type="text"
                value={novoItem.nome}
                onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})}
                style={styles.input}
                placeholder="Ex: Sistema de Fidelidade"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={novoItem.status}
                  onChange={(e) => setNovoItem({...novoItem, status: e.target.value})}
                  style={styles.input}
                >
                  <option value="planejado">Planejado</option>
                  <option value="desenvolvimento">Em Desenvolvimento</option>
                  <option value="implementado">Implementado</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Data Prevista</label>
                <input
                  type="text"
                  value={novoItem.data}
                  onChange={(e) => setNovoItem({...novoItem, data: e.target.value})}
                  style={styles.input}
                  placeholder="Ex: 2025-03"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prioridade</label>
                <select
                  value={novoItem.prioridade}
                  onChange={(e) => setNovoItem({...novoItem, prioridade: e.target.value})}
                  style={styles.input}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Categoria</label>
                <select
                  value={novoItem.categoria}
                  onChange={(e) => setNovoItem({...novoItem, categoria: e.target.value})}
                  style={styles.input}
                >
                  <option value="financeiro">💰 Financeiro</option>
                  <option value="marketing">📢 Marketing</option>
                  <option value="seguranca">🔒 Segurança</option>
                  <option value="ia">🤖 IA</option>
                  <option value="mobile">📱 Mobile</option>
                  <option value="analytics">📊 Analytics</option>
                  <option value="engagement">⭐ Engagement</option>
                  <option value="fidelidade">🎁 Fidelidade</option>
                  <option value="vendas">🛒 Vendas</option>
                  <option value="operacional">⚙️ Operacional</option>
                  <option value="tecnologia">🚀 Tecnologia</option>
                  <option value="geral">📋 Geral</option>
                </select>
              </div>
            </div>

            {novoItem.status === 'desenvolvimento' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Progresso (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={novoItem.progresso || 0}
                  onChange={(e) => setNovoItem({...novoItem, progresso: parseInt(e.target.value)})}
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.modalActions}>
              <button onClick={() => setModalAberto(false)} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={salvarItem} style={styles.saveButton}>
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ItemCard = ({ item, prioridadeColors, categoriaIcons, onEdit, onDelete, onComplete }) => (
  <div style={styles.itemCard}>
    <div style={styles.itemHeader}>
      <span style={styles.categoriaIcon}>{categoriaIcons[item.categoria]}</span>
      <span
        style={{
          ...styles.prioridadeBadge,
          backgroundColor: prioridadeColors[item.prioridade],
        }}
      >
        {item.prioridade.toUpperCase()}
      </span>
    </div>

    <h4 style={styles.itemNome}>{item.nome}</h4>
    <p style={styles.itemData}>📅 {item.data}</p>

    {item.progresso !== undefined && item.progresso < 100 && (
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${item.progresso}%`}} />
        </div>
        <span style={styles.progressText}>{item.progresso}%</span>
      </div>
    )}

    <div style={styles.itemActions}>
      {item.status === 'desenvolvimento' && (
        <button onClick={onComplete} style={styles.completeButton}>
          <FaCheck /> Concluir
        </button>
      )}
      <button onClick={onEdit} style={styles.editButton}>
        <FaEdit />
      </button>
      <button onClick={onDelete} style={styles.deleteButton}>
        <FaTrash />
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
  resumoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  resumoCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  resumoLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  resumoValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  column: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e9ecef',
  },
  columnTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '1px solid #e9ecef',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  categoriaIcon: {
    fontSize: '1.5rem',
  },
  prioridadeBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: 'white',
  },
  itemNome: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  itemData: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 12px 0',
  },
  progressContainer: {
    marginBottom: '12px',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e9ecef',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2c5aa0',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '0.75rem',
    color: '#666',
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
  },
  completeButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  editButton: {
    padding: '8px 12px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
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
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
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
    marginTop: '20px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default AdminGerenciarRoadmap;