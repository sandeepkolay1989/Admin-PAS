'use client';
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Pencil, Trash2, HelpCircle, X, Upload } from 'lucide-react';

export default function AgeGroupsPage() {
    const { ageGroups, setAgeGroups } = useAdmin();
    const styles = useTheme();
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [ageGroupForm, setAgeGroupForm] = useState({ name: '', min: '', max: '' });
    const [confirmModal, setConfirmModal] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', min: '', max: '' });

    const openStatusModal = (group) => {
        if (!group) return;
        const nextStatus = group.status === 'active' ? 'Inactive' : 'Active';
        setConfirmModal({ groupId: group.id, nextStatus });
    };

    const handleConfirmStatus = () => {
        if (!confirmModal) return;
        const targetStatus = (confirmModal.nextStatus || '').toLowerCase() === 'active' ? 'active' : 'inactive';
        setAgeGroups((prev) =>
            prev.map((group) =>
                group.id === confirmModal.groupId ? { ...group, status: targetStatus } : group
            )
        );
        setConfirmModal(null);
    };

    const handleCancelStatus = () => setConfirmModal(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this age group?')) {
            setAgeGroups(ageGroups.filter(g => g.id !== id));
        }
    };

    const handleAddAgeGroup = () => {
        setEditingGroup(null);
        setAgeGroupForm({ name: '', min: '', max: '' });
        setShowForm(true);
    };

    const handleEditAgeGroup = (group) => {
        setEditingGroup(group);
        setAgeGroupForm({
            name: group.name || '',
            min: group.min || '',
            max: group.max || ''
        });
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingGroup(null);
        setAgeGroupForm({ name: '', min: '', max: '' });
        setFormErrors({ name: '', min: '', max: '' });
    };

    const validateAgeGroupName = (name, min, max) => {
        // Pattern: "X to Y Years" where X and Y are numbers
        const pattern = /^(\d+)\s+to\s+(\d+)\s+Years$/i;
        const match = name.trim().match(pattern);
        if (!match) {
            return { valid: false, message: 'Age Group Name must be in format: "X to Y Years" (e.g., "3 to 18 Years")' };
        }
        
        const nameMin = parseInt(match[1]);
        const nameMax = parseInt(match[2]);
        
        if (min && max) {
            const minVal = parseInt(min);
            const maxVal = parseInt(max);
            if (nameMin !== minVal || nameMax !== maxVal) {
                return { valid: false, message: `Age Group Name numbers (${nameMin} to ${nameMax}) must match Minimum (${minVal}) and Maximum (${maxVal}) values` };
            }
        }
        
        return { valid: true };
    };

    const handleSaveAgeGroup = () => {
        // Reset errors
        const errors = { name: '', min: '', max: '' };
        let hasErrors = false;

        // Validate Age Group Name format
        if (!ageGroupForm.name || !ageGroupForm.name.trim()) {
            errors.name = 'Age Group Name is required';
            hasErrors = true;
        } else {
            const nameValidation = validateAgeGroupName(ageGroupForm.name, ageGroupForm.min, ageGroupForm.max);
            if (!nameValidation.valid) {
                errors.name = nameValidation.message;
                hasErrors = true;
            }
        }

        // Validate Minimum age
        const minAge = parseInt(ageGroupForm.min);
        if (!ageGroupForm.min || ageGroupForm.min.trim() === '') {
            errors.min = 'Minimum age is required';
            hasErrors = true;
        } else if (isNaN(minAge)) {
            errors.min = 'Minimum age must be a number';
            hasErrors = true;
        } else if (minAge < 3) {
            errors.min = 'Minimum age must be at least 3';
            hasErrors = true;
        } else if (minAge > 18) {
            errors.min = 'Minimum age cannot be greater than 18';
            hasErrors = true;
        }

        // Validate Maximum age
        const maxAge = parseInt(ageGroupForm.max);
        if (!ageGroupForm.max || ageGroupForm.max.trim() === '') {
            errors.max = 'Maximum age is required';
            hasErrors = true;
        } else if (isNaN(maxAge)) {
            errors.max = 'Maximum age must be a number';
            hasErrors = true;
        } else if (maxAge < 3) {
            errors.max = 'Maximum age must be at least 3';
            hasErrors = true;
        } else if (maxAge > 18) {
            errors.max = 'Maximum age cannot be greater than 18';
            hasErrors = true;
        }

        // Validate that Minimum < Maximum
        if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
            errors.max = 'Maximum age must be greater than Minimum age';
            hasErrors = true;
        }

        setFormErrors(errors);

        if (hasErrors) {
            return;
        }

        if (editingGroup) {
            // Update existing group
            setAgeGroups(ageGroups.map(group =>
                group.id === editingGroup.id
                    ? { ...group, name: ageGroupForm.name, min: ageGroupForm.min, max: ageGroupForm.max }
                    : group
            ));
        } else {
            // Add new group
            const newId = ageGroups.length > 0 ? Math.max(...ageGroups.map(g => g.id)) + 1 : 1;
            setAgeGroups([...ageGroups, {
                id: newId,
                name: ageGroupForm.name,
                min: ageGroupForm.min,
                max: ageGroupForm.max,
                status: 'active'
            }]);
        }
        handleCloseForm();
    };

    const filteredGroups = ageGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If showing form, render full page form instead of list
    if (showForm) {
        return (
            <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
                {confirmModal && (
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
                )}
                {/* Form Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button
                        onClick={handleCloseForm}
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
                    <h1 style={{ ...styles.title, fontFamily: navFontFamily }}>
                        {editingGroup ? 'Edit Age Group' : 'Add Age Group'}
                    </h1>
                </div>
                <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px', fontFamily: navFontFamily }}>
                    Fill in the details to {editingGroup ? 'update' : 'create'} an age group.
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
                        {/* Age Group Name */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                Age Group Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                style={{
                                    ...styles.input,
                                    fontFamily: navFontFamily,
                                    borderColor: formErrors.name ? '#ef4444' : styles.input.borderColor,
                                    backgroundColor: '#f8fafc',
                                    cursor: 'not-allowed',
                                    color: '#64748b'
                                }}
                                value={ageGroupForm.name || 'Age group: 3 to 18 years'}
                                placeholder="Age group: 3 to 18 years"
                            />
                            <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontFamily: navFontFamily }}>
                                This field will be automatically generated when you enter Minimum and Maximum age
                            </div>
                            {formErrors.name && (
                                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                    {formErrors.name}
                                </div>
                            )}
                        </div>

                        {/* Minimum and Maximum Age */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Minimum <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    style={{
                                        ...styles.input,
                                        fontFamily: navFontFamily,
                                        borderColor: formErrors.min ? '#ef4444' : styles.input.borderColor
                                    }}
                                    value={ageGroupForm.min}
                                    onChange={(e) => {
                                        const minVal = e.target.value;
                                        const maxVal = ageGroupForm.max;
                                        let updatedForm = { ...ageGroupForm, min: minVal };
                                        
                                        // Auto-generate Age Group Name if both min and max are valid numbers
                                        if (minVal && maxVal && !isNaN(parseInt(minVal)) && !isNaN(parseInt(maxVal))) {
                                            updatedForm.name = `${minVal} to ${maxVal} Years`;
                                        } else {
                                            // Clear name if either value is missing
                                            updatedForm.name = '';
                                        }
                                        
                                        setAgeGroupForm(updatedForm);
                                        if (formErrors.min) {
                                            setFormErrors({ ...formErrors, min: '' });
                                        }
                                        // Clear name error if it exists since we're auto-generating
                                        if (formErrors.name) {
                                            setFormErrors({ ...formErrors, name: '' });
                                        }
                                    }}
                                    placeholder="Eg., 3"
                                    min="3"
                                    max="18"
                                />
                                {formErrors.min && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                        {formErrors.min}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Maximum <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    style={{
                                        ...styles.input,
                                        fontFamily: navFontFamily,
                                        borderColor: formErrors.max ? '#ef4444' : styles.input.borderColor
                                    }}
                                    value={ageGroupForm.max}
                                    onChange={(e) => {
                                        const maxVal = e.target.value;
                                        const minVal = ageGroupForm.min;
                                        let updatedForm = { ...ageGroupForm, max: maxVal };
                                        
                                        // Auto-generate Age Group Name if both min and max are valid numbers
                                        if (minVal && maxVal && !isNaN(parseInt(minVal)) && !isNaN(parseInt(maxVal))) {
                                            updatedForm.name = `${minVal} to ${maxVal} Years`;
                                        } else {
                                            // Clear name if either value is missing
                                            updatedForm.name = '';
                                        }
                                        
                                        setAgeGroupForm(updatedForm);
                                        if (formErrors.max) {
                                            setFormErrors({ ...formErrors, max: '' });
                                        }
                                        // Clear name error if it exists since we're auto-generating
                                        if (formErrors.name) {
                                            setFormErrors({ ...formErrors, name: '' });
                                        }
                                    }}
                                    placeholder="Eg., 18"
                                    min="3"
                                    max="18"
                                />
                                {formErrors.max && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                        {formErrors.max}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <button
                        onClick={handleCloseForm}
                        style={{
                            ...styles.button,
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                            fontFamily: navFontFamily
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveAgeGroup}
                        style={{
                            ...styles.button,
                            backgroundColor: '#023B84',
                            color: '#ffffff',
                            border: 'none',
                            fontFamily: navFontFamily
                        }}
                    >
                        {editingGroup ? 'Update Age Group' : 'Add Age Group'}
                    </button>
                </div>
            </div>
        );
    }

    // List view (default)
    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
            {confirmModal && (
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
            )}
            <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0f172a',
                        margin: 0,
                        marginBottom: '4px',
                        fontFamily: navFontFamily
                    }}>
                        Age Groups Management
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#64748b',
                        margin: 0,
                        fontFamily: navFontFamily
                    }}>
                        Manage age groups for sports and activities
                    </p>
                </div>
                <button
                    style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: navFontFamily,
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={handleAddAgeGroup}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                    }}
                >
                    <Upload size={18} />
                    + Add Age Groups
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{ ...styles.input, width: '300px', marginBottom: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={styles.card}>
                <table style={{ ...styles.table, width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Sr. No.</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Age Group Name</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Minimum</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Maximum</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Active</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.map((group, index) => (
                            <tr key={group.id}>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ ...styles.td, textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 500 }}>{group.name}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={styles.badge}>{group.min} Years</span>
                                </td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={styles.badge}>{group.max} Years</span>
                                </td>
                                <td style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                        onClick={() => openStatusModal(group)}
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
                                                background: group.status === 'active' ? '#023B84' : '#e5e7eb',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: group.status === 'active' ? '36px' : '3px',
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
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }}
                                            onClick={() => handleEditAgeGroup(group)}
                                            title="Edit"
                                        >
                                            <Pencil size={14} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(group.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} color="#ffffff" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredGroups.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: styles.subtitle.color }}>
                        No age groups found
                    </div>
                )}
            </div>

        </div>
    );
}
