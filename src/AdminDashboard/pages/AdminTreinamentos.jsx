// admin-frontend/src/AdminDashboard/pages/AdminTreinamentos.jsx

import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash, FaEye, FaUpload, FaSave } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminTreinamentos = () => {
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '',
    titulo: '',
    descricao: '',
    categoria: 'plataforma',
    duracao: '',
    obrigatorio: true,
    conteudoMD: '',
  });

  useEffect(() => {
    carregarTreinamentos();
  }, []);

  const carregarTreinamentos = async () => {
    setLoading(true);
    try {
      // TODO: Buscar do backend
      // const response = await fetch('/api/admin/treinamentos');
      // const data = await response.json();
      
      // Mock data por enquanto
      const mockData = [
        {
          id: 'PLAT-001',
          titulo: 'Conduta e Comunicação na Plataforma',
          descricao: 'O que você pode ou não perguntar e falar',
          categoria: 'plataforma',
          duracao: '15 min',
          obrigatorio: true,
          dataPublicacao: '2024-11-15',
          arquivo: 'plataforma/conduta-comunicacao.md',
        },
        {
          id: 'PLAT-002',
          titulo: 'Pesquisa Eficiente de Produtos',
          descricao: 'Como fazer pesquisa de produtos',
          categoria: 'plataforma',
          duracao: '10 min',
          obrigatorio: true,
          dataPublicacao: '2024-11-20',
          arquivo: 'plataforma/pesquisa-produtos.md',
        },
      ];
      
      setTreinamentos(mockData);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovo = () => {
    setModoEdicao(false);
    setFormData({
      id: `PLAT-${String(treinamentos.length + 1).padStart(3, '0')}`,
      titulo: '',
      descricao: '',
      categoria: 'plataforma',
      duracao: '',
      obrigatorio: true,
      conteudoMD: '',
    });
    setModalAberto(true);
  };

  const abrirModalEdicao = (treinamento) => {
    setModoEdicao(true);
    setTreinamentoSelecionado(treinamento);
    setFormData({
      id: treinamento.id,
      titulo: treinamento.titulo,
      descricao: treinamento.descricao,
      categoria: treinamento.categoria,
      duracao: treinamento.duracao,
      obrigatorio: treinamento.obrigatorio,
      conteudoMD: '',
    });
    setModalAberto(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modoEdicao) {
        // TODO: Atualizar no backend
        // await fetch(`/api/admin/treinamentos/${formData.id}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(formData),
        // });
        
        alert('✅ Treinamento atualizado com sucesso!');
      } else {
        // TODO: Criar no backend
        // await fetch('/api/admin/treinamentos', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        // });
        
        alert('✅ Treinamento criado com sucesso!');
      }
      
      setModalAberto(false);
      carregarTreinamentos();
      
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
      alert('❌ Erro ao salvar treinamento');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este treinamento?')) {
      return;
    }
    
    try {
      // TODO: Excluir no backend
      // await fetch(`/api/admin/treinamentos/${id}`, {
      //   method: 'DELETE',
      // });
      
      alert('✅ Treinamento excluído com sucesso!');
      carregarTreinamentos();
      
    } catch (error) {
      console.error('Erro ao excluir treinamento:', error);
      alert('❌ Erro ao excluir treinamento');
    }
  };

  const handleUploadArquivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        conteudoMD: event.target.result,
      }));
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando treinamentos...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 Gerenciar Treinamentos</h1>
          <p style={styles.subtitle}>Crie e edite treinamentos para consultores</p>
        </div>
        <button onClick={abrirModalNovo} style={styles.addButton}>
          <FaPlus /> Novo Treinamento
        </button>
      </div>

      {/* Lista de Treinamentos */}
      <div style={styles.treinamentosList}>
        {treinamentos.map(treinamento => (
          <div key={treinamento.id} style={styles.treinamentoCard}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>{treinamento.titulo}</h3>
                <p style={styles.cardDescription}>{treinamento.descricao}</p>
              </div>
              <div style={styles.cardBadges}>
                {treinamento.obrigatorio && (
                  <span style={styles.obrigatorioBadge}>OBRIGATÓRIO</span>
                )}
                <span style={styles.categoriaBadge}>{treinamento.categoria}</span>
              </div>
            </div>

            <div style={styles.cardMeta}>
              <span>📅 {new Date(treinamento.dataPublicacao).toLocaleDateString('pt-BR')}</span>
              <span>⏱️ {treinamento.duracao}</span>
              <span>🆔 {treinamento.id}</span>
            </div>

            <div style={styles.cardActions}>
              <button
                onClick={() => window.open(`/docs/${treinamento.arquivo}`, '_blank')}
                style={styles.actionButton}
                title="Visualizar"
              >
                <FaEye /> Visualizar
              </button>
              <button
                onClick={() => abrirModalEdicao(treinamento)}
                style={{...styles.actionButton, backgroundColor: '#ffc107'}}
                title="Editar"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => handleExcluir(treinamento.id)}
                style={{...styles.actionButton, backgroundColor: '#dc3545'}}
                title="Excluir"
              >
                <FaTrash /> Excluir
              </button>
            </div>
          </div>
        ))}

        {treinamentos.length === 0 && (
          <div style={styles.emptyState}>
            <FaBook size={60} color="#ccc" />
            <p style={styles.emptyText}>Nenhum treinamento cadastrado</p>
            <button onClick={abrirModalNovo} style={styles.addButton}>
              <FaPlus /> Criar Primeiro Treinamento
            </button>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {modalAberto && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modoEdicao ? '✏️ Editar Treinamento' : '➕ Novo Treinamento'}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* ID */}
              <div style={styles.formGroup}>
                <label style={styles.label}>ID do Treinamento</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  style={styles.input}
                  readOnly
                />
              </div>

              {/* Título */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Conduta e Comunicação"
                  style={styles.input}
                  required
                />
              </div>

              {/* Descrição */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição *</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Breve descrição do treinamento"
                  style={{...styles.input, minHeight: '80px'}}
                  required
                />
              </div>

              {/* Categoria e Duração */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Categoria *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="plataforma">Plataforma</option>
                    <option value="lojista">Lojista</option>
                    <option value="produto">Produto</option>
                    <option value="vendas">Vendas</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Duração Estimada *</label>
                  <input
                    type="text"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleChange}
                    placeholder="Ex: 15 min"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Obrigatório */}
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="obrigatorio"
                  checked={formData.obrigatorio}
                  onChange={handleChange}
                  id="obrigatorio"
                />
                <label htmlFor="obrigatorio" style={styles.checkboxLabel}>
                  Treinamento Obrigatório
                </label>
              </div>

              {/* Upload Arquivo MD */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Conteúdo Markdown</label>
                <div style={styles.uploadArea}>
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleUploadArquivo}
                    style={styles.fileInput}
                    id="arquivo-md"
                  />
                  <label htmlFor="arquivo-md" style={styles.uploadLabel}>
                    <FaUpload /> Upload arquivo .md
                  </label>
                  <small style={styles.helpText}>
                    Ou cole o conteúdo Markdown abaixo
                  </small>
                </div>
              </div>

              {/* Editor de Conteúdo */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Conteúdo (Markdown)</label>
                <textarea
                  name="conteudoMD"
                  value={formData.conteudoMD}
                  onChange={handleChange}
                  placeholder="# Título do Treinamento

## Seção 1
Conteúdo aqui..."
                  style={{...styles.input, minHeight: '300px', fontFamily: 'monospace'}}
                />
              </div>

              {/* Botões */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.saveButton}>
                  <FaSave /> {modoEdicao ? 'Atualizar' : 'Criar'} Treinamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
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
  treinamentosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  treinamentoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    gap: '20px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  cardDescription: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },
  cardBadges: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  obrigatorioBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  categoriaBadge: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardMeta: {
    display: 'flex',
    gap: '20px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '15px',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '10px 16px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#999',
    margin: '20px 0 30px 0',
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    borderBottom: '2px solid #e9ecef',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#666',
    cursor: 'pointer',
  },
  form: {
    padding: '30px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  helpText: {
    display: 'block',
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '12px 24px',
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
};

export default AdminTreinamentos;
