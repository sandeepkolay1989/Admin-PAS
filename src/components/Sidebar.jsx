'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
    const { toggleTheme, isDarkMode, accent = '#f97316', accentSoft = '#fff7ed', ...styles } = useTheme();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [openGroups, setOpenGroups] = useState({});
    const pathname = usePathname();

    const menuGroups = [
        {
            id: 'main',
            label: 'Main',
            items: [
                { id: 'dashboard', label: 'Overview', icon: '📊', path: '/' },
            ]
        },
        {
            id: 'management',
            label: 'Management',
            items: [
                { id: 'users', label: 'Users', icon: '👥', path: '/users' },
                { id: 'academies', label: 'Academies', icon: '🏫', path: '/academies' },
                { id: 'sports', label: 'Sports', icon: '⚽', path: '/sports' },
                { id: 'ageGroups', label: 'Age Groups', icon: '👶', path: '/ageGroups' },
                { id: 'batches', label: 'Batches', icon: '📚', path: '/batches' },
            ]
        },
        {
            id: 'activities',
            label: 'Activities',
            items: [
                { id: 'bookings', label: 'Bookings', icon: '📅', path: '/bookings' },
                { id: 'reviews', label: 'Reviews', icon: '⭐', path: '/reviews' },
                { id: 'reels', label: 'Reels & Highlights', icon: '🎬', path: '/reels' },
            ]
        },
        {
            id: 'communication',
            label: 'Communication',
            items: [
                { id: 'chat', label: 'Chat', icon: '💬', path: '/chat' },
                { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications' },
            ]
        },
        {
            id: 'system',
            label: 'System',
            items: [
                { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
                { id: 'roles', label: 'Role & Responsibilities', icon: '🛡️', path: '/roles' },
            ]
        },
    ];

    const toggleGroup = (groupId) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const isItemActive = (path) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    const isGroupOpen = (groupId) => {
        // Auto-open group if any item is active
        const group = menuGroups.find(g => g.id === groupId);
        const hasActiveItem = group?.items.some(item => isItemActive(item.path));
        return openGroups[groupId] !== undefined ? openGroups[groupId] : hasActiveItem;
    };

    const itemBaseStyle = {
        fontSize: '14px',
        padding: '12px 14px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color:'rgb(71, 85, 105)',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        marginLeft: '8px',
        position: 'relative',
    };

    return (
        <div style={{ 
            ...styles.sidebar, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
        }}>
            {/* Subtle overlay pattern for depth */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(30, 64, 175, 0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />
            <div style={{ ...styles.logo, position: 'relative', zIndex: 1 }}>
                <Image
                    src="/playasport_logo.jpg"
                    alt="Play A Sport Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>

            <nav style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                {menuGroups.map(group => {
                    const isOpen = isGroupOpen(group.id);
                    const hasActiveItem = group.items.some(item => isItemActive(item.path));

                    return (
                        <div key={group.id} style={{ marginBottom: '24px' }}>
                            {/* Group Header */}
                            <div
                                style={{
                                    ...(styles.menuGroupHeader || {}),
                                    color: hasActiveItem ? accent : ((styles.menuGroupHeader && styles.menuGroupHeader.color) || (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748b')),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    gap: '8px',
                                    padding: '12px 14px',
                                    borderRadius: '14px',
                                    background: isOpen ? accentSoft : 'transparent',
                                    boxShadow: isOpen ? '0 8px 24px rgba(249, 115, 22, 0.12)' : 'none',
                                }}
                                onClick={() => toggleGroup(group.id)}
                            >
                                <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'capitalize', letterSpacing: '0.6px' }}>
                                    {group.label}
                                </span>
                                {/* <span
                                    style={{
                                        fontSize: '10px',
                                        transition: 'transform 0.2s ease',
                                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: hasActiveItem ? accent : undefined,
                                        fontWeight: 700,
                                    }}
                                >
                                    {isOpen ? '▼' : '▶'}
                                </span> */}
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                           </div>

                            {/* Group Items */}
                            {isOpen && (
                                <div style={{ marginTop: '8px', paddingLeft: '0' }}>
                                    {group.items.map(item => {
                                        const isActive = isItemActive(item.path);

                                        return (
                                            <Link
                                                href={item.path}
                                                key={item.id}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div
                                                    style={{
                                                        ...itemBaseStyle,
                                                        ...(hoveredItem === item.id && !isActive ? {
                                                            background: '#f8fafc',
                                                            color: '#0f172a'
                                                        } : {}),
                                                        ...(isActive ? {
                                                            background: 'linear-gradient(90deg, #ffe7d6 0%, #fff 100%)',
                                                            color: '#ea580c',
                                                            boxShadow: '0 8px 20px rgba(249, 115, 22, 0.18)',
                                                            border: '1px solid #fed7aa'
                                                        } : {}),
                                                    }}
                                                    onMouseEnter={() => setHoveredItem(item.id)}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                >
                                                    <span style={{
                                                        width: '4px',
                                                        height: '20px',
                                                        borderRadius: '6px',
                                                        background: isActive ? '#ea580c' : 'transparent',
                                                        transition: 'background 0.2s ease'
                                                    }} />
                                                    <span style={{ fontSize: '16px', width: '20px', display: 'flex', justifyContent: 'center', color: isActive ? '#ea580c' : '#94a3b8' }}>{item.icon}</span>
                                                    <span style={{ color: isActive ? '#ea580c' : '#334155' }}>{item.label}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

        </div>
    );
}
