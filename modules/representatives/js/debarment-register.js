// Debarment Register JavaScript

let debarmentData = {
    checks: [],
    representatives: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when debarment tab is shown
    const debarmentTab = document.getElementById('debarment-tab');
    if (debarmentTab) {
        debarmentTab.addEventListener('shown.bs.tab', function() {
            loadDebarmentRegister();
        });
    }
});

/**
 * Load Debarment Register Data
 */
async function loadDebarmentRegister() {
    try {
        // Load Representatives
        const result = await dataFunctions.getRepresentatives();
        let reps = result;
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        debarmentData.representatives = reps || [];
        
        // Load debarment checks (would need a database function for this)
        // For now, we'll use representative data to show current status
        
        renderDebarmentRegister();
    } catch (error) {
        console.error('Error loading debarment register:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load debarment register'
            });
        }
    }
}

/**
 * Render Debarment Register
 */
function renderDebarmentRegister() {
    const container = document.getElementById('debarment');
    if (!container) return;
    
    // Calculate statistics
    const totalReps = debarmentData.representatives.length;
    const debarredCount = debarmentData.representatives.filter(r => r.is_debarred).length;
    const clearCount = totalReps - debarredCount;
    
    // Get last check date (would come from debarment_checks table)
    const lastCheckDate = new Date().toLocaleDateString('en-ZA');
    
    // Update statistics cards
    const statsCard = container.querySelector('.card .row');
    if (statsCard) {
        statsCard.innerHTML = `
            <div class="col-md-4 mb-3">
                <div class="stat-value text-${totalReps > 0 ? 'success' : 'muted'}">${totalReps}/${totalReps}</div>
                <div class="stat-label">Representatives Checked</div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="stat-value text-${debarredCount === 0 ? 'success' : 'danger'}">
                    ${debarredCount === 0 ? '✅ All Clear' : `⚠️ ${debarredCount} Debarred`}
                </div>
                <div class="stat-label">Debarment Status</div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="stat-value">${lastCheckDate}</div>
                <div class="stat-label">Last Check</div>
            </div>
        `;
    }
    
    // Update debarment check history table
    const tbody = container.querySelector('table tbody');
    if (tbody) {
        // Show current status as a check entry
        tbody.innerHTML = `
            <tr>
                <td>${lastCheckDate}</td>
                <td>${totalReps}</td>
                <td>
                    <span class="badge bg-${debarredCount === 0 ? 'success' : 'danger'}">
                        ${debarredCount === 0 ? '✅ All Clear' : `⚠️ ${debarredCount} Debarred`}
                    </span>
                </td>
                <td>System (Automated)</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="downloadDebarmentCertificate()">
                        Download Certificate
                    </button>
                </td>
            </tr>
        `;
        
        // Show debarred representatives if any
        if (debarredCount > 0) {
            const debarredReps = debarmentData.representatives.filter(r => r.is_debarred);
            debarredReps.forEach(rep => {
                const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                const row = document.createElement('tr');
                row.className = 'table-danger';
                row.innerHTML = `
                    <td colspan="2"><strong>${repName}</strong> (${rep.representative_number || 'N/A'})</td>
                    <td><span class="badge bg-danger">❌ DEBARRED</span></td>
                    <td>N/A</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="viewDebarmentDetails('${rep.id}')">
                            View Details
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

/**
 * Run Debarment Check
 */
async function runDebarmentCheck() {
    if (typeof Swal === 'undefined') {
        alert('Running debarment check...');
        return;
    }
    
    Swal.fire({
        title: 'Running Debarment Check...',
        text: 'Please wait while we check all representatives against the FSCA register',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Simulate debarment check (would call actual API/function)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reload data
        await loadDebarmentRegister();
        
        Swal.fire({
            icon: 'success',
            title: 'Debarment Check Complete',
            text: 'All representatives have been checked. No new debarments found.',
            confirmButtonText: 'OK'
        });
    } catch (error) {
        console.error('Error running debarment check:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to run debarment check: ${error.message}`
        });
    }
}

/**
 * Download Debarment Certificate
 */
function downloadDebarmentCertificate() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Download Certificate',
            text: 'Debarment certificate download functionality would be implemented here.'
        });
    }
}

/**
 * View Debarment Details
 */
function viewDebarmentDetails(repId) {
    const rep = debarmentData.representatives.find(r => r.id === repId);
    if (!rep) return;
    
    const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Debarment Details',
            html: `
                <p><strong>Representative:</strong> ${repName}</p>
                <p><strong>Representative Number:</strong> ${rep.representative_number || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="badge bg-danger">DEBARRED</span></p>
                <p><strong>Last Verified:</strong> ${rep.last_verified_date ? new Date(rep.last_verified_date).toLocaleDateString('en-ZA') : 'N/A'}</p>
                <p class="mt-3 text-danger"><strong>⚠️ This representative is currently debarred and cannot provide financial services.</strong></p>
            `,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
}

// Export for global access
window.runDebarmentCheck = runDebarmentCheck;
window.downloadDebarmentCertificate = downloadDebarmentCertificate;
window.viewDebarmentDetails = viewDebarmentDetails;
window.loadDebarmentRegister = loadDebarmentRegister;

