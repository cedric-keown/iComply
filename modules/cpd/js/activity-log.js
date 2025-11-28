// Activity Log JavaScript

let cpdActivities = [];
let activityLogCurrentCpdCycle = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when log tab is shown
    const logTab = document.getElementById('log-tab');
    if (logTab) {
        logTab.addEventListener('shown.bs.tab', function() {
            loadActivityLog();
        });
    }
});

async function initializeActivityLog() {
    await loadActivityLog();
    setupFilters();
    setupSearch();
    setupTableActions();
}

/**
 * Load Activity Log from Database
 */
async function loadActivityLog() {
    try {
        // Get current cycle
        const cyclesResult = await dataFunctions.getCpdCycles('active');
        let cycles = cyclesResult;
        if (cyclesResult && cyclesResult.data) {
            cycles = cyclesResult.data;
        } else if (cyclesResult && Array.isArray(cyclesResult)) {
            cycles = cyclesResult;
        }
        
        if (cycles && cycles.length > 0) {
            activityLogCurrentCpdCycle = cycles[0];
            
            // Get activities for current cycle
            // TODO: Filter by current user's representative_id
            const activitiesResult = await dataFunctions.getCpdActivities(null, activityLogCurrentCpdCycle.id);
            let activities = activitiesResult;
            if (activitiesResult && activitiesResult.data) {
                activities = activitiesResult.data;
            } else if (activitiesResult && Array.isArray(activitiesResult)) {
                activities = activitiesResult;
            }
            
            cpdActivities = activities || [];
            renderActivityTable();
        } else {
            cpdActivities = [];
            renderActivityTable();
        }
    } catch (error) {
        console.error('Error loading activity log:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load activity log'
        });
    }
}

/**
 * Render Activity Table
 */
