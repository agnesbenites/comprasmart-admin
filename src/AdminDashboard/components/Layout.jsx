// admin-frontend/src/AdminDashboard/components/Layout.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaStore, FaChartBar, FaDollarSign, FaBullhorn,
  FaBook, FaCalendar, FaTasks, FaSignOutAlt 
} from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/lojistas', icon: <FaStore />, label: 'Lojistas' },
    { path: '/financeiro', icon: <FaDollarSign />, label: 'Financeiro' },
    { path: '/campanhas', icon: <FaBullhorn />, label: 'Campanhas' },
    { path: '/treinamentos', icon: <FaBook />, label: 'Treinamentos' },
    { path: '/relatorios', icon: <FaChartBar />, label: 'Relatórios' },
    { path: '/roadmap', icon: <FaCalendar />, label: 'Roadmap' },
    { path: '/gerenciar-roadmap', icon: <FaTasks />, label: 'Gerenciar Roadmap' },
  ];

  const handleLogout = () => {
    if (window.confirm('Deseja sair?')) {
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>🛒 CompraSmart</h2>
          <p style={styles.logoSubtitle}>Admin</p>
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                backgroundColor: location.pathname === item.path ? ADMIN_PRIMARY : 'transparent',
                color: location.pathname === item.path ? 'white' : '#666',
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  sidebar: {
    width: '260px',
    backgroundColor: 'white',
    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    padding: '25px 20px',
    borderBottom: '1px solid #e9ecef',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: ADMIN_PRIMARY,
    margin: '0 0 5px 0',
  },
  logoSubtitle: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '20px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  navIcon: {
    fontSize: '18px',
  },
  navLabel: {
    flex: 1,
  },
  logoutButton: {
    margin: '20px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666',
  },
  main: {
    marginLeft: '260px',
    width: 'calc(100vw - 260px)',
    minWidth: 0,
    overflow: 'auto',
    backgroundColor: '#f8f9fa',
    padding: 0,
  },
};

export default Layout;