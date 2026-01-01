// admin-frontend/src/AdminDashboard/pages/AdminFinanceiro.jsx - COMPLETO COM TUDO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FaDollarSign, FaChartLine, FaShoppingCart, FaPercent,
  FaCalendar, FaDownload, FaFilter, FaStore, FaUsers,
  FaMoneyBillWave, FaCreditCard, FaFileInvoiceDollar,
  FaBullhorn, FaArrowUp, FaArrowDown, FaUserPlus, FaLayerGroup
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminFinanceiro = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  
  const [financeiro, setFinanceiro] = useState({
    // RECEITA RECORRENTE (MRR)
    mrrTotal: 0,
    mrrPorPlano: {
      basico: { quantidade: 0, receita: 0 },
      pro: { quantidade: 0, receita: 0 },
      enterprise: { quantidade: 0, receita: 0 },
    },
    
    // ADICIONAIS
    receitaAdicionais: 0,
    adicionaisPorTipo: {
      pacoteBasico: { quantidade: 0, receita: 0 },
      vendedores: { quantidade: 0, receita: 0 },
      produtos: { quantidade: 0, receita: 0 },
      filiais: { quantidade: 0, receita: 0 },
      erp: { quantidade: 0, receita: 0 },
    },
    
    // CAMPANHAS DE MARKETING
    receitaCampanhas: 0,
    campanhasPorPlano: {
      basico: { quantidade: 0, receita: 0, diasTotal: 0 },
      pro: { quantidade: 0, receita: 0, diasTotal: 0 },
      enterprise: { quantidade: 0, receita: 0, diasTotal: 0 },
    },
    topLojistasEmCampanhas: [],
    
    // UPGRADES/DOWNGRADES
    movimentacoes: {
      upgrades: { quantidade: 0, receitaGanha: 0 },
      downgrades: { quantidade: 0, receitaPerdida: 0 },
    },
    historicoMovimentacoes: [],
    
    // VENDAS (MARKETPLACE)
    faturamentoVendas: 0,
    comissoesTotais: 0,
    comissoesPagas: 0,
    comissoesAPagar: 0,
    
    // MÉTRICAS GERAIS
    totalClientes: 0,
    ticketMedioCliente: 0,
    churnRate: 0,
    crescimentoMRR: 0,
  });

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // ==========================================
      // 1. RECEITA RECORRENTE (MRR) - PLANOS BASE
      // ==========================================
      const { data: lojas } = await supabase
        .from('lojas_corrigida')
        .select('id, plano, status');

      const lojasAtivas = lojas?.filter(l => l.status === 'ativo') || [];
      
      const mrrPorPlano = {
        basico: { 
          quantidade: lojasAtivas.filter(l => l.plano === 'Básico').length, 
          receita: lojasAtivas.filter(l => l.plano === 'Básico').length * 50 
        },
        pro: { 
          quantidade: lojasAtivas.filter(l => l.plano === 'Pro').length, 
          receita: lojasAtivas.filter(l => l.plano === 'Pro').length * 150 
        },
        enterprise: { 
          quantidade: lojasAtivas.filter(l => l.plano === 'Enterprise').length, 
          receita: lojasAtivas.filter(l => l.plano === 'Enterprise').length * 360 
        },
      };

      const mrrTotal = mrrPorPlano.basico.receita + mrrPorPlano.pro.receita + mrrPorPlano.enterprise.receita;

      // ==========================================
      // 2. ADICIONAIS CONTRATADOS
      // ==========================================
      
      // Buscar na tabela de assinaturas/produtos contratados
      // (assumindo que você tem uma tabela 'assinaturas_adicionais')
      const { data: adicionais } = await supabase
        .from('assinaturas_adicionais')
        .select('*')
        .eq('status', 'ativa');

      const adicionaisPorTipo = {
        pacoteBasico: {
          quantidade: adicionais?.filter(a => a.tipo === 'pacote_basico').length || 0,
          receita: adicionais?.filter(a => a.tipo === 'pacote_basico').length * 49.90 || 0,
        },
        vendedores: {
          quantidade: adicionais?.filter(a => a.tipo === 'vendedor').length || 0,
          receita: adicionais?.filter(a => a.tipo === 'vendedor').length * 15 || 0,
        },
        produtos: {
          quantidade: adicionais?.filter(a => a.tipo === 'produtos').reduce((acc, a) => acc + (a.quantidade || 0), 0) || 0,
          receita: adicionais?.filter(a => a.tipo === 'produtos').length * 10 || 0,
        },
        filiais: {
          quantidade: adicionais?.filter(a => a.tipo === 'filial').length || 0,
          receita: adicionais?.filter(a => a.tipo === 'filial').length * 25 || 0,
        },
        erp: {
          quantidade: adicionais?.filter(a => a.tipo === 'erp').length || 0,
          receita: adicionais?.filter(a => a.tipo === 'erp').length * 59.90 || 0,
        },
      };

      const receitaAdicionais = Object.values(adicionaisPorTipo).reduce((acc, tipo) => acc + tipo.receita, 0);

      // ==========================================
      // 3. CAMPANHAS DE MARKETING
      // ==========================================
      const { data: campanhas } = await supabase
        .from('campanhas_marketing')
        .select('*, lojas_corrigida(plano)')
        .eq('status', 'ativa');

      const campanhasPorPlano = {
        basico: {
          quantidade: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Básico').length || 0,
          diasTotal: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Básico').reduce((acc, c) => acc + (c.dias_campanha || 0), 0) || 0,
          receita: 0,
        },
        pro: {
          quantidade: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Pro').length || 0,
          diasTotal: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Pro').reduce((acc, c) => acc + (c.dias_campanha || 0), 0) || 0,
          receita: 0,
        },
        enterprise: {
          quantidade: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Enterprise').length || 0,
          diasTotal: campanhas?.filter(c => c.lojas_corrigida?.plano === 'Enterprise').reduce((acc, c) => acc + (c.dias_campanha || 0), 0) || 0,
          receita: 0,
        },
      };

      // R$ 25,90 por dia
      campanhasPorPlano.basico.receita = campanhasPorPlano.basico.diasTotal * 25.90;
      campanhasPorPlano.pro.receita = campanhasPorPlano.pro.diasTotal * 25.90;
      campanhasPorPlano.enterprise.receita = campanhasPorPlano.enterprise.diasTotal * 25.90;

      const receitaCampanhas = campanhasPorPlano.basico.receita + campanhasPorPlano.pro.receita + campanhasPorPlano.enterprise.receita;

      // Top lojistas que mais gastam em campanhas
      const { data: topCampanhas } = await supabase
        .from('campanhas_marketing')
        .select('loja_id, lojas_corrigida(nome_fantasia), dias_campanha')
        .eq('status', 'ativa');

      const gastosPorLoja = {};
      topCampanhas?.forEach(c => {
        const lojaId = c.loja_id;
        if (!gastosPorLoja[lojaId]) {
          gastosPorLoja[lojaId] = {
            nome: c.lojas_corrigida?.nome_fantasia || 'Sem nome',
            dias: 0,
            gasto: 0,
          };
        }
        gastosPorLoja[lojaId].dias += c.dias_campanha || 0;
        gastosPorLoja[lojaId].gasto += (c.dias_campanha || 0) * 25.90;
      });

      const topLojistasEmCampanhas = Object.values(gastosPorLoja)
        .sort((a, b) => b.gasto - a.gasto)
        .slice(0, 10);

      // ==========================================
      // 4. UPGRADES/DOWNGRADES
      // ==========================================
      const { data: movimentacoes } = await supabase
        .from('historico_planos')
        .select('*')
        .gte('created_at', new Date(new Date().setDate(1)).toISOString()); // Mês atual

      const upgrades = movimentacoes?.filter(m => m.tipo === 'upgrade') || [];
      const downgrades = movimentacoes?.filter(m => m.tipo === 'downgrade') || [];

      const diferencaPlanos = {
        'Básico->Pro': 100,
        'Básico->Enterprise': 310,
        'Pro->Enterprise': 210,
        'Pro->Básico': -100,
        'Enterprise->Pro': -210,
        'Enterprise->Básico': -310,
      };

      const receitaGanhaUpgrades = upgrades.reduce((acc, m) => {
        const chave = `${m.plano_anterior}->${m.plano_novo}`;
        return acc + (diferencaPlanos[chave] || 0);
      }, 0);

      const receitaPerdidaDowngrades = Math.abs(downgrades.reduce((acc, m) => {
        const chave = `${m.plano_anterior}->${m.plano_novo}`;
        return acc + (diferencaPlanos[chave] || 0);
      }, 0));

      const historicoMovimentacoes = movimentacoes?.slice(0, 20).map(m => ({
        loja: m.loja_nome || 'N/A',
        de: m.plano_anterior,
        para: m.plano_novo,
        tipo: m.tipo,
        data: new Date(m.created_at).toLocaleDateString('pt-BR'),
        valor: diferencaPlanos[`${m.plano_anterior}->${m.plano_novo}`] || 0,
      })) || [];

      // ==========================================
      // 5. VENDAS (MARKETPLACE)
      // ==========================================
      const { data: vendas } = await supabase
        .from('vendas')
        .select('*');

      const faturamentoVendas = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;

      const { data: comissoes } = await supabase
        .from('comissoes')
        .select('*');

      const comissoesTotais = comissoes?.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;
      const comissoesPagas = comissoes?.filter(c => c.status === 'paga').reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) || 0;
      const comissoesAPagar = comissoesTotais - comissoesPagas;

      // ==========================================
      // 6. MÉTRICAS GERAIS
      // ==========================================
      const totalClientes = lojasAtivas.length;
      const receitaTotalMensal = mrrTotal + receitaAdicionais + receitaCampanhas;
      const ticketMedioCliente = totalClientes > 0 ? receitaTotalMensal / totalClientes : 0;

      setFinanceiro({
        mrrTotal,
        mrrPorPlano,
        receitaAdicionais,
        adicionaisPorTipo,
        receitaCampanhas,
        campanhasPorPlano,
        topLojistasEmCampanhas,
        movimentacoes: {
          upgrades: { quantidade: upgrades.length, receitaGanha: receitaGanhaUpgrades },
          downgrades: { quantidade: downgrades.length, receitaPerdida: receitaPerdidaDowngrades },
        },
        historicoMovimentacoes,
        faturamentoVendas,
        comissoesTotais,
        comissoesPagas,
        comissoesAPagar,
        totalClientes,
        ticketMedioCliente,
        churnRate: 0,
        crescimentoMRR: 0,
      });

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarRelatorio = () => {
    const csv = `
RELATÓRIO FINANCEIRO COMPLETO - COMPRASMART
Data: ${new Date().toLocaleDateString('pt-BR')}

═══════════════════════════════════════════════════════
RECEITA RECORRENTE MENSAL (MRR)
═══════════════════════════════════════════════════════
Total MRR,R$ ${financeiro.mrrTotal.toFixed(2)}

Por Plano:
Básico,${financeiro.mrrPorPlano.basico.quantidade} clientes,R$ ${financeiro.mrrPorPlano.basico.receita.toFixed(2)}
Pro,${financeiro.mrrPorPlano.pro.quantidade} clientes,R$ ${financeiro.mrrPorPlano.pro.receita.toFixed(2)}
Enterprise,${financeiro.mrrPorPlano.enterprise.quantidade} clientes,R$ ${financeiro.mrrPorPlano.enterprise.receita.toFixed(2)}

═══════════════════════════════════════════════════════
RECEITA DE ADICIONAIS
═══════════════════════════════════════════════════════
Total Adicionais,R$ ${financeiro.receitaAdicionais.toFixed(2)}

Por Tipo:
Pacote Básico,${financeiro.adicionaisPorTipo.pacoteBasico.quantidade},R$ ${financeiro.adicionaisPorTipo.pacoteBasico.receita.toFixed(2)}
Vendedores,${financeiro.adicionaisPorTipo.vendedores.quantidade},R$ ${financeiro.adicionaisPorTipo.vendedores.receita.toFixed(2)}
Produtos,${financeiro.adicionaisPorTipo.produtos.quantidade},R$ ${financeiro.adicionaisPorTipo.produtos.receita.toFixed(2)}
Filiais,${financeiro.adicionaisPorTipo.filiais.quantidade},R$ ${financeiro.adicionaisPorTipo.filiais.receita.toFixed(2)}
Módulo ERP,${financeiro.adicionaisPorTipo.erp.quantidade},R$ ${financeiro.adicionaisPorTipo.erp.receita.toFixed(2)}

═══════════════════════════════════════════════════════
CAMPANHAS DE MARKETING
═══════════════════════════════════════════════════════
Total Campanhas,R$ ${financeiro.receitaCampanhas.toFixed(2)}

Por Plano:
Básico,${financeiro.campanhasPorPlano.basico.quantidade} campanhas,${financeiro.campanhasPorPlano.basico.diasTotal} dias,R$ ${financeiro.campanhasPorPlano.basico.receita.toFixed(2)}
Pro,${financeiro.campanhasPorPlano.pro.quantidade} campanhas,${financeiro.campanhasPorPlano.pro.diasTotal} dias,R$ ${financeiro.campanhasPorPlano.pro.receita.toFixed(2)}
Enterprise,${financeiro.campanhasPorPlano.enterprise.quantidade} campanhas,${financeiro.campanhasPorPlano.enterprise.diasTotal} dias,R$ ${financeiro.campanhasPorPlano.enterprise.receita.toFixed(2)}

═══════════════════════════════════════════════════════
UPGRADES E DOWNGRADES (Este Mês)
═══════════════════════════════════════════════════════
Upgrades,${financeiro.movimentacoes.upgrades.quantidade},+R$ ${financeiro.movimentacoes.upgrades.receitaGanha.toFixed(2)}
Downgrades,${financeiro.movimentacoes.downgrades.quantidade},-R$ ${financeiro.movimentacoes.downgrades.receitaPerdida.toFixed(2)}

═══════════════════════════════════════════════════════
MARKETPLACE (Vendas e Comissões)
═══════════════════════════════════════════════════════
Faturamento Vendas,R$ ${financeiro.faturamentoVendas.toFixed(2)}
Comissões Totais,R$ ${financeiro.comissoesTotais.toFixed(2)}
Comissões Pagas,R$ ${financeiro.comissoesPagas.toFixed(2)}
Comissões a Pagar,R$ ${financeiro.comissoesAPagar.toFixed(2)}

═══════════════════════════════════════════════════════
RESUMO GERAL
═══════════════════════════════════════════════════════
Total Clientes Ativos,${financeiro.totalClientes}
Ticket Médio por Cliente,R$ ${financeiro.ticketMedioCliente.toFixed(2)}
Receita Total Mensal,R$ ${(financeiro.mrrTotal + financeiro.receitaAdicionais + financeiro.receitaCampanhas).toFixed(2)}
    `.trim();

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeiro-completo-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando análise financeira completa...</p>
      </div>
    );
  }

  const receitaTotalMensal = financeiro.mrrTotal + financeiro.receitaAdicionais + financeiro.receitaCampanhas;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 Financeiro Completo</h1>
          <p style={styles.subtitle}>Análise detalhada de todas as fontes de receita</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={carregarDados} style={styles.refreshButton}>
            🔄 Atualizar
          </button>
          <button onClick={exportarRelatorio} style={styles.exportButton}>
            <FaDownload /> Exportar CSV
          </button>
        </div>
      </div>

      {/* RESUMO EXECUTIVO */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Resumo Executivo</h3>
        <div style={styles.metricsGrid}>
          <MetricCard
            icon={<FaMoneyBillWave />}
            label="Receita Total Mensal"
            value={`R$ ${receitaTotalMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#28a745"
            sublabel={`${financeiro.totalClientes} clientes ativos`}
          />
          <MetricCard
            icon={<FaLayerGroup />}
            label="MRR (Planos Base)"
            value={`R$ ${financeiro.mrrTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#2c5aa0"
            sublabel={`${((financeiro.mrrTotal/receitaTotalMensal)*100).toFixed(0)}% da receita`}
          />
          <MetricCard
            icon={<FaUserPlus />}
            label="Adicionais"
            value={`R$ ${financeiro.receitaAdicionais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#ffc107"
            sublabel={`${((financeiro.receitaAdicionais/receitaTotalMensal)*100).toFixed(0)}% da receita`}
          />
          <MetricCard
            icon={<FaBullhorn />}
            label="Campanhas"
            value={`R$ ${financeiro.receitaCampanhas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#17a2b8"
            sublabel={`${((financeiro.receitaCampanhas/receitaTotalMensal)*100).toFixed(0)}% da receita`}
          />
        </div>
      </div>

      {/* MRR POR PLANO */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💳 Receita Recorrente por Plano (MRR)</h3>
        <div style={styles.planosGrid}>
          <PlanoCard
            nome="Básico"
            clientes={financeiro.mrrPorPlano.basico.quantidade}
            receita={financeiro.mrrPorPlano.basico.receita}
            color="#6c757d"
          />
          <PlanoCard
            nome="Pro"
            clientes={financeiro.mrrPorPlano.pro.quantidade}
            receita={financeiro.mrrPorPlano.pro.receita}
            color="#2c5aa0"
          />
          <PlanoCard
            nome="Enterprise"
            clientes={financeiro.mrrPorPlano.enterprise.quantidade}
            receita={financeiro.mrrPorPlano.enterprise.receita}
            color="#dc3545"
          />
        </div>
      </div>

      {/* ADICIONAIS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎁 Receita de Adicionais</h3>
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Quantidade</th>
                <th style={styles.th}>Receita Mensal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tr}>
                <td style={styles.td}>📦 Pacote Básico Adicional</td>
                <td style={styles.td}>{financeiro.adicionaisPorTipo.pacoteBasico.quantidade}</td>
                <td style={styles.tdBold}>R$ {financeiro.adicionaisPorTipo.pacoteBasico.receita.toFixed(2)}</td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>👨‍💼 Vendedores Extras</td>
                <td style={styles.td}>{financeiro.adicionaisPorTipo.vendedores.quantidade}</td>
                <td style={styles.tdBold}>R$ {financeiro.adicionaisPorTipo.vendedores.receita.toFixed(2)}</td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>📦 Produtos Extras</td>
                <td style={styles.td}>{financeiro.adicionaisPorTipo.produtos.quantidade}</td>
                <td style={styles.tdBold}>R$ {financeiro.adicionaisPorTipo.produtos.receita.toFixed(2)}</td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>🏪 Filiais Extras</td>
                <td style={styles.td}>{financeiro.adicionaisPorTipo.filiais.quantidade}</td>
                <td style={styles.tdBold}>R$ {financeiro.adicionaisPorTipo.filiais.receita.toFixed(2)}</td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>💼 Módulo ERP</td>
                <td style={styles.td}>{financeiro.adicionaisPorTipo.erp.quantidade}</td>
                <td style={styles.tdBold}>R$ {financeiro.adicionaisPorTipo.erp.receita.toFixed(2)}</td>
              </tr>
              <tr style={{...styles.tr, backgroundColor: '#f8f9fa', fontWeight: 'bold'}}>
                <td style={styles.td}>TOTAL ADICIONAIS</td>
                <td style={styles.td}>-</td>
                <td style={styles.tdBold}>R$ {financeiro.receitaAdicionais.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CAMPANHAS DE MARKETING */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📢 Campanhas de Marketing (R$ 25,90/dia)</h3>
        <div style={styles.campanhasGrid}>
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Por Plano</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Plano</th>
                  <th style={styles.th}>Campanhas</th>
                  <th style={styles.th}>Total Dias</th>
                  <th style={styles.th}>Receita</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.tr}>
                  <td style={styles.td}>Básico (5km)</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.basico.quantidade}</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.basico.diasTotal}</td>
                  <td style={styles.tdBold}>R$ {financeiro.campanhasPorPlano.basico.receita.toFixed(2)}</td>
                </tr>
                <tr style={styles.tr}>
                  <td style={styles.td}>Pro (10km)</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.pro.quantidade}</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.pro.diasTotal}</td>
                  <td style={styles.tdBold}>R$ {financeiro.campanhasPorPlano.pro.receita.toFixed(2)}</td>
                </tr>
                <tr style={styles.tr}>
                  <td style={styles.td}>Enterprise (20km)</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.enterprise.quantidade}</td>
                  <td style={styles.td}>{financeiro.campanhasPorPlano.enterprise.diasTotal}</td>
                  <td style={styles.tdBold}>R$ {financeiro.campanhasPorPlano.enterprise.receita.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Top 10 Lojistas em Campanhas</h4>
            {financeiro.topLojistasEmCampanhas.length === 0 ? (
              <p style={styles.emptyText}>Nenhuma campanha ativa</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Loja</th>
                    <th style={styles.th}>Dias</th>
                    <th style={styles.th}>Gasto Total</th>
                  </tr>
                </thead>
                <tbody>
                  {financeiro.topLojistasEmCampanhas.map((loja, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{loja.nome}</td>
                      <td style={styles.td}>{loja.dias}</td>
                      <td style={styles.tdBold}>R$ {loja.gasto.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* UPGRADES/DOWNGRADES */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📈 Movimentação de Planos (Este Mês)</h3>
        <div style={styles.movimentacoesGrid}>
          <div style={styles.movimentacaoCard}>
            <div style={{...styles.movIcon, backgroundColor: '#28a745'}}>
              <FaArrowUp size={30} color="white" />
            </div>
            <div>
              <p style={styles.movLabel}>Upgrades</p>
              <p style={styles.movQuantidade}>{financeiro.movimentacoes.upgrades.quantidade} clientes</p>
              <p style={{...styles.movValor, color: '#28a745'}}>
                +R$ {financeiro.movimentacoes.upgrades.receitaGanha.toFixed(2)}
              </p>
            </div>
          </div>

          <div style={styles.movimentacaoCard}>
            <div style={{...styles.movIcon, backgroundColor: '#dc3545'}}>
              <FaArrowDown size={30} color="white" />
            </div>
            <div>
              <p style={styles.movLabel}>Downgrades</p>
              <p style={styles.movQuantidade}>{financeiro.movimentacoes.downgrades.quantidade} clientes</p>
              <p style={{...styles.movValor, color: '#dc3545'}}>
                -R$ {financeiro.movimentacoes.downgrades.receitaPerdida.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Histórico */}
        {financeiro.historicoMovimentacoes.length > 0 && (
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Últimas Movimentações</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Loja</th>
                  <th style={styles.th}>De</th>
                  <th style={styles.th}>Para</th>
                  <th style={styles.th}>Impacto</th>
                  <th style={styles.th}>Data</th>
                </tr>
              </thead>
              <tbody>
                {financeiro.historicoMovimentacoes.map((mov, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>{mov.loja}</td>
                    <td style={styles.td}>{mov.de}</td>
                    <td style={styles.td}>{mov.para}</td>
                    <td style={{
                      ...styles.td,
                      color: mov.tipo === 'upgrade' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold',
                    }}>
                      {mov.tipo === 'upgrade' ? '+' : ''}R$ {mov.valor.toFixed(2)}
                    </td>
                    <td style={styles.td}>{mov.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MARKETPLACE */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🛒 Marketplace (Vendas e Comissões)</h3>
        <div style={styles.marketplaceGrid}>
          <MetricCard
            icon={<FaShoppingCart />}
            label="Faturamento Total"
            value={`R$ ${financeiro.faturamentoVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#2c5aa0"
          />
          <MetricCard
            icon={<FaMoneyBillWave />}
            label="Comissões Totais"
            value={`R$ ${financeiro.comissoesTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#ffc107"
          />
          <MetricCard
            icon={<FaFileInvoiceDollar />}
            label="Comissões Pagas"
            value={`R$ ${financeiro.comissoesPagas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#28a745"
          />
          <MetricCard
            icon={<FaCreditCard />}
            label="Comissões a Pagar"
            value={`R$ ${financeiro.comissoesAPagar.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            color="#dc3545"
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

// ==========================================
// COMPONENTES
// ==========================================

const MetricCard = ({ icon, label, value, color, sublabel }) => (
  <div style={{...styles.metricCard, borderLeft: `4px solid ${color}`}}>
    <div style={{ ...styles.metricIcon, color }}>{icon}</div>
    <div style={styles.metricContent}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
      {sublabel && <p style={styles.metricSublabel}>{sublabel}</p>}
    </div>
  </div>
);

const PlanoCard = ({ nome, clientes, receita, color }) => (
  <div style={styles.planoCard}>
    <div style={{...styles.planoHeader, backgroundColor: color}}>
      <h4 style={styles.planoNome}>{nome}</h4>
    </div>
    <div style={styles.planoBody}>
      <p style={styles.planoClientes}>{clientes} clientes</p>
      <p style={styles.planoReceita}>R$ {receita.toFixed(2)}/mês</p>
      <p style={styles.planoMedia}>
        R$ {clientes > 0 ? (receita/clientes).toFixed(2) : '0,00'} por cliente
      </p>
    </div>
  </div>
);

// ==========================================
// STYLES
// ==========================================

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
    flexWrap: 'wrap',
    gap: '15px',
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
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exportButton: {
    padding: '10px 20px',
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
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  metricCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  metricIcon: {
    fontSize: '2.5rem',
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 3px 0',
  },
  metricSublabel: {
    fontSize: '0.8rem',
    color: '#999',
    margin: 0,
  },
  planosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  planoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  planoHeader: {
    padding: '20px',
    textAlign: 'center',
  },
  planoNome: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  planoBody: {
    padding: '25px',
    textAlign: 'center',
  },
  planoClientes: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 10px 0',
  },
  planoReceita: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  planoMedia: {
    fontSize: '0.9rem',
    color: '#999',
    margin: 0,
  },
  tableCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginTop: '20px',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem',
    borderBottom: '2px solid #e9ecef',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '12px',
    fontSize: '0.9rem',
    color: '#666',
  },
  tdBold: {
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#333',
  },
  campanhasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  movimentacoesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  movimentacaoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  movIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  movLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  movQuantidade: {
    fontSize: '1.1rem',
    color: '#333',
    margin: '0 0 5px 0',
  },
  movValor: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0,
  },
  marketplaceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '1rem',
  },
};

export default AdminFinanceiro;