// Upload Activity JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeUploadActivity();
});

function initializeUploadActivity() {
    setupFormValidation();
    setupHoursValidation();
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
    const hoursInput = form.querySelector('input[type="number"]');
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
    
    return isValid;
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

function submitActivity() {
    // Show loading
    Swal.fire({
        title: 'Submitting...',
        text: 'Please wait while we process your CPD activity',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Simulate API call
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Activity Submitted',
            text: 'Your CPD activity has been submitted successfully.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Switch to activity log tab
            switchTab('log-tab');
            // Reset form
            document.getElementById('cpdActivityForm').reset();
        });
    }, 1500);
}

