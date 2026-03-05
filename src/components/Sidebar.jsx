import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, MenuSquare, FileText, Bug, Image, LogOut } from 'lucide-react';
import { supabase } from '../supabase';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tools', label: 'Tools Manager', icon: Wrench },
        { path: '/icons', label: 'Menu Icons', icon: MenuSquare },
        { path: '/settings', label: 'Settings Editor', icon: FileText },
        { path: '/ads', label: 'Ad Manager', icon: Image },
        { path: '/bugs', label: 'Bugs Tracker', icon: Bug },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">PDF</div>
                <h1 className="logo-text">App Dashboard</h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                <div className="status-indicator">
                    <span className="dot online"></span>
                    <span>System Online</span>
                </div>
                <button
                    onClick={() => supabase.auth.signOut()}
                    style={{
                        marginTop: '16px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
