// Log Complaint JavaScript

let complaintWizardData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    files: []
};

let representativesList = [];
let clientsList = [];
let usersList = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintLogging();
});

async function initializeComplaintLogging() {
    setupComplaintTypeSelection();
    setupCategoryDropdown();
    setupFileUploads();
    setupRepresentativeToggle();
    setupFormValidation();
    setupClientSearch();
    
    // Ensure type selection is visible and wizard is hidden initially
    const typeSelection = document.getElementById('complaintTypeSelection');
    const wizard = document.getElementById('complaintWizard');
    if (typeSelection) {
        typeSelection.style.display = 'block';
    }
    if (wizard) {
        wizard.style.display = 'none';
    }
    
    // Show step 1 when wizard is displayed
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.classList.add('active');
        step1.style.display = 'block';
    }
    
    // Hide all other steps
    const allSteps = document.querySelectorAll('.wizard-step');
    allSteps.forEach((step) => {
        if (step.id !== 'step1') {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });
    
    // Load data when log tab is shown
    const logTab = document.getElementById('log-tab');
    if (logTab) {
        logTab.addEventListener('shown.bs.tab', function() {
            // Reset to type selection when tab is shown
            if (typeSelection) {
                typeSelection.style.display = 'block';
            }
            if (wizard) {
                wizard.style.display = 'none';
            }
            loadComplaintWizardData();
        });
        
        // Also check if tab is already active
        if (logTab.classList.contains('active')) {
            if (typeSelection) {
                typeSelection.style.display = 'block';
            }
            if (wizard) {
                wizard.style.display = 'none';
            }
            loadComplaintWizardData();
        }
    }
}

/**
 * Load data needed for complaint wizard
 */
async function loadComplaintWizardData() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load representatives
        const repsResult = await dataFunctionsToUse.getRepresentatives('active');
        representativesList = repsResult?.data || repsResult || [];
        
        // Load clients
        const clientsResult = await dataFunctionsToUse.getClients();
        clientsList = clientsResult?.data || clientsResult || [];
        
        // Load users for assignment
        const usersResult = await dataFunctionsToUse.getUserProfiles('active');
        usersList = usersResult?.data || usersResult || [];
        
        // Populate representative dropdown
        populateRepresentativeDropdown();
        
        // Populate assigned to dropdown
        populateAssignedToDropdown();
        
        // Set default date to today
        const dateReceived = document.getElementById('dateReceived');
        if (dateReceived) {
            const today = new Date().toISOString().split('T')[0];
            dateReceived.value = today;
        }
    } catch (error) {
        console.error('Error loading complaint wizard data:', error);
    }
}

/**
 * Populate Representative Dropdown
 */
function populateRepresentativeDropdown() {
    const select = document.getElementById('representativeSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select representative...</option>';
    
    representativesList.forEach(rep => {
        const option = document.createElement('option');
        option.value = rep.id;
        option.textContent = `${rep.first_name || ''} ${rep.surname || ''} (${rep.representative_number || 'N/A'})`.trim();
        select.appendChild(option);
    });
}

/**
 * Populate Assigned To Dropdown
 */
function populateAssignedToDropdown() {
    const select = document.getElementById('assignedTo');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select handler...</option>';
    
    usersList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        const role = user.role_name || user.role_display_name || '';
        option.textContent = `${user.first_name || ''} ${user.last_name || ''}${role ? ` (${role})` : ''}`.trim();
        select.appendChild(option);
    });
}

function setupComplaintTypeSelection() {
    const typeCards = document.querySelectorAll('.complaint-type-card');
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            typeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function startComplaintLogging(type) {
    // Hide type selection
    const typeSelection = document.getElementById('complaintTypeSelection');
    if (typeSelection) {
        typeSelection.style.display = 'none';
    }
    
    // Show wizard
    const wizard = document.getElementById('complaintWizard');
    if (wizard) {
        wizard.style.display = 'block';
    }
    
    // Show step 1 and hide others
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.classList.add('active');
        step1.style.display = 'block';
    }
    
    // Hide all other steps
    const allSteps = document.querySelectorAll('.wizard-step');
    allSteps.forEach((step, index) => {
        if (index !== 0) { // Skip step 1
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });
    
    updateWizardProgress(1);
    
    // Reset wizard data
    complaintWizardData = {
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        files: []
    };
    
    // Load data
    loadComplaintWizardData();
}

function cancelComplaintLogging() {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
        document.getElementById('complaintTypeSelection').style.display = 'block';
        document.getElementById('complaintWizard').style.display = 'none';
        resetWizard();
    }
}

