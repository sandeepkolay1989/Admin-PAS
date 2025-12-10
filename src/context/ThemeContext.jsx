'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from '@/lib/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check localStorage for saved theme, default to 'dark'
    const [themeMode, setThemeMode] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('themeMode');
            if (savedTheme) {
                setThemeMode(savedTheme);
            }
        }
    }, []);

    // Update localStorage when theme changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('themeMode', themeMode);
        }
    }, [themeMode, mounted]);

    const toggleTheme = () => {
        setThemeMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const theme = themes[themeMode];
    const isDarkMode = themeMode === 'dark';

    // To avoid hydration mismatch, we renders the app with the default theme (dark) first.
    // If the user's preference is light, it will flicker to light after mount.
    // To avoid flicker we could hide it until mounted, but that hurts LCP.
    // Given this is an admin panel, a small flicker or just defaulting to dark is acceptable.
    // CRITICALLY: We MUST wrap children in ThemeContext.Provider even if not mounted, or if we decide to hide them.

    if (!mounted) {
        // Render with default context values to satisfy useTheme hooks in children
        return (
            <ThemeContext.Provider value={{ theme: themes['dark'], toggleTheme, isDarkMode: true, themeMode: 'dark' }}>
                <div style={{ visibility: 'hidden' }}>{children}</div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode, themeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return { ...context.theme, ...context };
};