function renderActivityTable() {
    const tbody = document.querySelector('#log tbody');
    if (!tbody) return;
    
    if (cpdActivities.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="fas fa-info-circle text-muted me-2"></i>
                    No activities found. <a href="#" onclick="switchTab('upload-tab')">Upload your first activity</a>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (most recent first)
    const sortedActivities = [...cpdActivities].sort((a, b) => 
        new Date(b.activity_date) - new Date(a.activity_date)
    );
    
    tbody.innerHTML = sortedActivities.map(activity => {
        const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
        const status = activity.status || 'pending';
        const statusBadge = status === 'verified' 
            ? '<span class="badge bg-success">✅ Verified</span>'
            : status === 'pending'
            ? '<span class="badge bg-warning">⏳ Pending</span>'
            : status === 'rejected'
            ? '<span class="badge bg-danger">❌ Rejected</span>'
            : '<span class="badge bg-secondary">Draft</span>';
        
        // Determine category from activity type or class applicability
        let category = 'General';
        if (activity.ethics_hours > 0) {
            category = 'Ethics';
        } else if (activity.class_1_applicable || activity.class_2_applicable || activity.class_3_applicable) {
            category = 'Technical';
        }
        
        return `
            <tr>
                <td>${date}</td>
                <td>${activity.activity_name || 'Untitled'}</td>
                <td>${activity.provider_name || 'N/A'}</td>
                <td>${activity.total_hours || 0}</td>
                <td>${category}</td>
                <td>${activity.activity_type || 'Other'}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewCpdActivityFromLog('${activity.id}')">View</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editCpdActivityFromLog('${activity.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCpdActivityFromLog('${activity.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function setupFilters() {
    // Filter functionality
    const filterInputs = document.querySelectorAll('#log select, #log input[type="text"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
        input.addEventListener('input', applyFilters);
    });
}

function applyFilters() {
    // Apply filters to table
    const searchInput = document.querySelector('#log input[type="text"]');
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const statusFilter = document.querySelector('#log select[name="status"]')?.value || 'All';
    const categoryFilter = document.querySelector('#log select[name="category"]')?.value || 'All';
    const verificationFilter = document.querySelector('#log select[name="verification"]')?.value || 'All';
    
    const rows = document.querySelectorAll('#log tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusBadge = row.querySelector('.badge');
        const status = statusBadge?.textContent.toLowerCase() || '';
        
        let show = true;
        
        // Search filter
        if (searchTerm && !text.includes(searchTerm)) {
            show = false;
        }
        
        // Status filter
        if (statusFilter !== 'All') {
            if (statusFilter === 'Verified' && !status.includes('verified')) show = false;
            if (statusFilter === 'Pending Verification' && !status.includes('pending')) show = false;
            if (statusFilter === 'Rejected' && !status.includes('rejected')) show = false;
            if (statusFilter === 'Draft' && !status.includes('draft')) show = false;
        }
        
        // Category filter
        if (categoryFilter !== 'All') {
            const categoryCell = row.querySelector('td:nth-child(5)');
            if (categoryCell && !categoryCell.textContent.toLowerCase().includes(categoryFilter.toLowerCase())) {
                show = false;
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
    
    // Update count
    const visibleCount = Array.from(rows).filter(r => r.style.display !== 'none').length;
    updateActivityCount(visibleCount);
}

function updateActivityCount(count) {
    // Update any count display if it exists
    const countElement = document.querySelector('#log [data-activity-count]');
    if (countElement) {
        countElement.textContent = `${count} of ${cpdActivities.length} activities`;
    }
}

function setupSearch() {
    const searchInput = document.querySelector('#log input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

function setupTableActions() {
    // Actions are handled via onclick in the rendered table rows
    // No need for event delegation here since rows are dynamically generated
}

function viewCpdActivityFromLog(activityId) {
    const activity = cpdActivities.find(a => a.id === activityId);
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
                ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        cancelButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            editCpdActivityFromLog(activityId);
        }
    });
}

function editCpdActivityFromLog(activityId) {
    // Switch to upload tab
    if (typeof switchTab === 'function') {
        switchTab('upload-tab');
    }
    // TODO: Load activity data into form
    console.log('Edit activity:', activityId);
}

async function deleteCpdActivityFromLog(activityId) {
    const activity = cpdActivities.find(a => a.id === activityId);
    const activityName = activity?.activity_name || 'this activity';
    
    const result = await Swal.fire({
        title: 'Delete Activity?',
        html: `Are you sure you want to delete <strong>${activityName}</strong>?<br><br>This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it'
    });
    
    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const deleteResult = await dataFunctions.deleteCpdActivity(activityId);
            
            if (deleteResult && deleteResult.success !== false) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The activity has been deleted.',
                    timer: 2000
                });
                
                // Reload activities
                await loadActivityLog();
                
                // Reload dashboard if available
                if (typeof loadCpdDashboardData === 'function') {
                    loadCpdDashboardData();
                }
            } else {
                throw new Error(deleteResult?.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to delete activity'
            });
        }
    }
}

function exportToExcel() {
    if (cpdActivities.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No activities to export'
        });
        return;
    }
    
    // Create CSV content
    const headers = ['Date', 'Activity Title', 'Provider', 'Hours', 'Category', 'Type', 'Status'];
    const rows = cpdActivities.map(activity => {
        const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
        let category = 'General';
        if (activity.ethics_hours > 0) {
            category = 'Ethics';
        } else if (activity.class_1_applicable || activity.class_2_applicable || activity.class_3_applicable) {
            category = 'Technical';
        }
        
        return [
            date,
            activity.activity_name || 'Untitled',
            activity.provider_name || 'N/A',
            activity.total_hours || 0,
            category,
            activity.activity_type || 'Other',
            activity.status || 'Draft'
        ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpd_activities_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Export Complete',
        text: 'Your CSV file has been downloaded.',
        timer: 2000
    });
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
window.viewCpdActivityFromLog = viewCpdActivityFromLog;
window.editCpdActivityFromLog = editCpdActivityFromLog;
window.deleteCpdActivityFromLog = deleteCpdActivityFromLog;
window.loadActivityLog = loadActivityLog;
window.exportToExcel = exportToExcel;

