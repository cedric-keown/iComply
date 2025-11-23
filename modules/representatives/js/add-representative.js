// Add Representative JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRepRegistration();
});

function initializeRepRegistration() {
    setupRepTypeSelection();
    setupFileUploads();
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

function startRepRegistration(type) {
    document.getElementById('repTypeSelection').style.display = 'none';
    document.getElementById('repWizard').style.display = 'block';
    updateRepWizardProgress(1);
}

function cancelRepRegistration() {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
        document.getElementById('repTypeSelection').style.display = 'block';
        document.getElementById('repWizard').style.display = 'none';
        resetRepWizard();
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
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a PDF, JPG, or PNG file.'
        });
        return;
    }
    
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be less than 5MB.'
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

function nextRepStep(step) {
    // Hide current step
    const currentStep = document.querySelector('.wizard-step.active');
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
    }
}

function previousRepStep(step) {
    // Hide current step
    const currentStep = document.querySelector('.wizard-step.active');
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
    
    updateRepWizardProgress(1);
}

function runDebarmentCheck() {
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

function submitRepRegistration() {
    Swal.fire({
        title: 'Submitting Registration...',
        text: 'Please wait while we process the registration',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Representative Registered Successfully',
            html: `
                <p><strong>FSP Number:</strong> REP-12345-015</p>
                <p><strong>Status:</strong> Active</p>
                <p><strong>System Access:</strong> Enabled</p>
                <p class="mt-3">Welcome email will be sent with login details</p>
            `,
            confirmButtonText: 'View Representative Profile'
        }).then(() => {
            switchRepsTab('directory-tab');
        });
    }, 2000);
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

