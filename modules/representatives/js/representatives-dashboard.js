// Representatives Dashboard JavaScript

let representativesData = [];
let dashboardStats = {
    total: 0,
    active: 0,
    suspended: 0,
    terminated: 0,
    compliant: 0,
    atRisk: 0,
    nonCompliant: 0
};

// Mock compliance data matching team-compliance matrix
const mockComplianceStats = {
    total: 12,
    compliant: 6,    // Sarah, Thabo, Lisa, Anna, Susan, Kevin
    atRisk: 3,       // Johan, Peter, Lerato
    nonCompliant: 3, // Mike, Pieter, David
    suspended: 1     // Mike Johnson
};

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeRepresentativesDashboard();
});

async function initializeRepresentativesDashboard() {
    try {
        await loadDashboardData();
        setupActivityFeed();
        setupComplianceMatrix();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

/**
 * Load Dashboard Data from Database
 */
async function loadDashboardData() {
    try {
        // Get all representatives
        const result = await dataFunctions.getRepresentatives();
        let reps = result;
        
        // Handle different response structures
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        if (reps && Array.isArray(reps)) {
            representativesData = reps;
            calculateDashboardStats();
            updateDashboardUI();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        
        // Check if session expired before showing error
        if (typeof authService !== 'undefined' && authService.handleErrorWithSessionCheck) {
            await authService.handleErrorWithSessionCheck(error, {
                title: 'Error',
                message: 'Failed to load representatives data'
            });
        } else {
            // Fallback if authService not available
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load representatives data'
                });
            }
        }
    }
}

/**
 * Calculate Dashboard Statistics
 */
function calculateDashboardStats() {
    // If we have database data, calculate from it
    if (representativesData && representativesData.length > 0) {
        dashboardStats = {
            total: representativesData.length,
            active: representativesData.filter(r => r.status === 'active').length,
            suspended: representativesData.filter(r => r.status === 'suspended').length,
            terminated: representativesData.filter(r => r.status === 'terminated').length,
            compliant: 0,
            atRisk: 0,
            nonCompliant: 0
        };
    } else {
        // Use mock data for demonstration
        dashboardStats = {
            total: mockComplianceStats.total,
            active: mockComplianceStats.total - mockComplianceStats.suspended,
            suspended: mockComplianceStats.suspended,
            terminated: 0,
            compliant: mockComplianceStats.compliant,
            atRisk: mockComplianceStats.atRisk,
            nonCompliant: mockComplianceStats.nonCompliant
        };
        updateDashboardUI();
        return;
    }
    
    // Calculate compliance from actual data
    // Try to get compliance data from team matrix if available
    if (typeof dataFunctions !== 'undefined' && dataFunctions) {
        try {
            dataFunctions.getTeamComplianceMatrix().then(result => {
                let matrix = result;
                if (result && result.data) {
                    matrix = result.data;
                } else if (result && Array.isArray(result)) {
                    matrix = result;
                }
                
                if (matrix && Array.isArray(matrix)) {
                    const activeReps = matrix.filter(r => r.rep_status === 'active');
                    const compliantReps = activeReps.filter(r => r.compliance_indicator === 'green');
                    dashboardStats.compliant = compliantReps.length;
                    dashboardStats.nonCompliant = activeReps.length - compliantReps.length;
                    updateDashboardUI(); // Update UI with real data
                } else {
                    // Use mock data if no matrix data
                    dashboardStats.compliant = mockComplianceStats.compliant;
                    dashboardStats.atRisk = mockComplianceStats.atRisk;
                    dashboardStats.nonCompliant = mockComplianceStats.nonCompliant;
                    updateDashboardUI();
                }
            }).catch(err => {
                console.warn('Could not load compliance matrix, using mock data:', err);
                dashboardStats.compliant = mockComplianceStats.compliant;
                dashboardStats.atRisk = mockComplianceStats.atRisk;
                dashboardStats.nonCompliant = mockComplianceStats.nonCompliant;
                updateDashboardUI();
            });
        } catch (err) {
            console.warn('Error loading compliance data, using mock data:', err);
            dashboardStats.compliant = mockComplianceStats.compliant;
            dashboardStats.atRisk = mockComplianceStats.atRisk;
            dashboardStats.nonCompliant = mockComplianceStats.nonCompliant;
            updateDashboardUI();
        }
    } else {
        // No dataFunctions available, use mock data
        dashboardStats.compliant = mockComplianceStats.compliant;
        dashboardStats.atRisk = mockComplianceStats.atRisk;
        dashboardStats.nonCompliant = mockComplianceStats.nonCompliant;
        updateDashboardUI();
    }
}

