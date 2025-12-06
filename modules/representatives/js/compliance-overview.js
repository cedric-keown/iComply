// Compliance Overview JavaScript

let complianceData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when compliance tab is shown
    const complianceTab = document.getElementById('compliance-tab');
    if (complianceTab) {
        complianceTab.addEventListener('shown.bs.tab', function() {
            loadComplianceOverview();
        });
    }
});

/**
 * Load Compliance Overview Data
 */
async function loadComplianceOverview() {
    try {
        // Load Representatives from database
        const result = await dataFunctions.getRepresentatives(null); // Get all statuses
        let reps = result;
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        // Enrich with user profile data and compliance calculations
        if (reps && Array.isArray(reps) && reps.length > 0) {
            complianceData = await Promise.all(reps.map(async (rep) => {
                try {
                    // Get user profile for name
                    if (rep.user_profile_id) {
                        const profileResult = await dataFunctions.getUserProfile(rep.user_profile_id);
                        if (profileResult && profileResult.data) {
                            rep.first_name = profileResult.data.first_name;
                            rep.surname = profileResult.data.surname;
                        } else if (profileResult && profileResult.first_name) {
                            rep.first_name = profileResult.first_name;
                            rep.surname = profileResult.surname;
                        }
                    }
                    
                    // Get comprehensive compliance data
                    const complianceResult = await dataFunctions.getRepresentativeCompliance(rep.id);
                    let compliance = complianceResult;
                    if (complianceResult && complianceResult.data) {
                        compliance = complianceResult.data;
                    }
                    
                    if (compliance) {
                        // Map compliance data to display format
                        rep.fpStatus = compliance.fit_proper?.status || 'unknown';
                        rep.cpdStatus = compliance.cpd?.status || 'unknown';
                        rep.ficaStatus = compliance.fica?.status || 'unknown';
                        rep.overallStatus = compliance.overall_status || 'unknown';
                        rep.overallScore = compliance.overall_score || 0;
                        rep.is_debarred = rep.status === 'debarred';
                        
                        // Store full compliance details
                        rep.compliance = compliance;
                    } else {
                        // Fallback if compliance calculation fails
                        rep.fpStatus = rep.status === 'active' ? 'compliant' : 'non_compliant';
                        rep.cpdStatus = rep.status === 'active' ? 'in_progress' : 'behind';
                        rep.ficaStatus = rep.status === 'active' ? 'current' : 'warning';
                        rep.overallStatus = rep.status === 'active' ? 'compliant' : 'non_compliant';
                        rep.is_debarred = rep.status === 'debarred';
                    }
                    
                    return rep;
                } catch (err) {
                    console.warn('Error enriching representative data:', err);
                    // Return rep with basic compliance based on status
                    rep.fpStatus = rep.status === 'active' ? 'compliant' : 'non_compliant';
                    rep.cpdStatus = rep.status === 'active' ? 'in_progress' : 'behind';
                    rep.ficaStatus = rep.status === 'active' ? 'current' : 'warning';
                    rep.overallStatus = rep.status === 'active' ? 'compliant' : 'non_compliant';
                    rep.is_debarred = rep.status === 'debarred';
                    return rep;
                }
            }));
        } else {
            complianceData = [];
        }
        
        renderComplianceOverview();
    } catch (error) {
        console.error('Error loading compliance overview:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load compliance overview'
            });
        }
        complianceData = [];
        renderComplianceOverview();
    }
}

/**
 * Render Compliance Overview
 */
