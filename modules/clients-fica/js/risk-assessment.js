// Risk Assessment JavaScript

let riskData = {
    clients: [],
    stats: {
        low: 0,
        medium: 0,
        high: 0,
        avgRiskScore: 0
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when risk assessment tab is shown
    const riskTab = document.getElementById('risk-assessment-tab');
    if (riskTab) {
        riskTab.addEventListener('shown.bs.tab', function() {
            loadRiskAssessment();
        });
    }
});

/**
 * Load Risk Assessment Data
 */
async function loadRiskAssessment() {
    try {
        // Check if dataFunctions is available
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available. Please ensure data-functions.js is loaded.');
        }
        
        const clientsResult = await dataFunctionsToUse.getClients();
        let clients = clientsResult;
        if (clientsResult && clientsResult.data) {
            clients = clientsResult.data;
        } else if (clientsResult && Array.isArray(clientsResult)) {
            clients = clientsResult;
        }
        
        riskData.clients = clients || [];
        calculateRiskStats();
        renderRiskCharts();
        renderHighRiskClients();
    } catch (error) {
        console.error('Error loading risk assessment:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        
        const errorMessage = error.message || 'Failed to load risk assessment data';
        Swal.fire({
            icon: 'error',
            title: 'Error Loading Risk Assessment',
            html: `
                <p>${errorMessage}</p>
                <p class="small text-muted mt-2">Please check the browser console for more details.</p>
            `,
            confirmButtonText: 'OK'
        });
    }
}

/**
 * Calculate Risk Statistics
 */
function calculateRiskStats() {
    const clients = riskData.clients;
    
    riskData.stats = {
        low: clients.filter(c => c.risk_category === 'low').length,
        medium: clients.filter(c => c.risk_category === 'medium').length,
        high: clients.filter(c => c.risk_category === 'high').length,
        avgRiskScore: 0 // Would need risk score calculation
    };
    
    // Update UI
    const avgScoreEl = document.querySelector('#risk-assessment .h4');
    if (avgScoreEl) {
        avgScoreEl.textContent = riskData.stats.avgRiskScore.toFixed(1);
    }
    
    const eddClientsEl = document.querySelectorAll('#risk-assessment .h4')[1];
    if (eddClientsEl) {
        eddClientsEl.textContent = riskData.stats.high;
    }
}

/**
 * Render Risk Charts
 */
function renderRiskCharts() {
    const ctx = document.getElementById('riskDistributionChart');
    if (!ctx) return;
    
    const stats = riskData.stats;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low (SDD)', 'Standard (CDD)', 'High (EDD)'],
            datasets: [{
                data: [stats.low, stats.medium, stats.high],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Render High-Risk Clients
 */
function renderHighRiskClients() {
    const highRiskClients = riskData.clients.filter(c => c.risk_category === 'high');
    const container = document.querySelector('#risk-assessment tbody');
    if (!container) return;
    
    if (highRiskClients.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-check-circle text-success me-2"></i>
                    No high-risk clients found.
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = highRiskClients.map(client => {
        const name = client.client_type === 'corporate'
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        return `
            <tr>
                <td>${name}</td>
                <td>${client.id_number ? client.id_number.substring(0, 6) + '****' + client.id_number.substring(client.id_number.length - 3) : 'N/A'}</td>
                <td><span class="badge bg-danger">High (EDD)</span></td>
                <td>${client.pep_status ? '<span class="badge bg-danger">🚩 PEP</span>' : '<span class="badge bg-success">Clear</span>'}</td>
                <td>${client.client_since ? new Date(client.client_since).toLocaleDateString('en-ZA') : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewClientRiskDetails('${client.id}')">View Details</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewClientRiskDetails(clientId) {
    console.log('View client risk details:', clientId);
    // TODO: Implement risk details modal
}

// Export functions
window.loadRiskAssessment = loadRiskAssessment;
window.viewClientRiskDetails = viewClientRiskDetails;