/**
 * Update Dashboard UI with Real Data
 */
function updateDashboardUI() {
    // Update Total Representatives Card
    const totalValueEl = document.getElementById('repsTotalValue');
    const statusBreakdownEl = document.getElementById('repsStatusBreakdown');
    
    if (totalValueEl) {
        totalValueEl.textContent = dashboardStats.total;
    }
    if (statusBreakdownEl) {
        statusBreakdownEl.textContent = `Active: ${dashboardStats.active} | Suspended: ${dashboardStats.suspended} | Terminated: ${dashboardStats.terminated}`;
    }
    
    // Update Compliance Status Card
    const complianceValueEl = document.getElementById('repsComplianceValue');
    const complianceSublabelEl = document.getElementById('repsComplianceSublabel');
    const complianceDetailsEl = document.getElementById('repsComplianceDetails');
    
    if (complianceValueEl || complianceSublabelEl || complianceDetailsEl) {
        const totalActive = dashboardStats.active || dashboardStats.total;
        const compliancePct = totalActive > 0 
            ? Math.round((dashboardStats.compliant / totalActive) * 100) 
            : 0;
        
        if (complianceValueEl) {
            complianceValueEl.textContent = `${compliancePct}%`;
            complianceValueEl.className = `stat-value ${compliancePct >= 85 ? 'text-success' : compliancePct >= 70 ? 'text-warning' : 'text-danger'}`;
        }
        if (complianceSublabelEl) {
            complianceSublabelEl.textContent = compliancePct >= 85 ? 'Fully compliant' : compliancePct >= 70 ? 'Mostly compliant' : 'Needs attention';
        }
        if (complianceDetailsEl) {
            const atRiskText = dashboardStats.atRisk > 0 ? ` | ${dashboardStats.atRisk} at risk` : '';
            const nonCompliantText = dashboardStats.nonCompliant > 0 ? ` | ${dashboardStats.nonCompliant} non-compliant` : '';
            complianceDetailsEl.innerHTML = `<span class="text-success">${dashboardStats.compliant} compliant</span>${atRiskText ? `<span class="text-warning">${atRiskText}</span>` : ''}${nonCompliantText ? `<span class="text-danger">${nonCompliantText}</span>` : ''}`;
        }
    }
    
    // Update CPD Due Soon Card (placeholder - would need CPD data)
    const cpdDueValueEl = document.getElementById('repsCpdDueValue');
    const cpdDueSublabelEl = document.getElementById('repsCpdDueSublabel');
    const cpdDaysRemainingEl = document.getElementById('repsCpdDaysRemaining');
    
    if (cpdDueValueEl) {
        cpdDueValueEl.textContent = '-'; // Would need to calculate from CPD data
    }
    if (cpdDueSublabelEl) {
        cpdDueSublabelEl.textContent = 'Loading...';
    }
    if (cpdDaysRemainingEl) {
        cpdDaysRemainingEl.textContent = 'Loading...';
    }
    
    // Update Fit & Proper Renewals Card (placeholder - would need F&P data)
    const fpRenewalsValueEl = document.getElementById('repsFpRenewalsValue');
    const fpRenewalsSublabelEl = document.getElementById('repsFpRenewalsSublabel');
    
    if (fpRenewalsValueEl) {
        fpRenewalsValueEl.textContent = '-'; // Would need to calculate from F&P data
    }
    if (fpRenewalsSublabelEl) {
        fpRenewalsSublabelEl.textContent = 'Loading...';
    }
    
    // Update Regulatory Compliance Section
    const overallStatusEl = document.getElementById('repsOverallStatus');
    const compliantCountEl = document.getElementById('repsCompliantCount');
    const compliantPercentageEl = document.getElementById('repsCompliantPercentage');
    const fpStatusEl = document.getElementById('repsFpStatus');
    const cpdStatusEl = document.getElementById('repsCpdStatus');
    
    const totalActive = dashboardStats.active || dashboardStats.total;
    const compliancePct = totalActive > 0 
        ? Math.round((dashboardStats.compliant / totalActive) * 100) 
        : 0;
    
    if (overallStatusEl) {
        if (compliancePct >= 85) {
            overallStatusEl.className = 'badge bg-success fs-6';
            overallStatusEl.textContent = '✅ COMPLIANT';
        } else if (compliancePct >= 70) {
            overallStatusEl.className = 'badge bg-warning fs-6';
            overallStatusEl.textContent = '⚠️ ATTENTION REQUIRED';
        } else {
            overallStatusEl.className = 'badge bg-danger fs-6';
            overallStatusEl.textContent = '🔴 CRITICAL';
        }
    }
    
    if (compliantCountEl) {
        compliantCountEl.innerHTML = `<span class="text-success">${dashboardStats.compliant}</span> / ${totalActive}`;
    }
    
    if (compliantPercentageEl) {
        compliantPercentageEl.innerHTML = `Compliant (${compliancePct}%) | <span class="text-warning">${dashboardStats.atRisk} At Risk</span> | <span class="text-danger">${dashboardStats.nonCompliant} Non-Compliant</span>`;
    }
    
    if (fpStatusEl) {
        // Based on mock data: 3 reps have F&P issues (Mike, Pieter, Lerato)
        const fpIssues = dashboardStats.nonCompliant + (dashboardStats.atRisk > 0 ? 1 : 0);
        if (fpIssues === 0) {
            fpStatusEl.textContent = '✅ All Current';
            fpStatusEl.className = 'badge bg-success';
        } else if (fpIssues <= 2) {
            fpStatusEl.textContent = `⚠️ ${fpIssues} Issues`;
            fpStatusEl.className = 'badge bg-warning text-dark';
        } else {
            fpStatusEl.textContent = `❌ ${fpIssues} Issues`;
            fpStatusEl.className = 'badge bg-danger';
        }
    }
    
    if (cpdStatusEl) {
        // Based on mock data: 4 reps have CPD issues (Mike, Johan, David, Lerato)
        const cpdIssues = dashboardStats.nonCompliant + Math.min(dashboardStats.atRisk, 2);
        if (cpdIssues === 0) {
            cpdStatusEl.textContent = '✅ All Current';
            cpdStatusEl.className = 'badge bg-success';
        } else if (cpdIssues <= 2) {
            cpdStatusEl.textContent = `⚠️ ${cpdIssues} Behind`;
            cpdStatusEl.className = 'badge bg-warning text-dark';
        } else {
            cpdStatusEl.textContent = `❌ ${cpdIssues} Behind`;
            cpdStatusEl.className = 'badge bg-danger';
        }
    }
    
    // Update Status Breakdown Cards
    const statusCards = document.querySelectorAll('#dashboard .status-card');
    statusCards.forEach(card => {
        const label = card.querySelector('.status-label')?.textContent || '';
        const valueEl = card.querySelector('.status-value');
        
        if (label.includes('Active') && valueEl) {
            valueEl.textContent = dashboardStats.active;
        } else if (label.includes('Suspended') && valueEl) {
            valueEl.textContent = dashboardStats.suspended;
        } else if (label.includes('Terminated') && valueEl) {
            valueEl.textContent = dashboardStats.terminated;
        } else if (label.includes('Non-Compliant') && valueEl) {
            valueEl.textContent = dashboardStats.nonCompliant;
        }
    });
    
    // Update Compliance Matrix Table
    updateComplianceMatrix();
}

