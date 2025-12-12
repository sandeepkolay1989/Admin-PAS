'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Pencil, Trash2, X, HelpCircle, Search, Upload } from 'lucide-react';

export default function AcademiesPage() {
    const { academies, setAcademies, sports } = useAdmin();
    const styles = useTheme();
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showAcademyModal, setShowAcademyModal] = useState(false);
    const [editingAcademy, setEditingAcademy] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [academyForm, setAcademyForm] = useState({
        centerName: '',
        phoneNumber: '',
        email: '',
        rules: [],
        newRule: '',
        logo: null,
        logoPreview: '',
        minimumAge: '',
        maximumAge: '',
        facilities: [],
        facilitySearch: '',
        addressLineOne: '',
        addressLineTwo: '',
        state: '',
        city: '',
        pincode: '',
        selectedSports: [],
        media: [],
        callTimeFrom: '',
        callTimeTo: '',
        timings: [],
        paymentMethod: '',
        accountPersonName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        name: '',
        ownerName: '',
        sport: '',
        contact: '',
        addedBy: 'Admin',
        createDate: new Date().toISOString().split('T')[0],
        status: 'active'
    });
    const [ifscError, setIfscError] = useState('');

    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'location', label: 'Location' },
        { id: 'sports', label: 'Sports' },
        { id: 'media', label: 'Media' },
        { id: 'timings', label: 'Timings' },
        { id: 'banking', label: 'Banking' }
    ];

    const toggleStatus = (id) => {
        const target = academies.find(a => a.id === id);
        if (!target) return;
        const nextStatus = target.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({
            id,
            nextStatus,
            message: `Change status to "${nextStatus}"? Please confirm to complete the change.`
        });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const { id, nextStatus } = confirmModal;
        setAcademies(academies.map(academy =>
            academy.id === id ? { ...academy, status: nextStatus } : academy
        ));
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const renderConfirmModal = () => {
        if (!confirmModal) return null;
        return (
            <div style={styles.modalOverlay}>
                <div style={{ ...styles.modal, maxWidth: '420px', textAlign: 'center', position: 'relative', paddingTop: '52px' }}>
                    <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'block',
                        width: '32px',
                        height: '32px',
                        pointerEvents: 'none',
                        color: '#f97316'
                    }}>
                        <HelpCircle size={32} />
                    </span>
                    <button
                        onClick={handleCancelStatus}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'none',
                            border: 'none',
                            fontSize: '0px',
                            cursor: 'pointer',
                            color: '#0f172a',
                            padding: 0,
                            lineHeight: 1
                        }}
                        aria-label="Close"
                    >
                        <X size={18} color="#0f172a" />
                    </button>
                    <h3 style={{ margin: '0 0 12px 0', color: '#f97316', fontWeight: 700 }}>Are You Sure?</h3>
                    <p style={{ color: '#242222', marginBottom: '20px' }}>
                        Do you want to change this status to <span style={{ color: '#f97316', fontWeight: 700 }}>{confirmModal.nextStatus || 'Inactive'}</span>?
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                            onClick={handleCancelStatus}
                            style={{ ...styles.button, backgroundColor: '#f97316', color: '#ffffff' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmStatus}
                            style={{
                                ...styles.buttonSuccess,
                                background: 'linear-gradient(135deg, #023B84 0%, #023B84 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
                                padding: '10px 18px',
                                cursor: 'pointer'
                            }}
                        >
                            Yes, Do It.
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this academy?')) {
            setAcademies(academies.filter(a => a.id !== id));
        }
    };

    const validateIFSC = (ifsc) => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc.toUpperCase());
    };

    const handleIFSCChange = (value) => {
        const upperValue = value.toUpperCase();
        setAcademyForm({ ...academyForm, ifscCode: upperValue });
        if (upperValue.length === 11) {
            if (validateIFSC(upperValue)) {
                setIfscError('');
            } else {
                setIfscError('Invalid IFSC code format. Format: AAAA0XXXXXX');
            }
        } else if (upperValue.length > 0) {
            setIfscError('');
        } else {
            setIfscError('');
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size should be less than 5MB');
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAcademyForm({
                        ...academyForm,
                        logo: file,
                        logoPreview: reader.result
                    });
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload only JPG or PNG files');
            }
        }
    };

    const handleAddRule = () => {
        if (academyForm.newRule.trim() && academyForm.newRule.length <= 500) {
            setAcademyForm({
                ...academyForm,
                rules: [...academyForm.rules, academyForm.newRule.trim()],
                newRule: ''
            });
        }
    };

    const handleRemoveRule = (index) => {
        setAcademyForm({
            ...academyForm,
            rules: academyForm.rules.filter((_, i) => i !== index)
        });
    };

    const handleAddFacility = (facilityName) => {
        const trimmedName = facilityName.trim();
        if (trimmedName && !academyForm.facilities.includes(trimmedName)) {
            setAcademyForm({
                ...academyForm,
                facilities: [...academyForm.facilities, trimmedName],
                facilitySearch: ''
            });
        }
    };

    const handleRemoveFacility = (facilityName) => {
        setAcademyForm({
            ...academyForm,
            facilities: academyForm.facilities.filter(f => f !== facilityName)
        });
    };

    const handleSportToggle = (sportId) => {
        const isSelected = academyForm.selectedSports.includes(sportId);
        setAcademyForm({
            ...academyForm,
            selectedSports: isSelected
                ? academyForm.selectedSports.filter(id => id !== sportId)
                : [...academyForm.selectedSports, sportId]
        });
    };

    const handleAddAcademy = () => {
        setEditingAcademy(null);
        setActiveTab('basic');
        setIfscError('');
        setAcademyForm({
            centerName: '',
            phoneNumber: '',
            email: '',
            rules: [],
            newRule: '',
            logo: null,
            logoPreview: '',
            minimumAge: '',
            maximumAge: '',
            facilities: [],
            facilitySearch: '',
            addressLineOne: '',
            addressLineTwo: '',
            state: '',
            city: '',
            pincode: '',
            selectedSports: [],
            media: [],
            callTimeFrom: '',
            callTimeTo: '',
            timings: [],
            paymentMethod: '',
            accountPersonName: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            name: '',
            ownerName: '',
            sport: '',
            contact: '',
            addedBy: 'Admin',
            createDate: new Date().toISOString().split('T')[0],
            status: 'active'
        });
        setShowAcademyModal(true);
    };

    const handleEditAcademy = (academy) => {
        setEditingAcademy(academy);
        setActiveTab('basic');
        setIfscError('');
        setAcademyForm({
            centerName: academy.centerName || academy.academyName || academy.name || '',
            phoneNumber: academy.phoneNumber || academy.mobileNumber || academy.contact || '',
            email: academy.email || '',
            rules: academy.rules || [],
            newRule: '',
            logo: null,
            logoPreview: academy.logoPreview || academy.logo || '',
            minimumAge: academy.minimumAge || '',
            maximumAge: academy.maximumAge || '',
            facilities: academy.facilities || [],
            facilitySearch: '',
            addressLineOne: academy.addressLineOne || '',
            addressLineTwo: academy.addressLineTwo || '',
            state: academy.state || '',
            city: academy.city || '',
            pincode: academy.pincode || '',
            selectedSports: academy.selectedSports || (academy.sport ? [academy.sport] : []),
            media: academy.media || [],
            callTimeFrom: academy.callTimeFrom || '',
            callTimeTo: academy.callTimeTo || '',
            timings: academy.timings || [],
            paymentMethod: academy.paymentMethod || '',
            accountPersonName: academy.accountPersonName || '',
            bankName: academy.bankName || '',
            accountNumber: academy.accountNumber || '',
            ifscCode: academy.ifscCode || '',
            name: academy.name || '',
            ownerName: academy.ownerName || '',
            sport: academy.sport || '',
            contact: academy.contact || '',
            addedBy: academy.addedBy || 'Admin',
            createDate: academy.createDate || new Date().toISOString().split('T')[0],
            status: academy.status || 'active'
        });
        setShowAcademyModal(true);
    };

    const handleCloseAcademyModal = () => {
        setShowAcademyModal(false);
        setEditingAcademy(null);
        setActiveTab('basic');
        setIfscError('');
        setAcademyForm({
            centerName: '',
            phoneNumber: '',
            email: '',
            rules: [],
            newRule: '',
            logo: null,
            logoPreview: '',
            minimumAge: '',
            maximumAge: '',
            facilities: [],
            facilitySearch: '',
            addressLineOne: '',
            addressLineTwo: '',
            state: '',
            city: '',
            pincode: '',
            selectedSports: [],
            media: [],
            callTimeFrom: '',
            callTimeTo: '',
            timings: [],
            paymentMethod: '',
            accountPersonName: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            name: '',
            ownerName: '',
            sport: '',
            contact: '',
            addedBy: 'Admin',
            createDate: new Date().toISOString().split('T')[0],
            status: 'active'
        });
    };

    const handleSaveAcademy = () => {
        if (!academyForm.centerName || !academyForm.phoneNumber || !academyForm.email) {
            alert('Please fill in all required Basic fields (Center Name, Phone Number, Email)');
            setActiveTab('basic');
            return;
        }
        if (academyForm.ifscCode && !validateIFSC(academyForm.ifscCode)) {
            alert('Please enter a valid IFSC code');
            setActiveTab('banking');
            return;
        }

        const academyData = {
            ...academyForm,
            name: academyForm.centerName,
            academyName: academyForm.centerName,
            ownerName: academyForm.centerName,
            email: academyForm.email,
            contact: academyForm.phoneNumber,
            mobileNumber: academyForm.phoneNumber,
            city: academyForm.city,
            sport: academyForm.selectedSports.length > 0 ? academyForm.selectedSports.join(', ') : '',
            addedBy: academyForm.addedBy || 'Admin',
            createDate: academyForm.createDate || new Date().toISOString().split('T')[0],
            status: academyForm.status || 'active'
        };

        if (editingAcademy) {
            setAcademies(academies.map(academy =>
                academy.id === editingAcademy.id
                    ? { ...academy, ...academyData }
                    : academy
            ));
        } else {
            const newId = academies.length > 0 ? Math.max(...academies.map(a => a.id)) + 1 : 1;
            setAcademies([...academies, {
                id: newId,
                ...academyData
            }]);
        }
        handleCloseAcademyModal();
    };

    const handleNextTab = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
        }
    };

    const handlePreviousTab = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
        }
    };

    const filteredAcademies = academies.filter(academy =>
        academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredAcademies.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const start = (safeCurrentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedAcademies = filteredAcademies.slice(start, end);

    const thCenter = { ...styles.th, textAlign: 'center' };
    const tdCenter = { ...styles.td, textAlign: 'center', verticalAlign: 'middle' };

    // Available facilities for search (you can expand this list)
    const availableFacilities = ['Swimming Pool', 'Gym', 'Parking', 'Cafeteria', 'Locker Room', 'First Aid', 'WiFi', 'Air Conditioning'];

    // If showing form, render full page form instead of list
    if (showAcademyModal) {
        return (
            <div style={styles.mainContent}>
                {renderConfirmModal()}
                {/* Form Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button
                        onClick={handleCloseAcademyModal}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            transition: 'background-color 0.2s',
                            fontFamily: navFontFamily
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 style={{ ...styles.title, fontFamily: navFontFamily }}>{editingAcademy ? 'Edit Center' : 'Add New Center'}</h1>
                </div>
                <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px', fontFamily: navFontFamily }}>
                    Fill in the details to {editingAcademy ? 'update' : 'create'} a sports center.
                </div>
                
                {/* Tab Navigation */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '24px', 
                    padding: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontFamily: navFontFamily
                }}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '12px 20px',
                                    borderWidth: isActive ? '1px' : '0',
                                    borderStyle: isActive ? 'solid' : 'none',
                                    borderColor: isActive ? '#e2e8f0' : 'transparent',
                                    background: isActive ? '#ffffff' : 'transparent',
                                    borderRadius: isActive ? '8px' : '0',
                                    color: isActive ? '#0f172a' : '#64748b',
                                    fontWeight: isActive ? '700' : '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    flex: '1',
                                    textAlign: 'center',
                                    fontFamily: navFontFamily
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Form Content */}
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontFamily: navFontFamily
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: navFontFamily }}>
                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: navFontFamily }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Center Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={{ ...styles.input, fontFamily: navFontFamily }}
                                    value={academyForm.centerName}
                                    onChange={(e) => setAcademyForm({ ...academyForm, centerName: e.target.value })}
                                    placeholder="Enter center name"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{
                                        padding: '10px 14px',
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        color: '#64748b',
                                        fontWeight: '600'
                                    }}>
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        style={{ ...styles.input, marginBottom: 0, flex: 1, fontFamily: navFontFamily }}
                                        value={academyForm.phoneNumber}
                                        onChange={(e) => setAcademyForm({ ...academyForm, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Email <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    style={{ ...styles.input, fontFamily: navFontFamily }}
                                    value={academyForm.email}
                                    onChange={(e) => setAcademyForm({ ...academyForm, email: e.target.value })}
                                    placeholder="center@example.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Rules & Regulations
                                </label>
                                <div style={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minHeight: '120px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    backgroundColor: '#fafafa',
                                    marginBottom: '8px'
                                }}>
                                    {academyForm.rules.length === 0 ? (
                                        <div style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>
                                            No rules added yet. Click 'Add Rule' to add rules.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {academyForm.rules.map((rule, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    gap: '8px',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '6px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <span style={{ fontSize: '14px', color: '#0f172a', flex: 1 }}>{rule}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRule(index)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                            fontSize: '18px',
                                                            padding: 0,
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <textarea
                                        style={{
                                            ...styles.input,
                                            marginBottom: 0,
                                            flex: 1,
                                            minHeight: '60px',
                                            resize: 'vertical'
                                        }}
                                        value={academyForm.newRule}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 500) {
                                                setAcademyForm({ ...academyForm, newRule: e.target.value });
                                            }
                                        }}
                                        placeholder="Enter rule (max 500 characters)"
                                        maxLength={500}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddRule}
                                        style={{
                                            ...styles.button,
                                            padding: '10px 20px',
                                            whiteSpace: 'nowrap',
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        + Add Rule
                                    </button>
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                    Click 'Add Rule' to add multiple rules. Each rule can be up to 500 characters.
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Center Logo <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '40px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#fafafa',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#023B84';
                                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.backgroundColor = '#fafafa';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.backgroundColor = '#fafafa';
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        const fakeEvent = { target: { files: [file] } };
                                        handleLogoUpload(fakeEvent);
                                    }
                                }}
                                >
                                    {academyForm.logoPreview ? (
                                        <div>
                                            <img src={academyForm.logoPreview} alt="Logo preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px', marginBottom: '12px' }} />
                                            <div>
                                                <label style={{
                                                    display: 'inline-block',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#023B84',
                                                    color: '#fff',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '600'
                                                }}>
                                                    Change Logo
                                                    <input
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleLogoUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label style={{ cursor: 'pointer', display: 'block' }}>
                                            <Upload size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Upload Logo</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>PNG, JPG up to 5MB</div>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleLogoUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Minimum Age <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={{ ...styles.input, fontFamily: navFontFamily }}
                                        value={academyForm.minimumAge}
                                        onChange={(e) => setAcademyForm({ ...academyForm, minimumAge: e.target.value })}
                                        placeholder="e.g., 5"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Maximum Age <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={{ ...styles.input, fontFamily: navFontFamily }}
                                        value={academyForm.maximumAge}
                                        onChange={(e) => setAcademyForm({ ...academyForm, maximumAge: e.target.value })}
                                        placeholder="e.g., 18"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Facilities
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.facilitySearch}
                                    onChange={(e) => setAcademyForm({ ...academyForm, facilitySearch: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddFacility(academyForm.facilitySearch);
                                        }
                                    }}
                                    placeholder="Type to search or add facilities..."
                                />
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', marginBottom: '8px' }}>
                                    Search and select existing facilities or type a new name to create it automatically.
                                </div>
                                {academyForm.facilitySearch && (
                                    <div style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        marginBottom: '8px'
                                    }}>
                                        {availableFacilities
                                            .filter(f => f.toLowerCase().includes(academyForm.facilitySearch.toLowerCase()) && !academyForm.facilities.includes(f))
                                            .map((facility) => (
                                                <div
                                                    key={facility}
                                                    onClick={() => handleAddFacility(facility)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        cursor: 'pointer',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        color: '#0f172a',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    {facility}
                                                </div>
                                            ))}
                                        {!availableFacilities.some(f => f.toLowerCase().includes(academyForm.facilitySearch.toLowerCase())) && (
                                            <div
                                                onClick={() => handleAddFacility(academyForm.facilitySearch)}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: '#023B84',
                                                    fontWeight: '600',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                + Create "{academyForm.facilitySearch}"
                                            </div>
                                        )}
                                    </div>
                                )}
                                {academyForm.facilities.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {academyForm.facilities.map((facility) => (
                                            <span
                                                key={facility}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f1f5f9',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    color: '#0f172a',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                {facility}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFacility(facility)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#ef4444',
                                                        fontSize: '16px',
                                                        padding: 0,
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Address Line One
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.addressLineOne}
                                    onChange={(e) => setAcademyForm({ ...academyForm, addressLineOne: e.target.value })}
                                    placeholder="Enter address line one"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Address Line Two
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.addressLineTwo}
                                    onChange={(e) => setAcademyForm({ ...academyForm, addressLineTwo: e.target.value })}
                                    placeholder="Enter address line two"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={academyForm.state}
                                        onChange={(e) => setAcademyForm({ ...academyForm, state: e.target.value })}
                                        placeholder="Enter state"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={academyForm.city}
                                        onChange={(e) => setAcademyForm({ ...academyForm, city: e.target.value })}
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={academyForm.pincode}
                                        onChange={(e) => setAcademyForm({ ...academyForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                        placeholder="Enter pincode"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sports Tab */}
                    {activeTab === 'sports' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Select Sports (Multiple)
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '60px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {sports && sports.length > 0 ? (
                                        sports.map((sport) => (
                                            <label
                                                key={sport.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 14px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #e2e8f0',
                                                    cursor: 'pointer',
                                                    backgroundColor: academyForm.selectedSports.includes(sport.id) ? '#023B84' : '#fff',
                                                    color: academyForm.selectedSports.includes(sport.id) ? '#fff' : '#0f172a',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={academyForm.selectedSports.includes(sport.id)}
                                                    onChange={() => handleSportToggle(sport.id)}
                                                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                />
                                                {sport.name}
                                            </label>
                                        ))
                                    ) : (
                                        <span style={{ color: '#64748b', fontSize: '14px' }}>No sports available</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === 'media' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Media Files
                                </label>
                                <div style={{ padding: '20px', border: '1px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                                    Media upload functionality can be added here
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timings Tab */}
                    {activeTab === 'timings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Call Time (From)
                                    </label>
                                    <input
                                        type="time"
                                        style={styles.input}
                                        value={academyForm.callTimeFrom}
                                        onChange={(e) => setAcademyForm({ ...academyForm, callTimeFrom: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Call Time (To)
                                    </label>
                                    <input
                                        type="time"
                                        style={styles.input}
                                        value={academyForm.callTimeTo}
                                        onChange={(e) => setAcademyForm({ ...academyForm, callTimeTo: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Banking Tab */}
                    {activeTab === 'banking' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Payment Method
                                </label>
                                <select
                                    style={styles.input}
                                    value={academyForm.paymentMethod}
                                    onChange={(e) => setAcademyForm({ ...academyForm, paymentMethod: e.target.value })}
                                >
                                    <option value="">Select payment method</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Account Person Name
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.accountPersonName}
                                    onChange={(e) => setAcademyForm({ ...academyForm, accountPersonName: e.target.value })}
                                    placeholder="Enter account holder name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.bankName}
                                    onChange={(e) => setAcademyForm({ ...academyForm, bankName: e.target.value })}
                                    placeholder="Enter bank name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={academyForm.accountNumber}
                                    onChange={(e) => setAcademyForm({ ...academyForm, accountNumber: e.target.value })}
                                    placeholder="Enter account number"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    style={{
                                        ...styles.input,
                                        borderColor: ifscError ? '#ef4444' : styles.input.border,
                                        textTransform: 'uppercase'
                                    }}
                                    value={academyForm.ifscCode}
                                    onChange={(e) => handleIFSCChange(e.target.value)}
                                    placeholder="Enter IFSC code (e.g., ABCD0123456)"
                                    maxLength={11}
                                />
                                {ifscError && (
                                    <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                        {ifscError}
                                    </span>
                                )}
                                {academyForm.ifscCode && !ifscError && academyForm.ifscCode.length === 11 && (
                                    <span style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                        ✓ Valid IFSC code
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                        onClick={handleCloseAcademyModal}
                        style={{
                            ...styles.button,
                            backgroundColor: '#fff',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            padding: '10px 20px',
                            fontFamily: navFontFamily
                        }}
                    >
                        Cancel
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handlePreviousTab}
                            disabled={activeTab === 'basic'}
                            style={{
                                ...styles.button,
                                backgroundColor: activeTab === 'basic' ? '#f1f5f9' : '#64748b',
                                color: activeTab === 'basic' ? '#94a3b8' : '#fff',
                                padding: '10px 20px',
                                cursor: activeTab === 'basic' ? 'not-allowed' : 'pointer',
                                opacity: activeTab === 'basic' ? 0.5 : 1,
                                fontFamily: navFontFamily
                            }}
                        >
                            Previous
                        </button>
                        {activeTab === 'banking' ? (
                            <button
                                onClick={handleSaveAcademy}
                                style={{
                                    ...styles.button,
                                    backgroundColor: '#f97316',
                                    padding: '10px 20px',
                                    fontFamily: navFontFamily
                                }}
                            >
                                {editingAcademy ? 'Update Center' : 'Add Center'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextTab}
                                style={{
                                    ...styles.button,
                                    backgroundColor: '#f97316',
                                    padding: '10px 20px',
                                    fontFamily: navFontFamily
                                }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // List view (default)
    return (
        <div style={styles.mainContent}>
            {renderConfirmModal()}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ ...styles.title, fontFamily: navFontFamily }}>Academies Management</h1>
                <button
                    style={{ ...styles.button, fontFamily: navFontFamily }}
                    onClick={handleAddAcademy}
                >
                    + Add Academy
                </button>
            </div>

            {/* Filters / toggles */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '12px',
                background: '#fff',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
            }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '12px', flex: '0 1 240px', maxWidth: '100%' }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px',
                                color: '#0f172a',
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[
                            { key: 'grid', label: 'Grid View' },
                            { key: 'list', label: 'List View' },
                        ].map((mode) => {
                            const active = viewMode === mode.key;
                            const isGrid = mode.key === 'grid';
                            return (
                                <button
                                    key={mode.key}
                                    onClick={() => setViewMode(mode.key)}
                                    aria-label={mode.label}
                                    style={{
                                        width: '42px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: active
                                            ? (isGrid
                                                ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                                                : 'linear-gradient(135deg, #023B84 0%, #023B84 100%)')
                                            : 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)',
                                        boxShadow: active ? '0 8px 18px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
                                        color: active ? '#fff' : '#475569'
                                    }}
                                >
                                    {isGrid ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            {[0, 6, 12].map((x) =>
                                                [0, 6, 12].map((y) => (
                                                    <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1.2" fill={active ? '#fff' : '#475569'} />
                                                ))
                                            )}
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            {[2, 7, 12].map((y) => (
                                                <g key={y}>
                                                    <rect x="2" y={y} width="12" height="2" rx="1" fill={active ? '#fff' : '#475569'} />
                                                </g>
                                            ))}
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div style={{ color: '#475569', fontSize: '13px' }}>
                    Showing {filteredAcademies.length} of {academies.length} academies
                </div>
            </div>

            {viewMode === 'list' ? (
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={thCenter}>Sr. No.</th>
                                <th style={thCenter}>Name</th>
                                <th style={thCenter}>Email Id</th>
                                <th style={thCenter}>Academy Name</th>
                                <th style={thCenter}>Mobile Number</th>
                                <th style={thCenter}>Added By</th>
                                <th style={thCenter}>Create Date</th>
                                <th style={thCenter}>Status</th>
                                <th style={thCenter}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAcademies.map((academy, index) => (
                            <tr key={academy.id}>
                                <td style={tdCenter}>{start + index + 1}</td>
                                <td style={{ ...tdCenter, fontWeight: '500', whiteSpace: 'nowrap' }}>
                                    {academy.ownerName || 'N/A'}
                                </td>
                                <td style={tdCenter}>{academy.email}</td>
                                <td style={tdCenter}>{academy.name}</td>
                                <td style={tdCenter}>{academy.contact || '-'}</td>
                                <td style={tdCenter}>{academy.addedBy || '-'}</td>
                                <td style={tdCenter}>{academy.createDate || '-'}</td>
                                <td style={tdCenter}>
                                    <div
                                        onClick={() => toggleStatus(academy.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        title="Toggle status"
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '20px',
                                                borderRadius: '999px',
                                                background: academy.status === 'active' ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: academy.status === 'active' ? '36px' : '3px',
                                                    width: '10px',
                                                    height: '12px',
                                                    borderRadius: '999px',
                                                    background: '#ffffff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                    transition: 'left 0.2s ease'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td style={tdCenter}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            style={{ ...styles.button, padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => handleEditAcademy(academy)}
                                            title="Edit"
                                        >
                                            <Pencil size={16} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 12px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(academy.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} color="#ffffff" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAcademies.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                            No academies found
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                    {paginatedAcademies.map((academy, index) => (
                        <div key={academy.id} style={{
                            border: '1px solid #f1f5f9',
                            borderRadius: '14px',
                            padding: '14px',
                            boxShadow: '0 10px 24px rgba(15,23,42,0.05)',
                            background: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{academy.ownerName || 'N/A'}</div>
                                    <div style={{ fontSize: '12px', color: '#475569' }}>{academy.name}</div>
                                </div>
                                <div
                                    onClick={() => toggleStatus(academy.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        userSelect: 'none'
                                    }}
                                    title="Toggle status"
                                >
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '20px',
                                            borderRadius: '999px',
                                            background: academy.status === 'active' ? '#023B84' : '#e5e7eb',
                                            position: 'relative',
                                            transition: 'all 0.2s ease',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '3px',
                                                left: academy.status === 'active' ? '36px' : '3px',
                                                width: '10px',
                                                height: '12px',
                                                borderRadius: '999px',
                                                background: '#ffffff',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                                transition: 'left 0.2s ease'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', rowGap: '6px', columnGap: '10px', fontSize: '13px', color: '#475569' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📧 {academy.email}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📱 {academy.contact || '-'}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>👤 {academy.addedBy || '-'}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📅 {academy.createDate || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                <button
                                    style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }}
                                    onClick={() => handleEditAcademy(academy)}
                                    title="Edit"
                                >
                                    <Pencil size={14} color="#ffffff" />
                                </button>
                                <button
                                    style={{ ...styles.buttonDanger, padding: '6px 10px', fontSize: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                    onClick={() => handleDelete(academy.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={14} color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {filteredAcademies.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>Rows per page:</span>
                        <select
                            style={{ ...styles.input, width: '90px', marginBottom: 0, padding: '8px 10px' }}
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ color: styles.subtitle.color, fontSize: '13px' }}>
                            Showing {start + 1}-{Math.min(end, filteredAcademies.length)} of {filteredAcademies.length}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === 1 ? 0.5 : 1 }}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={safeCurrentPage === 1}
                            >
                                Prev
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const page = idx + 1;
                                    const isActive = page === safeCurrentPage;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                backgroundColor: isActive ? '#1e40af' : '#fff',
                                                color: isActive ? '#fff' : '#0f172a',
                                                cursor: 'pointer',
                                                fontWeight: isActive ? 700 : 500,
                                                minWidth: '36px'
                                            }}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                style={{ ...styles.button, padding: '8px 12px', fontSize: '12px', opacity: safeCurrentPage === totalPages ? 0.5 : 1 }}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safeCurrentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
