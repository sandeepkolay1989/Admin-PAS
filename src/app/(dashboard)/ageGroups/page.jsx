'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';

export default function AgeGroupsPage() {
    const { ageGroups, setAgeGroups } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', min: '', max: '' });

    const toggleStatus = (id) => {
        setAgeGroups(ageGroups.map(group =>
            group.id === id ? { ...group, status: group.status === 'active' ? 'inactive' : 'active' } : group
        ));
    };

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
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Sr. No.</th>
                            <th style={styles.th}>Age Group Name</th>
                            <th style={styles.th}>Minimum</th>
                            <th style={styles.th}>Maximum</th>
                            <th style={styles.th}>Active</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.map((group, index) => (
                            <tr key={group.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{group.name}</td>
                                <td style={styles.td}>
                                    <span style={styles.badge}>{group.min} Years</span>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.badge}>{group.max} Years</span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => toggleStatus(group.id)}
                                        style={group.status === 'active' ? styles.badgeActive : styles.badgeInactive}
                                    >
                                        {group.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit group: ${group.name}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(group.id)}
                                        >
                                            🗑️ Delete
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
