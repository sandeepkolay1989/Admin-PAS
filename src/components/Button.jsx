'use client';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Button({ variant = 'primary', onClick, children, style, ...props }) {
    const styles = useTheme();
    const getVariantStyle = () => {
        switch (variant) {
            case 'danger':
                return styles.buttonDanger;
            case 'success':
                return styles.buttonSuccess;
            case 'secondary':
                return { backgroundColor: '#666' };
            default:
                return {};
        }
    };

    return (
        <button
            style={{ ...styles.button, ...getVariantStyle(), ...style }}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
