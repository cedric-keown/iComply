// Upload Activity JavaScript

let currentCpdCycle = null;
let currentRepresentativeId = null;

/**
 * Initialize Upload Activity Tab
 * Called when the upload tab is shown (via tab switching event)
 */
async function initializeUploadActivity() {
    console.log('🔄 Initializing upload tab...');
    
    // Check if cpdData exists and is initialized
    if (typeof cpdData === 'undefined') {
        console.error('❌ cpdData not initialized - dashboard must load first');
        showUploadNoAccessMessage();
        return;
    }
    
    // Check if user has representative access
    if (!cpdData.selectedRepresentativeId) {
        console.warn('⚠️ No representative selected for upload');
        showUploadNoAccessMessage();
        return;
    }
    
    console.log('✅ Upload tab ready for rep:', cpdData.selectedRepresentativeId);
    
    await loadCpdCycle();
    setupFormValidation();
    setupHoursValidation();
    setupProviderCustomInput();
    setupCertificateUpload();
    setupUploadMethodSwitch();
}

// Export for use by tab switching logic in cpd-dashboard.js
window.initializeUploadActivity = initializeUploadActivity;

/**
 * Show No Access Message on Upload Tab
 */
function showUploadNoAccessMessage() {
    const uploadTab = document.getElementById('upload');
    if (!uploadTab) return;
    
    const container = uploadTab.querySelector('.container-fluid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
                <div class="card border-warning">
                    <div class="card-body text-center py-4">
                        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h4 class="mb-3">Cannot Upload CPD Activities</h4>
                        <p class="mb-3">You must be linked to a representative to upload CPD activities.</p>
                        <a href="#" onclick="switchTab('dashboard-tab')" class="btn btn-primary">
                            <i class="fas fa-info-circle me-2"></i>View Access Information
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
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
    
    // Use selected cycle from cpdData if available
    const cycleToUse = (typeof cpdData !== 'undefined' && cpdData.cycle) 
        ? cpdData.cycle 
        : currentCpdCycle;
    
    if (!form || !cycleToUse) {
        Swal.fire({
            icon: 'error',
            title: 'No Active Cycle',
            text: 'Please select a CPD cycle first.'
        });
        return;
    }
    
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
            cpd_cycle_id: cycleToUse.id,
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
            // Refresh materialized view to update dashboard
            try {
                await dataFunctions.callFunction('refresh_cpd_progress', {});
            } catch (refreshError) {
                console.warn('Could not refresh progress view:', refreshError);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Activity Submitted Successfully!',
                html: `
                    <div class="text-start">
                        <p class="mb-2"><strong>Activity:</strong> ${activityData.activity_name}</p>
                        <p class="mb-2"><strong>Hours:</strong> ${activityData.total_hours} total</p>
                        <p class="mb-2"><strong>Status:</strong> <span class="badge bg-warning">Pending Verification</span></p>
                    </div>
                `,
                confirmButtonText: 'View Activity Log'
            }).then(() => {
                // Reset form
                form.reset();
                
                // Refresh dashboard data
                if (typeof cpdData !== 'undefined' && typeof refreshCpdData === 'function') {
                    refreshCpdData();
                }
                
                // Switch to activity log tab
                if (typeof switchTab === 'function') {
                    switchTab('log-tab');
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

/**
 * Setup Upload Method Switch
 */
function setupUploadMethodSwitch() {
    const methodCards = document.querySelectorAll('.upload-method-card');
    const certificateForm = document.getElementById('certificateUploadForm');
    const manualForm = document.getElementById('manualEntryForm');
    
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active from all
            methodCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const method = this.dataset.method;
            if (method === 'certificate') {
                certificateForm?.classList.remove('d-none');
                manualForm?.classList.add('d-none');
            } else {
                certificateForm?.classList.add('d-none');
                manualForm?.classList.remove('d-none');
            }
        });
    });
}

/**
 * Setup Certificate Upload
 */
function setupCertificateUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('certificateFile');
    const browseButton = uploadZone?.querySelector('.btn-primary');
    
    if (!uploadZone || !fileInput) return;
    
    // Click browse button → trigger file input
    if (browseButton) {
        browseButton.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });
    }
    
    // Click upload zone → trigger file input
    uploadZone.addEventListener('click', (e) => {
        if (e.target === uploadZone || e.target.closest('.fa-cloud-upload-alt')) {
            fileInput.click();
        }
    });
    
    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    });
    
    // Drag & drop handlers
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            // Set the file to the input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            handleFileSelection(file);
        }
    });
}

/**
 * Handle File Selection
 */
function handleFileSelection(file) {
    const uploadZone = document.getElementById('uploadZone');
    if (!uploadZone) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a PDF, JPG, or PNG file.'
        });
        return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be less than 5MB.'
        });
        return;
    }
    
    // Display file info
    const fileIcon = file.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image';
    const fileSize = (file.size / 1024).toFixed(2) + ' KB';
    
    uploadZone.innerHTML = `
        <div class="text-center py-4">
            <i class="fas ${fileIcon} fa-4x text-success mb-3"></i>
            <h5 class="mb-2">${file.name}</h5>
            <p class="text-muted mb-3">${fileSize}</p>
            <button class="btn btn-outline-secondary btn-sm" onclick="clearCertificateFile()">
                <i class="fas fa-times me-1"></i>Remove
            </button>
            <button class="btn btn-outline-primary btn-sm ms-2" onclick="document.getElementById('certificateFile').click()">
                <i class="fas fa-sync me-1"></i>Replace
            </button>
        </div>
    `;
    
    console.log('Certificate file selected:', file.name, fileSize);
}

/**
 * Clear Certificate File
 */
function clearCertificateFile() {
    const fileInput = document.getElementById('certificateFile');
    const uploadZone = document.getElementById('uploadZone');
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (uploadZone) {
        uploadZone.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-cloud-upload-alt fa-4x text-muted mb-3"></i>
                <p class="mb-2"><strong>Drag & drop your certificate here</strong></p>
                <p class="text-muted mb-3">or</p>
                <button class="btn btn-primary">Browse Files</button>
                <p class="mt-3 small text-muted">PDF, JPG, PNG - Max 5MB</p>
            </div>
        `;
        
        // Re-setup handlers
        setupCertificateUpload();
    }
}

// Export for global access
window.clearCertificateFile = clearCertificateFile;