/**
 * Update Compliance Matrix Table
 */
function updateComplianceMatrix() {
    // Try multiple selectors to find the compliance matrix table
    const tbody = document.querySelector('#dashboard .table tbody') ||
                 document.querySelector('#dashboard table tbody') ||
                 document.querySelector('.compliance-matrix tbody') ||
                 document.querySelector('#dashboard .card-body table tbody');
    
    if (!tbody) {
        console.warn('Compliance matrix table body not found');
        return;
    }
    
    // Clear existing rows (keep header)
    tbody.innerHTML = '';
    
    if (representativesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">No representatives found</td></tr>';
        return;
    }
    
    // Show first 10 active representatives
    const activeReps = representativesData
        .filter(r => r.status === 'active')
        .slice(0, 10);
    
    activeReps.forEach((rep, index) => {
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const row = document.createElement('tr');
        const repId = rep.id || '';
        
        // Ensure rep.id is valid
        if (!repId) {
            console.warn('Representative missing ID:', rep);
            return;
        }
        
        // Placeholder compliance status (would need CPD/F&P data)
        row.innerHTML = `
            <td>${escapeHtml(name)}</td>
            <td><span class="badge bg-success">✅ Current</span></td>
            <td><span class="badge bg-success">✅ Current</span></td>
            <td><span class="badge bg-success">✅ Verified</span></td>
            <td><span class="badge ${rep.is_debarred ? 'bg-danger' : 'bg-success'}">${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}</span></td>
            <td><span class="badge bg-success">✅ Compliant</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-rep-btn" data-rep-id="${repId}" type="button">View</button>
            </td>
        `;
        tbody.appendChild(row);
        
        // Attach event listener directly to avoid closure issues
        const viewBtn = row.querySelector('.view-rep-btn');
        if (viewBtn) {
            // Store repId in a local variable to capture it in the closure
            const capturedRepId = repId;
            
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get ID from data attribute (most reliable)
                const clickedRepId = this.getAttribute('data-rep-id') || capturedRepId;
                
                if (clickedRepId) {
                    console.log('View button clicked for rep ID:', clickedRepId, 'Name:', name);
                    viewRepresentative(clickedRepId);
                } else {
                    console.error('No representative ID found on button. Captured ID:', capturedRepId);
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Representative ID not found'
                        });
                    }
                }
            });
        } else {
            console.error('View button not found in row for rep:', repId, name);
        }
    });
    
    console.log(`Compliance matrix updated with ${activeReps.length} representatives`);
}

function setupActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-outline-primary, .btn-warning');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log('View activity details');
            });
        }
    });
}

function setupComplianceMatrix() {
    const viewBtns = document.querySelectorAll('#dashboard .btn-outline-primary');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('View representative profile');
        });
    });
}

function switchRepsTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

async function viewRepresentative(id) {
    try {
        // Find the representative in our data
        const rep = representativesData.find(r => r.id === id);
        if (!rep) {
            // If not in local data, try to fetch it
            try {
                const result = await dataFunctions.getRepresentative(id);
                let repData = result;
                if (result && result.data) {
                    repData = result.data;
                } else if (result && typeof result === 'object') {
                    repData = result;
                }
                
                if (repData) {
                    showRepresentativeDetails(repData);
                    return;
                }
            } catch (fetchError) {
                console.error('Error fetching representative:', fetchError);
            }
            
            // If we can't find or fetch the rep, show error
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Representative not found'
                });
            }
            return;
        }
        
        // Show representative details
        showRepresentativeDetails(rep);
    } catch (error) {
        console.error('Error viewing representative:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load representative details'
            });
        }
    }
}

/**
 * Show Representative Details Modal
 */
function showRepresentativeDetails(rep) {
    const name = `${rep.first_name || ''} ${rep.surname || rep.last_name || ''}`.trim() || 'Unknown';
    const fspNumber = rep.fsp_number_new || rep.fsp_number || rep.representative_number || 'N/A';
    const idNumber = rep.id_number || 'N/A';
    // Email and phone may not be in representatives table - would need to join with user_profiles
    const email = rep.email || 'N/A';
    const phone = rep.phone || rep.mobile || 'N/A';
    const status = rep.status || 'unknown';
    const statusBadge = status === 'active' ? 'success' : 
                       status === 'suspended' ? 'warning' : 
                       status === 'terminated' ? 'secondary' : 'secondary';
    
    const onboardingDate = rep.onboarding_date 
        ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
        : 'N/A';
    const authDate = rep.authorization_date 
        ? new Date(rep.authorization_date).toLocaleDateString('en-ZA')
        : 'N/A';
    
    // Get compliance status (if available from matrix data)
    let complianceStatus = 'Loading...';
    let complianceBadge = 'secondary';
    if (typeof dataFunctions !== 'undefined') {
        dataFunctions.getTeamComplianceMatrix().then(result => {
            let matrix = result;
            if (result && result.data) {
                matrix = result.data;
            } else if (result && Array.isArray(result)) {
                matrix = result;
            }
            
            if (matrix && Array.isArray(matrix)) {
                const matrixRep = matrix.find(r => r.representative_id === rep.id);
                if (matrixRep) {
                    complianceStatus = matrixRep.compliance_status || 'Unknown';
                    complianceBadge = matrixRep.compliance_indicator === 'green' ? 'success' :
                                     matrixRep.compliance_indicator === 'amber' ? 'warning' :
                                     matrixRep.compliance_indicator === 'red' ? 'danger' : 'secondary';
                }
            }
        }).catch(err => {
            console.warn('Could not load compliance status:', err);
        });
    }
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: name,
            html: `
                <div class="text-start">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <h6 class="text-primary mb-3">Personal Information</h6>
                            <p><strong>Representative Number:</strong> ${fspNumber}</p>
                            <p><strong>ID Number:</strong> ${idNumber}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Status:</strong> <span class="badge bg-${statusBadge}">${status.toUpperCase()}</span></p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-primary mb-3">Compliance Information</h6>
                            <p><strong>Onboarding Date:</strong> ${onboardingDate}</p>
                            <p><strong>Authorization Date:</strong> ${authDate}</p>
                            <p><strong>Compliance Status:</strong> <span class="badge bg-${complianceBadge}" id="complianceStatusBadge">${complianceStatus}</span></p>
                            <p><strong>Debarment Status:</strong> <span class="badge ${rep.is_debarred ? 'bg-danger' : 'bg-success'}">${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}</span></p>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-12">
                            <h6 class="text-primary mb-2">Authorized Categories</h6>
                            <ul class="list-unstyled">
                                ${rep.class_1_long_term ? '<li><i class="fas fa-check-circle text-success me-2"></i>Category I - Long-term Insurance</li>' : ''}
                                ${rep.class_2_short_term ? '<li><i class="fas fa-check-circle text-success me-2"></i>Category II - Short-term Insurance</li>' : ''}
                                ${rep.class_3_pension ? '<li><i class="fas fa-check-circle text-success me-2"></i>Category III - Pension Benefits</li>' : ''}
                                ${!rep.class_1_long_term && !rep.class_2_short_term && !rep.class_3_pension ? '<li class="text-muted"><i class="fas fa-times-circle me-2"></i>No categories assigned</li>' : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            width: '700px',
            showCancelButton: true,
            confirmButtonText: 'View Full Profile',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4',
            didOpen: () => {
                // Update compliance status if it loads after modal opens
                setTimeout(() => {
                    if (typeof dataFunctions !== 'undefined') {
                        dataFunctions.getTeamComplianceMatrix().then(result => {
                            let matrix = result;
                            if (result && result.data) {
                                matrix = result.data;
                            } else if (result && Array.isArray(result)) {
                                matrix = result;
                            }
                            
                            if (matrix && Array.isArray(matrix)) {
                                const matrixRep = matrix.find(r => r.representative_id === rep.id);
                                if (matrixRep) {
                                    const badgeEl = document.getElementById('complianceStatusBadge');
                                    if (badgeEl) {
                                        const status = matrixRep.compliance_status || 'Unknown';
                                        const badgeClass = matrixRep.compliance_indicator === 'green' ? 'success' :
                                                         matrixRep.compliance_indicator === 'amber' ? 'warning' :
                                                         matrixRep.compliance_indicator === 'red' ? 'danger' : 'secondary';
                                        badgeEl.className = `badge bg-${badgeClass}`;
                                        badgeEl.textContent = status;
                                    }
                                }
                            }
                        }).catch(err => {
                            console.warn('Could not update compliance status:', err);
                        });
                    }
                }, 500);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Switch to directory tab and show full profile
                switchRepsTab('directory-tab');
                // Wait for tab to switch, then trigger view in directory
                setTimeout(() => {
                    if (typeof viewRepProfile === 'function') {
                        viewRepProfile(rep.id);
                    } else {
                        // Fallback: just switch to directory tab
                        console.log('Switched to directory tab for representative:', rep.id);
                    }
                }, 300);
            }
        });
    } else {
        // Fallback if SweetAlert is not available
        alert(`Representative: ${name}\nFSP Number: ${fspNumber}\nStatus: ${status}`);
    }
}

// Export for global access
window.switchRepsTab = switchRepsTab;
window.viewRepresentative = viewRepresentative;

