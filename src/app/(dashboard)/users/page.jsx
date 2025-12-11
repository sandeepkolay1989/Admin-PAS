'use client';
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function UsersPage() {
    const { users, setUsers } = useAdmin();
    const styles = useTheme();

    const GENDERS = ['male', 'female', 'other'];
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive | deleted
    const [userTypeFilter, setUserTypeFilter] = useState('all'); // all | guardian | student
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('list'); // list | grid
    const [showAddModal, setShowAddModal] = useState(false);
    const emptyUser = {
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        mobile: '',
        password: '',
        gender: '',
        profileImage: '',
        isActive: true,
        role: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
        },
        isDeleted: false,
        deletedAt: null,
    };
    const [newUser, setNewUser] = useState(emptyUser);
    const [confirmModal, setConfirmModal] = useState(null); // { id, nextStatus }

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleDateString();
    };

    const toggleUserStatus = (id) => {
        const target = users.find((user) => user.id === id);
        if (!target || target.isDeleted) return;
        const nextStatus = target.isActive ? 'Inactive' : 'Active';
        setConfirmModal({
            id,
            nextStatus,
        });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const { id } = confirmModal;
        setUsers(users.map((user) =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
        ));
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const handleDeleteUser = (id) => {
        if (window.confirm('Mark this user as deleted?')) {
            setUsers(users.map((user) =>
                user.id === id
                    ? { ...user, isDeleted: true, deletedAt: new Date().toISOString(), isActive: false }
                    : user
            ));
        }
    };

    const handleAddUser = () => {
        if (!newUser.firstName.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.role.trim()) {
            alert('First name, email, password and role are required.');
            return;
        }

        if (users.some((user) => user.email.toLowerCase() === newUser.email.toLowerCase())) {
            alert('A user with this email already exists.');
            return;
        }

        const userToAdd = {
            ...newUser,
            id: `USR-${Date.now()}`,
            firstName: newUser.firstName.trim(),
            lastName: newUser.lastName.trim(),
            email: newUser.email.trim(),
            mobile: newUser.mobile.trim(),
            dob: newUser.dob || null,
            gender: newUser.gender || null,
            profileImage: newUser.profileImage.trim() || null,
            address: {
                line1: newUser.address.line1.trim(),
                line2: newUser.address.line2.trim(),
                city: newUser.address.city.trim(),
                state: newUser.address.state.trim(),
                country: newUser.address.country.trim(),
                postalCode: newUser.address.postalCode.trim(),
            },
            isDeleted: false,
            deletedAt: null,
        };

        setUsers([...users, userToAdd]);
        setNewUser(emptyUser);
        setShowAddModal(false);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewUser(emptyUser);
    };

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(search) ||
            (user.email || '').toLowerCase().includes(search) ||
            (user.mobile || '').toLowerCase().includes(search);

        const userType = (() => {
            const role = (user.role || '').toLowerCase();
            if (role.includes('guardian') || role.includes('parent')) return 'guardian';
            if (role.includes('student')) return 'student';
            if (role.includes('user')) return 'student';
            return 'other';
        })();

        const matchesStatus = (() => {
            if (statusFilter === 'all') return true;
            if (statusFilter === 'active') return user.isActive && !user.isDeleted;
            if (statusFilter === 'inactive') return !user.isActive && !user.isDeleted;
            if (statusFilter === 'deleted') return user.isDeleted;
            return true;
        })();

        const matchesUserType = (() => {
            if (!userTypeFilter || userTypeFilter === 'all') return true;
            return userType === userTypeFilter;
        })();

        return matchesSearch && matchesStatus && matchesUserType;
    });

    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, pageSize, userTypeFilter]);

    const totalUsers = users.length;
    const totalGuardians = users.filter((u) => {
        const role = (u.role || '').toLowerCase();
        return role.includes('guardian') || role.includes('parent');
    }).length;
    const totalStudents = users.filter((u) => {
        const role = (u.role || '').toLowerCase();
        return role.includes('student') || role.includes('user');
    }).length;
    const activeUsers = users.filter((u) => u.isActive && !u.isDeleted).length;

    // clamp page when filters change
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const start = (safeCurrentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);

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
            {/* Hero / actions */}
            <div style={{
                background: 'linear-gradient(90deg, #fffaf5 0%, #fff7ec 100%)',
                border: '1px solid #fde7c7',
                borderRadius: '16px',
                padding: '16px 20px',
                paddingRight: '120px', // keep room for profile avatar on the right
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.12)',
                marginBottom: '16px'
            }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>User Management</div>
                    <div style={{ color: '#475569', fontSize: '14px' }}>Manage users and student profiles</div>
                </div>
                <div />
            </div>

            {/* Filters + search */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '12px',
                background: '#fff',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
            }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '12px', flex: '0 1 240px', maxWidth: '100%' }}>
                        <span style={{ color: '#94a3b8' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px',
                                color: '#0f172a',
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button style={{
                            ...styles.button,
                            background: '#1d4ed8',
                            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.25)',
                            borderRadius: '12px',
                            padding: '10px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '16px' }}>⬇️</span> Export CSV
                        </button>
                        <Button
                            variant="success"
                            onClick={() => setShowAddModal(true)}
                            style={{
                                marginBottom: 0,
                                backgroundColor: '#0284c7',
                                boxShadow: '0 10px 24px rgba(2, 132, 199, 0.25)',
                                borderRadius: '12px',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ➕ Add User
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {[
                            { key: 'all', label: 'All Users' },
                            { key: 'guardian', label: 'Guardians' },
                            { key: 'student', label: 'Students' },
                        ].map((item) => {
                            const active = userTypeFilter === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setUserTypeFilter(item.key)}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '12px',
                                        border: active ? '1px solid #f97316' : '1px solid #e2e8f0',
                                        background: active ? '#fff7ed' : '#fff',
                                        color: active ? '#c2410c' : '#0f172a',
                                        fontWeight: active ? 700 : 600,
                                        cursor: 'pointer',
                                        boxShadow: active ? '0 6px 18px rgba(249, 115, 22, 0.15)' : 'none'
                                    }}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {[
                                { key: 'grid', label: 'Grid View' },
                                { key: 'list', label: 'List View' },
                            ].map((mode) => {
                                const active = viewMode === mode.key;
                                const isGrid = mode.key === 'grid';
                                return (
                                    <button
                                        key={mode.key}
                                        onClick={() => setViewMode(mode.key)}
                                        aria-label={mode.label}
                                        style={{
                                            width: '42px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: active
                                                ? (isGrid
                                                    ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                                                    : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)')
                                                : 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)',
                                            boxShadow: active ? '0 8px 18px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
                                            color: active ? '#fff' : '#475569'
                                        }}
                                    >
                                        {isGrid ? (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                {[0, 6, 12].map((x) =>
                                                    [0, 6, 12].map((y) => (
                                                        <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1.2" fill={active ? '#fff' : '#475569'} />
                                                    ))
                                                )}
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                {[2, 7, 12].map((y) => (
                                                    <g key={y}>
                                                        <rect x="2" y={y} width="12" height="2" rx="1" fill={active ? '#fff' : '#475569'} />
                                                    </g>
                                                ))}
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#475569', fontSize: '13px' }}>Filter by status:</span>
                        <select
                            style={{
                                ...styles.input,
                                width: '180px',
                                marginBottom: 0,
                                padding: '10px 12px',
                            }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                            <option value="deleted">Deleted Only</option>
                        </select>
                    </div>
                    <div style={{ color: '#475569', fontSize: '13px' }}>
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {[
                    { label: 'Total Users', value: totalUsers, icon: '👤' },
                    { label: 'Guardians', value: totalGuardians, icon: '🧑‍🤝‍🧑' },
                    { label: 'Students', value: totalStudents, icon: '🎓' },
                    { label: 'Active Users', value: activeUsers, icon: '✅' },
                ].map((stat) => (
                    <div key={stat.label} style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#fff7ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List / Grid */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        {searchTerm || statusFilter !== 'all' || userTypeFilter !== 'all'
                            ? 'No users found matching your filters'
                            : 'No users found'}
                    </div>
                )}

                {viewMode === 'list' ? (
                    <>
                        {paginatedUsers.map((user) => {
                            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed';
                            const initials = fullName ? fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'NA';
                            const cityState = user.address?.city ? `${user.address.city}${user.address.state ? `, ${user.address.state}` : ''}` : '';
                            return (
                                <div key={user.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '14px',
                                    border: '1px solid #f1f5f9',
                                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
                                    marginBottom: '10px',
                                    background: '#fff'
                                }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 auto' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: '#f97316',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                        }}>
                                            {initials}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{fullName}</span>
                                                <span style={{ fontSize: '12px', color: '#0f172a', background: '#f8fafc', padding: '4px 10px', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
                                                    {user.role || 'User'}
                                                </span>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: user.isDeleted ? '#991b1b' : user.isActive ? '#166534' : '#92400e',
                                                    background: user.isDeleted ? '#fee2e2' : user.isActive ? '#dcfce7' : '#fef3c7',
                                                    padding: '4px 10px',
                                                    borderRadius: '999px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#475569' }}>
                                                <span>📞 {user.mobile || '-'}</span>
                                                <span>📧 {user.email}</span>
                                                <span>🎂 {formatDate(user.dob) || '-'}</span>
                                                <span>📍 {cityState || '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <div
                                            onClick={() => toggleUserStatus(user.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: user.isDeleted ? 'not-allowed' : 'pointer',
                                                userSelect: 'none',
                                                opacity: user.isDeleted ? 0.5 : 1
                                            }}
                                            title={user.isDeleted ? 'Deleted users cannot change status' : `Click to ${user.isActive ? 'deactivate' : 'activate'} user`}
                                        >
                                            <div
                                                style={{
                                                    width: '50px',
                                                    height: '22px',
                                                    borderRadius: '999px',
                                                    background: user.isActive && !user.isDeleted ? '#1d4ed8' : '#cbd5e1',
                                                    position: 'relative',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        left: user.isActive && !user.isDeleted ? '28px' : '4px',
                                                        width: '14px',
                                                        height: '14px',
                                                        borderRadius: '50%',
                                                        background: '#ffffff',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                        transition: 'left 0.2s ease'
                                                    }}
                                                />
                                            </div>
                                            <span style={{
                                                color: user.isDeleted ? '#ef4444' : user.isActive ? '#1d4ed8' : '#64748b',
                                                fontWeight: 700,
                                                fontSize: '12px',
                                                minWidth: '64px'
                                            }}>
                                                {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <button
                                            style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }}
                                            onClick={() => alert(`Edit user: ${fullName}`)}
                                            disabled={user.isDeleted}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 10px', fontSize: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={user.isDeleted}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                        {paginatedUsers.map((user) => {
                            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed';
                            const initials = fullName ? fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'NA';
                            const cityState = user.address?.city ? `${user.address.city}${user.address.state ? `, ${user.address.state}` : ''}` : '';
                            const role = user.role || 'User';
                            const roleColor = role.toLowerCase().includes('guardian') ? '#16a34a' : '#2563eb';
                            const statusColor = user.isDeleted ? '#ef4444' : user.isActive ? '#16a34a' : '#f97316';
                            return (
                                <div key={user.id} style={{
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '14px',
                                    padding: '14px',
                                    boxShadow: '0 10px 24px rgba(15,23,42,0.05)',
                                    background: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '50%',
                                                background: '#f97316',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                            }}>
                                                {initials}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{fullName}</div>
                                                <div style={{ fontSize: '12px', color: '#475569' }}>{role}</div>
                                            </div>
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#fff',
                                                background: roleColor,
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                fontWeight: 700
                                            }}>
                                                {role}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#fff',
                                            background: statusColor,
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            fontWeight: 700
                                        }}>
                                            {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', rowGap: '6px', columnGap: '10px', fontSize: '13px', color: '#475569' }}>
                                        <span>📞 {user.mobile || '-'}</span>
                                        <span>📧 {user.email}</span>
                                        <span>📍 {cityState || '—'}</span>
                                        <span>🎂 {formatDate(user.dob) || '-'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#0f172a' }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div>Bookings: <strong>{user.bookingsCount || 0}</strong></div>
                                            <div>Active: <strong>{user.activeCount || (user.isActive ? 1 : 0)}</strong></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <div
                                                onClick={() => toggleUserStatus(user.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: user.isDeleted ? 'not-allowed' : 'pointer',
                                                    userSelect: 'none',
                                                    opacity: user.isDeleted ? 0.5 : 1
                                                }}
                                                title={user.isDeleted ? 'Deleted users cannot change status' : `Click to ${user.isActive ? 'deactivate' : 'activate'} user`}
                                            >
                                                <div style={{
                                                    width: '38px',
                                                    height: '18px',
                                                    borderRadius: '999px',
                                                    background: user.isActive && !user.isDeleted ? '#22c55e' : '#e2e8f0',
                                                    position: 'relative',
                                                    transition: 'all 0.2s ease',
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '3px',
                                                        left: user.isActive && !user.isDeleted ? '22px' : '3px',
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                        transition: 'left 0.2s ease'
                                                    }} />
                                                </div>
                                                <span style={{ fontWeight: 700, color: user.isActive && !user.isDeleted ? '#16a34a' : '#475569', fontSize: '12px' }}>
                                                    {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <button
                                                style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }}
                                                onClick={() => alert(`Edit user: ${fullName}`)}
                                                disabled={user.isDeleted}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                style={{ ...styles.buttonDanger, padding: '6px 10px', fontSize: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.isDeleted}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {filteredUsers.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>Rows per page:</span>
                            <select
                                style={{ ...styles.input, width: '90px', marginBottom: 0, padding: '8px 10px' }}
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                {[5, 10, 20, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>
                                Showing {start + 1}-{Math.min(end, filteredUsers.length)} of {filteredUsers.length}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === 1 ? 0.5 : 1 }}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage === 1}
                                >
                                    Prev
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const page = idx + 1;
                                        const isActive = page === safeCurrentPage;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    backgroundColor: isActive ? '#1e40af' : '#fff',
                                                    color: isActive ? '#fff' : '#0f172a',
                                                    cursor: 'pointer',
                                                    fontWeight: isActive ? 700 : 500,
                                                    minWidth: '36px'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === totalPages ? 0.5 : 1 }}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                First Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter first name"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Last Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter last name"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
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
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Mobile
                            </label>
                            <Input
                                type="tel"
                                placeholder="Enter mobile number"
                                value={newUser.mobile}
                                onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Password <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <Input
                                type="password"
                                placeholder="Temporary password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Date of Birth
                            </label>
                            <Input
                                type="date"
                                value={newUser.dob}
                                onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: styles.title.color,
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Gender
                            </label>
                            <select
                                style={{
                                    ...styles.input,
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom: 0,
                                    padding: '12px',
                                }}
                                value={newUser.gender}
                                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                            >
                                <option value="">Select gender</option>
                                {GENDERS.map((g) => (
                                    <option key={g} value={g}>
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </option>
                                ))}
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
                                Role <span style={{ color: '#ef4444' }}>*</span>
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
                                <option value="">Select role</option>
                                <option value="Admin">Admin</option>
                                <option value="Coach">Coach</option>
                                <option value="Parent">Parent</option>
                                <option value="User">User</option>
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
                                Profile Image URL
                            </label>
                            <Input
                                type="url"
                                placeholder="https://..."
                                value={newUser.profileImage}
                                onChange={(e) => setNewUser({ ...newUser, profileImage: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: styles.title.color,
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Address
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <Input
                                type="text"
                                placeholder="Line 1"
                                value={newUser.address.line1}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, line1: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                            <Input
                                type="text"
                                placeholder="Line 2"
                                value={newUser.address.line2}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, line2: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <Input
                                type="text"
                                placeholder="City"
                                value={newUser.address.city}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, city: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                            <Input
                                type="text"
                                placeholder="State"
                                value={newUser.address.state}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, state: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                            <Input
                                type="text"
                                placeholder="Postal Code"
                                value={newUser.address.postalCode}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, postalCode: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <Input
                                type="text"
                                placeholder="Country"
                                value={newUser.address.country}
                                onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, country: e.target.value } })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

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
                            style={{ minWidth: '140px' }}
                        >
                            Add User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
