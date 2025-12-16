'use client';
import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function BatchesPage() {
    const { batches, setBatches, academies, sports } = useAdmin();
    const styles = useTheme();
    const router = useRouter();
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

    const [selectedSport, setSelectedSport] = useState('All Sports');
    const [selectedAcademy, setSelectedAcademy] = useState('All Academies');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Stats Calculations
    const totalBatches = batches.length;
    const activeBatches = batches.filter(b => b.status === 'active').length;
    const totalStudents = batches.reduce((acc, curr) => acc + (curr.studentsCount || 0), 0);
    const avgCapacity = totalBatches > 0
        ? Math.round((batches.reduce((acc, curr) => acc + (curr.studentsCount || 0), 0) / batches.reduce((acc, curr) => acc + (curr.capacity || 0), 0)) * 100)
        : 0;

    // Filters
    const filteredBatches = batches.filter(batch => {
        const matchesSport = selectedSport === 'All Sports' || batch.sport === selectedSport;

        // Find academy name for the batch
        const academy = academies.find(a => a.id === batch.academyId);
        const academyName = academy ? academy.name : '';
        const matchesAcademy = selectedAcademy === 'All Academies' || academyName === selectedAcademy;

        const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSport && matchesAcademy && matchesSearch;
    });

    const toggleBatchStatus = (id) => {
        setBatches(batches.map(batch =>
            batch.id === id ? { ...batch, status: batch.status === 'active' ? 'inactive' : 'active' } : batch
        ));
    };

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const fullDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Helper to format time 24h -> 12h
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${minutes} ${ampm}`;
    };

    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
            {/* Header */}
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
                        Batch Management
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#64748b',
                        margin: 0,
                        fontFamily: navFontFamily
                    }}>
                        Manage training batches and schedules
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        style={{
                            background: '#fff',
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: navFontFamily,
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => router.refresh()}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                        }}
                    >
                        Refresh
                    </button>
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
                        + Add Batch
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select
                    style={styles.select}
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                >
                    <option>All Sports</option>
                    {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <select
                    style={styles.select}
                    value={selectedAcademy}
                    onChange={(e) => setSelectedAcademy(e.target.value)}
                >
                    <option>All Academies</option>
                    {academies.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatsCard title="Total Batches" value={totalBatches} styles={styles} />
                <StatsCard title="Active Batches" value={activeBatches} styles={styles} />
                <StatsCard title="Total Students" value={totalStudents} styles={styles} />
                <StatsCard title="Avg Capacity" value={`${avgCapacity}%`} styles={styles} />
            </div>

            {/* Search and View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search batches by name"
                    style={{ ...styles.input, width: '400px', marginBottom: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                        style={{ ...styles.iconButton, backgroundColor: viewMode === 'grid' ? '#f97316' : 'white', color: viewMode === 'grid' ? 'white' : '#64748b' }}
                        onClick={() => setViewMode('grid')}
                    >
                        ⊞
                    </button>
                    <button
                        style={{ ...styles.iconButton, backgroundColor: viewMode === 'list' ? '#f97316' : 'white', color: viewMode === 'list' ? 'white' : '#64748b' }}
                        onClick={() => setViewMode('list')}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Batches Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {filteredBatches.map(batch => (
                    <div key={batch.id} style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '10px',
                                    backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                                }}>
                                    {sports.find(s => s.name === batch.sport)?.icon || '🏅'}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1e293b' }}>{batch.name}</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{batch.sport}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', backgroundColor: batch.status === 'active' ? '#22c55e' : '#64748b', color: 'white' }}>
                                    {batch.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                                    <input
                                        type="checkbox"
                                        checked={batch.status === 'active'}
                                        onChange={() => toggleBatchStatus(batch.id)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: batch.status === 'active' ? '#f97316' : '#ccc', borderRadius: '34px', transition: '.4s'
                                    }}>
                                        <span style={{
                                            position: 'absolute', content: "", height: '16px', width: '16px', left: batch.status === 'active' ? '18px' : '2px', bottom: '2px',
                                            backgroundColor: 'white', borderRadius: '50%', transition: '.4s'
                                        }}></span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569', fontSize: '14px' }}>
                                🕒 {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Days:</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {fullDays.map((day, idx) => {
                                    // Check if the first 3 letters of the full day match any day in the batch's days array
                                    const isActiveDay = batch.days.some(d => d.startsWith(day.substring(0, 3)));
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '11px', fontWeight: 'bold',
                                                backgroundColor: isActiveDay ? '#f97316' : '#f1f5f9',
                                                color: isActiveDay ? 'white' : '#94a3b8'
                                            }}
                                        >
                                            {daysOfWeek[idx]}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredBatches.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: styles.subtitle.color }}>
                    No batches found matching your criteria.
                </div>
            )}
        </div>
    );
}

function StatsCard({ title, value, styles }) {
    return (
        <div style={{ ...styles.card, padding: '20px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>{title}</p>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{value}</h2>
        </div>
    );
}
