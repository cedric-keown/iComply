// Team Compliance Matrix JavaScript

// Representatives Data (loaded from database)
let representativesData = [];

let filteredData = [...representativesData];
let selectedReps = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadRepresentativesData();
    setupEventListeners();
    
    // Auto-refresh every 2 minutes
    setInterval(() => {
        updateLastUpdated();
        loadRepresentativesData(); // Reload data on refresh
    }, 120000);
});

/**
 * Load Representatives Data from Database
 */
async function loadRepresentativesData() {
    try {
        // Get all representatives
        const result = await dataFunctions.getRepresentatives(null); // Get all statuses
        let reps = result;
        
        // Handle different response structures
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        if (reps && Array.isArray(reps) && reps.length > 0) {
            // Enrich with user profile data and compliance info
            representativesData = await Promise.all(reps.map(async (rep, index) => {
                try {
                    // Get user profile for name
                    if (rep.user_profile_id) {
                        const profileResult = await dataFunctions.getUserProfile(rep.user_profile_id);
                        if (profileResult && profileResult.data) {
                            rep.first_name = profileResult.data.first_name;
                            rep.surname = profileResult.data.surname;
                            rep.email = profileResult.data.email;
                        } else if (profileResult && profileResult.first_name) {
                            rep.first_name = profileResult.first_name;
                            rep.surname = profileResult.surname;
                            rep.email = profileResult.email;
                        }
                    }
                    
                    // Format data for display
                    rep.name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                    rep.initials = `${(rep.first_name || 'U')[0]}${(rep.surname || 'N')[0]}`.toUpperCase();
                    rep.fscar = rep.fsp_number || 'N/A';
                    rep.role = 'Financial Advisor'; // Would come from user profile or role table
                    rep.supervisor = 'Unknown'; // Would come from KI assignment
                    rep.employmentStatus = rep.status;
                    
                    // TODO: These should be calculated from actual CPD, F&P, FICA data
                    rep.fpStatus = rep.status === 'active' ? 'compliant' : 'non-compliant';
                    rep.fpDetails = {
                        re5: { valid: rep.status === 'active', expiry: 'N/A' },
                        re1: { valid: rep.status === 'active', expiry: 'N/A' }
                    };
                    rep.cpdHours = 0;
                    rep.cpdRequired = 18;
                    rep.cpdEthics = 0;
                    rep.cpdStatus = 'pending';
                    rep.cpdLastActivity = 'N/A';
                    rep.ficaTotal = 0;
                    rep.ficaCurrent = 0;
                    rep.ficaOverdue = 0;
                    rep.ficaStatus = 'current';
                    rep.docsTotal = 0;
                    rep.docsCurrent = 0;
                    rep.docsExpired = 0;
                    rep.docsStatus = 'current';
                    rep.overallScore = rep.status === 'active' ? 100 : 0;
                    rep.overallStatus = rep.status === 'active' ? 'compliant' : 'non-compliant';
                    rep.lastUpdated = new Date(rep.updated_at || rep.created_at).toLocaleString('en-ZA');
                    rep.updatedBy = 'System';
                    rep.trend = '→';
                    rep.id = index + 1; // Temporary ID for display
                    
                    return rep;
                } catch (err) {
                    console.warn('Error enriching representative data:', err);
                    return rep;
                }
            }));
            
            initializeMatrix();
            updateLastUpdated();
        } else {
            representativesData = [];
            initializeMatrix();
            updateLastUpdated();
            console.log('No representatives found in database');
        }
    } catch (error) {
        console.error('Error loading representatives data:', error);
        representativesData = [];
        initializeMatrix();
        updateLastUpdated();
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'No representatives data available. Please add representatives to see compliance matrix.'
            });
        }
    }
}

function initializeMatrix() {
    renderMatrix();
    initializeTooltips();
}

function renderMatrix() {
    const tbody = document.getElementById('matrixBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredData.forEach(rep => {
        const row = createMatrixRow(rep);
        tbody.appendChild(row);
    });
    
    updateSelectedCount();
}

