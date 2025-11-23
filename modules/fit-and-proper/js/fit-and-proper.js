// Fit & Proper Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFitProper();
});

function initializeFitProper() {
    setupSidebarNavigation();
    setupClickableRows();
    setupFileUploads();
}

function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });
            
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
                target.style.display = 'block';
            }
            
            // Close sidebar on mobile
            const sidebar = document.getElementById('fitProperSidebar');
            if (sidebar && window.innerWidth < 992) {
                sidebar.classList.remove('show');
            }
        });
    });
    
    // Close sidebar button
    const closeBtn = document.getElementById('closeSidebar');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('fitProperSidebar');
            if (sidebar) {
                sidebar.classList.remove('show');
            }
        });
    }
}

function setupClickableRows() {
    const clickableRows = document.querySelectorAll('.clickable-row');
    clickableRows.forEach(row => {
        row.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
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
                input.onchange = (e) => {
                    if (e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0], zone);
                    }
                };
                input.click();
            });
        }
    });
}

function handleFileUpload(file, zone) {
    // Validate file
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
    const reader = new FileReader();
    reader.onload = function(e) {
        zone.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                <p class="mb-1"><strong>${file.name}</strong></p>
                <p class="small text-muted mb-2">${formatFileSize(file.size)}</p>
                <button class="btn btn-sm btn-outline-primary me-2">View</button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFile(this)">Remove</button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile(btn) {
    const zone = btn.closest('.upload-zone');
    if (zone) {
        zone.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                <p class="mb-2"><strong>Drag & drop file here</strong></p>
                <button type="button" class="btn btn-sm btn-primary">Browse</button>
                <p class="mt-2 small text-muted">PDF, JPG, PNG - Max 5MB</p>
            </div>
        `;
        setupFileUploads(); // Re-initialize
    }
}

function switchSection(sectionName) {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show target section
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    const target = document.getElementById(sectionName);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export for global access
window.switchSection = switchSection;
window.removeFile = removeFile;

