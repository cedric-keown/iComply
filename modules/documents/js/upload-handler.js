// Upload Handler JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeUploadHandler();
});

function initializeUploadHandler() {
    setupFileUpload();
    setupUploadMethodSelection();
    setupFormValidation();
}

function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('documentFile');
    const detailsForm = document.getElementById('documentDetailsForm');
    
    if (uploadZone && fileInput) {
        // Click to browse
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelection(e.target.files[0]);
            }
        });
    }
}

function handleFileSelection(file) {
    // Validate file
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG file.'
        });
        return;
    }
    
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be less than 50MB.'
        });
        return;
    }
    
    // Show file preview and form
    showFilePreview(file);
    const detailsForm = document.getElementById('documentDetailsForm');
    if (detailsForm) {
        detailsForm.style.display = 'block';
    }
    
    // Pre-fill form with filename
    const nameInput = detailsForm?.querySelector('input[type="text"]');
    if (nameInput) {
        nameInput.value = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    }
}

function showFilePreview(file) {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileIcon = getFileIcon(file.type);
            uploadZone.innerHTML = `
                <div class="text-center py-3">
                    ${fileIcon}
                    <p class="mb-1 mt-2"><strong>${file.name}</strong></p>
                    <p class="small text-muted mb-2">${formatFileSize(file.size)}</p>
                    <button class="btn btn-sm btn-outline-primary me-2">View</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFile()">Remove</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) {
        return '<i class="fas fa-file-pdf fa-4x text-danger"></i>';
    } else if (fileType.includes('word') || fileType.includes('document')) {
        return '<i class="fas fa-file-word fa-4x text-primary"></i>';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        return '<i class="fas fa-file-excel fa-4x text-success"></i>';
    } else if (fileType.includes('image')) {
        return '<i class="fas fa-file-image fa-4x text-info"></i>';
    } else {
        return '<i class="fas fa-file fa-4x text-secondary"></i>';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('documentFile');
    const detailsForm = document.getElementById('documentDetailsForm');
    
    if (uploadZone) {
        uploadZone.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-cloud-upload-alt fa-4x text-muted mb-3"></i>
                <p class="mb-2"><strong>Drag & drop your file here</strong></p>
                <p class="text-muted mb-3">or</p>
                <button class="btn btn-primary">Browse Files</button>
                <p class="mt-3 small text-muted">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 50MB)</p>
            </div>
        `;
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (detailsForm) {
        detailsForm.style.display = 'none';
    }
}

function setupUploadMethodSelection() {
    const methodCards = document.querySelectorAll('.upload-method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all
            methodCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            toggleUploadForm(method);
        });
    });
}

function toggleUploadForm(method) {
    // Show/hide form sections based on method
    console.log('Upload method:', method);
}

function setupFormValidation() {
    const form = document.querySelector('#documentDetailsForm form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitDocument();
            }
        });
    }
}

function validateForm() {
    const form = document.querySelector('#documentDetailsForm form');
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
    
    return isValid;
}

function submitDocument() {
    Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while we upload your document',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Simulate upload
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Document Uploaded',
            text: 'Your document has been uploaded successfully.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reset form
            const form = document.querySelector('#documentDetailsForm form');
            if (form) form.reset();
            removeFile();
            // Switch to library tab
            switchDocTab('library-tab');
        });
    }, 2000);
}

// Export for global access
window.removeFile = removeFile;

