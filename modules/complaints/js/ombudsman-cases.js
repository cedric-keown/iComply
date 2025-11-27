// Ombudsman Cases JavaScript

let ombudsmanData = {
    cases: []
};

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeOmbudsmanCases();
    });
} else {
    initializeOmbudsmanCases();
}

async function initializeOmbudsmanCases() {
    console.log('Initializing Ombudsman Cases module');
    
    // Load cases when tab is shown
    const ombudsmanTab = document.getElementById('ombudsman-tab');
    if (ombudsmanTab) {
        console.log('Ombudsman tab found, attaching event listener');
        ombudsmanTab.addEventListener('shown.bs.tab', function() {
            console.log('Ombudsman tab shown event fired');
            loadOmbudsmanCases();
        });
        
        // Also load if tab is already active
        if (ombudsmanTab.classList.contains('active')) {
            console.log('Ombudsman tab already active, loading cases');
            loadOmbudsmanCases();
        }
    } else {
        console.warn('Ombudsman tab not found');
    }
    
    // Also listen for tab changes via data-bs-target
    const ombudsmanPane = document.getElementById('ombudsman');
    if (ombudsmanPane) {
        console.log('Ombudsman pane found');
        // Use Bootstrap's tab event
        ombudsmanPane.addEventListener('shown.bs.tab', function() {
            console.log('Ombudsman pane shown event fired');
            loadOmbudsmanCases();
        });
    } else {
        console.warn('Ombudsman pane not found');
    }
    
    // Also try to load immediately if we're in the right context
    setTimeout(() => {
        const activeTab = document.querySelector('#ombudsman-tab.active, #ombudsman.show');
        if (activeTab) {
            console.log('Ombudsman tab/pane is active, loading cases');
            loadOmbudsmanCases();
        }
    }, 1000);
}

/**
 * Load Ombudsman Cases
 */
async function loadOmbudsmanCases() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all complaints and filter for Ombudsman cases
        console.log('Loading Ombudsman cases...');
        const complaintsResult = await dataFunctionsToUse.getComplaints(null, null, null, null, null);
        console.log('Raw complaints result:', complaintsResult);
        
        // Handle different response formats
        let complaints = [];
        if (complaintsResult) {
            if (Array.isArray(complaintsResult)) {
                complaints = complaintsResult;
            } else if (complaintsResult.data && Array.isArray(complaintsResult.data)) {
                complaints = complaintsResult.data;
            } else if (complaintsResult.data && typeof complaintsResult.data === 'object' && !Array.isArray(complaintsResult.data)) {
                complaints = [complaintsResult.data];
            } else if (typeof complaintsResult === 'object' && complaintsResult.success !== undefined) {
                if (complaintsResult.data) {
                    complaints = Array.isArray(complaintsResult.data) ? complaintsResult.data : [complaintsResult.data];
                }
            }
        }
        
        console.log('Parsed complaints array:', complaints);
        console.log('Total complaints loaded:', complaints.length);
        
        // Debug: Check escalated_to_ombud values
        if (complaints.length > 0) {
            console.log('Sample complaint escalated_to_ombud values:');
            complaints.slice(0, 5).forEach((c, i) => {
                console.log(`  Complaint ${i}: escalated_to_ombud =`, c.escalated_to_ombud, 'type:', typeof c.escalated_to_ombud);
            });
        }
        
        // Filter for Ombudsman cases - be more explicit
        ombudsmanData.cases = (complaints || []).filter(c => {
            if (!c) return false;
            
            // Check multiple possible formats
            const escalated = c.escalated_to_ombud === true || 
                             c.escalated_to_ombud === 'true' || 
                             c.escalated_to_ombud === 1 ||
                             c.escalated_to_ombud === '1' ||
                             String(c.escalated_to_ombud).toLowerCase() === 'true';
            
            if (escalated) {
                console.log('Found Ombudsman case:', c.complaint_reference_number, c.escalated_to_ombud);
            }
            
            return escalated;
        });
        
        console.log('Filtered Ombudsman cases:', ombudsmanData.cases.length);
        console.log('Ombudsman cases data:', ombudsmanData.cases);
        
        // Update stats
        updateOmbudsmanStats();
        
        // Render cases - add a small delay to ensure DOM is ready
        setTimeout(() => {
            renderOmbudsmanCases();
        }, 100);
        
    } catch (error) {
        console.error('Error loading Ombudsman cases:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load Ombudsman cases'
        });
    }
}

/**
 * Update Ombudsman Statistics
 */
function updateOmbudsmanStats() {
    const cases = ombudsmanData.cases;
    
    // Total escalated
    const totalEl = document.getElementById('ombudsman-total');
    if (totalEl) totalEl.textContent = cases.length;
    
    // Active with Ombudsman
    const activeCases = cases.filter(c => {
        const status = (c.status || '').toLowerCase();
        return !['resolved', 'closed'].includes(status);
    });
    const activeEl = document.getElementById('ombudsman-active');
    if (activeEl) activeEl.textContent = activeCases.length;
    
    // Ombudsman rulings (assuming resolved cases have rulings)
    const resolvedCases = cases.filter(c => {
        const status = (c.status || '').toLowerCase();
        return ['resolved', 'closed'].includes(status);
    });
    const rulingsEl = document.getElementById('ombudsman-rulings');
    if (rulingsEl) rulingsEl.textContent = resolvedCases.length;
}

