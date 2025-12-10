'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            <div style={{ ...styles.logo, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '100%', height: '60px' }}>
                    <Image
                        src="/logo.jpg"
                        alt="Play A Sport Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </div>
            <nav>
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

                <button
                    onClick={toggleTheme}
                    style={{
                        ...styles.navItem,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'transparent',
                        color: styles.sidebar.color,
                        marginTop: '4px', // Standard margin between items
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: '8px 16px',
                    }}
                    onMouseEnter={() => setHoveredItem('theme')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <span style={{ fontSize: '18px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </nav>
        </div>
    );
}
