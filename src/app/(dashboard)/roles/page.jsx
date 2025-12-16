'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function RolesPage() {
    const styles = useTheme();

    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
            <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
                <h1 style={styles.header}>Roles & Responsibilities</h1>
                <p style={styles.text}>Manage roles and permissions here.</p>
            </div>
        </div>
    );
}
