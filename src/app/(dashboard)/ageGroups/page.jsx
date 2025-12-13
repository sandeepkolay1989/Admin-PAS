'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Pencil, Trash2, HelpCircle, X } from 'lucide-react';

export default function AgeGroupsPage() {
    const { ageGroups, setAgeGroups } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', min: '', max: '' });
    const [confirmModal, setConfirmModal] = useState(null);

    const openStatusModal = (group) => {
        if (!group) return;
        const nextStatus = group.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({ groupId: group.id, nextStatus });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const targetStatus = (confirmModal.nextStatus || '').toLowerCase() === 'active' ? 'active' : 'inactive';
        setAgeGroups((prev) =>
            prev.map((group) =>
                group.id === confirmModal.groupId ? { ...group, status: targetStatus } : group
            )
        );
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this age group?')) {
            setAgeGroups(ageGroups.filter(g => g.id !== id));
        }
    };

    const handleAddGroup = () => {
        if (!newGroup.name || !newGroup.min || !newGroup.max) return;
        const newId = ageGroups.length > 0 ? Math.max(...ageGroups.map(g => g.id)) + 1 : 1;
        setAgeGroups([...ageGroups, {
            id: newId,
            name: newGroup.name,
            min: newGroup.min,
            max: newGroup.max,
            status: 'active'
        }]);
        setNewGroup({ name: '', min: '', max: '' });
        setIsModalOpen(false);
    };

    const filteredGroups = ageGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <h1 style={styles.title}>Age Groups Management</h1>
                <button
                    style={styles.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Age Groups
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{ ...styles.input, width: '300px', marginBottom: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={styles.card}>
                <table style={{ ...styles.table, width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Sr. No.</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Age Group Name</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Minimum</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Maximum</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Active</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.map((group, index) => (
                            <tr key={group.id}>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ ...styles.td, textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 500 }}>{group.name}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={styles.badge}>{group.min} Years</span>
                                </td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={styles.badge}>{group.max} Years</span>
                                </td>
                                <td style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                        onClick={() => openStatusModal(group)}
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
                                                background: group.status === 'active' ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: group.status === 'active' ? '36px' : '3px',
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
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit group: ${group.name}`)}
                                            title="Edit"
                                        >
                                            <Pencil size={14} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(group.id)}
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
                {filteredGroups.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        No age groups found
                    </div>
                )}
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Add Age Group</h2>
                        <input
                            type="text"
                            placeholder="Age Group Name"
                            style={styles.input}
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                placeholder="Min Age"
                                style={styles.input}
                                value={newGroup.min}
                                onChange={(e) => setNewGroup({ ...newGroup, min: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Max Age"
                                style={styles.input}
                                value={newGroup.max}
                                onChange={(e) => setNewGroup({ ...newGroup, max: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                            <button
                                style={{ ...styles.button, backgroundColor: '#cbd5e1', color: '#334155' }}
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.button}
                                onClick={handleAddGroup}
                            >
                                Add Age Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
