// Client Dashboard JavaScript

let dashboardData = {
    clients: [],
    ficaStatus: null,
    stats: {
        total: 0,
        verified: 0,
        pending: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeClientDashboard();
});

async function initializeClientDashboard() {
    try {
        await loadDashboardData();
        updateDashboardStats();
        setupActivityFeed();
        setupAlerts();
    } catch (error) {
        console.error('Error initializing client dashboard:', error);
    }
}

/**
 * Load Dashboard Data from Database
 */
async function loadDashboardData() {
    try {
        // Check if dataFunctions is available
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available. Please ensure data-functions.js is loaded.');
        }
        
        // Get all clients
        const clientsResult = await dataFunctionsToUse.getClients();
        let clients = clientsResult;
        if (clientsResult && clientsResult.data) {
            clients = clientsResult.data;
        } else if (clientsResult && Array.isArray(clientsResult)) {
            clients = clientsResult;
        }
        
        dashboardData.clients = clients || [];
        
        // Get FICA status overview
        const ficaResult = await dataFunctionsToUse.getFicaStatusOverview();
        let ficaStatus = ficaResult;
        if (ficaResult && ficaResult.data) {
            ficaStatus = ficaResult.data;
        } else if (ficaResult && typeof ficaResult === 'object') {
            ficaStatus = ficaResult;
        }
        
        dashboardData.ficaStatus = ficaStatus;
        
        // Calculate stats
        calculateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        throw error;
    }
}

/**
 * Calculate Dashboard Statistics
 */
function calculateStats() {
    const clients = dashboardData.clients;
    const ficaStatus = dashboardData.ficaStatus;
    
    dashboardData.stats = {
        total: clients.length,
        verified: ficaStatus?.verified_count || 0,
        pending: ficaStatus?.pending_count || 0,
        highRisk: clients.filter(c => c.risk_category === 'high').length,
        mediumRisk: clients.filter(c => c.risk_category === 'medium').length,
        lowRisk: clients.filter(c => c.risk_category === 'low').length
    };
}

/**
 * Update Dashboard Statistics UI
 */
function updateDashboardStats() {
    const stats = dashboardData.stats;
    const ficaStatus = dashboardData.ficaStatus;
    
    // Update Total Clients
    const totalClientsEl = document.querySelector('#dashboard .stat-value.text-primary');
    if (totalClientsEl) {
        totalClientsEl.textContent = stats.total;
    }
    
    // Update FICA Compliance
    const ficaComplianceEl = document.querySelector('#dashboard .stat-value.text-success');
    if (ficaComplianceEl && stats.total > 0) {
        const percentage = Math.round((stats.verified / stats.total) * 100);
        ficaComplianceEl.textContent = `${percentage}%`;
        
        const sublabelEl = ficaComplianceEl.parentElement.querySelector('.stat-sublabel');
        if (sublabelEl) {
            sublabelEl.textContent = `${stats.verified} / ${stats.total} verified`;
        }
        
        const progressBar = ficaComplianceEl.closest('.stat-card').querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    // Update High Risk Clients
    const highRiskEl = document.querySelector('#dashboard .stat-value.text-danger');
    if (highRiskEl) {
        highRiskEl.textContent = stats.highRisk;
    }
    
    // Update Pending Verifications badge
    const pendingBadge = document.querySelector('#fica-verification-tab .badge');
    if (pendingBadge) {
        pendingBadge.textContent = stats.pending || 0;
        if (stats.pending === 0) {
            pendingBadge.classList.remove('bg-warning');
            pendingBadge.classList.add('bg-success');
        }
    }
}

function setupActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-outline-primary');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log('View activity details');
            });
        }
    });
}

function setupAlerts() {
    // Alert handling logic
    const alertButtons = document.querySelectorAll('.alert .btn');
    alertButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Alert action clicked');
        });
    });
}

function switchClientsFicaTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchClientsFicaTab = switchClientsFicaTab;

