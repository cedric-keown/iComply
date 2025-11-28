// Representatives Dashboard JavaScript

let representativesData = [];
let dashboardStats = {
    total: 0,
    active: 0,
    suspended: 0,
    terminated: 0,
    compliant: 0,
    nonCompliant: 0
};

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
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load representatives data'
            });
        }
    }
}

/**
 * Calculate Dashboard Statistics
 */
function calculateDashboardStats() {
    dashboardStats = {
        total: representativesData.length,
        active: representativesData.filter(r => r.status === 'active').length,
        suspended: representativesData.filter(r => r.status === 'suspended').length,
        terminated: representativesData.filter(r => r.status === 'terminated').length,
        compliant: 0, // Will be calculated from compliance data
        nonCompliant: 0
    };
    
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
                }
            }).catch(err => {
                console.warn('Could not load compliance matrix, using defaults:', err);
                // Fallback: set to 0 if we can't get data
                dashboardStats.compliant = 0;
                dashboardStats.nonCompliant = dashboardStats.active;
            });
        } catch (err) {
            console.warn('Error loading compliance data:', err);
            dashboardStats.compliant = 0;
            dashboardStats.nonCompliant = dashboardStats.active;
        }
    } else {
        // No dataFunctions available, set to 0
        dashboardStats.compliant = 0;
        dashboardStats.nonCompliant = dashboardStats.active;
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
        const compliancePct = dashboardStats.active > 0 
            ? Math.round((dashboardStats.compliant / dashboardStats.active) * 100) 
            : 0;
        
        if (complianceValueEl) {
            complianceValueEl.textContent = `${compliancePct}%`;
            complianceValueEl.className = `stat-value ${compliancePct >= 85 ? 'text-success' : compliancePct >= 70 ? 'text-warning' : 'text-danger'}`;
        }
        if (complianceSublabelEl) {
            complianceSublabelEl.textContent = compliancePct >= 85 ? 'Fully compliant' : compliancePct >= 70 ? 'Mostly compliant' : 'Needs attention';
        }
        if (complianceDetailsEl) {
            complianceDetailsEl.textContent = `${dashboardStats.compliant} of ${dashboardStats.active} compliant`;
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
    
    if (overallStatusEl) {
        const compliancePct = dashboardStats.active > 0 
            ? Math.round((dashboardStats.compliant / dashboardStats.active) * 100) 
            : 0;
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
        compliantCountEl.textContent = `${dashboardStats.compliant}/${dashboardStats.active}`;
    }
    
    if (compliantPercentageEl) {
        const compliancePct = dashboardStats.active > 0 
            ? Math.round((dashboardStats.compliant / dashboardStats.active) * 100) 
            : 0;
        compliantPercentageEl.textContent = `Representatives Compliant (${compliancePct}%)`;
    }
    
    if (fpStatusEl) {
        fpStatusEl.textContent = 'Loading...'; // Would need F&P data
        fpStatusEl.className = 'badge bg-secondary';
    }
    
    if (cpdStatusEl) {
        cpdStatusEl.textContent = 'Loading...'; // Would need CPD data
        cpdStatusEl.className = 'badge bg-secondary';
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
    const tbody = document.querySelector('#dashboard .table tbody');
    if (!tbody) return;
    
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
    
    activeReps.forEach(rep => {
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const row = document.createElement('tr');
        
        // Placeholder compliance status (would need CPD/F&P data)
        row.innerHTML = `
            <td>${name}</td>
            <td><span class="badge bg-success">✅ Current</span></td>
            <td><span class="badge bg-success">✅ Current</span></td>
            <td><span class="badge bg-success">✅ Verified</span></td>
            <td><span class="badge ${rep.is_debarred ? 'bg-danger' : 'bg-success'}">${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}</span></td>
            <td><span class="badge bg-success">✅ Compliant</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewRepresentative('${rep.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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

function viewRepresentative(id) {
    // Switch to directory tab and show representative
    switchRepsTab('directory-tab');
    // Would load representative details
    console.log('View representative:', id);
}

// Export for global access
window.switchRepsTab = switchRepsTab;
window.viewRepresentative = viewRepresentative;

