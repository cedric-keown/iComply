// Active Complaints JavaScript

let activeComplaintsData = {
    complaints: [],
    filteredComplaints: []
};

document.addEventListener('DOMContentLoaded', function() {
    initializeActiveComplaints();
});

async function initializeActiveComplaints() {
    // Load complaints when tab is shown
    const activeTab = document.getElementById('active-tab');
    if (activeTab) {
        activeTab.addEventListener('shown.bs.tab', function() {
            loadActiveComplaints();
        });
    }
    
    setupFilters();
}

/**
 * Load Active Complaints
 */
async function loadActiveComplaints() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all complaints (we'll filter for active ones client-side)
        const complaintsResult = await dataFunctionsToUse.getComplaints(null, null, null, null, null);
        
        // Handle different response formats
        let complaints = [];
        if (complaintsResult) {
            if (Array.isArray(complaintsResult)) {
                complaints = complaintsResult;
            } else if (complaintsResult.data && Array.isArray(complaintsResult.data)) {
                complaints = complaintsResult.data;
            } else if (complaintsResult.data && typeof complaintsResult.data === 'object' && !Array.isArray(complaintsResult.data)) {
                // Sometimes the function returns a single object with data property
                complaints = [complaintsResult.data];
            } else if (typeof complaintsResult === 'object' && complaintsResult.success !== undefined) {
                // Response might be wrapped in success object
                if (complaintsResult.data) {
                    complaints = Array.isArray(complaintsResult.data) ? complaintsResult.data : [complaintsResult.data];
                }
            }
        }
        
        console.log('Loaded complaints:', complaints.length, complaints);
        
        // Filter to only active statuses (not resolved/closed)
        activeComplaintsData.complaints = (complaints || []).filter(c => {
            if (!c || !c.status) return false;
            const status = c.status.toLowerCase();
            // Active statuses: open, investigating, pending_info, acknowledged
            return !['resolved', 'closed'].includes(status);
        });
        activeComplaintsData.filteredComplaints = [...activeComplaintsData.complaints];
        
        console.log('Active complaints after filtering:', activeComplaintsData.complaints.length);
        
        updateStats();
        renderComplaints();
    } catch (error) {
        console.error('Error loading active complaints:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response,
            data: error.data
        });
        
        // Show more detailed error message
        const errorMessage = error.message || 'Failed to load active complaints';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            footer: 'Check browser console for more details'
        });
    }
}

/**
 * Update Stats
 */
