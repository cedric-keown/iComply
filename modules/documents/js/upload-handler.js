// Upload Handler JavaScript - Database Integrated

let currentFile = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeUploadHandler();
    
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

async function initializeUploadHandler() {
    const uploadTab = document.getElementById('upload-tab');
    if (uploadTab) {
        uploadTab.addEventListener('shown.bs.tab', function() {
            resetUploadForm();
        });
    }
    
    setupFileUpload();
    setupUploadMethodSelection();
    setupFormValidation();
    loadRepresentatives();
}

/**
 * Load Representatives for dropdown
 */
async function loadRepresentatives() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) return;
        
        const reps = await dataFunctionsToUse.getRepresentatives();
        let repsList = reps;
        if (reps && reps.data) {
            repsList = reps.data;
        } else if (reps && Array.isArray(reps)) {
            repsList = reps;
        }
        
        // Find the representative select dropdown
        let repSelect = document.getElementById('representativeSelect');
        if (!repSelect) {
            // Fallback: try to find by name or attribute
            repSelect = document.querySelector('#upload select[name*="representative"], #upload select[id*="representative"], #documentDetailsForm select');
        }
        if (repSelect && repsList && Array.isArray(repsList) && repsList.length > 0) {
            repSelect.innerHTML = '<option value="">Select representative...</option>' +
                repsList.map(rep => 
                    `<option value="${rep.id}">${rep.first_name || ''} ${rep.surname || ''}</option>`
                ).join('');
        } else if (repSelect) {
            repSelect.innerHTML = '<option value="">No representatives available</option>';
        }
    } catch (error) {
        console.error('Error loading representatives:', error);
    }
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
    
    currentFile = file;
    
    // Show file preview and form
    showFilePreview(file);
    const detailsForm = document.getElementById('documentDetailsForm');
    if (detailsForm) {
        detailsForm.style.display = 'block';
    }
    
    // Pre-fill form with filename
    const nameInput = detailsForm?.querySelector('input[type="text"][placeholder*="name"], input[name*="name"]');
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
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="previewFile()">View</button>
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
    currentFile = null;
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

function previewFile() {
    if (!currentFile) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        Swal.fire({
            title: currentFile.name,
            html: `<img src="${e.target.result}" style="max-width: 100%;" />`,
            width: '80%',
            showCloseButton: true,
            showConfirmButton: false
        });
    };
    reader.readAsDataURL(currentFile);
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
    if (!currentFile) {
        Swal.fire({
            icon: 'error',
            title: 'No File Selected',
            text: 'Please select a file to upload'
        });
        return false;
    }
    
    const form = document.querySelector('#documentDetailsForm form');
    if (!form) return false;
    
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

async function submitDocument() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we upload your document',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const form = document.querySelector('#documentDetailsForm form');
        if (!form) throw new Error('Form not found');
        
        // Collect form data
        const formData = new FormData(form);
        const documentName = form.querySelector('input[type="text"][placeholder*="name"], input[name*="name"]')?.value || currentFile.name;
        const category = form.querySelector('select[name*="category"]')?.value || 'other';
        const documentDateInput = form.querySelector('input[type="date"]');
        const documentDate = documentDateInput?.value || null;
        const expiryDateInput = form.querySelectorAll('input[type="date"]')[1];
        const expiryDate = expiryDateInput?.value || null;
        
        // Update retention info if document date is provided
        if (documentDate) {
            updateRetentionInfo(documentDate);
        }
        const description = form.querySelector('textarea')?.value || null;
        const tagsInput = form.querySelector('input[placeholder*="tags"]')?.value || '';
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : null;
        const isSensitive = form.querySelector('#sensitiveDoc')?.checked || false;
        const representativeId = form.querySelector('#representativeSelect, select[name*="representative"]')?.value || null;
        
        // Determine owner type and ID
        let ownerType = 'fsp';
        let ownerId = null;
        
        if (representativeId) {
            ownerType = 'representative';
            ownerId = representativeId;
        }
        
        // TODO: Upload file to Supabase Storage first
        // For now, we'll create the document record without storage
        // In production, upload to Supabase Storage bucket and get URL
        
        const documentData = {
            document_owner_type: ownerType,
            document_owner_id: ownerId || '00000000-0000-0000-0000-000000000000', // FSP ID placeholder
            document_name: documentName,
            document_type: getFileTypeFromMime(currentFile.type),
            document_category: category,
            file_name: currentFile.name,
            file_size_bytes: currentFile.size,
            file_type: getFileExtension(currentFile.name),
            mime_type: currentFile.type,
            storage_path: `documents/${Date.now()}_${currentFile.name}`, // Placeholder
            storage_url: null, // Will be set after upload
            document_date: documentDate,
            expiry_date: expiryDate,
            retention_period_years: 5,
            description: description,
            tags: tags,
            is_sensitive: isSensitive,
            uploaded_by: null // TODO: Get current user ID
        };
        
        // Create document record
        const result = await dataFunctionsToUse.createDocument(documentData);
        
        Swal.fire({
            icon: 'success',
            title: 'Document Uploaded',
            text: 'Your document has been uploaded successfully.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reset form
            resetUploadForm();
            // Switch to library tab and reload
            switchDocTab('library-tab');
            if (typeof loadDocuments === 'function') {
                loadDocuments();
            }
        });
        
    } catch (error) {
        console.error('Error uploading document:', error);
        Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: error.message || 'Failed to upload document. Please try again.'
        });
    }
}

function getFileTypeFromMime(mimeType) {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xls';
    if (mimeType.includes('image')) return 'image';
    return 'other';
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function resetUploadForm() {
    currentFile = null;
    removeFile();
    const form = document.querySelector('#documentDetailsForm form');
    if (form) {
        form.reset();
    }
}

/**
 * Update Retention Information Display
 */
function updateRetentionInfo(documentDate) {
    if (!documentDate) return;
    
    const retentionInfo = document.getElementById('retentionInfo');
    const retentionDateText = document.getElementById('retentionDateText');
    const retentionDaysText = document.getElementById('retentionDaysText');
    
    if (!retentionInfo || !retentionDateText || !retentionDaysText) return;
    
    const docDate = new Date(documentDate);
    const retentionYears = 5;
    const deleteAfterDate = new Date(docDate);
    deleteAfterDate.setFullYear(docDate.getFullYear() + retentionYears);
    
    const today = new Date();
    const daysRemaining = Math.ceil((deleteAfterDate - today) / (1000 * 60 * 60 * 24));
    
    retentionDateText.textContent = `This document will be retained until: ${deleteAfterDate.toLocaleDateString('en-ZA')} (${retentionYears} years from document date)`;
    retentionDaysText.textContent = `Retention period: ${daysRemaining} days remaining`;
    retentionInfo.style.display = 'block';
}

// Add event listener for document date changes
document.addEventListener('DOMContentLoaded', function() {
    const documentDateInput = document.querySelector('#documentDetailsForm input[type="date"]');
    if (documentDateInput) {
        documentDateInput.addEventListener('change', function() {
            updateRetentionInfo(this.value);
        });
    }
});

// Export for global access
window.removeFile = removeFile;
window.previewFile = previewFile;
