'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Camera, Lock, Sun, Moon, LogOut } from 'lucide-react';

export default function UserProfile({ profile, onUpdateProfile, onLogout, onChangePassword }) {
    const styles = useTheme();
    const { toggleTheme, isDarkMode } = styles;
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Avoid any SSR/client mismatch by only rendering after mount
    if (!hasMounted) {
        return null;
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateProfile({ ...profile, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Stable avatar style; only backgroundImage varies with avatar
    const hasAvatar = Boolean(profile && profile.avatar);
    const avatarUrl = hasAvatar ? String(profile.avatar) : '';

    const avatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: 'white',
        boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)',
        cursor: 'pointer',
        backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
        backgroundSize: avatarUrl ? 'cover' : 'auto',
        backgroundPosition: 'center',
        overflow: 'hidden'
    };

    return (
        <div style={styles.userProfile} ref={dropdownRef}>
            <div
                style={avatarStyle}
                onClick={() => setIsOpen(!isOpen)}
            >
                {!(profile && profile.avatar) && (profile && profile.name ? profile.name.charAt(0).toUpperCase() : 'A')}
            </div>

            {isOpen && (
                <div style={styles.dropdownMenu}>
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '5px' }}>
                        <div style={{ fontWeight: 'bold', color: styles.modalTitle.color }}>{profile ? profile.name : 'Admin'}</div>
                        <div style={{ fontSize: '12px', color: styles.subtitle.color }}>admin@example.com</div>
                    </div>

                    <div
                        style={styles.menuItem}
                        onClick={() => fileInputRef.current.click()}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Camera size={16} />
                        </span> Add/Change Logo
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div
                        style={styles.menuItem}
                        onClick={() => { setIsOpen(false); onChangePassword && onChangePassword(); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Lock size={16} />
                        </span> Change Password
                    </div>

                    <div
                        style={styles.menuItem}
                        onClick={() => { toggleTheme(); setIsOpen(false); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </span> {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </div>

                    <div
                        style={{ ...styles.menuItem, color: '#ef4444' }}
                        onClick={onLogout}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <LogOut size={16} />
                        </span> Logout
                    </div>
                </div>
            )}
        </div>
    );
}