function createMatrixRow(rep) {
    const tr = document.createElement('tr');
    tr.dataset.repId = rep.id;
    tr.dataset.status = rep.overallStatus;
    
    // Checkbox
    const tdCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input rep-checkbox';
    checkbox.dataset.repId = rep.id;
    checkbox.addEventListener('change', handleCheckboxChange);
    tdCheckbox.appendChild(checkbox);
    tr.appendChild(tdCheckbox);
    
    // Representative
    const tdRep = document.createElement('td');
    tdRep.innerHTML = createRepColumn(rep);
    tr.appendChild(tdRep);
    
    // Fit & Proper
    const tdFP = document.createElement('td');
    tdFP.innerHTML = createFPColumn(rep);
    tr.appendChild(tdFP);
    
    // CPD
    const tdCPD = document.createElement('td');
    tdCPD.innerHTML = createCPDColumn(rep);
    tr.appendChild(tdCPD);
    
    // FICA
    const tdFICA = document.createElement('td');
    tdFICA.innerHTML = createFICAColumn(rep);
    tr.appendChild(tdFICA);
    
    // Documents
    const tdDocs = document.createElement('td');
    tdDocs.innerHTML = createDocsColumn(rep);
    tr.appendChild(tdDocs);
    
    // Overall Status
    const tdOverall = document.createElement('td');
    tdOverall.innerHTML = createOverallColumn(rep);
    tr.appendChild(tdOverall);
    
    // Last Updated
    const tdUpdated = document.createElement('td');
    tdUpdated.innerHTML = createUpdatedColumn(rep);
    tr.appendChild(tdUpdated);
    
    // Actions
    const tdActions = document.createElement('td');
    tdActions.innerHTML = createActionsColumn(rep);
    tr.appendChild(tdActions);
    
    // Make row clickable
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', (e) => {
        if (!e.target.closest('input, button, .dropdown')) {
            showRepDetails(rep);
        }
    });
    
    return tr;
}

function createRepColumn(rep) {
    const avatarClass = rep.employmentStatus === 'suspended' ? 'bg-danger border-danger' : 
                       rep.overallStatus === 'compliant' ? 'bg-success' : 
                       rep.overallStatus === 'at-risk' ? 'bg-warning' : 'bg-danger';
    const nameClass = rep.overallStatus === 'non-compliant' ? 'text-danger' : '';
    
    return `
        <div class="rep-info">
            <div class="rep-avatar ${avatarClass} ${rep.employmentStatus === 'suspended' ? 'border-danger' : ''}">
                ${rep.initials}
            </div>
            <div class="rep-details">
                <div class="rep-name ${nameClass}">${rep.name}</div>
                <div class="rep-meta">
                    <span class="badge-role">${rep.role}</span>
                    ${rep.employmentStatus === 'suspended' ? '<span class="badge-suspended ms-1">🔴 SUSPENDED</span>' : ''}
                    <div class="mt-1">${rep.email}</div>
                    <div>FSCAR: ${rep.fscar}</div>
                    <div><span class="badge-ki">KI: ${rep.supervisor}</span></div>
                </div>
            </div>
        </div>
    `;
}

function createFPColumn(rep) {
    let icon, statusClass, statusText;
    
    if (rep.fpStatus === 'compliant') {
        icon = '<i class="fas fa-check-circle"></i>';
        statusClass = 'text-success';
        statusText = 'COMPLIANT';
    } else if (rep.fpStatus === 'non-compliant') {
        icon = '<i class="fas fa-times-circle pulse"></i>';
        statusClass = 'text-danger';
        statusText = 'NON-COMPLIANT';
    } else {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        statusClass = 'text-warning';
        statusText = 'WARNING';
    }
    
    return `
        <div class="status-icon ${statusClass}" data-bs-toggle="tooltip" title="Fit & Proper Status">
            ${icon}
        </div>
        <div class="text-center mt-1">
            <small class="${statusClass}">${statusText}</small>
        </div>
    `;
}

