'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function UserProfile({ profile, onUpdateProfile, onLogout, onChangePassword }) {
    const styles = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

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

    return (
        <div style={styles.userProfile} ref={dropdownRef}>
            <div
                style={{
                    ...styles.avatar,
                    backgroundImage: profile && profile.avatar ? `url(${profile.avatar})` : 'none',
                    cursor: 'pointer'
                }}
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
                        <span>📷</span> Add/Change Logo
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
                        <span>🔒</span> Change Password
                    </div>

                    <div
                        style={{ ...styles.menuItem, color: '#ef4444' }}
                        onClick={onLogout}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span>🚪</span> Logout
                    </div>
                </div>
            )}
        </div>
    );
}
