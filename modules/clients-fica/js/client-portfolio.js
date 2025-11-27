// Client Portfolio JavaScript

let portfolioData = {
    clients: [],
    filteredClients: [],
    currentView: 'list',
    representatives: [],
    ficaVerifications: [],
    currentPage: 1,
    pageSize: 50,
    totalPages: 1
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when portfolio tab is shown
    const portfolioTab = document.getElementById('portfolio-tab');
    if (portfolioTab) {
        portfolioTab.addEventListener('shown.bs.tab', function() {
            loadClientPortfolio();
        });
    }
});

/**
 * Load Client Portfolio from Database
 */
async function loadClientPortfolio() {
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
        
        portfolioData.clients = clients || [];
        
        // Load representatives for filter
        await loadRepresentatives();
        
        // Load FICA verifications to get status
        await loadFicaVerifications();
        
        // Enrich clients with FICA status and representative name
        enrichClientsData();
        
        portfolioData.filteredClients = [...portfolioData.clients];
        
        updatePortfolioStats();
        renderClientPortfolio();
        setupFilters();
        setupPagination();
    } catch (error) {
        console.error('Error loading client portfolio:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        
        const errorMessage = error.message || 'Failed to load client portfolio';
        Swal.fire({
            icon: 'error',
            title: 'Error Loading Portfolio',
            html: `
                <p>${errorMessage}</p>
                <p class="small text-muted mt-2">Please check the browser console for more details.</p>
            `,
            confirmButtonText: 'OK'
        });
    }
}

/**
 * Update Portfolio Statistics
 */
function updatePortfolioStats() {
    const clients = portfolioData.clients;
    const activeClients = clients.filter(c => c.status === 'active');
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const newThisMonth = clients.filter(c => {
        if (!c.client_since) return false;
        const clientDate = new Date(c.client_since);
        return clientDate.getMonth() === thisMonth && clientDate.getFullYear() === thisYear;
    }).length;
    
    // Update Total Clients
    const totalEl = document.querySelector('#portfolio .stat-value.text-primary');
    if (totalEl) totalEl.textContent = clients.length;
    
    // Update Active
    const activeEl = document.querySelectorAll('#portfolio .stat-value.text-success')[0];
    if (activeEl) activeEl.textContent = activeClients.length;
    
    // Update New This Month
    const newEl = document.querySelector('#portfolio .stat-value.text-info');
    if (newEl) newEl.textContent = newThisMonth;
}

/**
 * Render Client Portfolio
 */
function renderClientPortfolio() {
    // Calculate pagination
    const startIndex = (portfolioData.currentPage - 1) * portfolioData.pageSize;
    const endIndex = startIndex + portfolioData.pageSize;
    const paginatedClients = portfolioData.filteredClients.slice(startIndex, endIndex);
    portfolioData.totalPages = Math.ceil(portfolioData.filteredClients.length / portfolioData.pageSize);
    
    // Render based on current view
    if (portfolioData.currentView === 'grid') {
        renderGridView(paginatedClients);
    } else if (portfolioData.currentView === 'table') {
        renderTableView(paginatedClients);
    } else {
        renderListView(paginatedClients);
    }
    
    updatePortfolioCount();
}

/**
 * Render List View
 */