function createCPDColumn(rep) {
    const percentage = Math.round((rep.cpdHours / rep.cpdRequired) * 100);
    const barClass = percentage >= 100 ? 'bg-success' : percentage >= 67 ? 'bg-warning' : 'bg-danger';
    const textClass = percentage >= 100 ? 'text-success' : percentage >= 67 ? 'text-warning' : 'text-danger';
    const statusBadge = rep.cpdStatus === 'completed' ? 
        '<span class="cpd-badge bg-success text-white">COMPLETED ✓</span>' :
        rep.cpdStatus === 'in-progress' ?
        '<span class="cpd-badge bg-warning text-dark">IN PROGRESS ⚠️</span>' :
        '<span class="cpd-badge bg-danger text-white">BEHIND ✗</span>';
    
    const ethicsStatus = rep.cpdEthics >= 3 ? 
        `<span class="text-success">${rep.cpdEthics} hrs ✓</span>` :
        `<span class="text-danger">${rep.cpdEthics} hrs ✗</span>`;
    
    return `
        <div class="cpd-progress">
            <div class="cpd-hours ${textClass}">${rep.cpdHours} / ${rep.cpdRequired} hrs</div>
            <div class="cpd-bar">
                <div class="cpd-bar-fill ${barClass}" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="cpd-meta">
                ${percentage}% • Ethics: ${ethicsStatus}
            </div>
            <div class="mt-1">${statusBadge}</div>
        </div>
    `;
}

function createFICAColumn(rep) {
    const percentage = Math.round((rep.ficaCurrent / rep.ficaTotal) * 100);
    let icon, statusClass, statusText;
    
    if (rep.ficaStatus === 'current') {
        icon = '<i class="fas fa-check-circle"></i>';
        statusClass = 'text-success';
        statusText = 'All current';
    } else if (rep.ficaOverdue > 5) {
        icon = '<i class="fas fa-times-circle"></i>';
        statusClass = 'text-danger';
        statusText = `${rep.ficaOverdue} overdue`;
    } else {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        statusClass = 'text-warning';
        statusText = `${rep.ficaOverdue} overdue`;
    }
    
    return `
        <div class="text-center">
            <div class="status-icon ${statusClass}">${icon}</div>
            <div class="fw-bold mt-1">${rep.ficaCurrent} / ${rep.ficaTotal}</div>
            <div class="small ${statusClass}">${statusText}</div>
        </div>
    `;
}

function createDocsColumn(rep) {
    const percentage = Math.round((rep.docsCurrent / rep.docsTotal) * 100);
    let icon, statusClass, statusText;
    
    if (rep.docsStatus === 'current') {
        icon = '<i class="fas fa-check-circle"></i>';
        statusClass = 'text-success';
        statusText = 'All current';
    } else if (rep.docsStatus === 'expired') {
        icon = '<i class="fas fa-times-circle"></i>';
        statusClass = 'text-danger';
        statusText = `${rep.docsExpired} expired`;
    } else {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        statusClass = 'text-warning';
        statusText = `${rep.docsTotal - rep.docsCurrent} issues`;
    }
    
    return `
        <div class="text-center">
            <div class="status-icon ${statusClass}">${icon}</div>
            <div class="fw-bold mt-1">${rep.docsCurrent} / ${rep.docsTotal}</div>
            <div class="small ${statusClass}">${statusText}</div>
        </div>
    `;
}

function createOverallColumn(rep) {
    const scoreClass = rep.overallScore >= 80 ? 'text-success' : 
                      rep.overallScore >= 60 ? 'text-warning' : 'text-danger';
    const statusBadgeClass = rep.overallStatus === 'compliant' ? 'compliant' :
                            rep.overallStatus === 'at-risk' ? 'at-risk' : 'non-compliant';
    const trendClass = rep.trend.startsWith('+') ? 'text-success' : 
                      rep.trend.startsWith('-') ? 'text-danger' : 'text-muted';
    
    return `
        <div class="overall-score">
            <div class="score-value ${scoreClass}">${rep.overallScore}%</div>
            <div class="status-badge ${statusBadgeClass}">${rep.overallStatus === 'compliant' ? '✓' : rep.overallStatus === 'at-risk' ? '⚠️' : '✗'} ${rep.overallStatus.toUpperCase().replace('-', ' ')}</div>
            <div class="score-trend ${trendClass}">${rep.trend}</div>
        </div>
    `;
}

function createUpdatedColumn(rep) {
    return `
        <div>
            <div class="fw-bold">${rep.lastUpdated.split(' ')[0]}</div>
            <div class="small text-muted">${rep.lastUpdated.split(' ')[1]}</div>
            <div class="small text-muted">${rep.updatedBy}</div>
        </div>
    `;
}

