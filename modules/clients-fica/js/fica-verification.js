// FICA Verification JavaScript

let ficaData = {
    verifications: [],
    stats: {
        pending: 0,
        inProgress: 0,
        completedToday: 0,
        overdue: 0
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when FICA verification tab is shown
    const ficaTab = document.getElementById('fica-verification-tab');
    if (ficaTab) {
        ficaTab.addEventListener('shown.bs.tab', function() {
            loadFicaVerifications();
        });
    }
});

/**
 * Load FICA Verifications from Database
 */
async function loadFicaVerifications() {
    try {
        // Check if dataFunctions is available
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available. Please ensure data-functions.js is loaded.');
        }
        
        // Get pending verifications
        const verificationsResult = await dataFunctionsToUse.getFicaVerifications(null, null, 'pending');
        let verifications = verificationsResult;
        if (verificationsResult && verificationsResult.data) {
            verifications = verificationsResult.data;
        } else if (verificationsResult && Array.isArray(verificationsResult)) {
            verifications = verificationsResult;
        }
        
        ficaData.verifications = verifications || [];
        
        // Calculate stats
        calculateFicaStats();
        
        // Update UI
        updateFicaStats();
        renderVerificationQueue();
    } catch (error) {
        console.error('Error loading FICA verifications:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        
        const errorMessage = error.message || 'Failed to load FICA verifications';
        Swal.fire({
            icon: 'error',
            title: 'Error Loading FICA Verifications',
            html: `
                <p>${errorMessage}</p>
                <p class="small text-muted mt-2">Please check the browser console for more details.</p>
            `,
            confirmButtonText: 'OK'
        });
    }
}

/**
 * Calculate FICA Statistics
 */
function calculateFicaStats() {
    const verifications = ficaData.verifications;
    const today = new Date().toDateString();
    
    ficaData.stats = {
        pending: verifications.filter(v => v.fica_status === 'pending').length,
        inProgress: verifications.filter(v => v.fica_status === 'in_progress').length,
        completedToday: verifications.filter(v => {
            if (!v.verified_date) return false;
            return new Date(v.verified_date).toDateString() === today;
        }).length,
        overdue: verifications.filter(v => {
            if (!v.next_review_date) return false;
            return new Date(v.next_review_date) < new Date();
        }).length
    };
}

/**
 * Update FICA Statistics UI
 */
function updateFicaStats() {
    const stats = ficaData.stats;
    
    // Update Pending
    const pendingEl = document.querySelector('#fica-verification .stat-value.text-warning');
    if (pendingEl) pendingEl.textContent = stats.pending;
    
    // Update In Progress
    const inProgressEl = document.querySelector('#fica-verification .stat-value.text-info');
    if (inProgressEl) inProgressEl.textContent = stats.inProgress;
    
    // Update Completed Today
    const completedEl = document.querySelector('#fica-verification .stat-value.text-success');
    if (completedEl) completedEl.textContent = stats.completedToday;
    
    // Update Overdue
    const overdueEl = document.querySelector('#fica-verification .stat-value.text-danger');
    if (overdueEl) overdueEl.textContent = stats.overdue;
}

/**
 * Render Verification Queue
 */
function renderVerificationQueue() {
    const container = document.querySelector('#fica-verification .card-body');
    if (!container) return;
    
    if (ficaData.verifications.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No pending verifications found.
            </div>
        `;
        return;
    }
    
    // Sort by priority (overdue first, then by date)
    const sorted = [...ficaData.verifications].sort((a, b) => {
        const aOverdue = a.next_review_date && new Date(a.next_review_date) < new Date();
        const bOverdue = b.next_review_date && new Date(b.next_review_date) < new Date();
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    });
    
    container.innerHTML = sorted.map(verification => {
        const client = verification.client || {};
        const clientName = client.client_type === 'corporate'
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const isOverdue = verification.next_review_date && new Date(verification.next_review_date) < new Date();
        const priorityBadge = isOverdue ? '<span class="badge bg-danger">OVERDUE</span>' : '<span class="badge bg-warning">HIGH PRIORITY</span>';
        
        return `
            <div class="verification-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6>${client.client_number || 'N/A'} | ${clientName} ${priorityBadge}</h6>
                        <p class="mb-1 text-muted">ID: ${client.id_number ? client.id_number.substring(0, 6) + '****' + client.id_number.substring(client.id_number.length - 3) : 'N/A'}</p>
                        <p class="mb-1">
                            <span class="badge bg-${verification.fica_status === 'pending' ? 'warning' : 'info'}">${verification.fica_status || 'Pending'}</span>
                            • Risk: ${client.risk_category || 'N/A'}
                        </p>
                        <small class="text-muted">
                            Verification Date: ${verification.verification_date ? new Date(verification.verification_date).toLocaleDateString('en-ZA') : 'N/A'}
                            • Next Review: ${verification.next_review_date ? new Date(verification.next_review_date).toLocaleDateString('en-ZA') : 'N/A'}
                        </small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary me-2" onclick="reviewFicaVerification('${verification.id}')">Review Now</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="viewFicaDocuments('${verification.client_id}')">View Documents</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Review FICA Verification
 */
function reviewFicaVerification(verificationId) {
    // Open review modal or navigate to review page
    console.log('Review FICA verification:', verificationId);
    // TODO: Implement review modal
}

/**
 * View FICA Documents
 */
function viewFicaDocuments(clientId) {
    // Open documents modal
    console.log('View FICA documents for client:', clientId);
    // TODO: Implement documents modal
}

function setupVerificationQueue() {
    // Queue is rendered dynamically, no setup needed
}

// Export functions
window.reviewFicaVerification = reviewFicaVerification;
window.viewFicaDocuments = viewFicaDocuments;
window.loadFicaVerifications = loadFicaVerifications;

