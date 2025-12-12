'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { CalendarRange, Eye, DownloadCloud } from 'lucide-react';

export default function BookingsPage() {
    const { bookings, setBookings, batches } = useAdmin();
    const styles = useTheme();

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('All Payment Mode');
    const [selectedBatch, setSelectedBatch] = useState('All Batches');

    // Stats Calculations
    const totalBookings = bookings.length;
    const totalEarnings = bookings
        .filter(b => b.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = bookings
        .filter(b => b.status === 'pending')
        .reduce((acc, curr) => acc + curr.amount, 0);
    const failedPayments = bookings.filter(b => b.status === 'failed').length;

    // Filters
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus.toLowerCase();
        const matchesSearch = booking.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPaymentMode = selectedPaymentMode === 'All Payment Mode' || booking.paymentMode === selectedPaymentMode;
        const matchesBatch = selectedBatch === 'All Batches' || booking.batch === selectedBatch;

        return matchesStatus && matchesSearch && matchesPaymentMode && matchesBatch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'paid':
                return { backgroundColor: '#22c55e', color: 'white' };
            case 'pending':
                return { backgroundColor: '#f59e0b', color: 'white' };
            case 'failed':
                return { backgroundColor: '#ef4444', color: 'white' };
            default:
                return { backgroundColor: '#64748b', color: 'white' };
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div style={styles.mainContent}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h1 style={styles.title}>Booking Management</h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Manage bookings, payments, and invoices</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatsCard title="Total Bookings" value={totalBookings} styles={styles} />
                <StatsCard title="Total Earnings" value={formatCurrency(totalEarnings)} valueColor="#22c55e" styles={styles} />
                <StatsCard title="Pending Amount" value={formatCurrency(pendingAmount)} valueColor="#f59e0b" styles={styles} />
                <StatsCard title="Failed Payments" value={failedPayments} valueColor="#ef4444" styles={styles} />
            </div>

            {/* Filter Bar */}
            <div style={styles.card} style={{ ...styles.card, padding: '15px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Search bookings by invoice ID"
                    style={{ ...styles.input, width: '100%', marginBottom: 0, backgroundColor: '#f8fafc' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                        {['All', 'Paid', 'Pending', 'Failed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    backgroundColor: filterStatus === status ? 'white' : 'transparent',
                                    color: filterStatus === status ? '#0f172a' : '#64748b',
                                    fontWeight: filterStatus === status ? 'bold' : 'normal',
                                    boxShadow: filterStatus === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <select
                        style={{ ...styles.select, width: 'auto', marginBottom: 0 }}
                        value={selectedPaymentMode}
                        onChange={(e) => setSelectedPaymentMode(e.target.value)}
                    >
                        <option>All Payment Mode</option>
                        <option>Online</option>
                        <option>Cash</option>
                        <option>UPI</option>
                    </select>

                    <select
                        style={{ ...styles.select, width: 'auto', marginBottom: 0 }}
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option>All Batches</option>
                        {Array.from(new Set(bookings.map(b => b.batch))).map(b => <option key={b}>{b}</option>)}
                    </select>

                    <button style={{ ...styles.button, backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CalendarRange size={16} /> Pick a date range
                    </button>
                </div>
            </div>

            {/* Table Header & Export */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>All Bookings</h2>
                <button style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <DownloadCloud size={16} /> Export
                </button>
            </div>

            {/* Bookings Table */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Invoice ID</th>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Student</th>
                            <th style={styles.th}>Batch</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Payment</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td style={{ ...styles.td, color: '#f97316', fontWeight: '500' }}>{booking.invoiceId}</td>
                                <td style={styles.td}>{booking.userName}</td>
                                <td style={styles.td}>{booking.studentName}</td>
                                <td style={styles.td}>{booking.batch}</td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{formatCurrency(booking.amount)}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize',
                                        ...getStatusStyle(booking.status)
                                    }}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td style={styles.td}>{booking.paymentMode}</td>
                                <td style={styles.td}>{booking.date}</td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px', color: '#64748b', fontSize: '16px' }}>
                                        <span style={{ cursor: 'pointer' }}><Eye size={16} /></span>
                                        <span style={{ cursor: 'pointer' }}><DownloadCloud size={16} /></span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: styles.subtitle.color }}>
                        No bookings found matching criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ title, value, valueColor, styles }) {
    return (
        <div style={{ ...styles.card, padding: '20px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>{title}</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: valueColor || '#1e293b' }}>{value}</h2>
        </div>
    );
}
