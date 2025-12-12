'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Trophy, Star, Pencil, Trash2, HelpCircle, X } from 'lucide-react';

export default function SportsPage() {
    const { sports, setSports } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSport, setNewSport] = useState({ name: '', icon: '' });
    const [confirmModal, setConfirmModal] = useState(null);

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

    const handleAddSport = () => {
        if (!newSport.name) return;
        const newId = sports.length > 0 ? Math.max(...sports.map(s => s.id)) + 1 : 1;
        setSports([...sports, {
            id: newId,
            name: newSport.name,
            icon: newSport.icon || '',
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

    const thCenter = { ...styles.th, textAlign: 'center' };
    const tdCenter = { ...styles.td, textAlign: 'center', verticalAlign: 'middle' };

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
                            <th style={thCenter}>Sr. No.</th>
                            <th style={thCenter}>Sports Name</th>
                            <th style={thCenter}>Logo</th>
                            <th style={thCenter}>Is popular</th>
                            <th style={thCenter}>Active</th>
                            <th style={thCenter}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSports.map((sport, index) => (
                            <tr key={sport.id}>
                                <td style={tdCenter}>{index + 1}</td>
                                <td style={tdCenter}>{sport.name}</td>
                                <td style={tdCenter}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                                        <Trophy size={20} color="#0f172a" />
                                    </div>
                                </td>
                                <td style={tdCenter}>
                                    <div
                                        onClick={() => togglePopular(sport.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        title="Toggle popular status"
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '20px',
                                                borderRadius: '999px',
                                                background: sport.isPopular ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: sport.isPopular ? '36px' : '3px',
                                                    width: '10px',
                                                    height: '12px',
                                                    borderRadius: '999px',
                                                    background: '#ffffff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                    transition: 'left 0.2s ease'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td style={tdCenter}>
                                    <div
                                        onClick={() => openStatusModal(sport)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        title="Toggle status"
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '20px',
                                                borderRadius: '999px',
                                                background: sport.status === 'active' ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: sport.status === 'active' ? '36px' : '3px',
                                                    width: '10px',
                                                    height: '12px',
                                                    borderRadius: '999px',
                                                    background: '#ffffff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                    transition: 'left 0.2s ease'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td style={tdCenter}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit sport: ${sport.name}`)}
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
                            placeholder="Icon (optional)"
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
