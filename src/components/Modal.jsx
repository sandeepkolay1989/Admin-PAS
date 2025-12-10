'use client';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Modal({ show, onClose, title, children }) {
    const styles = useTheme();
    if (!show) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.modalTitle}>{title}</h2>
                {children}
            </div>
        </div>
    );
}
