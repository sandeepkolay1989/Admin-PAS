'use client';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Input({ type = 'text', placeholder, value, onChange, style, ...props }) {
    const styles = useTheme();
    return (
        <input
            style={{ ...styles.input, ...style }}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}