function renderListView(clients) {
    const container = document.getElementById('portfolio-list-view');
    if (!container) return;
    
    if (clients.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No clients found. <a href="#" onclick="switchClientsFicaTab('add-client-tab')">Add your first client</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = clients.map(client => {
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const riskBadge = client.risk_category === 'high'
            ? '<span class="badge bg-danger">High (EDD)</span>'
            : client.risk_category === 'medium'
            ? '<span class="badge bg-warning">Standard (CDD)</span>'
            : '<span class="badge bg-success">Low (SDD)</span>';
        
        const pepBadge = client.pep_status ? '<span class="badge bg-danger">🚩 PEP</span>' : '';
        
        // FICA status badge
        const ficaStatus = client.fica_status || 'pending';
        const ficaBadge = ficaStatus === 'compliant' 
            ? '<span class="badge bg-success">✓ FICA</span>'
            : ficaStatus === 'pending'
            ? '<span class="badge bg-warning">⏳ Pending</span>'
            : '<span class="badge bg-danger">⚠️ Incomplete</span>';
        
        // Next review date
        const nextReview = client.next_review_date 
            ? new Date(client.next_review_date).toLocaleDateString('en-ZA')
            : 'N/A';
        const reviewOverdue = client.next_review_date && new Date(client.next_review_date) < new Date();
        const reviewBadge = reviewOverdue ? '⚠️' : '';
        
        return `
            <div class="card mb-3 ${client.risk_category === 'high' ? 'border-warning' : ''}">
                <div class="card-body">
                    <div class="d-flex align-items-start">
                        <div class="avatar-lg me-3">
                            <i class="fas fa-${client.client_type === 'corporate' ? 'building' : 'user'}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 class="mb-1">${name} ${riskBadge} ${pepBadge} ${ficaBadge}</h5>
                                    <p class="mb-1 text-muted">
                                        ${client.id_number ? `ID: ${client.id_number.substring(0, 6)}****${client.id_number.substring(client.id_number.length - 3)} • ` : ''}
                                        <i class="fas fa-phone me-1"></i>${client.mobile || client.phone || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    ${riskBadge}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">Representative: ${client.representative_name || 'Unassigned'}</small><br>
                                    <small class="text-muted">Email: ${client.email || 'N/A'}</small><br>
                                    <small class="text-muted">Type: ${client.client_type || 'N/A'}</small>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted">Status: <span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">${client.status || 'N/A'}</span></small><br>
                                    <small class="text-muted">Client Since: ${client.client_since ? new Date(client.client_since).toLocaleDateString('en-ZA') : 'N/A'}</small><br>
                                    <small class="text-muted">Next Review: ${nextReview} ${reviewBadge}</small>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewClientProfile('${client.id}')">View Profile</button>
                                <button class="btn btn-sm btn-outline-secondary me-2" onclick="viewFicaVerification('${client.id}')">FICA Review</button>
                                <button class="btn btn-sm btn-outline-info me-2" onclick="editClient('${client.id}')">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteClient('${client.id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Grid View
 */
function renderGridView(clients) {
    const container = document.getElementById('portfolio-grid-view');
    const gridContainer = document.getElementById('portfolio-grid-container');
    if (!container || !gridContainer) return;
    
    container.style.display = 'block';
    document.getElementById('portfolio-list-view').style.display = 'none';
    document.getElementById('portfolio-table-view').style.display = 'none';
    
    if (clients.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No clients found.
                </div>
            </div>
        `;
        return;
    }
    
    gridContainer.innerHTML = clients.map(client => {
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const riskBadge = client.risk_category === 'high'
            ? '<span class="badge bg-danger">High (EDD)</span>'
            : client.risk_category === 'medium'
            ? '<span class="badge bg-warning">Standard (CDD)</span>'
            : '<span class="badge bg-success">Low (SDD)</span>';
        
        const ficaStatus = client.fica_status || 'pending';
        const ficaBadge = ficaStatus === 'compliant' 
            ? '<span class="badge bg-success">✓ FICA</span>'
            : '<span class="badge bg-warning">⏳ Pending</span>';
        
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 ${client.risk_category === 'high' ? 'border-warning' : ''}">
                    <div class="card-body text-center">
                        <div class="avatar-lg mx-auto mb-3">
                            <i class="fas fa-${client.client_type === 'corporate' ? 'building' : 'user'} fa-3x"></i>
                        </div>
                        <h5 class="mb-2">${name}</h5>
                        <p class="text-muted small mb-2">
                            ${client.id_number ? `ID: ${client.id_number.substring(0, 6)}****${client.id_number.substring(client.id_number.length - 3)}` : 'N/A'}
                        </p>
                        <div class="mb-2">
                            ${riskBadge} ${ficaBadge}
                        </div>
                        <p class="small text-muted mb-2">
                            <i class="fas fa-phone me-1"></i>${client.mobile || client.phone || 'N/A'}<br>
                            <i class="fas fa-envelope me-1"></i>${client.email || 'N/A'}
                        </p>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary w-100 mb-2" onclick="viewClientProfile('${client.id}')">View Profile</button>
                            <button class="btn btn-sm btn-outline-secondary w-100" onclick="viewFicaVerification('${client.id}')">FICA Review</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Table View
 */
function renderTableView(clients) {
    const container = document.getElementById('portfolio-table-view');
    const tbody = document.getElementById('clients-table-body');
    if (!container || !tbody) return;
    
    container.style.display = 'block';
    document.getElementById('portfolio-list-view').style.display = 'none';
    document.getElementById('portfolio-grid-view').style.display = 'none';
    
    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <i class="fas fa-info-circle text-muted me-2"></i>
                    No clients found.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clients.map(client => {
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        const riskBadge = client.risk_category === 'high'
            ? '<span class="badge bg-danger">High (EDD)</span>'
            : client.risk_category === 'medium'
            ? '<span class="badge bg-warning">Standard (CDD)</span>'
            : '<span class="badge bg-success">Low (SDD)</span>';
        
        const ficaStatus = client.fica_status || 'pending';
        const ficaBadge = ficaStatus === 'compliant' 
            ? '<span class="badge bg-success">✓ Verified</span>'
            : ficaStatus === 'pending'
            ? '<span class="badge bg-warning">⏳ Pending</span>'
            : '<span class="badge bg-danger">⚠️ Incomplete</span>';
        
        return `
            <tr>
                <td>
                    <strong>${name}</strong>
                    ${client.pep_status ? '<span class="badge bg-danger ms-1">🚩 PEP</span>' : ''}
                </td>
                <td>${client.id_number ? client.id_number.substring(0, 6) + '****' + client.id_number.substring(client.id_number.length - 3) : 'N/A'}</td>
                <td>${client.email || 'N/A'}</td>
                <td>${client.mobile || client.phone || 'N/A'}</td>
                <td><span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">${client.status || 'N/A'}</span></td>
                <td>${riskBadge}</td>
                <td>${ficaBadge}</td>
                <td>${client.representative_name || 'Unassigned'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewClientProfile('${client.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editClient('${client.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteClient('${client.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Load Representatives for Filter
 */
async function loadRepresentatives() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) return;
        
        const repsResult = await dataFunctionsToUse.getRepresentatives();
        let reps = repsResult;
        if (repsResult && repsResult.data) {
            reps = repsResult.data;
        } else if (repsResult && Array.isArray(repsResult)) {
            reps = repsResult;
        }
        
        portfolioData.representatives = reps || [];
        
        // Populate representative filter dropdown
        const repSelect = document.getElementById('representative-filter');
        if (repSelect) {
            repSelect.innerHTML = '<option value="">All</option>' + 
                portfolioData.representatives.map(rep => {
                    const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                    return `<option value="${rep.id}">${name}</option>`;
                }).join('');
        }
    } catch (error) {
        console.error('Error loading representatives:', error);
    }
}

/**
 * Load FICA Verifications
 */
async function loadFicaVerifications() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) return;
        
        const ficaResult = await dataFunctionsToUse.getFicaVerifications();
        let verifications = ficaResult;
        if (ficaResult && ficaResult.data) {
            verifications = ficaResult.data;
        } else if (ficaResult && Array.isArray(ficaResult)) {
            verifications = ficaResult;
        }
        
        portfolioData.ficaVerifications = verifications || [];
    } catch (error) {
        console.error('Error loading FICA verifications:', error);
    }
}

/**
 * Enrich Clients with FICA Status and Representative Name
 */
function enrichClientsData() {
    portfolioData.clients.forEach(client => {
        // Add representative name
        if (client.assigned_representative_id) {
            const rep = portfolioData.representatives.find(r => r.id === client.assigned_representative_id);
            if (rep) {
                client.representative_name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
            }
        }
        
        // Add FICA status and next review date
        const ficaVerification = portfolioData.ficaVerifications.find(fv => fv.client_id === client.id);
        if (ficaVerification) {
            client.fica_status = ficaVerification.fica_status || 'pending';
            client.next_review_date = ficaVerification.next_review_date;
        } else {
            client.fica_status = 'pending';
            client.next_review_date = null;
        }
    });
}

/**
 * Setup Filters
 */
function setupFilters() {
    const searchInput = document.querySelector('#portfolio input[type="text"]');
    const statusSelect = document.querySelector('#portfolio select:first-of-type');
    const ficaSelect = document.querySelectorAll('#portfolio select')[1];
    const riskSelect = document.querySelectorAll('#portfolio select')[2];
    const repSelect = document.getElementById('representative-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    [statusSelect, ficaSelect, riskSelect, repSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', applyFilters);
        }
    });
}

/**
 * Apply Filters
 */
function applyFilters() {
    const searchInput = document.querySelector('#portfolio input[type="text"]');
    const statusSelect = document.querySelector('#portfolio select:first-of-type');
    const ficaSelect = document.querySelectorAll('#portfolio select')[1];
    const riskSelect = document.querySelectorAll('#portfolio select')[2];
    const repSelect = document.getElementById('representative-filter');
    
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const statusFilter = statusSelect?.value || 'All';
    const ficaFilter = ficaSelect?.value || 'All';
    const riskFilter = riskSelect?.value || 'All';
    const repFilter = repSelect?.value || '';
    
    portfolioData.filteredClients = portfolioData.clients.filter(client => {
        // Search filter
        if (searchTerm) {
            const searchableText = [
                client.first_name,
                client.last_name,
                client.company_name,
                client.id_number,
                client.email,
                client.phone,
                client.mobile,
                client.representative_name
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        // Status filter
        if (statusFilter !== 'All' && client.status !== statusFilter.toLowerCase()) {
            return false;
        }
        
        // FICA status filter
        if (ficaFilter !== 'All') {
            const ficaStatus = client.fica_status || 'pending';
            if (ficaFilter === 'Verified' && ficaStatus !== 'compliant') return false;
            if (ficaFilter === 'Pending' && ficaStatus !== 'pending') return false;
            if (ficaFilter === 'Incomplete' && ficaStatus !== 'incomplete') return false;
        }
        
        // Risk filter
        if (riskFilter !== 'All') {
            const riskMap = {
                'Low (SDD)': 'low',
                'Standard (CDD)': 'medium',
                'High (EDD)': 'high'
            };
            if (client.risk_category !== riskMap[riskFilter]) {
                return false;
            }
        }
        
        // Representative filter
        if (repFilter && client.assigned_representative_id !== repFilter) {
            return false;
        }
        
        return true;
    });
    
    portfolioData.currentPage = 1; // Reset to first page
    renderClientPortfolio();
    updatePagination();
}

/**
 * Clear All Filters
 */
function clearFilters() {
    const searchInput = document.querySelector('#portfolio input[type="text"]');
    const statusSelect = document.querySelector('#portfolio select:first-of-type');
    const ficaSelect = document.querySelectorAll('#portfolio select')[1];
    const riskSelect = document.querySelectorAll('#portfolio select')[2];
    const repSelect = document.getElementById('representative-filter');
    
    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = 'All';
    if (ficaSelect) ficaSelect.value = 'All';
    if (riskSelect) riskSelect.value = 'All';
    if (repSelect) repSelect.value = '';
    
    portfolioData.filteredClients = [...portfolioData.clients];
    portfolioData.currentPage = 1;
    renderClientPortfolio();
    updatePagination();
}

/**
 * Setup Pagination
 */
function setupPagination() {
    const pageSizeSelect = document.getElementById('page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            portfolioData.pageSize = parseInt(this.value);
            portfolioData.currentPage = 1;
            renderClientPortfolio();
            updatePagination();
        });
    }
}

/**
 * Update Pagination
 */
function updatePagination() {
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');
    const paginationContainer = document.getElementById('portfolio-pagination');
    
    if (!paginationInfo || !paginationControls || !paginationContainer) return;
    
    const total = portfolioData.filteredClients.length;
    const start = total === 0 ? 0 : (portfolioData.currentPage - 1) * portfolioData.pageSize + 1;
    const end = Math.min(portfolioData.currentPage * portfolioData.pageSize, total);
    
    paginationInfo.textContent = `Showing ${start}-${end} of ${total}`;
    
    if (portfolioData.totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${portfolioData.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${portfolioData.currentPage - 1}); return false;">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= portfolioData.totalPages; i++) {
        if (i === 1 || i === portfolioData.totalPages || (i >= portfolioData.currentPage - 2 && i <= portfolioData.currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === portfolioData.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === portfolioData.currentPage - 3 || i === portfolioData.currentPage + 3) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${portfolioData.currentPage === portfolioData.totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${portfolioData.currentPage + 1}); return false;">Next</a>
        </li>
    `;
    
    paginationControls.innerHTML = paginationHTML;
}

/**
 * Change Page
 */
function changePage(page) {
    if (page < 1 || page > portfolioData.totalPages) return;
    portfolioData.currentPage = page;
    renderClientPortfolio();
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Change Page Size
 */
function changePageSize(size) {
    portfolioData.pageSize = parseInt(size);
    portfolioData.currentPage = 1;
    renderClientPortfolio();
    updatePagination();
}

/**
 * Update Portfolio Count
 */
function updatePortfolioCount() {
    const countEl = document.getElementById('portfolio-count');
    if (countEl) {
        const total = portfolioData.filteredClients.length;
        const start = total === 0 ? 0 : (portfolioData.currentPage - 1) * portfolioData.pageSize + 1;
        const end = Math.min(portfolioData.currentPage * portfolioData.pageSize, total);
        countEl.textContent = `Showing ${start}-${end} of ${total}`;
    }
}

function setPortfolioView(view) {
    portfolioData.currentView = view;
    
    // Update button states
    document.querySelectorAll('[onclick*="setPortfolioView"]').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Reset to first page when changing view
    portfolioData.currentPage = 1;
    
    // Render the selected view
    renderClientPortfolio();
    updatePagination();
}

/**
 * View Client Profile
 */
async function viewClientProfile(clientId) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        const clientResult = await dataFunctionsToUse.getClient(clientId);
        let client = clientResult;
        if (clientResult && clientResult.data) {
            client = clientResult.data;
        } else if (clientResult && typeof clientResult === 'object') {
            client = clientResult;
        }
        
        if (!client) {
            throw new Error('Client not found');
        }
        
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.title || ''} ${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        // Get FICA verification
        const ficaResult = await dataFunctionsToUse.getFicaVerifications(clientId);
        let ficaVerification = null;
        if (ficaResult && ficaResult.data && ficaResult.data.length > 0) {
            ficaVerification = ficaResult.data[0];
        } else if (Array.isArray(ficaResult) && ficaResult.length > 0) {
            ficaVerification = ficaResult[0];
        }
        
        // Get representative name
        let representativeName = 'Unassigned';
        if (client.assigned_representative_id) {
            const rep = portfolioData.representatives.find(r => r.id === client.assigned_representative_id);
            if (rep) {
                representativeName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
            }
        }
        
        Swal.fire({
            title: name,
            html: `
                <div class="text-start">
                    <h6 class="mb-3">Client Information</h6>
                    <p><strong>Client Type:</strong> ${client.client_type || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${client.id_number || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> ${client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString('en-ZA') : 'N/A'}</p>
                    <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${client.phone || 'N/A'}</p>
                    <p><strong>Mobile:</strong> ${client.mobile || 'N/A'}</p>
                    <p><strong>Status:</strong> <span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">${client.status || 'N/A'}</span></p>
                    <p><strong>Risk Category:</strong> <span class="badge bg-${client.risk_category === 'high' ? 'danger' : client.risk_category === 'medium' ? 'warning' : 'success'}">${client.risk_category || 'N/A'}</span></p>
                    <p><strong>PEP Status:</strong> ${client.pep_status ? '<span class="badge bg-danger">🚩 PEP</span>' : '<span class="badge bg-success">Clear</span>'}</p>
                    <p><strong>Representative:</strong> ${representativeName}</p>
                    <p><strong>Client Since:</strong> ${client.client_since ? new Date(client.client_since).toLocaleDateString('en-ZA') : 'N/A'}</p>
                    ${ficaVerification ? `
                        <hr>
                        <h6 class="mb-3">FICA Verification</h6>
                        <p><strong>Status:</strong> <span class="badge bg-${ficaVerification.fica_status === 'compliant' ? 'success' : 'warning'}">${ficaVerification.fica_status || 'N/A'}</span></p>
                        <p><strong>Verification Date:</strong> ${ficaVerification.verification_date ? new Date(ficaVerification.verification_date).toLocaleDateString('en-ZA') : 'N/A'}</p>
                        <p><strong>Next Review:</strong> ${ficaVerification.next_review_date ? new Date(ficaVerification.next_review_date).toLocaleDateString('en-ZA') : 'N/A'}</p>
                    ` : ''}
                    ${client.address_street ? `
                        <hr>
                        <h6 class="mb-3">Address</h6>
                        <p>${client.address_street || ''}<br>
                        ${client.address_suburb || ''}${client.address_city ? ', ' + client.address_city : ''}<br>
                        ${client.address_province || ''} ${client.address_postal_code || ''}</p>
                    ` : ''}
                </div>
            `,
            width: '700px',
            showCancelButton: true,
            confirmButtonText: 'Edit',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                editClient(clientId);
            }
        });
    } catch (error) {
        console.error('Error viewing client profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to load client profile'
        });
    }
}

/**
 * Edit Client
 */
async function editClient(clientId) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        const clientResult = await dataFunctionsToUse.getClient(clientId);
        let client = clientResult;
        if (clientResult && clientResult.data) {
            client = clientResult.data;
        } else if (clientResult && typeof clientResult === 'object') {
            client = clientResult;
        }
        
        if (!client) {
            throw new Error('Client not found');
        }
        
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        // Build representative options
        const repOptions = '<option value="">Unassigned</option>' + 
            portfolioData.representatives.map(rep => {
                const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                return `<option value="${rep.id}" ${client.assigned_representative_id === rep.id ? 'selected' : ''}>${repName}</option>`;
            }).join('');
        
        const { value: formValues } = await Swal.fire({
            title: `Edit Client: ${name}`,
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label">Email *</label>
                        <input type="email" id="edit-email" class="form-control" value="${client.email || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone</label>
                        <input type="text" id="edit-phone" class="form-control" value="${client.phone || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mobile</label>
                        <input type="text" id="edit-mobile" class="form-control" value="${client.mobile || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status *</label>
                        <select id="edit-status" class="form-select" required>
                            <option value="active" ${client.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${client.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="pending" ${client.status === 'pending' ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Risk Category *</label>
                        <select id="edit-risk" class="form-select" required>
                            <option value="low" ${client.risk_category === 'low' ? 'selected' : ''}>Low (SDD)</option>
                            <option value="medium" ${client.risk_category === 'medium' ? 'selected' : ''}>Standard (CDD)</option>
                            <option value="high" ${client.risk_category === 'high' ? 'selected' : ''}>High (EDD)</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Representative</label>
                        <select id="edit-representative" class="form-select">
                            ${repOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">PEP Status</label>
                        <div class="form-check">
                            <input type="checkbox" id="edit-pep" class="form-check-input" ${client.pep_status ? 'checked' : ''}>
                            <label class="form-check-label" for="edit-pep">Politically Exposed Person</label>
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    email: document.getElementById('edit-email').value,
                    phone: document.getElementById('edit-phone').value,
                    mobile: document.getElementById('edit-mobile').value,
                    status: document.getElementById('edit-status').value,
                    risk_category: document.getElementById('edit-risk').value,
                    assigned_representative_id: document.getElementById('edit-representative').value || null,
                    pep_status: document.getElementById('edit-pep').checked
                };
            }
        });
        
        if (formValues) {
            Swal.fire({
                title: 'Updating...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const result = await dataFunctionsToUse.updateClient(clientId, formValues);
            
            if (result && result.success !== false) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Client has been updated successfully.',
                    timer: 2000
                });
                
                // Reload portfolio
                await loadClientPortfolio();
            } else {
                throw new Error(result?.error || 'Failed to update');
            }
        }
    } catch (error) {
        console.error('Error editing client:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to update client'
        });
    }
}

/**
 * Delete Client
 */
async function deleteClient(clientId) {
    const client = portfolioData.clients.find(c => c.id === clientId);
    const name = client 
        ? (client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown')
        : 'this client';
    
    const result = await Swal.fire({
        title: 'Delete Client?',
        html: `Are you sure you want to delete <strong>${name}</strong>?<br><br>This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it'
    });
    
    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                ? dataFunctions 
                : (window.dataFunctions || window.parent?.dataFunctions);
            
            if (!dataFunctionsToUse) {
                throw new Error('dataFunctions is not available');
            }
            
            const deleteResult = await dataFunctionsToUse.deleteClient(clientId);
            
            if (deleteResult && deleteResult.success !== false) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Client has been deleted successfully.',
                    timer: 2000
                });
                
                // Reload portfolio
                await loadClientPortfolio();
            } else {
                throw new Error(deleteResult?.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to delete client'
            });
        }
    }
}

function viewFicaVerification(clientId) {
    // Switch to FICA verification tab
    if (typeof switchClientsFicaTab === 'function') {
        switchClientsFicaTab('fica-verification-tab');
    }
}

function viewClientDocuments(clientId) {
    // Open documents modal or navigate
    Swal.fire({
        icon: 'info',
        title: 'Documents',
        text: 'Document management functionality will be implemented here.'
    });
}

/**
 * Export Clients to CSV
 */
function exportClients() {
    if (portfolioData.filteredClients.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No clients to export'
        });
        return;
    }
    
    // Create CSV content
    const headers = ['Name', 'ID Number', 'Email', 'Phone', 'Mobile', 'Status', 'Risk Category', 'FICA Status', 'Representative', 'Client Since'];
    const rows = portfolioData.filteredClients.map(client => {
        const name = client.client_type === 'corporate' 
            ? client.company_name || 'Unknown Company'
            : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
        
        return [
            name,
            client.id_number || 'N/A',
            client.email || 'N/A',
            client.phone || 'N/A',
            client.mobile || 'N/A',
            client.status || 'N/A',
            client.risk_category || 'N/A',
            client.fica_status || 'pending',
            client.representative_name || 'Unassigned',
            client.client_since ? new Date(client.client_since).toLocaleDateString('en-ZA') : 'N/A'
        ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Export Complete',
        text: 'Your CSV file has been downloaded.',
        timer: 2000
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
window.setPortfolioView = setPortfolioView;
window.viewClientProfile = viewClientProfile;
window.editClient = editClient;
window.deleteClient = deleteClient;
window.viewFicaVerification = viewFicaVerification;
window.viewClientDocuments = viewClientDocuments;
window.loadClientPortfolio = loadClientPortfolio;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.exportClients = exportClients;
window.changePage = changePage;
window.changePageSize = changePageSize;

