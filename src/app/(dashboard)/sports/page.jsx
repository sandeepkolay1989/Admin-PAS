'use client';
import React, { useState, useRef, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Trophy, Star, Pencil, Trash2, HelpCircle, X, Upload, Search, LayoutGrid, List } from 'lucide-react';

export default function SportsPage() {
    const { sports, setSports } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [isPopularFilter, setIsPopularFilter] = useState('all'); // all, popular, not-popular
    const [viewMode, setViewMode] = useState('list'); // list | grid
    const [showSportForm, setShowSportForm] = useState(false);
    const [editingSport, setEditingSport] = useState(null);
    const [sportForm, setSportForm] = useState({ 
        name: '', 
        logo: null,
        logoPreview: '',
        isPopular: false
    });
    const [confirmModal, setConfirmModal] = useState(null);
    const logoInputRef = useRef(null);
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

    const togglePopular = (id) => {
        setSports(sports.map(sport =>
            sport.id === id ? { ...sport, isPopular: !sport.isPopular } : sport
        ));
    };

    const openStatusModal = (sport) => {
        if (!sport) return;
        const nextStatus = sport.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({ sportId: sport.id, nextStatus });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const targetStatus = (confirmModal.nextStatus || '').toLowerCase() === 'active' ? 'active' : 'inactive';
        setSports((prev) => prev.map((sport) =>
            sport.id === confirmModal.sportId
                ? { ...sport, status: targetStatus }
                : sport
        ));
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this sport?')) {
            setSports(sports.filter(s => s.id !== id));
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
                alert('Please upload a JPG or PNG image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSportForm({
                    ...sportForm,
                    logo: file,
                    logoPreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setSportForm({
            ...sportForm,
            logo: null,
            logoPreview: ''
        });
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const handleAddSport = () => {
        setEditingSport(null);
        setShowSportForm(true);
        setSportForm({ 
            name: '', 
            logo: null,
            logoPreview: '',
            isPopular: false
        });
    };

    const handleEditSport = (sport) => {
        setEditingSport(sport);
        setShowSportForm(true);
        setSportForm({
            name: sport.name || '',
            logo: null,
            logoPreview: sport.image || sport.logoPreview || '',
            isPopular: sport.isPopular || false
        });
    };

    const handleSaveSport = () => {
        if (!sportForm.name.trim()) {
            alert('Please enter a sport name');
            return;
        }

        if (!sportForm.logoPreview) {
            alert('Please upload a logo (JPG/PNG format)');
            return;
        }

        const sportData = {
            name: sportForm.name.trim(),
            icon: editingSport ? (editingSport.icon || '') : '',
            image: sportForm.logoPreview || '',
            isPopular: sportForm.isPopular,
            status: editingSport ? editingSport.status : 'active'
        };

        if (editingSport) {
            setSports(sports.map(sport =>
                sport.id === editingSport.id
                    ? { ...sport, ...sportData }
                    : sport
            ));
        } else {
        const newId = sports.length > 0 ? Math.max(...sports.map(s => s.id)) + 1 : 1;
        setSports([...sports, {
            id: newId,
                ...sportData
            }]);
        }

        handleCloseSportForm();
    };

    const handleCloseSportForm = () => {
        setShowSportForm(false);
        setEditingSport(null);
        setSportForm({ 
            name: '', 
            logo: null,
            logoPreview: '',
            isPopular: false
        });
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const filteredSports = sports.filter(sport => {
        // Search filter
        const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && sport.status === 'active') ||
            (statusFilter === 'inactive' && sport.status === 'inactive');
        
        // Is Popular filter
        const matchesPopular = isPopularFilter === 'all' ||
            (isPopularFilter === 'popular' && sport.isPopular) ||
            (isPopularFilter === 'not-popular' && !sport.isPopular);
        
        return matchesSearch && matchesStatus && matchesPopular;
    });

    // Calculate stats
    const totalSports = sports.length;
    const popularSports = sports.filter(sport => sport.isPopular).length;

    const thCenter = { ...styles.th, textAlign: 'center' };
    const tdCenter = { ...styles.td, textAlign: 'center', verticalAlign: 'middle' };

    // Memoized toggle components to prevent hydration errors
    const PopularToggle = ({ sport, onToggle }) => {
        const isPopular = sport.isPopular;
        const toggleStyle = useMemo(() => ({
            width: '50px',
            height: '20px',
            borderRadius: '999px',
            background: isPopular ? '#023B84' : '#e5e7eb',
            position: 'relative',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
        }), [isPopular]);
        const thumbStyle = useMemo(() => ({
            position: 'absolute',
            top: '3px',
            left: isPopular ? '36px' : '3px',
            width: '10px',
            height: '12px',
            borderRadius: '999px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transition: 'left 0.2s ease'
        }), [isPopular]);
        const containerStyle = useMemo(() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none'
        }), []);
        return (
            <div onClick={onToggle} style={containerStyle} title="Toggle popular status">
                <div style={toggleStyle}>
                    <div style={thumbStyle} />
                </div>
            </div>
        );
    };

    const StatusToggle = ({ sport, onToggle }) => {
        const isActive = sport.status === 'active';
        const toggleStyle = useMemo(() => ({
            width: '50px',
            height: '20px',
            borderRadius: '999px',
            background: isActive ? '#023B84' : '#e5e7eb',
            position: 'relative',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
        }), [isActive]);
        const thumbStyle = useMemo(() => ({
            position: 'absolute',
            top: '3px',
            left: isActive ? '36px' : '3px',
            width: '10px',
            height: '12px',
            borderRadius: '999px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transition: 'left 0.2s ease'
        }), [isActive]);
        const containerStyle = useMemo(() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none'
        }), []);
    return (
            <div onClick={onToggle} style={containerStyle} title="Toggle status">
                <div style={toggleStyle}>
                    <div style={thumbStyle} />
                </div>
            </div>
        );
    };

    // StatsBar Component
    const StatsBar = ({ styles, totalSports, popularSports }) => {
        const stats = [
            { label: 'Total Sports', value: totalSports, icon: Trophy },
            { label: 'Is Popular', value: popularSports, icon: Star },
        ];
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#fff7ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>
                            {stat.icon ? <stat.icon size={18} color="#0f172a" /> : null}
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', fontFamily: navFontFamily }}>{stat.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', fontFamily: navFontFamily }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // FiltersBar Component
    const FiltersBar = ({ styles, searchTerm, setSearchTerm, statusFilter, setStatusFilter, isPopularFilter, setIsPopularFilter, viewMode, setViewMode, filteredCount, totalCount }) => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '12px',
                background: '#fff',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
            }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '12px', flex: '0 1 240px', maxWidth: '100%' }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px',
                                color: '#0f172a',
                                fontFamily: navFontFamily
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[
                            { key: 'grid', label: 'Grid View' },
                            { key: 'list', label: 'List View' },
                        ].map((mode) => {
                            const active = viewMode === mode.key;
                            const isGrid = mode.key === 'grid';
                            return (
                                <button
                                    key={mode.key}
                                    onClick={() => setViewMode(mode.key)}
                                    aria-label={mode.label}
                                    style={{
                                        width: '42px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: active
                                            ? (isGrid
                                                ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                                                : 'linear-gradient(135deg, #023B84 0%, #023B84 100%)')
                                            : 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)',
                                        boxShadow: active ? '0 8px 18px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
                                        color: active ? '#fff' : '#475569'
                                    }}
                                >
                                    {isGrid ? (
                                        <LayoutGrid size={16} color={active ? '#fff' : '#475569'} />
                                    ) : (
                                        <List size={16} color={active ? '#fff' : '#475569'} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#475569', fontFamily: navFontFamily, fontWeight: 500 }}>
                            Filter by status:
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                color: '#0f172a',
                                fontSize: '13px',
                                fontFamily: navFontFamily,
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#475569', fontFamily: navFontFamily, fontWeight: 500 }}>
                            Is Popular:
                        </label>
                        <select
                            value={isPopularFilter}
                            onChange={(e) => setIsPopularFilter(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                color: '#0f172a',
                                fontSize: '13px',
                                fontFamily: navFontFamily,
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All</option>
                            <option value="popular">Popular</option>
                            <option value="not-popular">Not Popular</option>
                        </select>
                    </div>
                </div>
                <div style={{ color: '#475569', fontSize: '13px', marginTop: '12px' }}>
                    Showing {filteredCount} of {totalCount} sports
                </div>
            </div>
        );
    };

    // ListGrid Component
    const ListGrid = ({ styles, viewMode, sports, togglePopular, openStatusModal, handleEditSport, handleDelete, PopularToggle, StatusToggle }) => {
        if (sports.length === 0) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', color: styles.subtitle.color, fontFamily: navFontFamily }}>
                    No sports found
                </div>
            );
        }

        return (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
                {viewMode === 'list' ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                                <th style={thCenter}>Sr. No.</th>
                                <th style={thCenter}>Sports Name</th>
                                <th style={thCenter}>Logo</th>
                                <th style={thCenter}>Is popular</th>
                                <th style={thCenter}>Active</th>
                                <th style={thCenter}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                            {sports.map((sport, index) => (
                            <tr key={sport.id}>
                                    <td style={tdCenter}>{index + 1}</td>
                                    <td style={tdCenter}>{sport.name}</td>
                                    <td style={tdCenter}>
                                        <div style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            width: '40px', 
                                            height: '40px',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8fafc'
                                        }}>
                                            {sport.image ? (
                                                <img
                                                    src={sport.image}
                                                    alt={sport.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : sport.icon ? (
                                                <span style={{ fontSize: '24px' }}>{sport.icon}</span>
                                            ) : (
                                                <Trophy size={20} color="#64748b" />
                                            )}
                                        </div>
                                </td>
                                    <td style={tdCenter}>
                                        <PopularToggle 
                                            sport={sport} 
                                            onToggle={() => togglePopular(sport.id)} 
                                    />
                                </td>
                                    <td style={tdCenter}>
                                        <StatusToggle 
                                            sport={sport} 
                                            onToggle={() => openStatusModal(sport)} 
                                        />
                                </td>
                                    <td style={tdCenter}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                                onClick={() => handleEditSport(sport)}
                                                title="Edit"
                                        >
                                                <Pencil size={14} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(sport.id)}
                                                title="Delete"
                                        >
                                                <Trash2 size={14} color="#ffffff" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                        {sports.map((sport, index) => (
                            <div key={sport.id} style={{
                                border: '1px solid #f1f5f9',
                                borderRadius: '14px',
                                padding: '16px',
                                boxShadow: '0 10px 24px rgba(15,23,42,0.05)',
                                background: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '80px', 
                                    height: '80px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f8fafc',
                                    marginBottom: '4px'
                                }}>
                                    {sport.image ? (
                                        <img
                                            src={sport.image}
                                            alt={sport.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : sport.icon ? (
                                        <span style={{ fontSize: '48px' }}>{sport.icon}</span>
                                    ) : (
                                        <Trophy size={36} color="#64748b" />
                                    )}
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 400, color: '#0f172a', fontSize: '16px', fontFamily: navFontFamily, marginBottom: '4px' }}>{sport.name}</div>
                                    {sport.isPopular && (
                                        <div style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: '#f97316',
                                            fontWeight: 400,
                                            fontFamily: navFontFamily,
                                            marginBottom: '8px'
                                        }}>
                                            <Star size={14} fill="#f97316" color="#f97316" />
                                            Popular
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontFamily: navFontFamily, fontWeight: 400 }}>Popular:</span>
                                        <PopularToggle 
                                            sport={sport} 
                                            onToggle={() => togglePopular(sport.id)} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontFamily: navFontFamily, fontWeight: 400 }}>Status:</span>
                                        <StatusToggle 
                                            sport={sport} 
                                            onToggle={() => openStatusModal(sport)} 
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                                    <button
                                        style={{ ...styles.button, padding: '8px 14px', fontSize: '12px' }}
                                        onClick={() => handleEditSport(sport)}
                                        title="Edit"
                                    >
                                        <Pencil size={14} color="#ffffff" />
                                    </button>
                                    <button
                                        style={{ ...styles.buttonDanger, padding: '8px 14px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => handleDelete(sport.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} color="#ffffff" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.mainContent}>
            {confirmModal && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modal, maxWidth: '420px', textAlign: 'center', position: 'relative', paddingTop: '52px' }}>
                        <span style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'block',
                            width: '32px',
                            height: '32px',
                            pointerEvents: 'none',
                            color: '#f97316'
                        }}>
                            <HelpCircle size={32} />
                        </span>
                        <button
                            onClick={handleCancelStatus}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'none',
                                border: 'none',
                                fontSize: '0px',
                                cursor: 'pointer',
                                color: '#0f172a',
                                padding: 0,
                                lineHeight: 1
                            }}
                            aria-label="Close"
                        >
                            <X size={18} color="#0f172a" />
                        </button>
                        <h3 style={{ margin: '0 0 12px 0', color: '#f97316', fontWeight: 700 }}>Are You Sure?</h3>
                        <p style={{ color: '#242222', marginBottom: '20px' }}>
                            Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                                onClick={handleCancelStatus}
                                style={{ ...styles.button, backgroundColor: '#f97316', color: '#ffffff' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStatus}
                                style={{
                                    ...styles.buttonSuccess,
                                    background: 'linear-gradient(135deg, #023B84 0%, #023B84 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
                                    padding: '10px 18px',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes, Do It.
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSportForm ? (
                /* Sport Form */
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '24px'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '700', 
                            color: '#0f172a',
                            fontFamily: navFontFamily,
                            margin: 0
                        }}>
                            {editingSport ? 'Edit Sport' : 'Add New Sport'}
                        </h2>
                        <button
                            onClick={handleCloseSportForm}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <X size={24} color="#64748b" />
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Sport Name */}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#0f172a',
                                fontFamily: navFontFamily
                            }}>
                                Sport Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                        <input
                            type="text"
                                placeholder="Enter sport name"
                                style={{ ...styles.input, fontFamily: navFontFamily }}
                                value={sportForm.name}
                                onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })}
                            />
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#0f172a',
                                fontFamily: navFontFamily
                            }}>
                                Logo (JPG/PNG) <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            
                            {sportForm.logoPreview ? (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <img
                                            src={sportForm.logoPreview}
                                            alt="Sport logo preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <button
                                            onClick={handleRemoveLogo}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: 'rgba(0, 0, 0, 0.6)',
                                                border: 'none',
                                                borderRadius: '4px',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#ffffff'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            <div
                                onClick={() => logoInputRef.current?.click()}
                                style={{
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: sportForm.logoPreview ? '#f8fafc' : '#ffffff'
                                }}
                                onMouseEnter={(e) => {
                                    if (!sportForm.logoPreview) {
                                        e.currentTarget.style.borderColor = '#023B84';
                                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!sportForm.logoPreview) {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                    }
                                }}
                            >
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleLogoUpload}
                                    style={{ display: 'none' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <Upload size={32} color="#64748b" />
                                    <div>
                                        <span style={{ 
                                            color: '#023B84', 
                                            fontWeight: '600',
                                            fontFamily: navFontFamily
                                        }}>
                                            Click to upload
                                        </span>
                                        <span style={{ color: '#64748b', fontFamily: navFontFamily }}> or drag and drop</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: navFontFamily }}>
                                        JPG or PNG (max 5MB)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Is Popular Checkbox */}
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                fontFamily: navFontFamily
                            }}>
                        <input
                                    type="checkbox"
                                    checked={sportForm.isPopular}
                                    onChange={(e) => setSportForm({ ...sportForm, isPopular: e.target.checked })}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer',
                                        accentColor: '#023B84'
                                    }}
                                />
                                <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#0f172a',
                                    fontFamily: navFontFamily
                                }}>
                                    Is Popular
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            marginTop: '8px', 
                            justifyContent: 'flex-end',
                            paddingTop: '24px',
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            <button
                                style={{ 
                                    ...styles.button, 
                                    backgroundColor: '#e2e8f0', 
                                    color: '#334155',
                                    fontFamily: navFontFamily
                                }}
                                onClick={handleCloseSportForm}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ 
                                    ...styles.button,
                                    fontFamily: navFontFamily
                                }}
                                onClick={handleSaveSport}
                            >
                                {editingSport ? 'Update Sport' : 'Add Sport'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {confirmModal && (
                        <div style={styles.modalOverlay}>
                            <div style={{ ...styles.modal, maxWidth: '420px', textAlign: 'center', position: 'relative', paddingTop: '52px' }}>
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'block',
                                    width: '32px',
                                    height: '32px',
                                    pointerEvents: 'none',
                                    color: '#f97316'
                                }}>
                                    <HelpCircle size={32} />
                                </span>
                                <button
                                    onClick={handleCancelStatus}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '0px',
                                        cursor: 'pointer',
                                        color: '#0f172a',
                                        padding: 0,
                                        lineHeight: 1
                                    }}
                                    aria-label="Close"
                                >
                                    <X size={18} color="#0f172a" />
                                </button>
                                <h3 style={{ margin: '0 0 12px 0', color: '#f97316', fontWeight: 700 }}>Are You Sure?</h3>
                                <p style={{ color: '#242222', marginBottom: '20px' }}>
                                    Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                                        onClick={handleCancelStatus}
                                        style={{ ...styles.button, backgroundColor: '#f97316', color: '#ffffff' }}
                            >
                                Cancel
                            </button>
                            <button
                                        onClick={handleConfirmStatus}
                                        style={{
                                            ...styles.buttonSuccess,
                                            background: 'linear-gradient(135deg, #023B84 0%, #023B84 100%)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '10px',
                                            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
                                            padding: '10px 18px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Yes, Do It.
                            </button>
                        </div>
                    </div>
                </div>
                    )}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: 0,
                                marginBottom: '4px',
                                fontFamily: navFontFamily
                            }}>
                                Sports Management
                            </h1>
                            <p style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#64748b',
                                margin: 0,
                                fontFamily: navFontFamily
                            }}>
                                Manage sports and their details
                            </p>
                        </div>
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '12px 20px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: navFontFamily,
                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={handleAddSport}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                            }}
                        >
                            <Upload size={18} />
                            + Add Sport
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <FiltersBar 
                        styles={styles}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        isPopularFilter={isPopularFilter}
                        setIsPopularFilter={setIsPopularFilter}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        filteredCount={filteredSports.length}
                        totalCount={sports.length}
                    />

                    {/* Stats Bar */}
                    <StatsBar 
                        styles={styles}
                        totalSports={totalSports}
                        popularSports={popularSports}
                    />

                    {/* List / Grid */}
                    <ListGrid
                        styles={styles}
                        viewMode={viewMode}
                        sports={filteredSports}
                        togglePopular={togglePopular}
                        openStatusModal={openStatusModal}
                        handleEditSport={handleEditSport}
                        handleDelete={handleDelete}
                        PopularToggle={PopularToggle}
                        StatusToggle={StatusToggle}
                    />
                </>
            )}
        </div>
    );
}
