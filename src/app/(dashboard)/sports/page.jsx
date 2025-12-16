'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Trophy, Star, Pencil, Trash2, HelpCircle, X, Upload, Search, LayoutGrid, List, ArrowLeft } from 'lucide-react';
import { API } from '@/lib/api.js/api';
import { authFetchJson } from '@/lib/api.js/authorization';

export default function SportsPage() {
    const { sports, setSports } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [isPopularFilter, setIsPopularFilter] = useState('all'); // all, popular, not-popular
    const [viewMode, setViewMode] = useState('list'); // list | grid | detail
    const [showSportForm, setShowSportForm] = useState(false);
    const [editingSport, setEditingSport] = useState(null);
    const [detailSport, setDetailSport] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [sportForm, setSportForm] = useState({ 
        name: '', 
        logo: null,
        logoPreview: '',
        isPopular: false
    });
    const [confirmModal, setConfirmModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [mounted, setMounted] = useState(false);
    const logoInputRef = useRef(null);
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

    // Set mounted state on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch sports from API
    useEffect(() => {
        const fetchSports = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await authFetchJson(API.sports);
                
                if (result.status && result.data && Array.isArray(result.data)) {
                    // Transform API data to match component's expected format
                    const transformedSports = result.data.map(sport => ({
                        id: sport.id,
                        name: sport.name,
                        image: sport.image || '',
                        icon: '', // API doesn't provide icon
                        isPopular: false, // Default to false, can be toggled later
                        status: 'active' // Default to active
                    }));
                    setSports(transformedSports);
                } else {
                    setError('Failed to fetch sports data');
                }
            } catch (err) {
                console.error('Error fetching sports:', err);
                setError('Error loading sports. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchSports();
    }, [setSports]);

    // Reset to first page when pageSize changes
    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, isPopularFilter]);

    // Update detailSport when sports array changes
    useEffect(() => {
        if (detailSport) {
            const updatedSport = sports.find(s => s.id === detailSport.id);
            if (updatedSport) {
                setDetailSport(updatedSport);
            }
        }
    }, [sports]);

    const openPopularModal = (sport) => {
        if (!sport) return;
        const nextPopular = sport.isPopular ? 'Not Popular' : 'Popular';
        setConfirmModal({ 
            type: 'popular',
            sportId: sport.id, 
            nextStatus: nextPopular,
            currentValue: sport.isPopular 
        });
    };

    const togglePopular = (id) => {
        setSports(sports.map(sport =>
            sport.id === id ? { ...sport, isPopular: !sport.isPopular } : sport
        ));
    };

    const openStatusModal = (sport) => {
        if (!sport) return;
        const nextStatus = sport.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({ 
            type: 'status',
            sportId: sport.id, 
            nextStatus 
        });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        
        if (confirmModal.type === 'status') {
            const targetStatus = (confirmModal.nextStatus || '').toLowerCase() === 'active' ? 'active' : 'inactive';
            setSports((prev) => prev.map((sport) =>
                sport.id === confirmModal.sportId
                    ? { ...sport, status: targetStatus }
                    : sport
            ));
        } else if (confirmModal.type === 'popular') {
            const targetPopular = !confirmModal.currentValue; // Toggle the value
            setSports((prev) => prev.map((sport) =>
                sport.id === confirmModal.sportId
                    ? { ...sport, isPopular: targetPopular }
                    : sport
            ));
        } else if (confirmModal.type === 'delete') {
            setSports((prev) => prev.filter((sport) => sport.id !== confirmModal.sportId));
            // If we're in detail view and deleting the current sport, close the detail view
            if (detailSport && detailSport.id === confirmModal.sportId) {
                closeDetailView();
            }
        }
        
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const openDeleteModal = (sport) => {
        if (!sport) return;
        setConfirmModal({ 
            type: 'delete',
            sportId: sport.id,
            sportName: sport.name
        });
    };

    const handleDelete = (id) => {
        // This function is kept for backwards compatibility but now uses the modal
        const sport = sports.find(s => s.id === id);
        if (sport) {
            openDeleteModal(sport);
        }
    };

    const openDetailView = (sport) => {
        setDetailSport(sport);
        setViewMode('detail');
    };

    const closeDetailView = () => {
        setDetailSport(null);
        setViewMode('list');
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
        // If we're in detail view, remember to return there after saving
        if (viewMode === 'detail') {
            setDetailSport(sport);
        }
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
            const newId = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            setSports([...sports, {
                id: newId,
                ...sportData
            }]);
        }

        handleCloseSportForm();
        
        // If we were in detail view, return to it after saving
        if (detailSport && editingSport) {
            const updatedSport = sports.find(s => s.id === editingSport.id) || detailSport;
            setDetailSport(updatedSport);
            setViewMode('detail');
        }
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
        // Return to detail view if we were there before opening the form
        if (detailSport && viewMode !== 'detail') {
            setViewMode('detail');
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

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredSports.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const start = (safeCurrentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedSports = filteredSports.slice(start, end);

    // Calculate visible page range (show max 3 pages)
    const getVisiblePages = () => {
        const maxVisible = 3;
        if (totalPages <= maxVisible) {
            // Show all pages if total is 3 or less
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        if (safeCurrentPage <= 2) {
            // Near the start: show 1, 2, 3
            return [1, 2, 3];
        } else if (safeCurrentPage >= totalPages - 1) {
            // Near the end: show last 3
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            // Middle: show current-1, current, current+1
            return [safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1];
        }
    };
    const visiblePages = getVisiblePages();

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
    const FiltersBar = ({ styles, searchTerm, setSearchTerm, statusFilter, setStatusFilter, isPopularFilter, setIsPopularFilter, viewMode, setViewMode, filteredCount, totalCount, mounted }) => {
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
                {mounted && (
                    <div style={{ color: '#475569', fontSize: '13px', marginTop: '12px' }}>
                        Showing {filteredCount} of {totalCount} sports
                    </div>
                )}
            </div>
        );
    };

    // ListGrid Component
    const ListGrid = ({ styles, viewMode, sports, openPopularModal, openStatusModal, handleEditSport, handleDelete, PopularToggle, StatusToggle, openDetailView, hoveredRowId, setHoveredRowId }) => {
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
                            <tr 
                                key={sport.id}
                                onClick={() => openDetailView(sport)}
                                onMouseEnter={() => setHoveredRowId(sport.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: hoveredRowId === sport.id ? '#f8fafc' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
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
                                    <td style={tdCenter} onClick={(e) => e.stopPropagation()}>
                                        <PopularToggle 
                                            sport={sport} 
                                            onToggle={() => openPopularModal(sport)} 
                                    />
                                </td>
                                    <td style={tdCenter} onClick={(e) => e.stopPropagation()}>
                                        <StatusToggle 
                                            sport={sport} 
                                            onToggle={() => openStatusModal(sport)} 
                                        />
                                </td>
                                    <td style={tdCenter}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
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
                            <div 
                                key={sport.id} 
                                onClick={() => openDetailView(sport)}
                                onMouseEnter={() => setHoveredRowId(sport.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                style={{
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '14px',
                                    padding: '16px',
                                    boxShadow: hoveredRowId === sport.id ? '0 12px 28px rgba(15,23,42,0.12)' : '0 10px 24px rgba(15,23,42,0.05)',
                                    background: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    transform: hoveredRowId === sport.id ? 'translateY(-2px)' : 'translateY(0)'
                                }}
                            >
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontFamily: navFontFamily, fontWeight: 400 }}>Popular:</span>
                                        <PopularToggle 
                                            sport={sport} 
                                            onToggle={() => openPopularModal(sport)} 
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
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
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

    // Detail View Component
    const DetailView = ({ sport, onClose, styles, PopularToggle, StatusToggle, handleEditSport, handleDelete, openStatusModal, openPopularModal, sports }) => {
        if (!sport) return null;
        
        // Get the latest sport data from the sports array
        const currentSport = sports.find(s => s.id === sport.id) || sport;

        const DetailRow = ({ label, value }) => (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#64748b',
                    fontFamily: navFontFamily
                }}>
                    {label}:
                </span>
                <span style={{ 
                    fontSize: '14px', 
                    color: '#0f172a',
                    fontFamily: navFontFamily,
                    fontWeight: label === 'Sport Name' ? 700 : 400
                }}>
                    {value}
                </span>
            </div>
        );

        return (
            <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '2px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f1f5f9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f8fafc';
                            }}
                        >
                            <ArrowLeft size={20} color="#64748b" />
                        </button>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: 0,
                            fontFamily: navFontFamily
                        }}>
                            Sport Details
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            style={{ ...styles.button, padding: '8px 16px', fontSize: '13px' }}
                            onClick={() => handleEditSport(currentSport)}
                        >
                            <Pencil size={16} color="#ffffff" style={{ marginRight: '6px' }} />
                            Edit
                        </button>
                        <button
                            style={{ ...styles.buttonDanger, padding: '8px 16px', fontSize: '13px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => handleDelete(currentSport.id)}
                        >
                            <Trash2 size={16} color="#ffffff" style={{ marginRight: '6px' }} />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left Column */}
                    <div>
                        {/* Logo */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '150px', 
                                height: '150px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '2px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}>
                                {currentSport.image ? (
                                    <img
                                        src={currentSport.image}
                                        alt={currentSport.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : currentSport.icon ? (
                                    <span style={{ fontSize: '72px' }}>{currentSport.icon}</span>
                                ) : (
                                    <Trophy size={64} color="#64748b" />
                                )}
                            </div>
                        </div>

                        {/* Sport Name */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: 0,
                                marginBottom: '8px',
                                fontFamily: navFontFamily
                            }}>
                                {currentSport.name}
                            </h3>
                            {currentSport.isPopular && (
                                <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    fontSize: '14px',
                                    color: '#f97316',
                                    fontWeight: 600,
                                    fontFamily: navFontFamily,
                                    padding: '4px 12px',
                                    background: '#fff7ed',
                                    borderRadius: '20px'
                                }}>
                                    <Star size={16} fill="#f97316" color="#f97316" />
                                    Popular Sport
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h4 style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: 0,
                                marginBottom: '16px',
                                fontFamily: navFontFamily
                            }}>
                                Information
                            </h4>
                            
                            <DetailRow label="Sport Name" value={currentSport.name} />
                            
                            {/* Toggle Bar Style - Shared for consistency */}
                            {(() => {
                                const toggleBarStyle = { 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f1f5f9'
                                };
                                const toggleLabelStyle = { 
                                    fontSize: '14px', 
                                    fontWeight: 600, 
                                    color: '#64748b',
                                    fontFamily: navFontFamily
                                };
                                
                                return (
                                    <>
                                        <div style={toggleBarStyle}>
                                            <span style={toggleLabelStyle}>
                                                Is Popular:
                                            </span>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <PopularToggle 
                                                    sport={currentSport} 
                                                    onToggle={() => openPopularModal(currentSport)} 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div style={toggleBarStyle}>
                                            <span style={toggleLabelStyle}>
                                                Status:
                                            </span>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <StatusToggle 
                                                    sport={currentSport} 
                                                    onToggle={() => openStatusModal(currentSport)} 
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
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
                            {confirmModal.type === 'delete' 
                                ? <>Do you want to delete <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.sportName || 'this sport'}</span>?</>
                                : confirmModal.type === 'popular' 
                                    ? <>Do you want to change this to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Popular'}</span>?</>
                                    : <>Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?</>
                            }
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
            ) : viewMode === 'detail' && detailSport ? (
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
                                    {confirmModal.type === 'delete' 
                                        ? <>Do you want to delete <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.sportName || 'this sport'}</span>?</>
                                        : confirmModal.type === 'popular' 
                                            ? <>Do you want to change this to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Popular'}</span>?</>
                                            : <>Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?</>
                                    }
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
                    
                    {/* Detail View */}
                    <DetailView
                        sport={detailSport}
                        onClose={closeDetailView}
                        styles={styles}
                        PopularToggle={PopularToggle}
                        StatusToggle={StatusToggle}
                        handleEditSport={handleEditSport}
                        handleDelete={handleDelete}
                        openStatusModal={openStatusModal}
                        openPopularModal={openPopularModal}
                        sports={sports}
                    />
                </>
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
                                    {confirmModal.type === 'delete' 
                                        ? <>Do you want to delete <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.sportName || 'this sport'}</span>?</>
                                        : confirmModal.type === 'popular' 
                                            ? <>Do you want to change this to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Popular'}</span>?</>
                                            : <>Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?</>
                                    }
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
                        padding: '20px',
                        marginBottom: '16px',
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

                    {/* Loading and Error States */}
                    {loading && (
                        <div style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '40px',
                            textAlign: 'center',
                            marginBottom: '24px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{
                                fontSize: '16px',
                                color: '#64748b',
                                fontFamily: navFontFamily
                            }}>
                                Loading sports...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '14px',
                            padding: '16px 20px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#dc2626',
                                fontFamily: navFontFamily,
                                fontWeight: 500
                            }}>
                                {error}
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
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
                        mounted={mounted}
                    />

                    {/* Stats Bar */}
                    {mounted && (
                        <StatsBar 
                            styles={styles}
                            totalSports={totalSports}
                            popularSports={popularSports}
                        />
                    )}

                    {/* List / Grid */}
                    <ListGrid
                        styles={styles}
                        viewMode={viewMode}
                        sports={paginatedSports}
                        openPopularModal={openPopularModal}
                        openStatusModal={openStatusModal}
                        handleEditSport={handleEditSport}
                        handleDelete={handleDelete}
                        PopularToggle={PopularToggle}
                        StatusToggle={StatusToggle}
                        openDetailView={openDetailView}
                        hoveredRowId={hoveredRowId}
                        setHoveredRowId={setHoveredRowId}
                    />

                    {/* Pagination */}
                    {filteredSports.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>Rows per page:</span>
                                <select
                                    style={{ ...styles.input, width: '90px', marginBottom: 0, padding: '8px 10px' }}
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                {mounted && (
                                    <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>
                                        Showing {start + 1}-{Math.min(end, filteredSports.length)} of {filteredSports.length}
                                    </span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === 1 ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={safeCurrentPage === 1}
                                    >
                                        Prev
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        {visiblePages.map((page) => {
                                            const isActive = page === safeCurrentPage;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #e2e8f0',
                                                        backgroundColor: isActive ? '#1e40af' : '#fff',
                                                        color: isActive ? '#fff' : '#0f172a',
                                                        cursor: 'pointer',
                                                        fontWeight: isActive ? 700 : 500,
                                                        minWidth: '36px'
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === totalPages ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={safeCurrentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}