function setupCategoryDropdown() {
    const primaryCategory = document.getElementById('primaryCategory');
    const subCategory = document.getElementById('subCategory');
    
    const subCategories = {
        'Claims Issues': ['Claim Rejected', 'Claim Delayed', 'Claim Amount Disputed', 'Documentation Requirements'],
        'Service Quality': ['Unresponsive Representative', 'Poor Communication', 'Incorrect Information', 'Unprofessional Behavior'],
        'Product Issues': ['Mis-selling', 'Unsuitable Product', 'Disclosure Failures', 'TCF Concerns'],
        'Financial Concerns': ['Fee Disputes', 'Commission Issues', 'Premium Queries', 'Refund Requests'],
        'Administrative': ['Policy Administration', 'Documentation Errors', 'Processing Delays'],
        'Other': ['Other (please specify)']
    };
    
    if (primaryCategory && subCategory) {
        primaryCategory.addEventListener('change', function() {
            const selected = this.value;
            subCategory.innerHTML = '<option value="">Select sub-category...</option>';
            subCategory.required = true;
            
            if (subCategories[selected]) {
                subCategories[selected].forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    subCategory.appendChild(option);
                });
            }
        });
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
                Array.from(files).forEach(file => {
                    handleFileUpload(file, zone);
                });
            }
        });
        
        const browseBtn = zone.querySelector('button');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
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
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a PDF, JPG, PNG, Word, or Excel file.'
        });
        return;
    }
    
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be less than 10MB.'
        });
        return;
    }
    
    // Store file
    complaintWizardData.files.push(file);
    
    // Show file preview
    const fileIcon = getFileIcon(file.type);
    let existingFiles = zone.querySelector('.file-list');
    if (!existingFiles) {
        existingFiles = document.createElement('div');
        existingFiles.className = 'file-list mt-2';
        zone.appendChild(existingFiles);
    }
    
    const fileItem = document.createElement('div');
    fileItem.className = 'd-flex align-items-center justify-content-between mb-2 p-2 bg-light rounded';
    fileItem.dataset.fileName = file.name;
    fileItem.innerHTML = `
        ${fileIcon}
        <span class="flex-grow-1 ms-2">${file.name}</span>
        <small class="text-muted me-2">${formatFileSize(file.size)}</small>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFile(this)">Remove</button>
    `;
    
    existingFiles.appendChild(fileItem);
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) {
        return '<i class="fas fa-file-pdf text-danger"></i>';
    } else if (fileType.includes('word') || fileType.includes('document')) {
        return '<i class="fas fa-file-word text-primary"></i>';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        return '<i class="fas fa-file-excel text-success"></i>';
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
    const fileItem = btn.closest('.d-flex');
    const fileName = fileItem.dataset.fileName;
    
    // Remove from stored files
    complaintWizardData.files = complaintWizardData.files.filter(f => f.name !== fileName);
    
    fileItem.remove();
}

function setupRepresentativeToggle() {
    const repYes = document.getElementById('repYes');
    const repNo = document.getElementById('repNo');
    const repSection = document.getElementById('representativeSection');
    
    if (repYes && repNo && repSection) {
        repYes.addEventListener('change', function() {
            if (this.checked) {
                repSection.style.display = 'block';
                document.getElementById('representativeSelect').required = true;
            }
        });
        
        repNo.addEventListener('change', function() {
            if (this.checked) {
                repSection.style.display = 'none';
                document.getElementById('representativeSelect').required = false;
                document.getElementById('representativeSelect').value = '';
            }
        });
    }
}

function showNewClientForm() {
    const form = document.getElementById('newClientForm');
    if (form) {
        form.style.display = 'block';
    }
}

/**
 * Setup Client Search
 */
function setupClientSearch() {
    const searchBtn = document.getElementById('searchClientBtn');
    const searchInput = document.getElementById('clientSearch');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', searchClients);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchClients();
            }
        });
    }
}

