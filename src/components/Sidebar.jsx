'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
    const { toggleTheme, isDarkMode, ...styles } = useTheme();
    const [hoveredItem, setHoveredItem] = useState(null);
    const pathname = usePathname();

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: '📊', path: '/' },
        { id: 'users', label: 'Users', icon: '👥', path: '/users' },
        { id: 'academies', label: 'Academies', icon: '🏫', path: '/academies' },
        { id: 'sports', label: 'Sports', icon: '⚽', path: '/sports' },
        { id: 'ageGroups', label: 'Age Groups', icon: '👶', path: '/ageGroups' },
        { id: 'batches', label: 'Batches', icon: '📚', path: '/batches' },
        { id: 'bookings', label: 'Bookings', icon: '📅', path: '/bookings' },
        { id: 'reviews', label: 'Reviews', icon: '⭐', path: '/reviews' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
        { id: 'chat', label: 'Chat', icon: '💬', path: '/chat' },
        { id: 'reels', label: 'Reels & Highlights', icon: '🎬', path: '/reels' },
    ];

    return (
        <div style={{ ...styles.sidebar, display: 'flex', flexDirection: 'column' }}>
            <div style={styles.logo}>⚡ Admin Panel</div>
            <nav style={{ flex: 1 }}>
                {menuItems.map(item => {
                    // Check if active. For dashboard '/', exact match. For others, startsWith
                    const isActive = item.path === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.path);

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
                                    gap: '12px'
                                }}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div style={{ paddingTop: '20px', borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
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
