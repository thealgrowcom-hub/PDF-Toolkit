import React, { useState, useEffect } from 'react';
import { Save, FileText, Shield, Info } from 'lucide-react';
import { supabase } from '../supabase';

const SettingsEditor = () => {
    const [settings, setSettings] = useState({
        terms: '', privacy: '', about: '', features: [],
        websiteUrl: 'https://thealgrow.com',
        contactUsEmail: 'contact@thealgrow.com',
        shareAppText: 'Check out PDF Toolkit - The ultimate PDF utility app!',
        shareAppUrl: 'https://play.google.com/store/apps/details?id=com.thealgrow.pdftoolkit',
        appName: 'PDF Toolkit',
        appVersion: '1.0.0+1',
        adDuration: 3,
        adHeight: 60,
        adRefreshInterval: 300
    });
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('settings').select('*').eq('id', 'appSettings').maybeSingle();
            if (error) {
                console.warn("Settings fetch failed. Using defaults.", error);
                return;
            }
            if (data) {
                const mainDoc = data;
                setSettings({
                    terms: mainDoc.terms || '',
                    privacy: mainDoc.privacy || '',
                    about: mainDoc.about || '',
                    features: mainDoc.features || [
                        { icon: 'security_outlined', title: 'Privacy First', description: 'All processing happens locally on your device.' },
                        { icon: 'electric_bolt_outlined', title: 'Lightning Fast', description: 'Optimized for rapid document generation.' },
                        { icon: 'all_inclusive_outlined', title: 'All-in-One Utility', description: 'Merge, Split, Compress, Sign, and more.' }
                    ],
                    websiteUrl: mainDoc.websiteUrl || 'https://thealgrow.com',
                    contactUsEmail: mainDoc.contactUsEmail || 'contact@thealgrow.com',
                    shareAppText: mainDoc.shareAppText || 'Check out PDF Toolkit - The ultimate PDF utility app!',
                    shareAppUrl: mainDoc.shareAppUrl || 'https://play.google.com/store/apps/details?id=com.thealgrow.pdftoolkit',
                    appName: mainDoc.appName || 'PDF Toolkit',
                    appVersion: mainDoc.appVersion || '1.0.0+1',
                    adDuration: mainDoc.adDuration || 3,
                    adHeight: mainDoc.adHeight || 60,
                    adRefreshInterval: mainDoc.adRefreshInterval || 300
                });
            } else {
                console.warn("appSettings row not found in Supabase. Using defaults.");
            }
        } catch (error) {
            console.error("Critical error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.from('settings').upsert({ id: 'appSettings', ...settings });
            if (error) throw error;
            alert("App settings successfully saved to Supabase!");
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General Info', icon: Info },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'features', label: 'Key Features (About)', icon: Shield },
    ];

    const addFeature = () => {
        setSettings({
            ...settings,
            features: [...settings.features, { icon: 'star_outline', title: 'New Feature', description: 'Feature description' }]
        });
    };

    const updateFeature = (index, field, value) => {
        const newFeatures = [...settings.features];
        newFeatures[index][field] = value;
        setSettings({ ...settings, features: newFeatures });
    };

    const removeFeature = (index) => {
        const newFeatures = settings.features.filter((_, i) => i !== index);
        setSettings({ ...settings, features: newFeatures });
    };

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title">Settings Editor</h2>
                    <p className="page-subtitle">Update content for standard legal and informational pages.</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading || saving}>
                    <Save size={16} />
                    {saving ? 'Publishing...' : 'Publish Changes'}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading content...</div>
            ) : (
                <div className="glass-card" style={{ display: 'flex', flex: 1, minHeight: '500px', overflow: 'hidden' }}>
                    {/* Tabs Sidebar */}
                    <div style={{ width: '250px', borderRight: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    padding: '16px 20px',
                                    border: 'none',
                                    background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    borderLeft: activeTab === tab.id ? '4px solid var(--accent-primary)' : '4px solid transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                                Editing {tabs.find(t => t.id === activeTab)?.label}
                            </h3>
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '12px' }}>Markdown Supported (coming soon)</span>
                        </div>

                        {activeTab === 'general' ? (
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>App Name</label>
                                    <input type="text" className="form-input" value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>App Version</label>
                                    <input type="text" className="form-input" value={settings.appVersion} onChange={e => setSettings({ ...settings, appVersion: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Website URL</label>
                                    <input type="text" className="form-input" value={settings.websiteUrl} onChange={e => setSettings({ ...settings, websiteUrl: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Contact Email</label>
                                    <input type="text" className="form-input" value={settings.contactUsEmail} onChange={e => setSettings({ ...settings, contactUsEmail: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Share App Text</label>
                                    <input type="text" className="form-input" value={settings.shareAppText} onChange={e => setSettings({ ...settings, shareAppText: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Share App Link (Store URL)</label>
                                    <input type="text" className="form-input" value={settings.shareAppUrl} onChange={e => setSettings({ ...settings, shareAppUrl: e.target.value })} />
                                </div>
                                <hr style={{ borderColor: 'var(--border-color)', margin: '32px 0 24px 0' }} />
                                <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Ad Slider Configurations</h3>
                                <div style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Ad Duration (Seconds)</label>
                                        <input type="number" className="form-input" value={settings.adDuration} onChange={e => setSettings({ ...settings, adDuration: parseInt(e.target.value) || 3 })} min="1" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Ad Container Height</label>
                                        <input type="number" className="form-input" value={settings.adHeight} onChange={e => setSettings({ ...settings, adHeight: parseFloat(e.target.value) || 60 })} min="20" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Ad Refresh Interval (Seconds)</label>
                                        <input type="number" className="form-input" value={settings.adRefreshInterval} onChange={e => setSettings({ ...settings, adRefreshInterval: parseInt(e.target.value) || 300 })} min="10" />
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'features' ? (
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <button className="btn btn-primary" onClick={addFeature} style={{ marginBottom: '20px' }}>
                                    + Add Feature
                                </button>
                                {settings.features.map((feature, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={feature.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                placeholder="Feature Title"
                                                style={{ marginBottom: '8px' }}
                                            />
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={feature.description}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                placeholder="Feature Description"
                                                style={{ marginBottom: '8px' }}
                                            />
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={feature.icon}
                                                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                placeholder="Material Icon Name (e.g., security_outlined)"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeFeature(index)}
                                            style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                className="form-input form-textarea"
                                value={settings[activeTab]}
                                onChange={(e) => setSettings({ ...settings, [activeTab]: e.target.value })}
                                style={{ flex: 1, fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6, padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                placeholder={`Write your ${tabs.find(t => t.id === activeTab)?.label} here...`}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsEditor;
