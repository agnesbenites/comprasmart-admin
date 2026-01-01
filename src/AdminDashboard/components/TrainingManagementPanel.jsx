// app-frontend/src/pages/ConsultorDashboard/components/TrainingPanel.jsx

import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaCheckCircle, FaLock, FaPlay, FaFileAlt, FaVideo, FaExclamationTriangle, FaClock, FaStore, FaShieldAlt } from 'react-icons/fa';

const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const TrainingPanel = ({ consultorId }) => {
  const [treinamentosPlataforma, setTreinamentosPlataforma] = useState([]);
  const [treinamentosLojistas, setTreinamentosLojistas] = useState([]);
  const [treinamentosConcluidos, setTreinamentosConcluidos] = useState([]);
  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressoGeral, setProgressoGeral] = useState(0);

  useEffect(() => {
    carregarTreinamentos();
  }, []);

  const carregarTreinamentos = async () => {
    setLoading(true);
    try {
      // TODO: Buscar da API
      // const response = await fetch(`${API_URL}/api/consultores/${consultorId}/treinamentos`);
      
      setTimeout(() => {
        setTreinamentosPlataforma(mockTreinamentosPlataforma);
        setTreinamentosLojistas(mockTreinamentosLojistas);
        setTreinamentosConcluidos(['PLAT-001', 'PLAT-002', 'LOJ-001']); // IDs dos concluidos
        calcularProgresso();
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      setLoading(false);
    }
  };

  const mockTreinamentosPlataforma = [
    {
      id: 'PLAT-001',
      titulo: 'Conduta e Comunicacao na Plataforma',
      descricao: 'O que voca pode ou nao perguntar e falar nas chamadas, mensagens de audio e texto',
      tipo: 'video',
      duracao: '15 min',
      obrigatorio: true,
      conteudo: {
        topicos: [
          'Perguntas permitidas e proibidas',
          'Linguagem apropriada e profissional',
          'Limites de privacidade do cliente',
          'Como lidar com situacoes delicadas',
          'Politica de dados pessoais (LGPD)',
        ],
        pontosPrincipais: [
          ' NUNCA pergunte: CPF, numero do cartao, senhas bancarias',
          ' NUNCA fale sobre: politica, religiao, questoes pessoais intimas',
          ' SEMPRE mantenha: profissionalismo, respeito, foco no produto',
          ' SEMPRE ofereca: informacoes tecnicas, comparacoes, suporte na escolha',
        ]
      }
    },
    {
      id: 'PLAT-002',
      titulo: 'Pesquisa Eficiente de Produtos',
      descricao: 'Como fazer pesquisa de produtos de maneira eficiente e assertiva',
      tipo: 'documento',
      duracao: '10 min',
      obrigatorio: true,
      conteudo: {
        topicos: [
          'Uso de filtros avancados',
          'Palavras-chave eficientes',
          'Comparacao de especificacoes',
          'Verificacao de estoque em tempo real',
          'Identificacao de melhores ofertas',
        ],
        pontosPrincipais: [
          ' Use filtros por categoria, faixa de preco e marca',
          ' Compare pelo menos 3 produtos similares',
          ' Sempre verifique disponibilidade antes de recomendar',
          ' Destaque diferenciais tecnicos relevantes ao cliente',
        ]
      }
    },
    {
      id: 'PLAT-003',
      titulo: 'Boas Praticas na Plataforma',
      descricao: 'Diretrizes para atuacao profissional e etica',
      tipo: 'video',
      duracao: '20 min',
      obrigatorio: true,
      conteudo: {
        topicos: [
          'Pontualidade e disponibilidade',
          'Qualidade no atendimento',
          'Gestao de multiplas chamadas',
          'Resolucao de conflitos',
          '‰tica profissional',
        ],
        pontosPrincipais: [
          '° Mantenha seu status atualizado',
          ' Responda mensagens em ate 2 minutos',
          ' Finalize vendas com eficiancia',
          'i Busque avaliacoes positivas',
        ]
      }
    },
    {
      id: 'PLAT-004',
      titulo: 'Compliance e Gravacao de Chamadas',
      descricao: 'Politica de monitoramento e privacidade',
      tipo: 'documento',
      duracao: '8 min',
      obrigatorio: true,
      conteudo: {
        topicos: [
          'Politica de gravacao de chamadas',
          'Monitoramento de mensagens',
          'Finalidade do compliance',
          'Seus direitos e deveres',
          'Consequancias de violacoes',
        ],
        pontosPrincipais: [
          ' A plataforma pode gravar chamadas aleatoriamente SEM AVISO PR‰VIO',
          ' Mensagens podem ser auditadas para fins de compliance',
          ' Objetivo: manter integridade e compromisso com usuarios',
          '– Violacoes graves podem resultar em suspensao ou banimento',
        ],
        avisoImportante: 'ATENCAO: Todas as interacoes na plataforma podem ser monitoradas para garantir a qualidade e seguranca de todos os usuarios. Ao aceitar os termos, voca concorda com esta politica.'
      }
    },
    {
      id: 'PLAT-005',
      titulo: 'Protocolo de Problemas e Reports',
      descricao: 'Como reportar problemas com lojas e produtos',
      tipo: 'documento',
      duracao: '12 min',
      obrigatorio: true,
      conteudo: {
        topicos: [
          'Quando usar o sistema de reports',
          'Tipos de problemas reportaveis',
          'Como documentar evidancias',
          'Prazos de resposta',
          'O que NAO fazer',
        ],
        pontosPrincipais: [
          ' NUNCA acione diretamente as lojas sobre problemas',
          ' SEMPRE use o sistema de reports da plataforma',
          ' Anexe prints e evidancias quando possivel',
          '± Aguarde ate 30 dias para retorno oficial',
          ' Nao tente resolver problemas por fora da plataforma',
        ],
        avisoImportante: 'IMPORTANTE: O consultor NAO pode contatar lojas diretamente. Qualquer problema deve ser reportado atraves da plataforma para analise adequada.'
      }
    },
  ];

  const mockTreinamentosLojistas = [
    {
      id: 'LOJ-001',
      titulo: 'Lancamento Samsung Galaxy S24 Ultra',
      descricao: 'Especificacoes tecnicas e diferenciais do novo flagship',
      loja: 'Eletr´nicos Center',
      segmento: 'Smartphones',
      tipo: 'video',
      duracao: '18 min',
      dataPublicacao: '2024-12-01',
      relevante: true, // Se e relevante para os segmentos do consultor
      conteudo: {
        topicos: [
          'Especificacoes tecnicas completas',
          'Comparacao com modelo anterior',
          'Diferenciais de c¢mera e IA',
          'Precos e condicoes especiais',
        ]
      }
    },
    {
      id: 'LOJ-002',
      titulo: 'Nova Linha de Geladeiras Brastemp Inverse',
      descricao: 'Tecnologia inverter e economia de energia',
      loja: 'Tech Store',
      segmento: 'Eletrodomesticos',
      tipo: 'documento',
      duracao: '12 min',
      dataPublicacao: '2024-11-28',
      relevante: false,
      conteudo: {
        topicos: [
          'Tecnologia inverter',
          'Economia de energia',
          'Capacidades disponiveis',
          'Garantia estendida',
        ]
      }
    },
    {
      id: 'LOJ-003',
      titulo: 'Promocao Black Friday - Eletr´nicos',
      descricao: 'Produtos em destaque e condicoes especiais',
      loja: 'Eletr´nicos Center',
      segmento: 'Eletr´nicos',
      tipo: 'documento',
      duracao: '8 min',
      dataPublicacao: '2024-11-20',
      relevante: true,
      conteudo: {
        topicos: [
          'Produtos com maior desconto',
          'Condicoes de pagamento',
          'Estoque limitado - prioridades',
          'Comissao diferenciada',
        ]
      }
    },
  ];

  const calcularProgresso = () => {
    const totalObrigatorios = mockTreinamentosPlataforma.filter(t => t.obrigatorio).length;
    const concluidos = mockTreinamentosPlataforma.filter(t => 
      t.obrigatorio && treinamentosConcluidos.includes(t.id)
    ).length;
    
    const progresso = totalObrigatorios > 0 ? (concluidos / totalObrigatorios) * 100 : 0;
    setProgressoGeral(Math.round(progresso));
  };

  const isConcluido = (treinamentoId) => {
    return treinamentosConcluidos.includes(treinamentoId);
  };

  const isHabilitado = () => {
    const todosObrigatoriosConcluidos = mockTreinamentosPlataforma
      .filter(t => t.obrigatorio)
      .every(t => isConcluido(t.id));
    
    return todosObrigatoriosConcluidos;
  };

  const iniciarTreinamento = (treinamento) => {
    setTreinamentoSelecionado(treinamento);
  };

  const concluirTreinamento = async (treinamentoId) => {
    // TODO: Marcar como concluido na API
    // await fetch(`${API_URL}/api/consultores/${consultorId}/treinamentos/${treinamentoId}/concluir`, {
    //   method: 'POST'
    // });

    setTreinamentosConcluidos([...treinamentosConcluidos, treinamentoId]);
    setTreinamentoSelecionado(null);
    calcularProgresso();
    alert(' Treinamento concluido com sucesso!');
  };

  const voltarParaLista = () => {
    setTreinamentoSelecionado(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando treinamentos...</p>
      </div>
    );
  }

  // Visualizacao Detalhada do Treinamento
  if (treinamentoSelecionado) {
    return (
      <div style={styles.container}>
        <div style={styles.detailHeader}>
          <button onClick={voltarParaLista} style={styles.backButton}>
            &#8592; Voltar
          </button>
          
          <div style={styles.detailTitleSection}>
            <h2 style={styles.detailTitle}>{treinamentoSelecionado.titulo}</h2>
            <p style={styles.detailSubtitle}>{treinamentoSelecionado.descricao}</p>
            <div style={styles.detailMeta}>
              {treinamentoSelecionado.tipo === 'video' ? (
                <span><FaVideo /> Video</span>
              ) : (
                <span><FaFileAlt /> Documento</span>
              )}
              <span><FaClock /> {treinamentoSelecionado.duracao}</span>
              {treinamentoSelecionado.loja && (
                <span><FaStore /> {treinamentoSelecionado.loja}</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.detailContent}>
          {/* Simulacao de Video */}
          {treinamentoSelecionado.tipo === 'video' && (
            <div style={styles.videoPlayer}>
              <FaPlay size={60} color="white" />
              <p style={styles.videoText}>Player de Video</p>
            </div>
          )}

          {/* Conteudo do Treinamento */}
          <div style={styles.contentSection}>
            <h3 style={styles.contentTitle}> Conteudo Programatico</h3>
            <ul style={styles.topicosList}>
              {treinamentoSelecionado.conteudo.topicos.map((topico, index) => (
                <li key={index} style={styles.topicoItem}>{topico}</li>
              ))}
            </ul>
          </div>

          {treinamentoSelecionado.conteudo.pontosPrincipais && (
            <div style={styles.contentSection}>
              <h3 style={styles.contentTitle}>i Pontos Principais</h3>
              <div style={styles.pontosList}>
                {treinamentoSelecionado.conteudo.pontosPrincipais.map((ponto, index) => (
                  <div key={index} style={styles.pontoItem}>{ponto}</div>
                ))}
              </div>
            </div>
          )}

          {treinamentoSelecionado.conteudo.avisoImportante && (
            <div style={styles.avisoCard}>
              <FaExclamationTriangle size={24} color="#dc3545" />
              <div>
                <h4 style={styles.avisoTitle}>  Aviso Importante</h4>
                <p style={styles.avisoText}>{treinamentoSelecionado.conteudo.avisoImportante}</p>
              </div>
            </div>
          )}

          {!isConcluido(treinamentoSelecionado.id) && (
            <button
              onClick={() => concluirTreinamento(treinamentoSelecionado.id)}
              style={styles.concluirButton}
            >
              <FaCheckCircle /> Marcar como Concluido
            </button>
          )}
        </div>
      </div>
    );
  }

  // Visualizacao em Lista
  return (
    <div style={styles.container}>
      {/* Header com Status de Habilitacao */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}> Treinamentos e Capacitacao</h2>
          <p style={styles.subtitle}>Complete os treinamentos obrigatorios para ficar 100% habilitado</p>
        </div>

        <div style={styles.statusCard}>
          {isHabilitado() ? (
            <>
              <FaCheckCircle size={40} color="#28a745" />
              <div>
                <p style={styles.statusLabel}>Status</p>
                <p style={{ ...styles.statusValue, color: '#28a745' }}> Habilitado</p>
              </div>
            </>
          ) : (
            <>
              <FaLock size={40} color="#ffc107" />
              <div>
                <p style={styles.statusLabel}>Status</p>
                <p style={{ ...styles.statusValue, color: '#ffc107' }}>o Em Treinamento</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Barra de Progresso */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progresso dos Treinamentos Obrigatorios</span>
          <span style={styles.progressPercentage}>{progressoGeral}%</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div 
            style={{
              ...styles.progressBarFill,
              width: `${progressoGeral}%`,
            }}
          />
        </div>
      </div>

      {/* Duas Colunas */}
      <div style={styles.columnsContainer}>
        
        {/* Coluna 1: Treinamentos da Plataforma */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaShieldAlt size={24} color={CONSULTOR_PRIMARY} />
            <h3 style={styles.columnTitle}>Treinamentos da Plataforma</h3>
          </div>
          <p style={styles.columnDescription}>
            Politicas, diretrizes e boas praticas para atuacao profissional
          </p>

          <div style={styles.treinamentosList}>
            {treinamentosPlataforma.map(treinamento => (
              <TrainCard
                key={treinamento.id}
                treinamento={treinamento}
                isConcluido={isConcluido(treinamento.id)}
                onIniciar={() => iniciarTreinamento(treinamento)}
              />
            ))}
          </div>
        </div>

        {/* Coluna 2: Treinamentos dos Lojistas */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaStore size={24} color={CONSULTOR_PRIMARY} />
            <h3 style={styles.columnTitle}>Treinamentos e Informes das Lojas</h3>
          </div>
          <p style={styles.columnDescription}>
            Conteudos sobre produtos, promocoes e politicas especificas das lojas
          </p>

          <div style={styles.treinamentosList}>
            {treinamentosLojistas
              .filter(t => t.relevante) // Filtrar apenas relevantes ao segmento
              .map(treinamento => (
                <TrainCard
                  key={treinamento.id}
                  treinamento={treinamento}
                  isConcluido={isConcluido(treinamento.id)}
                  onIniciar={() => iniciarTreinamento(treinamento)}
                  isLojista={true}
                />
              ))}
          </div>

          {treinamentosLojistas.filter(t => t.relevante).length === 0 && (
            <div style={styles.emptyState}>
              <FaStore size={40} color="#ccc" />
              <p style={styles.emptyText}>Nenhum treinamento disponivel no momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Treinamento
const TrainCard = ({ treinamento, isConcluido, onIniciar, isLojista = false }) => (
  <div style={{
    ...styles.trainCard,
    borderLeft: `4px solid ${isConcluido ? '#28a745' : treinamento.obrigatorio ? '#dc3545' : '#ffc107'}`,
    opacity: isConcluido ? 0.8 : 1,
  }}>
    <div style={styles.trainCardHeader}>
      <div style={styles.trainCardTitle}>
        {isConcluido && <FaCheckCircle color="#28a745" size={20} />}
        {treinamento.obrigatorio && !isConcluido && (
          <span style={styles.obrigatorioTag}>OBRIGAT“RIO</span>
        )}
        <h4 style={styles.trainTitle}>{treinamento.titulo}</h4>
      </div>
      {isLojista && (
        <span style={styles.segmentoBadge}>{treinamento.segmento}</span>
      )}
    </div>

    <p style={styles.trainDescription}>{treinamento.descricao}</p>

    <div style={styles.trainMeta}>
      {treinamento.tipo === 'video' ? (
        <span style={styles.metaItem}><FaVideo /> Video</span>
      ) : (
        <span style={styles.metaItem}><FaFileAlt /> Documento</span>
      )}
      <span style={styles.metaItem}><FaClock /> {treinamento.duracao}</span>
      {isLojista && (
        <span style={styles.metaItem}><FaStore /> {treinamento.loja}</span>
      )}
    </div>

    <button
      onClick={onIniciar}
      style={{
        ...styles.iniciarButton,
        backgroundColor: isConcluido ? '#6c757d' : CONSULTOR_PRIMARY,
      }}
    >
      {isConcluido ? 'Revisar Conteudo' : 'Iniciar Treinamento'}
    </button>
  </div>
);

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '25px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2c5aa0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  statusCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
  },
  statusLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statusValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: 0,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  progressLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: CONSULTOR_PRIMARY,
  },
  progressBarContainer: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: CONSULTOR_PRIMARY,
    transition: 'width 0.3s',
  },
  columnsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
  },
  column: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  columnTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  columnDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '25px',
    lineHeight: '1.5',
  },
  treinamentosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  trainCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    borderLeft: '4px solid',
    transition: 'transform 0.2s',
  },
  trainCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '10px',
  },
  trainCardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  obrigatorioTag: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  segmentoBadge: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    color: CONSULTOR_PRIMARY,
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  trainTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  trainDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  trainMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '13px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  iniciarButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '15px',
  },
  // Estilos para visualizacao detalhada
  detailHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  detailTitleSection: {
    marginBottom: '15px',
  },
  detailTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  detailSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '15px',
  },
  detailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
  },
  detailContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  videoPlayer: {
    backgroundColor: '#000',
    borderRadius: '12px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  videoText: {
    color: 'white',
    fontSize: '18px',
    marginTop: '15px',
  },
  contentSection: {
    marginBottom: '30px',
  },
  contentTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  topicosList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  topicoItem: {
    fontSize: '15px',
    color: '#666',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
    paddingLeft: '25px',
    position: 'relative',
  },
  pontosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pontoItem: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    padding: '15px',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.6',
  },
  avisoCard: {
    backgroundColor: '#fff5f5',
    border: '2px solid #dc3545',
    borderRadius: '12px',
    padding: '25px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '30px',
  },
  avisoTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#dc3545',
    margin: '0 0 10px 0',
  },
  avisoText: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
    lineHeight: '1.6',
  },
  concluirButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '16px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
  },
};

export default TrainingPanel;
