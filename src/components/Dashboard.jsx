'use client';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard({ users = [], academies = [], sports = [], bookings = [] }) {
    const styles = useTheme();
    const accent = styles.accent || '#f97316';
    const accentSoft = styles.accentSoft || '#fff7ed';

    // Calculate statistics
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

    // Calculate earnings
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    }).reduce((sum, b) => sum + (b.amount || 0), 0);

    const weeklyAttendance = [88, 82, 90, 87, 93, 75, 68];

    // Get recent bookings (last 5)
    const recentBookings = [...bookings].slice(0, 5);

    // Quick stats for popular sports
    const sportStats = sports.map(sport => {
        const academyCount = academies.filter(a => a.sport === sport.name).length;
        return { ...sport, academyCount };
    });

    // Modern stat card component with theme support
    const ModernStatCard = ({ icon, value, label, change, bgColor, badge }) => (
        <div style={{
            ...styles.statCard,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = styles.navItemActive.boxShadow;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#0f172a',
                }}>
                    {icon}
                </div>
                {change && (
                    <div style={{
                        color: change.startsWith('+') ? '#10b981' : '#ef4444',
                        fontSize: '15px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span>{change.startsWith('+') ? '↗' : '↘'}</span>
                        <span>{change}</span>
                    </div>
                )}
            </div>
            <div>
                <div style={styles.statValue}>
                    {value}
                </div>
                <div style={styles.statLabel}>{label}</div>
            </div>
            {badge && (
                <div style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    background: accentSoft,
                    color: accent,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px'
                }}>
                    <span style={{ fontSize: '14px' }}>⬆</span> {badge}
                </div>
            )}
        </div>
    );

    const buildLinePath = (data) => {
        if (!data.length) return '';
        const max = Math.max(...data);
        const min = Math.min(...data);
        return data.map((value, idx) => {
            const x = (idx / (data.length - 1 || 1)) * 100;
            const y = 100 - (((value - min) / ((max - min) || 1)) * 80 + 10);
            return `${idx === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(' ');
    };

    const attendancePath = buildLinePath(weeklyAttendance);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={styles.title}>
                    Good Afternoon, Admin!
                </h1>
                <p style={styles.subtitle}>
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
                marginBottom: '24px'
            }}>
                <ModernStatCard
                    icon="👤"
                    value={users.length.toLocaleString()}
                    label="Total Users"
                    change="+12%"
                    bgColor="#e0f2fe"
                    badge="Growth"
                />
                <ModernStatCard
                    icon="₹"
                    value={`₹${totalEarnings.toLocaleString('en-IN')}`}
                    label="Total Earnings"
                    change="+8%"
                    bgColor="#fff3e8"
                />
                <ModernStatCard
                    icon="🕥"
                    value={bookings.length.toLocaleString()}
                    label="Bookings"
                    change="+15%"
                    bgColor="#fff7ed"
                />
                <ModernStatCard
                    icon="🏟️"
                    value={academies.length}
                    label="Active Academies"
                    change="+3%"
                    bgColor="#e0f2fe"
                />
                <ModernStatCard
                    icon="🏀"
                    value={sports.length}
                    label="Sports"
                    change="+10%"
                    bgColor="#fef9c3"
                />
                <ModernStatCard
                    icon="🌟"
                    value="4.8"
                    label="Reviews"
                    change="+0.2"
                    bgColor="#e0f2fe"
                />
            </div>

            {/* Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>

                {/* Recent Bookings Card */}
                <div style={styles.card}>
                    <h3 style={{ ...styles.subtitle, margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '18px', color: styles.title.color }}>
                        Recent Bookings
                    </h3>
                    {recentBookings.length > 0 ? (
                        <div>
                            {recentBookings.map((booking, index) => (
                                <div
                                    key={booking.id}
                                    style={{
                                        padding: '16px 0',
                                        borderBottom: index < recentBookings.length - 1 ? styles.td.borderBottom : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px', color: styles.title.color }}>
                                            {booking.userName}
                                        </div>
                                        <div style={{ fontSize: '13px', color: styles.subtitle.color }}>
                                            {/* Guard against missing academy/batch to avoid runtime errors */}
                                            {(booking?.academy || '').split(' ')[0] || 'N/A'} • {(booking?.batch || '').split(' ')[0] || 'N/A'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', color: styles.subtitle.color, marginBottom: '6px' }}>
                                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <span style={{
                                            ...styles.badge,
                                            ...(booking.status === 'confirmed' ? styles.badgeConfirmed : styles.badgePending),
                                            textTransform: 'capitalize'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: styles.subtitle.color, textAlign: 'center', padding: '20px' }}>No bookings yet</p>
                    )}
                </div>

                {/* Sports Overview Card */}
                <div style={styles.card}>
                    <h3 style={{ ...styles.subtitle, margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '18px', color: styles.title.color }}>
                        Sports Overview
                    </h3>
                    <div>
                        {sportStats.map((sport) => (
                            <div
                                key={sport.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 0',
                                    borderBottom: styles.td.borderBottom
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>{sport.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: '600', color: styles.title.color }}>{sport.name}</div>
                                        <div style={{ fontSize: '12px', color: styles.subtitle.color }}>Active sport</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: styles.statValue.color,
                                        marginBottom: '2px'
                                    }}>
                                        {sport.academyCount}
                                    </div>
                                    <div style={{ fontSize: '12px', color: styles.subtitle.color }}>Academies</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Earnings */}
            <div style={styles.card}>
                <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: styles.title.color
                }}>
                    Monthly Earnings
                </h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '12px',
                    height: '220px',
                    padding: '10px 0'
                }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                        const heights = [45, 55, 48, 65, 58, 72];
                        return (
                            <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${heights[index]}%`,
                                    background: accent,
                                    borderRadius: '10px 10px 4px 4px',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 8px 16px rgba(249, 115, 22, 0.25)'
                                }}></div>
                                <div style={{ fontSize: '12px', color: styles.subtitle.color, fontWeight: '600' }}>{month}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
