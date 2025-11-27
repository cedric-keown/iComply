// Reviews & Monitoring JavaScript

let reviewsData = {
    verifications: [],
    overdue: [],
    dueSoon: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when reviews tab is shown
    const reviewsTab = document.getElementById('reviews-tab');
    if (reviewsTab) {
        reviewsTab.addEventListener('shown.bs.tab', function() {
            loadReviewsMonitoring();
        });
    }
});

/**
 * Load Reviews & Monitoring Data
 */
async function loadReviewsMonitoring() {
    try {
        // Check if dataFunctions is available
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available. Please ensure data-functions.js is loaded.');
        }
        
        // Get all FICA verifications
        const verificationsResult = await dataFunctionsToUse.getFicaVerifications();
        let verifications = verificationsResult;
        if (verificationsResult && verificationsResult.data) {
            verifications = verificationsResult.data;
        } else if (verificationsResult && Array.isArray(verificationsResult)) {
            verifications = verificationsResult;
        }
        
        reviewsData.verifications = verifications || [];
        
        // Calculate overdue and due soon
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        reviewsData.overdue = reviewsData.verifications.filter(v => {
            if (!v.next_review_date) return false;
            return new Date(v.next_review_date) < today;
        });
        
        reviewsData.dueSoon = reviewsData.verifications.filter(v => {
            if (!v.next_review_date) return false;
            const reviewDate = new Date(v.next_review_date);
            return reviewDate >= today && reviewDate <= thirtyDaysFromNow;
        });
        
        renderReviewsMonitoring();
    } catch (error) {
        console.error('Error loading reviews monitoring:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        
        const errorMessage = error.message || 'Failed to load reviews monitoring data';
        Swal.fire({
            icon: 'error',
            title: 'Error Loading Reviews',
            html: `
                <p>${errorMessage}</p>
                <p class="small text-muted mt-2">Please check the browser console for more details.</p>
            `,
            confirmButtonText: 'OK'
        });
    }
}

/**
 * Render Reviews & Monitoring
 */
function renderReviewsMonitoring() {
    // Render overdue reviews
    renderOverdueReviews();
    
    // Render due soon reviews
    renderDueSoonReviews();
    
    // Render review calendar
    renderReviewCalendar();
}

/**
 * Render Overdue Reviews
 */
function renderOverdueReviews() {
    const container = document.querySelector('#reviews [data-overdue-reviews]');
    if (!container) return;
    
    if (reviewsData.overdue.length === 0) {
        container.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                No overdue reviews.
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviewsData.overdue.map(verification => {
        const client = verification.client || {};
        const clientName = client.client_type === 'corporate'
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const daysOverdue = Math.floor((new Date() - new Date(verification.next_review_date)) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="card mb-3 border-danger">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${clientName} <span class="badge bg-danger">${daysOverdue} days overdue</span></h6>
                            <p class="mb-1 text-muted">ID: ${client.id_number ? client.id_number.substring(0, 6) + '****' + client.id_number.substring(client.id_number.length - 3) : 'N/A'}</p>
                            <p class="mb-0"><small class="text-muted">Last Review: ${verification.verification_date ? new Date(verification.verification_date).toLocaleDateString('en-ZA') : 'N/A'}</small></p>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="scheduleReview('${verification.id}')">Schedule Review</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Due Soon Reviews
 */
function renderDueSoonReviews() {
    const container = document.querySelector('#reviews [data-due-soon-reviews]');
    if (!container) return;
    
    if (reviewsData.dueSoon.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No reviews due in the next 30 days.
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviewsData.dueSoon.map(verification => {
        const client = verification.client || {};
        const clientName = client.client_type === 'corporate'
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const daysUntil = Math.ceil((new Date(verification.next_review_date) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="card mb-3 border-warning">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${clientName} <span class="badge bg-warning">Due in ${daysUntil} days</span></h6>
                            <p class="mb-1 text-muted">ID: ${client.id_number ? client.id_number.substring(0, 6) + '****' + client.id_number.substring(client.id_number.length - 3) : 'N/A'}</p>
                            <p class="mb-0"><small class="text-muted">Review Date: ${new Date(verification.next_review_date).toLocaleDateString('en-ZA')}</small></p>
                        </div>
                        <button class="btn btn-sm btn-warning" onclick="scheduleReview('${verification.id}')">Schedule Review</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Review Calendar
 */
function renderReviewCalendar() {
    // TODO: Implement calendar view
    console.log('Render review calendar');
}

/**
 * Schedule Review
 */
function scheduleReview(verificationId) {
    console.log('Schedule review for verification:', verificationId);
    // TODO: Implement review scheduling modal
}

// Export functions
window.loadReviewsMonitoring = loadReviewsMonitoring;
window.scheduleReview = scheduleReview;

