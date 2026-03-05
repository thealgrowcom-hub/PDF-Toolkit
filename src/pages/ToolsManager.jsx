import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';

const DEFAULT_TOOLS = [
    { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one', isActive: true },
    { id: 'split-pdf', name: 'Split PDF', description: 'Split PDF into separate pages', isActive: true },
    { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', isActive: true },
    { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', isActive: true },
    { id: 'rearrange-pdf', name: 'Rearrange PDF', description: 'Change page order of PDF', isActive: true },
    { id: 'page-number', name: 'Page Number', description: 'Add page numbers to PDF', isActive: true },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG image to PDF', isActive: true },
    { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG image to PDF', isActive: true },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG', isActive: true },
    { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG', isActive: true },
    { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert multiple images to PDF', isActive: true },
    { id: 'pdf-to-images', name: 'PDF to Images', description: 'Export PDF pages as images', isActive: true },
    { id: 'extract-images', name: 'Extract Images', description: 'Extract embedded images from PDF', isActive: true },
    { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert typed text to PDF', isActive: true },
    { id: 'pdf-to-text', name: 'PDF to Text', description: 'Save all PDF text as a file', isActive: true },
    { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password protection to PDF', isActive: true },
    { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password from PDF', isActive: true },
    { id: 'pdf-metadata', name: 'Metadata', description: 'Edit PDF title, author, etc.', isActive: true },
    { id: 'signature', name: 'Signature', description: 'Draw or type your signature', isActive: true },
    { id: 'add-watermark', name: 'Add Watermark', description: 'Add text or image watermark', isActive: true },
    { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to Word document', isActive: true },
    { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word document to PDF', isActive: true },
    { id: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF to PowerPoint', isActive: true },
    { id: 'ppt-to-pdf', name: 'PPT to PDF', description: 'Convert PowerPoint to PDF', isActive: true },
    { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF data to Excel', isActive: true },
    { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel sheet to PDF', isActive: true },
];

const ToolsManager = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const { data, error } = await supabase.from('tools').select('*');
            if (error) {
                console.warn("Could not fetch tools from Supabase (maybe table is missing?). Using defaults.", error);
                setTools(DEFAULT_TOOLS);
                return;
            }

            if (!data || data.length === 0) {
                setTools(DEFAULT_TOOLS);
            } else {
                const fetchedTools = data;
                fetchedTools.sort((a, b) => a.id.localeCompare(b.id));
                setTools(fetchedTools);
            }
        } catch (error) {
            console.error("Critical error fetching tools:", error);
            setTools(DEFAULT_TOOLS);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.from('tools').upsert(tools);
            if (error) throw error;
            alert("Changes saved to Supabase successfully!");
        } catch (error) {
            console.error("Error saving tools:", error);
        } finally {
            setSaving(false);
        }
    };

    const updateTool = (index, field, value) => {
        const updatedTools = [...tools];
        updatedTools[index] = { ...updatedTools[index], [field]: value };
        setTools(updatedTools);
    };

    // Removed addTool and deleteTool per user request

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title">Tools Manager</h2>
                    <p className="page-subtitle">Update tool names, descriptions, and active status. Remember to save changes.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={fetchTools} disabled={loading || saving}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        Refresh
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading || saving}>
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading tools...</div>
            ) : (
                <div className="glass-card">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase' }}>Tool Name</th>
                                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tools.map((tool, index) => (
                                <tr key={tool.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <input
                                            className="form-input"
                                            value={tool.name}
                                            onChange={(e) => updateTool(index, 'name', e.target.value)}
                                            placeholder="Tool Name"
                                            style={{ padding: '8px 12px', fontSize: '14px', background: 'transparent', border: '1px solid transparent' }}
                                            onFocus={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}
                                            onBlur={(e) => e.target.style.background = 'transparent'}
                                        />
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <input
                                            className="form-input"
                                            value={tool.description}
                                            onChange={(e) => updateTool(index, 'description', e.target.value)}
                                            placeholder="Tool Description"
                                            style={{ padding: '8px 12px', fontSize: '14px', background: 'transparent', border: '1px solid transparent' }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <select
                                            className="form-input"
                                            value={tool.isActive.toString()}
                                            onChange={(e) => updateTool(index, 'isActive', e.target.value === 'true')}
                                            style={{ padding: '8px 12px', width: 'auto', background: tool.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: tool.isActive ? '#10b981' : '#ef4444', border: 'none', fontWeight: 500 }}
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export default ToolsManager;
