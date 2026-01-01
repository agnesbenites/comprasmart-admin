// admin-frontend/src/AdminDashboard/pages/AdminRoadmap.jsx

import React from 'react';
import { FaCheckCircle, FaClock, FaRocket, FaCalendar } from 'react-icons/fa';

const AdminRoadmap = () => {
  const implementado = [
    {
      id: 1,
      feature: 'Sistema de Comissões Automáticas',
      descricao: 'Cálculo e distribuição automática de comissões via Stripe Connect',
      data: 'Out/2024',
      status: 'completo',
    },
    {
      id: 2,
      feature: 'Campanhas de Marketing',
      descricao: 'Sistema completo de criação e gestão de campanhas publicitárias',
      data: 'Nov/2024',
      status: 'completo',
    },
    {
      id: 3,
      feature: 'Autenticação Biométrica',
      descricao: 'Login com reconhecimento facial para segurança adicional',
      data: 'Dez/2024',
      status: 'completo',
    },
    {
      id: 4,
      feature: 'Chat IA com Consultores',
      descricao: 'Assistente IA para ajudar consultores no atendimento',
      data: 'Dez/2024',
      status: 'completo',
    },
    {
      id: 5,
      feature: 'Dashboard Mobile',
      descricao: 'App mobile para consultores e lojistas (React Native)',
      data: 'Jan/2025',
      status: 'completo',
    },
    {
      id: 6,
      feature: 'Sistema de Treinamentos',
      descricao: 'Plataforma de educação com cursos e certificações',
      data: 'Jan/2025',
      status: 'completo',
    },
    {
      id: 7,
      feature: 'Dashboard Administrativo',
      descricao: 'Painel completo de controle e exportação de dados',
      data: 'Dez/2024',
      status: 'completo',
    },
    {
      id: 8,
      feature: 'Sistema de Indicações',
      descricao: 'Bonificação para lojistas que indicam novos parceiros',
      data: 'Nov/2024',
      status: 'completo',
    },
  ];

  const proximasMelhorias = [
    {
      id: 9,
      feature: 'Gamificação para Consultores',
      descricao: 'Sistema de pontos, badges e rankings para engajamento',
      data: 'Fev/2025',
      prioridade: 'alta',
      progresso: 60,
    },
    {
      id: 10,
      feature: 'Programa de Fidelidade',
      descricao: 'Cashback e pontos para clientes finais',
      data: 'Mar/2025',
      prioridade: 'alta',
      progresso: 30,
    },
    {
      id: 11,
      feature: 'Análise Preditiva de Vendas',
      descricao: 'IA para prever tendências e sugerir ações',
      data: 'Mar/2025',
      prioridade: 'media',
      progresso: 15,
    },
    {
      id: 12,
      feature: 'Integração com ERPs',
      descricao: 'Conexão com sistemas de gestão (SAP, TOTVS, etc)',
      data: 'Abr/2025',
      prioridade: 'alta',
      progresso: 0,
    },
    {
      id: 13,
      feature: 'Marketplace de Produtos',
      descricao: 'Catálogo unificado com produtos de todas as lojas',
      data: 'Mai/2025',
      prioridade: 'media',
      progresso: 0,
    },
    {
      id: 14,
      feature: 'App para Clientes Finais',
      descricao: 'Aplicativo consumidor para compras e acompanhamento',
      data: 'Jun/2025',
      prioridade: 'alta',
      progresso: 0,
    },
    {
      id: 15,
      feature: 'Sistema de Cashback',
      descricao: 'Devolução automática de valores em compras',
      data: 'Jul/2025',
      prioridade: 'media',
      progresso: 0,
    },
    {
      id: 16,
      feature: 'Relatórios Avançados',
      descricao: 'Business Intelligence com dashboards interativos',
      data: 'Ago/2025',
      prioridade: 'alta',
      progresso: 0,
    },
    {
      id: 17,
      feature: 'Sistema de Tickets',
      descricao: 'Suporte técnico integrado com chat e email',
      data: 'Set/2025',
      prioridade: 'media',
      progresso: 0,
    },
    {
      id: 18,
      feature: 'Integração WhatsApp Business',
      descricao: 'Atendimento e vendas via WhatsApp API',
      data: 'Out/2025',
      prioridade: 'alta',
      progresso: 0,
    },
  ];

  const prioridadeColors = {
    alta: '#dc3545',
    media: '#ffc107',
    baixa: '#17a2b8',
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <FaCalendar size={40} color="#2c5aa0" />
        <h1 style={styles.title}>📅 Roadmap de Desenvolvimento</h1>
        <p style={styles.subtitle}>
          Acompanhe o que já foi implementado e o que está por vir
        </p>
      </div>

      {/* Grid Lado a Lado */}
      <div style={styles.gridContainer}>
        {/* COLUNA ESQUERDA - IMPLEMENTADO */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaCheckCircle color="#28a745" size={24} />
            <h2 style={styles.columnTitle}>✅ Implementado</h2>
          </div>
          <p style={styles.columnSubtitle}>
            {implementado.length} funcionalidades entregues
          </p>

          <div style={styles.itemsList}>
            {implementado.map(item => (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemHeader}>
                  <FaCheckCircle color="#28a745" size={20} />
                  <span style={styles.itemData}>{item.data}</span>
                </div>
                <h3 style={styles.itemTitle}>{item.feature}</h3>
                <p style={styles.itemDescription}>{item.descricao}</p>
                <div style={styles.statusBadge}>
                  <span style={{...styles.badge, backgroundColor: '#28a745'}}>
                    Completo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA - PRÓXIMAS MELHORIAS */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaRocket color="#2c5aa0" size={24} />
            <h2 style={styles.columnTitle}>🚀 Próximas Melhorias</h2>
          </div>
          <p style={styles.columnSubtitle}>
            {proximasMelhorias.length} funcionalidades planejadas
          </p>

          <div style={styles.itemsList}>
            {proximasMelhorias.map(item => (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemHeader}>
                  <FaClock color={prioridadeColors[item.prioridade]} size={20} />
                  <span style={styles.itemData}>{item.data}</span>
                </div>
                <h3 style={styles.itemTitle}>{item.feature}</h3>
                <p style={styles.itemDescription}>{item.descricao}</p>
                
                {/* Barra de Progresso */}
                {item.progresso > 0 && (
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill, 
                          width: `${item.progresso}%`
                        }} 
                      />
                    </div>
                    <span style={styles.progressText}>{item.progresso}%</span>
                  </div>
                )}

                {/* Badge de Prioridade */}
                <div style={styles.statusBadge}>
                  <span 
                    style={{
                      ...styles.badge, 
                      backgroundColor: prioridadeColors[item.prioridade]
                    }}
                  >
                    Prioridade {item.prioridade.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div style={styles.summary}>
        <h3 style={styles.summaryTitle}>📊 Resumo</h3>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Funcionalidades Entregues</p>
            <p style={styles.summaryValue}>{implementado.length}</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Em Desenvolvimento</p>
            <p style={styles.summaryValue}>
              {proximasMelhorias.filter(i => i.progresso > 0).length}
            </p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Planejadas</p>
            <p style={styles.summaryValue}>
              {proximasMelhorias.filter(i => i.progresso === 0).length}
            </p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Alta Prioridade</p>
            <p style={styles.summaryValue}>
              {proximasMelhorias.filter(i => i.prioridade === 'alta').length}
            </p>
          </div>
        </div>
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
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '40px',
  },
  column: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  columnTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  columnSubtitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '20px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  itemData: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  itemDescription: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2c5aa0',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#666',
    minWidth: '40px',
  },
  statusBadge: {
    display: 'flex',
    gap: '8px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  summary: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  summaryCard: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 10px 0',
  },
  summaryValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c5aa0',
    margin: 0,
  },
};

export default AdminRoadmap;
