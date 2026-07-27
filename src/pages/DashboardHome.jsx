import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Image,
    Sliders,
    AlertCircle,
    ChevronRight,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { supabase } from '../supabase';

const StatCard = ({ title, value, icon: Icon, color, onClick, loading }) => (
    <div className="glass-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={onClick}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>
            <ArrowUpRight size={18} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <div>
            {loading ? (
                <div style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                    <Loader2 size={20} className="spin" style={{ color: 'var(--text-tertiary)' }} />
                </div>
            ) : (
                <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{value}</h3>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>{title}</p>
        </div>
    </div>
);

const QuickAction = ({ title, description, icon: Icon, onClick }) => (
    <button
        className="glass-panel"
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.2s',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer'
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
    >
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
        }}>
            <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</p>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
    </button>
);

const DashboardHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        ads: 0,
        bugs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [
                    { count: adsCount },
                    { count: bugsCount }
                ] = await Promise.all([
                    supabase.from('ads').select('*', { count: 'exact', head: true }),
                    supabase.from('bugs').select('*', { count: 'exact', head: true }).neq('status', 'resolved')
                ]);

                setStats({
                    ads: adsCount || 0,
                    bugs: bugsCount || 0
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Hero Section */}
            <div className="glass-panel" style={{
                padding: '40px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 800,
                        marginBottom: '12px',
                        background: 'linear-gradient(135deg, #fff 0%, #b4b4eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Welcome Back, Admin
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                        Your PDF Toolkit application is running smoothly. You have {stats.bugs} pending issues that need your attention. Use the quick actions below to manage your app components.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/bugs')}>
                        <AlertCircle size={18} />
                        Review Pending Bugs
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <StatCard
                    title="Active Ads"
                    value={stats.ads}
                    icon={Image}
                    color="#10b981"
                    onClick={() => navigate('/ads')}
                    loading={loading}
                />
                <StatCard
                    title="Pending Bugs"
                    value={stats.bugs}
                    icon={AlertCircle}
                    color="#ef4444"
                    onClick={() => navigate('/bugs')}
                    loading={loading}
                />
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {/* Quick Actions */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <QuickAction
                            title="Hamburger Menu Title"
                            description="Configure menu title shown in app navigation drawer"
                            icon={Sliders}
                            onClick={() => navigate('/settings')}
                        />
                        <QuickAction
                            title="Custom Ad Posts"
                            description="Add or reorder custom promotional banners"
                            icon={Image}
                            onClick={() => navigate('/ads')}
                        />
                    </div>
                </div>

                {/* System Status or Recent Activity (Placeholder) */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>System Overview</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Supabase Connection</span>
                            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                Connected
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Client Version</span>
                            <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>1.0.4 (Stable)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Last Data Sync</span>
                            <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>Just now</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                            All systems are operational. Statistics are refreshed automatically on page load.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
