// Supervision Structure JavaScript

let supervisionData = {
    keyIndividuals: [],
    representatives: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when supervision tab is shown
    const supervisionTab = document.getElementById('supervision-tab');
    if (supervisionTab) {
        supervisionTab.addEventListener('shown.bs.tab', function() {
            loadSupervisionStructure();
        });
    }
});

/**
 * Load Supervision Structure Data
 */
async function loadSupervisionStructure() {
    try {
        // Load Key Individuals
        const kiResult = await dataFunctions.getKeyIndividuals('active');
        let kis = kiResult;
        if (kiResult && kiResult.data) {
            kis = kiResult.data;
        } else if (kiResult && Array.isArray(kiResult)) {
            kis = kiResult;
        }
        
        // Ensure we have an array
        if (!Array.isArray(kis)) {
            kis = [];
        }
        
        // Load Representatives
        const repResult = await dataFunctions.getRepresentatives('active');
        let reps = repResult;
        if (repResult && repResult.data) {
            reps = repResult.data;
        } else if (repResult && Array.isArray(repResult)) {
            reps = repResult;
        }
        
        supervisionData.keyIndividuals = kis || [];
        supervisionData.representatives = reps || [];
        
        renderSupervisionStructure();
    } catch (error) {
        console.error('Error loading supervision structure:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load supervision structure'
            });
        }
    }
}

/**
 * Render Supervision Structure
 */
