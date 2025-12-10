const darkTheme = {
    name: 'dark',
    // Layout
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0a0e1a',
    },

    sidebar: {
        width: '250px',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #0a0e1a 0%)',
        padding: '20px',
        color: '#ffffffff',
        boxShadow: '4px 0 20px rgba(76, 122, 144, 0.15)',
        borderRight: '1px solid rgba(189, 218, 231, 0.1)',
    },

    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#ffffffff',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
    },

    navItem: {
        padding: '8px 16px',
        marginBottom: '0px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease',
        color: '#ffffffff',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transform: 'scale(1)',
    },

    navItemHover: {
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateX(5px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },

    navItemActive: {
        background: 'linear-gradient(135deg, #050505ff 0%, #040404ff 100%)',
        color: '#ffffffff',
        fontWeight: '600',
        boxShadow: '0 4px 20px rgba(4, 58, 84, 0.4), 0 0 30px rgba(4, 55, 77, 0.2)',
        border: '1px solid rgba(4, 55, 77, 0.3)',
        transform: 'scale(1.02)',
    },

    mainContent: {
        flex: 1,
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0a0e1a 50%, #0a0e1a 100%)',
        padding: '30px',
        overflowY: 'auto',
    },

    // Cards
    card: {
        backgroundColor: 'rgba(10, 14, 26, 0.6)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(10, 14, 26, 0.2)',
        border: '1px solid rgba(10, 14, 26, 0.15)',
        backdropFilter: 'blur(10px)',
    },

    // Headers
    header: {
        marginBottom: '30px',
    },

    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#f1f5f9',
        marginBottom: '8px',
        textShadow: '0 2px 10px rgba(56, 189, 248, 0.2)',
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
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3), 0 0 1px rgba(56, 189, 248, 0.3)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
    },

    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#38bdf8',
        marginBottom: '4px',
        textShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
    },

    statLabel: {
        fontSize: '14px',
        color: '#94a3b8',
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
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4), 0 0 20px rgba(14, 165, 233, 0.2)',
    },

    buttonDanger: {
        backgroundColor: '#ef4444',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
        color: 'white',
    },

    buttonSuccess: {
        backgroundColor: '#10b981',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
        color: 'white',
    },

    // Forms
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        color: '#e2e8f0',
        transition: 'all 0.3s ease',
    },

    select: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        color: '#e2e8f0',
        transition: 'all 0.3s ease',
    },

    // Table
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid rgba(56, 189, 248, 0.3)',
        fontWeight: '600',
        color: '#38bdf8',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
        color: '#cbd5e1',
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
        backgroundColor: '#10b981',
        color: 'white',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
    },

    badgeInactive: {
        backgroundColor: '#ef4444',
        color: 'white',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
    },

    badgeConfirmed: {
        backgroundColor: '#10b981',
        color: 'white',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
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
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modal: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 2px rgba(56, 189, 248, 0.4)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        backdropFilter: 'blur(20px)',
    },

    modalTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#f1f5f9',
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
        backgroundColor: '#38bdf8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '8px',
        width: '200px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        flexDirection: 'column',
    },

    menuItem: {
        padding: '10px 15px',
        fontSize: '14px',
        color: '#f1f5f9',
        borderRadius: '8px',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
};

const lightTheme = {
    name: 'light',
    // Layout
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#e0f2fe',
    },

    sidebar: {
        width: '250px',
        background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 100%)',
        padding: '20px',
        color: '#0c4a6e',
        boxShadow: '4px 0 12px rgba(14, 165, 233, 0.3)',
    },

    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#0c4a6e',
        textAlign: 'center',
    },

    navItem: {
        padding: '8px 16px',
        marginBottom: '4px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease',
        color: '#0c4a6e',
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        transform: 'scale(1)',
    },

    navItemHover: {
        background: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateX(5px)',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
    },

    navItemActive: {
        background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
        color: '#ffffff',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4), 0 2px 4px rgba(14, 165, 233, 0.3)',
        transform: 'scale(1.02)',
    },

    mainContent: {
        flex: 1,
        background: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)',
        padding: '30px',
        overflowY: 'auto',
    },

    // Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 8px 16px rgba(14, 165, 233, 0.15), 0 2px 4px rgba(56, 189, 248, 0.1)',
        border: '1px solid rgba(14, 165, 233, 0.2)',
    },

    // Headers
    header: {
        marginBottom: '30px',
    },

    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#0c4a6e',
        marginBottom: '8px',
    },

    subtitle: {
        color: '#0369a1',
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
        padding: '24px',
        boxShadow: '0 6px 12px rgba(14, 165, 233, 0.15), 0 2px 4px rgba(56, 189, 248, 0.1)',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        transition: 'all 0.3s ease',
    },

    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#0c4a6e',
        marginBottom: '4px',
    },

    statLabel: {
        fontSize: '14px',
        color: '#0369a1',
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
        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
    },

    buttonDanger: {
        backgroundColor: '#f87171',
        color: 'white',
    },

    buttonSuccess: {
        backgroundColor: '#34d399',
        color: 'white',
    },

    // Forms
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#f0f9ff',
        color: '#0c4a6e',
        transition: 'all 0.3s ease',
    },

    select: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#f0f9ff',
        color: '#0c4a6e',
        transition: 'all 0.3s ease',
    },

    // Table
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid rgba(14, 165, 233, 0.3)',
        fontWeight: '600',
        color: '#0c4a6e',
        fontSize: '14px',
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid rgba(14, 165, 233, 0.15)',
        color: '#0369a1',
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
        backgroundColor: '#34d399',
        color: 'white',
    },

    badgeInactive: {
        backgroundColor: '#f87171',
        color: 'white',
    },

    badgeConfirmed: {
        backgroundColor: '#34d399',
        color: 'white',
    },

    badgePending: {
        backgroundColor: '#fbbf24',
        color: 'white',
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(14, 165, 233, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(14, 165, 233, 0.25), 0 8px 16px rgba(56, 189, 248, 0.2)',
        border: '1px solid rgba(14, 165, 233, 0.3)',
    },

    modalTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#0c4a6e',
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
        backgroundColor: '#0ea5e9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '8px',
        width: '200px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        display: 'flex',
        flexDirection: 'column',
    },

    menuItem: {
        padding: '10px 15px',
        fontSize: '14px',
        color: '#0c4a6e',
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