function searchClients() {
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
    const resultsDiv = document.getElementById('clientSearchResults');
    
    if (!searchTerm) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const matches = clientsList.filter(client => {
        const name = `${client.first_name || ''} ${client.last_name || ''} ${client.company_name || ''}`.toLowerCase();
        const id = (client.id_number || '').toLowerCase();
        const email = (client.email || '').toLowerCase();
        const phone = (client.phone || '').toLowerCase();
        const mobile = (client.mobile || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               id.includes(searchTerm) || 
               email.includes(searchTerm) || 
               phone.includes(searchTerm) || 
               mobile.includes(searchTerm);
    });
    
    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No clients found</div>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    resultsDiv.innerHTML = matches.map(client => {
        const name = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim();
        return `
            <div class="card mb-2">
                <div class="card-body">
                    <h6 class="mb-1">${name}</h6>
                    <p class="mb-1 small text-muted">${client.email || 'No email'}</p>
                    <button class="btn btn-sm btn-primary" onclick="selectClient('${client.id}', '${name.replace(/'/g, "\\'")}')">Select</button>
                </div>
            </div>
        `;
    }).join('');
    resultsDiv.style.display = 'block';
}

function selectClient(clientId, clientName) {
    document.getElementById('selectedClientId').value = clientId;
    document.getElementById('clientSearch').value = clientName;
    document.getElementById('clientSearchResults').style.display = 'none';
    document.getElementById('newClientForm').style.display = 'none';
}

function nextComplaintStep(step) {
    // Validate current step before proceeding
    if (!validateCurrentStep(step - 1)) {
        return;
    }
    
    // Save current step data
    saveStepData(step - 1);
    
    // Hide current step
    const currentStep = document.querySelector('.wizard-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Show next step
    const nextStep = document.getElementById(`step${step}`);
    if (nextStep) {
        nextStep.classList.add('active');
        nextStep.style.display = 'block';
        updateWizardProgress(step);
        
        // If step 5, update review summary
        if (step === 5) {
            updateReviewSummary();
        }
    }
}

function previousComplaintStep(step) {
    // Hide current step
    const currentStep = document.querySelector('.wizard-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Show previous step
    const prevStep = document.getElementById(`step${step}`);
    if (prevStep) {
        prevStep.classList.add('active');
        prevStep.style.display = 'block';
        updateWizardProgress(step);
    }
}

function validateCurrentStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    if (!stepElement) return true;
    
    const form = stepElement.querySelector('form') || stepElement;
    const requiredFields = form.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Required Field Missing',
                text: `Please fill in: ${field.labels[0]?.textContent || field.name || 'this field'}`
            });
            field.focus();
            return false;
        }
    }
    
    // Step-specific validation
    if (step === 1) {
        const description = document.getElementById('complaintDescription')?.value || '';
        if (description.length < 50) {
            Swal.fire({
                icon: 'warning',
                title: 'Description Too Short',
                text: 'Please provide at least 50 characters in the detailed description.'
            });
            return false;
        }
    }
    
    return true;
}

function saveStepData(step) {
    switch(step) {
        case 1:
            complaintWizardData.step1 = {
                dateReceived: document.getElementById('dateReceived')?.value || '',
                timeReceived: document.getElementById('timeReceived')?.value || '',
                complaintChannel: document.getElementById('complaintChannel')?.value || '',
                urgency: document.querySelector('input[name="urgency"]:checked')?.value || 'standard',
                primaryCategory: document.getElementById('primaryCategory')?.value || '',
                subCategory: document.getElementById('subCategory')?.value || '',
                complaintSummary: document.getElementById('complaintSummary')?.value || ''
            };
            break;
        case 2:
            complaintWizardData.step2 = {
                clientId: document.getElementById('selectedClientId')?.value || '',
                newClientName: document.getElementById('newClientName')?.value || '',
                newClientId: document.getElementById('newClientId')?.value || '',
                newClientEmail: document.getElementById('newClientEmail')?.value || '',
                newClientMobile: document.getElementById('newClientMobile')?.value || ''
            };
            break;
        case 3:
            complaintWizardData.step3 = {
                complaintDescription: document.getElementById('complaintDescription')?.value || '',
                incidentDate: document.getElementById('incidentDate')?.value || '',
                financialImpact: document.getElementById('financialImpact')?.value || '',
                expectedResolution: document.getElementById('expectedResolution')?.value || ''
            };
            break;
        case 4:
            complaintWizardData.step4 = {
                repInvolved: document.querySelector('input[name="repInvolved"]:checked')?.value || 'no',
                representativeId: document.getElementById('representativeSelect')?.value || ''
            };
            break;
    }
}