function createActionsColumn(rep) {
    const urgentBtn = rep.overallStatus === 'non-compliant' ? 
        '<button class="btn btn-sm btn-urgent" onclick="event.stopPropagation(); handleUrgentAction(' + rep.id + ')">🚨 URGENT</button>' : '';
    
    return `
        <div class="action-buttons">
            ${urgentBtn}
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showRepDetails(${rep.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); sendMessage(${rep.id})">
                <i class="fas fa-envelope"></i>
            </button>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); sendReminder(${rep.id})">Send Reminder</a></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); generateReport(${rep.id})">Generate Report</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); viewAuditLog(${rep.id})">View Audit Log</a></li>
                </ul>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
    document.getElementById('clearSearch')?.addEventListener('click', clearSearch);
    
    // Filters
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('cpdFilter')?.addEventListener('change', applyFilters);
    document.getElementById('ficaFilter')?.addEventListener('change', applyFilters);
    document.getElementById('supervisorFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    
    // Sort
    document.getElementById('sortBy')?.addEventListener('change', handleSort);
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const sortField = e.target.dataset.sort;
            sortByField(sortField);
        });
    });
    
    // Select All
    document.getElementById('selectAll')?.addEventListener('change', handleSelectAll);
    
    // Summary Cards
    document.querySelectorAll('.summary-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const filter = card.dataset.filter;
            if (filter) {
                applyCardFilter(filter);
            }
        });
    });
    
    // Action Buttons
    document.getElementById('generateReportBtn')?.addEventListener('click', generateTeamReport);
    document.getElementById('bulkReminderBtn')?.addEventListener('click', showBulkReminderModal);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportToExcel);
    document.getElementById('printMatrixBtn')?.addEventListener('click', printMatrix);
    document.getElementById('refreshIcon')?.addEventListener('click', refreshData);
    
    // Bulk Actions
    document.getElementById('bulkReminderBtn')?.addEventListener('click', showBulkReminderModal);
    document.getElementById('bulkReportBtn')?.addEventListener('click', generateBulkReport);
    document.getElementById('bulkExportBtn')?.addEventListener('click', exportSelected);
    document.getElementById('bulkAssignBtn')?.addEventListener('click', assignSupervisor);
    document.getElementById('bulkMarkReviewedBtn')?.addEventListener('click', markAsReviewed);
    document.getElementById('cancelSelectionBtn')?.addEventListener('click', cancelSelection);
    document.getElementById('selectAllLink')?.addEventListener('click', selectAllReps);
    document.getElementById('deselectAllLink')?.addEventListener('click', deselectAllReps);
    
    // Expand/Collapse
    document.getElementById('expandAllBtn')?.addEventListener('click', expandAllRows);
    document.getElementById('collapseAllBtn')?.addEventListener('click', collapseAllRows);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const clearBtn = document.getElementById('clearSearch');
    
    if (query) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    applyFilters();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    applyFilters();
}

function applyFilters() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const cpdFilter = document.getElementById('cpdFilter').value;
    const ficaFilter = document.getElementById('ficaFilter').value;
    const supervisorFilter = document.getElementById('supervisorFilter').value;
    
    filteredData = representativesData.filter(rep => {
        // Search
        if (searchQuery && !rep.name.toLowerCase().includes(searchQuery) && 
            !rep.email.toLowerCase().includes(searchQuery) && 
            !rep.fscar.includes(searchQuery)) {
            return false;
        }
        
        // Status Filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'compliant' && rep.overallStatus !== 'compliant') return false;
            if (statusFilter === 'at-risk' && rep.overallStatus !== 'at-risk') return false;
            if (statusFilter === 'non-compliant' && rep.overallStatus !== 'non-compliant') return false;
        }
        
        // CPD Filter
        if (cpdFilter !== 'all') {
            if (cpdFilter === 'completed' && rep.cpdStatus !== 'completed') return false;
            if (cpdFilter === 'in-progress' && rep.cpdStatus !== 'in-progress') return false;
            if (cpdFilter === 'behind' && rep.cpdStatus !== 'behind') return false;
        }
        
        // FICA Filter
        if (ficaFilter !== 'all') {
            if (ficaFilter === 'current' && rep.ficaStatus !== 'current') return false;
            if (ficaFilter === 'some-overdue' && rep.ficaOverdue === 0) return false;
            if (ficaFilter === 'many-overdue' && rep.ficaOverdue <= 5) return false;
        }
        
        // Supervisor Filter
        if (supervisorFilter !== 'all') {
            const supervisorMap = {
                'thabo': 'Thabo Mokoena',
                'johan': 'Johan Smit',
                'sarah': 'Sarah Naidoo'
            };
            if (supervisorFilter !== 'unassigned' && rep.supervisor !== supervisorMap[supervisorFilter]) return false;
            if (supervisorFilter === 'unassigned' && rep.supervisor) return false;
        }
        
        return true;
    });
    
    renderMatrix();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('cpdFilter').value = 'all';
    document.getElementById('ficaFilter').value = 'all';
    document.getElementById('supervisorFilter').value = 'all';
    document.getElementById('clearSearch').style.display = 'none';
    applyFilters();
}

function applyCardFilter(filter) {
    if (filter === 'all') {
        clearFilters();
    } else if (filter === 'compliant') {
        document.getElementById('statusFilter').value = 'compliant';
        applyFilters();
    } else if (filter === 'at-risk') {
        document.getElementById('statusFilter').value = 'at-risk';
        applyFilters();
    } else if (filter === 'non-compliant') {
        document.getElementById('statusFilter').value = 'non-compliant';
        applyFilters();
    } else if (filter === 'score') {
        document.getElementById('sortBy').value = 'score-desc';
        handleSort();
    }
}

function handleSort() {
    const sortValue = document.getElementById('sortBy').value;
    sortByField(sortValue);
}

function sortByField(field) {
    filteredData.sort((a, b) => {
        switch(field) {
            case 'name-asc':
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'score-desc':
            case 'score':
                return b.overallScore - a.overallScore;
            case 'score-asc':
                return a.overallScore - b.overallScore;
            case 'critical':
                if (a.overallStatus === 'non-compliant' && b.overallStatus !== 'non-compliant') return -1;
                if (b.overallStatus === 'non-compliant' && a.overallStatus !== 'non-compliant') return 1;
                if (a.overallStatus === 'at-risk' && b.overallStatus === 'compliant') return -1;
                if (b.overallStatus === 'at-risk' && a.overallStatus === 'compliant') return 1;
                return a.name.localeCompare(b.name);
            case 'cpd':
                return (b.cpdHours / b.cpdRequired) - (a.cpdHours / a.cpdRequired);
            case 'updated-desc':
            case 'updated':
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            case 'updated-asc':
                return new Date(a.lastUpdated) - new Date(b.lastUpdated);
            default:
                return 0;
        }
    });
    
    renderMatrix();
}

function handleCheckboxChange(e) {
    const repId = parseInt(e.target.dataset.repId);
    if (e.target.checked) {
        selectedReps.add(repId);
    } else {
        selectedReps.delete(repId);
    }
    updateSelectedCount();
    updateSelectAllCheckbox();
}

function handleSelectAll(e) {
    const checked = e.target.checked;
    document.querySelectorAll('.rep-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
        const repId = parseInt(checkbox.dataset.repId);
        if (checked) {
            selectedReps.add(repId);
        } else {
            selectedReps.delete(repId);
        }
    });
    updateSelectedCount();
}

function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll('.rep-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAll').checked = allChecked;
}

function selectAllReps() {
    filteredData.forEach(rep => selectedReps.add(rep.id));
    document.querySelectorAll('.rep-checkbox').forEach(cb => cb.checked = true);
    updateSelectedCount();
    updateSelectAllCheckbox();
}

function deselectAllReps() {
    selectedReps.clear();
    document.querySelectorAll('.rep-checkbox').forEach(cb => cb.checked = false);
    updateSelectedCount();
    updateSelectAllCheckbox();
}

function updateSelectedCount() {
    const count = selectedReps.size;
    document.getElementById('selectedCount').textContent = count;
    const bulkBar = document.getElementById('bulkActionsBar');
    if (count > 0) {
        bulkBar.style.display = 'block';
    } else {
        bulkBar.style.display = 'none';
    }
}

function cancelSelection() {
    deselectAllReps();
}

function showRepDetails(repId) {
    const rep = typeof repId === 'number' ? 
        representativesData.find(r => r.id === repId) : repId;
    if (!rep) return;
    
    // In production, would load full details via API
    // For now, show basic modal
    const modal = new bootstrap.Modal(document.getElementById('repDetailModal'));
    document.getElementById('repDetailModalLabel').textContent = rep.name + ' - Compliance Details';
    document.getElementById('repDetailContent').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Personal Information</h6>
                <p><strong>Name:</strong> ${rep.name}</p>
                <p><strong>Email:</strong> ${rep.email}</p>
                <p><strong>FSCAR:</strong> ${rep.fscar}</p>
                <p><strong>Role:</strong> ${rep.role}</p>
                <p><strong>Supervisor:</strong> ${rep.supervisor}</p>
            </div>
            <div class="col-md-6">
                <h6>Compliance Summary</h6>
                <p><strong>Overall Score:</strong> ${rep.overallScore}%</p>
                <p><strong>Status:</strong> <span class="status-badge ${rep.overallStatus}">${rep.overallStatus.toUpperCase()}</span></p>
                <p><strong>CPD:</strong> ${rep.cpdHours} / ${rep.cpdRequired} hrs</p>
                <p><strong>FICA:</strong> ${rep.ficaCurrent} / ${rep.ficaTotal} clients</p>
                <p><strong>Documents:</strong> ${rep.docsCurrent} / ${rep.docsTotal}</p>
            </div>
        </div>
        <div class="mt-3">
            <p class="text-muted">Full details would be loaded here with tabs for Fit & Proper, CPD, FICA, Documents, Supervision, and Activity Log.</p>
        </div>
    `;
    modal.show();
}

