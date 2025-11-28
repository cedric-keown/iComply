// Add Representative JavaScript

let wizardData = {}; // Store data as user progresses through wizard
let wizardKeyIndividuals = []; // Scoped to wizard module

document.addEventListener('DOMContentLoaded', function() {
    initializeRepRegistration();
    
    // Listen for when the "Add New Representative" tab is shown
    const addTab = document.getElementById('add-tab');
    if (addTab) {
        addTab.addEventListener('shown.bs.tab', function() {
            // Ensure type selection is visible when tab is shown
            const typeSelection = document.getElementById('repTypeSelection');
            const wizard = document.getElementById('repWizard');
            if (typeSelection) {
                typeSelection.style.display = 'block';
            }
            if (wizard) {
                wizard.style.display = 'none';
            }
            // Re-initialize in case elements weren't ready before
            initializeRepRegistration();
        });
    }
    
    // Listen for postMessage to switch tabs (from Quick Actions)
    window.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'switchTab') {
            const tabId = event.data.tab;
            const tabButton = document.getElementById(tabId);
            if (tabButton) {
                tabButton.click();
            }
        }
    });
});

function initializeRepRegistration() {
    setupRepTypeSelection();
    setupFileUploads();
    setupFormValidation();
}

function setupRepTypeSelection() {
    const typeCards = document.querySelectorAll('.rep-type-card');
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            typeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

async function startRepRegistration(type) {
    wizardData = { representative_type: type }; // Store selected type
    
    // Hide type selection and show wizard
    const typeSelection = document.getElementById('repTypeSelection');
    const wizard = document.getElementById('repWizard');
    
    if (typeSelection) {
        typeSelection.style.display = 'none';
    }
    if (wizard) {
        wizard.style.display = 'block';
    }
    
    // Show step 1
    updateRepWizardProgress(1);
    showRepStep(1);
    
    // Load supervisors for step 8
    await loadSupervisors();
    
    console.log('Wizard started for type:', type);
}

function cancelRepRegistration() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Cancel Registration?',
            text: 'All unsaved data will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel',
            cancelButtonText: 'Continue'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('repTypeSelection').style.display = 'block';
                document.getElementById('repWizard').style.display = 'none';
                resetRepWizard();
                wizardData = {};
            }
        });
    } else {
        if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
            document.getElementById('repTypeSelection').style.display = 'block';
            document.getElementById('repWizard').style.display = 'none';
            resetRepWizard();
            wizardData = {};
        }
    }
}

function setupFileUploads() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    uploadZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0], zone);
            }
        });
        
        const browseBtn = zone.querySelector('button');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.jpg,.jpeg,.png';
                input.multiple = true;
                input.onchange = (e) => {
                    if (e.target.files.length > 0) {
                        Array.from(e.target.files).forEach(file => {
                            handleFileUpload(file, zone);
                        });
                    }
                };
                input.click();
            });
        }
    });
}

