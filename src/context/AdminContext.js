'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // Admin Profile State
    const [adminProfile, setAdminProfile] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminProfile');
            return saved ? JSON.parse(saved) : { name: 'Admin User', avatar: '' };
        }
        return { name: 'Admin User', avatar: '' };
    });

    useEffect(() => {
        localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
    }, [adminProfile]);

    // Data states
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
    ]);

    const [academies, setAcademies] = useState([
        { id: 1, name: 'Elite Sports Academy', city: 'Mumbai', sport: 'Cricket', contact: '9876543210' },
        { id: 2, name: 'Champions Football Club', city: 'Delhi', sport: 'Football', contact: '9876543211' },
    ]);

    const [sports, setSports] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sports');
            return saved ? JSON.parse(saved) : [
                { id: 1, name: 'Cricket', icon: '🏏', image: '' },
                { id: 2, name: 'Football', icon: '⚽', image: '' },
                { id: 3, name: 'Basketball', icon: '🏀', image: '' },
            ];
        }
        return [
            { id: 1, name: 'Cricket', icon: '🏏', image: '' },
            { id: 2, name: 'Football', icon: '⚽', image: '' },
            { id: 3, name: 'Basketball', icon: '🏀', image: '' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('sports', JSON.stringify(sports));
    }, [sports]);

    const [ageGroups, setAgeGroups] = useState([
        { id: 1, name: 'Under 10', range: '6-10 years' },
        { id: 2, name: 'Under 15', range: '11-15 years' },
        { id: 3, name: 'Under 18', range: '16-18 years' },
    ]);

    const [batches, setBatches] = useState([
        { id: 1, academyId: 1, name: 'Morning Batch', days: 'Mon,Wed,Fri', startTime: '06:00', endTime: '08:00', capacity: 20, coach: 'Coach Sharma' },
        { id: 2, academyId: 1, name: 'Evening Batch', days: 'Tue,Thu,Sat', startTime: '17:00', endTime: '19:00', capacity: 15, coach: 'Coach Kumar' },
    ]);

    const [bookings, setBookings] = useState([
        { id: 1, userName: 'John Doe', academy: 'Elite Sports Academy', batch: 'Morning Batch', date: '2025-12-10', status: 'confirmed', amount: 5000 },
        { id: 2, userName: 'Jane Smith', academy: 'Champions Football Club', batch: 'Evening Batch', date: '2025-12-11', status: 'pending', amount: 3500 },
    ]);

    const [reviews, setReviews] = useState([
        { id: 1, userName: 'John Doe', academy: 'Elite Sports Academy', rating: 4.5, comment: 'Great coaching and facilities. My son loves it!', date: '2025-12-05', status: 'approved' },
        { id: 2, userName: 'Jane Smith', academy: 'Champions Football Club', rating: 5, comment: 'Excellent training program. Highly recommended!', date: '2025-12-04', status: 'approved' },
        { id: 3, userName: 'Bob Johnson', academy: 'Elite Sports Academy', rating: 4, comment: 'Good academy but could improve timing flexibility.', date: '2025-12-03', status: 'pending' },
    ]);

    const [notifications, setNotifications] = useState([
        { id: 1, type: 'system', message: 'System maintenance scheduled for tomorrow', date: '2025-12-06T10:00:00', read: false },
        { id: 2, type: 'booking', message: 'New booking received from John Doe', date: '2025-12-06T09:30:00', read: false },
        { id: 3, type: 'review', message: 'New 5-star review posted for Elite Sports Academy', date: '2025-12-05T18:00:00', read: true },
        { id: 4, type: 'academy', message: 'Champions Football Club updated their profile', date: '2025-12-05T15:00:00', read: true },
    ]);

    const [faqs, setFaqs] = useState([
        { id: 1, question: 'How do I book a session?', answer: 'You can book a session by selecting your preferred academy, choosing a batch, and completing the payment.' },
        { id: 2, question: 'What is the cancellation policy?', answer: 'Cancellations made 24 hours before the session are eligible for a full refund.' },
    ]);

    const [cmsContent, setCmsContent] = useState({
        about: 'Welcome to our sports academy platform. We connect aspiring athletes with the best training facilities.',
        terms: 'Terms and Conditions content goes here...',
        privacy: 'Privacy Policy content goes here...'
    });

    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'John Doe',
            type: 'user',
            online: true,
            lastMessage: 'When is my next session?',
            unread: 2,
            messages: [
                { id: 1, text: 'Hello, I have a question', sender: 'user', timestamp: '2025-12-06T10:00:00' },
                { id: 2, text: 'Sure, how can I help?', sender: 'admin', timestamp: '2025-12-06T10:01:00' },
                { id: 3, text: 'When is my next session?', sender: 'user', timestamp: '2025-12-06T10:02:00' },
            ]
        },
        {
            id: 2,
            name: 'Elite Sports Academy',
            type: 'academy',
            online: false,
            lastMessage: 'Thank you for the update',
            unread: 0,
            messages: [
                { id: 1, text: 'We updated our schedule', sender: 'academy', timestamp: '2025-12-05T14:00:00' },
                { id: 2, text: 'Thank you for the update', sender: 'admin', timestamp: '2025-12-05T14:05:00' },
            ]
        },
    ]);

    const [reels, setReels] = useState([
        {
            id: 1,
            title: 'Amazing Cricket Shot Compilation',
            description: 'Best cricket shots from our academy students',
            videoUrl: 'https://example.com/video1.mp4',
            thumbnail: '',
            category: 'highlight',
            views: 1250,
            likes: 89,
            uploadDate: '2025-12-01T00:00:00'
        },
        {
            id: 2,
            title: 'Football Training Drills',
            description: 'Professional football training techniques',
            videoUrl: 'https://example.com/video2.mp4',
            thumbnail: '',
            category: 'reel',
            views: 2100,
            likes: 156,
            uploadDate: '2025-12-03T00:00:00'
        },
    ]);

    const value = {
        adminProfile, setAdminProfile,
        users, setUsers,
        academies, setAcademies,
        sports, setSports,
        ageGroups, setAgeGroups,
        batches, setBatches,
        bookings, setBookings,
        reviews, setReviews,
        notifications, setNotifications,
        faqs, setFaqs,
        cmsContent, setCmsContent,
        chats, setChats,
        reels, setReels
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
