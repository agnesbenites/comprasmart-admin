// admin-frontend/src/AdminDashboard/pages/AdminUsuarios.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaUserShield, FaPlus, FaTrash, FaKey, FaEnvelope } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminUsuarios = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({
    email: '',
    password: '',
    nome: '',
  });

  useEffect(() => {
    carregarAdmins();
  }, []);

  const carregarAdmins = async () => {
    setLoading(true);
    try {
      // Buscar todos os usuários com role admin
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email, created_at, raw_user_meta_data')
        .eq('raw_user_meta_data->role', 'admin');

      if (error) {
        console.error('Erro ao carregar admins:', error);
        // Fallback: tentar via RPC ou outra query
        setAdmins([]);
      } else {
        setAdmins(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const criarNovoAdmin = async () => {
    if (!novoAdmin.email || !novoAdmin.password) {
      alert('❌ Preencha email e senha!');
      return;
    }

    if (novoAdmin.password.length < 8) {
      alert('❌ A senha deve ter no mínimo 8 caracteres!');
      return;
    }

    try {
      setLoading(true);

      // Criar usuário via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: novoAdmin.email,
        password: novoAdmin.password,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          nome: novoAdmin.nome || novoAdmin.email.split('@')[0],
        },
      });

      if (authError) throw authError;

      alert('✅ Administrador criado com sucesso!');
      setModalAberto(false);
      setNovoAdmin({ email: '', password: '', nome: '' });
      carregarAdmins();

    } catch (error) {
      console.error('Erro ao criar admin:', error);
      
      // Se a API admin não funcionar, mostrar instruções SQL
      if (error.message?.includes('admin') || error.message?.includes('not authorized')) {
        alert(`⚠️ A criação via interface está desabilitada.
        
Execute este SQL no Supabase:

-- Criar usuário admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role
) VALUES (
  gen_random_uuid(),
  '${novoAdmin.email}',
  crypt('${novoAdmin.password}', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","nome":"${novoAdmin.nome}"}',
  'authenticated'
);`);
      } else {
        alert(`❌ Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const excluirAdmin = async (adminId, adminEmail) => {
    if (!window.confirm(`⚠️ ATENÇÃO!\n\nDeseja realmente excluir o admin:\n${adminEmail}?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(adminId);
      
      if (error) throw error;

      alert('✅ Administrador excluído!');
      carregarAdmins();

    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert(`❌ Erro ao excluir: ${error.message}\n\nUse o SQL Editor do Supabase para excluir manualmente.`);
    }
  };

  const resetarSenha = async (adminEmail) => {
    if (!window.confirm(`Enviar email de recuperação de senha para:\n${adminEmail}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert(`✅ Email de recuperação enviado para ${adminEmail}!`);

    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert(`❌ Erro: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando administradores...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👨‍💼 Gerenciar Administradores</h1>
          <p style={styles.subtitle}>Usuários com acesso ao painel administrativo</p>
        </div>
        <button onClick={() => setModalAberto(true)} style={styles.addButton}>
          <FaPlus /> Novo Admin
        </button>
      </div>

      {/* Aviso de Segurança */}
      <div style={styles.warningCard}>
        <span style={styles.warningIcon}>🔒</span>
        <div>
          <strong>Importante:</strong> Administradores têm acesso total ao sistema.
          Adicione apenas pessoas de confiança.
        </div>
      </div>

      {/* Lista de Admins */}
      <div style={styles.adminsGrid}>
        {admins.length === 0 ? (
          <div style={styles.emptyState}>
            <FaUserShield size={60} color="#ccc" />
            <p style={styles.emptyText}>Nenhum administrador encontrado</p>
            <p style={styles.emptyHint}>
              Use o SQL Editor do Supabase para verificar usuários com role 'admin'
            </p>
          </div>
        ) : (
          admins.map(admin => (
            <AdminCard
              key={admin.id}
              admin={admin}
              onDelete={() => excluirAdmin(admin.id, admin.email)}
              onResetPassword={() => resetarSenha(admin.email)}
            />
          ))
        )}
      </div>

      {/* Instruções SQL */}
      <div style={styles.sqlCard}>
        <h3 style={styles.sqlTitle}>📝 Como criar admin via SQL (método alternativo):</h3>
        <pre style={styles.sqlCode}>{`-- Execute no Supabase SQL Editor:

INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data,
  raw_user_meta_data, role
) VALUES (
  gen_random_uuid(),
  'novo@email.com',
  crypt('SuaSenha123!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","nome":"Nome do Admin"}',
  'authenticated'
);`}</pre>
      </div>

      {/* Modal Novo Admin */}
      {modalAberto && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>➕ Novo Administrador</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nome (opcional)</label>
              <input
                type="text"
                value={novoAdmin.nome}
                onChange={(e) => setNovoAdmin({...novoAdmin, nome: e.target.value})}
                style={styles.input}
                placeholder="Nome do administrador"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={novoAdmin.email}
                onChange={(e) => setNovoAdmin({...novoAdmin, email: e.target.value})}
                style={styles.input}
                placeholder="admin@exemplo.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Senha *</label>
              <input
                type="password"
                value={novoAdmin.password}
                onChange={(e) => setNovoAdmin({...novoAdmin, password: e.target.value})}
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                required
              />
              <small style={styles.hint}>
                Mínimo 8 caracteres. Recomendado: letras, números e símbolos.
              </small>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setModalAberto(false)} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={criarNovoAdmin} style={styles.saveButton} disabled={loading}>
                {loading ? '⏳ Criando...' : '✨ Criar Admin'}
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

const AdminCard = ({ admin, onDelete, onResetPassword }) => (
  <div style={styles.adminCard}>
    <div style={styles.adminHeader}>
      <div style={styles.adminAvatar}>
        <FaUserShield size={24} color="white" />
      </div>
      <div style={styles.adminInfo}>
        <h3 style={styles.adminNome}>
          {admin.raw_user_meta_data?.nome || admin.email.split('@')[0]}
        </h3>
        <p style={styles.adminEmail}>
          <FaEnvelope size={12} /> {admin.email}
        </p>
        <p style={styles.adminData}>
          Criado em: {new Date(admin.created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>

    <div style={styles.adminActions}>
      <button onClick={onResetPassword} style={styles.resetButton} title="Resetar Senha">
        <FaKey /> Resetar Senha
      </button>
      <button onClick={onDelete} style={styles.deleteButton} title="Excluir">
        <FaTrash /> Excluir
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
  warningCard: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    display: 'flex',
    gap: '15px',
    fontSize: '0.95rem',
    color: '#856404',
  },
  warningIcon: {
    fontSize: '1.5rem',
  },
  adminsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  adminCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  adminHeader: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  adminAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: ADMIN_PRIMARY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminInfo: {
    flex: 1,
  },
  adminNome: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  adminEmail: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  adminData: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  adminActions: {
    display: 'flex',
    gap: '10px',
  },
  resetButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
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
    margin: '20px 0 10px 0',
  },
  emptyHint: {
    fontSize: '0.9rem',
    color: '#ccc',
    margin: 0,
  },
  sqlCard: {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '25px',
    borderRadius: '12px',
  },
  sqlTitle: {
    fontSize: '1.1rem',
    marginBottom: '15px',
  },
  sqlCode: {
    backgroundColor: '#1a202c',
    padding: '20px',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '0.9rem',
    lineHeight: '1.6',
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
    maxWidth: '500px',
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
  hint: {
    fontSize: '0.8rem',
    color: '#999',
    marginTop: '5px',
    display: 'block',
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

export default AdminUsuarios;