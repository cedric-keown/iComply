// Representative Directory JavaScript

let allRepresentatives = [];
let filteredRepresentatives = [];
let viewMode = 'cards'; // 'cards' or 'table'
let directoryKeyIndividuals = []; // Scoped to directory module

document.addEventListener('DOMContentLoaded', function() {
    initializeRepresentativeDirectory();
});

async function initializeRepresentativeDirectory() {
    await loadKeyIndividuals();
    await loadRepresentatives();
    setupFilters();
    setupViewModeToggle();
}

/**
 * Load Key Individuals for Supervisor Filter
 */
async function loadKeyIndividuals() {
    try {
        const result = await dataFunctions.getKeyIndividuals('active');
        let kis = result;
        if (result && result.data) {
            kis = result.data;
        } else if (result && Array.isArray(result)) {
            kis = result;
        }
        directoryKeyIndividuals = kis || [];
        populateSupervisorFilter();
    } catch (error) {
        console.error('Error loading key individuals for supervisor filter:', error);
        directoryKeyIndividuals = [];
    }
}

/**
 * Populate Supervisor Filter Dropdown
 */
function populateSupervisorFilter() {
    const supervisorFilter = document.getElementById('supervisorFilter');
    if (!supervisorFilter) return;
    
    // Clear existing options (keep "All Supervisors")
    while (supervisorFilter.options.length > 1) {
        supervisorFilter.remove(1);
    }
    
    directoryKeyIndividuals.forEach(ki => {
        const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
        const kiType = ki.ki_type === 'principal' ? 'Principal' : 
                      ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                      'Key Individual';
        const option = document.createElement('option');
        // Use representative_id for the value, as that's what supervised_by_ki_id references
        option.value = ki.representative_id || ki.id; // Fallback to ki.id if representative_id not available
        option.textContent = `${name} (${kiType})`;
        supervisorFilter.appendChild(option);
    });
}

/**
 * Show loading mask
 */
function showLoadingMask() {
    const container = document.getElementById('representativesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12">
            <div class="text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h5 class="text-muted">Loading Representatives...</h5>
                <p class="text-muted">Please wait while we fetch the data from the database</p>
            </div>
        </div>
    `;
}

/**
 * Load Representatives from Database
 */
async function loadRepresentatives() {
    try {
        // Show loading mask
        showLoadingMask();
        
        // Pass null to get ALL representatives regardless of status (active, suspended, terminated)
        const result = await dataFunctions.getRepresentatives(null);
        let reps = result;
        
        // Handle different response structures
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        if (reps && Array.isArray(reps)) {
            allRepresentatives = reps;
            filteredRepresentatives = reps;
            updateRepCount();
            renderRepresentatives();
        }
    } catch (error) {
        console.error('Error loading representatives:', error);
        
        // Hide loading mask and show error
        const container = document.getElementById('representativesContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Error loading representatives</strong>
                        <p class="mb-0 mt-2">Failed to fetch data from the database. Please try refreshing the page.</p>
                    </div>
                </div>
            `;
        }
        
        // Check if session expired before showing error
        if (typeof authService !== 'undefined' && authService.handleErrorWithSessionCheck) {
            await authService.handleErrorWithSessionCheck(error, {
                title: 'Error',
                message: 'Failed to load representatives'
            });
        } else {
            // Fallback if authService not available
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load representatives'
                });
            }
        }
    }
}

/**
 * Render Representatives (Cards or Table)
 */
function renderRepresentatives() {
    const container = document.getElementById('representativesContainer');
    if (!container) return;
    
    if (viewMode === 'table') {
        renderTableView();
    } else {
        renderCardsView();
    }
}

/**
 * Render Cards View
 * NOTE: Representative data (name, ID, status, etc.) is pulled from the database.
 * Compliance status indicators (F&P, CPD, FICA) can be populated via get_representative_compliance() function.
 * Currently showing placeholders for performance - click "View" for detailed compliance.
 */
