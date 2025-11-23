// CPD Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCPDDashboard();
    initializeCharts();
});

function initializeCPDDashboard() {
    // Initialize progress circle
    updateProgressCircle();
    
    // Set up tab switching
    setupTabSwitching();
    
    // Initialize date displays
    updateCycleInfo();
}

function updateProgressCircle() {
    const progress = 78; // 14/18 hours = 78%
    const circumference = 2 * Math.PI * 85; // radius = 85
    const offset = circumference - (progress / 100) * circumference;
    
    const progressCircle = document.querySelector('.progress-circle-progress');
    if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
        
        // Set color based on progress
        if (progress < 60) {
            progressCircle.classList.remove('progress-amber', 'progress-green');
            progressCircle.classList.add('progress-red');
        } else if (progress < 80) {
            progressCircle.classList.remove('progress-red', 'progress-green');
            progressCircle.classList.add('progress-amber');
        } else {
            progressCircle.classList.remove('progress-red', 'progress-amber');
            progressCircle.classList.add('progress-green');
        }
    }
}

function initializeCharts() {
    // Verifiable Status Pie Chart
    const ctx = document.getElementById('verifiableChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Verifiable', 'Non-verifiable'],
                datasets: [{
                    data: [12, 2],
                    backgroundColor: [
                        '#17A2B8',
                        '#6c757d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function updateCycleInfo() {
    // Calculate days remaining
    const cycleEnd = new Date('2025-05-31');
    const today = new Date();
    const daysRemaining = Math.ceil((cycleEnd - today) / (1000 * 60 * 60 * 24));
    
    // Update any elements that show days remaining
    const daysElements = document.querySelectorAll('[data-days-remaining]');
    daysElements.forEach(el => {
        el.textContent = daysRemaining;
    });
}

function setupTabSwitching() {
    // Handle tab changes
    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target');
            // Initialize specific tab content if needed
            if (targetId === '#log') {
                initializeActivityLog();
            } else if (targetId === '#upload') {
                initializeUploadForm();
            }
        });
    });
}

function switchTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

function initializeActivityLog() {
    // Initialize activity log functionality
    console.log('Activity log initialized');
}

function initializeUploadForm() {
    // Initialize upload form functionality
    setupFileUpload();
    setupUploadMethodSelection();
}

function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('certificateFile');
    
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
                handleFileUpload(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

function handleFileUpload(file) {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
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
    
    // Show preview
    showFilePreview(file);
}

function showFilePreview(file) {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadZone.innerHTML = `
                <div class="text-center py-3">
                    <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                    <p class="mb-1"><strong>${file.name}</strong></p>
                    <p class="small text-muted mb-2">${(file.size / 1024).toFixed(2)} KB</p>
                    <button class="btn btn-sm btn-outline-primary me-2">View</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFile()">Remove</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function removeFile() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('certificateFile');
    
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
    }
    
    if (fileInput) {
        fileInput.value = '';
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
    const certificateForm = document.getElementById('certificateUploadForm');
    // Show/hide form sections based on method
    // This would show manual entry form if method === 'manual'
}

// Export function for tab switching
window.switchTab = switchTab;

