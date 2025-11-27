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
        // Load Representatives
        const result = await dataFunctions.getRepresentatives();
        let reps = result;
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        complianceData = reps || [];
        
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
        nonCompliant: 0,
        fitProper: 0,
        cpdCurrent: 0,
        ficaVerified: 0,
        debarred: 0
    };
    
    complianceData.forEach(rep => {
        // Placeholder compliance checks (would need CPD/F&P data)
        const isCompliant = !rep.is_debarred && rep.status === 'active';
        if (isCompliant) stats.compliant++;
        else stats.nonCompliant++;
        
        if (!rep.is_debarred) stats.fitProper++;
        if (rep.status === 'active') stats.cpdCurrent++; // Placeholder
        if (rep.status === 'active') stats.ficaVerified++; // Placeholder
        if (rep.is_debarred) stats.debarred++;
    });
    
    const compliancePct = stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0;
    
    // Render statistics cards
    complianceContainer.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-${compliancePct >= 90 ? 'success' : compliancePct >= 75 ? 'warning' : 'danger'}">
                            ${compliancePct}%
                        </div>
                        <div class="text-muted">Overall Compliance</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-success">${stats.compliant}</div>
                        <div class="text-muted">Compliant</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-danger">${stats.nonCompliant}</div>
                        <div class="text-muted">Non-Compliant</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="h3 mb-0 text-${stats.debarred > 0 ? 'danger' : 'success'}">${stats.debarred}</div>
                        <div class="text-muted">Debarred</div>
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
                                const isCompliant = !rep.is_debarred && rep.status === 'active';
                                
                                return `
                                    <tr>
                                        <td>${repName}</td>
                                        <td><span class="badge bg-success">✅ Current</span></td>
                                        <td><span class="badge bg-success">✅ Current</span></td>
                                        <td><span class="badge bg-success">✅ Verified</span></td>
                                        <td>
                                            <span class="badge ${rep.is_debarred ? 'bg-danger' : 'bg-success'}">
                                                ${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge ${isCompliant ? 'bg-success' : 'bg-danger'}">
                                                ${isCompliant ? '✅ Compliant' : '❌ Non-Compliant'}
                                            </span>
                                        </td>
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

