import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';

import store from './store';
import { initializeLocalStorage } from './utils/localStorage';
import getTheme from './theme';


import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import ShipCreatePage from './pages/ShipCreatePage';
import ShipEditPage from './pages/ShipEditPage';
import JobsPage from './pages/JobsPage';
import JobCreatePage from './pages/JobCreatePage';
import JobEditPage from './pages/JobEditPage';
import CalendarPage from './pages/CalendarPage';
import ComponentsPage from './pages/ComponentsPage';
import ComponentDetailPage from './pages/ComponentDetailPage';
import SettingsPage from './pages/SettingsPage';


import ProtectedRoute from './components/ProtectedRoute';


// const roleAccess = {
//   Admin: ['/dashboard', '/ships', '/jobs', '/calendar', '/components', '/settings'],
//   Inspector: ['/dashboard', '/ships', '/calendar', '/components', '/settings'],
//   Engineer: ['/dashboard', '/jobs', '/calendar', '/components', '/settings'],
// };

const THEME_KEY = 'appTheme';

function App() {
  useEffect(() => {
   
    initializeLocalStorage();
  }, []);

 
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const getInitialTheme = () => {
    const stored = localStorage.getItem(THEME_KEY) || 'system';
    if (stored === 'system') return getSystemTheme();
    return stored;
  };

  const [themeMode, setThemeMode] = useState(getInitialTheme());


  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) || 'system';
    if (stored === 'system') {
      const listener = (e) => {
        setThemeMode(e.matches ? 'dark' : 'light');
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
      };
    }
  }, []);

  const handleThemeChange = (mode) => {
    if (mode === 'system') {
      setThemeMode(getSystemTheme());
    } else {
      setThemeMode(mode);
    }
  };

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            
            <Route path="/login" element={<LoginPage />} />
            
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/ships" element={<ProtectedRoute roles={["Admin", "Inspector"]}><ShipsPage /></ProtectedRoute>} />
              <Route path="/ships/create" element={<ProtectedRoute roles={["Admin"]}><ShipCreatePage /></ProtectedRoute>} />
              <Route path="/ships/:id/edit" element={<ProtectedRoute roles={["Admin"]}><ShipEditPage /></ProtectedRoute>} />
              <Route path="/ships/:id" element={<ProtectedRoute roles={["Admin", "Inspector"]}><ShipDetailPage /></ProtectedRoute>} />
              <Route path="/components" element={<ProtectedRoute roles={["Admin", "Engineer"]}><ComponentsPage /></ProtectedRoute>} />
              <Route path="/components/:id" element={<ProtectedRoute roles={["Admin", "Engineer"]}><ComponentDetailPage /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute roles={["Admin", "Engineer"]}><JobsPage /></ProtectedRoute>} />
              <Route path="/jobs/create" element={<ProtectedRoute roles={["Admin"]}><JobCreatePage /></ProtectedRoute>} />
              <Route path="/jobs/:id/edit" element={<ProtectedRoute roles={["Admin"]}><JobEditPage /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage onThemeChange={handleThemeChange} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
