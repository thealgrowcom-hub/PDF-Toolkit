import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image } from 'lucide-react';
import { supabase } from '../supabase';

const DEFAULT_ICONS = [
    { id: 'i1', label: 'Tools' },
    { id: 'i2', label: 'History' },
    { id: 'i3', label: 'Scanner' },
    { id: 'i4', label: 'All Files' },
    { id: 'i5', label: 'Setting' },
];

const MenuIconsManager = () => {
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchIcons();
    }, []);

    const fetchIcons = async () => {
        try {
            const { data, error } = await supabase.from('icons').select('*');
            if (error) {
                console.warn("Could not fetch icons from Supabase. Using defaults.", error);
                setIcons(DEFAULT_ICONS);
                return;
            }
            if (data && data.length > 0) {
                setIcons(data);
            } else {
                setIcons(DEFAULT_ICONS);
            }
        } catch (error) {
            console.error("Critical error fetching menu icons:", error);
            setIcons(DEFAULT_ICONS);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Use upsert to update label without touching other fields
            const { error } = await supabase.from('icons').upsert(icons.map(icon => ({ id: icon.id, label: icon.label })));
            if (error) throw error;
            alert("Menu icons successfully saved to Supabase!");
        } catch (error) {
            console.error("Error saving icons:", error);
        } finally {
            setSaving(false);
        }
    };

    const updateIcon = (index, field, value) => {
        const updated = [...icons];
        updated[index] = { ...updated[index], [field]: value };
        setIcons(updated);
    };

    // addIcon and deleteIcon removed

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title">Menu Icons</h2>
                    <p className="page-subtitle">Remotely change bottom bar / drawer icons and titles in your app.</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading || saving}>
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading icons...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {icons.map((item, index) => (
                        <div key={item.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                    <Image size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        className="form-input"
                                        value={item.label}
                                        onChange={e => updateIcon(index, 'label', e.target.value)}
                                        placeholder="Menu Label"
                                        style={{ padding: '6px 12px', fontSize: '16px', fontWeight: 600, background: 'transparent', border: '1px solid transparent', marginBottom: '4px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default MenuIconsManager;
