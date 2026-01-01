// src/pages/AdminDashboard/pages/AdminDocumentosLegais.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaFileAlt, FaEdit, FaSave, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminDocumentosLegais = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    url_notion: '',
    tipo: '',
  });

  // Documentos padrão (se não existirem no banco)
  const documentosPadrao = [
    {
      id: 1,
      titulo: 'Termo de Adesão e Contratação de Serviços',
      descricao: 'Contrato para consultores e lojistas sobre prestação de serviços, comissões e responsabilidades',
      url_notion: 'https://www.notion.so/TERMO-DE-ADES-O-E-CONTRATA-O-DE-SERVI-OS-2cfcb8e9243180a08bbbf914d582e8bf',
      tipo: 'contrato',
      ativo: true,
    },
    {
      id: 2,
      titulo: 'Termos e Condições de Uso',
      descricao: 'Termos gerais de uso da plataforma para todos os usuários',
      url_notion: 'https://www.notion.so/Termos-e-Condi-es-de-Uso-2d0cb8e9243180938a66c6b53a4aed5b',
      tipo: 'termos',
      ativo: true,
    },
    {
      id: 3,
      titulo: 'Política de Privacidade',
      descricao: 'Como tratamos os dados pessoais dos usuários conforme LGPD',
      url_notion: 'https://www.notion.so/Pol-tica-de-Privacidade-2d1cb8e924318015a8b0dea48170d820',
      tipo: 'privacidade',
      ativo: true,
    },
  ];

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documentos_legais')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Se não houver documentos no banco, usar os padrão
      if (!data || data.length === 0) {
        setDocumentos(documentosPadrao);
      } else {
        setDocumentos(data);
      }

    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      // Em caso de erro, usar documentos padrão
      setDocumentos(documentosPadrao);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (documento) => {
    setEditando(documento.id);
    setFormData({
      titulo: documento.titulo,
      descricao: documento.descricao,
      url_notion: documento.url_notion,
      tipo: documento.tipo,
    });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData({
      titulo: '',
      descricao: '',
      url_notion: '',
      tipo: '',
    });
  };

  const handleSalvar = async (documentoId) => {
    if (!formData.titulo || !formData.url_notion) {
      alert('❌ Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      // Verificar se o documento existe no banco
      const { data: existente } = await supabase
        .from('documentos_legais')
        .select('id')
        .eq('id', documentoId)
        .single();

      if (existente) {
        // Atualizar
        const { error } = await supabase
          .from('documentos_legais')
          .update({
            titulo: formData.titulo,
            descricao: formData.descricao,
            url_notion: formData.url_notion,
            tipo: formData.tipo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentoId);

        if (error) throw error;

      } else {
        // Inserir (primeira vez)
        const { error } = await supabase
          .from('documentos_legais')
          .insert({
            id: documentoId,
            titulo: formData.titulo,
            descricao: formData.descricao,
            url_notion: formData.url_notion,
            tipo: formData.tipo,
            ativo: true,
          });

        if (error) throw error;
      }

      alert('✅ Documento atualizado com sucesso!');
      setEditando(null);
      carregarDocumentos();

    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('❌ Erro ao salvar documento');
    }
  };

  const handleAbrirNotion = (url) => {
    window.open(url, '_blank');
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      contrato: '📄 Contrato',
      termos: '📜 Termos',
      privacidade: '🔒 Privacidade',
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const colors = {
      contrato: '#2563eb',
      termos: '#ffc107',
      privacidade: '#28a745',
    };
    return colors[tipo] || '#6c757d';
  };

  if (loading) {
    return <div style={styles.loading}>Carregando documentos...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Documentos Legais</h1>
          <p style={styles.subtitle}>Gerencie os links dos documentos no Notion</p>
        </div>
        <button onClick={carregarDocumentos} style={styles.refreshButton}>
          🔄 Atualizar
        </button>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>ℹ️ Como funciona:</h3>
        <ul style={styles.infoList}>
          <li>Os documentos estão armazenados no Notion</li>
          <li>Clique em "Editar" para atualizar os links</li>
          <li>Clique em "Abrir no Notion" para editar o conteúdo</li>
          <li>As mudanças no Notion são refletidas automaticamente (mesmo link)</li>
          <li>Use o botão "Copiar Link Público" no Notion para obter o link correto</li>
        </ul>
      </div>

      {/* Lista de Documentos */}
      <div style={styles.documentosContainer}>
        {documentos.map((doc) => {
          const isEditando = editando === doc.id;

          return (
            <div key={doc.id} style={styles.documentoCard}>
              {/* Header do Card */}
              <div style={styles.documentoHeader}>
                <div style={styles.documentoTitleContainer}>
                  <span 
                    style={{
                      ...styles.tipoBadge,
                      backgroundColor: getTipoColor(doc.tipo),
                    }}
                  >
                    {getTipoLabel(doc.tipo)}
                  </span>
                </div>
                <div style={styles.documentoActions}>
                  {!isEditando ? (
                    <>
                      <button
                        onClick={() => handleAbrirNotion(doc.url_notion)}
                        style={styles.notionButton}
                        title="Abrir no Notion"
                      >
                        <FaExternalLinkAlt /> Abrir no Notion
                      </button>
                      <button
                        onClick={() => handleEditar(doc)}
                        style={styles.editButton}
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSalvar(doc.id)}
                        style={styles.saveButton}
                        title="Salvar"
                      >
                        <FaSave /> Salvar
                      </button>
                      <button
                        onClick={handleCancelar}
                        style={styles.cancelButton}
                        title="Cancelar"
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div style={styles.documentoContent}>
                {isEditando ? (
                  <div style={styles.formContainer}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Título *</label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Descrição</label>
                      <textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        style={styles.textarea}
                        rows={2}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>URL do Notion *</label>
                      <input
                        type="url"
                        value={formData.url_notion}
                        onChange={(e) => setFormData({...formData, url_notion: e.target.value})}
                        placeholder="https://www.notion.so/..."
                        style={styles.input}
                      />
                      <small style={styles.helpText}>
                        💡 Copie o link público do documento no Notion
                      </small>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={styles.documentoTitulo}>{doc.titulo}</h3>
                    <p style={styles.documentoDescricao}>{doc.descricao}</p>
                    <div style={styles.urlContainer}>
                      <span style={styles.urlLabel}>🔗 Link:</span>
                      <a
                        href={doc.url_notion}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.urlLink}
                      >
                        {doc.url_notion}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dicas */}
      <div style={styles.tipsBox}>
        <h3 style={styles.tipsTitle}>💡 Dicas:</h3>
        <ul style={styles.tipsList}>
          <li><strong>Para editar o conteúdo:</strong> Clique em "Abrir no Notion" e edite diretamente lá</li>
          <li><strong>Para mudar o link:</strong> Clique em "Editar" e cole o novo link público do Notion</li>
          <li><strong>Obter link público:</strong> No Notion → Share → Copy link</li>
          <li><strong>Versão pública:</strong> Certifique-se de que o documento está com acesso público</li>
        </ul>
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
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    border: '1px solid #b3d9ff',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#004085',
    margin: '0 0 12px 0',
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#004085',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
  documentosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
  },
  documentoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  documentoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  documentoTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tipoBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
  },
  documentoActions: {
    display: 'flex',
    gap: '10px',
  },
  notionButton: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  documentoContent: {
    padding: '25px',
  },
  documentoTitulo: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 12px 0',
  },
  documentoDescricao: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 15px 0',
  },
  urlContainer: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  urlLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },
  urlLink: {
    fontSize: '0.85rem',
    color: '#2563eb',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '5px',
  },
  tipsBox: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #ffc107',
  },
  tipsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#856404',
    margin: '0 0 12px 0',
  },
  tipsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#856404',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
};

export default AdminDocumentosLegais;