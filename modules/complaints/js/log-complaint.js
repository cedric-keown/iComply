// Log Complaint JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintLogging();
});

function initializeComplaintLogging() {
    setupComplaintTypeSelection();
    setupCategoryDropdown();
    setupFileUploads();
    setupRepresentativeToggle();
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
    document.getElementById('complaintTypeSelection').style.display = 'none';
    document.getElementById('complaintWizard').style.display = 'block';
    updateWizardProgress(1);
}

function cancelComplaintLogging() {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
        document.getElementById('complaintTypeSelection').style.display = 'block';
        document.getElementById('complaintWizard').style.display = 'none';
        // Reset wizard
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
                handleFileUpload(files[0], zone);
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
        <button class="btn btn-sm btn-outline-danger" onclick="removeFile(this)">Remove</button>
    `;
    
    if (!zone.querySelector('.file-list')) {
        zone.appendChild(existingFiles);
    }
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
    btn.closest('.d-flex').remove();
}

function setupRepresentativeToggle() {
    const repYes = document.getElementById('repYes');
    const repNo = document.getElementById('repNo');
    const repSection = document.getElementById('representativeSection');
    
    if (repYes && repNo && repSection) {
        repYes.addEventListener('change', function() {
            if (this.checked) {
                repSection.style.display = 'block';
            }
        });
        
        repNo.addEventListener('change', function() {
            if (this.checked) {
                repSection.style.display = 'none';
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

function nextComplaintStep(step) {
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
    
    updateWizardProgress(1);
}

function submitComplaint() {
    Swal.fire({
        title: 'Submitting Complaint...',
        text: 'Please wait while we process your complaint',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Simulate submission
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Complaint Logged Successfully',
            html: `
                <p><strong>Reference Number:</strong> CMP-2024-010</p>
                <p><strong>Status:</strong> Received</p>
                <p><strong>Assigned to:</strong> Sarah Naidoo</p>
                <p><strong>6-Week Deadline:</strong> 26/01/2025</p>
                <p class="mt-3">Acknowledgment email will be sent within 48 hours</p>
            `,
            confirmButtonText: 'View Complaint Details'
        }).then(() => {
            // Switch to active complaints tab
            switchComplaintsTab('active-tab');
        });
    }, 2000);
}

// Export for global access
window.startComplaintLogging = startComplaintLogging;
window.cancelComplaintLogging = cancelComplaintLogging;
window.nextComplaintStep = nextComplaintStep;
window.previousComplaintStep = previousComplaintStep;
window.showNewClientForm = showNewClientForm;
window.submitComplaint = submitComplaint;
window.removeFile = removeFile;

