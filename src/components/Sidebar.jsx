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

    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);

    const itemBaseStyle = {
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'left',
        gap: '4px',
        color: '#021633',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        marginLeft: '4px',
        position: 'relative',
        background: 'transparent',
        border: '1px solid rgba(0, 0, 0, 0.08)',
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
            <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ ...styles.logo, position: 'relative', zIndex: 1, cursor: 'pointer' }}>
                    <Image
                        src="/playasport_logo.jpg"
                        alt="Play A Sport Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </Link>

            <nav style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                {menuGroups.map(group => {
                    const isOpen = isGroupOpen(group.id);
                    const hasActiveItem = group.items.some(item => isItemActive(item.path)) || activeGroup === group.id;

                    return (
                        <div key={group.id} style={{ marginBottom: '0' }}>
                            {/* Group Header */}
                            <div
                                style={{
                                    ...(styles.menuGroupHeader || {}),
                                    color: (hasActiveItem || (hoveredGroup === group.id && !hasActiveItem)) ? '#ffffff' : ((styles.menuGroupHeader && styles.menuGroupHeader.color) || (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748b')),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    gap: '2px',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    background: hasActiveItem
                                        ? 'linear-gradient(90deg, #f97316 0%,rgb(245, 180, 112) 100%)'
                                        : (hoveredGroup === group.id
                                            ? 'linear-gradient(90deg, rgb(249, 115, 22) 0%, rgb(245, 180, 112) 100%)'
                                            : (isOpen ? accentSoft : 'transparent')),
                                    boxShadow: hasActiveItem
                                        ? '0 8px 18px rgba(249, 115, 22, 0.3)'
                                        : (hoveredGroup === group.id
                                            ? '0 4px 12px rgba(234, 177, 121, 0.35)'
                                            : (isOpen ? '0 8px 12px rgb(206, 169, 132)' : 'none')),
                                    border: hoveredGroup === group.id && !hasActiveItem
                                        ? '1px solid rgba(234, 177, 121, 0.5)'
                                        : '1px solid rgba(34, 30, 30, 0.08)',
                                    transform: hoveredGroup === group.id && !hasActiveItem ? 'translateX(4px)' : 'none',
                                }}
                                onClick={() => toggleGroup(group.id)}
                                onDoubleClick={() => setActiveGroup(group.id)}
                                onMouseEnter={() => setHoveredGroup(group.id)}
                                onMouseLeave={() => setHoveredGroup(null)}
                            >
                                <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize', letterSpacing: '0.6px' }}>
                                    {group.label}
                                </span>
                                <span
                                    aria-hidden="true"
                                    style={{
                                        fontSize: '10px',
                                        transition: 'transform 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: (hasActiveItem || (hoveredGroup === group.id && !hasActiveItem)) ? '#ffffff' : undefined,
                                        fontWeight: 700,
                                    }}
                                >
                                    {isOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6" />  
                                        </svg>
                                    )}
                                </span>
                           </div>

                            {/* Group Items */}
                            {isOpen && (
                                <div style={{ marginTop: '4px', paddingLeft: '0' }}>
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
                                                            background: 'linear-gradient(90deg, rgb(249, 115, 22) 0%, rgb(245, 180, 112) 100%)',
                                                            color: '#ffffff',
                                                            transform: 'translateX(4px)',
                                                            border: '1px solid rgba(234, 177, 121, 0.5)',
                                                            boxShadow: '0 4px 12px rgba(234, 177, 121, 0.35)',
                                                        } : {}),
                                                        ...(isActive ? {
                                                            background: 'linear-gradient(90deg, rgba(249, 116, 22, 0.76) 0%, rgb(245, 180, 112) 0%, 100%)',
                                                            color: '#0b3269',
                                                            boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25)',
                                                            border: '1px solid rgba(249, 115, 22, 0.3)',
                                                            fontWeight: 600,
                                                        } : {}),
                                                    }}
                                                    onMouseEnter={() => setHoveredItem(item.id)}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                >
                                                    <span style={{
                                                        width: '4px',
                                                        height: '20px',
                                                        borderRadius: '6px',
                                                        background: isActive ? '#f97316' : (hoveredItem === item.id ? '#ffffff' : 'transparent'),
                                                        transition: 'background 0.2s ease'
                                                    }} />
                                                    <span style={{ fontSize: '16px', width: '20px', display: 'flex', justifyContent: 'center', color: isActive ? '#0b3269' : (hoveredItem === item.id ? '#ffffff' : '#64748b') }}>{item.icon}</span>
                                                    <span style={{ color: isActive ? '#0b3269' : (hoveredItem === item.id ? '#ffffff' : '#475569') }}>{item.label}</span>
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
