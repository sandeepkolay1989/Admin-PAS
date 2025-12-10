'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';

export default function UsersPage() {
    const { users, setUsers } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const toggleUserStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
        ));
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.mainContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={styles.title}>Users Management</h1>
                <input
                    type="text"
                    placeholder="Search users..."
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
                            <th style={styles.th}>User's Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Mobile Number</th>
                            <th style={styles.th}>All Participants</th>
                            <th style={styles.th}>Source</th>
                            <th style={styles.th}>Active</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={{ ...styles.td, fontWeight: '500' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={styles.avatar}>{user.name.charAt(0)}</div>
                                        {user.name}
                                    </div>
                                </td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.mobile || '-'}</td>
                                <td style={styles.td}>
                                    {user.participants && user.participants.length > 0
                                        ? user.participants.join(', ')
                                        : 'No participants'}
                                </td>
                                <td style={styles.td}>{user.source || 'Unknown'}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => toggleUserStatus(user.id)}
                                        style={user.status === 'active' ? styles.badgeActive : styles.badgeInactive}
                                    >
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{ ...styles.button, padding: '5px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit user: ${user.name}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
