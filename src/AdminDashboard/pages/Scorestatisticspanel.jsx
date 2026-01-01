// app-frontend/src/pages/AdminDashboard/components/ScoreStatisticsPanel.jsx

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaChartBar, FaSyncAlt } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const ScoreStatisticsPanel = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculando, setRecalculando] = useState(false);

  useEffect(() => {
    carregarEstatisticas();
    carregarTop10();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch('/api/admin/scores/estatisticas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar estatisticas');

      const data = await response.json();
      setEstatisticas(data.estatisticas);
      
    } catch (error) {
      console.error('Erro:', error);
      // Mock data para desenvolvimento
      setEstatisticas(mockEstatisticas);
    } finally {
      setLoading(false);
    }
  };

  const carregarTop10 = async () => {
    try {
      const response = await fetch('/api/admin/scores/top-consultores?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar top 10');

      const data = await response.json();
      setTop10(data);
      
    } catch (error) {
      console.error('Erro:', error);
      setTop10(mockTop10);
    }
  };

  const handleRecalcularTodos = async () => {
    if (!confirm('Isso vai recalcular TODOS os scores. Pode levar alguns minutos. Confirmar?')) {
      return;
    }

    setRecalculando(true);
    try {
      const response = await fetch('/api/admin/scores/recalcular-todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao recalcular');

      alert(' Recalculo iniciado! Os scores serao atualizados em alguns minutos.');
      
      // Recarregar apos 5 segundos
      setTimeout(() => {
        carregarEstatisticas();
        carregarTop10();
      }, 5000);
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao recalcular scores');
    } finally {
      setRecalculando(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando estatisticas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}> Estatisticas de Scores</h2>
          <p style={styles.subtitle}>Visao geral do desempenho dos consultores</p>
        </div>
        <button 
          onClick={handleRecalcularTodos}
          disabled={recalculando}
          style={styles.recalcularButton}
        >
          <FaSyncAlt /> {recalculando ? 'Recalculando...' : 'Recalcular Todos'}
        </button>
      </div>

      {/* Cards de Resumo */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div>
            <p style={styles.cardLabel}>Total de Consultores</p>
            <p style={styles.cardValue}>{estatisticas.totalConsultores}</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>i</div>
          <div>
            <p style={styles.cardLabel}>Score Medio</p>
            <p style={styles.cardValue}>{estatisticas.scoreMedia}</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div>
            <p style={styles.cardLabel}>Score Mediano</p>
            <p style={styles.cardValue}>{estatisticas.scoreMediano}</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div>
            <p style={styles.cardLabel}>Score Maximo</p>
            <p style={styles.cardValue}>{estatisticas.scoreMaximo}</p>
          </div>
        </div>
      </div>

      {/* Distribuicao por Nivel */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Distribuicao por Nivel</h3>
        <div style={styles.distribuicaoGrid}>
          <NivelCard nivel="Diamante" icon="" count={estatisticas.totalDiamante} />
          <NivelCard nivel="Ouro" icon="" count={estatisticas.totalOuro} />
          <NivelCard nivel="Prata" icon="" count={estatisticas.totalPrata} />
          <NivelCard nivel="Bronze" icon="" count={estatisticas.totalBronze} />
          <NivelCard nivel="Iniciante" icon="" count={estatisticas.totalIniciante} />
        </div>
      </div>

      {/* Media por Componente */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Media por Componente</h3>
        <div style={styles.componentesGrid}>
          <ComponenteCard 
            titulo="Avaliacoes" 
            nota={estatisticas.mediaAvaliacoes} 
            peso={40}
            color="#ffc107"
          />
          <ComponenteCard 
            titulo="Vendas" 
            nota={estatisticas.mediaVendas} 
            peso={35}
            color="#28a745"
          />
          <ComponenteCard 
            titulo="Treinamentos" 
            nota={estatisticas.mediaTreinamentos} 
            peso={25}
            color="#2c5aa0"
          />
        </div>
      </div>

      {/* Top 10 Consultores */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}> Top 10 Consultores</h3>
        <div style={styles.top10List}>
          {top10.map((consultor, index) => (
            <div key={consultor.consultorId} style={styles.top10Item}>
              <div style={styles.top10Rank}>#{index + 1}</div>
              <div style={styles.top10Info}>
                <p style={styles.top10Nome}>{consultor.nome}</p>
                <p style={styles.top10Local}>{consultor.cidade}, {consultor.estado}</p>
              </div>
              <div style={styles.top10Score}>
                <span style={styles.top10ScoreValue}>{consultor.scoreTotal}</span>
                <span style={styles.top10Nivel}>{consultor.nivel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const NivelCard = ({ nivel, icon, count }) => (
  <div style={styles.nivelCard}>
    <div style={styles.nivelIcon}>{icon}</div>
    <p style={styles.nivelNome}>{nivel}</p>
    <p style={styles.nivelCount}>{count}</p>
  </div>
);

const ComponenteCard = ({ titulo, nota, peso, color }) => (
  <div style={styles.componenteCard}>
    <div style={styles.componenteHeader}>
      <span style={styles.componenteTitulo}>{titulo}</span>
      <span style={styles.componentePeso}>{peso}%</span>
    </div>
    <div style={{ ...styles.componenteNota, color }}>
      {nota.toFixed(1)}/10
    </div>
    <div style={styles.progressBar}>
      <div 
        style={{
          ...styles.progressFill,
          width: `${(nota / 10) * 100}%`,
          backgroundColor: color,
        }}
      />
    </div>
  </div>
);

// Mock data
const mockEstatisticas = {
  totalConsultores: 156,
  scoreMedia: 7.2,
  scoreMediano: 7.5,
  scoreMinimo: 2.1,
  scoreMaximo: 9.8,
  mediaAvaliacoes: 7.8,
  mediaVendas: 6.9,
  mediaTreinamentos: 7.0,
  totalDiamante: 12,
  totalOuro: 34,
  totalPrata: 56,
  totalBronze: 38,
  totalIniciante: 16,
};

const mockTop10 = [
  { consultorId: 1, nome: 'Carlos Mendes', cidade: 'Sao Paulo', estado: 'SP', scoreTotal: 9.8, nivel: 'Diamante' },
  { consultorId: 2, nome: 'Ana Silva', cidade: 'Rio de Janeiro', estado: 'RJ', scoreTotal: 9.5, nivel: 'Diamante' },
  { consultorId: 3, nome: 'Joao Santos', cidade: 'Belo Horizonte', estado: 'MG', scoreTotal: 9.2, nivel: 'Diamante' },
  { consultorId: 4, nome: 'Maria Oliveira', cidade: 'Curitiba', estado: 'PR', scoreTotal: 9.0, nivel: 'Diamante' },
  { consultorId: 5, nome: 'Pedro Costa', cidade: 'Porto Alegre', estado: 'RS', scoreTotal: 8.8, nivel: 'Ouro' },
  { consultorId: 6, nome: 'Julia Lima', cidade: 'Recife', estado: 'PE', scoreTotal: 8.6, nivel: 'Ouro' },
  { consultorId: 7, nome: 'Lucas Alves', cidade: 'Fortaleza', estado: 'CE', scoreTotal: 8.4, nivel: 'Ouro' },
  { consultorId: 8, nome: 'Camila Rocha', cidade: 'Salvador', estado: 'BA', scoreTotal: 8.2, nivel: 'Ouro' },
  { consultorId: 9, nome: 'Felipe Souza', cidade: 'Brasilia', estado: 'DF', scoreTotal: 8.0, nivel: 'Ouro' },
  { consultorId: 10, nome: 'Beatriz Martins', cidade: 'Manaus', estado: 'AM', scoreTotal: 7.9, nivel: 'Ouro' },
];

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
  recalcularButton: {
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  cardIcon: {
    fontSize: '2.5rem',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  distribuicaoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '15px',
  },
  nivelCard: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  nivelIcon: {
    fontSize: '3rem',
    marginBottom: '10px',
  },
  nivelNome: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    margin: '0 0 5px 0',
  },
  nivelCount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  componentesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  componenteCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  componenteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  componenteTitulo: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  componentePeso: {
    fontSize: '13px',
    color: '#666',
  },
  componenteNota: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  top10List: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  top10Item: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    gap: '15px',
  },
  top10Rank: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: ADMIN_PRIMARY,
    minWidth: '50px',
  },
  top10Info: {
    flex: 1,
  },
  top10Nome: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 3px 0',
  },
  top10Local: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  top10Score: {
    textAlign: 'right',
  },
  top10ScoreValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    display: 'block',
  },
  top10Nivel: {
    fontSize: '12px',
    color: '#666',
  },
};

export default ScoreStatisticsPanel;
