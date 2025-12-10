'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';

export default function SportsPage() {
    const { sports, setSports } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSport, setNewSport] = useState({ name: '', icon: '' });

    const togglePopular = (id) => {
        setSports(sports.map(sport =>
            sport.id === id ? { ...sport, isPopular: !sport.isPopular } : sport
        ));
    };

    const toggleStatus = (id) => {
        setSports(sports.map(sport =>
            sport.id === id ? { ...sport, status: sport.status === 'active' ? 'inactive' : 'active' } : sport
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this sport?')) {
            setSports(sports.filter(s => s.id !== id));
        }
    };

    const handleAddSport = () => {
        if (!newSport.name) return;
        const newId = sports.length > 0 ? Math.max(...sports.map(s => s.id)) + 1 : 1;
        setSports([...sports, {
            id: newId,
            name: newSport.name,
            icon: newSport.icon || '🏅',
            image: '',
            isPopular: false,
            status: 'active'
        }]);
        setNewSport({ name: '', icon: '' });
        setIsModalOpen(false);
    };

    const filteredSports = sports.filter(sport =>
        sport.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.mainContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={styles.title}>Sports Management</h1>
                <button
                    style={styles.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Sport
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search sports..."
                    style={{ ...styles.input, width: '300px', marginBottom: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Sr. No.</th>
                            <th style={styles.th}>Sports Name</th>
                            <th style={styles.th}>Logo</th>
                            <th style={styles.th}>Is popular</th>
                            <th style={styles.th}>Active</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSports.map((sport, index) => (
                            <tr key={sport.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{sport.name}</td>
                                <td style={styles.td}>
                                    <div style={{ fontSize: '24px' }}>{sport.icon}</div>
                                </td>
                                <td style={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={sport.isPopular}
                                        onChange={() => togglePopular(sport.id)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => toggleStatus(sport.id)}
                                        style={sport.status === 'active' ? styles.badgeActive : styles.badgeInactive}
                                    >
                                        {sport.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit sport: ${sport.name}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(sport.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSports.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        No sports found
                    </div>
                )}
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Add New Sport</h2>
                        <input
                            type="text"
                            placeholder="Sport Name"
                            style={styles.input}
                            value={newSport.name}
                            onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Icon (Emoji)"
                            style={styles.input}
                            value={newSport.icon}
                            onChange={(e) => setNewSport({ ...newSport, icon: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                            <button
                                style={{ ...styles.button, backgroundColor: '#cbd5e1', color: '#334155' }}
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.button}
                                onClick={handleAddSport}
                            >
                                Add Sport
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
