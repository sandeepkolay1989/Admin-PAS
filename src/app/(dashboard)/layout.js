'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import UserProfile from '@/components/UserProfile';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';

// Inner component to use existing hooks
function DashboardLayoutInner({ children }) {
    const styles = useTheme();
    // We can get profile from useAdmin now
    const { adminProfile, setAdminProfile } = useAdmin();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // In Next.js, we would redirect.
            alert('Logout (Demo)');
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.mainContent}>
                <UserProfile
                    profile={adminProfile}
                    onUpdateProfile={setAdminProfile}
                    onLogout={handleLogout}
                    onChangePassword={() => alert('Change Password Demo')}
                />
                {children}
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    return (
        <AdminProvider>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </AdminProvider>
    );
}