function renderComplianceOverview() {
    const container = document.getElementById('compliance');
    if (!container) return;
    
    // Find or create the compliance container
    let complianceContainer = container.querySelector('.compliance-overview-container');
    if (!complianceContainer) {
        complianceContainer = document.createElement('div');
        complianceContainer.className = 'compliance-overview-container';
        const heading = container.querySelector('h2');
        if (heading && heading.nextSibling) {
            heading.parentNode.insertBefore(complianceContainer, heading.nextSibling);
        } else {
            container.appendChild(complianceContainer);
        }
    }
    
    complianceContainer.innerHTML = '';
    
    if (complianceData.length === 0) {
        complianceContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>No representatives found.
            </div>
        `;
        return;
    }
    
    // Calculate compliance statistics
    const stats = {
        total: complianceData.length,
        compliant: 0,
        atRisk: 0,
        nonCompliant: 0,
        fitProper: 0,
        cpdCurrent: 0,
        ficaVerified: 0,
        debarred: 0
    };
    
    complianceData.forEach(rep => {
        // Check overall compliance status
        if (rep.overallStatus === 'compliant') {
            stats.compliant++;
        } else if (rep.overallStatus === 'at-risk') {
            stats.atRisk++;
        } else if (rep.overallStatus === 'non-compliant') {
            stats.nonCompliant++;
        } else {
            // Fallback for reps without overallStatus
            const isCompliant = !rep.is_debarred && rep.status === 'active';
            if (isCompliant) stats.compliant++;
            else stats.nonCompliant++;
        }
        
        // Fit & Proper status
        if (rep.fpStatus === 'compliant') stats.fitProper++;
        
        // CPD status
        if (rep.cpdStatus === 'completed') stats.cpdCurrent++;
        
        // FICA status
        if (rep.ficaStatus === 'current') stats.ficaVerified++;
        
        // Debarment
        if (rep.is_debarred) stats.debarred++;
    });
    
    const compliancePct = stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0;
    
    // Render statistics cards
    complianceContainer.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-${compliancePct >= 90 ? 'success' : compliancePct >= 75 ? 'warning' : 'danger'}">
                            ${compliancePct}%
                        </div>
                        <div class="text-muted">Overall Compliance</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-success">${stats.compliant}</div>
                        <div class="text-muted">Compliant</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-warning">${stats.atRisk}</div>
                        <div class="text-muted">At Risk</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-danger">${stats.nonCompliant}</div>
                        <div class="text-muted">Non-Compliant</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-${stats.fitProper === stats.total ? 'success' : 'warning'}">${stats.fitProper}/${stats.total}</div>
                        <div class="text-muted">Fit & Proper</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-${stats.cpdCurrent === stats.total ? 'success' : 'warning'}">${stats.cpdCurrent}/${stats.total}</div>
                        <div class="text-muted">CPD Current</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Compliance Matrix</h5>
                <div>
                    <input type="text" class="form-control form-control-sm d-inline-block" style="width: 200px;" 
                           placeholder="Search..." id="complianceSearch" onkeyup="filterComplianceTable()">
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="complianceTable">
                        <thead>
                            <tr>
                                <th>Representative</th>
                                <th>F&P Status</th>
                                <th>CPD Status</th>
                                <th>FICA</th>
                                <th>Debarment</th>
                                <th>Overall</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${complianceData.map(rep => {
                                const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                
                                // F&P Status Badge
                                const fpBadge = rep.fpStatus === 'compliant' ? 
                                    '<span class="badge bg-success">✅ Current</span>' :
                                    rep.fpStatus === 'warning' ?
                                    '<span class="badge bg-warning text-dark">⚠️ Warning</span>' :
                                    '<span class="badge bg-danger">❌ Non-Compliant</span>';
                                
                                // CPD Status Badge
                                const cpdBadge = rep.cpdStatus === 'completed' ?
                                    '<span class="badge bg-success">✅ Completed</span>' :
                                    rep.cpdStatus === 'in-progress' ?
                                    '<span class="badge bg-info">🔄 In Progress</span>' :
                                    '<span class="badge bg-danger">⏰ Behind</span>';
                                
                                // FICA Status Badge
                                const ficaBadge = rep.ficaStatus === 'current' ?
                                    '<span class="badge bg-success">✅ Current</span>' :
                                    rep.ficaStatus === 'warning' ?
                                    '<span class="badge bg-warning text-dark">⚠️ Overdue</span>' :
                                    '<span class="badge bg-danger">❌ Critical</span>';
                                
                                // Overall Status Badge
                                const overallBadge = rep.overallStatus === 'compliant' ?
                                    '<span class="badge bg-success">✅ Compliant</span>' :
                                    rep.overallStatus === 'at-risk' ?
                                    '<span class="badge bg-warning text-dark">⚠️ At Risk</span>' :
                                    '<span class="badge bg-danger">❌ Non-Compliant</span>';
                                
                                const rowClass = rep.overallStatus === 'non-compliant' ? 'table-danger' :
                                               rep.overallStatus === 'at-risk' ? 'table-warning' : '';
                                
                                return `
                                    <tr class="${rowClass}">
                                        <td><strong>${repName}</strong></td>
                                        <td>${fpBadge}</td>
                                        <td>${cpdBadge}</td>
                                        <td>${ficaBadge}</td>
                                        <td>
                                            <span class="badge ${rep.is_debarred ? 'bg-danger' : 'bg-success'}">
                                                ${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}
                                            </span>
                                        </td>
                                        <td>${overallBadge}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="viewRepProfile('${rep.id}')">
                                                View Details
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

/**
 * View Representative Profile with Compliance Details
 */
async function viewRepProfile(id) {
    try {
        // Find representative in loaded data
        let rep = complianceData.find(r => r.id === id);
        
        if (!rep) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Representative not found'
            });
            return;
        }
        
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const compliance = rep.compliance || {};
        
        // F&P Details
        const fpData = compliance.fit_proper || {};
        const fpStatus = fpData.status || rep.fpStatus || 'unknown';
        const fpBadgeClass = fpStatus === 'compliant' ? 'success' : fpStatus === 'warning' ? 'warning' : 'danger';
        
        // CPD Details
        const cpdData = compliance.cpd || {};
        const cpdStatus = cpdData.status || rep.cpdStatus || 'unknown';
        const cpdBadgeClass = cpdStatus === 'completed' ? 'success' : cpdStatus === 'in_progress' ? 'info' : 'danger';
        const cpdPercentage = cpdData.percentage || 0;
        
        // FICA Details
        const ficaData = compliance.fica || {};
        const ficaStatus = ficaData.status || rep.ficaStatus || 'unknown';
        const ficaBadgeClass = ficaStatus === 'current' ? 'success' : ficaStatus === 'warning' ? 'warning' : 'danger';
        
        // Documents Details
        const docsData = compliance.documents || {};
        const docsStatus = docsData.status || rep.docsStatus || 'unknown';
        const docsBadgeClass = docsStatus === 'current' ? 'success' : docsStatus === 'warning' ? 'warning' : 'danger';
        
        // Overall
        const overallStatus = compliance.overall_status || rep.overallStatus || 'unknown';
        const overallScore = compliance.overall_score || rep.overallScore || 0;
        const overallBadgeClass = overallStatus === 'compliant' ? 'success' : overallStatus === 'at_risk' ? 'warning' : 'danger';
        
        Swal.fire({
            title: `${name} - Compliance Details`,
            html: `
                <div class="text-start">
                    <div class="mb-4">
                        <h5>Overall Compliance</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>Score: <strong>${Math.round(overallScore)}%</strong></span>
                            <span class="badge bg-${overallBadgeClass}">${overallStatus.toUpperCase().replace('_', ' ')}</span>
                        </div>
                        <div class="progress mt-2" style="height: 20px;">
                            <div class="progress-bar bg-${overallBadgeClass}" role="progressbar" 
                                 style="width: ${overallScore}%">
                                ${Math.round(overallScore)}%
                            </div>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h6>Fit & Proper</h6>
                            <p class="mb-1">
                                <span class="badge bg-${fpBadgeClass}">${fpStatus.toUpperCase().replace('_', ' ')}</span>
                            </p>
                            <small class="text-muted">
                                ${fpData.has_re5 ? '✓ RE5 Valid' : '✗ RE5 Missing/Expired'}<br>
                                ${fpData.has_re1 ? '✓ RE1 Valid' : '✗ RE1 Missing/Expired'}<br>
                                ${fpData.expired_count > 0 ? `⚠ ${fpData.expired_count} Expired Qualifications` : 'No Expired Qualifications'}
                            </small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <h6>CPD Status</h6>
                            <p class="mb-1">
                                <span class="badge bg-${cpdBadgeClass}">${cpdStatus.toUpperCase().replace('_', ' ')}</span>
                            </p>
                            <small class="text-muted">
                                Hours: ${cpdData.earned_hours || 0} / ${cpdData.required_hours || 18}<br>
                                Ethics: ${cpdData.earned_ethics || 0} / ${cpdData.required_ethics || 3}<br>
                                Progress: ${Math.round(cpdPercentage)}%
                            </small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <h6>FICA Verification</h6>
                            <p class="mb-1">
                                <span class="badge bg-${ficaBadgeClass}">${ficaStatus.toUpperCase()}</span>
                            </p>
                            <small class="text-muted">
                                Total Clients: ${ficaData.total_clients || 0}<br>
                                Verified: ${ficaData.verified_clients || 0}<br>
                                ${ficaData.expired_clients > 0 ? `⚠ Expired: ${ficaData.expired_clients}` : 'All Current'}
                            </small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <h6>Documents</h6>
                            <p class="mb-1">
                                <span class="badge bg-${docsBadgeClass}">${docsStatus.toUpperCase()}</span>
                            </p>
                            <small class="text-muted">
                                Total: ${docsData.total_documents || 0}<br>
                                Current: ${docsData.current_documents || 0}<br>
                                ${docsData.expired_documents > 0 ? `⚠ Expired: ${docsData.expired_documents}` : 'All Current'}
                            </small>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="text-muted small">
                        <p class="mb-1"><strong>Representative Details</strong></p>
                        <p class="mb-1">Status: <span class="badge bg-${rep.status === 'active' ? 'success' : 'warning'}">${rep.status || 'N/A'}</span></p>
                        ${rep.is_debarred ? '<p class="text-danger mb-1">⚠ DEBARRED</p>' : ''}
                        ${compliance.calculated_at ? `<p class="mb-0">Last Calculated: ${new Date(compliance.calculated_at).toLocaleString('en-ZA')}</p>` : ''}
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        });
        
    } catch (error) {
        console.error('Error viewing representative profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load representative details'
        });
    }
}

/**
 * Filter Compliance Table
 */
function filterComplianceTable() {
    const searchInput = document.getElementById('complianceSearch');
    const filter = searchInput.value.toLowerCase();
    const table = document.getElementById('complianceTable');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Export for global access
window.filterComplianceTable = filterComplianceTable;
window.viewRepProfile = viewRepProfile;