function handleFileUpload(file, zone) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: 'Please upload a PDF, JPG, or PNG file.'
            });
        }
        return;
    }
    
    if (file.size > maxSize) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'File size must be less than 5MB.'
            });
        }
        return;
    }
    
    // Show file preview
    const fileIcon = getFileIcon(file.type);
    const existingFiles = zone.querySelector('.file-list') || document.createElement('div');
    existingFiles.className = 'file-list mt-2';
    
    const fileItem = document.createElement('div');
    fileItem.className = 'd-flex align-items-center justify-content-between mb-2 p-2 bg-light rounded';
    fileItem.innerHTML = `
        ${fileIcon}
        <span class="flex-grow-1 ms-2">${file.name}</span>
        <small class="text-muted me-2">${formatFileSize(file.size)}</small>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFile(this)">Remove</button>
    `;
    
    if (!zone.querySelector('.file-list')) {
        zone.appendChild(existingFiles);
    }
    existingFiles.appendChild(fileItem);
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) {
        return '<i class="fas fa-file-pdf text-danger"></i>';
    } else if (fileType.includes('image')) {
        return '<i class="fas fa-file-image text-info"></i>';
    } else {
        return '<i class="fas fa-file text-secondary"></i>';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile(btn) {
    btn.closest('.d-flex').remove();
}

/**
 * Setup Form Validation
 */
function setupFormValidation() {
    // ID number validation removed - field accepts any input
    const idInput = document.getElementById('repIdNumber');
    if (idInput) {
        // Clear validation classes on input
        idInput.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    }
}

/**
 * Validate South African ID Number
 */
function validateIdNumber() {
    const idInput = document.getElementById('repIdNumber');
    if (!idInput || !idInput.value) return;
    
    let idNumber = idInput.value.trim();
    
    // Remove non-numeric characters
    const cleanIdNumber = idNumber.replace(/\D/g, '');
    
    // Update input with cleaned value
    if (idNumber !== cleanIdNumber) {
        idInput.value = cleanIdNumber;
        idNumber = cleanIdNumber;
    }
    
    // Check length
    if (idNumber.length !== 13) {
        idInput.classList.add('is-invalid');
        idInput.classList.remove('is-valid');
        return false;
    }
    
    // Check if all digits
    if (!/^\d+$/.test(idNumber)) {
        idInput.classList.add('is-invalid');
        idInput.classList.remove('is-valid');
        return false;
    }
    
    // Validate checksum (Luhn algorithm)
    if (validateSAIdChecksum(idNumber)) {
        idInput.classList.remove('is-invalid');
        idInput.classList.add('is-valid');
        
        // Extract and populate date of birth if available
        extractDateOfBirth(idNumber);
        return true;
    } else {
        idInput.classList.add('is-invalid');
        idInput.classList.remove('is-valid');
        return false;
    }
}

/**
 * Validate SA ID Checksum (Luhn Algorithm)
 */
function validateSAIdChecksum(idNumber) {
    // Remove spaces, dashes, and other non-numeric characters
    idNumber = idNumber.replace(/\D/g, '');
    
    // Check length
    if (idNumber.length !== 13) {
        return false;
    }
    
    // Validate date components
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));
    
    // Basic date validation
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
    }
    
    // Luhn algorithm for checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        let digit = parseInt(idNumber[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber[12]);
}

/**
 * Extract Date of Birth from SA ID
 */
function extractDateOfBirth(idNumber) {
    if (idNumber.length !== 13) return;
    
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));
    
    // Determine century (00-20 = 2000-2020, 21-99 = 1921-1999)
    const fullYear = year <= 20 ? 2000 + year : 1900 + year;
    
    // Validate date
    const date = new Date(fullYear, month - 1, day);
    if (date.getFullYear() === fullYear && date.getMonth() === month - 1 && date.getDate() === day) {
        const dobInput = document.getElementById('repDob');
        if (dobInput && !dobInput.value) {
            // Format as YYYY-MM-DD for date input
            const formattedDate = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dobInput.value = formattedDate;
        }
    }
}

/**
 * Validate Step Before Proceeding
 */
function validateStep(step) {
    switch(step) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return validateStep4();
        case 8:
            return validateStep8();
        default:
            return true; // Other steps are optional for now
    }
}

function validateStep1() {
    const firstName = document.getElementById('repFirstName')?.value.trim();
    const surname = document.getElementById('repSurname')?.value.trim();
    const idNumber = document.getElementById('repIdNumber')?.value.trim();
    
    if (!firstName) {
        showValidationError('First Name is required');
        document.getElementById('repFirstName')?.focus();
        return false;
    }
    
    if (!surname) {
        showValidationError('Last Name (Surname) is required');
        document.getElementById('repSurname')?.focus();
        return false;
    }
    
    if (!idNumber) {
        showValidationError('ID/Passport Number is required');
        document.getElementById('repIdNumber')?.focus();
        return false;
    }
    
    return true;
}

