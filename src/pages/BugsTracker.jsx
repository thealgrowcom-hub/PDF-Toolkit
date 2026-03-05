import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

const BugsTracker = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBugs();
    }, []);

    const fetchBugs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('bugs').select('*').order('timestamp', { ascending: false });
            if (error) throw error;
            if (data && data.length > 0) {
                const fetchedBugs = data;
                setBugs(fetchedBugs);
            } else {
                setBugs([]);
            }
        } catch (error) {
            console.error("Error fetching bugs:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        // Optimistic UI update
        const originalBugs = [...bugs];
        setBugs(bugs.map(bug => bug.id === id ? { ...bug, status: newStatus } : bug));

        try {
            const { error } = await supabase.from('bugs').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.error("Error updating status:", e);
            // Revert if failed
            setBugs(originalBugs);
            alert("Failed to update status.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' }; // Red
            case 'in-progress': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' }; // Amber
            case 'resolved': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' }; // Green
            default: return { bg: 'rgba(255, 255, 255, 0.1)', text: 'white' };
        }
    };

    const filteredBugs = filter === 'all' ? bugs : bugs.filter(b => b.status === filter);

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title">Bugs Tracker</h2>
                    <p className="page-subtitle">Track, manage, and resolve issues reported directly from the app.</p>
                </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {/* Filters and Search Bar */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['all', 'new', 'in-progress', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', textTransform: 'capitalize' }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search bugs..."
                            style={{ paddingLeft: '36px', height: '36px', borderRadius: '18px' }}
                        />
                    </div>
                </div>

                {/* Bugs List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading bugs from Firebase...</div>
                    ) : filteredBugs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                            <CheckCircle size={48} style={{ color: 'var(--accent-primary)', opacity: 0.5, marginBottom: '16px', display: 'inline-block' }} />
                            <p>No bugs found for this filter. Great job!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredBugs.map(bug => (
                                <div key={bug.id} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', transition: 'transform 0.2s', ':hover': { transform: 'translateX(4px)' } }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: getStatusColor(bug.status).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusColor(bug.status).text }}>
                                        {bug.status === 'resolved' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>ID: #{bug.id.toUpperCase().substring(0, 8)}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Reported: {bug.openDate || 'Unknown'}</span>
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                            {bug.title || bug.category || 'Untitled Report'}
                                        </h4>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                                            {bug.description ? (
                                                <p style={{ margin: 0, paddingRight: '20px' }}>{bug.description}</p>
                                            ) : (
                                                <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.5 }}>No detailed description provided.</p>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '6px', fontWeight: 500 }}>
                                                {bug.category || 'Bug Report'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                                                App v{bug.version || 'Unknown'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                                                {bug.platform || 'Unknown Device'}
                                            </span>
                                            {bug.email && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                                                    ✉️ {bug.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ width: '150px' }}>
                                        <select
                                            className="form-input"
                                            value={bug.status}
                                            onChange={(e) => updateStatus(bug.id, e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                background: getStatusColor(bug.status).bg,
                                                color: getStatusColor(bug.status).text,
                                                border: 'none',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            <option value="new">New</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>

                                    <button
                                        className="btn"
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to permanently delete this bug record?")) {
                                                try {
                                                    const { error } = await supabase.from('bugs').delete().eq('id', bug.id);
                                                    if (error) throw error;
                                                    setBugs(bugs.filter(b => b.id !== bug.id));
                                                } catch (e) { console.error(e); }
                                            }
                                        }}
                                        style={{ background: 'transparent', color: 'var(--text-tertiary)', padding: '8px' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BugsTracker;
