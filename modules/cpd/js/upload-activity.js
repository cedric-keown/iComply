// Upload Activity JavaScript

let currentCpdCycle = null;
let currentRepresentativeId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeUploadActivity();
});

async function initializeUploadActivity() {
    await loadCpdCycle();
    setupFormValidation();
    setupHoursValidation();
    setupProviderCustomInput();
}

/**
 * Load Current CPD Cycle
 */
async function loadCpdCycle() {
    try {
        const cyclesResult = await dataFunctions.getCpdCycles('active');
        let cycles = cyclesResult;
        if (cyclesResult && cyclesResult.data) {
            cycles = cyclesResult.data;
        } else if (cyclesResult && Array.isArray(cyclesResult)) {
            cycles = cyclesResult;
        }
        
        if (cycles && cycles.length > 0) {
            currentCpdCycle = cycles[0];
        }
        
        // Get current user's representative ID from session/profile
        await loadCurrentRepresentativeId();
    } catch (error) {
        console.error('Error loading CPD cycle:', error);
    }
}

/**
 * Load current user's representative ID from their user profile
 */
async function loadCurrentRepresentativeId() {
    try {
        // Check if authService is available and user is authenticated
        if (typeof authService !== 'undefined' && authService.getCurrentUser) {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.id) {
                // Get user profile which contains representative link
                const profileResult = await dataFunctions.getUserProfile(currentUser.id);
                
                let profile = profileResult;
                if (profileResult && profileResult.data) {
                    profile = profileResult.data;
                } else if (Array.isArray(profileResult) && profileResult.length > 0) {
                    profile = profileResult[0];
                }
                
                if (profile && profile.id) {
                    // Try to get the representative record linked to this user profile
                    const repsResult = await dataFunctions.getRepresentatives(null);
                    let reps = repsResult;
                    if (repsResult && repsResult.data) {
                        reps = repsResult.data;
                    } else if (Array.isArray(repsResult)) {
                        reps = repsResult;
                    }
                    
                    // Find representative by user_profile_id
                    if (reps && Array.isArray(reps)) {
                        const myRep = reps.find(r => r.user_profile_id === profile.id);
                        if (myRep) {
                            currentRepresentativeId = myRep.id;
                            console.log('Current representative ID loaded:', currentRepresentativeId);
                        } else {
                            console.warn('No representative record found for current user');
                        }
                    }
                }
            }
        }
        
        // Fallback: check localStorage for cached user info
        if (!currentRepresentativeId) {
            const userInfo = localStorage.getItem('user_info');
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    if (user.representative_id) {
                        currentRepresentativeId = user.representative_id;
                        console.log('Representative ID loaded from cache:', currentRepresentativeId);
                    }
                } catch (e) {
                    console.error('Error parsing user info from localStorage:', e);
                }
            }
        }
    } catch (error) {
        console.error('Error loading representative ID:', error);
    }
}

function setupFormValidation() {
    const form = document.getElementById('cpdActivityForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Submit form
                submitActivity();
            }
        });
    }
}

function validateForm() {
    const form = document.getElementById('cpdActivityForm');
    if (!form) return false;
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validate hours
    const hoursInput = document.getElementById('cpdTotalHours');
    if (hoursInput) {
        const hours = parseFloat(hoursInput.value);
        if (hours > 8) {
            isValid = false;
            hoursInput.classList.add('is-invalid');
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Hours',
                text: 'Maximum 8 hours per day allowed.'
            });
        }
    }
    
    // Validate cycle exists
    if (!currentCpdCycle) {
        isValid = false;
        Swal.fire({
            icon: 'error',
            title: 'No Active Cycle',
            text: 'No active CPD cycle found. Please contact your administrator.'
        });
    }
    
    return isValid;
}

function setupProviderCustomInput() {
    const providerSelect = document.getElementById('cpdProvider');
    const customInput = document.getElementById('cpdProviderCustom');
    
    if (providerSelect && customInput) {
        providerSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customInput.classList.remove('d-none');
                customInput.required = true;
            } else {
                customInput.classList.add('d-none');
                customInput.required = false;
                customInput.value = '';
            }
        });
    }
}

function setupHoursValidation() {
    const hoursInput = document.querySelector('input[type="number"][step="0.5"]');
    if (hoursInput) {
        hoursInput.addEventListener('input', function() {
            const hours = parseFloat(this.value);
            if (hours > 8) {
                this.setCustomValidity('Maximum 8 hours per day');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

async function submitActivity() {
    const form = document.getElementById('cpdActivityForm');
    if (!form || !currentCpdCycle) return;
    
    // Get selected representative from global cpdData
    const selectedRepId = (typeof cpdData !== 'undefined' && cpdData.selectedRepresentativeId) 
        ? cpdData.selectedRepresentativeId 
        : currentRepresentativeId;
    
    // Show loading
    Swal.fire({
        title: 'Submitting...',
        text: 'Please wait while we process your CPD activity',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Get form data
        const activityData = {
            representative_id: selectedRepId || null,
            cpd_cycle_id: currentCpdCycle.id,
            activity_date: document.getElementById('cpdActivityDate').value,
            activity_name: document.getElementById('cpdActivityTitle').value.trim(),
            activity_type: document.getElementById('cpdActivityType').value,
            provider_name: document.getElementById('cpdProvider').value === 'custom' 
                ? document.getElementById('cpdProviderCustom').value.trim()
                : document.getElementById('cpdProvider').value,
            total_hours: parseFloat(document.getElementById('cpdTotalHours').value) || 0,
            ethics_hours: parseFloat(document.getElementById('cpdEthicsHours').value) || 0,
            technical_hours: parseFloat(document.getElementById('cpdTechnicalHours').value) || 0,
            class_1_applicable: document.getElementById('cob1').checked || false,
            class_2_applicable: document.getElementById('cob2').checked || false,
            class_3_applicable: document.getElementById('cob3').checked || false,
            verifiable: document.getElementById('verifiableCheck').checked,
            certificate_attached: document.getElementById('certificateFile')?.files?.length > 0 || false
        };
        
        // Validate required fields
        if (!activityData.representative_id) {
            throw new Error('Representative ID not found. Please ensure you are logged in.');
        }
        
        console.log('Submitting CPD activity:', activityData);
        
        // Submit to database
        const result = await dataFunctions.createCpdActivity(activityData);
        
        // Handle response
        let response = result;
        if (result && result.data) {
            response = result.data;
        } else if (result && typeof result === 'object' && result.success !== undefined) {
            response = result;
        }
        
        if (response && response.success !== false && !response.error) {
            Swal.fire({
                icon: 'success',
                title: 'Activity Submitted',
                text: 'Your CPD activity has been submitted successfully.',
                confirmButtonText: 'OK'
            }).then(() => {
                // Switch to activity log tab
                if (typeof switchTab === 'function') {
                    switchTab('log-tab');
                }
                // Reset form
                form.reset();
                // Reload dashboard if on dashboard
                if (typeof loadCpdDashboardData === 'function') {
                    loadCpdDashboardData();
                }
            });
        } else {
            throw new Error(response?.error || 'Failed to submit activity');
        }
    } catch (error) {
        console.error('Error submitting CPD activity:', error);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error.message || 'Failed to submit CPD activity. Please try again.'
        });
    }
}