function sendMessage(repId) {
    Swal.fire({
        title: 'Send Message',
        text: 'Message functionality would be implemented here',
        icon: 'info'
    });
}

function sendReminder(repId) {
    Swal.fire({
        title: 'Send Reminder',
        text: 'Reminder functionality would be implemented here',
        icon: 'info'
    });
}

function generateReport(repId) {
    Swal.fire({
        title: 'Generate Report',
        text: 'Report generation would be implemented here',
        icon: 'info'
    });
}

function viewAuditLog(repId) {
    Swal.fire({
        title: 'Audit Log',
        text: 'Audit log would be displayed here',
        icon: 'info'
    });
}

function handleUrgentAction(repId) {
    Swal.fire({
        title: 'Urgent Action Required',
        text: 'Urgent action modal would be shown here',
        icon: 'warning',
        confirmButtonText: 'Take Action'
    });
}

function generateTeamReport() {
    Swal.fire({
        title: 'Generate Team Report',
        text: 'Team report generation would be implemented here',
        icon: 'info'
    });
}

function showBulkReminderModal() {
    Swal.fire({
        title: 'Send Bulk Reminder',
        text: 'Bulk reminder functionality would be implemented here',
        icon: 'info'
    });
}

function exportToExcel() {
    Swal.fire({
        title: 'Export to Excel',
        text: 'Excel export would be implemented here',
        icon: 'success'
    });
}