function renderCardsView() {
    const container = document.getElementById('representativesContainer');
    if (!container) return;
    
    container.className = 'row representatives-container';
    container.innerHTML = '';
    
    if (filteredRepresentatives.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>No representatives found matching your filters.
                </div>
            </div>
        `;
        return;
    }
    
    filteredRepresentatives.forEach(rep => {
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        
        const statusBadge = rep.status === 'active' 
            ? '<span class="badge bg-success me-2">✅ ACTIVE</span>'
            : rep.status === 'suspended'
            ? '<span class="badge bg-warning me-2">⚠️ SUSPENDED</span>'
            : '<span class="badge bg-secondary me-2">❌ TERMINATED</span>';
        
        const compliantBadge = rep.is_debarred 
            ? '<span class="badge bg-danger">❌ DEBARRED</span>'
            : '<span class="badge bg-success">✅ COMPLIANT</span>';
        
        const joinDate = rep.onboarding_date 
            ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
            : 'N/A';
        
        // Get supervisor name
        const supervisor = getSupervisorName(rep.supervised_by_ki_id);
        
        card.innerHTML = `
            <div class="rep-card h-100">
                <div class="rep-card-header">
                    <div class="rep-photo">
                        <i class="fas fa-user fa-3x"></i>
                    </div>
                    <div class="rep-info">
                        <h5>${name}</h5>
                        <p class="text-muted mb-0">Representative</p>
                        ${statusBadge}
                        ${compliantBadge}
                    </div>
                </div>
                <div class="rep-card-body">
                    <p><strong>FSP Number:</strong> ${rep.representative_number || 'N/A'}</p>
                    <p><strong>ID:</strong> ${rep.id_number || 'N/A'}</p>
                    <p><strong>Join Date:</strong> ${joinDate}</p>
                    ${supervisor ? `<p><strong>Supervisor:</strong> ${supervisor}</p>` : ''}
                    <hr>
                    <p><strong>Compliance:</strong></p>
                    <ul class="list-unstyled">
                        <li>Fit & Proper: <span class="text-muted">—</span></li>
                        <li>CPD: <span class="text-muted">—</span></li>
                        <li>FICA: <span class="text-muted">—</span></li>
                        <li>Debarment: ${rep.is_debarred ? '❌ Debarred' : '✅ Clear'}</li>
                    </ul>
                    <small class="text-muted">Click "View" for detailed compliance status</small>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-primary" onclick="viewRepProfile('${rep.id}')">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="editRepProfile('${rep.id}')">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRep('${rep.id}')">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Render Table View
 */
function renderTableView() {
    const container = document.getElementById('representativesContainer');
    if (!container) return;
    
    container.className = 'col-12';
    container.innerHTML = '';
    
    if (filteredRepresentatives.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle me-2"></i>No representatives found matching your filters.
            </div>
        `;
        return;
    }
    
    const table = document.createElement('div');
    table.className = 'table-responsive';
    table.innerHTML = `
        <table class="table table-hover" id="representativesTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>FSP Number</th>
                    <th>ID Number</th>
                    <th>Status</th>
                    <th>Supervisor</th>
                    <th>Join Date</th>
                    <th>Debarment</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredRepresentatives.map(rep => {
                    const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                    const statusBadge = rep.status === 'active' 
                        ? '<span class="badge bg-success">Active</span>'
                        : rep.status === 'suspended'
                        ? '<span class="badge bg-warning">Suspended</span>'
                        : '<span class="badge bg-secondary">Terminated</span>';
                    const debarmentBadge = rep.is_debarred 
                        ? '<span class="badge bg-danger">Debarred</span>'
                        : '<span class="badge bg-success">Clear</span>';
                    const joinDate = rep.onboarding_date 
                        ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
                        : 'N/A';
                    const supervisor = getSupervisorName(rep.supervised_by_ki_id) || 'Unassigned';
                    
                    return `
                        <tr>
                            <td><strong>${name}</strong></td>
                            <td>${rep.representative_number || 'N/A'}</td>
                            <td>${rep.id_number || 'N/A'}</td>
                            <td>${statusBadge}</td>
                            <td>${supervisor}</td>
                            <td>${joinDate}</td>
                            <td>${debarmentBadge}</td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary" onclick="viewRepProfile('${rep.id}')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="editRepProfile('${rep.id}')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="deleteRep('${rep.id}')" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    container.appendChild(table);
}

/**
 * Get Supervisor Name by ID
 * Note: kiId is actually a representative ID (from representatives table), not a key_individuals.id
 */
function getSupervisorName(kiId) {
    if (!kiId) return null;
    // Find KI by representative_id (the representative that the KI is linked to)
    const ki = directoryKeyIndividuals.find(k => (k.representative_id || k.id) === kiId);
    if (!ki) return null;
    return ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
}

/**
 * Setup Filter Event Listeners
 */
function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const supervisorFilter = document.getElementById('supervisorFilter');
    const searchInput = document.getElementById('searchFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (supervisorFilter) {
        supervisorFilter.addEventListener('change', applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

/**
 * Setup View Mode Toggle
 */
function setupViewModeToggle() {
    // Add view mode toggle buttons if not exists
    const directoryTab = document.getElementById('directory');
    if (!directoryTab) return;
    
    const heading = directoryTab.querySelector('h2');
    if (heading && !directoryTab.querySelector('.view-mode-toggle')) {
        const toggle = document.createElement('div');
        toggle.className = 'view-mode-toggle mb-3 d-flex justify-content-end';
        toggle.innerHTML = `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary active" id="viewCardsBtn" onclick="setViewMode('cards')">
                    <i class="fas fa-th-large me-1"></i>Cards
                </button>
                <button type="button" class="btn btn-outline-primary" id="viewTableBtn" onclick="setViewMode('table')">
                    <i class="fas fa-table me-1"></i>Table
                </button>
            </div>
        `;
        heading.parentNode.insertBefore(toggle, heading.nextSibling);
    }
}

/**
 * Set View Mode
 */
function setViewMode(mode) {
    viewMode = mode;
    const cardsBtn = document.getElementById('viewCardsBtn');
    const tableBtn = document.getElementById('viewTableBtn');
    
    if (cardsBtn && tableBtn) {
        if (mode === 'cards') {
            cardsBtn.classList.add('active');
            tableBtn.classList.remove('active');
        } else {
            tableBtn.classList.add('active');
            cardsBtn.classList.remove('active');
        }
    }
    
    renderRepresentatives();
}

/**
 * Apply Filters
 */
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const supervisorFilter = document.getElementById('supervisorFilter');
    const searchInput = document.getElementById('searchFilter');
    
    let filtered = [...allRepresentatives];
    
    // Filter by status
    if (statusFilter && statusFilter.value !== 'All') {
        filtered = filtered.filter(r => r.status === statusFilter.value);
    }
    
    // Filter by category
    if (categoryFilter && categoryFilter.value !== 'All') {
        if (categoryFilter.value === 'class_1') {
            filtered = filtered.filter(r => r.class_1_long_term === true);
        } else if (categoryFilter.value === 'class_2') {
            filtered = filtered.filter(r => r.class_2_short_term === true);
        } else if (categoryFilter.value === 'class_3') {
            filtered = filtered.filter(r => r.class_3_pension === true);
        }
    }
    
    // Filter by supervisor
    if (supervisorFilter && supervisorFilter.value && supervisorFilter.value !== 'All Supervisors') {
        filtered = filtered.filter(r => r.supervised_by_ki_id === supervisorFilter.value);
    }
    
    // Filter by search
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(r => {
            const name = `${r.first_name || ''} ${r.surname || ''}`.toLowerCase();
            const idNumber = (r.id_number || '').toLowerCase();
            const repNumber = (r.representative_number || '').toLowerCase();
            return name.includes(searchTerm) || idNumber.includes(searchTerm) || repNumber.includes(searchTerm);
        });
    }
    
    filteredRepresentatives = filtered;
    updateRepCount();
    renderRepresentatives();
}

/**
 * Update Representative Count
 */
function updateRepCount() {
    const countEl = document.getElementById('repCount');
    if (countEl) {
        countEl.textContent = filteredRepresentatives.length;
    }
}

/**
 * View Representative Profile
 */
async function viewRepProfile(id) {
    try {
        let rep = allRepresentatives.find(r => r.id === id);
        
        // If rep not found in local array, try to fetch it
        if (!rep) {
            console.log('Representative not found in local array, fetching from API...');
            try {
                const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                    ? dataFunctions 
                    : (window.dataFunctions || window.parent?.dataFunctions);
                
                if (dataFunctionsToUse && dataFunctionsToUse.getRepresentative) {
                    const result = await dataFunctionsToUse.getRepresentative(id);
                    let repData = result;
                    if (result && result.data) {
                        repData = result.data;
                    } else if (result && typeof result === 'object') {
                        repData = result;
                    }
                    
                    if (repData) {
                        rep = repData;
                        // Add to local array for future use
                        if (!allRepresentatives.find(r => r.id === id)) {
                            allRepresentatives.push(rep);
                        }
                    }
                }
            } catch (fetchError) {
                console.error('Error fetching representative:', fetchError);
            }
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
        const supervisor = getSupervisorName(rep.supervised_by_ki_id);
        const joinDate = rep.onboarding_date 
            ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
            : 'N/A';
        const authDate = rep.authorization_date 
            ? new Date(rep.authorization_date).toLocaleDateString('en-ZA')
            : 'N/A';
        
        Swal.fire({
            title: name,
            html: `
                <div class="text-start">
                    <p><strong>Representative Number:</strong> ${rep.representative_number || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${rep.id_number || 'N/A'}</p>
                    <p><strong>Status:</strong> <span class="badge bg-${rep.status === 'active' ? 'success' : rep.status === 'suspended' ? 'warning' : 'secondary'}">${rep.status || 'N/A'}</span></p>
                    <p><strong>Onboarding Date:</strong> ${joinDate}</p>
                    <p><strong>Authorization Date:</strong> ${authDate}</p>
                    ${supervisor ? `<p><strong>Supervisor:</strong> ${supervisor}</p>` : '<p><strong>Supervisor:</strong> <span class="text-muted">Unassigned</span></p>'}
                    <hr>
                    <p><strong>Categories:</strong></p>
                    <ul>
                        ${rep.class_1_long_term ? '<li>Category I - Long-term Insurance</li>' : ''}
                        ${rep.class_2_short_term ? '<li>Category II - Short-term Insurance</li>' : ''}
                        ${rep.class_3_pension ? '<li>Category III - Pension Benefits</li>' : ''}
                        ${!rep.class_1_long_term && !rep.class_2_short_term && !rep.class_3_pension ? '<li class="text-muted">No categories assigned</li>' : ''}
                    </ul>
                    <hr>
                    <p><strong>Compliance Status:</strong></p>
                    <ul>
                        <li>Fit & Proper: <span class="text-muted">View Compliance Tab</span></li>
                        <li>CPD: <span class="text-muted">View CPD Module</span></li>
                        <li>FICA: <span class="text-muted">View FICA Module</span></li>
                        <li>Debarment: ${rep.is_debarred ? '❌ <span class="text-danger">Debarred</span>' : '✅ Clear'}</li>
                    </ul>
                    <small class="text-muted"><em>Note: Detailed compliance data available in respective modules</em></small>
                </div>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Edit',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                editRepProfile(id);
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

/**
 * Edit Representative Profile
 */
async function editRepProfile(id) {
    try {
        const rep = allRepresentatives.find(r => r.id === id);
        if (!rep) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Representative not found'
            });
            return;
        }
        
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        
        // Get supervisor options HTML
        // Note: supervised_by_ki_id references representatives.id, not key_individuals.id
        // So we need to use ki.representative_id (the representative ID that the KI is linked to)
        const supervisorOptions = directoryKeyIndividuals.map(ki => {
            const kiName = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            const kiType = ki.ki_type === 'principal' ? 'Principal' : 
                          ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                          'Key Individual';
            // Use representative_id for the value, as that's what supervised_by_ki_id references
            const kiRepId = ki.representative_id || ki.id; // Fallback to ki.id if representative_id not available
            // Compare with representative_id, not ki.id
            const selected = rep.supervised_by_ki_id === kiRepId ? 'selected' : '';
            return `<option value="${kiRepId}" ${selected}>${kiName} (${kiType})</option>`;
        }).join('');
        
        const { value: formValues } = await Swal.fire({
            title: `Edit ${name}`,
            html: `
                <div class="text-start">
                    <label class="form-label mt-3">Status</label>
                    <select id="editStatus" class="form-select">
                        <option value="active" ${rep.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="suspended" ${rep.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                        <option value="terminated" ${rep.status === 'terminated' ? 'selected' : ''}>Terminated</option>
                    </select>
                    
                    <label class="form-label mt-3">Supervisor</label>
                    <select id="editSupervisor" class="form-select">
                        <option value="">Unassigned</option>
                        ${supervisorOptions}
                    </select>
                    
                    <label class="form-label mt-3">Categories</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="editClass1" ${rep.class_1_long_term ? 'checked' : ''}>
                        <label class="form-check-label" for="editClass1">Category I - Long-term Insurance</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="editClass2" ${rep.class_2_short_term ? 'checked' : ''}>
                        <label class="form-check-label" for="editClass2">Category II - Short-term Insurance</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="editClass3" ${rep.class_3_pension ? 'checked' : ''}>
                        <label class="form-check-label" for="editClass3">Category III - Pension Benefits</label>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    status: document.getElementById('editStatus').value,
                    supervised_by_ki_id: document.getElementById('editSupervisor').value || null,
                    class_1_long_term: document.getElementById('editClass1').checked,
                    class_2_short_term: document.getElementById('editClass2').checked,
                    class_3_pension: document.getElementById('editClass3').checked
                };
            }
        });
        
        if (formValues) {
            await updateRepresentative(id, formValues);
        }
    } catch (error) {
        console.error('Error editing profile:', error);
    }
}

/**
 * Update Representative
 */
async function updateRepresentative(id, data) {
    try {
        Swal.fire({
            title: 'Updating...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const result = await dataFunctions.updateRepresentative(id, data);
        
        if (result && result.success !== false) {
            Swal.fire({
                title: 'Updated!',
                text: 'Representative has been updated successfully',
                icon: 'success',
                timer: 2000
            });
            
            // Reload representatives
            await loadRepresentatives();
        } else {
            throw new Error(result?.error || 'Failed to update');
        }
    } catch (error) {
        console.error('Error updating representative:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to update representative: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Delete Representative
 */
async function deleteRep(id) {
    const rep = allRepresentatives.find(r => r.id === id);
    const name = rep ? `${rep.first_name || ''} ${rep.surname || ''}`.trim() : 'this representative';
    
    if (typeof Swal === 'undefined') {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            await performDelete(id);
        }
        return;
    }
    
    const result = await Swal.fire({
        title: 'Delete Representative?',
        html: `Are you sure you want to delete <strong>${name}</strong>?<br><br>This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
    });
    
    if (result.isConfirmed) {
        await performDelete(id);
    }
}

async function performDelete(id) {
    try {
        Swal.fire({
            title: 'Deleting...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const result = await dataFunctions.deleteRepresentative(id);
        
        if (result && result.success !== false) {
            Swal.fire({
                title: 'Deleted!',
                text: 'Representative has been deleted successfully',
                icon: 'success',
                timer: 2000
            });
            
            // Reload representatives
            await loadRepresentatives();
        } else {
            throw new Error(result?.error || 'Failed to delete');
        }
    } catch (error) {
        console.error('Error deleting representative:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to delete representative: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Export Representatives
 */
function exportRepresentatives() {
    // Create CSV content
    const headers = ['Name', 'FSP Number', 'ID Number', 'Status', 'Supervisor', 'Join Date', 'Debarment Status'];
    const rows = filteredRepresentatives.map(rep => {
        const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
        const supervisor = getSupervisorName(rep.supervised_by_ki_id) || 'Unassigned';
        const joinDate = rep.onboarding_date 
            ? new Date(rep.onboarding_date).toLocaleDateString('en-ZA')
            : 'N/A';
        return [
            name,
            rep.representative_number || 'N/A',
            rep.id_number || 'N/A',
            rep.status || 'N/A',
            supervisor,
            joinDate,
            rep.is_debarred ? 'Debarred' : 'Clear'
        ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `representatives_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Refresh Representatives Data
 */
async function refreshRepresentatives() {
    await loadKeyIndividuals();
    await loadRepresentatives();
}

// Export for global access
window.viewRepProfile = viewRepProfile;
window.editRepProfile = editRepProfile;
window.deleteRep = deleteRep;
window.setViewMode = setViewMode;
window.exportRepresentatives = exportRepresentatives;
window.refreshRepresentatives = refreshRepresentatives;
