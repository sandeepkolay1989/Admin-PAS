const darkTheme = {
    name: 'dark',
    // Layout
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
    },

    sidebar: {
        width: '260px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        padding: '20px 12px',
        color: '#ffffff',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15), 2px 0 8px rgba(0, 0, 0, 0.1), inset -1px 0 0 rgba(255, 255, 255, 0.05)',
        borderRight: '1px solid rgba(30, 64, 175, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },

    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '32px',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        height: '80px',
        minHeight: '80px',
        overflow: 'hidden',
        zIndex: 1,
        padding: '10px',
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 58, 138, 0.1) 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(30, 64, 175, 0.3)',
    },

    menuGroupHeader: {
        padding: '8px 16px',
        marginBottom: '8px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '16px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.2s ease',
        borderRadius: '6px',
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 58, 138, 0.05) 100%)',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    },

    navItem: {
        padding: '10px 16px',
        marginBottom: '2px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        color: 'rgba(255, 255, 255, 0.7)',
        background: 'transparent',
        border: 'none',
        fontSize: '14px',
        fontWeight: '100',
    },

    navItemHover: {
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(30, 58, 138, 0.1) 100%)',
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)',
    },

    navItemActive: {
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        color: '#ffffff',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.4), 0 2px 4px rgba(30, 64, 175, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },

    mainContent: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: '32px',
        overflowY: 'auto',
        position: 'relative',
    },

    // Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
    },

    // Headers
    header: {
        marginBottom: '30px',
    },

    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '8px',
        letterSpacing: '-0.02em',
    },

    subtitle: {
        color: '#c7ced8ff',
        fontSize: '15px',
    },

    // Stats
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },

    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
    },

    statValue: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '2px',
    },

    statLabel: {
        fontSize: '13px',
        color: '#64748b',
    },

    // Buttons
    button: {
        padding: '10px 20px',
        backgroundColor: '#1e40af',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)',
    },

    buttonDanger: {
        backgroundColor: '#ef4444',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
        color: 'white',
    },

    buttonSuccess: {
        backgroundColor: '#1e40af',
        boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)',
        color: 'white',
    },

    // Forms
    input: {
        width: '100%',
        padding: '10px 14px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },

    select: {
        width: '100%',
        padding: '10px 14px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },

    // Table
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },

    th: {
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        fontWeight: '600',
        color: '#64748b',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: '#f8fafc',
    },

    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        color: '#0f172a',
        fontSize: '14px',
    },

    // Badges
    badge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },

    badgeActive: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
        minWidth: '80px',
    },

    badgeInactive: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
        minWidth: '80px',
    },

    badgeConfirmed: {
        backgroundColor: '#1e40af',
        color: 'white',
        boxShadow: '0 0 10px rgba(30, 64, 175, 0.4)',
    },

    badgePending: {
        backgroundColor: '#f59e0b',
        color: 'white',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
    },

    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#0f172a',
    },

    // User Profile
    userProfile: {
        position: 'absolute',
        top: '20px',
        right: '30px',
        zIndex: 100,
        cursor: 'pointer',
    },

    avatar: {
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
        overflow: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '8px',
        width: '200px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
    },

    menuItem: {
        padding: '10px 15px',
        fontSize: '14px',
        color: '#0f172a',
        borderRadius: '6px',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
};

const lightTheme = {
    name: 'light',
    accent: '#f97316',
    accentSoft: '#fff7ed',
    // Layout
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc', // Very light gray for background
    },

    sidebar: {
        width: '260px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        padding: '20px 12px',
        color: '#1e293b',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.08), 2px 0 8px rgba(0, 0, 0, 0.05), inset -1px 0 0 rgba(0, 0, 0, 0.05)',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
    },

    logo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '32px',
        height: '80px',
        minHeight: '80px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        padding: '10px',
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 58, 138, 0.05) 100%)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(30, 64, 175, 0.2)',
    },

    menuGroupHeader: {
        padding: '8px 16px',
        marginBottom: '8px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#94a3b8',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.2s ease',
        borderRadius: '6px',
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(30, 58, 138, 0.03) 100%)',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },

    navItem: {
        padding: '10px 16px',
        marginBottom: '2px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        color: '#64748b',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: '500',
    },

    navItemHover: {
        background: '#f1f5f9',
        color: '#0f172a',
        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.15)',
    },

    navItemActive: {
        background: '#0ea5e9',
        color: '#ffffff',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
    },

    mainContent: {
        flex: 1,
        background: '#f8fafc',
        padding: '30px',
        overflowY: 'auto',
    },

    // Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 12px 34px rgba(0, 0, 0, 0.05)',
        border: '1px solid #edf2f7',
    },

    // Headers
    header: {
        marginBottom: '30px',
    },

    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '4px',
    },

    subtitle: {
        color: '#64748b',
        fontSize: '15px',
    },

    // Stats
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },

    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        border: '1px solid #f1f5f9',
        transition: 'all 0.3s ease',
    },

    statValue: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '2px',
    },

    statLabel: {
        fontSize: '14px',
        color: '#64748b',
    },

    // Buttons
    button: {
        padding: '10px 20px',
        backgroundColor: '#0ea5e9',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)',
    },

    buttonDanger: {
        backgroundColor: '#ef4444',
        color: 'white',
    },

    buttonSuccess: {
        backgroundColor: '#1e40af',
        color: 'white',
    },

    // Forms
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        transition: 'all 0.3s ease',
    },

    select: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // Table
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },

    th: {
        textAlign: 'left',
        padding: '16px',
        borderBottom: '1px solid #e2e8f0',
        fontWeight: '600',
        color: '#475569',
        fontSize: '14px',
        backgroundColor: '#f8fafc',
    },

    td: {
        padding: '16px',
        borderBottom: '1px solid #f1f5f9',
        color: '#334155',
        fontSize: '14px',
    },

    // Badges
    badge: {
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },

    badgeActive: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: '#dbeafe',
        color: '#1e3a5f',
        border: '1px solid #93c5fd',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(30, 64, 175, 0.1)',
        minWidth: '80px',
    },

    badgeInactive: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
        minWidth: '80px',
    },

    badgeConfirmed: {
        backgroundColor: '#dbeafe',
        color: '#1e3a5f',
    },

    badgePending: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
    },

    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: 'none',
    },

    modalTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#0f172a',
    },

    // User Profile
    userProfile: {
        position: 'absolute',
        top: '20px',
        right: '30px',
        zIndex: 100,
        cursor: 'pointer',
    },

    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#64748b',
        boxShadow: 'none',
        overflow: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '2px solid #ffffff',
    },

    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '4px',
        width: '200px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
    },

    menuItem: {
        padding: '10px 15px',
        fontSize: '14px',
        color: '#334155',
        borderRadius: '8px',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },


    // Login
    loginContainer: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
    },

    loginCard: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },

    loginTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#f8fafc',
        textAlign: 'center',
        marginBottom: '10px',
        background: 'linear-gradient(to right, #38bdf8, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },

    loginSubtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '20px',
    },

    loginInput: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        color: '#f1f5f9',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },

    loginButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        marginTop: '10px',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
    },

    errorMessage: {
        color: '#f87171',
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '5px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '8px',
        borderRadius: '8px',
    },
};

export const themes = { light: lightTheme, dark: darkTheme };
export const styles = darkTheme;