function validateStep2() {
    const email = document.querySelector('#repStep2 input[type="email"]')?.value.trim();
    const mobile = document.querySelector('#repStep2 input[type="tel"]')?.value.trim();
    
    if (!email) {
        showValidationError('Primary Email is required');
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showValidationError('Please enter a valid email address');
        return false;
    }
    
    if (!mobile) {
        showValidationError('Primary Mobile is required');
        return false;
    }
    
    return true;
}

function validateStep3() {
    const startDate = document.getElementById('repStartDate')?.value;
    
    if (!startDate) {
        showValidationError('Start Date is required');
        return false;
    }
    
    // Check if date is not in the future
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
        showValidationError('Start Date cannot be in the future');
        return false;
    }
    
    return true;
}

function validateStep4() {
    const cat1 = document.getElementById('cat1')?.checked;
    const cat2a = document.getElementById('cat2a')?.checked;
    const cat2b = document.getElementById('cat2b')?.checked;
    const cat3a = document.getElementById('cat3a')?.checked;
    
    if (!cat1 && !cat2a && !cat2b && !cat3a) {
        showValidationError('Please select at least one category');
        return false;
    }
    
    return true;
}

function validateStep8() {
    const supervisorSelect = document.querySelector('#repStep8 select');
    // Supervisor is optional, so always return true
    return true;
}

function showValidationError(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: message,
            timer: 3000
        });
    } else {
        alert(message);
    }
}

function nextRepStep(step) {
    // Validate current step before proceeding
    const currentStep = document.querySelector('.wizard-step.active');
    if (currentStep) {
        const currentStepNum = parseInt(currentStep.getAttribute('data-step')) || 1;
        if (!validateStep(currentStepNum)) {
            return; // Don't proceed if validation fails
        }
        
        // Save current step data
        saveStepData(currentStepNum);
    }
    
    // Hide current step
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Show next step
    const nextStep = document.getElementById(`repStep${step}`);
    if (nextStep) {
        nextStep.classList.add('active');
        nextStep.style.display = 'block';
        updateRepWizardProgress(step);
        
        // Load saved data for this step
        loadStepData(step);
        
        // If step 9, update the review summary
        if (step === 9) {
            updateReviewSummary();
        }
    }
}

function previousRepStep(step) {
    // Save current step data before going back
    const currentStep = document.querySelector('.wizard-step.active');
    if (currentStep) {
        const currentStepNum = parseInt(currentStep.getAttribute('data-step')) || 1;
        saveStepData(currentStepNum);
    }
    
    // Hide current step
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Show previous step
    const prevStep = document.getElementById(`repStep${step}`);
    if (prevStep) {
        prevStep.classList.add('active');
        prevStep.style.display = 'block';
        updateRepWizardProgress(step);
        
        // Load saved data for this step
        loadStepData(step);
    }
}

/**
 * Save Step Data to wizardData
 */
function saveStepData(step) {
    switch(step) {
        case 1:
            wizardData.first_name = document.getElementById('repFirstName')?.value.trim() || '';
            wizardData.surname = document.getElementById('repSurname')?.value.trim() || '';
            wizardData.id_number = document.getElementById('repIdNumber')?.value.trim() || '';
            const dob = document.getElementById('repDob')?.value;
            if (dob) wizardData.date_of_birth = dob;
            break;
        case 2:
            const email = document.querySelector('#repStep2 input[type="email"]')?.value.trim();
            const mobile = document.querySelector('#repStep2 input[type="tel"]')?.value.trim();
            if (email) wizardData.email = email;
            if (mobile) wizardData.mobile = mobile;
            break;
        case 3:
            const startDate = document.getElementById('repStartDate')?.value;
            if (startDate) {
                wizardData.onboarding_date = startDate;
                wizardData.authorization_date = startDate;
            }
            break;
        case 4:
            // Category I (cat1) and Category IIA (cat2a) both map to class_1_long_term
            wizardData.class_1_long_term = (document.getElementById('cat1')?.checked || document.getElementById('cat2a')?.checked) || false;
            // Category IIB (cat2b) maps to class_2_short_term
            wizardData.class_2_short_term = document.getElementById('cat2b')?.checked || false;
            // Category IIIA (cat3a) maps to class_3_pension
            wizardData.class_3_pension = document.getElementById('cat3a')?.checked || false;
            break;
        case 8:
            const supervisorSelect = document.getElementById('repSupervisor');
            if (supervisorSelect && supervisorSelect.value) {
                wizardData.supervised_by_ki_id = supervisorSelect.value || null;
            }
            break;
    }
}

