import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ToolsManager from './pages/ToolsManager';
import MenuIconsManager from './pages/MenuIconsManager';
import SettingsEditor from './pages/SettingsEditor';
import BugsTracker from './pages/BugsTracker';
import AdsManager from './pages/AdsManager';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <DashboardHome />
              </main>
            </div>
          } />
          <Route path="/tools" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <ToolsManager />
              </main>
            </div>
          } />
          <Route path="/icons" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <MenuIconsManager />
              </main>
            </div>
          } />
          <Route path="/settings" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <SettingsEditor />
              </main>
            </div>
          } />
          <Route path="/bugs" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <BugsTracker />
              </main>
            </div>
          } />
          <Route path="/ads" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <AdsManager />
              </main>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
