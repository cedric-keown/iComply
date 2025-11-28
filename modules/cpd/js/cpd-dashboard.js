// CPD Dashboard JavaScript

let cpdData = {
    cycle: null,
    progress: null,
    activities: []
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCPDDashboard();
});

async function initializeCPDDashboard() {
    try {
        await loadCpdDashboardData();
        updateProgressCircle();
        updateDashboardStats();
        initializeCharts();
        renderRecentActivities();
        setupTabSwitching();
        updateCycleInfo();
    } catch (error) {
        console.error('Error initializing CPD dashboard:', error);
    }
}

/**
 * Load CPD Dashboard Data from Database
 */
async function loadCpdDashboardData() {
    try {
        // Get current active cycle
        const cyclesResult = await dataFunctions.getCpdCycles('active');
        let cycles = cyclesResult;
        if (cyclesResult && cyclesResult.data) {
            cycles = cyclesResult.data;
        } else if (cyclesResult && Array.isArray(cyclesResult)) {
            cycles = cyclesResult;
        }
        
        if (cycles && cycles.length > 0) {
            cpdData.cycle = cycles[0]; // Get first active cycle
            
            // Get progress summary for current user
            // Note: We need to get current user's representative_id
            // For now, we'll get progress for all or use a default
            try {
                const progressResult = await dataFunctions.getCpdProgressSummary(cpdData.cycle.id);
                let progress = progressResult;
                if (progressResult && progressResult.data) {
                    progress = progressResult.data;
                } else if (progressResult && Array.isArray(progressResult)) {
                    // If it's an array, take the first item or create a summary
                    progress = progressResult.length > 0 ? progressResult[0] : null;
                } else if (progressResult && typeof progressResult === 'object') {
                    progress = progressResult;
                }
                cpdData.progress = progress;
            } catch (progressError) {
                console.warn('Error loading CPD progress summary:', progressError);
                // Set default progress structure to prevent UI errors
                cpdData.progress = {
                    total_hours_logged: 0,
                    ethics_hours_logged: 0,
                    technical_hours_logged: 0,
                    activity_count: 0,
                    progress_percentage: 0,
                    compliance_status: 'unknown'
                };
            }
            
            // Get recent activities
            try {
                const activitiesResult = await dataFunctions.getCpdActivities(null, cpdData.cycle.id);
                let activities = activitiesResult;
                if (activitiesResult && activitiesResult.data) {
                    activities = activitiesResult.data;
                } else if (activitiesResult && Array.isArray(activitiesResult)) {
                    activities = activitiesResult;
                }
                cpdData.activities = activities || [];
            } catch (activitiesError) {
                console.warn('Error loading CPD activities:', activitiesError);
                // Set empty array to prevent UI errors
                cpdData.activities = [];
            }
        }
    } catch (error) {
        console.error('Error loading CPD dashboard data:', error);
        throw error;
    }
}

function updateProgressCircle() {
    let progress = 0;
    let hoursEarned = 0;
    let hoursRequired = 18;
    
    if (cpdData.progress) {
        hoursEarned = parseFloat(cpdData.progress.total_hours_earned || cpdData.progress.total_hours || 0);
        hoursRequired = parseFloat(cpdData.progress.required_hours || cpdData.cycle?.required_hours || 18);
        progress = hoursRequired > 0 ? Math.round((hoursEarned / hoursRequired) * 100) : 0;
    }
    
    // Update progress circle
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
    
    // Update progress text
    const progressValue = document.getElementById('cpdProgressValue') || document.querySelector('.progress-value');
    const progressPercentage = document.getElementById('cpdProgressPercentage') || document.querySelector('.progress-percentage');
    if (progressValue) {
        if (hoursEarned > 0 || hoursRequired > 0) {
            progressValue.textContent = `${Math.round(hoursEarned)} / ${Math.round(hoursRequired)}`;
        } else {
            progressValue.textContent = '- / -';
        }
    }
    if (progressPercentage) {
        if (progress > 0) {
            progressPercentage.textContent = `${progress}%`;
        } else {
            progressPercentage.textContent = '-';
        }
    }
}

/**
 * Update Dashboard Statistics
 */