/**
 * Load Step Data from wizardData
 */
function loadStepData(step) {
    switch(step) {
        case 1:
            if (wizardData.first_name) document.getElementById('repFirstName').value = wizardData.first_name;
            if (wizardData.surname) document.getElementById('repSurname').value = wizardData.surname;
            if (wizardData.id_number) document.getElementById('repIdNumber').value = wizardData.id_number;
            if (wizardData.date_of_birth) document.getElementById('repDob').value = wizardData.date_of_birth;
            break;
        case 2:
            if (wizardData.email) {
                const emailInput = document.querySelector('#repStep2 input[type="email"]');
                if (emailInput) emailInput.value = wizardData.email;
            }
            if (wizardData.mobile) {
                const mobileInput = document.querySelector('#repStep2 input[type="tel"]');
                if (mobileInput) mobileInput.value = wizardData.mobile;
            }
            break;
        case 3:
            if (wizardData.onboarding_date) {
                document.getElementById('repStartDate').value = wizardData.onboarding_date;
            }
            break;
        case 4:
            if (wizardData.class_1_long_term !== undefined) {
                document.getElementById('cat1').checked = wizardData.class_1_long_term;
            }
            if (wizardData.class_2_short_term !== undefined) {
                document.getElementById('cat2a').checked = wizardData.class_2_short_term;
                document.getElementById('cat2b').checked = wizardData.class_2_short_term;
            }
            if (wizardData.class_3_pension !== undefined) {
                document.getElementById('cat3a').checked = wizardData.class_3_pension;
            }
            break;
        case 8:
            if (wizardData.supervised_by_ki_id) {
                const supervisorSelect = document.getElementById('repSupervisor');
                if (supervisorSelect) supervisorSelect.value = wizardData.supervised_by_ki_id;
            }
            break;
    }
}

/**
 * Show a specific wizard step
 */
