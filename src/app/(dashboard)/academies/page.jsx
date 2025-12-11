'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Pencil, Trash2, X, HelpCircle } from 'lucide-react';

export default function AcademiesPage() {
    const { academies, setAcademies } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState(null); // { id, nextStatus, message }

    const toggleStatus = (id) => {
        const target = academies.find(a => a.id === id);
        if (!target) return;
        const nextStatus = target.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({
            id,
            nextStatus,
            message: `Change status to "${nextStatus}"? Please confirm to complete the change.`
        });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const { id, nextStatus } = confirmModal;
        setAcademies(academies.map(academy =>
            academy.id === id ? { ...academy, status: nextStatus } : academy
        ));
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const renderConfirmModal = () => {
        if (!confirmModal) return null;
        return (
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
                    <h3 style={{ margin: '0 0 12px 0', color: '#de0404', fontWeight: 700 }}>Are You Sure?</h3>
                    <p style={{ color: '#242222', marginBottom: '20px' }}>
                        Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                            onClick={handleCancelStatus}
                            style={{ ...styles.button, backgroundColor: '#e5e7eb', color: '#111827' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmStatus}
                            style={{
                                ...styles.buttonSuccess,
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
        );
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this academy?')) {
            setAcademies(academies.filter(a => a.id !== id));
        }
    };

    const filteredAcademies = academies.filter(academy =>
        academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const thCenter = { ...styles.th, textAlign: 'center' };
    const tdCenter = { ...styles.td, textAlign: 'center', verticalAlign: 'middle' };

    return (
        <div style={styles.mainContent}>
            {renderConfirmModal()}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={styles.title}>Academies Management</h1>
                <input
                    type="text"
                    placeholder="Search academies..."
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
                            <th style={thCenter}>Name</th>
                            <th style={thCenter}>Email Id</th>
                            <th style={thCenter}>Academy Name</th>
                            <th style={thCenter}>Mobile Number</th>
                            <th style={thCenter}>Added By</th>
                            <th style={thCenter}>Create Date</th>
                            <th style={thCenter}>Status</th>
                            <th style={thCenter}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAcademies.map((academy, index) => (
                            <tr key={academy.id}>
                                <td style={tdCenter}>{index + 1}</td>
                                <td style={{ ...tdCenter, fontWeight: '500', whiteSpace: 'nowrap' }}>
                                    {academy.ownerName || 'N/A'}
                                </td>
                                <td style={tdCenter}>{academy.email}</td>
                                <td style={tdCenter}>{academy.name}</td>
                                <td style={tdCenter}>{academy.contact || '-'}</td>
                                <td style={tdCenter}>{academy.addedBy || '-'}</td>
                                <td style={tdCenter}>{academy.createDate || '-'}</td>
                                <td style={tdCenter}>
                                    <div
                                        onClick={() => toggleStatus(academy.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        title={`Click to ${academy.status === 'active' ? 'Deactivate' : 'Activate'} academy`}
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '20px',
                                                borderRadius: '999px',
                                                background: academy.status === 'active' ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: academy.status === 'active' ? '36px' : '3px',
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
                                            style={{ ...styles.button, padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit academy: ${academy.name}`)}
                                            title="Edit"
                                        >
                                            <Pencil size={16} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 12px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(academy.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} color="#ffffff" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAcademies.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        No academies found
                    </div>
                )}
            </div>
        </div>
    );
}