function updateDashboardStats() {
    if (!cpdData.progress && !cpdData.cycle) return;
    
    const progress = cpdData.progress || {};
    const cycle = cpdData.cycle || {};
    
    // Update Total Hours card
    const totalHoursValueEl = document.getElementById('cpdTotalHoursValue');
    const totalHoursSublabelEl = document.getElementById('cpdTotalHoursSublabel');
    const totalHoursProgressEl = document.getElementById('cpdTotalHoursProgress');
    
    if (totalHoursValueEl || totalHoursSublabelEl || totalHoursProgressEl) {
        const hoursEarned = parseFloat(progress.total_hours_earned || progress.total_hours || 0);
        const hoursRequired = parseFloat(cycle.required_hours || 18);
        const percentage = hoursRequired > 0 ? Math.round((hoursEarned / hoursRequired) * 100) : 0;
        
        if (totalHoursValueEl) {
            totalHoursValueEl.textContent = hoursEarned > 0 ? Math.round(hoursEarned) : '-';
        }
        if (totalHoursSublabelEl) {
            totalHoursSublabelEl.textContent = `of ${Math.round(hoursRequired)} required`;
        }
        if (totalHoursProgressEl) {
            totalHoursProgressEl.style.width = `${percentage}%`;
        }
    }
    
    // Update Ethics Hours card
    const ethicsValueEl = document.getElementById('cpdEthicsHoursValue');
    const ethicsSublabelEl = document.getElementById('cpdEthicsHoursSublabel');
    
    if (ethicsValueEl || ethicsSublabelEl) {
        const ethicsHours = parseFloat(progress.ethics_hours_earned || progress.ethics_hours || 0);
        const ethicsRequired = parseFloat(cycle.required_ethics_hours || 3);
        
        if (ethicsValueEl) {
            ethicsValueEl.textContent = ethicsHours > 0 ? Math.round(ethicsHours) : '-';
        }
        
        if (ethicsSublabelEl) {
            if (ethicsHours >= ethicsRequired) {
                ethicsSublabelEl.innerHTML = `<span class="badge bg-success">✅ Minimum met (${Math.round(ethicsRequired)} required)</span>`;
            } else {
                ethicsSublabelEl.innerHTML = `<span class="badge bg-warning">⚠️ ${Math.round(ethicsRequired - ethicsHours)} hours remaining</span>`;
            }
        }
    }
    
    // Update Verifiable Hours card
    const verifiableValueEl = document.getElementById('cpdVerifiableHoursValue');
    const verifiableSublabelEl = document.getElementById('cpdVerifiableHoursSublabel');
    const verifiableProgressEl = document.getElementById('cpdVerifiableHoursProgress');
    
    if (verifiableValueEl || verifiableSublabelEl || verifiableProgressEl) {
        const verifiableHours = parseFloat(progress.verifiable_hours || 0);
        const totalHours = parseFloat(progress.total_hours_earned || progress.total_hours || 0);
        
        if (verifiableValueEl) {
            verifiableValueEl.textContent = verifiableHours > 0 ? Math.round(verifiableHours) : '-';
        }
        
        if (verifiableSublabelEl) {
            verifiableSublabelEl.textContent = `of ${totalHours > 0 ? Math.round(totalHours) : 0} total`;
        }
        
        if (verifiableProgressEl && totalHours > 0) {
            const percentage = Math.round((verifiableHours / totalHours) * 100);
            verifiableProgressEl.style.width = `${percentage}%`;
        }
    }
    
    // Update Activities count card
    const activitiesValue = document.querySelectorAll('#dashboard .stat-value')[3];
    if (activitiesValue) {
        const card = activitiesValue.closest('.stat-card');
        if (card) {
            const valueEl = card.querySelector('.stat-value');
            if (valueEl) valueEl.textContent = cpdData.activities.length || 0;
        }
    }
    
    // Update cycle info
    if (cpdData.cycle) {
        const cycleNameEl = document.getElementById('cpdCycleName') || document.querySelector('#dashboard .lead');
        if (cycleNameEl) {
            cycleNameEl.textContent = cpdData.cycle.cycle_name || 'Current Cycle';
        }
        
        const cyclePeriodEl = document.getElementById('cpdCyclePeriod') || document.querySelector('#dashboard [data-cycle-period]');
        if (cyclePeriodEl && cpdData.cycle.start_date && cpdData.cycle.end_date) {
            const startDate = new Date(cpdData.cycle.start_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
            const endDate = new Date(cpdData.cycle.end_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
            cyclePeriodEl.textContent = `${startDate} - ${endDate}`;
        }
        
        // Update days remaining
        const daysRemainingEl = document.getElementById('cpdDaysRemaining');
        const daysUntilDeadlineEl = document.getElementById('cpdDaysUntilDeadline');
        const statusBadgeEl = document.getElementById('cpdStatusBadge');
        if (cpdData.cycle.end_date) {
            const cycleEnd = new Date(cpdData.cycle.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysRemaining = Math.ceil((cycleEnd - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemainingEl) {
                daysRemainingEl.textContent = `${daysRemaining} days`;
            }
            if (daysUntilDeadlineEl) {
                daysUntilDeadlineEl.textContent = `${daysRemaining} days until deadline`;
            }
            if (statusBadgeEl) {
                if (daysRemaining < 30) {
                    statusBadgeEl.className = 'badge bg-danger fs-6';
                    statusBadgeEl.textContent = '⚠️ URGENT';
                } else if (daysRemaining < 90) {
                    statusBadgeEl.className = 'badge bg-warning fs-6';
                    statusBadgeEl.textContent = '⚠️ IN PROGRESS';
                } else {
                    statusBadgeEl.className = 'badge bg-info fs-6';
                    statusBadgeEl.textContent = '✅ ON TRACK';
                }
            }
        }
    }
}

function initializeCharts() {
    // Verifiable Status Pie Chart
    const ctx = document.getElementById('verifiableChart');
    if (ctx) {
        const progress = cpdData.progress || {};
        const verifiableHours = parseFloat(progress.verifiable_hours || 0);
        const totalHours = parseFloat(progress.total_hours_earned || progress.total_hours || 0);
        const nonVerifiableHours = totalHours - verifiableHours;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Verifiable', 'Non-verifiable'],
                datasets: [{
                    data: [verifiableHours, nonVerifiableHours],
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
        
        // Update chart legend text
        const verifiableLabel = document.querySelector('#dashboard .badge.bg-info')?.parentElement?.querySelector('span:last-child');
        const nonVerifiableLabel = document.querySelector('#dashboard .badge.bg-secondary')?.parentElement?.querySelector('span:last-child');
        
        if (verifiableLabel && totalHours > 0) {
            const percentage = Math.round((verifiableHours / totalHours) * 100);
            verifiableLabel.textContent = `Verifiable: ${Math.round(verifiableHours)} hours (${percentage}%)`;
        }
        if (nonVerifiableLabel && totalHours > 0) {
            const percentage = Math.round((nonVerifiableHours / totalHours) * 100);
            nonVerifiableLabel.textContent = `Non-verifiable: ${Math.round(nonVerifiableHours)} hours (${percentage}%)`;
        }
    }
}

/**
 * Render Recent Activities
 */
function renderRecentActivities() {
    const activityList = document.querySelector('#dashboard .activity-list');
    if (!activityList || !cpdData.activities) return;
    
    // Sort by date (most recent first) and take first 5
    const recentActivities = [...cpdData.activities]
        .sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date))
        .slice(0, 5);
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>No activities logged yet. <a href="#" onclick="switchTab('upload-tab')">Upload your first activity</a>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentActivities.map(activity => {
        const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
        const statusBadge = activity.status === 'verified' 
            ? '<span class="badge bg-success">✅ Verified</span>'
            : activity.status === 'pending'
            ? '<span class="badge bg-warning">⏳ Awaiting approval</span>'
            : activity.status === 'rejected'
            ? '<span class="badge bg-danger">❌ Rejected</span>'
            : '<span class="badge bg-secondary">Draft</span>';
        
        const verifiableBadge = activity.verifiable 
            ? '<span class="badge bg-primary">Verifiable</span>'
            : '<span class="badge bg-secondary">Non-verifiable</span>';
        
        const certificateLink = activity.certificate_attached
            ? `<a href="#" class="ms-2">Certificate - Download</a>`
            : '';
        
        return `
            <div class="activity-item">
                <div class="activity-icon bg-${activity.status === 'verified' ? 'success' : activity.status === 'pending' ? 'warning' : 'secondary'}">
                    <i class="fas fa-${activity.status === 'verified' ? 'check' : 'clock'}"></i>
                </div>
                <div class="activity-content">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h6 class="mb-1">${activity.activity_name || 'Untitled Activity'}</h6>
                            <p class="mb-1 small text-muted">
                                <span class="badge bg-primary">${activity.provider_name || 'Unknown Provider'}</span>
                                ${verifiableBadge}
                                | ${date} | ${activity.total_hours || 0} hrs | ${activity.activity_type || 'Other'}
                            </p>
                            <p class="mb-0 small">
                                ${statusBadge}
                                ${certificateLink}
                            </p>
                        </div>
                        <div class="activity-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewCpdActivity('${activity.id}')">View</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editCpdActivity('${activity.id}')">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCycleInfo() {
    if (!cpdData.cycle || !cpdData.cycle.end_date) return;
    
    // Calculate days remaining
    const cycleEnd = new Date(cpdData.cycle.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((cycleEnd - today) / (1000 * 60 * 60 * 24));
    
    // Update any elements that show days remaining
    const daysElements = document.querySelectorAll('[data-days-remaining]');
    daysElements.forEach(el => {
        el.textContent = daysRemaining;
    });
    
    // Update cycle status badge
    const statusBadge = document.querySelector('#dashboard .badge.bg-warning');
    if (statusBadge) {
        if (daysRemaining < 30) {
            statusBadge.className = 'badge bg-danger fs-6';
            statusBadge.textContent = '⚠️ URGENT';
        } else if (daysRemaining < 90) {
            statusBadge.className = 'badge bg-warning fs-6';
            statusBadge.textContent = '⚠️ IN PROGRESS';
        } else {
            statusBadge.className = 'badge bg-info fs-6';
            statusBadge.textContent = '✅ ON TRACK';
        }
    }
    
    // Update alerts
    const progress = cpdData.progress || {};
    const hoursEarned = parseFloat(progress.total_hours_earned || progress.total_hours || 0);
    const hoursRequired = parseFloat(cpdData.cycle.required_hours || 18);
    const hoursRemaining = Math.max(0, hoursRequired - hoursEarned);
    
    const deadlineAlert = document.querySelector('#dashboard .alert-warning');
    if (deadlineAlert && hoursRemaining > 0) {
        const alertText = deadlineAlert.querySelector('p');
        if (alertText) {
            alertText.textContent = `You have ${daysRemaining} days remaining to complete ${Math.round(hoursRemaining)} CPD hours`;
        }
    }
}

/**
 * View CPD Activity
 */
function viewCpdActivity(activityId) {
    const activity = cpdData.activities.find(a => a.id === activityId);
    if (!activity) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Activity not found'
        });
        return;
    }
    
    const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
    
    Swal.fire({
        title: activity.activity_name || 'Activity Details',
        html: `
            <div class="text-start">
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Provider:</strong> ${activity.provider_name || 'N/A'}</p>
                <p><strong>Type:</strong> ${activity.activity_type || 'N/A'}</p>
                <p><strong>Total Hours:</strong> ${activity.total_hours || 0}</p>
                <p><strong>Ethics Hours:</strong> ${activity.ethics_hours || 0}</p>
                <p><strong>Technical Hours:</strong> ${activity.technical_hours || 0}</p>
                <p><strong>Status:</strong> <span class="badge bg-${activity.status === 'verified' ? 'success' : activity.status === 'pending' ? 'warning' : 'secondary'}">${activity.status || 'Draft'}</span></p>
                <p><strong>Verifiable:</strong> ${activity.verifiable ? 'Yes' : 'No'}</p>
                ${activity.certificate_attached ? '<p><strong>Certificate:</strong> Attached</p>' : ''}
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        cancelButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            editCpdActivity(activityId);
        }
    });
}

/**
 * Edit CPD Activity
 */
function editCpdActivity(activityId) {
    // Switch to upload tab and load activity data
    switchTab('upload-tab');
    // TODO: Load activity data into form
    console.log('Edit activity:', activityId);
}

// Export functions
window.viewCpdActivity = viewCpdActivity;
window.editCpdActivity = editCpdActivity;

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