function updateStats() {
    const complaints = activeComplaintsData.complaints || [];
    
    // Total active count
    const totalActive = complaints.length;
    document.getElementById('active-total-count').textContent = totalActive;
    
    // Due this week count
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const dueThisWeek = complaints.filter(c => {
        if (!c.resolution_due_date) return false;
        const dueDate = new Date(c.resolution_due_date);
        return dueDate <= sevenDaysFromNow && dueDate >= new Date();
    }).length;
    document.getElementById('active-due-this-week').textContent = dueThisWeek;
    
    // Pending info count
    const pendingInfo = complaints.filter(c => {
        const status = (c.status || '').toLowerCase();
        return status === 'pending_info' || status === 'pending';
    }).length;
    document.getElementById('active-pending-info').textContent = pendingInfo;
    
    // Average age
    if (complaints.length > 0) {
        const totalDays = complaints.reduce((sum, c) => {
            const receivedDate = new Date(c.complaint_received_date || c.complaint_date || c.created_at);
            const today = new Date();
            const days = Math.ceil((today - receivedDate) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        const avgAge = Math.round(totalDays / complaints.length);
        document.getElementById('active-average-age').textContent = `${avgAge} days`;
    } else {
        document.getElementById('active-average-age').textContent = '0 days';
    }
}

/**
 * Render Complaints
 */
function renderComplaints() {
    // Find the complaints list container
    let container = document.getElementById('complaints-list-container');
    if (!container) {
        // Try alternative selectors
        container = document.querySelector('#active #complaints-list-container');
    }
    if (!container) {
        container = document.querySelector('#active .row');
    }
    if (!container) {
        container = document.querySelector('#active .card-body .row');
    }
    
    if (!container) {
        console.error('Could not find container for complaints list');
        // Create a container if none exists
        const cardBody = document.querySelector('#active .card-body');
        if (cardBody) {
            container = document.createElement('div');
            container.className = 'row';
            container.id = 'complaints-list-container';
            cardBody.appendChild(container);
        } else {
            return;
        }
    }
    
    if (activeComplaintsData.filteredComplaints.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    No active complaints. All complaints have been resolved!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeComplaintsData.filteredComplaints.map(complaint => {
        const date = new Date(complaint.complaint_date || complaint.created_at).toLocaleDateString('en-ZA');
        const dueDate = complaint.resolution_due_date 
            ? new Date(complaint.resolution_due_date).toLocaleDateString('en-ZA')
            : 'N/A';
        const isOverdue = complaint.is_overdue || (complaint.resolution_due_date && new Date(complaint.resolution_due_date) < new Date());
        
        const priorityBadge = complaint.priority === 'high' 
            ? '<span class="badge bg-danger">High</span>'
            : complaint.priority === 'medium'
            ? '<span class="badge bg-warning">Medium</span>'
            : '<span class="badge bg-info">Low</span>';
        
        const statusBadge = complaint.status === 'investigating'
            ? '<span class="badge bg-info">Investigating</span>'
            : '<span class="badge bg-warning">Open</span>';
        
        return `
            <div class="col-md-6 mb-4">
                <div class="card complaint-card ${isOverdue ? 'border-danger' : ''}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <strong>${complaint.complaint_reference_number || 'N/A'}</strong>
                        ${isOverdue ? '<span class="badge bg-danger">⚠️ Overdue</span>' : ''}
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${complaint.complainant_name || 'Unknown'}</h6>
                        <p class="card-text text-muted small">${complaint.complaint_category || 'N/A'}</p>
                        <p class="card-text">${(complaint.complaint_description || '').substring(0, 100)}${complaint.complaint_description && complaint.complaint_description.length > 100 ? '...' : ''}</p>
                        <div class="mb-2">
                            ${priorityBadge} ${statusBadge}
                        </div>
                        <div class="small text-muted mb-2">
                            <div>Date: ${date}</div>
                            <div>Due: ${dueDate} ${isOverdue ? '⚠️' : ''}</div>
                            ${complaint.assigned_to ? `<div>Assigned: ${complaint.assigned_to}</div>` : ''}
                        </div>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-primary" onclick="viewComplaintDetails('${complaint.id}')">View Details</button>
                            <button class="btn btn-sm btn-outline-primary" onclick="editComplaintFromCard('${complaint.id}')" title="Edit Complaint">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilters() {
    const filterInputs = document.querySelectorAll('#active .form-select, #active .form-control');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('active-filter-status')?.value || 'All';
    const priorityFilter = document.getElementById('active-filter-priority')?.value || 'All';
    const categoryFilter = document.getElementById('active-filter-category')?.value || 'All';
    const searchTerm = (document.getElementById('active-filter-search')?.value || '').toLowerCase();
    
    activeComplaintsData.filteredComplaints = activeComplaintsData.complaints.filter(complaint => {
        // Status filter
        if (statusFilter !== 'All' && complaint.status !== statusFilter.toLowerCase()) {
            return false;
        }
        
        // Priority filter
        if (priorityFilter !== 'All' && complaint.priority !== priorityFilter.toLowerCase()) {
            return false;
        }
        
        // Category filter
        if (categoryFilter !== 'All') {
            const category = complaint.complaint_category || '';
            if (!category.toLowerCase().includes(categoryFilter.toLowerCase())) {
                return false;
            }
        }
        
        // Search filter
        if (searchTerm) {
            const searchableText = [
                complaint.complaint_reference_number,
                complaint.complainant_name,
                complaint.complaint_category,
                complaint.complaint_description
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderComplaints();
}

/**
 * View Complaint Details
 */
async function viewComplaintDetails(complaintId) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Show loading state
        const modal = new bootstrap.Modal(document.getElementById('complaintDetailModal'));
        const content = document.getElementById('complaintDetailContent');
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading complaint details...</p>
            </div>
        `;
        modal.show();
        
        // Load complaint details
        const complaintResult = await dataFunctionsToUse.getComplaint(complaintId);
        let complaint = complaintResult;
        if (complaintResult && complaintResult.data) {
            complaint = complaintResult.data;
        } else if (complaintResult && typeof complaintResult === 'object' && !Array.isArray(complaintResult)) {
            complaint = complaintResult;
        }
        
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        
        // Load communications if available
        let communications = [];
        try {
            const commsResult = await dataFunctionsToUse.getComplaintCommunications(complaintId);
            if (commsResult) {
                communications = Array.isArray(commsResult) ? commsResult : 
                               (commsResult.data ? (Array.isArray(commsResult.data) ? commsResult.data : [commsResult.data]) : []);
            }
        } catch (error) {
            console.warn('Could not load communications:', error);
        }
        
        // Render complaint details
        renderComplaintDetails(complaint, communications);
        
        // Store complaint ID for edit function
        document.getElementById('complaintDetailModal').dataset.complaintId = complaintId;
        
    } catch (error) {
        console.error('Error loading complaint details:', error);
        const content = document.getElementById('complaintDetailContent');
        content.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Error:</strong> ${error.message || 'Failed to load complaint details'}
            </div>
        `;
    }
}

/**
 * Render Complaint Details
 */
function renderComplaintDetails(complaint, communications = []) {
    const content = document.getElementById('complaintDetailContent');
    const modalLabel = document.getElementById('complaintDetailModalLabel');
    
    // Update modal title
    modalLabel.textContent = `${complaint.complaint_reference_number || 'Complaint'} - Details`;
    
    // Calculate days active
    const receivedDate = new Date(complaint.complaint_received_date || complaint.complaint_date || complaint.created_at);
    const today = new Date();
    const daysActive = Math.ceil((today - receivedDate) / (1000 * 60 * 60 * 24));
    
    // Calculate days until deadline
    let daysUntilDeadline = null;
    if (complaint.resolution_due_date) {
        const deadline = new Date(complaint.resolution_due_date);
        daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    }
    
    // Status badge
    const statusBadge = complaint.status === 'resolved' 
        ? '<span class="badge bg-success">Resolved</span>'
        : complaint.status === 'closed'
        ? '<span class="badge bg-secondary">Closed</span>'
        : complaint.status === 'investigating'
        ? '<span class="badge bg-info">Investigating</span>'
        : complaint.status === 'pending_info'
        ? '<span class="badge bg-warning">Pending Info</span>'
        : '<span class="badge bg-warning">Open</span>';
    
    // Priority badge
    const priorityBadge = complaint.priority === 'high' || complaint.priority === 'critical'
        ? '<span class="badge bg-danger">High Priority</span>'
        : complaint.priority === 'medium'
        ? '<span class="badge bg-warning">Medium Priority</span>'
        : '<span class="badge bg-info">Low Priority</span>';
    
    // Severity badge
    const severityBadge = complaint.severity === 'critical'
        ? '<span class="badge bg-danger">Critical</span>'
        : complaint.severity === 'major'
        ? '<span class="badge bg-warning">Major</span>'
        : complaint.severity === 'minor'
        ? '<span class="badge bg-info">Minor</span>'
        : '';
    
    // Overdue indicator
    const overdueBadge = complaint.is_overdue || (complaint.resolution_due_date && new Date(complaint.resolution_due_date) < today)
        ? '<span class="badge bg-danger">⚠️ Overdue</span>'
        : '';
    
    content.innerHTML = `
        <!-- Header Section -->
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="mb-0">${complaint.complaint_reference_number || 'N/A'}</h4>
                        <small>Complaint Details</small>
                    </div>
                    <div>
                        ${statusBadge} ${priorityBadge} ${severityBadge} ${overdueBadge}
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Days Active:</strong> ${daysActive} days</p>
                        ${complaint.resolution_due_date ? `
                            <p><strong>6-Week Deadline:</strong> ${new Date(complaint.resolution_due_date).toLocaleDateString('en-ZA')} 
                                ${daysUntilDeadline !== null ? `(${daysUntilDeadline > 0 ? daysUntilDeadline + ' days remaining' : 'OVERDUE'})` : ''}
                            </p>
                        ` : ''}
                        ${complaint.complaint_date ? `<p><strong>Complaint Date:</strong> ${new Date(complaint.complaint_date).toLocaleDateString('en-ZA')}</p>` : ''}
                        ${complaint.complaint_received_date ? `<p><strong>Received Date:</strong> ${new Date(complaint.complaint_received_date).toLocaleDateString('en-ZA')}</p>` : ''}
                        ${complaint.complaint_channel ? `<p><strong>Received Via:</strong> ${complaint.complaint_channel}</p>` : ''}
                    </div>
                    <div class="col-md-6">
                        ${complaint.assigned_to ? `<p><strong>Assigned To:</strong> ${complaint.assigned_to}</p>` : '<p><strong>Assigned To:</strong> <span class="text-muted">Unassigned</span></p>'}
                        ${complaint.representative_id ? `<p><strong>Representative:</strong> ${complaint.representative_id}</p>` : ''}
                        ${complaint.acknowledgement_sent_date ? `<p><strong>Acknowledged:</strong> ${new Date(complaint.acknowledgement_sent_date).toLocaleDateString('en-ZA')}</p>` : ''}
                        ${complaint.resolution_date ? `<p><strong>Resolved:</strong> ${new Date(complaint.resolution_date).toLocaleDateString('en-ZA')}</p>` : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- Timeline -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-clock me-2"></i>Timeline</h5>
            </div>
            <div class="card-body">
                <div class="timeline">
                    <div class="timeline-item ${complaint.complaint_received_date ? 'completed' : ''}">
                        <div class="timeline-marker bg-success">✓</div>
                        <div class="timeline-content">
                            <strong>Received</strong>
                            <p class="mb-0 text-muted">${complaint.complaint_received_date ? new Date(complaint.complaint_received_date).toLocaleDateString('en-ZA') : 'N/A'}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${complaint.acknowledgement_sent_date ? 'completed' : ''}">
                        <div class="timeline-marker ${complaint.acknowledgement_sent_date ? 'bg-success' : 'bg-secondary'}">${complaint.acknowledgement_sent_date ? '✓' : '○'}</div>
                        <div class="timeline-content">
                            <strong>Acknowledged</strong>
                            <p class="mb-0 text-muted">${complaint.acknowledgement_sent_date ? new Date(complaint.acknowledgement_sent_date).toLocaleDateString('en-ZA') : 'Pending'}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${complaint.status === 'investigating' || complaint.status === 'resolved' || complaint.status === 'closed' ? 'completed' : ''}">
                        <div class="timeline-marker ${complaint.status === 'investigating' || complaint.status === 'resolved' || complaint.status === 'closed' ? 'bg-info' : 'bg-secondary'}">${complaint.status === 'investigating' || complaint.status === 'resolved' || complaint.status === 'closed' ? '✓' : '○'}</div>
                        <div class="timeline-content">
                            <strong>Investigating</strong>
                            <p class="mb-0 text-muted">${complaint.status === 'investigating' ? 'In Progress' : complaint.status === 'resolved' || complaint.status === 'closed' ? 'Completed' : 'Pending'}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${complaint.resolution_date ? 'completed' : ''}">
                        <div class="timeline-marker ${complaint.resolution_date ? 'bg-success' : 'bg-secondary'}">${complaint.resolution_date ? '✓' : '○'}</div>
                        <div class="timeline-content">
                            <strong>Resolved</strong>
                            <p class="mb-0 text-muted">${complaint.resolution_date ? new Date(complaint.resolution_date).toLocaleDateString('en-ZA') : 'Pending'}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${complaint.status === 'closed' ? 'completed' : ''}">
                        <div class="timeline-marker ${complaint.status === 'closed' ? 'bg-success' : 'bg-secondary'}">${complaint.status === 'closed' ? '✓' : '○'}</div>
                        <div class="timeline-content">
                            <strong>Closed</strong>
                            <p class="mb-0 text-muted">${complaint.status === 'closed' ? 'Completed' : 'Pending'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Client Information -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-user me-2"></i>Client Information</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> ${complaint.complainant_name || 'N/A'}</p>
                        ${complaint.complainant_email ? `<p><strong>Email:</strong> ${complaint.complainant_email}</p>` : ''}
                        ${complaint.complainant_phone ? `<p><strong>Phone:</strong> ${complaint.complainant_phone}</p>` : ''}
                        ${complaint.complainant_address ? `<p><strong>Address:</strong> ${complaint.complainant_address}</p>` : ''}
                    </div>
                    <div class="col-md-6">
                        ${complaint.client_id ? `<p><strong>Client ID:</strong> ${complaint.client_id}</p>` : ''}
                        ${complaint.representative_id ? `<p><strong>Representative ID:</strong> ${complaint.representative_id}</p>` : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- Complaint Details -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-file-alt me-2"></i>Complaint Details</h5>
            </div>
            <div class="card-body">
                <p><strong>Category:</strong> ${complaint.complaint_category || 'N/A'}</p>
                ${complaint.complaint_subcategory ? `<p><strong>Sub-category:</strong> ${complaint.complaint_subcategory}</p>` : ''}
                ${complaint.product_type ? `<p><strong>Product Type:</strong> ${complaint.product_type}</p>` : ''}
                ${complaint.policy_number ? `<p><strong>Policy Number:</strong> ${complaint.policy_number}</p>` : ''}
                <div class="mt-3">
                    <strong>Description:</strong>
                    <div class="border rounded p-3 mt-2 bg-light">
                        ${complaint.complaint_description || 'No description provided'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Financial Impact -->
        ${complaint.compensation_amount || complaint.compensation_offered ? `
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-money-bill me-2"></i>Financial Impact</h5>
            </div>
            <div class="card-body">
                ${complaint.compensation_offered ? `<p><strong>Compensation Offered:</strong> ${complaint.compensation_offered ? 'Yes' : 'No'}</p>` : ''}
                ${complaint.compensation_amount ? `<p><strong>Compensation Amount:</strong> R${parseFloat(complaint.compensation_amount).toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>` : ''}
                ${complaint.compensation_paid ? `<p><strong>Compensation Paid:</strong> ${complaint.compensation_paid ? 'Yes' : 'No'}</p>` : ''}
                ${complaint.compensation_payment_date ? `<p><strong>Payment Date:</strong> ${new Date(complaint.compensation_payment_date).toLocaleDateString('en-ZA')}</p>` : ''}
            </div>
        </div>
        ` : ''}

        <!-- Investigation & Resolution -->
        ${complaint.investigation_notes || complaint.resolution_description ? `
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-search me-2"></i>Investigation & Resolution</h5>
            </div>
            <div class="card-body">
                ${complaint.investigation_notes ? `
                    <div class="mb-3">
                        <strong>Investigation Notes:</strong>
                        <div class="border rounded p-3 mt-2 bg-light">
                            ${complaint.investigation_notes}
                        </div>
                    </div>
                ` : ''}
                ${complaint.resolution_description ? `
                    <div class="mb-3">
                        <strong>Resolution Description:</strong>
                        <div class="border rounded p-3 mt-2 bg-light">
                            ${complaint.resolution_description}
                        </div>
                    </div>
                ` : ''}
                ${complaint.root_cause ? `
                    <div class="mb-3">
                        <strong>Root Cause:</strong>
                        <p>${complaint.root_cause}</p>
                    </div>
                ` : ''}
                ${complaint.preventative_action ? `
                    <div class="mb-3">
                        <strong>Preventative Action:</strong>
                        <p>${complaint.preventative_action}</p>
                    </div>
                ` : ''}
                ${complaint.systemic_issue ? `
                    <p><strong>Systemic Issue:</strong> ${complaint.systemic_issue ? 'Yes' : 'No'}</p>
                ` : ''}
            </div>
        </div>
        ` : ''}

        <!-- Escalation Information -->
        ${complaint.escalated_to_ombud || complaint.escalated_to_fsca ? `
        <div class="card mb-4">
            <div class="card-header bg-warning">
                <h5 class="mb-0"><i class="fas fa-exclamation-triangle me-2"></i>Escalation Information</h5>
            </div>
            <div class="card-body">
                ${complaint.escalated_to_ombud ? `
                    <div class="mb-3">
                        <strong>Escalated to Ombudsman:</strong> Yes
                        ${complaint.ombud_case_number ? `<p><strong>Case Number:</strong> ${complaint.ombud_case_number}</p>` : ''}
                        ${complaint.ombud_escalation_date ? `<p><strong>Escalation Date:</strong> ${new Date(complaint.ombud_escalation_date).toLocaleDateString('en-ZA')}</p>` : ''}
                    </div>
                ` : ''}
                ${complaint.escalated_to_fsca ? `
                    <div class="mb-3">
                        <strong>Escalated to FSCA:</strong> Yes
                        ${complaint.fsca_case_number ? `<p><strong>Case Number:</strong> ${complaint.fsca_case_number}</p>` : ''}
                        ${complaint.fsca_escalation_date ? `<p><strong>Escalation Date:</strong> ${new Date(complaint.fsca_escalation_date).toLocaleDateString('en-ZA')}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        <!-- Communications -->
        ${communications.length > 0 ? `
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-comments me-2"></i>Communications (${communications.length})</h5>
            </div>
            <div class="card-body">
                ${communications.map(comm => `
                    <div class="border rounded p-3 mb-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <strong>${comm.communication_type || 'Communication'}</strong>
                                <small class="text-muted ms-2">${comm.communication_date ? new Date(comm.communication_date).toLocaleDateString('en-ZA') : 'N/A'}</small>
                            </div>
                        </div>
                        ${comm.communication_notes ? `<p class="mb-0">${comm.communication_notes}</p>` : ''}
                        ${comm.communication_method ? `<small class="text-muted">Method: ${comm.communication_method}</small>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

/**
 * Edit Complaint from Card (direct edit)
 */
async function editComplaintFromCard(complaintId) {
    if (!complaintId) return;
    
    // Store complaint ID for edit function
    document.getElementById('complaintDetailModal').dataset.complaintId = complaintId;
    
    // Call the edit function
    await editComplaintFromModal();
}

/**
 * Edit Complaint from Modal
 */
async function editComplaintFromModal() {
    const complaintId = document.getElementById('complaintDetailModal').dataset.complaintId;
    if (!complaintId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Complaint ID not found'
        });
        return;
    }
    
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Close the detail modal
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('complaintDetailModal'));
        if (detailModal) detailModal.hide();
        
        // Load complaint data
        const complaintResult = await dataFunctionsToUse.getComplaint(complaintId);
        let complaint = complaintResult;
        if (complaintResult && complaintResult.data) {
            complaint = complaintResult.data;
        } else if (complaintResult && typeof complaintResult === 'object' && !Array.isArray(complaintResult)) {
            complaint = complaintResult;
        }
        
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        
        // Load users for assignment dropdown
        let users = [];
        try {
            const usersResult = await dataFunctionsToUse.getUserProfiles();
            if (usersResult) {
                users = Array.isArray(usersResult) ? usersResult : 
                       (usersResult.data ? (Array.isArray(usersResult.data) ? usersResult.data : [usersResult.data]) : []);
            }
        } catch (error) {
            console.warn('Could not load users:', error);
        }
        
        // Populate edit form
        populateEditForm(complaint, users);
        
        // Store complaint ID
        document.getElementById('editComplaintId').value = complaintId;
        
        // Show edit modal
        const editModal = new bootstrap.Modal(document.getElementById('editComplaintModal'));
        editModal.show();
        
    } catch (error) {
        console.error('Error loading complaint for editing:', error);
        
        if (typeof authService !== 'undefined' && authService.handleErrorWithSessionCheck) {
            await authService.handleErrorWithSessionCheck(error, {
                title: 'Error',
                message: error.message || 'Failed to load complaint for editing'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to load complaint for editing'
            });
        }
    }
}

/**
 * Populate Edit Form
 */
function populateEditForm(complaint, users = []) {
    // Set form values
    document.getElementById('editComplaintStatus').value = complaint.status || '';
    document.getElementById('editComplaintPriority').value = complaint.priority || '';
    
    // Populate assigned to dropdown
    const assignedToSelect = document.getElementById('editComplaintAssignedTo');
    assignedToSelect.innerHTML = '<option value="">Unassigned</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || user.id;
        if (complaint.assigned_to && complaint.assigned_to === user.id) {
            option.selected = true;
        }
        assignedToSelect.appendChild(option);
    });
    
    // Set dates
    if (complaint.acknowledgement_sent_date) {
        const ackDate = new Date(complaint.acknowledgement_sent_date);
        document.getElementById('editComplaintAckDate').value = ackDate.toISOString().split('T')[0];
    } else {
        document.getElementById('editComplaintAckDate').value = '';
    }
    
    if (complaint.resolution_date) {
        const resDate = new Date(complaint.resolution_date);
        document.getElementById('editComplaintResolutionDate').value = resDate.toISOString().split('T')[0];
    } else {
        document.getElementById('editComplaintResolutionDate').value = '';
    }
    
    // Set text areas
    document.getElementById('editComplaintInvestigationNotes').value = complaint.investigation_notes || '';
    document.getElementById('editComplaintResolutionDescription').value = complaint.resolution_description || '';
    document.getElementById('editComplaintRootCause').value = complaint.root_cause || '';
    document.getElementById('editComplaintPreventativeAction').value = complaint.preventative_action || '';
}

/**
 * Save Complaint Changes
 */
async function saveComplaintChanges(event) {
    event.preventDefault();
    
    const complaintId = document.getElementById('editComplaintId').value;
    if (!complaintId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Complaint ID not found'
        });
        return;
    }
    
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Collect form data - send actual values, not null
        const formData = {
            status: document.getElementById('editComplaintStatus').value,
            priority: document.getElementById('editComplaintPriority').value,
            assigned_to: document.getElementById('editComplaintAssignedTo').value,
            acknowledgement_sent_date: document.getElementById('editComplaintAckDate').value,
            resolution_date: document.getElementById('editComplaintResolutionDate').value,
            investigation_notes: document.getElementById('editComplaintInvestigationNotes').value,
            resolution_description: document.getElementById('editComplaintResolutionDescription').value,
            root_cause: document.getElementById('editComplaintRootCause').value,
            preventative_action: document.getElementById('editComplaintPreventativeAction').value
        };
        
        console.log('Saving complaint data:', complaintId, formData);
        
        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Update complaint
        const updateResult = await dataFunctionsToUse.updateComplaint(complaintId, formData);
        console.log('Update result:', updateResult);
        
        // Check if update was successful
        let success = false;
        if (updateResult) {
            // Handle different response formats
            if (updateResult.success === true) {
                success = true;
            } else if (updateResult.data && updateResult.data.success === true) {
                success = true;
            } else if (Array.isArray(updateResult) && updateResult[0]?.success === true) {
                success = true;
            }
        }
        
        if (!success) {
            const errorMsg = updateResult?.error || updateResult?.data?.error || updateResult?.message || 'Update failed';
            throw new Error(errorMsg);
        }
        
        // Close modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editComplaintModal'));
        if (editModal) editModal.hide();
        
        // Show success
        await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Complaint updated successfully',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Reload complaints list
        await loadActiveComplaints();
        
        // If detail modal was open, refresh it
        const detailModal = document.getElementById('complaintDetailModal');
        if (detailModal && detailModal.classList.contains('show')) {
            // Re-open detail view with updated data
            setTimeout(() => {
                viewComplaintDetails(complaintId);
            }, 500);
        }
        
    } catch (error) {
        console.error('Error saving complaint changes:', error);
        
        if (typeof authService !== 'undefined' && authService.handleErrorWithSessionCheck) {
            await authService.handleErrorWithSessionCheck(error, {
                title: 'Error',
                message: error.message || 'Failed to save complaint changes'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save complaint changes'
            });
        }
    }
}

// Export for global access
window.viewComplaintDetails = viewComplaintDetails;
window.editComplaintFromModal = editComplaintFromModal;
window.editComplaintFromCard = editComplaintFromCard;
window.saveComplaintChanges = saveComplaintChanges;

