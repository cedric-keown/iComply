// Fit & Proper Management JavaScript

let fitProperData = {
    currentRecord: null,
    representativeId: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeFitProper();
});

async function initializeFitProper() {
    setupSidebarNavigation();
    setupClickableRows();
    setupFileUploads();
    
    // Load Fit & Proper data when dashboard section is shown
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        // Load data when section becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.id === 'dashboard' && target.style.display !== 'none') {
                        loadFitProperDashboard();
                    }
                }
            });
        });
        observer.observe(dashboardSection, { attributes: true });
        
        // Also load if already visible
        if (dashboardSection.style.display !== 'none') {
            loadFitProperDashboard();
        }
    }
    
    // Load data when other sections are shown
    setupSectionDataLoaders();
}

function setupSectionDataLoaders() {
    const sections = ['qualifications', 'exams', 'cob', 'experience', 'good-standing'];
    sections.forEach(sectionName => {
        const section = document.getElementById(sectionName);
        if (section) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target;
                        if (target.style.display !== 'none') {
                            loadSectionData(sectionName);
                        }
                    }
                });
            });
            observer.observe(section, { attributes: true });
        }
    });
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
                
                // Load data for the section
                loadSectionData(targetSection);
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
        loadSectionData(sectionName);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Get current representative ID
 * This should be the logged-in user's representative ID
 */
async function getCurrentRepresentativeId() {
    // Check if dataFunctions is available
    const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
        ? dataFunctions 
        : (window.dataFunctions || window.parent?.dataFunctions);
    
    if (!dataFunctionsToUse) {
        console.warn('dataFunctions not available');
        return null;
    }
    
    try {
        // Get user's representative profile
        const userProfiles = await dataFunctionsToUse.getUserProfiles();
        let profiles = userProfiles;
        if (userProfiles && userProfiles.data) {
            profiles = userProfiles.data;
        } else if (userProfiles && Array.isArray(userProfiles)) {
            profiles = userProfiles;
        }
        
        // Get the first profile's representative_id
        if (profiles && profiles.length > 0 && profiles[0].representative_id) {
            return profiles[0].representative_id;
        }
        
        // Fallback: get first active representative
        const reps = await dataFunctionsToUse.getRepresentatives();
        let representatives = reps;
        if (reps && reps.data) {
            representatives = reps.data;
        } else if (reps && Array.isArray(reps)) {
            representatives = reps;
        }
        
        if (representatives && representatives.length > 0) {
            return representatives[0].id;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting representative ID:', error);
        return null;
    }
}

/**
 * Load Fit & Proper Dashboard
 */
async function loadFitProperDashboard() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Get representative ID
        const repId = await getCurrentRepresentativeId();
        if (!repId) {
            console.warn('No representative ID found');
            return;
        }
        
        fitProperData.representativeId = repId;
        
        // Load Fit & Proper record
        const recordsResult = await dataFunctionsToUse.getFitAndProperRecords(repId);
        let records = recordsResult;
        if (recordsResult && recordsResult.data) {
            records = recordsResult.data;
        } else if (recordsResult && Array.isArray(recordsResult)) {
            records = recordsResult;
        }
        
        fitProperData.currentRecord = records && records.length > 0 ? records[0] : null;
        
        // Update dashboard
        updateDashboard();
    } catch (error) {
        console.error('Error loading Fit & Proper dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load Fit & Proper data'
        });
    }
}

/**
 * Update Dashboard with loaded data
 */
