import React, { useState, useEffect } from 'react';
import { Save, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

const Settings = () => {
    const [menuTitle, setMenuTitle] = useState('PDF Toolkit');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 'appSettings')
                .maybeSingle();

            if (error) {
                console.error("Error fetching settings:", error);
            } else if (data) {
                setMenuTitle(data.menu_title || data.menuTitle || 'PDF Toolkit');
            }
        } catch (err) {
            console.error("Critical error fetching app settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const updatePayload = {
                id: 'appSettings',
                menu_title: menuTitle.trim(),
            };

            const { error } = await supabase
                .from('settings')
                .upsert(updatePayload, { onConflict: 'id' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Hamburger menu title updated successfully!' });
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage({ type: 'error', text: `Failed to save: ${error.message || 'Unknown error'}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '28px', fontWeight: 700 }}>App Settings</h2>
                    <p className="page-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Remotely configure the Hamburger menu title for your app.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading || saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div className={`glass-card`} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: message.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{message.text}</span>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                    Loading remote settings...
                </div>
            ) : (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(99, 102, 241, 0.15)',
                                color: 'var(--accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Sliders size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Hamburger Menu Title</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Changes take effect immediately when user opens the app drawer.
                                </p>
                            </div>
                        </div>

                        {/* Hamburger Menu Title */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                Hamburger Menu Title
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={menuTitle}
                                onChange={(e) => setMenuTitle(e.target.value)}
                                placeholder="PDF Toolkit"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', fontSize: '15px' }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                Title shown in the header of the app navigation drawer.
                            </span>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Settings;
