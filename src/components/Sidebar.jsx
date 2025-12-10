'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
    const { toggleTheme, isDarkMode, ...styles } = useTheme();
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
                                    color: hasActiveItem ? '#ffffff' : ((styles.menuGroupHeader && styles.menuGroupHeader.color) || 'rgba(255, 255, 255, 0.5)'),
                                }}
                                onClick={() => toggleGroup(group.id)}
                            >
                                <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {group.label}
                                </span>
                                <span
                                    style={{
                                        fontSize: '12px',
                                        transition: 'transform 0.2s ease',
                                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    ▶
                                </span>
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
                                                        ...styles.navItem,
                                                        ...(hoveredItem === item.id && !isActive ? styles.navItemHover : {}),
                                                        ...(isActive ? styles.navItemActive : {}),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        marginLeft: '8px',
                                                    }}
                                                    onMouseEnter={() => setHoveredItem(item.id)}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                >
                                                    <span style={{ fontSize: '16px', width: '20px', display: 'flex', justifyContent: 'center' }}>{item.icon}</span>
                                                    <span>{item.label}</span>
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

            <div style={{ paddingTop: '20px', borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, position: 'relative', zIndex: 1 }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        ...styles.navItem,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.6)',
                        color: styles.sidebar.color,
                        marginTop: 0
                    }}
                >
                    <span style={{ fontSize: '18px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </div>
    );
}