function updateWizardProgress(currentStep) {
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

function updateReviewSummary() {
    const summaryDiv = document.getElementById('reviewSummary');
    if (!summaryDiv) return;
    
    const step1 = complaintWizardData.step1;
    const step2 = complaintWizardData.step2;
    const step3 = complaintWizardData.step3;
    const step4 = complaintWizardData.step4;
    
    // Calculate dates
    const receivedDate = new Date(step1.dateReceived);
    const sixWeekDeadline = new Date(receivedDate);
    sixWeekDeadline.setDate(sixWeekDeadline.getDate() + 42); // 6 weeks
    
    const sixMonthDeadline = new Date(receivedDate);
    sixMonthDeadline.setMonth(sixMonthDeadline.getMonth() + 6);
    
    // Update summary
    summaryDiv.innerHTML = `
        <p><strong>Date Received:</strong> ${formatDate(step1.dateReceived)} ${step1.timeReceived || ''}</p>
        <p><strong>Category:</strong> ${step1.primaryCategory}${step1.subCategory ? ' - ' + step1.subCategory : ''}</p>
        <p><strong>Urgency:</strong> ${step1.urgency.charAt(0).toUpperCase() + step1.urgency.slice(1)}</p>
        <p><strong>Complainant:</strong> ${step2.clientId ? 'Existing Client' : (step2.newClientName || 'New Client')}</p>
        ${step4.repInvolved === 'yes' && step4.representativeId ? `<p><strong>Representative:</strong> ${getRepresentativeName(step4.representativeId)}</p>` : ''}
    `;
    
    // Update deadlines
    document.getElementById('sixWeekDeadline').textContent = `6-week deadline: ${formatDate(sixWeekDeadline.toISOString().split('T')[0])}`;
    document.getElementById('sixMonthDeadline').textContent = `6-month deadline: ${formatDate(sixMonthDeadline.toISOString().split('T')[0])}`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA');
}

function getRepresentativeName(repId) {
    const rep = representativesList.find(r => r.id === repId);
    return rep ? `${rep.first_name || ''} ${rep.surname || ''}`.trim() : 'N/A';
}

function resetWizard() {
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show first step
    const firstStep = document.getElementById('step1');
    if (firstStep) {
        firstStep.classList.add('active');
        firstStep.style.display = 'block';
    }
    
    // Reset all forms
    document.querySelectorAll('form').forEach(form => form.reset());
    document.getElementById('selectedClientId').value = '';
    document.getElementById('newClientForm').style.display = 'none';
    document.getElementById('clientSearchResults').style.display = 'none';
    document.getElementById('representativeSection').style.display = 'none';
    document.querySelectorAll('.file-list').forEach(list => list.remove());
    
    complaintWizardData = {
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        files: []
    };
    
    updateWizardProgress(1);
}

function setupFormValidation() {
    // Add validation listeners
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
}

/**
 * Generate Complaint Reference Number
 */
function generateComplaintReference() {
    const year = new Date().getFullYear();
    // This would ideally come from the database sequence
    // For now, we'll use a timestamp-based approach
    const timestamp = Date.now().toString().slice(-6);
    return `CMP-${year}-${timestamp}`;
}

/**
 * Submit Complaint
 */
async function submitComplaint() {
    // Validate step 5
    if (!validateCurrentStep(5)) {
        return;
    }
    
    // Save step 5 data
    saveStepData(5);
    
    // Collect all data
    const step1 = complaintWizardData.step1;
    const step2 = complaintWizardData.step2;
    const step3 = complaintWizardData.step3;
    const step4 = complaintWizardData.step4;
    const assignedTo = document.getElementById('assignedTo')?.value || '';
    
    // Validate required fields
    if (!step1.dateReceived || !step1.complaintChannel || !step1.primaryCategory || !step1.complaintSummary) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please complete all required fields in Step 1.'
        });
        return;
    }
    
    if (!step3.complaintDescription || !step3.expectedResolution) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please complete all required fields in Step 3.'
        });
        return;
    }
    
    if (!assignedTo) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please assign a handler for this complaint.'
        });
        return;
    }
    
    // Determine complainant name and contact
    let complainantName = '';
    let complainantEmail = '';
    let complainantPhone = '';
    let clientId = null;
    
    if (step2.clientId) {
        // Existing client
        const client = clientsList.find(c => c.id === step2.clientId);
        if (client) {
            complainantName = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim();
            complainantEmail = client.email || '';
            complainantPhone = client.mobile || client.phone || '';
            clientId = client.id;
        }
    } else if (step2.newClientName) {
        // New client
        complainantName = step2.newClientName;
        complainantEmail = step2.newClientEmail || '';
        complainantPhone = step2.newClientMobile || '';
        // TODO: Create client first, then use client ID
    }
    
    if (!complainantName) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please provide client information in Step 2.'
        });
        return;
    }
    
    // Generate reference number
    const referenceNumber = generateComplaintReference();
    
    // Prepare complaint data
    const complaintDate = step1.dateReceived;
    const complaintReceivedDate = step1.dateReceived; // Same as complaint date for now
    
    // Map urgency to priority
    const priorityMap = {
        'standard': 'medium',
        'high': 'high',
        'critical': 'high'
    };
    const priority = priorityMap[step1.urgency] || 'medium';
    
    // Map urgency to severity
    const severityMap = {
        'standard': 'minor',
        'high': 'moderate',
        'critical': 'major'
    };
    const severity = severityMap[step1.urgency] || 'minor';
    
    const complaintData = {
        complaint_reference_number: referenceNumber,
        complainant_name: complainantName,
        complaint_date: complaintDate,
        complaint_received_date: complaintReceivedDate,
        complaint_channel: step1.complaintChannel,
        complaint_category: `${step1.primaryCategory}${step1.subCategory ? ' - ' + step1.subCategory : ''}`,
        complaint_description: step3.complaintDescription,
        client_id: clientId,
        representative_id: step4.repInvolved === 'yes' && step4.representativeId ? step4.representativeId : null,
        complainant_email: complainantEmail || null,
        complainant_phone: complainantPhone || null,
        priority: priority,
        severity: severity,
        assigned_to: assignedTo,
        created_by: null // TODO: Get current user ID
    };
    
    // Show loading
    Swal.fire({
        title: 'Submitting Complaint...',
        text: 'Please wait while we process your complaint',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Submit complaint
        const result = await dataFunctionsToUse.createComplaint(complaintData);
        
        // Handle file uploads (TODO: Implement file upload to storage)
        // For now, files are stored in complaintWizardData.files
        
        // Calculate deadlines
        const receivedDate = new Date(complaintDate);
        const sixWeekDeadline = new Date(receivedDate);
        sixWeekDeadline.setDate(sixWeekDeadline.getDate() + 42);
        
        // Show success
        Swal.fire({
            icon: 'success',
            title: 'Complaint Logged Successfully',
            html: `
                <p><strong>Reference Number:</strong> ${referenceNumber}</p>
                <p><strong>Status:</strong> Open</p>
                <p><strong>6-Week Deadline:</strong> ${formatDate(sixWeekDeadline.toISOString().split('T')[0])}</p>
                <p class="mt-3">Acknowledgment email will be sent within 48 hours</p>
            `,
            confirmButtonText: 'View Complaint Details'
        }).then(() => {
            // Reset wizard
            resetWizard();
            document.getElementById('complaintTypeSelection').style.display = 'block';
            document.getElementById('complaintWizard').style.display = 'none';
            
            // Switch to active complaints tab
            if (typeof switchComplaintsTab === 'function') {
                switchComplaintsTab('active-tab');
            }
            
            // Reload active complaints
            if (typeof loadActiveComplaints === 'function') {
                loadActiveComplaints();
            }
        });
    } catch (error) {
        console.error('Error submitting complaint:', error);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error.message || 'Failed to submit complaint. Please try again.'
        });
    }
}

// Export for global access
window.startComplaintLogging = startComplaintLogging;
window.cancelComplaintLogging = cancelComplaintLogging;
window.nextComplaintStep = nextComplaintStep;
window.previousComplaintStep = previousComplaintStep;
window.showNewClientForm = showNewClientForm;
window.submitComplaint = submitComplaint;
window.removeFile = removeFile;
window.selectClient = selectClient;
window.searchClients = searchClients;
