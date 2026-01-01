// src/pages/AdminDashboard/pages/AdminManutencao.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaBell, FaTools, FaCalendar, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminManutencao = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulário de Manutenção
  const [formManutencao, setFormManutencao] = useState({
    titulo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    tipo: 'programada', // programada, emergencial
    afetaServicos: false,
  });

  // Formulário de Aviso
  const [formAviso, setFormAviso] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'info', // info, warning, error, success
    destino: 'todos', // todos, lojistas, consultores
    exibirBanner: true,
    enviarEmail: false,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar manutenções programadas
      const { data: manutencoesData } = await supabase
        .from('manutencoes_sistema')
        .select('*')
        .order('data_inicio', { ascending: false })
        .limit(10);

      setManutencoes(manutencoesData || []);

      // Buscar avisos ativos
      const { data: avisosData } = await supabase
        .from('avisos_sistema')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      setAvisos(avisosData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleProgramarManutencao = async (e) => {
    e.preventDefault();

    if (!formManutencao.titulo || !formManutencao.dataInicio) {
      alert('❌ Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('manutencoes_sistema')
        .insert({
          titulo: formManutencao.titulo,
          descricao: formManutencao.descricao,
          data_inicio: formManutencao.dataInicio,
          data_fim: formManutencao.dataFim,
          tipo: formManutencao.tipo,
          afeta_servicos: formManutencao.afetaServicos,
          status: 'programada',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert('✅ Manutenção programada com sucesso!');
      
      // Limpar formulário
      setFormManutencao({
        titulo: '',
        descricao: '',
        dataInicio: '',
        dataFim: '',
        tipo: 'programada',
        afetaServicos: false,
      });

      carregarDados();

    } catch (error) {
      console.error('Erro ao programar manutenção:', error);
      alert('❌ Erro ao programar manutenção');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarAviso = async (e) => {
    e.preventDefault();

    if (!formAviso.titulo || !formAviso.mensagem) {
      alert('❌ Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);

    try {
      // Salvar aviso no banco
      const { data: avisoData, error } = await supabase
        .from('avisos_sistema')
        .insert({
          titulo: formAviso.titulo,
          mensagem: formAviso.mensagem,
          tipo: formAviso.tipo,
          destino: formAviso.destino,
          exibir_banner: formAviso.exibirBanner,
          ativo: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar email se necessário
      if (formAviso.enviarEmail) {
        await enviarEmailsAvisos();
      }

      alert('✅ Aviso enviado com sucesso!');
      
      // Limpar formulário
      setFormAviso({
        titulo: '',
        mensagem: '',
        tipo: 'info',
        destino: 'todos',
        exibirBanner: true,
        enviarEmail: false,
      });

      carregarDados();

    } catch (error) {
      console.error('Erro ao enviar aviso:', error);
      alert('❌ Erro ao enviar aviso');
    } finally {
      setLoading(false);
    }
  };

  const enviarEmailsAvisos = async () => {
    try {
      // TODO: Implementar envio de emails via Resend/SendGrid
      console.log('Enviando emails para:', formAviso.destino);
      
      // Buscar emails dos destinatários
      let query = supabase.from('auth.users').select('email');
      
      if (formAviso.destino === 'lojistas') {
        // Filtrar apenas lojistas
      } else if (formAviso.destino === 'consultores') {
        // Filtrar apenas consultores
      }

      // Enviar emails em lote

    } catch (error) {
      console.error('Erro ao enviar emails:', error);
    }
  };

  const handleDesativarAviso = async (avisoId) => {
    try {
      const { error } = await supabase
        .from('avisos_sistema')
        .update({ ativo: false })
        .eq('id', avisoId);

      if (error) throw error;

      alert('✅ Aviso desativado!');
      carregarDados();

    } catch (error) {
      console.error('Erro ao desativar aviso:', error);
      alert('❌ Erro ao desativar aviso');
    }
  };

  const handleCancelarManutencao = async (manutencaoId) => {
    if (!confirm('Cancelar esta manutenção?')) return;

    try {
      const { error } = await supabase
        .from('manutencoes_sistema')
        .update({ status: 'cancelada' })
        .eq('id', manutencaoId);

      if (error) throw error;

      alert('✅ Manutenção cancelada!');
      carregarDados();

    } catch (error) {
      console.error('Erro ao cancelar manutenção:', error);
      alert('❌ Erro ao cancelar manutenção');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🛠️ Manutenção e Avisos do Sistema</h1>
          <p style={styles.subtitle}>Gerencie manutenções e envie notificações</p>
        </div>
      </div>

      {/* Grid Principal */}
      <div style={styles.mainGrid}>
        {/* Programar Manutenção */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FaTools color={ADMIN_PRIMARY} /> Programar Manutenção
          </h3>
          
          <form onSubmit={handleProgramarManutencao} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título *</label>
              <input
                type="text"
                value={formManutencao.titulo}
                onChange={(e) => setFormManutencao({...formManutencao, titulo: e.target.value})}
                placeholder="Ex: Atualização do sistema"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                value={formManutencao.descricao}
                onChange={(e) => setFormManutencao({...formManutencao, descricao: e.target.value})}
                placeholder="Descreva os detalhes da manutenção..."
                style={styles.textarea}
                rows={3}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data/Hora Início *</label>
                <input
                  type="datetime-local"
                  value={formManutencao.dataInicio}
                  onChange={(e) => setFormManutencao({...formManutencao, dataInicio: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Data/Hora Fim</label>
                <input
                  type="datetime-local"
                  value={formManutencao.dataFim}
                  onChange={(e) => setFormManutencao({...formManutencao, dataFim: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo</label>
                <select
                  value={formManutencao.tipo}
                  onChange={(e) => setFormManutencao({...formManutencao, tipo: e.target.value})}
                  style={styles.input}
                >
                  <option value="programada">Programada</option>
                  <option value="emergencial">Emergencial</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formManutencao.afetaServicos}
                    onChange={(e) => setFormManutencao({...formManutencao, afetaServicos: e.target.checked})}
                  />
                  Afeta serviços (sistema indisponível)
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? '📤 Programando...' : '📅 Programar Manutenção'}
            </button>
          </form>
        </div>

        {/* Enviar Aviso */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FaBell color={ADMIN_PRIMARY} /> Enviar Aviso
          </h3>
          
          <form onSubmit={handleEnviarAviso} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título *</label>
              <input
                type="text"
                value={formAviso.titulo}
                onChange={(e) => setFormAviso({...formAviso, titulo: e.target.value})}
                placeholder="Ex: Nova funcionalidade disponível"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mensagem *</label>
              <textarea
                value={formAviso.mensagem}
                onChange={(e) => setFormAviso({...formAviso, mensagem: e.target.value})}
                placeholder="Escreva a mensagem do aviso..."
                style={styles.textarea}
                rows={4}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo</label>
                <select
                  value={formAviso.tipo}
                  onChange={(e) => setFormAviso({...formAviso, tipo: e.target.value})}
                  style={styles.input}
                >
                  <option value="info">ℹ️ Informação</option>
                  <option value="warning">⚠️ Aviso</option>
                  <option value="error">❌ Erro/Crítico</option>
                  <option value="success">✅ Sucesso</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Destinatários</label>
                <select
                  value={formAviso.destino}
                  onChange={(e) => setFormAviso({...formAviso, destino: e.target.value})}
                  style={styles.input}
                >
                  <option value="todos">👥 Todos os usuários</option>
                  <option value="lojistas">🏪 Apenas Lojistas</option>
                  <option value="consultores">👤 Apenas Consultores</option>
                </select>
              </div>
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formAviso.exibirBanner}
                  onChange={(e) => setFormAviso({...formAviso, exibirBanner: e.target.checked})}
                />
                Exibir banner no sistema
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formAviso.enviarEmail}
                  onChange={(e) => setFormAviso({...formAviso, enviarEmail: e.target.checked})}
                />
                Enviar por email
              </label>
            </div>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? '📤 Enviando...' : '📢 Enviar Aviso'}
            </button>
          </form>
        </div>
      </div>

      {/* Manutenções Programadas */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Manutenções Programadas</h3>
        <div style={styles.listContainer}>
          {manutencoes.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma manutenção programada</p>
          ) : (
            manutencoes.map(manutencao => (
              <div key={manutencao.id} style={styles.listItem}>
                <div style={styles.itemHeader}>
                  <div>
                    <h4 style={styles.itemTitle}>{manutencao.titulo}</h4>
                    <p style={styles.itemData}>
                      {new Date(manutencao.data_inicio).toLocaleString('pt-BR')}
                      {manutencao.data_fim && ` até ${new Date(manutencao.data_fim).toLocaleString('pt-BR')}`}
                    </p>
                  </div>
                  <div style={styles.itemActions}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: manutencao.status === 'programada' ? '#fff3cd' : '#f8d7da',
                    }}>
                      {manutencao.status === 'programada' ? '⏳ Programada' : '❌ Cancelada'}
                    </span>
                    {manutencao.status === 'programada' && (
                      <button
                        onClick={() => handleCancelarManutencao(manutencao.id)}
                        style={styles.cancelButton}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
                {manutencao.descricao && (
                  <p style={styles.itemDescricao}>{manutencao.descricao}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Avisos Ativos */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔔 Avisos Ativos</h3>
        <div style={styles.listContainer}>
          {avisos.length === 0 ? (
            <p style={styles.emptyText}>Nenhum aviso ativo</p>
          ) : (
            avisos.map(aviso => (
              <div key={aviso.id} style={styles.listItem}>
                <div style={styles.itemHeader}>
                  <div>
                    <h4 style={styles.itemTitle}>
                      {getTipoIcon(aviso.tipo)} {aviso.titulo}
                    </h4>
                    <p style={styles.itemData}>
                      {new Date(aviso.created_at).toLocaleString('pt-BR')} • {aviso.destino}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDesativarAviso(aviso.id)}
                    style={styles.cancelButton}
                  >
                    Desativar
                  </button>
                </div>
                <p style={styles.itemDescricao}>{aviso.mensagem}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const getTipoIcon = (tipo) => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };
  return icons[tipo] || 'ℹ️';
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px',
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
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#333',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  section: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  listItem: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  itemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  itemData: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
  },
  itemDescricao: {
    fontSize: '0.95rem',
    color: '#555',
    margin: 0,
    lineHeight: '1.5',
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
};

export default AdminManutencao;