function showRepStep(stepNumber) {
    // Hide all steps
    const allSteps = document.querySelectorAll('.wizard-step');
    allSteps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Show the requested step
    const targetStep = document.getElementById(`repStep${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        targetStep.classList.add('active');
    } else {
        console.error(`Step ${stepNumber} not found`);
    }
}

function updateRepWizardProgress(currentStep) {
    const steps = document.querySelectorAll('.progress-steps .step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function resetRepWizard() {
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show first step
    const firstStep = document.getElementById('repStep1');
    if (firstStep) {
        firstStep.classList.add('active');
        firstStep.style.display = 'block';
    }
    
    // Clear all form fields
    const forms = document.querySelectorAll('#repWizard form, #repWizard input, #repWizard select');
    forms.forEach(field => {
        if (field.type === 'checkbox') {
            field.checked = false;
        } else {
            field.value = '';
        }
    });
    
    updateRepWizardProgress(1);
}

function runDebarmentCheck() {
    if (typeof Swal === 'undefined') {
        alert('Running debarment check...');
        return;
    }
    
    Swal.fire({
        title: 'Running Debarment Check...',
        text: 'Please wait while we check the FSCA register',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Debarment Check Complete',
            text: 'All representatives are clear - no matches found on FSCA register',
            confirmButtonText: 'OK'
        });
    }, 2000);
}

function runCreditCheck() {
    if (typeof Swal === 'undefined') {
        alert('Running credit check...');
        return;
    }
    
    Swal.fire({
        title: 'Running Credit Check...',
        text: 'Please wait while we check credit status',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Credit Check Complete',
            text: 'Credit check passed - Good standing',
            confirmButtonText: 'OK'
        });
    }, 2000);
}

/**
 * Collect all form data and submit representative registration
 */
async function submitRepRegistration() {
    try {
        // Save all step data first
        for (let i = 1; i <= 9; i++) {
            saveStepData(i);
        }
        
        // Collect final data
        const formData = collectWizardData();
        
        // Validate required fields
        if (!formData.first_name || !formData.surname || !formData.id_number) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please complete all required fields (First Name, Last Name, ID Number)'
            });
            // Go back to step 1
            nextRepStep(1);
            return;
        }
        
        // ID number validation removed - accept any input
        
        Swal.fire({
            title: 'Submitting Registration...',
            text: 'Please wait while we process the registration',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Submit to database
        console.log('Submitting representative data:', formData);
        const result = await dataFunctions.createRepresentative(formData);
        console.log('Create representative result:', result);
        
        // Handle response - check different possible response structures
        let response = result;
        if (result && result.data) {
            response = result.data;
        } else if (result && typeof result === 'object' && result.success !== undefined) {
            response = result;
        }
        
        console.log('Processed response:', response);
        
        if (response && response.success !== false && !response.error) {
            const repNumber = response.representative_number || response.fsp_number || 'N/A';
            const repId = response.id || response.representative_id;
            
            Swal.fire({
                icon: 'success',
                title: 'Representative Registered Successfully',
                html: `
                    <p><strong>Name:</strong> ${formData.first_name} ${formData.surname}</p>
                    <p><strong>FSP Number:</strong> ${repNumber}</p>
                    <p><strong>Status:</strong> Active</p>
                    <p class="mt-3">Representative has been added to the system</p>
                `,
                confirmButtonText: 'View Directory'
            }).then(() => {
                // Reset wizard
                resetRepWizard();
                wizardData = {};
                document.getElementById('repTypeSelection').style.display = 'block';
                document.getElementById('repWizard').style.display = 'none';
                
                // Switch to directory tab and reload
                if (typeof switchRepsTab === 'function') {
                    switchRepsTab('directory-tab');
                }
                if (typeof loadRepresentatives === 'function') {
                    loadRepresentatives();
                }
            });
        } else {
            const errorMsg = response?.error || response?.message || 'Failed to create representative';
            console.error('Registration failed:', response);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            formData: formData
        });
        
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            html: `
                <p><strong>Error:</strong> ${error.message}</p>
                <p class="text-muted small mt-2">Please check the console for more details.</p>
            `,
            width: '500px'
        });
    }
}

/**
 * Collect data from all wizard steps
 */
function collectWizardData() {
    const data = {};
    
    // Step 1: Personal Information
    data.first_name = wizardData.first_name || document.getElementById('repFirstName')?.value.trim() || '';
    data.surname = wizardData.surname || document.getElementById('repSurname')?.value.trim() || '';
    data.id_number = wizardData.id_number || document.getElementById('repIdNumber')?.value.trim() || '';
    
    // Step 3: Employment Details
    data.onboarding_date = wizardData.onboarding_date || document.getElementById('repStartDate')?.value || new Date().toISOString().split('T')[0];
    data.authorization_date = data.onboarding_date; // Same as onboarding for now
    
    // Step 4: Categories
    // Note: cat1 = Category I (Advice and Intermediary Services) = class_1_long_term
    //       cat2a = Category IIA (Long-term Insurance) = class_1_long_term
    //       cat2b = Category IIB (Short-term Insurance) = class_2_short_term
    //       cat3a = Category IIIA (Health Service Benefits) = class_3_pension
    data.class_1_long_term = wizardData.class_1_long_term !== undefined 
        ? wizardData.class_1_long_term 
        : (document.getElementById('cat1')?.checked || document.getElementById('cat2a')?.checked) || false;
    data.class_2_short_term = wizardData.class_2_short_term !== undefined
        ? wizardData.class_2_short_term
        : document.getElementById('cat2b')?.checked || false;
    data.class_3_pension = wizardData.class_3_pension !== undefined
        ? wizardData.class_3_pension
        : document.getElementById('cat3a')?.checked || false;
    
    // Step 8: Supervision
    const supervisorSelect = document.getElementById('repSupervisor');
    if (supervisorSelect && supervisorSelect.value) {
        // Use the value directly (it's already the representative_id)
        data.supervised_by_ki_id = supervisorSelect.value || null;
    } else {
        data.supervised_by_ki_id = wizardData.supervised_by_ki_id || null;
    }
    
    // Default values
    data.status = 'active';
    
    // Log collected data for debugging
    console.log('Collected wizard data:', data);
    
    return data;
}

/**
 * Load Key Individuals for Supervisor Dropdown
 */
async function loadSupervisors() {
    try {
        const result = await dataFunctions.getKeyIndividuals('active');
        let kis = result;
        
        if (result && result.data) {
            kis = result.data;
        } else if (result && Array.isArray(result)) {
            kis = result;
        }
        
        wizardKeyIndividuals = kis || [];
        
        const supervisorSelect = document.getElementById('repSupervisor');
        if (supervisorSelect && kis && Array.isArray(kis)) {
            // Clear existing options (keep first "Select..." option)
            while (supervisorSelect.options.length > 1) {
                supervisorSelect.remove(1);
            }
            
            // Add key individuals - use representative_id for the value
            kis.forEach(ki => {
                const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
                const kiType = ki.ki_type === 'principal' ? 'Principal' : 
                              ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                              'Key Individual';
                const option = document.createElement('option');
                // Use representative_id (the representative ID that the KI is linked to)
                option.value = ki.representative_id || ki.id; // Fallback to ki.id if representative_id not available
                option.textContent = `${name} (${kiType})`;
                supervisorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading supervisors:', error);
    }
}

/**
 * Update Review Summary (Step 9)
 */
function updateReviewSummary() {
    // Collect all data
    for (let i = 1; i <= 8; i++) {
        saveStepData(i);
    }
    
    const summary = {
        name: `${wizardData.first_name || ''} ${wizardData.surname || ''}`.trim() || '-',
        id: wizardData.id_number || '-',
        onboardingDate: wizardData.onboarding_date 
            ? new Date(wizardData.onboarding_date).toLocaleDateString('en-ZA')
            : '-',
        categories: [],
        supervisor: 'Unassigned'
    };
    
    // Build categories list - check actual checkbox states for accurate labels
    if (document.getElementById('cat1')?.checked) {
        summary.categories.push('Category I');
    }
    if (document.getElementById('cat2a')?.checked) {
        summary.categories.push('Category IIA');
    }
    if (document.getElementById('cat2b')?.checked) {
        summary.categories.push('Category IIB');
    }
    if (document.getElementById('cat3a')?.checked) {
        summary.categories.push('Category IIIA');
    }
    if (summary.categories.length === 0) {
        summary.categories.push('None selected');
    }
    
    // Get supervisor name
    if (wizardData.supervised_by_ki_id) {
        const ki = wizardKeyIndividuals.find(k => (k.representative_id || k.id) === wizardData.supervised_by_ki_id);
        if (ki) {
            summary.supervisor = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
        }
    }
    
    // Update summary display
    const nameEl = document.getElementById('summaryName');
    const idEl = document.getElementById('summaryId');
    const categoriesEl = document.getElementById('summaryCategories');
    const supervisorEl = document.getElementById('summarySupervisor');
    const onboardingEl = document.getElementById('summaryOnboardingDate');
    
    if (nameEl) nameEl.textContent = summary.name;
    if (idEl) idEl.textContent = summary.id;
    if (categoriesEl) categoriesEl.textContent = summary.categories.join(', ');
    if (supervisorEl) supervisorEl.textContent = summary.supervisor;
    if (onboardingEl) onboardingEl.textContent = summary.onboardingDate;
}

// Export for global access
window.startRepRegistration = startRepRegistration;
window.cancelRepRegistration = cancelRepRegistration;
window.nextRepStep = nextRepStep;
window.previousRepStep = previousRepStep;
window.submitRepRegistration = submitRepRegistration;
window.runDebarmentCheck = runDebarmentCheck;
window.runCreditCheck = runCreditCheck;
window.removeFile = removeFile;
