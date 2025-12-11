'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function UsersPage() {
    const { users, setUsers } = useAdmin();
    const styles = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        mobile: '',
        role: 'User',
        source: 'Website',
        participants: '',
        status: 'active'
    });

    const [confirmModal, setConfirmModal] = useState(null); // { id, nextStatus, message }

    const toggleUserStatus = (id) => {
        const target = users.find(user => user.id === id);
        if (!target) return;
        const nextStatus = target.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({
            id,
            nextStatus,
            message: `Do you want to change this status to "${nextStatus}"? `
        });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const { id, nextStatus } = confirmModal;
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: nextStatus } : user
        ));
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleAddUser = () => {
        // Validation
        if (!newUser.name.trim() || !newUser.email.trim()) {
            alert('Please fill in at least name and email fields.');
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
            alert('A user with this email already exists.');
            return;
        }

        // Generate new ID
        const newId = Math.max(...users.map(u => u.id), 0) + 1;

        // Process participants (split by comma and trim)
        const participantsArray = newUser.participants
            ? newUser.participants.split(',').map(p => p.trim()).filter(p => p.length > 0)
            : [];

        // Add new user
        const userToAdd = {
            id: newId,
            name: newUser.name.trim(),
            email: newUser.email.trim(),
            mobile: newUser.mobile.trim() || '',
            role: newUser.role,
            source: newUser.source,
            participants: participantsArray,
            status: newUser.status
        };

        setUsers([...users, userToAdd]);
        
        // Reset form and close modal
        setNewUser({
            name: '',
            email: '',
            mobile: '',
            role: 'User',
            source: 'Website',
            participants: '',
            status: 'active'
        });
        setShowAddModal(false);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewUser({
            name: '',
            email: '',
            mobile: '',
            role: 'User',
            source: 'Website',
            participants: '',
            status: 'active'
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div style={styles.mainContent}>
            {confirmModal && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modal, maxWidth: '420px', textAlign: 'center', position: 'relative', paddingTop: '28px' }}>
                        <span style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: '#f97316' }}></span>
                        <button
                            onClick={handleCancelStatus}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#0f172a',
                                padding: 0,
                                lineHeight: 1
                            }}
                            aria-label="Close"
                        >
                            <img src="/cross-icon.svg" alt="close" width={14} height={14} />
                        </button>
                        <h3 style={{ margin: '0 0 12px 0', color: '#f97316', fontWeight: 700 }}>Are You Sure?</h3>
                        <p style={{ color: '#242222', marginBottom: '20px' }}>
                            Do you want to change this status to <span style={{ color: '#fa0602', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?
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
            )}
            {/* Header with Title and Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={styles.title}>Users Management</h1>
                <Button
                    variant="success"
                    onClick={() => setShowAddModal(true)}
                    style={{ marginBottom: 0 }}
                >
                    ➕ Add User
                </Button>
            </div>

            {/* Search and Filter Bar */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'center', 
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    style={{ 
                        ...styles.input, 
                        width: '200px', 
                        maxWidth: '100%',
                        marginBottom: 0,
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    style={{
                        ...styles.input,
                        width: '180px',
                        marginBottom: 0,
                        cursor: 'pointer',
                        padding: '12px',
                    }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
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
                                    {user.name}
                                </td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.mobile || '-'}</td>
                                <td style={styles.td}>
                                    {Array.isArray(user.participants) ? user.participants.length : 0}
                                </td>
                                <td style={styles.td}>{user.source || 'Unknown'}</td>
                                <td style={styles.td}>
                                    <div
                                        onClick={() => toggleUserStatus(user.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`}
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '20px',
                                                borderRadius: '999px',
                                                background: user.status === 'active' ? '#023B84' : '#c7d5f0',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: user.status === 'active' ? '36px' : '3px',
                                                    width: '10px',
                                                    height: '12px',
                                                    borderRadius: '999px',
                                                    background: '#ffffff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                    transition: 'left 0.2s ease'
                                                }}
                                            />
                                        </div>
                                        <span style={{
                                            color: user.status === 'active' ? '#023B84' : '#64748b',
                                            fontWeight: 700,
                                            fontSize: '12px',
                                            minWidth: '52px'
                                        }}>
                                            {user.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
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
                        {searchTerm || statusFilter !== 'all' 
                            ? 'No users found matching your filters' 
                            : 'No users found'}
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            <Modal
                show={showAddModal}
                onClose={handleCloseModal}
                title="Add New User"
            >
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '18px',
                    paddingTop: '10px'
                }}>
                    {/* Name */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: styles.title.color, 
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter user's name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            style={{ marginBottom: 0 }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: styles.title.color, 
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Email <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            style={{ marginBottom: 0 }}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: styles.title.color, 
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Mobile Number
                        </label>
                        <Input
                            type="tel"
                            placeholder="Enter mobile number"
                            value={newUser.mobile}
                            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                            style={{ marginBottom: 0 }}
                        />
                    </div>

                    {/* Role and Source in Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                color: styles.title.color, 
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Role
                            </label>
                            <select
                                style={{
                                    ...styles.input,
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom: 0,
                                    padding: '12px',
                                }}
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                color: styles.title.color, 
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Source
                            </label>
                            <select
                                style={{
                                    ...styles.input,
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom: 0,
                                    padding: '12px',
                                }}
                                value={newUser.source}
                                onChange={(e) => setNewUser({ ...newUser, source: e.target.value })}
                            >
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Participants */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: styles.title.color, 
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Participants
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., John Jr, Baby Jane"
                            value={newUser.participants}
                            onChange={(e) => setNewUser({ ...newUser, participants: e.target.value })}
                            style={{ marginBottom: 0 }}
                        />
                        <small style={{ 
                            color: styles.subtitle.color, 
                            fontSize: '12px', 
                            marginTop: '6px', 
                            display: 'block',
                            opacity: 0.7
                        }}>
                            Separate multiple participants with commas
                        </small>
                    </div>

                    {/* Status */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: styles.title.color, 
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Status
                        </label>
                        <select
                            style={{
                                ...styles.input,
                                width: '100%',
                                cursor: 'pointer',
                                marginBottom: 0,
                                padding: '12px',
                            }}
                            value={newUser.status}
                            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        justifyContent: 'flex-end', 
                        marginTop: '8px',
                        paddingTop: '20px',
                        borderTop: `1px solid ${styles.subtitle.color}20`
                    }}>
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            style={{ minWidth: '100px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleAddUser}
                            style={{ minWidth: '100px' }}
                        >
                            Add User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