function updateDashboard() {
    const record = fitProperData.currentRecord;
    
    if (!record) {
        // Show message to create record
        return;
    }
    
    // Update overall status
    const statusBadge = document.querySelector('#dashboard .section-header .badge');
    if (statusBadge) {
        const status = record.overall_status || 'pending';
        if (status === 'compliant') {
            statusBadge.className = 'badge bg-success fs-6';
            statusBadge.textContent = '✅ COMPLIANT';
        } else if (status === 'non_compliant') {
            statusBadge.className = 'badge bg-danger fs-6';
            statusBadge.textContent = '❌ NON-COMPLIANT';
        } else {
            statusBadge.className = 'badge bg-warning fs-6';
            statusBadge.textContent = '⏳ PENDING';
        }
    }
    
    // Calculate score (simplified - would need more complex logic)
    let score = 0;
    let maxScore = 0;
    
    // RE5 (10 points)
    maxScore += 10;
    if (record.re5_status === 'current' || record.re5_qualification_number) {
        score += 10;
    }
    
    // RE1 (10 points)
    maxScore += 10;
    if (record.re1_status === 'current' || record.re1_qualification_number) {
        score += 10;
    }
    
    // COB Training (30 points - 10 per class)
    maxScore += 30;
    if (record.cob_class_1_date) score += 10;
    if (record.cob_class_2_date) score += 10;
    if (record.cob_class_3_date) score += 10;
    
    // Experience (20 points)
    maxScore += 20;
    if (record.experience_verified && record.industry_experience_years >= 3) {
        score += 20;
    } else if (record.industry_experience_years >= 3) {
        score += 10;
    }
    
    // Good Standing (30 points)
    maxScore += 30;
    if (record.criminal_record_clear) score += 10;
    if (record.credit_check_clear) score += 10;
    if (record.character_declaration_signed) score += 10;
    
    const finalScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    
    // Update score display
    const scoreEl = document.querySelector('#dashboard .stat-value');
    if (scoreEl) {
        scoreEl.textContent = `${finalScore}/100`;
    }
    
    const progressBar = document.querySelector('#dashboard .progress-bar');
    if (progressBar) {
        progressBar.style.width = `${finalScore}%`;
        progressBar.className = `progress-bar ${finalScore >= 80 ? 'bg-success' : finalScore >= 60 ? 'bg-warning' : 'bg-danger'}`;
    }
    
    // Update last assessment date
    const lastAssessmentEl = document.querySelector('#dashboard small.text-muted');
    if (lastAssessmentEl && record.last_review_date) {
        const date = new Date(record.last_review_date).toLocaleDateString('en-ZA');
        lastAssessmentEl.textContent = `Last assessment: ${date}`;
    }
    
    // Update next review date
    if (record.next_review_date) {
        const nextReviewEl = document.querySelectorAll('#dashboard small.text-muted')[1];
        if (nextReviewEl) {
            const date = new Date(record.next_review_date).toLocaleDateString('en-ZA');
            nextReviewEl.textContent = `Next review: ${date}`;
        }
    }
    
    // Update requirements checklist
    updateRequirementsChecklist(record);
}

/**
 * Update Requirements Checklist
 */
