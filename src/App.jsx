// admin-frontend/src/App.jsx - APENAS ARQUIVOS QUE EXISTEM

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin, AdminDashboard } from './AdminDashboard';
import Layout from './AdminDashboard/components/Layout';
import AdminLojistas from './AdminDashboard/pages/AdminLojistas';
import AdminTreinamentos from './AdminDashboard/pages/AdminTreinamentos';
import AdminNotificacoes from './AdminDashboard/pages/AdminNotificacoes';
import AdminConfiguracoes from './AdminDashboard/pages/AdminConfiguracoes';
import AdminRelatorios from './AdminDashboard/pages/AdminRelatorios';
import AdminFinanceiro from './AdminDashboard/pages/AdminFinanceiro';
import AdminCampanhas from './AdminDashboard/pages/AdminCampanhas';
import AdminRoadmap from './AdminDashboard/pages/AdminRoadmap';
import AdminGerenciarRoadmap from './AdminDashboard/pages/AdminGerenciarRoadmap';
import AdminMetricasClientes from './AdminDashboard/pages/AdminMetricasClientes';
import AdminMetricasLojistas from './AdminDashboard/pages/AdminMetricasLojistas';
import AdminMetricasConsultores from './AdminDashboard/pages/AdminMetricasConsultores';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas Principais */}
        <Route path="/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/lojistas" element={<Layout><AdminLojistas /></Layout>} />
        <Route path="/financeiro" element={<Layout><AdminFinanceiro /></Layout>} />
        <Route path="/campanhas" element={<Layout><AdminCampanhas /></Layout>} />
        <Route path="/treinamentos" element={<Layout><AdminTreinamentos /></Layout>} />
        <Route path="/relatorios" element={<Layout><AdminRelatorios /></Layout>} />
        <Route path="/roadmap" element={<Layout><AdminRoadmap /></Layout>} />
        <Route path="/gerenciar-roadmap" element={<Layout><AdminGerenciarRoadmap /></Layout>} />
        
        {/* Métricas */}
        <Route path="/metricas-lojistas" element={<Layout><AdminMetricasLojistas /></Layout>} />
        <Route path="/metricas-consultores" element={<Layout><AdminMetricasConsultores /></Layout>} />
        <Route path="/metricas-clientes" element={<Layout><AdminMetricasClientes /></Layout>} />
        
        {/* Outras */}
        <Route path="/notificacoes" element={<Layout><AdminNotificacoes /></Layout>} />
        <Route path="/configuracoes" element={<Layout><AdminConfiguracoes /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;