/**
 * Render Ombudsman Cases
 */
function renderOmbudsmanCases() {
    console.log('Rendering Ombudsman cases, count:', ombudsmanData.cases.length);
    const container = document.getElementById('ombudsman-cases-container');
    if (!container) {
        console.error('Ombudsman cases container not found');
        // Try again after a short delay
        setTimeout(() => {
            const retryContainer = document.getElementById('ombudsman-cases-container');
            if (retryContainer) {
                console.log('Retrying render after finding container');
                renderOmbudsmanCases();
            } else {
                console.error('Container still not found after retry');
            }
        }, 500);
        return;
    }
    
    console.log('Container found, rendering', ombudsmanData.cases.length, 'cases');
    
    if (ombudsmanData.cases.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <i class="fas fa-balance-scale fa-5x text-success mb-4"></i>
                    <h4>No complaints have been escalated to Ombudsman</h4>
                    <p class="text-muted">This indicates effective internal resolution processes</p>
                    <span class="badge bg-success fs-6">✅ Excellent compliance performance</span>
                </div>
            </div>
        `;
        return;
    }
    
    // Sort by escalation date (most recent first)
    const sortedCases = [...ombudsmanData.cases].sort((a, b) => {
        const dateA = new Date(a.ombud_escalation_date || a.created_at);
        const dateB = new Date(b.ombud_escalation_date || b.created_at);
        return dateB - dateA;
    });
    
    container.innerHTML = `
        <!-- Stats Cards -->
        <div class="row mb-4">
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value text-primary" id="ombudsman-total">${ombudsmanData.cases.length}</div>
                    <div class="stat-label">Total Escalated</div>
                    <div class="stat-sublabel">Current year</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value text-warning" id="ombudsman-active">${sortedCases.filter(c => !['resolved', 'closed'].includes((c.status || '').toLowerCase())).length}</div>
                    <div class="stat-label">Active with Ombudsman</div>
                    <div class="stat-sublabel">Pending determination</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value text-info" id="ombudsman-rulings">${sortedCases.filter(c => ['resolved', 'closed'].includes((c.status || '').toLowerCase())).length}</div>
                    <div class="stat-label">Ombudsman Rulings</div>
                    <div class="stat-sublabel">Determinations received</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value text-success">N/A</div>
                    <div class="stat-label">Ruling in FSP Favor</div>
                    <div class="stat-sublabel">Of rulings received</div>
                </div>
            </div>
        </div>

        <!-- Cases Table -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-list me-2"></i>Ombudsman Cases</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Ombudsman Case #</th>
                                <th>Complaint Reference</th>
                                <th>Complainant</th>
                                <th>Category</th>
                                <th>Escalation Date</th>
                                <th>Days with Ombudsman</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="ombudsman-cases-table-body">
                            ${sortedCases.map(caseItem => {
                                const escalationDate = new Date(caseItem.ombud_escalation_date || caseItem.created_at);
                                const today = new Date();
                                const daysWithOmbud = Math.ceil((today - escalationDate) / (1000 * 60 * 60 * 24));
                                
                                const statusBadge = caseItem.status === 'resolved' 
                                    ? '<span class="badge bg-success">Resolved</span>'
                                    : caseItem.status === 'closed'
                                    ? '<span class="badge bg-secondary">Closed</span>'
                                    : caseItem.status === 'investigating'
                                    ? '<span class="badge bg-info">Investigating</span>'
                                    : '<span class="badge bg-warning">Open</span>';
                                
                                // Ensure viewComplaintDetails is available
                                const viewFunction = typeof viewComplaintDetails !== 'undefined' 
                                    ? 'viewComplaintDetails' 
                                    : (typeof window.viewComplaintDetails !== 'undefined' 
                                        ? 'window.viewComplaintDetails' 
                                        : 'console.log');
                                
                                return `
                                    <tr>
                                        <td><strong>${caseItem.ombud_case_number || 'N/A'}</strong></td>
                                        <td>${caseItem.complaint_reference_number || 'N/A'}</td>
                                        <td>${caseItem.complainant_name || 'N/A'}</td>
                                        <td>${caseItem.complaint_category || 'N/A'}</td>
                                        <td>${escalationDate.toLocaleDateString('en-ZA')}</td>
                                        <td><span class="badge ${daysWithOmbud > 60 ? 'bg-danger' : daysWithOmbud > 30 ? 'bg-warning' : 'bg-info'}">${daysWithOmbud} days</span></td>
                                        <td>${statusBadge}</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="if(typeof viewComplaintDetails !== 'undefined') { viewComplaintDetails('${caseItem.id}'); } else if(typeof window.viewComplaintDetails !== 'undefined') { window.viewComplaintDetails('${caseItem.id}'); } else { console.log('View complaint:', '${caseItem.id}'); }">
                                                <i class="fas fa-eye me-1"></i>View
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Export for global access
window.loadOmbudsmanCases = loadOmbudsmanCases;
window.initializeOmbudsmanCases = initializeOmbudsmanCases;
window.renderOmbudsmanCases = renderOmbudsmanCases;

// Also make available on parent window if in iframe
if (window.parent && window.parent !== window) {
    try {
        window.parent.loadOmbudsmanCases = loadOmbudsmanCases;
    } catch (e) {
        // Cross-origin access might fail
    }
}