function renderSupervisionStructure() {
    const container = document.getElementById('supervision');
    if (!container) return;
    
    // Find or create the structure container
    let structureContainer = container.querySelector('.supervision-structure-container');
    if (!structureContainer) {
        structureContainer = document.createElement('div');
        structureContainer.className = 'supervision-structure-container';
        const heading = container.querySelector('h2');
        if (heading && heading.nextSibling) {
            heading.parentNode.insertBefore(structureContainer, heading.nextSibling);
        } else {
            container.appendChild(structureContainer);
        }
    }
    
    structureContainer.innerHTML = '';
    
    if (supervisionData.keyIndividuals.length === 0) {
        structureContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>No Key Individuals found. Please add Key Individuals first.
            </div>
        `;
        return;
    }
    
    // Group representatives by supervisor
    // Note: supervised_by_ki_id references representatives.id (the KI's representative record), not key_individuals.id
    const repsBySupervisor = {};
    supervisionData.representatives.forEach(rep => {
        const kiRepresentativeId = rep.supervised_by_ki_id;
        if (kiRepresentativeId) {
            if (!repsBySupervisor[kiRepresentativeId]) {
                repsBySupervisor[kiRepresentativeId] = [];
            }
            repsBySupervisor[kiRepresentativeId].push(rep);
        }
    });
    
    // Render Key Individuals with their supervised representatives
    supervisionData.keyIndividuals.forEach(ki => {
        const kiCard = document.createElement('div');
        kiCard.className = 'card mb-4';
        
        const kiName = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
        const kiType = ki.ki_type === 'principal' ? 'Principal' : 
                      ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                      'Key Individual';
        
        // Use representative_id (the representative record ID) to match with supervised_by_ki_id
        const kiRepresentativeId = ki.representative_id || ki.id;
        const supervisedReps = repsBySupervisor[kiRepresentativeId] || [];
        const currentCount = ki.current_supervised_count || supervisedReps.length;
        const maxCount = ki.max_supervised_count || 0;
        const capacityPct = maxCount > 0 ? Math.round((currentCount / maxCount) * 100) : 0;
        const capacityClass = capacityPct >= 90 ? 'danger' : capacityPct >= 75 ? 'warning' : 'success';
        
        kiCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">
                        <i class="fas fa-user-tie me-2"></i>${kiName}
                        <span class="badge bg-primary ms-2">${kiType}</span>
                    </h5>
                </div>
                <div>
                    <span class="badge bg-${capacityClass}">
                        ${currentCount} / ${maxCount} (${capacityPct}%)
                    </span>
                </div>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <strong>Current Supervised:</strong> ${currentCount}
                    </div>
                    <div class="col-md-4">
                        <strong>Max Capacity:</strong> ${maxCount}
                    </div>
                    <div class="col-md-4">
                        <strong>Capacity:</strong> 
                        <span class="badge bg-${capacityClass}">${capacityPct}%</span>
                    </div>
                </div>
                
                ${supervisedReps.length > 0 ? `
                    <h6 class="mt-3 mb-2">Supervised Representatives (${supervisedReps.length}):</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Representative Number</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${supervisedReps.map(rep => {
                                    const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                    return `
                                        <tr>
                                            <td>${repName}</td>
                                            <td>${rep.representative_number || 'N/A'}</td>
                                            <td><span class="badge bg-success">${rep.status || 'active'}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary" onclick="viewRepProfile('${rep.id}')">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle me-2"></i>No representatives currently assigned to this supervisor.
                    </div>
                `}
            </div>
        `;
        
        structureContainer.appendChild(kiCard);
    });
    
    // Show unassigned representatives
    const unassignedReps = supervisionData.representatives.filter(rep => !rep.supervised_by_ki_id);
    if (unassignedReps.length > 0) {
        const unassignedCard = document.createElement('div');
        unassignedCard.className = 'card mb-4 border-warning';
        unassignedCard.innerHTML = `
            <div class="card-header bg-warning text-dark">
                <h5 class="mb-0">
                    <i class="fas fa-exclamation-triangle me-2"></i>Unassigned Representatives (${unassignedReps.length})
                </h5>
            </div>
            <div class="card-body">
                <p class="text-muted">These representatives need to be assigned to a Key Individual supervisor.</p>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Representative Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${unassignedReps.map(rep => {
                                const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                return `
                                    <tr>
                                        <td>${repName}</td>
                                        <td>${rep.representative_number || 'N/A'}</td>
                                        <td><span class="badge bg-success">${rep.status || 'active'}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="assignSupervisor('${rep.id}')">
                                                Assign Supervisor
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        structureContainer.appendChild(unassignedCard);
    }
}

/**
 * Assign Supervisor to Representative
 */
async function assignSupervisor(repId) {
    try {
        // Load Key Individuals for dropdown
        const kiResult = await dataFunctions.getKeyIndividuals('active');
        let kis = kiResult;
        if (kiResult && kiResult.data) {
            kis = kiResult.data;
        } else if (kiResult && Array.isArray(kiResult)) {
            kis = kiResult;
        }
        
        if (!Array.isArray(kis) || kis.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Supervisors Available',
                    text: 'No Key Individuals are available to assign as supervisors.'
                });
            }
            return;
        }
        
        // Build options HTML
        const options = kis.map(ki => {
            const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            const kiType = ki.ki_type === 'principal' ? 'Principal' : 
                          ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                          'Key Individual';
            const kiRepresentativeId = ki.representative_id || ki.id;
            return `<option value="${kiRepresentativeId}">${name} (${kiType})</option>`;
        }).join('');
        
        // Show modal with supervisor selection
        const { value: supervisorId } = await Swal.fire({
            title: 'Assign Supervisor',
            html: `
                <p>Select a Key Individual to supervise this representative:</p>
                <select id="supervisorSelect" class="form-select mt-3">
                    <option value="">-- No Supervisor (Unassign) --</option>
                    ${options}
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Assign',
            cancelButtonText: 'Cancel',
            didOpen: () => {
                const select = document.getElementById('supervisorSelect');
                if (select) {
                    select.focus();
                }
            },
            preConfirm: () => {
                const select = document.getElementById('supervisorSelect');
                return select ? select.value : null;
            }
        });
        
        if (supervisorId !== undefined) {
            // Update representative
            const updateData = {
                supervised_by_ki_id: supervisorId || null
            };
            
            Swal.fire({
                title: 'Updating...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const result = await dataFunctions.updateRepresentative(repId, updateData);
            
            if (result && result.success !== false && !result.error) {
                Swal.fire({
                    icon: 'success',
                    title: 'Supervisor Assigned',
                    text: 'The supervisor has been assigned successfully.',
                    timer: 2000
                });
                
                // Reload supervision structure
                await loadSupervisionStructure();
            } else {
                throw new Error(result?.error || 'Failed to assign supervisor');
            }
        }
    } catch (error) {
        console.error('Error assigning supervisor:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to assign supervisor'
        });
    }
}

/**
 * View Representative Profile
 * Works with supervision structure data
 */
async function viewRepProfile(id) {
    try {
        // Find representative in supervision data
        let rep = supervisionData.representatives.find(r => r.id === id);
        
        // If not found, try to load from API
        if (!rep) {
            const result = await dataFunctions.getRepresentatives('active');
            let reps = result;
            if (result && result.data) {
                reps = result.data;
            } else if (result && Array.isArray(result)) {
                reps = result;
            }
            rep = reps.find(r => r.id === id);
        }
        
        if (!rep) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Representative not found'
            });
            return;
        }
        
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        
        // Get supervisor name
        let supervisorName = 'Unassigned';
        if (rep.supervised_by_ki_id) {
            const ki = supervisionData.keyIndividuals.find(k => 
                (k.representative_id || k.id) === rep.supervised_by_ki_id
            );
            if (ki) {
                supervisorName = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            }
        }
        
        const joinDate = rep.onboarding_date 
            ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
            : 'N/A';
        const authDate = rep.authorization_date 
            ? new Date(rep.authorization_date).toLocaleDateString('en-ZA')
            : 'N/A';
        
        // Build categories list
        const categories = [];
        if (rep.class_1_long_term) categories.push('Category I - Long-term Insurance');
        if (rep.class_2_short_term) categories.push('Category II - Short-term Insurance');
        if (rep.class_3_pension) categories.push('Category III - Pension Benefits');
        
        Swal.fire({
            title: name,
            html: `
                <div class="text-start">
                    <p><strong>Representative Number:</strong> ${rep.representative_number || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${rep.id_number || 'N/A'}</p>
                    <p><strong>Status:</strong> <span class="badge bg-${rep.status === 'active' ? 'success' : rep.status === 'suspended' ? 'warning' : 'secondary'}">${rep.status || 'N/A'}</span></p>
                    <p><strong>Onboarding Date:</strong> ${joinDate}</p>
                    <p><strong>Authorization Date:</strong> ${authDate}</p>
                    <p><strong>Supervisor:</strong> ${supervisorName === 'Unassigned' ? '<span class="text-muted">Unassigned</span>' : supervisorName}</p>
                    <hr>
                    <p><strong>Categories:</strong></p>
                    <ul>
                        ${categories.length > 0 
                            ? categories.map(cat => `<li>${cat}</li>`).join('')
                            : '<li class="text-muted">No categories assigned</li>'
                        }
                    </ul>
                    <hr>
                    <p><strong>Compliance Status:</strong></p>
                    <ul>
                        <li>Fit & Proper: ✅ Current</li>
                        <li>CPD: ✅ Current</li>
                        <li>FICA: ✅ Verified</li>
                        <li>Debarment: ${rep.is_debarred ? '❌ <span class="text-danger">Debarred</span>' : '✅ Clear'}</li>
                    </ul>
                </div>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Edit',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                // Try to use edit function from representative-directory if available
                if (typeof window.editRepProfile === 'function') {
                    window.editRepProfile(id);
                } else {
                    // Fallback: Switch to directory tab
                    if (typeof switchRepsTab === 'function') {
                        switchRepsTab('directory-tab');
                        // Wait a bit for tab to load, then trigger edit
                        setTimeout(() => {
                            if (typeof window.editRepProfile === 'function') {
                                window.editRepProfile(id);
                            }
                        }, 500);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error viewing profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load representative profile'
        });
    }
}

// Export for global access
window.assignSupervisor = assignSupervisor;
window.viewRepProfile = viewRepProfile;

