'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';

export default function AcademiesPage() {
    const { academies, setAcademies } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id) => {
        setAcademies(academies.map(academy =>
            academy.id === id ? { ...academy, status: academy.status === 'active' ? 'inactive' : 'active' } : academy
        ));
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

    return (
        <div style={styles.mainContent}>
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
                            <th style={styles.th}>Sr. No.</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email Id</th>
                            <th style={styles.th}>Academy Name</th>
                            <th style={styles.th}>Mobile Number</th>
                            <th style={styles.th}>Added By</th>
                            <th style={styles.th}>Create Date</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAcademies.map((academy, index) => (
                            <tr key={academy.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>
                                    <div style={{ fontWeight: '500' }}>{academy.ownerName || 'N/A'}</div>
                                </td>
                                <td style={styles.td}>{academy.email}</td>
                                <td style={styles.td}>{academy.name}</td>
                                <td style={styles.td}>{academy.contact || '-'}</td>
                                <td style={styles.td}>{academy.addedBy || '-'}</td>
                                <td style={styles.td}>{academy.createDate || '-'}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => toggleStatus(academy.id)}
                                        style={academy.status === 'active' ? styles.badgeActive : styles.badgeInactive}
                                    >
                                        {academy.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit academy: ${academy.name}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(academy.id)}
                                        >
                                            🗑️ Delete
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
