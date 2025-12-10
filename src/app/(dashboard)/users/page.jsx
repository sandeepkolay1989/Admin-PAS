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
                                        style={{
                                            ...(user.status === 'active' ? styles.badgeActive : styles.badgeInactive),
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                            e.target.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.opacity = '1';
                                        }}
                                        title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: 'currentColor',
                                                marginRight: '6px',
                                            }}
                                        />
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
