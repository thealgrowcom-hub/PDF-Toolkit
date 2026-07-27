import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
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
          <Route path="/settings" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Settings />
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
