'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function RolesPage() {
    const styles = useTheme();

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={styles.header}>Roles & Responsibilities</h1>
            <p style={styles.text}>Manage roles and permissions here.</p>
        </div>
    );
}