function printMatrix() {
    window.print();
}

function refreshData() {
    const icon = document.getElementById('refreshIcon');
    icon.classList.add('fa-spin');
    setTimeout(() => {
        icon.classList.remove('fa-spin');
        updateLastUpdated();
        Swal.fire({
            title: 'Refreshed',
            text: 'Data has been refreshed',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    }, 1000);
}

function updateLastUpdated() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lastUpdated').textContent = `${dateStr} ${timeStr}`;
}

function generateBulkReport() {
    Swal.fire({
        title: 'Generate Bulk Report',
        text: `Generating report for ${selectedReps.size} representatives...`,
        icon: 'info'
    });
}

function exportSelected() {
    Swal.fire({
        title: 'Export Selected',
        text: `Exporting ${selectedReps.size} representatives...`,
        icon: 'info'
    });
}

function assignSupervisor() {
    Swal.fire({
        title: 'Assign Supervisor',
        text: 'Supervisor assignment would be implemented here',
        icon: 'info'
    });
}

function markAsReviewed() {
    Swal.fire({
        title: 'Mark as Reviewed',
        text: `Marking ${selectedReps.size} representatives as reviewed...`,
        icon: 'success'
    });
}

function expandAllRows() {
    // Implementation for expanding all rows
    document.getElementById('expandAllBtn').style.display = 'none';
    document.getElementById('collapseAllBtn').style.display = 'inline-block';
}

function collapseAllRows() {
    // Implementation for collapsing all rows
    document.getElementById('expandAllBtn').style.display = 'inline-block';
    document.getElementById('collapseAllBtn').style.display = 'none';
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

