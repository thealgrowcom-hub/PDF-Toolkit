import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdsManager = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('ads').select('*').order('order', { ascending: true });
            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
        setLoading(false);
    };

    const handleAddAd = async () => {
        if (!newImageUrl.trim()) return;
        setSaving(true);
        try {
            const newOrder = ads.length > 0 ? Math.max(...ads.map(a => a.order || 0)) + 1 : 0;
            const { data, error } = await supabase.from('ads').insert({
                imageUrl: newImageUrl.trim(),
                order: newOrder,
                active: true
            }).select();
            if (error) throw error;
            if (data && data.length > 0) {
                setAds([...ads, data[0]]);
            }
            setNewImageUrl('');
            alert('Custom Ad Post added successfully!');
        } catch (error) {
            console.error("Error adding ad:", error);
            alert('Failed to add ad.');
        }
        setSaving(false);
    };

    const handleToggleActive = async (id, currentActive) => {
        const newActive = !currentActive;
        const ad = ads.find(a => a.id === id);
        // Optimistic update
        setAds(ads.map(a => a.id === id ? { ...a, active: newActive } : a));
        try {
            const { error } = await supabase.from('ads').upsert({ ...ad, active: newActive });
            if (error) throw error;
        } catch (error) {
            console.error("Error toggling ad:", error);
            alert('Failed to update ad status: ' + (error.message || JSON.stringify(error)));
            // Revert on failure
            setAds(ads.map(a => a.id === id ? { ...a, active: currentActive } : a));
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm('Are you sure you want to remove this Custom Ad Post?')) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('ads').delete().eq('id', id);
            if (error) throw error;
            setAds(ads.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting ad:", error);
            alert('Failed to delete ad.');
        }
        setSaving(false);
    };

    const handleMoveUp = async (index) => {
        if (index === 0) return;
        setSaving(true);
        const newAds = [...ads];
        const tempOrder = newAds[index].order;
        newAds[index].order = newAds[index - 1].order;
        newAds[index - 1].order = tempOrder;

        const tempAd = newAds[index];
        newAds[index] = newAds[index - 1];
        newAds[index - 1] = tempAd;

        setAds(newAds);

        try {
            const { error } = await supabase.from('ads').upsert([
                { id: newAds[index].id, order: newAds[index].order },
                { id: newAds[index - 1].id, order: newAds[index - 1].order }
            ]);
            if (error) throw error;
        } catch (error) {
            console.error("Error reordering ads:", error);
            alert('Failed to reorder ads.');
            fetchAds();
        }
        setSaving(false);
    };

    const handleMoveDown = async (index) => {
        if (index === ads.length - 1) return;
        setSaving(true);
        const newAds = [...ads];

        const tempOrder = newAds[index].order;
        newAds[index].order = newAds[index + 1].order;
        newAds[index + 1].order = tempOrder;

        const tempAd = newAds[index];
        newAds[index] = newAds[index + 1];
        newAds[index + 1] = tempAd;

        setAds(newAds);

        try {
            const { error } = await supabase.from('ads').upsert([
                { id: newAds[index].id, order: newAds[index].order },
                { id: newAds[index + 1].id, order: newAds[index + 1].order }
            ]);
            if (error) throw error;
        } catch (error) {
            console.error("Error reordering ads:", error);
            alert('Failed to reorder ads.');
            fetchAds();
        }
        setSaving(false);
    };

    const activeCount = ads.filter(a => a.active !== false).length;

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Ad Manager</h2>
                    <p className="page-subtitle">Manage Custom Image Posts that cycle with Banner Ads. ({activeCount} active, {ads.length - activeCount} inactive)</p>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Add New Image URL</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="https://example.com/banner.jpg"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddAd}
                        disabled={saving || !newImageUrl.trim()}
                        style={{ alignSelf: 'flex-end', height: '42px' }}
                    >
                        {saving ? 'Adding...' : 'Add Post'}
                    </button>
                </div>

                {loading ? (
                    <div className="loading-spinner"></div>
                ) : ads.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No custom posts added yet. Only Google AdMob banners will show (no carousel).
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {ads.map((ad, index) => {
                            const isActive = ad.active !== false;
                            return (
                                <div key={ad.id} style={{
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: `1px solid ${isActive ? 'var(--border-color)' : 'rgba(255,0,0,0.3)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    opacity: isActive ? 1 : 0.5,
                                    transition: 'opacity 0.3s ease, border-color 0.3s ease'
                                }}>
                                    <div style={{ height: '120px', backgroundColor: '#000', position: 'relative' }}>
                                        <img
                                            src={ad.imageUrl}
                                            alt={`Ad ${index}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            onError={(e) => { e.target.src = 'https://placehold.co/600x200?text=Image+Load+Failed'; }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: 8, left: 8,
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            Idx: {index + 1}
                                        </div>
                                        {!isActive && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 8, right: 8,
                                                background: 'rgba(239,68,68,0.9)',
                                                color: '#fff',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                letterSpacing: '0.5px'
                                            }}>
                                                INACTIVE
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0 || saving}
                                                style={{ background: 'transparent', border: 'none', color: index === 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === ads.length - 1 || saving}
                                                style={{ background: 'transparent', border: 'none', color: index === ads.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)', cursor: index === ads.length - 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <label style={{
                                                position: 'relative',
                                                display: 'inline-block',
                                                width: '44px',
                                                height: '24px',
                                                cursor: 'pointer'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={() => handleToggleActive(ad.id, isActive)}
                                                    style={{ opacity: 0, width: 0, height: 0 }}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    backgroundColor: isActive ? '#10B981' : '#4B5563',
                                                    borderRadius: '12px',
                                                    transition: 'background-color 0.3s ease'
                                                }}></span>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: isActive ? '22px' : '2px',
                                                    top: '2px',
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    transition: 'left 0.3s ease',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                                }}></span>
                                            </label>
                                            <button
                                                onClick={() => handleDeleteAd(ad.id)}
                                                disabled={saving}
                                                style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '6px 12px', borderRadius: '4px', cursor: saving ? 'wait' : 'pointer', fontSize: '13px' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsManager;
