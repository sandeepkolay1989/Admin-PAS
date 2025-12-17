'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { Pencil, Trash2, X, HelpCircle, Search, Upload, MapPin, Navigation, FileText, Image as ImageIcon, Video, Building2, CheckCircle2, DownloadCloud } from 'lucide-react';

export default function AcademiesPage() {
    const { academies, setAcademies, sports } = useAdmin();
    const styles = useTheme();
    const navFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [addedByFilter, setAddedByFilter] = useState('all'); // all, or specific addedBy value
    const [sportsFilter, setSportsFilter] = useState('all'); // all, or specific sport ID
    const [confirmModal, setConfirmModal] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // list or detail or form
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [returnToDetail, setReturnToDetail] = useState(null);
    const [showAcademyModal, setShowAcademyModal] = useState(false);
    const formJustOpenedRef = useRef(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editingAcademy, setEditingAcademy] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [sportsOptionsHydrated, setSportsOptionsHydrated] = useState(false);
    const [academyForm, setAcademyForm] = useState({
        centerName: '',
        phoneNumber: '',
        email: '',
        experience: '',
        allowedGenders: [],
        allowDisability: false,
        onlyForDisabled: false,
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
        searchLocation: '',
        houseNumber: '',
        streetName: '',
        latitude: '',
        longitude: '',
        selectedSports: [],
        media: [],
        mediaBySport: {}, // { [sportId]: { description: '', images: [], videos: [] } }
        documents: [],
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
    const [logoCropper, setLogoCropper] = useState({
        isOpen: false,
        imageSrc: '',
        imgWidth: 0,
        imgHeight: 0,
        baseScale: 1,
        scale: 1.1,
        pos: { x: 0, y: 0 },
        isDragging: false,
        dragStart: null
    });
    const [ifscError, setIfscError] = useState('');
    const [sportSearchTerm, setSportSearchTerm] = useState('');
    const [currentUploadContext, setCurrentUploadContext] = useState({ sportId: null, type: null });
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const mapsScriptLoadedRef = useRef(false);
    const imagesInputRef = useRef(null);
    const videosInputRef = useRef(null);
    const documentsInputRef = useRef(null);
    const cropImageRef = useRef(null);
    const [detailAcademy, setDetailAcademy] = useState(null);

    // Indian States and Cities data
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
        'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi',
        'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    const indianCities = {
        'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
        'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
        'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
        'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
        'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg', 'Korba'],
        'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
        'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
        'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Kullu'],
        'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
        'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
        'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul'],
        'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar'],
        'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib'],
        'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
        'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'],
        'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Singtam'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
        'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Belonia'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
        'Andaman and Nicobar Islands': ['Port Blair', 'Diglipur', 'Mayabunder', 'Rangat', 'Car Nicobar'],
        'Chandigarh': ['Chandigarh'],
        'Dadra and Nagar Haveli': ['Silvassa', 'Dadra', 'Naroli', 'Khanvel', 'Kadaiya'],
        'Daman and Diu': ['Daman', 'Diu'],
        'Delhi': ['New Delhi', 'Delhi'],
        'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore'],
        'Ladakh': ['Leh', 'Kargil', 'Drass', 'Nubra', 'Zanskar'],
        'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Kadmat'],
        'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
    };

    // Sorted states and cities for dropdowns
    const sortedStates = useMemo(() => [...indianStates].sort((a, b) => a.localeCompare(b)), []);
    const sortedCitiesByState = useMemo(() => {
        const result = {};
        Object.entries(indianCities).forEach(([state, cities]) => {
            result[state] = [...cities].sort((a, b) => a.localeCompare(b));
        });
        return result;
    }, []);

    useEffect(() => {
        setSportsOptionsHydrated(true);
    }, []);

    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'location', label: 'Location' },
        { id: 'sports', label: 'Sports' },
        { id: 'media', label: 'Media' },
        { id: 'timings', label: 'Timings' },
        { id: 'banking', label: 'Banking' }
    ];

    const selectedSportsSafe = useMemo(() => {
        return (academyForm.selectedSports || []).filter((s) => {
            if (s === null || s === undefined) return false;
            const str = String(s).trim();
            return str.length > 0;
        });
    }, [academyForm.selectedSports]);

    // Initialize media for selected sports
    useEffect(() => {
        if (academyForm.selectedSports.length === 0) return;
        
        setAcademyForm(prev => {
            const newMediaBySport = { ...prev.mediaBySport };
            let hasChanges = false;
            prev.selectedSports.forEach(sportId => {
                if (!newMediaBySport[sportId]) {
                    newMediaBySport[sportId] = {
                        description: '',
                        images: [],
                        videos: []
                    };
                    hasChanges = true;
                }
            });
            if (hasChanges) {
                return {
                    ...prev,
                    mediaBySport: newMediaBySport
                };
            }
            return prev;
        });
    }, [academyForm.selectedSports.join(',')]);

    // Reset to first page when pageSize changes
    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

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
        // Convert to lowercase to match the status checks throughout the component
        const targetStatus = (nextStatus || '').toLowerCase() === 'active' ? 'active' : 'inactive';
        setAcademies(academies.map(academy =>
            academy.id === id ? { ...academy, status: targetStatus } : academy
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

    const openDetailDrawer = (academy) => {
        setDetailAcademy(academy);
        setViewMode('detail');
    };

    const closeDetailDrawer = () => {
        setDetailAcademy(null);
        setViewMode('list');
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

    // Load Google Maps script
    useEffect(() => {
        // Prevent multiple script loads
        if (mapsScriptLoadedRef.current) {
            return;
        }

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
            mapsScriptLoadedRef.current = true;
            setMapLoaded(true);
            setGeocoder(new window.google.maps.Geocoder());
            return;
        }

        // Check if script is already in the DOM
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
            mapsScriptLoadedRef.current = true;
            // Script is already in the DOM, wait for it to load
            const checkGoogleMaps = () => {
                if (window.google && window.google.maps) {
                    setMapLoaded(true);
                    setGeocoder(new window.google.maps.Geocoder());
                } else {
                    // Wait a bit and check again
                    setTimeout(checkGoogleMaps, 100);
                }
            };
            checkGoogleMaps();
            return;
        }

        // Mark as loading to prevent duplicate loads
        mapsScriptLoadedRef.current = true;

        // Create and load the script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setMapLoaded(true);
            if (window.google && window.google.maps) {
                setGeocoder(new window.google.maps.Geocoder());
            }
        };
        script.onerror = () => {
            // Reset on error so it can retry
            mapsScriptLoadedRef.current = false;
        };
        document.head.appendChild(script);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize map when Location tab is active and map is loaded
    useEffect(() => {
        if (activeTab === 'location' && mapLoaded && mapContainerRef.current && !map && window.google && window.google.maps && geocoder) {
            const defaultCenter = academyForm.latitude && academyForm.longitude
                ? { lat: parseFloat(academyForm.latitude), lng: parseFloat(academyForm.longitude) }
                : { lat: 20.5937, lng: 78.9629 }; // Default to India center

            const newMap = new window.google.maps.Map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: 10,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            const newMarker = new window.google.maps.Marker({
                position: defaultCenter,
                map: newMap,
                draggable: true,
                title: 'Academy Location'
            });

            // Update form when marker is dragged
            newMarker.addListener('dragend', () => {
                const position = newMarker.getPosition();
                const lat = position.lat();
                const lng = position.lng();
                setAcademyForm(prev => ({
                    ...prev,
                    latitude: lat.toString(),
                    longitude: lng.toString()
                }));
                // Reverse geocode to get address
                if (geocoder) {
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            updateAddressFromGeocode(results[0]);
                        }
                    });
                }
            });

            // Update form when map is clicked
            newMap.addListener('click', (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                newMarker.setPosition({ lat, lng });
                setAcademyForm(prev => ({
                    ...prev,
                    latitude: lat.toString(),
                    longitude: lng.toString()
                }));
                // Reverse geocode to get address
                if (geocoder) {
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            updateAddressFromGeocode(results[0]);
                        }
                    });
                }
            });

            setMap(newMap);
            setMarker(newMarker);
        }
    }, [activeTab, mapLoaded, map, geocoder]);

    // Update marker position when latitude/longitude changes
    useEffect(() => {
        if (marker && academyForm.latitude && academyForm.longitude) {
            const lat = parseFloat(academyForm.latitude);
            const lng = parseFloat(academyForm.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                marker.setPosition({ lat, lng });
                if (map) {
                    map.setCenter({ lat, lng });
                }
            }
        }
    }, [academyForm.latitude, academyForm.longitude, marker, map]);

    const updateAddressFromGeocode = (result) => {
        const addressComponents = result.address_components;
        let streetName = '';
        let houseNumber = '';
        let city = '';
        let state = '';
        let pincode = '';

        addressComponents.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) {
                houseNumber = component.long_name;
            } else if (types.includes('route')) {
                streetName = component.long_name;
            } else if (types.includes('locality') || types.includes('sublocality')) {
                if (!city) city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
            } else if (types.includes('postal_code')) {
                pincode = component.long_name;
            }
        });

        setAcademyForm(prev => ({
            ...prev,
            houseNumber: houseNumber || prev.houseNumber,
            streetName: streetName || prev.streetName,
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode
        }));
    };

    const handleSearchLocation = () => {
        if (!geocoder) return;
        setAcademyForm(prev => {
            if (!prev.searchLocation) return prev;
            geocoder.geocode({ address: prev.searchLocation }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();

                    setAcademyForm(prevForm => ({
                        ...prevForm,
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }));

                    if (marker) {
                        marker.setPosition({ lat, lng });
                    }
                    if (map) {
                        map.setCenter({ lat, lng });
                        map.setZoom(15);
                    }

                    updateAddressFromGeocode(results[0]);
                } else {
                    alert('Location not found. Please try a different search term.');
                }
            });
            return prev;
        });
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setAcademyForm(prev => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }));

                    if (marker) {
                        marker.setPosition({ lat, lng });
                    }
                    if (map) {
                        map.setCenter({ lat, lng });
                        map.setZoom(15);
                    }

                    // Reverse geocode to get address
                    if (geocoder) {
                        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                                updateAddressFromGeocode(results[0]);
                            }
                        });
                    }
                },
                (error) => {
                    alert('Unable to retrieve your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const CROP_BOX_SIZE = 320; // visual crop box
    const CROP_CANVAS_SIZE = 600; // exported square size before compression

    const clampCropPosition = (pos, imgWidth, imgHeight, baseScale, scale) => {
        const finalScale = baseScale * scale;
        const drawW = imgWidth * finalScale;
        const drawH = imgHeight * finalScale;
        const maxX = Math.max(0, (drawW - CROP_BOX_SIZE) / 2);
        const maxY = Math.max(0, (drawH - CROP_BOX_SIZE) / 2);
        return {
            x: Math.max(-maxX, Math.min(maxX, pos.x)),
            y: Math.max(-maxY, Math.min(maxY, pos.y))
        };
    };

    const openLogoCropper = (dataUrl, file) => {
        const img = new Image();
        img.onload = () => {
            cropImageRef.current = img;
            const minDim = Math.min(img.width, img.height);
            const baseScale = CROP_BOX_SIZE / minDim;
            setLogoCropper({
                isOpen: true,
                imageSrc: dataUrl,
                imgWidth: img.width,
                imgHeight: img.height,
                baseScale,
                scale: 1.1,
                pos: { x: 0, y: 0 },
                isDragging: false,
                dragStart: null
            });
        };
        img.src = dataUrl;
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
            setFieldErrors(prev => ({ ...prev, logo: 'Please upload only JPG or PNG files' }));
            return;
        }

        // Hard cap at 50MB for upload
        if (file.size > 50 * 1024 * 1024) {
            setFieldErrors(prev => ({ ...prev, logo: 'File size should be 50MB or less' }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            openLogoCropper(reader.result, file);
        };
        reader.readAsDataURL(file);
    };

    const closeLogoCropper = () => {
        setLogoCropper(prev => ({ ...prev, isOpen: false }));
    };

    const handleCropMouseDown = (e) => {
        if (!logoCropper.isOpen) return;
        setLogoCropper(prev => ({
            ...prev,
            isDragging: true,
            dragStart: { x: e.clientX, y: e.clientY }
        }));
    };

    const handleCropMouseMove = (e) => {
        if (!logoCropper.isOpen || !logoCropper.isDragging) return;
        const deltaX = e.clientX - logoCropper.dragStart.x;
        const deltaY = e.clientY - logoCropper.dragStart.y;
        const nextPos = { x: logoCropper.pos.x + deltaX, y: logoCropper.pos.y + deltaY };
        const clamped = clampCropPosition(nextPos, logoCropper.imgWidth, logoCropper.imgHeight, logoCropper.baseScale, logoCropper.scale);
        setLogoCropper(prev => ({
            ...prev,
            pos: clamped,
            dragStart: { x: e.clientX, y: e.clientY }
        }));
    };

    const handleCropMouseUp = () => {
        if (!logoCropper.isDragging) return;
        setLogoCropper(prev => ({ ...prev, isDragging: false, dragStart: null }));
    };

    const handleCropZoom = (e) => {
        const nextScale = parseFloat(e.target.value);
        const clampedPos = clampCropPosition(logoCropper.pos, logoCropper.imgWidth, logoCropper.imgHeight, logoCropper.baseScale, nextScale);
        setLogoCropper(prev => ({ ...prev, scale: nextScale, pos: clampedPos }));
    };

    const generateCroppedLogo = async () => {
        if (!cropImageRef.current) return null;
        const img = cropImageRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = CROP_CANVAS_SIZE;
        canvas.height = CROP_CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        const viewToCanvasScale = CROP_CANVAS_SIZE / CROP_BOX_SIZE;
        const finalScale = logoCropper.baseScale * logoCropper.scale;
        const drawW = img.width * finalScale * viewToCanvasScale;
        const drawH = img.height * finalScale * viewToCanvasScale;
        const posX = (CROP_BOX_SIZE / 2 + logoCropper.pos.x) * viewToCanvasScale - drawW / 2;
        const posY = (CROP_BOX_SIZE / 2 + logoCropper.pos.y) * viewToCanvasScale - drawH / 2;
        ctx.clearRect(0, 0, CROP_CANVAS_SIZE, CROP_CANVAS_SIZE);
        ctx.drawImage(img, posX, posY, drawW, drawH);

        const getBlobWithQuality = (quality) => new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality));

        let quality = 0.92;
        let blob = await getBlobWithQuality(quality);
        while (blob && blob.size > 5 * 1024 * 1024 && quality > 0.5) {
            quality -= 0.1;
            blob = await getBlobWithQuality(quality);
        }

        if (!blob) return null;

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                const file = new File([blob], 'logo.jpg', { type: 'image/jpeg' });
                resolve({ dataUrl, file });
            };
            reader.readAsDataURL(blob);
        });
    };

    const confirmLogoCrop = async () => {
        const cropped = await generateCroppedLogo();
        if (!cropped) return;

        setAcademyForm({
            ...academyForm,
            logo: cropped.file,
            logoPreview: cropped.dataUrl
        });

        // Clear logo error when logo is uploaded
        if (fieldErrors.logo) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.logo;
                return newErrors;
            });
        }

        closeLogoCropper();
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
        const newSelectedSports = isSelected
            ? academyForm.selectedSports.filter(id => id !== sportId)
            : [...academyForm.selectedSports, sportId];
        
        // Initialize or remove media for the sport
        const newMediaBySport = { ...academyForm.mediaBySport };
        if (isSelected) {
            // Remove media when sport is deselected
            delete newMediaBySport[sportId];
        } else {
            // Initialize media when sport is selected
            if (!newMediaBySport[sportId]) {
                newMediaBySport[sportId] = {
                    description: '',
                    images: [],
                    videos: []
                };
            }
        }
        
        // Clear error when sport is selected
        if (!isSelected && fieldErrors.selectedSports) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.selectedSports;
                return newErrors;
            });
        }
        
        setAcademyForm({
            ...academyForm,
            selectedSports: newSelectedSports,
            mediaBySport: newMediaBySport
        });
    };

    const handleFileUpload = (files, type, sportId = null) => {
        if (!files || files.length === 0) return;
        
        // Documents are at academy level, not per sport
        if (type === 'documents') {
            sportId = null;
        } else if (!sportId) {
            return;
        }
        
        const fileArray = Array.from(files);
        const maxSize = {
            images: 5 * 1024 * 1024, // 5MB
            videos: 50 * 1024 * 1024, // 50MB
            documents: 10 * 1024 * 1024 // 10MB
        };
        const allowedTypes = {
            images: ['image/png', 'image/jpeg', 'image/jpg'],
            videos: ['video/mp4', 'video/quicktime', 'video/mov'],
            documents: ['application/pdf', 'image/jpeg', 'image/jpg']
        };

        const validFiles = [];
        const invalidFiles = [];

        fileArray.forEach(file => {
            if (!allowedTypes[type].includes(file.type)) {
                invalidFiles.push(`${file.name} is not a valid ${type === 'images' ? 'PNG/JPG' : type === 'videos' ? 'MP4/MOV' : 'PDF/JPG'} file`);
                return;
            }
            if (file.size > maxSize[type]) {
                invalidFiles.push(`${file.name} exceeds the maximum size limit (${type === 'images' ? '5MB' : type === 'videos' ? '50MB' : '10MB'})`);
                return;
            }
            validFiles.push(file);
        });

        if (invalidFiles.length > 0) {
            alert(invalidFiles.join('\n'));
        }

        if (validFiles.length === 0) return;

        // Read all valid files
        const promises = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        file: file,
                        preview: reader.result,
                        name: file.name,
                        size: file.size
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(newFiles => {
            if (type === 'documents') {
                // Documents are at academy level
                setAcademyForm(prev => ({
                    ...prev,
                    documents: [...prev.documents, ...newFiles]
                }));
            } else {
                // Images and videos are per sport
                setAcademyForm(prev => {
                    const newMediaBySport = { ...prev.mediaBySport };
                    if (!newMediaBySport[sportId]) {
                        newMediaBySport[sportId] = {
                            description: '',
                            images: [],
                            videos: []
                        };
                    }
                    newMediaBySport[sportId] = {
                        ...newMediaBySport[sportId],
                        [type]: [...newMediaBySport[sportId][type], ...newFiles]
                    };
                    return {
                        ...prev,
                        mediaBySport: newMediaBySport
                    };
                });
            }
        });
    };

    const handleRemoveFile = (index, type, sportId = null) => {
        if (type === 'documents') {
            // Documents are at academy level
            setAcademyForm(prev => ({
                ...prev,
                documents: prev.documents.filter((_, i) => i !== index)
            }));
        } else {
            // Images and videos are per sport
            setAcademyForm(prev => {
                const newMediaBySport = { ...prev.mediaBySport };
                if (newMediaBySport[sportId]) {
                    newMediaBySport[sportId] = {
                        ...newMediaBySport[sportId],
                        [type]: newMediaBySport[sportId][type].filter((_, i) => i !== index)
                    };
                }
                return {
                    ...prev,
                    mediaBySport: newMediaBySport
                };
            });
        }
    };

    const handleAddAcademy = () => {
        formJustOpenedRef.current = true;
        setEditingAcademy(null);
        setActiveTab('basic');
        setIfscError('');
        setSportSearchTerm('');
        setFieldErrors({});
        setAcademyForm({
            centerName: '',
            phoneNumber: '',
            email: '',
            experience: '',
            allowedGenders: [],
            allowDisability: false,
            onlyForDisabled: false,
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
            searchLocation: '',
            houseNumber: '',
            streetName: '',
            latitude: '',
            longitude: '',
            selectedSports: [],
            media: [],
            mediaBySport: {},
            documents: [],
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
        // Reset flag after a short delay to allow form to render
        setTimeout(() => {
            formJustOpenedRef.current = false;
        }, 100);
    };

    const handleEditAcademy = (academy, fromDetail = false) => {
        setReturnToDetail(fromDetail ? academy : null);
        formJustOpenedRef.current = true;
        setEditingAcademy(academy);
        setActiveTab('basic');
        setIfscError('');
        setFieldErrors({});
        setAcademyForm({
            centerName: academy.centerName || academy.academyName || academy.name || '',
            phoneNumber: academy.phoneNumber || academy.mobileNumber || academy.contact || '',
            email: academy.email || '',
            experience: academy.experience || '',
            allowedGenders: academy.allowedGenders || [],
            allowDisability: academy.allowDisability || false,
            onlyForDisabled: academy.onlyForDisabled || false,
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
            searchLocation: academy.searchLocation || '',
            houseNumber: academy.houseNumber || '',
            streetName: academy.streetName || '',
            latitude: academy.latitude || '',
            longitude: academy.longitude || '',
            selectedSports: academy.selectedSports || (academy.sport 
                ? (typeof academy.sport === 'string' 
                    ? academy.sport.split(',').map(s => {
                        const trimmed = s.trim();
                        // Convert to number if it's numeric, otherwise keep as string
                        return /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : trimmed;
                    }).filter(s => s !== '' && s !== null && s !== undefined)
                    : Array.isArray(academy.sport) ? academy.sport : [academy.sport])
                : []),
            media: academy.media || [],
            mediaBySport: (() => {
                // Initialize mediaBySport from academy data or create empty structure for selected sports
                const selectedSportsArray = academy.selectedSports || (academy.sport 
                    ? (typeof academy.sport === 'string' 
                        ? academy.sport.split(',').map(s => {
                            const trimmed = s.trim();
                            return /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : trimmed;
                        }).filter(s => s !== '' && s !== null && s !== undefined)
                        : Array.isArray(academy.sport) ? academy.sport : [academy.sport])
                    : []);
                const mediaBySport = academy.mediaBySport || {};
                // Ensure all selected sports have media objects initialized
                const result = { ...mediaBySport };
                selectedSportsArray.forEach(sportId => {
                    if (!result[sportId]) {
                        result[sportId] = {
                            description: '',
                            images: [],
                            videos: []
                        };
                    }
                });
                return result;
            })(),
            documents: academy.documents || [],
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
        // Reset flag after a short delay to allow form to render
        setTimeout(() => {
            formJustOpenedRef.current = false;
        }, 100);
    };

    const handleCloseAcademyModal = () => {
        setShowAcademyModal(false);
        setEditingAcademy(null);
        setActiveTab('basic');
        setIfscError('');
        setSportSearchTerm('');
        setFieldErrors({});
        setAcademyForm({
            centerName: '',
            phoneNumber: '',
            email: '',
            experience: '',
            allowedGenders: [],
            allowDisability: false,
            onlyForDisabled: false,
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
            searchLocation: '',
            houseNumber: '',
            streetName: '',
            latitude: '',
            longitude: '',
            selectedSports: [],
            media: [],
            mediaBySport: {},
            documents: [],
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
        if (returnToDetail) {
            setDetailAcademy(returnToDetail);
            setViewMode('detail');
            setReturnToDetail(null);
        } else {
            setDetailAcademy(null);
            setViewMode('list');
        }
        // Clean up map
        if (marker) {
            marker.setMap(null);
            setMarker(null);
        }
        if (map) {
            setMap(null);
        }
        // Reset file inputs
        if (imagesInputRef.current) {
            imagesInputRef.current.value = '';
        }
        if (videosInputRef.current) {
            videosInputRef.current.value = '';
        }
        if (documentsInputRef.current) {
            documentsInputRef.current.value = '';
        }
    };

    const handleSaveAcademy = () => {
        if (!academyForm.centerName || !academyForm.phoneNumber || !academyForm.email) {
            alert('Please fill in all required Basic fields (Center Name, Phone Number, Email)');
            setActiveTab('basic');
            return;
        }
        // Validate Experience
        if (!academyForm.experience || academyForm.experience.trim() === '') {
            alert('Please enter Experience (years)');
            setActiveTab('basic');
            return;
        }
        // Validate Allowed Genders
        if (!academyForm.allowedGenders || academyForm.allowedGenders.length === 0) {
            alert('Please select at least one Allowed Gender');
            setActiveTab('basic');
            return;
        }
        // Validate description for each selected sport
        if (academyForm.selectedSports.length > 0) {
            for (const sportId of academyForm.selectedSports) {
                const sportMedia = academyForm.mediaBySport[sportId];
                if (!sportMedia || !sportMedia.description || sportMedia.description.trim().length < 5) {
                    const sport = sports.find(s => s.id === sportId);
                    alert(`Please enter a description with at least 5 characters for ${sport ? sport.name : 'the selected sport'}`);
                    setActiveTab('media');
                    return;
                }
            }
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

    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return '';
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    const exportAcademiesToCSV = () => {
        // CSV headers
        const headers = ['First Name', 'Last Name', 'Academy Name', 'Email', 'Mobile Number', 'Added By', 'Created Date', 'Time (HH:MM)', 'Status', 'City', 'State'];
        
        // Prepare data rows
        const rows = academies.map(academy => {
            // Get first name and last name from academyForm fields or ownerName
            let firstName = '';
            let lastName = '';
            
            if (academy.firstName && academy.lastName) {
                firstName = academy.firstName;
                lastName = academy.lastName;
            } else if (academy.ownerName) {
                const nameParts = academy.ownerName.trim().split(' ');
                firstName = nameParts[0] || '';
                lastName = nameParts.slice(1).join(' ') || '';
            }
            
            // Get email
            const email = academy.email || '';
            
            // Get mobile number
            const mobileNumber = academy.mobileNumber || academy.contact || academy.phoneNumber || '';
            
            // Get added by
            const addedBy = academy.addedBy || 'Admin';
            
            // Get created date and time
            let createDate = academy.createDate || '';
            let createTime = '';
            if (createDate) {
                createTime = formatTime(createDate);
            }
            
            // Get status
            const status = academy.status === 'active' ? 'Active' : (academy.status === 'inactive' ? 'Inactive' : 'Pending');
            
            // Get city and state
            const city = academy.city || '';
            const state = academy.state || '';
            
            return [
                firstName,
                lastName,
                email,
                mobileNumber,
                addedBy,
                createDate,
                createTime,
                status,
                city,
                state
            ];
        });
        
        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => {
                // Escape commas and quotes in cell values
                const cellStr = String(cell || '');
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            }).join(','))
        ].join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `academies_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Individual field validation functions for onBlur
    const validatePhoneNumber = () => {
        const errors = {};
        if (!academyForm.phoneNumber || !academyForm.phoneNumber.trim()) {
            errors.phoneNumber = 'Mobile Number is required';
        } else {
            const phoneNumber = academyForm.phoneNumber.trim();
            if (phoneNumber.length !== 10) {
                errors.phoneNumber = 'Mobile Number must be exactly 10 digits';
            } else if (!/^[6789]/.test(phoneNumber)) {
                errors.phoneNumber = 'Mobile Number must start with 6, 7, 8, or 9';
            }
        }
        
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (errors.phoneNumber) {
                newErrors.phoneNumber = errors.phoneNumber;
            } else {
                delete newErrors.phoneNumber;
            }
            return newErrors;
        });
    };

    const validateEmail = () => {
        const errors = {};
        if (!academyForm.email || !academyForm.email.trim()) {
            errors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(academyForm.email.trim())) {
                errors.email = 'Please enter a valid email address (e.g., abc@example.com)';
            }
        }
        
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (errors.email) {
                newErrors.email = errors.email;
            } else {
                delete newErrors.email;
            }
            return newErrors;
        });
    };

    const validateMinimumAge = () => {
        const errors = {};
        if (!academyForm.minimumAge || !academyForm.minimumAge.trim()) {
            errors.minimumAge = 'Minimum Age is required';
        } else {
            const minAge = parseInt(academyForm.minimumAge.trim());
            if (isNaN(minAge) || minAge < 3) {
                errors.minimumAge = 'Minimum Age must be 3 or above';
            } else if (minAge > 18) {
                errors.minimumAge = 'Minimum Age must be 18 or below';
            }
        }
        
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (errors.minimumAge) {
                newErrors.minimumAge = errors.minimumAge;
            } else {
                delete newErrors.minimumAge;
            }
            return newErrors;
        });
    };

    const validateMaximumAge = () => {
        const errors = {};
        if (!academyForm.maximumAge || !academyForm.maximumAge.trim()) {
            errors.maximumAge = 'Maximum Age is required';
        } else {
            const maxAge = parseInt(academyForm.maximumAge.trim());
            if (isNaN(maxAge) || maxAge > 18) {
                errors.maximumAge = 'Maximum Age must be 18 or below';
            } else if (maxAge < 3) {
                errors.maximumAge = 'Maximum Age must be 3 or above';
            } else {
                // Check if maximum age is greater than minimum age
                if (academyForm.minimumAge && academyForm.minimumAge.trim()) {
                    const minAge = parseInt(academyForm.minimumAge.trim());
                    if (!isNaN(minAge) && maxAge <= minAge) {
                        errors.maximumAge = 'Maximum Age must be greater than Minimum Age';
                    }
                }
            }
        }
        
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (errors.maximumAge) {
                newErrors.maximumAge = errors.maximumAge;
            } else {
                delete newErrors.maximumAge;
            }
            return newErrors;
        });
    };

    // Validation functions for each tab
    const validateBasicTab = () => {
        const errors = {};
        let isValid = true;

        if (!academyForm.centerName || !academyForm.centerName.trim()) {
            errors.centerName = 'Center Name is required';
            isValid = false;
        }
        
        // Phone number validation: must be 10 digits and start with 6, 7, 8, or 9
        if (!academyForm.phoneNumber || !academyForm.phoneNumber.trim()) {
            errors.phoneNumber = 'Mobile Number is required';
            isValid = false;
        } else {
            const phoneNumber = academyForm.phoneNumber.trim();
            if (phoneNumber.length !== 10) {
                errors.phoneNumber = 'Mobile Number must be exactly 10 digits';
                isValid = false;
            } else if (!/^[6789]/.test(phoneNumber)) {
                errors.phoneNumber = 'Mobile Number must start with 6, 7, 8, or 9';
                isValid = false;
            }
        }
        
        // Email validation: must be valid email format
        if (!academyForm.email || !academyForm.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(academyForm.email.trim())) {
                errors.email = 'Please enter a valid email address (e.g., abc@example.com)';
                isValid = false;
            }
        }
        
        if (!academyForm.logo && !academyForm.logoPreview) {
            errors.logo = 'Center Logo is required';
            isValid = false;
        }
        if (!academyForm.experience || academyForm.experience.trim() === '') {
            errors.experience = 'Experience is required';
            isValid = false;
        }
        if (!academyForm.allowedGenders || academyForm.allowedGenders.length === 0) {
            errors.allowedGenders = 'Allowed Genders is required';
            isValid = false;
        }
        
        // Minimum age validation: must be >= 3
        if (!academyForm.minimumAge || !academyForm.minimumAge.trim()) {
            errors.minimumAge = 'Minimum Age is required';
            isValid = false;
        } else {
            const minAge = parseInt(academyForm.minimumAge.trim());
            if (isNaN(minAge) || minAge < 3) {
                errors.minimumAge = 'Minimum Age must be 3 or above';
                isValid = false;
            }
        }
        
        // Maximum age validation: must be <= 18
        if (!academyForm.maximumAge || !academyForm.maximumAge.trim()) {
            errors.maximumAge = 'Maximum Age is required';
            isValid = false;
        } else {
            const maxAge = parseInt(academyForm.maximumAge.trim());
            if (isNaN(maxAge) || maxAge > 18) {
                errors.maximumAge = 'Maximum Age must be 18 or below';
                isValid = false;
            }
        }
        
        // Check if maximum age is greater than minimum age
        if (academyForm.minimumAge && academyForm.maximumAge) {
            const minAge = parseInt(academyForm.minimumAge.trim());
            const maxAge = parseInt(academyForm.maximumAge.trim());
            if (!isNaN(minAge) && !isNaN(maxAge) && maxAge <= minAge) {
                errors.maximumAge = 'Maximum Age must be greater than Minimum Age';
                isValid = false;
            }
        }

        // Clear errors for fields that are valid
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(errors).forEach(key => {
                if (!errors[key]) {
                    delete newErrors[key];
                }
            });
            return { ...newErrors, ...errors };
        });

        return isValid;
    };

    const validateLocationTab = () => {
        const errors = {};
        let isValid = true;

        // Use streetName for validation (it's the field in Location tab)
        if (!academyForm.streetName || !academyForm.streetName.trim()) {
            errors.addressLineOne = 'Address Line One is required';
            isValid = false;
        }
        if (!academyForm.state || !academyForm.state.trim()) {
            errors.state = 'State is required';
            isValid = false;
        }
        if (!academyForm.city || !academyForm.city.trim()) {
            errors.city = 'City is required';
            isValid = false;
        }
        const pin = academyForm.pincode ? academyForm.pincode.trim() : '';
        if (!pin) {
            errors.pincode = 'Pincode is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(pin)) {
            errors.pincode = 'Pincode must be exactly 6 digits';
            isValid = false;
        }

        // Clear errors for fields that are valid
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(errors).forEach(key => {
                if (!errors[key]) {
                    delete newErrors[key];
                }
            });
            return { ...newErrors, ...errors };
        });

        return isValid;
    };

    const validateSportsTab = () => {
        const errors = {};
        let isValid = true;

        if (!selectedSportsSafe || selectedSportsSafe.length === 0) {
            errors.selectedSports = 'At least one Sport is required';
            isValid = false;
        }

        // Clear errors for fields that are valid
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(errors).forEach(key => {
                if (!errors[key]) {
                    delete newErrors[key];
                }
            });
            return { ...newErrors, ...errors };
        });

        return isValid;
    };

    const validateMediaTab = () => {
        const mediaDescErrors = {};
        let isValid = true;

        if (selectedSportsSafe.length > 0) {
            for (const sportId of selectedSportsSafe) {
                const sportMedia = academyForm.mediaBySport[sportId];
                if (!sportMedia || !sportMedia.description || sportMedia.description.trim().length < 5) {
                    const sport = sports.find(s => s.id === sportId);
                    mediaDescErrors[sportId] = `Description for ${sport ? sport.name : 'selected sport'} is required (minimum 5 characters)`;
                    isValid = false;
                }
            }
        }

        // Clear errors for fields that are valid
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            // Remove prior media description errors (both map and legacy keys)
            delete newErrors.mediaDescription;
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('media_description_')) {
                    delete newErrors[key];
                }
            });
            if (Object.keys(mediaDescErrors).length > 0) {
                newErrors.mediaDescription = mediaDescErrors;
            }
            return newErrors;
        });

        return isValid;
    };

    const validateTimingsTab = () => {
        const errors = {};
        let isValid = true;

        if (!academyForm.callTimeFrom || !academyForm.callTimeFrom.trim()) {
            errors.callTimeFrom = 'Call Time (From) is required';
            isValid = false;
        }
        if (!academyForm.callTimeTo || !academyForm.callTimeTo.trim()) {
            errors.callTimeTo = 'Call Time (To) is required';
            isValid = false;
        }

        setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (errors.callTimeFrom) {
                newErrors.callTimeFrom = errors.callTimeFrom;
            } else {
                delete newErrors.callTimeFrom;
            }
            if (errors.callTimeTo) {
                newErrors.callTimeTo = errors.callTimeTo;
            } else {
                delete newErrors.callTimeTo;
            }
            return newErrors;
        });

        return isValid;
    };

    const validateBankingTab = () => {
        const errors = {};
        let isValid = true;

        if (!academyForm.paymentMethod || !academyForm.paymentMethod.trim()) {
            errors.paymentMethod = 'Payment Method is required';
            isValid = false;
        }
        if (!academyForm.accountPersonName || !academyForm.accountPersonName.trim()) {
            errors.accountPersonName = 'Account Person Name is required';
            isValid = false;
        }
        if (!academyForm.bankName || !academyForm.bankName.trim()) {
            errors.bankName = 'Bank Name is required';
            isValid = false;
        }
        if (!academyForm.accountNumber || !academyForm.accountNumber.trim()) {
            errors.accountNumber = 'Account Number is required';
            isValid = false;
        }
        if (!academyForm.ifscCode || !academyForm.ifscCode.trim()) {
            errors.ifscCode = 'IFSC Code is required';
            isValid = false;
        } else if (!validateIFSC(academyForm.ifscCode)) {
            errors.ifscCode = 'IFSC Code is invalid';
            isValid = false;
        }

        // Clear errors for fields that are valid
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(errors).forEach(key => {
                if (!errors[key]) {
                    delete newErrors[key];
                }
            });
            return { ...newErrors, ...errors };
        });

        return isValid;
    };

    const validateTab = (tabId) => {
        switch (tabId) {
            case 'basic':
                return validateBasicTab();
            case 'location':
                return validateLocationTab();
            case 'sports':
                return validateSportsTab();
            case 'media':
                return validateMediaTab();
            case 'timings':
                return validateTimingsTab();
            case 'banking':
                return validateBankingTab();
            default:
                return true;
        }
    };

    const isTabAccessible = (tabId) => {
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
        
        // Can always access current tab or previous tabs
        if (tabIndex <= currentTabIndex) {
            return true;
        }
        
        // For next tabs, use silent validation to check if all previous tabs are complete
        // Must complete tabs in order: Basic -> Location -> Sports -> Media -> Timings -> Banking
        // Use silent validation (no alerts) to avoid showing errors during render
        for (let i = 0; i < tabIndex; i++) {
            if (!validateTabSilent(tabs[i].id)) {
                return false;
            }
        }
        return true;
    };

    // Silent validation (no alerts) for checking tab accessibility during render
    const validateTabSilent = (tabId) => {
        switch (tabId) {
            case 'basic':
                return Boolean(
                    academyForm.centerName?.trim() && 
                    academyForm.phoneNumber?.trim() && 
                    academyForm.email?.trim() &&
                    (academyForm.logo || academyForm.logoPreview) &&
                    academyForm.experience?.trim() &&
                    academyForm.allowedGenders?.length > 0 &&
                    academyForm.minimumAge?.trim() &&
                    academyForm.maximumAge?.trim()
                );
            case 'location':
                return Boolean(
                    academyForm.addressLineOne?.trim() &&
                    academyForm.state?.trim() &&
                    academyForm.city?.trim() &&
                    /^\d{6}$/.test((academyForm.pincode || '').trim())
                );
            case 'sports':
                return Boolean(selectedSportsSafe?.length > 0);
            case 'media':
                if (selectedSportsSafe.length > 0) {
                    for (const sportId of selectedSportsSafe) {
                        const sportMedia = academyForm.mediaBySport[sportId];
                        if (!sportMedia || !sportMedia.description || sportMedia.description.trim().length < 5) {
                            return false;
                        }
                    }
                }
                return true;
            case 'timings':
                return Boolean(
                    academyForm.callTimeFrom?.trim() &&
                    academyForm.callTimeTo?.trim()
                );
            case 'banking':
                return Boolean(
                    academyForm.paymentMethod?.trim() &&
                    academyForm.accountPersonName?.trim() &&
                    academyForm.bankName?.trim() &&
                    academyForm.accountNumber?.trim() &&
                    academyForm.ifscCode?.trim() &&
                    validateIFSC(academyForm.ifscCode)
                );
            default:
                return true;
        }
    };

    const handleTabClick = (tabId) => {
        // Don't validate if form just opened (prevents alerts on initial render)
        if (formJustOpenedRef.current) {
            setActiveTab(tabId);
            return;
        }
        
        // Prevent navigation if tab is not accessible
        if (!isTabAccessible(tabId)) {
            // Find the first invalid tab using silent validation first
            const tabIndex = tabs.findIndex(t => t.id === tabId);
            for (let i = 0; i < tabIndex; i++) {
                if (!validateTabSilent(tabs[i].id)) {
                    // Only show alert when user actually tries to navigate
                    // Use validateTab to get the specific error message
                    validateTab(tabs[i].id);
                    setActiveTab(tabs[i].id);
                    return;
                }
            }
            return;
        }

        // If trying to move past sports, ensure at least one sport is selected
        const targetIndex = tabs.findIndex(t => t.id === tabId);
        const sportsIndex = tabs.findIndex(t => t.id === 'sports');
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (targetIndex > sportsIndex && !ensureSportsSelected()) {
            setActiveTab('sports');
            return;
        }
        
        setActiveTab(tabId);
    };

    const ensureSportsSelected = () => {
        if (!selectedSportsSafe || selectedSportsSafe.length === 0) {
            setFieldErrors(prev => ({ ...prev, selectedSports: 'At least one Sport is required' }));
            return false;
        }
        return true;
    };

    const handleNextTab = () => {
        const sportsIndex = tabs.findIndex(t => t.id === 'sports');
        const activeIndex = tabs.findIndex(t => t.id === activeTab);

        // Extra guard: if we're on or past Sports, require at least one sport
        if (activeIndex >= sportsIndex && !ensureSportsSelected()) {
            setActiveTab('sports');
            return;
        }
        // Validate current tab before proceeding
        if (!validateTab(activeTab)) {
            return;
        }
        
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

    // Get unique "Added By" values
    const uniqueAddedBy = [...new Set(academies.map(academy => academy.addedBy || 'Admin').filter(Boolean))];

    const filteredAcademies = academies.filter(academy => {
        // Search filter
        const matchesSearch = academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            academy.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && academy.status === 'active') ||
            (statusFilter === 'inactive' && academy.status === 'inactive');
        
        // Added By filter
        const matchesAddedBy = addedByFilter === 'all' || 
            (academy.addedBy || 'Admin') === addedByFilter;
        
        // Sports filter
        const matchesSports = (() => {
            if (sportsFilter === 'all') return true;
            const sportId = sportsFilter;
            // Handle different formats: comma-separated string, array, or selectedSports
            if (academy.selectedSports && Array.isArray(academy.selectedSports)) {
                return academy.selectedSports.includes(parseInt(sportId)) || academy.selectedSports.includes(sportId);
            }
            if (academy.sport) {
                if (typeof academy.sport === 'string') {
                    const sportIds = academy.sport.split(',').map(s => s.trim());
                    return sportIds.includes(sportId.toString()) || sportIds.includes(parseInt(sportId).toString());
                }
                if (Array.isArray(academy.sport)) {
                    return academy.sport.includes(parseInt(sportId)) || academy.sport.includes(sportId);
                }
            }
            return false;
        })();
        
        return matchesSearch && matchesStatus && matchesAddedBy && matchesSports;
    });

    // Calculate stats
    const totalAcademies = academies.length;
    const activeAcademies = academies.filter(academy => academy.status === 'active').length;

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
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
                {renderConfirmModal()}
                {logoCropper.isOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '16px'
                        }}
                        onMouseMove={handleCropMouseMove}
                        onMouseUp={handleCropMouseUp}
                        onMouseLeave={handleCropMouseUp}
                    >
                        <div
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '20px',
                                width: '520px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Crop Logo</div>
                                <button
                                    type="button"
                                    onClick={closeLogoCropper}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: '#94a3b8'
                                    }}
                                    aria-label="Close cropper"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div
                                style={{
                                    width: `${CROP_BOX_SIZE}px`,
                                    height: `${CROP_BOX_SIZE}px`,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '2px solid #e2e8f0',
                                    margin: '0 auto 16px',
                                    position: 'relative',
                                    backgroundColor: '#0f172a'
                                }}
                                onMouseDown={handleCropMouseDown}
                            >
                                {logoCropper.imageSrc && (
                                    <img
                                        src={logoCropper.imageSrc}
                                        alt="Crop preview"
                                        draggable={false}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: `translate(-50%, -50%) translate(${logoCropper.pos.x}px, ${logoCropper.pos.y}px) scale(${logoCropper.baseScale * logoCropper.scale})`,
                                            transformOrigin: 'center center',
                                            width: `${logoCropper.imgWidth}px`,
                                            height: `${logoCropper.imgHeight}px`,
                                            userSelect: 'none',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b', width: '60px' }}>Zoom</span>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="3"
                                    step="0.05"
                                    value={logoCropper.scale}
                                    onChange={handleCropZoom}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ fontSize: '12px', color: '#0f172a', width: '50px', textAlign: 'right' }}>
                                    {(logoCropper.scale * 100).toFixed(0)}%
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={closeLogoCropper}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        color: '#0f172a',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmLogoCrop}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#023B84',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontWeight: 700
                                    }}
                                >
                                    Save Logo
                                </button>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                                Upload up to 50MB (final cropped under 5MB).
                            </div>
                        </div>
                    </div>
                )}
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
                                onClick={() => handleTabClick(tab.id)}
                                disabled={!isTabAccessible(tab.id)}
                                style={{
                                    padding: '12px 20px',
                                    borderWidth: isActive ? '1px' : '0',
                                    borderStyle: isActive ? 'solid' : 'none',
                                    borderColor: isActive ? '#e2e8f0' : 'transparent',
                                    background: isActive ? '#ffffff' : 'transparent',
                                    borderRadius: isActive ? '8px' : '0',
                                    color: isActive ? '#0f172a' : (!isTabAccessible(tab.id) ? '#323e4c' : '#64748b'),
                                    fontWeight: isActive ? '700' : '500',
                                    fontSize: '14px',
                                    cursor: isTabAccessible(tab.id) ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    flex: '1',
                                    textAlign: 'center',
                                    fontFamily: navFontFamily,
                                    opacity: isTabAccessible(tab.id) ? 1 : 0.5
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
                                    style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.centerName ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.centerName}
                                    onChange={(e) => {
                                        setAcademyForm({ ...academyForm, centerName: e.target.value });
                                        if (fieldErrors.centerName) {
                                            setFieldErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.centerName;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Enter center name"
                                />
                                {fieldErrors.centerName && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                        {fieldErrors.centerName}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
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
                                            style={{ ...styles.input, marginBottom: 0, flex: 1, fontFamily: navFontFamily, borderColor: fieldErrors.phoneNumber ? '#ef4444' : styles.input.borderColor }}
                                            value={academyForm.phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                // Allow any number input, validation will check the value
                                                setAcademyForm({ ...academyForm, phoneNumber: value.slice(0, 10) });
                                                // Clear error if value becomes valid
                                                if (value && value.length === 10 && /^[6789]/.test(value)) {
                                                    if (fieldErrors.phoneNumber) {
                                                        setFieldErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.phoneNumber;
                                                            return newErrors;
                                                        });
                                                    }
                                                }
                                            }}
                                            onBlur={validatePhoneNumber}
                                            placeholder="Enter 10-digit mobile number (Starts with 6,7,8,9)"
                                            maxLength={10}
                                        />
                                    </div>
                                    {fieldErrors.phoneNumber && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.phoneNumber}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Email <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.email ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.email}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, email: e.target.value });
                                            if (fieldErrors.email) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.email;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={validateEmail}
                                        placeholder="center@example.com"
                                    />
                                    {fieldErrors.email && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>
                                {/* Experience */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Experience <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.experience ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.experience}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setAcademyForm({ ...academyForm, experience: value });
                                            if (fieldErrors.experience) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.experience;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder="Enter years"
                                        min="0"
                                        required
                                    />
                                    {fieldErrors.experience && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.experience}
                                        </div>
                                    )}
                                </div>

                                {/* Allowed Genders */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Allowed Genders <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {['Male', 'Female', 'Other'].map((gender) => (
                                            <label
                                                key={gender}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontFamily: navFontFamily
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={academyForm.allowedGenders.includes(gender)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAcademyForm({
                                                                ...academyForm,
                                                                allowedGenders: [...academyForm.allowedGenders, gender]
                                                            });
                                                        } else {
                                                            setAcademyForm({
                                                                ...academyForm,
                                                                allowedGenders: academyForm.allowedGenders.filter(g => g !== gender)
                                                            });
                                                        }
                                                        if (fieldErrors.allowedGenders) {
                                                            setFieldErrors(prev => {
                                                                const newErrors = { ...prev };
                                                                delete newErrors.allowedGenders;
                                                                return newErrors;
                                                            });
                                                        }
                                                    }}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <span>{gender}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {fieldErrors.allowedGenders && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.allowedGenders}
                                        </div>
                                    )}
                                </div>

                                {/* Allow Disability */}
                                <div>
                                    <div style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Allow Disability <span style={{ color: '#ef4444' }}>*</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '8px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: navFontFamily }}>
                                            <input
                                                type="radio"
                                                name="allowDisability"
                                                id="allowDisabilityYes"
                                                checked={academyForm.allowDisability === true}
                                                onChange={() => setAcademyForm({ ...academyForm, allowDisability: true })}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    margin: 0
                                                }}
                                            />
                                            <label 
                                                htmlFor="allowDisabilityYes"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    margin: 0,
                                                    userSelect: 'none'
                                                }}
                                            >
                                                Yes
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: navFontFamily }}>
                                            <input
                                                type="radio"
                                                name="allowDisability"
                                                id="allowDisabilityNo"
                                                checked={academyForm.allowDisability === false}
                                                onChange={() => setAcademyForm({ ...academyForm, allowDisability: false })}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    margin: 0
                                                }}
                                            />
                                            <label 
                                                htmlFor="allowDisabilityNo"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    margin: 0,
                                                    userSelect: 'none'
                                                }}
                                            >
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Only For Disabled */}
                                <div>
                                    <div style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Only For Disabled <span style={{ color: '#ef4444' }}>*</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '8px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: navFontFamily }}>
                                            <input
                                                type="radio"
                                                name="onlyForDisabled"
                                                id="onlyForDisabledYes"
                                                checked={academyForm.onlyForDisabled === true}
                                                onChange={() => setAcademyForm({ ...academyForm, onlyForDisabled: true })}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    margin: 0
                                                }}
                                            />
                                            <label 
                                                htmlFor="onlyForDisabledYes"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    margin: 0,
                                                    userSelect: 'none'
                                                }}
                                            >
                                                Yes
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: navFontFamily }}>
                                            <input
                                                type="radio"
                                                name="onlyForDisabled"
                                                id="onlyForDisabledNo"
                                                checked={academyForm.onlyForDisabled === false}
                                                onChange={() => setAcademyForm({ ...academyForm, onlyForDisabled: false })}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    margin: 0
                                                }}
                                            />
                                            <label 
                                                htmlFor="onlyForDisabledNo"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    margin: 0,
                                                    userSelect: 'none'
                                                }}
                                            >
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Left Column: Logo */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Center Logo <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{
                                        border: `2px dashed ${fieldErrors.logo ? '#ef4444' : '#cbd5e1'}`,
                                        borderRadius: '8px',
                                        padding: '40px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#fafafa',
                                        transition: 'all 0.2s ease',
                                        height: '100%',
                                        width: '100%',
                                        minHeight: '220px',
                                        maxHeight: '220px',
                                        minWidth: '220px',
                                        maxWidth: '220px',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
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
                                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                                                    <img src={academyForm.logoPreview} alt="Logo preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px', display: 'block' }} />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAcademyForm({ ...academyForm, logo: null, logoPreview: '' });
                                                            if (fieldErrors.logo) {
                                                                setFieldErrors(prev => {
                                                                    const newErrors = { ...prev };
                                                                    delete newErrors.logo;
                                                                    return newErrors;
                                                                });
                                                            }
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f97316',
                                                            color: '#fff',
                                                            border: '2px solid #fff',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            zIndex: 10,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#ea580c';
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#f97316';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}
                                                        title="Delete logo"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
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
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>PNG/JPG up to 50MB (final cropped under 5MB)</div>
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleLogoUpload}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {fieldErrors.logo && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.logo}
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Empty space to align with logo */}
                                <div></div>
                            </div>

                            {/* Minimum and Maximum Age - Below the logo */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Minimum Age <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.minimumAge ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.minimumAge}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow any number input, validation will check the value
                                            setAcademyForm({ ...academyForm, minimumAge: value });
                                            // Clear error if value becomes valid
                                            if (value && !isNaN(parseInt(value)) && parseInt(value) >= 3 && parseInt(value) <= 18) {
                                                if (fieldErrors.minimumAge) {
                                                    setFieldErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.minimumAge;
                                                        return newErrors;
                                                    });
                                                }
                                            }
                                        }}
                                        onBlur={validateMinimumAge}
                                        placeholder="e.g., 3"
                                    />
                                    {fieldErrors.minimumAge && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.minimumAge}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Maximum Age <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.maximumAge ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.maximumAge}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow any number input, validation will check the value
                                            setAcademyForm({ ...academyForm, maximumAge: value });
                                            // Clear error if value becomes valid
                                            if (value && !isNaN(parseInt(value)) && parseInt(value) >= 3 && parseInt(value) <= 18) {
                                                if (fieldErrors.maximumAge) {
                                                    setFieldErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.maximumAge;
                                                        return newErrors;
                                                    });
                                                }
                                            }
                                        }}
                                        onBlur={validateMaximumAge}
                                        placeholder="e.g., 18"
                                    />
                                    {fieldErrors.maximumAge && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.maximumAge}
                                        </div>
                                    )}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Search Location */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Search Location <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        <input
                                            type="text"
                                            style={{ ...styles.input, paddingLeft: '40px', fontFamily: navFontFamily }}
                                            value={academyForm.searchLocation}
                                            onChange={(e) => setAcademyForm({ ...academyForm, searchLocation: e.target.value })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleSearchLocation();
                                                }
                                            }}
                                            placeholder="Search for a location..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Map Location */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Map Location
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            backgroundColor: '#023B84',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            fontFamily: navFontFamily,
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#022d6b'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#023B84'}
                                    >
                                        <Navigation size={16} />
                                        Use Current Location
                                    </button>
                                </div>
                                <div
                                    ref={mapContainerRef}
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        overflow: 'hidden'
                                    }}
                                />
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontFamily: navFontFamily }}>
                                    Click on the map or drag the marker to set location
                                </p>
                            </div>

                            {/* House No/Building Name */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    <MapPin size={16} color="#64748b" />
                                    House No/Building Name
                                </label>
                                <input
                                    type="text"
                                    style={{ ...styles.input, fontFamily: navFontFamily }}
                                    value={academyForm.houseNumber}
                                    onChange={(e) => setAcademyForm({ ...academyForm, houseNumber: e.target.value })}
                                    placeholder="Enter house number or building name"
                                />
                            </div>

                            {/* Street Name / Area */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    <MapPin size={16} color="#64748b" />
                                    Street Name / Area <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.addressLineOne ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.streetName}
                                    onChange={(e) => {
                                        setAcademyForm({ ...academyForm, streetName: e.target.value, addressLineOne: e.target.value });
                                        if (fieldErrors.addressLineOne) {
                                            setFieldErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.addressLineOne;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Enter street name or area"
                                />
                                {fieldErrors.addressLineOne && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                        {fieldErrors.addressLineOne}
                                    </div>
                                )}
                            </div>

                            {/* State and City */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        State <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        style={{ ...styles.select, fontFamily: navFontFamily, borderColor: fieldErrors.state ? '#ef4444' : styles.select.borderColor }}
                                        value={academyForm.state}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, state: e.target.value, city: '' });
                                            if (fieldErrors.state) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.state;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">Select state</option>
                                        {sortedStates.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.state && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.state}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        City <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        style={{ ...styles.select, fontFamily: navFontFamily, borderColor: fieldErrors.city ? '#ef4444' : styles.select.borderColor }}
                                        value={academyForm.city}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, city: e.target.value });
                                            if (fieldErrors.city) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.city;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        disabled={!academyForm.state}
                                    >
                                        <option value="">{academyForm.state ? 'Select city' : 'Select state first'}</option>
                                        {academyForm.state && sortedCitiesByState[academyForm.state] && sortedCitiesByState[academyForm.state].map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.city && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.city}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pincode */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Pincode <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={{ ...styles.input, fontFamily: navFontFamily, borderColor: fieldErrors.pincode ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.pincode}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setAcademyForm({ ...academyForm, pincode: cleaned });
                                        if (/^\d{6}$/.test(cleaned) && fieldErrors.pincode) {
                                            setFieldErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.pincode;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Enter 6-digit pincode"
                                    maxLength={6}
                                    onBlur={() => {
                                        const pin = (academyForm.pincode || '').trim();
                                        if (!pin) {
                                            setFieldErrors(prev => ({ ...prev, pincode: 'Pincode is required' }));
                                        } else if (!/^\d{6}$/.test(pin)) {
                                            setFieldErrors(prev => ({ ...prev, pincode: 'Pincode must be exactly 6 digits' }));
                                        }
                                    }}
                                />
                                {fieldErrors.pincode && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                        {fieldErrors.pincode}
                                    </div>
                                )}
                            </div>

                            {/* Latitude and Longitude (read-only, populated from map) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Latitude <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={{ 
                                            ...styles.input, 
                                            fontFamily: navFontFamily,
                                            backgroundColor: '#f9fafb',
                                            cursor: 'not-allowed'
                                        }}
                                        value={academyForm.latitude}
                                        readOnly
                                        placeholder="Latitude"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                        Longitude <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={{ 
                                            ...styles.input, 
                                            fontFamily: navFontFamily,
                                            backgroundColor: '#f9fafb',
                                            cursor: 'not-allowed'
                                        }}
                                        value={academyForm.longitude}
                                        readOnly
                                        placeholder="Longitude"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sports Tab */}
                    {activeTab === 'sports' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: navFontFamily }}>
                                    Select Sports <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                
                                {/* Search Bar */}
                                <div style={{ position: 'relative', marginBottom: '20px' }}>
                                    <Search 
                                        size={18} 
                                        color="#94a3b8" 
                                        style={{ 
                                            position: 'absolute', 
                                            left: '12px', 
                                            top: '40%', 
                                            transform: 'translateY(-50%)', 
                                            pointerEvents: 'none' 
                                        }} 
                                    />
                                    <input
                                        type="text"
                                        style={{ 
                                            ...styles.input, 
                                            paddingLeft: '40px', 
                                            fontFamily: navFontFamily,
                                            width: '100%'
                                        }}
                                        value={sportSearchTerm}
                                        onChange={(e) => setSportSearchTerm(e.target.value)}
                                        placeholder="Search sports..."
                                    />
                                </div>

                                {/* Sports Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                                    gap: '16px',
                                    maxHeight: '500px',
                                    overflowY: 'auto',
                                    padding: '4px'
                                }}>
                                    {sports && sports.length > 0 ? (
                                        sports
                                            .filter(sport => 
                                                sport.name.toLowerCase().includes(sportSearchTerm.toLowerCase())
                                            )
                                            .map((sport) => {
                                                const isSelected = academyForm.selectedSports.includes(sport.id);
                                                return (
                                                    <div
                                                        key={sport.id}
                                                        onClick={() => handleSportToggle(sport.id)}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: '16px 12px',
                                                            borderRadius: '8px',
                                                            border: `1px solid ${isSelected ? '#023B84' : '#e2e8f0'}`,
                                                            backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            position: 'relative',
                                                            minHeight: '120px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = '#023B84';
                                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                                e.currentTarget.style.backgroundColor = '#ffffff';
                                                            }
                                                        }}
                                                    >
                                                        {/* Checkbox indicator */}
                                                        {isSelected && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '8px',
                                                                right: '8px',
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '4px',
                                                                backgroundColor: '#023B84',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#ffffff',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                ✓
                                                            </div>
                                                        )}
                                                        
                                                        {/* Sport Icon in Square */}
                                                        <div style={{
                                                            width: '64px',
                                                            height: '64px',
                                                            borderRadius: '8px',
                                                            backgroundColor: isSelected ? '#023B84' : '#f1f5f9',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '32px',
                                                            marginBottom: '12px',
                                                            border: `1px solid ${isSelected ? '#023B84' : '#e2e8f0'}`,
                                                            transition: 'all 0.2s ease'
                                                        }}>
                                                            {sport.icon || sport.image ? (
                                                                sport.image ? (
                                                                    <img 
                                                                        src={sport.image} 
                                                                        alt={sport.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px'
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span style={{ fontSize: '32px' }}>{sport.icon}</span>
                                                                )
                                                            ) : (
                                                                <span style={{ fontSize: '32px', color: isSelected ? '#ffffff' : '#64748b' }}>⚽</span>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Sport Name */}
                                                        <span style={{
                                                            fontSize: '13px',
                                                            fontWeight: '500',
                                                            color: isSelected ? '#023B84' : '#0f172a',
                                                            textAlign: 'center',
                                                            fontFamily: navFontFamily
                                                        }}>
                                                            {sport.name}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <div style={{ 
                                            gridColumn: '1 / -1', 
                                            textAlign: 'center', 
                                            padding: '40px',
                                            color: '#64748b',
                                            fontSize: '14px',
                                            fontFamily: navFontFamily
                                        }}>
                                            No sports available
                                        </div>
                                    )}
                                </div>
                                {fieldErrors.selectedSports && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontFamily: navFontFamily }}>
                                        {fieldErrors.selectedSports}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === 'media' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {selectedSportsSafe.length === 0 ? (
                                <div style={{ 
                                    padding: '40px', 
                                    textAlign: 'center', 
                                    color: '#64748b',
                                    fontSize: '14px',
                                    fontFamily: navFontFamily,
                                    border: '1px dashed #e2e8f0',
                                    borderRadius: '8px'
                                }}>
                                    Please select at least one sport in the Sports tab to add media
                                </div>
                            ) : (
                                selectedSportsSafe.map((sportId) => {
                                    const sport = sports.find(s => s.id === sportId);
                                    if (!sport) return null;
                                    
                                    const sportMedia = academyForm.mediaBySport[sportId] || {
                                        description: '',
                                        images: [],
                                        videos: []
                                    };
                                    
                                    return (
                                        <div key={sportId} style={{ 
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '24px',
                                            backgroundColor: '#ffffff'
                                        }}>
                                            <h3 style={{ 
                                                fontSize: '18px', 
                                                fontWeight: '700', 
                                                color: '#0f172a',
                                                fontFamily: navFontFamily,
                                                marginBottom: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}>
                                                {sport.image ? (
                                                    <img 
                                                        src={sport.image} 
                                                        alt={sport.name}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0'
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '24px' }}>{sport.icon || '🏆'}</span>
                                                )}
                                                {sport.name}
                                            </h3>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                {/* Description */}
                                                <div>
                                                    <label style={{ 
                                                        display: 'block', 
                                                        marginBottom: '8px', 
                                                        fontSize: '14px', 
                                                        fontWeight: '600', 
                                                        color: '#0f172a',
                                                        fontFamily: navFontFamily
                                                    }}>
                                                        Description <span style={{ color: '#ef4444' }}>*</span>
                                                    </label>
                                                    <textarea
                                                        placeholder={`Enter description for ${sport.name} (minimum 5 characters)`}
                                                        style={{ 
                                                            ...styles.input, 
                                                            fontFamily: navFontFamily,
                                                            minHeight: '80px',
                                                            resize: 'vertical',
                                                            borderColor: (fieldErrors.mediaDescription && fieldErrors.mediaDescription[sportId]) ? '#ef4444' : styles.input.borderColor
                                                        }}
                                                        value={sportMedia.description}
                                                        onChange={(e) => {
                                                            setAcademyForm(prev => ({
                                                                ...prev,
                                                                mediaBySport: {
                                                                    ...prev.mediaBySport,
                                                                    [sportId]: {
                                                                        ...prev.mediaBySport[sportId],
                                                                        description: e.target.value
                                                                    }
                                                                }
                                                            }));
                                                            // Inline validation on change
                                                            const val = e.target.value || '';
                                                            if (!val.trim() || val.trim().length < 5) {
                                                                setFieldErrors(prev => {
                                                                    const md = { ...(prev.mediaDescription || {}) };
                                                                    md[sportId] = 'Description is required (min 5 characters)';
                                                                    return { ...prev, mediaDescription: md };
                                                                });
                                                            } else if (fieldErrors.mediaDescription && fieldErrors.mediaDescription[sportId]) {
                                                                setFieldErrors(prev => {
                                                                    const md = { ...(prev.mediaDescription || {}) };
                                                                    delete md[sportId];
                                                                    const next = { ...prev };
                                                                    if (Object.keys(md).length > 0) {
                                                                        next.mediaDescription = md;
                                                                    } else {
                                                                        delete next.mediaDescription;
                                                                    }
                                                                    return next;
                                                                });
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            const val = e.target.value || '';
                                                            if (!val.trim() || val.trim().length < 5) {
                                                                setFieldErrors(prev => {
                                                                    const md = { ...(prev.mediaDescription || {}) };
                                                                    md[sportId] = 'Description is required (min 5 characters)';
                                                                    return { ...prev, mediaDescription: md };
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#64748b', 
                                                        marginTop: '4px',
                                                        fontFamily: navFontFamily
                                                    }}>
                                                        Minimum 5 characters required. Describe the facilities, coaching approach, or special features for {sport.name}.
                                                    </div>
                                                    {fieldErrors.mediaDescription && fieldErrors.mediaDescription[sportId] && (
                                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                                            {fieldErrors.mediaDescription[sportId]}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Images Upload */}
                                                <div>
                                                    <label style={{ 
                                                        display: 'block', 
                                                        marginBottom: '8px', 
                                                        fontSize: '14px', 
                                                        fontWeight: '600', 
                                                        color: '#0f172a',
                                                        fontFamily: navFontFamily
                                                    }}>
                                                        Images (Optional)
                                                    </label>
                                                    <div
                                                        onClick={() => {
                                                            setCurrentUploadContext({ sportId, type: 'images' });
                                                            imagesInputRef.current?.click();
                                                        }}
                                                        style={{
                                                            border: '2px dashed #e2e8f0',
                                                            borderRadius: '8px',
                                                            padding: '32px',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.borderColor = '#023B84';
                                                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                                        }}
                                                    >
                                                        <input
                                                            ref={imagesInputRef}
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            multiple
                                                            onChange={(e) => {
                                                                if (currentUploadContext.sportId === sportId && currentUploadContext.type === 'images') {
                                                                    handleFileUpload(e.target.files, 'images', sportId);
                                                                }
                                                                e.target.value = ''; // Reset input
                                                            }}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                            <Upload size={32} color="#64748b" />
                                                            <div style={{ 
                                                                color: '#023B84', 
                                                                fontWeight: '600',
                                                                fontFamily: navFontFamily
                                                            }}>
                                                                Click to upload images
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: navFontFamily }}>
                                                                PNG, JPG up to 5MB each
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {sportMedia.images && sportMedia.images.length > 0 && (
                                                        <div style={{ 
                                                            display: 'grid', 
                                                            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                                                            gap: '12px', 
                                                            marginTop: '16px' 
                                                        }}>
                                                            {sportMedia.images.map((img, index) => (
                                                                <div key={index} style={{ position: 'relative' }}>
                                                                    <img
                                                                        src={img.preview}
                                                                        alt={`Upload ${index + 1}`}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px',
                                                                            border: '1px solid #e2e8f0'
                                                                        }}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRemoveFile(index, 'images', sportId)}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '4px',
                                                                            right: '4px',
                                                                            background: 'rgba(0, 0, 0, 0.6)',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            cursor: 'pointer',
                                                                            color: '#ffffff'
                                                                        }}
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Videos Upload */}
                                                <div>
                                                    <label style={{ 
                                                        display: 'block', 
                                                        marginBottom: '8px', 
                                                        fontSize: '14px', 
                                                        fontWeight: '600', 
                                                        color: '#0f172a',
                                                        fontFamily: navFontFamily
                                                    }}>
                                                        Videos (Optional)
                                                    </label>
                                                    <div
                                                        onClick={() => {
                                                            setCurrentUploadContext({ sportId, type: 'videos' });
                                                            videosInputRef.current?.click();
                                                        }}
                                                        style={{
                                                            border: '2px dashed #e2e8f0',
                                                            borderRadius: '8px',
                                                            padding: '32px',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.borderColor = '#023B84';
                                                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                                        }}
                                                    >
                                                        <input
                                                            ref={videosInputRef}
                                                            type="file"
                                                            accept="video/mp4,video/quicktime,video/mov"
                                                            multiple
                                                            onChange={(e) => {
                                                                if (currentUploadContext.sportId === sportId && currentUploadContext.type === 'videos') {
                                                                    handleFileUpload(e.target.files, 'videos', sportId);
                                                                }
                                                                e.target.value = ''; // Reset input
                                                            }}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                            <Upload size={32} color="#64748b" />
                                                            <div style={{ 
                                                                color: '#023B84', 
                                                                fontWeight: '600',
                                                                fontFamily: navFontFamily
                                                            }}>
                                                                Click to upload videos
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: navFontFamily }}>
                                                                MP4, MOV up to 50MB each (thumbnail will be auto-generated)
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {sportMedia.videos && sportMedia.videos.length > 0 && (
                                                        <div style={{ 
                                                            display: 'grid', 
                                                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                                                            gap: '12px', 
                                                            marginTop: '16px' 
                                                        }}>
                                                            {sportMedia.videos.map((video, index) => (
                                                                <div key={index} style={{ position: 'relative' }}>
                                                                    <video
                                                                        src={video.preview}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px',
                                                                            border: '1px solid #e2e8f0'
                                                                        }}
                                                                        controls={false}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRemoveFile(index, 'videos', sportId)}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '4px',
                                                                            right: '4px',
                                                                            background: 'rgba(0, 0, 0, 0.6)',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            cursor: 'pointer',
                                                                            color: '#ffffff'
                                                                        }}
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Documents Upload - Academy Level (appears once) */}
                            <div style={{ 
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '24px',
                                backgroundColor: '#ffffff'
                            }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#0f172a',
                                    fontFamily: navFontFamily
                                }}>
                                    Documents (License, Certificates)
                                </label>
                                <div
                                    onClick={() => {
                                        setCurrentUploadContext({ sportId: null, type: 'documents' });
                                        documentsInputRef.current?.click();
                                    }}
                                    style={{
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '32px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#023B84';
                                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                    }}
                                >
                                    <input
                                        ref={documentsInputRef}
                                        type="file"
                                        accept="application/pdf,image/jpeg,image/jpg"
                                        multiple
                                        onChange={(e) => {
                                            if (currentUploadContext.type === 'documents') {
                                                handleFileUpload(e.target.files, 'documents');
                                            }
                                            e.target.value = ''; // Reset input
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <Upload size={32} color="#64748b" />
                                        <div style={{ 
                                            color: '#023B84', 
                                            fontWeight: '600',
                                            fontFamily: navFontFamily
                                        }}>
                                            Upload documents
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: navFontFamily }}>
                                            PDF, JPG up to 10MB each
                                        </div>
                                    </div>
                                </div>
                                {academyForm.documents && academyForm.documents.length > 0 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '8px', 
                                        marginTop: '16px' 
                                    }}>
                                        {academyForm.documents.map((doc, index) => (
                                            <div 
                                                key={index} 
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between',
                                                    padding: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f8fafc'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <FileText size={20} color="#64748b" />
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        color: '#0f172a',
                                                        fontFamily: navFontFamily
                                                    }}>
                                                        {doc.name}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFile(index, 'documents')}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <X size={16} color="#ef4444" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timings Tab */}
                    {activeTab === 'timings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Call Time (From) <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="time"
                                        style={{ ...styles.input, borderColor: fieldErrors.callTimeFrom ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.callTimeFrom}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, callTimeFrom: e.target.value });
                                            if (fieldErrors.callTimeFrom) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.callTimeFrom;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.callTimeFrom || !academyForm.callTimeFrom.trim()) {
                                                setFieldErrors(prev => ({ ...prev, callTimeFrom: 'Call Time (From) is required' }));
                                            }
                                        }}
                                    />
                                    {fieldErrors.callTimeFrom && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.callTimeFrom}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        Call Time (To) <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="time"
                                        style={{ ...styles.input, borderColor: fieldErrors.callTimeTo ? '#ef4444' : styles.input.borderColor }}
                                        value={academyForm.callTimeTo}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, callTimeTo: e.target.value });
                                            if (fieldErrors.callTimeTo) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.callTimeTo;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.callTimeTo || !academyForm.callTimeTo.trim()) {
                                                setFieldErrors(prev => ({ ...prev, callTimeTo: 'Call Time (To) is required' }));
                                            }
                                        }}
                                    />
                                    {fieldErrors.callTimeTo && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.callTimeTo}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Banking Tab */}                                   
                    {activeTab === 'banking' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Payment Method <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <select
                                        style={{ 
                                            ...styles.input, 
                                            borderColor: fieldErrors.paymentMethod ? '#ef4444' : styles.input.borderColor,
                                            marginLeft: '-6px',
                                            width: 'calc(100% + 6px)',
                                            paddingRight: '24px',
                                            appearance: 'auto',
                                            WebkitAppearance: 'auto',
                                            MozAppearance: 'auto',
                                            backgroundImage: 'initial',
                                            backgroundPosition: 'right center'
                                        }}
                                    value={academyForm.paymentMethod}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, paymentMethod: e.target.value });
                                            if (fieldErrors.paymentMethod) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.paymentMethod;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.paymentMethod || !academyForm.paymentMethod.trim()) {
                                                setFieldErrors(prev => ({ ...prev, paymentMethod: 'Payment Method is required' }));
                                            }
                                        }}
                                >
                                    <option value="">Select payment method</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="cash">Cash</option>
                                </select>
                                    {fieldErrors.paymentMethod && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.paymentMethod}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Account Person Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                        style={{ ...styles.input, borderColor: fieldErrors.accountPersonName ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.accountPersonName}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, accountPersonName: e.target.value });
                                            if (fieldErrors.accountPersonName) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.accountPersonName;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.accountPersonName || !academyForm.accountPersonName.trim()) {
                                                setFieldErrors(prev => ({ ...prev, accountPersonName: 'Account Person Name is required' }));
                                            }
                                        }}
                                    placeholder="Enter account holder name"
                                />
                                    {fieldErrors.accountPersonName && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.accountPersonName}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Bank Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                        style={{ ...styles.input, borderColor: fieldErrors.bankName ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.bankName}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, bankName: e.target.value });
                                            if (fieldErrors.bankName) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.bankName;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.bankName || !academyForm.bankName.trim()) {
                                                setFieldErrors(prev => ({ ...prev, bankName: 'Bank Name is required' }));
                                            }
                                        }}
                                    placeholder="Enter bank name"
                                />
                                    {fieldErrors.bankName && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.bankName}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Account Number <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                        style={{ ...styles.input, borderColor: fieldErrors.accountNumber ? '#ef4444' : styles.input.borderColor }}
                                    value={academyForm.accountNumber}
                                        onChange={(e) => {
                                            setAcademyForm({ ...academyForm, accountNumber: e.target.value });
                                            if (fieldErrors.accountNumber) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.accountNumber;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.accountNumber || !academyForm.accountNumber.trim()) {
                                                setFieldErrors(prev => ({ ...prev, accountNumber: 'Account Number is required' }));
                                            }
                                        }}
                                    placeholder="Enter account number"
                                />
                                    {fieldErrors.accountNumber && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontFamily: navFontFamily }}>
                                            {fieldErrors.accountNumber}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    IFSC Code <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                        style={{
                                            ...styles.input,
                                            borderColor: fieldErrors.ifscCode ? '#ef4444' : styles.input.borderColor,
                                            textTransform: 'uppercase'
                                        }}
                                        value={academyForm.ifscCode}
                                        onChange={(e) => {
                                            handleIFSCChange(e.target.value);
                                            if (fieldErrors.ifscCode) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.ifscCode;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!academyForm.ifscCode || !academyForm.ifscCode.trim()) {
                                                setFieldErrors(prev => ({ ...prev, ifscCode: 'IFSC Code is required' }));
                                            } else if (!validateIFSC(academyForm.ifscCode)) {
                                                setFieldErrors(prev => ({ ...prev, ifscCode: 'IFSC Code is invalid' }));
                                            }
                                        }}
                                        placeholder="Enter IFSC code (e.g., ABCD0123456)"
                                        maxLength={11}
                                />
                                    {fieldErrors.ifscCode && (
                                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                            {fieldErrors.ifscCode}
                                        </span>
                                    )}
                                    {!fieldErrors.ifscCode && academyForm.ifscCode && academyForm.ifscCode.length === 11 && validateIFSC(academyForm.ifscCode) && (
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
                                disabled={!validateTabSilent('banking')}
                                style={{
                                    ...styles.button,
                                    backgroundColor: validateTabSilent('banking') ? '#f97316' : '#f1f5f9',
                                    color: validateTabSilent('banking') ? '#fff' : '#94a3b8',
                                    padding: '10px 20px',
                                    fontFamily: navFontFamily,
                                    cursor: validateTabSilent('banking') ? 'pointer' : 'not-allowed',
                                    opacity: validateTabSilent('banking') ? 1 : 0.6
                                }}
                            >
                                {editingAcademy ? 'Update Center' : 'Add Center'}
                            </button>
                        ) : (
                            <button
                                            onClick={handleNextTab}
                                disabled={activeTab === 'banking' ? false : !validateTabSilent(activeTab)}
                                style={{
                                    ...styles.button,
                                    backgroundColor: (activeTab === 'banking' ? false : !validateTabSilent(activeTab)) ? '#f1f5f9' : '#f97316',
                                    color: (activeTab === 'banking' ? false : !validateTabSilent(activeTab)) ? '#94a3b8' : '#fff',
                                    padding: '10px 20px',
                                    fontFamily: navFontFamily,
                                    cursor: (activeTab === 'banking' ? false : !validateTabSilent(activeTab)) ? 'not-allowed' : 'pointer',
                                    opacity: (activeTab === 'banking' ? false : !validateTabSilent(activeTab)) ? 0.6 : 1
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

    // StatsBar Component
    const DetailRow = ({ label, value }) => (
        <div style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{value || 'N/A'}</div>
        </div>
    );

    const StatsBar = ({ styles, totalAcademies, activeAcademies }) => {
        const stats = [
            { label: 'Total Academy', value: totalAcademies, icon: Building2 },
            { label: 'Active Academy', value: activeAcademies, icon: CheckCircle2 },
        ];
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#fff7ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>
                            {stat.icon ? <stat.icon size={18} color="#0f172a" /> : null}
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', fontFamily: navFontFamily }}>{stat.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', fontFamily: navFontFamily }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Detail view inline (instead of popup)
    if (viewMode === 'detail' && detailAcademy) {
    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
                {renderConfirmModal()}
                <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            margin: '0 0 6px',
                            color: styles.title.color,
                            fontFamily: navFontFamily
                        }}>
                            Academy Details
                        </h1>
                        <p style={{ margin: 0, color: styles.subtitle.color, fontSize: '14px', fontFamily: navFontFamily }}>
                            View full information for {detailAcademy.name || detailAcademy.centerName || 'Academy'}.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button
                            onClick={closeDetailDrawer}
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                            }}
                        >
                            Back to List
                        </button>
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #023b84 0%, #023b84 100%)',
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                            }}
                            onClick={() => {
                                handleEditAcademy(detailAcademy, true);
                            }}
                        >
                            Edit Academy
                        </button>
                    </div>
                </div>

                <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Academy</div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                                {detailAcademy.name || detailAcademy.centerName || 'Academy'}
                            </div>
                            <div style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>
                                Owner: {detailAcademy.ownerName || 'N/A'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px 12px', borderRadius: '999px', background: detailAcademy.status === 'active' ? '#ecfdf3' : '#fef2f2', color: detailAcademy.status === 'active' ? '#166534' : '#b91c1c', fontWeight: 700, fontSize: '13px' }}>
                                {detailAcademy.status ? detailAcademy.status.toUpperCase() : 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailRow label="Owner Name" value={detailAcademy.ownerName || 'N/A'} />
                        <DetailRow label="Mobile Number" value={detailAcademy.contact || 'N/A'} />
                        <DetailRow label="Email" value={detailAcademy.email || 'N/A'} />
                        <DetailRow label="Added By" value={detailAcademy.addedBy || 'Admin'} />
                        <DetailRow label="Created Date" value={detailAcademy.createDate || 'N/A'} />
                        <DetailRow label="Experience" value={detailAcademy.experience ? `${detailAcademy.experience} yrs` : 'N/A'} />
                        <DetailRow label="Allowed Genders" value={detailAcademy.allowedGenders && detailAcademy.allowedGenders.length ? detailAcademy.allowedGenders.join(', ') : 'N/A'} />
                        <DetailRow label="Age Range" value={(detailAcademy.minimumAge && detailAcademy.maximumAge) ? `${detailAcademy.minimumAge} - ${detailAcademy.maximumAge}` : 'N/A'} />
                        <DetailRow label="City" value={detailAcademy.city || 'N/A'} />
                        <DetailRow label="State" value={detailAcademy.state || 'N/A'} />
                    </div>

                    {(detailAcademy.rules && detailAcademy.rules.length > 0) && (
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Rules</div>
                            <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '13px', margin: 0, display: 'grid', gap: '6px' }}>
                                {detailAcademy.rules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(detailAcademy.facilities && detailAcademy.facilities.length > 0) && (
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Facilities</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {detailAcademy.facilities.map((facility, idx) => (
                                    <span key={idx} style={{ padding: '6px 10px', background: '#f1f5f9', borderRadius: '999px', fontSize: '12px', color: '#0f172a' }}>{facility}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {detailAcademy.addressLineOne || detailAcademy.addressLineTwo ? (
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Address</div>
                            <div style={{ color: '#475569', fontSize: '13px' }}>
                                {[detailAcademy.addressLineOne, detailAcademy.addressLineTwo, detailAcademy.city, detailAcademy.state, detailAcademy.pincode].filter(Boolean).join(', ')}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    // List view (default)
    return (
        <div style={{ ...styles.mainContent, paddingTop: '20px' }}>
            {renderConfirmModal()}
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
                        Academies Management
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#64748b',
                        margin: 0,
                        fontFamily: navFontFamily
                    }}>
                        Manage academies and coaching centers
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={exportAcademiesToCSV}
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                        }}
                    >
                        <DownloadCloud size={18} />
                        Export CSV
                    </button>
                    <button
                        style={{
                            background: 'linear-gradient(135deg, #023b84 0%, #023b84 100%)',
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
                        onClick={handleAddAcademy}
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
                        + Add Academy
                    </button>
                </div>
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
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page when search changes
                    }}
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#475569', fontFamily: navFontFamily, fontWeight: 500 }}>
                            Filter by status:
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1); // Reset to first page when filter changes
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                color: '#0f172a',
                                fontSize: '13px',
                                fontFamily: navFontFamily,
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#475569', fontFamily: navFontFamily, fontWeight: 500 }}>
                            Added By:
                        </label>
                        <select
                            value={addedByFilter}
                            onChange={(e) => {
                                setAddedByFilter(e.target.value);
                                setCurrentPage(1); // Reset to first page when filter changes
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                color: '#0f172a',
                                fontSize: '13px',
                                fontFamily: navFontFamily,
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All</option>
                            {uniqueAddedBy.map((addedBy) => (
                                <option key={addedBy} value={addedBy}>{addedBy}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#475569', fontFamily: navFontFamily, fontWeight: 500 }}>
                            Sports:
                        </label>
                        <select
                            value={sportsFilter}
                            onChange={(e) => {
                                setSportsFilter(e.target.value);
                                setCurrentPage(1); // Reset to first page when filter changes
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                color: '#0f172a',
                                fontSize: '13px',
                                fontFamily: navFontFamily,
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All</option>
                            {sportsOptionsHydrated &&
                                sports.map((sport) => (
                                    <option key={sport.id} value={sport.id.toString()}>{sport.name}</option>
                                ))}
                        </select>
                    </div>
                </div>
                <div style={{ color: '#475569', fontSize: '13px', marginTop: '12px' }}>
                    Showing {filteredAcademies.length} of {academies.length} academies
                </div>
            </div>

            {/* Stats Bar */}
            <StatsBar 
                styles={styles}
                totalAcademies={totalAcademies}
                activeAcademies={activeAcademies}
            />

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
                            <tr
                                key={academy.id}
                                onClick={() => openDetailDrawer(academy)}
                                onMouseEnter={() => setHoveredRowId(academy.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: hoveredRowId === academy.id ? '#e9eef5' : 'transparent',
                                    boxShadow: hoveredRowId === academy.id ? 'inset 0 0 0 1px #aab2bd, 0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                                    transition: 'background-color 0.15s ease, box-shadow 0.15s ease'
                                }}
                                title="View academy details"
                            >
                                <td style={tdCenter}>{start + index + 1}</td>
                                <td style={{ ...tdCenter, fontWeight: '500', whiteSpace: 'nowrap', color: '#023B84' }}>
                                    {academy.ownerName || 'N/A'}
                                </td>
                                <td style={tdCenter}>{academy.email}</td>
                                <td style={{ ...tdCenter, color: '#023B84' }}>
                                    {academy.name}
                                </td>
                                <td style={tdCenter}>{academy.contact || '-'}</td>
                                <td style={tdCenter}>{academy.addedBy || '-'}</td>
                                <td style={tdCenter}>{academy.createDate || '-'}</td>
                                <td style={tdCenter}>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); toggleStatus(academy.id); }}
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
                                            onClick={(e) => { e.stopPropagation(); handleEditAcademy(academy, false); }}
                                            title="Edit"
                                        >
                                            <Pencil size={16} color="#ffffff" />
                                        </button>
                                        <button
                                            style={{ ...styles.buttonDanger, padding: '6px 12px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={(e) => { e.stopPropagation(); handleDelete(academy.id); }}
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
                                    onClick={() => handleEditAcademy(academy, false)}
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
                                                border: '1px solid rgb(12, 28, 49)',
                                                backgroundColor: isActive ? '#d8d8ec' : '#d8d8ec',
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