function updateRequirementsChecklist(record) {
    const tbody = document.querySelector('#dashboard tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    // Qualifications
    updateChecklistRow(rows[0], record.re5_qualification_number || record.re1_qualification_number ? 'compliant' : 'pending', record.updated_at);
    
    // RE1 Certificate
    updateChecklistRow(rows[1], record.re1_status || (record.re1_qualification_number ? 'compliant' : 'pending'), record.re1_issue_date || record.updated_at);
    
    // RE5 Certificate
    updateChecklistRow(rows[2], record.re5_status || (record.re5_qualification_number ? 'compliant' : 'pending'), record.re5_issue_date || record.updated_at);
    
    // COB Training
    const cobComplete = record.cob_class_1_date && record.cob_class_2_date && record.cob_class_3_date;
    updateChecklistRow(rows[3], cobComplete ? 'compliant' : 'incomplete', record.updated_at);
    
    // Management Experience
    updateChecklistRow(rows[4], record.experience_verified ? 'compliant' : 'pending', record.experience_verification_date || record.updated_at);
    
    // Criminal Clearance
    const criminalStatus = record.criminal_record_clear ? 'compliant' : (record.criminal_record_check_date ? 'pending' : 'pending');
    updateChecklistRow(rows[5], criminalStatus, record.criminal_record_check_date || record.updated_at, record.criminal_record_check_date ? new Date(record.criminal_record_check_date).setFullYear(new Date(record.criminal_record_check_date).getFullYear() + 2) : null);
    
    // Credit Check
    updateChecklistRow(rows[6], record.credit_check_clear ? 'compliant' : 'pending', record.credit_check_date || record.updated_at);
    
    // Debarment Check
    updateChecklistRow(rows[7], 'compliant', record.updated_at);
}

function updateChecklistRow(row, status, lastUpdated, expiryDate = null) {
    if (!row) return;
    
    const statusCell = row.querySelector('td:nth-child(2)');
    const lastUpdatedCell = row.querySelector('td:nth-child(3)');
    const expiryCell = row.querySelector('td:nth-child(4)');
    
    if (statusCell) {
        let badgeClass = 'bg-warning';
        let badgeText = '⏳ Pending';
        
        if (status === 'compliant') {
            badgeClass = 'bg-success';
            badgeText = '✅ Compliant';
        } else if (status === 'incomplete') {
            badgeClass = 'bg-warning';
            badgeText = '⚠️ Incomplete';
        } else if (status === 'non_compliant') {
            badgeClass = 'bg-danger';
            badgeText = '❌ Non-compliant';
        }
        
        statusCell.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;
    }
    
    if (lastUpdatedCell && lastUpdated) {
        const date = new Date(lastUpdated).toLocaleDateString('en-ZA');
        lastUpdatedCell.textContent = date;
    }
    
    if (expiryCell && expiryDate) {
        const date = new Date(expiryDate).toLocaleDateString('en-ZA');
        expiryCell.textContent = date;
    } else if (expiryCell) {
        expiryCell.textContent = 'N/A';
    }
}

/**
 * Load Section Data
 */
async function loadSectionData(sectionName) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            return;
        }
        
        // Ensure we have the record loaded
        if (!fitProperData.currentRecord && fitProperData.representativeId) {
            const recordsResult = await dataFunctionsToUse.getFitAndProperRecords(fitProperData.representativeId);
            let records = recordsResult;
            if (recordsResult && recordsResult.data) {
                records = recordsResult.data;
            } else if (recordsResult && Array.isArray(recordsResult)) {
                records = recordsResult;
            }
            fitProperData.currentRecord = records && records.length > 0 ? records[0] : null;
        }
        
        switch (sectionName) {
            case 'exams':
                loadExamsSection();
                break;
            case 'cob':
                loadCobSection();
                break;
            case 'experience':
                loadExperienceSection();
                break;
            case 'good-standing':
                loadGoodStandingSection();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${sectionName} section:`, error);
    }
}

/**
 * Load Exams Section
 */
function loadExamsSection() {
    const record = fitProperData.currentRecord;
    if (!record) return;
    
    // Update RE1 card
    if (record.re1_qualification_number) {
        const re1Card = document.querySelector('#exams .card:first-of-type');
        if (re1Card) {
            const statusBadge = re1Card.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = '✅ PASSED';
                statusBadge.className = 'badge bg-success fs-6 mb-2';
            }
            
            // Update exam date
            if (record.re1_issue_date) {
                const examDateEl = re1Card.querySelector('p:has(strong:contains("Exam Date"))');
                if (examDateEl) {
                    examDateEl.innerHTML = `<strong>Exam Date:</strong> ${new Date(record.re1_issue_date).toLocaleDateString('en-ZA')}`;
                }
            }
            
            // Update certificate number
            if (record.re1_qualification_number) {
                const certEl = re1Card.querySelector('p:has(strong:contains("Certificate Number"))');
                if (certEl) {
                    certEl.innerHTML = `<strong>Certificate Number:</strong> ${record.re1_qualification_number}`;
                }
            }
        }
    }
    
    // Update RE5 card
    if (record.re5_qualification_number) {
        const re5Card = document.querySelector('#exams .card:last-of-type');
        if (re5Card) {
            const statusBadge = re5Card.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = '✅ PASSED';
                statusBadge.className = 'badge bg-success fs-6 mb-2';
            }
            
            // Update exam date
            if (record.re5_issue_date) {
                const examDateEl = re5Card.querySelector('p:has(strong:contains("Exam Date"))');
                if (examDateEl) {
                    examDateEl.innerHTML = `<strong>Exam Date:</strong> ${new Date(record.re5_issue_date).toLocaleDateString('en-ZA')}`;
                }
            }
            
            // Update certificate number
            if (record.re5_qualification_number) {
                const certEl = re5Card.querySelector('p:has(strong:contains("Certificate Number"))');
                if (certEl) {
                    certEl.innerHTML = `<strong>Certificate Number:</strong> ${record.re5_qualification_number}`;
                }
            }
        }
    }
}

/**
 * Load COB Section
 */
function loadCobSection() {
    const record = fitProperData.currentRecord;
    if (!record) return;
    
    const tbody = document.querySelector('#cob tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    // Update COB training dates
    // Long-term Insurance - Cat A (row 1)
    if (rows[0] && record.cob_class_1_date) {
        updateCobRow(rows[0], record.cob_class_1_date);
    }
    
    // Long-term Insurance - Cat B2 (row 3)
    if (rows[2] && record.cob_class_2_date) {
        updateCobRow(rows[2], record.cob_class_2_date);
    }
    
    // Long-term Insurance - Cat C (row 4)
    if (rows[3] && record.cob_class_3_date) {
        updateCobRow(rows[3], record.cob_class_3_date);
    }
}

function updateCobRow(row, trainingDate) {
    const statusCell = row.querySelector('td:nth-child(3)');
    const dateCell = row.querySelector('td:nth-child(4)');
    
    if (statusCell) {
        statusCell.innerHTML = '<span class="badge bg-success">✅ Complete</span>';
    }
    
    if (dateCell) {
        dateCell.textContent = new Date(trainingDate).toLocaleDateString('en-ZA');
    }
}

/**
 * Load Experience Section
 */
function loadExperienceSection() {
    const record = fitProperData.currentRecord;
    if (!record) return;
    
    // Update management experience summary
    if (record.industry_experience_years) {
        const totalExpEl = document.querySelector('#experience .h3:first-of-type');
        if (totalExpEl) {
            const years = Math.floor(record.industry_experience_years);
            const months = Math.round((record.industry_experience_years - years) * 12);
            totalExpEl.textContent = `${years} years, ${months} months`;
        }
    }
    
    // Update verification status
    if (record.experience_verified) {
        const verifiedEl = document.querySelector('#experience .h3:last-of-type');
        if (verifiedEl) {
            verifiedEl.textContent = '✅';
            verifiedEl.className = 'h3 mb-0 text-success';
        }
    }
}

/**
 * Load Good Standing Section
 */
function loadGoodStandingSection() {
    const record = fitProperData.currentRecord;
    if (!record) return;
    
    // Update Criminal Clearance card
    if (record.criminal_record_check_date) {
        const criminalCard = document.querySelector('#good-standing .card:first-of-type');
        if (criminalCard) {
            const statusBadge = criminalCard.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = record.criminal_record_clear ? '✅ Valid' : '⚠️ Pending';
                statusBadge.className = `badge ${record.criminal_record_clear ? 'bg-success' : 'bg-warning'} fs-6`;
            }
            
            // Update dates
            if (record.criminal_record_check_date) {
                const issueDateEl = criminalCard.querySelector('p:has(strong:contains("Issue Date"))');
                if (issueDateEl) {
                    issueDateEl.innerHTML = `<strong>Issue Date:</strong> ${new Date(record.criminal_record_check_date).toLocaleDateString('en-ZA')}`;
                }
            }
        }
    }
    
    // Update Credit Check card
    if (record.credit_check_date) {
        const creditCard = document.querySelector('#good-standing .card:nth-of-type(2)');
        if (creditCard) {
            const statusBadge = creditCard.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = record.credit_check_clear ? '✅ Clear' : '⚠️ Pending';
                statusBadge.className = `badge ${record.credit_check_clear ? 'bg-success' : 'bg-warning'} fs-6`;
            }
            
            // Update last checked date
            const lastCheckedEl = creditCard.querySelector('p:has(strong:contains("Last Checked"))');
            if (lastCheckedEl) {
                lastCheckedEl.innerHTML = `<strong>Last Checked:</strong> ${new Date(record.credit_check_date).toLocaleDateString('en-ZA')}`;
            }
        }
    }
}

// Export for global access
window.switchSection = switchSection;
window.removeFile = removeFile;
window.loadFitProperDashboard = loadFitProperDashboard;
