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
        showDashboardLoading();
        await loadDashboardData();
        setupActivityFeed();
        setupComplianceMatrix();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    } finally {
        hideDashboardLoading();
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
            await calculateDashboardStats();
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
async function calculateDashboardStats() {
    // Calculate basic stats from representative data
    dashboardStats = {
        total: representativesData.length,
        active: representativesData.filter(r => r.status === 'active').length,
        suspended: representativesData.filter(r => r.status === 'suspended').length,
        terminated: representativesData.filter(r => r.status === 'terminated').length,
        compliant: 0,
        atRisk: 0,
        nonCompliant: 0
    };
    
    // Calculate actual compliance for each representative
    try {
        const compliancePromises = representativesData.map(async (rep) => {
            try {
                const complianceResult = await dataFunctions.getRepresentativeCompliance(rep.id);
                let compliance = complianceResult;
                if (complianceResult && complianceResult.data) {
                    compliance = complianceResult.data;
                }
                return compliance;
            } catch (err) {
                console.warn('Error calculating compliance for rep:', rep.id, err);
                return null;
            }
        });
        
        const complianceResults = await Promise.all(compliancePromises);
        
        // Count by compliance status
        complianceResults.forEach(compliance => {
            if (compliance && compliance.overall_status) {
                if (compliance.overall_status === 'compliant') {
                    dashboardStats.compliant++;
                } else if (compliance.overall_status === 'at_risk') {
                    dashboardStats.atRisk++;
                } else if (compliance.overall_status === 'non_compliant') {
                    dashboardStats.nonCompliant++;
                }
            }
        });
        
        await updateDashboardUI();
    } catch (error) {
        console.error('Error calculating compliance statistics:', error);
        // Fallback: assume active are compliant
        dashboardStats.compliant = dashboardStats.active;
        dashboardStats.atRisk = 0;
        dashboardStats.nonCompliant = dashboardStats.suspended + dashboardStats.terminated;
        await updateDashboardUI();
    }
}

/**
 * Update Dashboard UI with Real Data
 */
async function updateDashboardUI() {
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
        // TODO: Calculate from actual F&P data when available
        const fpIssues = dashboardStats.nonCompliant;
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
        // TODO: Calculate from actual CPD data when available
        const cpdIssues = dashboardStats.nonCompliant;
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
    await updateComplianceMatrix();
}

/**
 * Update Compliance Issues Widget (Reps Requiring Attention)
 */
async function updateComplianceMatrix() {
    // Find the compliance widget container
    const matrixCard = document.querySelector('#dashboard .card:has(.table)') ||
                       document.querySelector('#dashboard .compliance-matrix');
    
    if (!matrixCard) {
        console.warn('Compliance widget card not found');
        return;
    }
    
    // Update card title to reflect new purpose
    const cardHeader = matrixCard.querySelector('.card-header h5');
    if (cardHeader) {
        cardHeader.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Representatives Requiring Attention';
    }
    
    const tbody = matrixCard.querySelector('tbody');
    
    if (!tbody) {
        console.warn('Compliance table body not found');
        return;
    }
    
    // Get active representatives
    let activeReps = representativesData.filter(r => r.status === 'active');
    
    if (activeReps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No active representatives found</td></tr>';
        const existingPagination = matrixCard.querySelector('.card-footer');
        if (existingPagination) existingPagination.remove();
        return;
    }
    
    // Try to get bulk compliance data
    try {
        const bulkComplianceResult = await dataFunctions.getAllRepresentativesCompliance();
        let bulkCompliance = bulkComplianceResult;
        if (bulkComplianceResult && bulkComplianceResult.data) {
            bulkCompliance = bulkComplianceResult.data;
        }
        
        if (bulkCompliance && Array.isArray(bulkCompliance)) {
            // Enrich reps with compliance data
            activeReps = activeReps.map(rep => {
                const compliance = bulkCompliance.find(c => c.representative_id === rep.id);
                if (compliance && compliance.compliance_data) {
                    rep.compliance = compliance.compliance_data;
                    rep.overallStatus = compliance.compliance_data.overall_status || 'unknown';
                    rep.overallScore = compliance.compliance_data.overall_score || 0;
                    rep.fpStatus = compliance.compliance_data.fit_proper?.status || 'unknown';
                    rep.cpdStatus = compliance.compliance_data.cpd?.status || 'unknown';
                    rep.ficaStatus = compliance.compliance_data.fica?.status || 'unknown';
                }
                return rep;
            });
        }
    } catch (err) {
        console.warn('Could not load compliance data:', err);
    }
    
    // Filter to only show reps requiring attention (at-risk or non-compliant)
    const repsNeedingAttention = activeReps
        .filter(r => r.overallStatus === 'at_risk' || r.overallStatus === 'non_compliant')
        .sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0)); // Sort by score (worst first)
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    if (repsNeedingAttention.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <p class="mb-0 text-success"><strong>All representatives are compliant!</strong></p>
                    <small class="text-muted">No immediate attention required</small>
                </td>
            </tr>
        `;
        
        // Remove pagination if exists
        const existingPagination = matrixCard.querySelector('.card-footer');
        if (existingPagination) existingPagination.remove();
        return;
    }
    
    // Limit to top 10 requiring attention (no pagination needed - dashboard widget)
    const topIssues = repsNeedingAttention.slice(0, 10);
    
    // Render rows
    topIssues.forEach((rep) => {
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const score = Math.round(rep.overallScore || 0);
        const row = document.createElement('tr');
        
        // Row color based on severity
        const rowClass = rep.overallStatus === 'non_compliant' ? 'table-danger' : 'table-warning';
        row.className = rowClass;
        
        // Status badge
        const statusBadge = rep.overallStatus === 'non_compliant' ?
            '<span class="badge bg-danger">❌ Non-Compliant</span>' :
            '<span class="badge bg-warning text-dark">⚠️ At Risk</span>';
        
        // Issues list
        let issues = [];
        if (rep.fpStatus && rep.fpStatus !== 'compliant') issues.push('F&P');
        if (rep.cpdStatus && rep.cpdStatus !== 'completed') issues.push('CPD');
        if (rep.ficaStatus && rep.ficaStatus !== 'current') issues.push('FICA');
        const issuesText = issues.length > 0 ? issues.join(', ') : 'Various';
        
        row.innerHTML = `
            <td><strong>${escapeHtml(name)}</strong></td>
            <td><span class="badge bg-${score >= 60 ? 'warning' : 'danger'}">${score}%</span></td>
            <td>${statusBadge}</td>
            <td><small class="text-muted">${issuesText}</small></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="window.viewRepresentative && window.viewRepresentative('${rep.id}'); return false;" type="button">
                    <i class="fas fa-eye me-1"></i>View
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="alert('Send reminder to ${escapeHtml(name)}'); return false;" type="button">
                    <i class="fas fa-bell"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Remove pagination (not needed for top 10)
    const existingPagination = matrixCard.querySelector('.card-footer');
    if (existingPagination) existingPagination.remove();
    
    // Add footer with link to full compliance overview
    if (repsNeedingAttention.length > 10) {
        const footer = document.createElement('div');
        footer.className = 'card-footer bg-light text-center';
        footer.innerHTML = `
            <small class="text-muted">
                Showing top 10 of ${repsNeedingAttention.length} representatives requiring attention
            </small>
            <a href="#" onclick="switchRepsTab('compliance-tab'); return false;" class="btn btn-sm btn-link">
                View All in Compliance Overview <i class="fas fa-arrow-right ms-1"></i>
            </a>
        `;
        matrixCard.appendChild(footer);
    } else if (repsNeedingAttention.length > 0) {
        const footer = document.createElement('div');
        footer.className = 'card-footer bg-light text-center';
        footer.innerHTML = `
            <a href="#" onclick="switchRepsTab('compliance-tab'); return false;" class="btn btn-sm btn-link">
                View Full Compliance Matrix <i class="fas fa-arrow-right ms-1"></i>
            </a>
        `;
        matrixCard.appendChild(footer);
    }
    
    console.log(`Dashboard showing ${topIssues.length} representatives requiring attention (${repsNeedingAttention.length} total issues)`);
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

/**
 * Show Loading Mask
 */
function showDashboardLoading() {
    const container = document.getElementById('dashboard');
    if (!container) return;
    
    // Remove existing loading mask if any
    const existingMask = container.querySelector('.dashboard-loading-mask');
    if (existingMask) {
        existingMask.remove();
    }
    
    // Create loading mask
    const loadingMask = document.createElement('div');
    loadingMask.className = 'dashboard-loading-mask';
    loadingMask.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-3 text-primary fw-bold">Loading Dashboard Data...</div>
                <div class="text-muted small">Retrieving representatives and calculating compliance...</div>
            </div>
        </div>
    `;
    
    container.appendChild(loadingMask);
}

/**
 * Hide Loading Mask
 */
function hideDashboardLoading() {
    const container = document.getElementById('dashboard');
    if (!container) return;
    
    const loadingMask = container.querySelector('.dashboard-loading-mask');
    if (loadingMask) {
        loadingMask.remove();
    }
}

// Export for global access
window.switchRepsTab = switchRepsTab;
window.viewRepresentative = viewRepresentative;

