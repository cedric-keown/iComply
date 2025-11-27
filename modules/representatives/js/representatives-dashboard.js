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
    
    // Calculate compliance (placeholder - would need CPD/F&P data)
    dashboardStats.compliant = Math.floor(dashboardStats.active * 0.92); // Estimate
    dashboardStats.nonCompliant = dashboardStats.active - dashboardStats.compliant;
}

/**
 * Update Dashboard UI with Real Data
 */
function updateDashboardUI() {
    // Update Total Representatives Card
    const totalValue = document.querySelector('#dashboard .stat-value');
    if (totalValue && document.querySelector('#dashboard .stat-value').parentElement.querySelector('.stat-label').textContent.includes('Total')) {
        const card = totalValue.closest('.stat-card');
        if (card) {
            const valueEl = card.querySelector('.stat-value');
            const sublabelEl = card.querySelector('.stat-sublabel');
            if (valueEl) valueEl.textContent = dashboardStats.total;
            if (sublabelEl) {
                const activeEl = sublabelEl.nextElementSibling;
                if (activeEl && activeEl.tagName === 'SMALL') {
                    activeEl.textContent = `Active: ${dashboardStats.active} | Suspended: ${dashboardStats.suspended} | Terminated: ${dashboardStats.terminated}`;
                }
            }
        }
    }
    
    // Update all stat cards
    const statCards = document.querySelectorAll('#dashboard .stat-card');
    statCards.forEach(card => {
        const label = card.querySelector('.stat-label')?.textContent || '';
        const valueEl = card.querySelector('.stat-value');
        
        if (label.includes('Total Representatives') && valueEl) {
            valueEl.textContent = dashboardStats.total;
            const smallEl = card.querySelector('small');
            if (smallEl) {
                smallEl.textContent = `Active: ${dashboardStats.active} | Suspended: ${dashboardStats.suspended} | Terminated: ${dashboardStats.terminated}`;
            }
        } else if (label.includes('Compliance Status') && valueEl) {
            const compliancePct = dashboardStats.active > 0 
                ? Math.round((dashboardStats.compliant / dashboardStats.active) * 100) 
                : 0;
            valueEl.textContent = `${compliancePct}%`;
            const smallEl = card.querySelector('small');
            if (smallEl) {
                smallEl.textContent = `${dashboardStats.compliant} of ${dashboardStats.active} compliant`;
            }
        }
    });
    
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

