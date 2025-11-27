// Document Library JavaScript - Database Integrated

let documentsData = {
    documents: [],
    filters: {
        category: 'all',
        status: 'active',
        search: ''
    },
    currentView: 'grid'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeDocumentLibrary();
});

async function initializeDocumentLibrary() {
    const libraryTab = document.getElementById('library-tab');
    if (libraryTab) {
        libraryTab.addEventListener('shown.bs.tab', function() {
            loadDocuments();
        });
        
        // Load if already active
        if (libraryTab.classList.contains('active')) {
            loadDocuments();
        }
    }
    
    setupViewToggle();
    setupSidebar();
    setupFilters();
    setupSearch();
}

/**
 * Load Documents from Database
 */
async function loadDocuments() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all documents
        const result = await dataFunctionsToUse.getDocuments(null, null, null, 'active');
        let documents = result;
        if (result && result.data) {
            documents = result.data;
        } else if (result && Array.isArray(result)) {
            documents = result;
        }
        
        documentsData.documents = documents || [];
        
        updateDocumentStats();
        renderDocuments();
        updateSidebarCounts();
        initializeCharts();
        
    } catch (error) {
        console.error('Error loading documents:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load documents'
        });
    }
}

/**
 * Update Document Statistics
 */
function updateDocumentStats() {
    const docs = documentsData.documents;
    
    // Total documents
    const totalEl = document.querySelector('#library .stat-value');
    if (totalEl) {
        totalEl.textContent = docs.length;
    }
    
    // Expiring soon (next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringSoon = docs.filter(doc => {
        if (!doc.expiry_date) return false;
        const expiry = new Date(doc.expiry_date);
        return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;
    
    const expiringEl = document.querySelectorAll('#library .stat-value')[2];
    if (expiringEl) {
        expiringEl.textContent = expiringSoon;
    }
    
    // Calculate storage used
    const totalSize = docs.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0);
    const totalSizeGB = totalSize / (1024 * 1024 * 1024);
    const maxSizeGB = 10; // 10GB limit
    const percentUsed = (totalSizeGB / maxSizeGB) * 100;
    
    // Update storage progress
    const progressCircle = document.querySelector('.progress-circle-small circle.progress-bar');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 35;
        const offset = circumference - (percentUsed / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = Math.round(percentUsed) + '%';
    }
    
    const storageLabel = document.querySelectorAll('#library .stat-sublabel')[1];
    if (storageLabel) {
        storageLabel.textContent = `${totalSizeGB.toFixed(2)} GB / ${maxSizeGB} GB`;
    }
}

/**
 * Update Sidebar Counts
 */
function updateSidebarCounts() {
    const docs = documentsData.documents;
    
    // Count by category
    const categoryCounts = {};
    docs.forEach(doc => {
        const cat = doc.document_category || 'other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // Update sidebar badges
    const sidebarBadges = document.querySelectorAll('.sidebar-menu .badge');
    sidebarBadges.forEach(badge => {
        const link = badge.closest('a');
        if (link) {
            const filter = link.getAttribute('data-filter');
            if (filter && filter !== 'all' && filter !== 'active' && filter !== 'expiring' && filter !== 'expired' && filter !== 'archived' && filter !== 'pending') {
                const count = categoryCounts[filter] || 0;
                badge.textContent = count;
            }
        }
    });
    
    // Update "All Documents" badge
    const allBadge = document.querySelector('[data-filter="all"] .badge');
    if (allBadge) {
        allBadge.textContent = docs.length;
    }
    
    // Update status badges
    const activeDocs = docs.filter(d => d.status === 'active' || !d.status).length;
    const expiredDocs = docs.filter(d => {
        if (!d.expiry_date) return false;
        return new Date(d.expiry_date) < new Date();
    }).length;
    const archivedDocs = docs.filter(d => d.status === 'archived').length;
    
    const activeBadge = document.querySelector('[data-filter="active"] .badge');
    if (activeBadge) activeBadge.textContent = activeDocs;
    
    const expiredBadge = document.querySelector('[data-filter="expired"] .badge');
    if (expiredBadge) expiredBadge.textContent = expiredDocs;
    
    const archivedBadge = document.querySelector('[data-filter="archived"] .badge');
    if (archivedBadge) archivedBadge.textContent = archivedDocs;
}

/**
 * Render Documents
 */
function renderDocuments() {
    const filteredDocs = getFilteredDocuments();
    
    // Render based on current view
    if (documentsData.currentView === 'grid') {
        renderGridView(filteredDocs);
    } else if (documentsData.currentView === 'list') {
        renderListView(filteredDocs);
    } else {
        renderTableView(filteredDocs);
    }
}

/**
 * Get Filtered Documents
 */
function getFilteredDocuments() {
    let docs = documentsData.documents;
    
    // Filter by category
    if (documentsData.filters.category && documentsData.filters.category !== 'all') {
        docs = docs.filter(d => {
            const cat = (d.document_category || '').toLowerCase();
            return cat === documentsData.filters.category.toLowerCase();
        });
    }
    
    // Filter by status
    if (documentsData.filters.status && documentsData.filters.status !== 'all') {
        if (documentsData.filters.status === 'expiring') {
            const today = new Date();
            const thirtyDaysFromNow = new Date(today);
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            docs = docs.filter(d => {
                if (!d.expiry_date) return false;
                const expiry = new Date(d.expiry_date);
                return expiry >= today && expiry <= thirtyDaysFromNow;
            });
        } else if (documentsData.filters.status === 'expired') {
            docs = docs.filter(d => {
                if (!d.expiry_date) return false;
                return new Date(d.expiry_date) < new Date();
            });
        } else {
            docs = docs.filter(d => (d.status || 'active') === documentsData.filters.status);
        }
    }
    
    // Filter by search
    if (documentsData.filters.search) {
        const searchLower = documentsData.filters.search.toLowerCase();
        docs = docs.filter(d => {
            return (d.document_name || '').toLowerCase().includes(searchLower) ||
                   (d.description || '').toLowerCase().includes(searchLower) ||
                   (d.file_name || '').toLowerCase().includes(searchLower);
        });
    }
    
    return docs;
}

/**
 * Render Grid View
 */
function renderGridView(docs) {
    const gridView = document.getElementById('gridView');
    if (!gridView) return;
    
    if (docs.length === 0) {
        gridView.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-5x text-muted mb-4"></i>
                <h4>No documents found</h4>
                <p class="text-muted">Upload your first document to get started</p>
                <button class="btn btn-primary mt-3" onclick="switchDocTab('upload-tab')">
                    <i class="fas fa-upload me-2"></i>Upload Document
                </button>
            </div>
        `;
        return;
    }
    
    gridView.innerHTML = `
        <div class="row g-4">
            ${docs.map(doc => {
                const uploadDate = doc.upload_date ? new Date(doc.upload_date).toLocaleDateString('en-ZA') : 'N/A';
                const expiryDate = doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString('en-ZA') : null;
                const fileSize = doc.file_size_bytes ? formatFileSize(doc.file_size_bytes) : 'N/A';
                const fileType = doc.file_type || 'file';
                const status = doc.status || 'active';
                const category = doc.document_category || 'other';
                
                const fileIcon = getFileIconForType(fileType);
                const statusBadge = status === 'active' 
                    ? '<span class="status-badge bg-success">Active</span>'
                    : status === 'archived'
                    ? '<span class="status-badge bg-secondary">Archived</span>'
                    : '<span class="status-badge bg-warning">Pending</span>';
                
                const tags = (doc.tags || []).map(tag => 
                    `<span class="badge bg-light text-dark">#${tag}</span>`
                ).join(' ');
                
                return `
                    <div class="col-xl-3 col-lg-4 col-md-6">
                        <div class="document-card">
                            <div class="document-thumbnail">
                                ${fileIcon}
                                ${statusBadge}
                            </div>
                            <div class="document-info">
                                <h6 class="document-name" title="${doc.document_name}">${doc.document_name}</h6>
                                <div class="document-meta">
                                    <span class="badge bg-primary">${category}</span>
                                    <small class="text-muted d-block mt-1">${fileSize} | ${fileType.toUpperCase()}</small>
                                    <small class="text-muted d-block">Uploaded: ${uploadDate}</small>
                                    ${expiryDate ? `<small class="text-muted d-block">Expires: ${expiryDate}</small>` : ''}
                                    ${tags ? `<div class="tags mt-2">${tags}</div>` : ''}
                                </div>
                                <div class="document-actions mt-3">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">
                                        <i class="fas fa-eye me-1"></i>View
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="downloadDocument('${doc.id}')">
                                        <i class="fas fa-download me-1"></i>Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="mt-4 text-center">
            <small class="text-muted">Showing ${docs.length} of ${documentsData.documents.length} documents</small>
        </div>
    `;
}

/**
 * Render List View
 */
function renderListView(docs) {
    const listView = document.getElementById('listView');
    if (!listView) return;
    
    if (docs.length === 0) {
        listView.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-5x text-muted mb-4"></i>
                <h4>No documents found</h4>
            </div>
        `;
        return;
    }
    
    listView.innerHTML = `
        <div class="list-group">
            ${docs.map(doc => {
                const uploadDate = doc.upload_date ? new Date(doc.upload_date).toLocaleDateString('en-ZA') : 'N/A';
                const fileSize = doc.file_size_bytes ? formatFileSize(doc.file_size_bytes) : 'N/A';
                const fileType = doc.file_type || 'file';
                const category = doc.document_category || 'other';
                
                return `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                ${getFileIconForType(fileType)}
                                <div class="ms-3">
                                    <h6 class="mb-1">${doc.document_name}</h6>
                                    <small class="text-muted">${category} • ${fileSize} • ${uploadDate}</small>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">View</button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="downloadDocument('${doc.id}')">Download</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Render Table View
 */
function renderTableView(docs) {
    const tableView = document.getElementById('tableView');
    if (!tableView) return;
    
    if (docs.length === 0) {
        tableView.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-5x text-muted mb-4"></i>
                <h4>No documents found</h4>
            </div>
        `;
        return;
    }
    
    tableView.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Uploaded</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${docs.map(doc => {
                        const uploadDate = doc.upload_date ? new Date(doc.upload_date).toLocaleDateString('en-ZA') : 'N/A';
                        const expiryDate = doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString('en-ZA') : '-';
                        const fileSize = doc.file_size_bytes ? formatFileSize(doc.file_size_bytes) : 'N/A';
                        const fileType = doc.file_type || 'file';
                        const category = doc.document_category || 'other';
                        const status = doc.status || 'active';
                        
                        const statusBadge = status === 'active' 
                            ? '<span class="badge bg-success">Active</span>'
                            : status === 'archived'
                            ? '<span class="badge bg-secondary">Archived</span>'
                            : '<span class="badge bg-warning">Pending</span>';
                        
                        return `
                            <tr>
                                <td>${doc.document_name}</td>
                                <td><span class="badge bg-primary">${category}</span></td>
                                <td>${fileType.toUpperCase()}</td>
                                <td>${fileSize}</td>
                                <td>${uploadDate}</td>
                                <td>${expiryDate}</td>
                                <td>${statusBadge}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">View</button>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="downloadDocument('${doc.id}')">Download</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Get File Icon for Type
 */
function getFileIconForType(fileType) {
    const type = (fileType || '').toLowerCase();
    if (type.includes('pdf')) {
        return '<i class="fas fa-file-pdf fa-4x text-danger"></i>';
    } else if (type.includes('word') || type.includes('doc')) {
        return '<i class="fas fa-file-word fa-4x text-primary"></i>';
    } else if (type.includes('excel') || type.includes('xls') || type.includes('sheet')) {
        return '<i class="fas fa-file-excel fa-4x text-success"></i>';
    } else if (type.includes('image') || type.includes('jpg') || type.includes('png')) {
        return '<i class="fas fa-file-image fa-4x text-info"></i>';
    } else {
        return '<i class="fas fa-file fa-4x text-secondary"></i>';
    }
}

/**
 * Format File Size
 */
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('[data-view]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Store current view
            documentsData.currentView = view;
            
            // Switch view
            switchView(view);
        });
    });
}

function switchView(view) {
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    const tableView = document.getElementById('tableView');
    
    // Hide all views
    if (gridView) gridView.style.display = 'none';
    if (listView) listView.style.display = 'none';
    if (tableView) tableView.style.display = 'none';
    
    // Show selected view
    switch(view) {
        case 'grid':
            if (gridView) {
                gridView.style.display = 'block';
                renderDocuments();
            }
            break;
        case 'list':
            if (listView) {
                listView.style.display = 'block';
                renderDocuments();
            }
            break;
        case 'table':
            if (tableView) {
                tableView.style.display = 'block';
                renderDocuments();
            }
            break;
    }
}

function setupSidebar() {
    const toggleFilters = document.getElementById('toggleFilters');
    const sidebar = document.getElementById('docSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (toggleFilters && sidebar) {
        toggleFilters.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
    }
    
    // Sidebar menu clicks
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            applyFilter(filter);
        });
    });
}

function setupFilters() {
    // Filter functionality
    const filterInputs = document.querySelectorAll('select, input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    // Apply filters to documents
    renderDocuments();
}

function applyFilter(filter) {
    // Determine if it's a category or status filter
    const categoryFilters = ['all', 'fica', 'agreements', 'cpd', 'qualifications', 'compliance', 'risk', 'insurance', 'financial', 'correspondence', 'other'];
    const statusFilters = ['active', 'expiring', 'expired', 'archived', 'pending'];
    
    if (categoryFilters.includes(filter)) {
        documentsData.filters.category = filter;
    } else if (statusFilters.includes(filter)) {
        documentsData.filters.status = filter;
    }
    
    renderDocuments();
}

function setupSearch() {
    const toggleSearch = document.getElementById('toggleSearch');
    const searchBar = document.getElementById('searchBar');
    
    if (toggleSearch && searchBar) {
        toggleSearch.addEventListener('click', function() {
            searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    const searchInput = document.querySelector('#searchBar input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            documentsData.filters.search = this.value;
            renderDocuments();
        }, 300));
    }
}

function initializeCharts() {
    // Storage by Category Chart
    const ctx = document.getElementById('storageCategoryChart');
    if (ctx && typeof Chart !== 'undefined') {
        const docs = documentsData.documents;
        const categoryCounts = {};
        
        docs.forEach(doc => {
            const cat = doc.document_category || 'Other';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        
        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['No Data'],
                datasets: [{
                    data: data.length > 0 ? data : [1],
                    backgroundColor: [
                        '#5CBDB4',
                        '#17A2B8',
                        '#28A745',
                        '#FFC107',
                        '#DC3545',
                        '#6c757d'
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
}

async function viewDocument(id) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Get document details
        const doc = await dataFunctionsToUse.getDocument(id);
        let document = doc;
        if (doc && doc.data) {
            document = doc.data;
        } else if (doc && Array.isArray(doc) && doc.length > 0) {
            document = doc[0];
        }
        
        if (!document) {
            throw new Error('Document not found');
        }
        
        // Log access
        try {
            await dataFunctionsToUse.logDocumentAccess({
                document_id: id,
                accessed_by: null, // TODO: Get current user ID
                access_type: 'view',
                ip_address: null,
                user_agent: navigator.userAgent
            });
        } catch (e) {
            console.warn('Could not log document access:', e);
        }
        
        // Open document in new window or modal
        if (document.storage_url) {
            window.open(document.storage_url, '_blank');
        } else {
            Swal.fire({
                icon: 'info',
                title: document.document_name,
                html: `
                    <p><strong>Category:</strong> ${document.document_category || 'N/A'}</p>
                    <p><strong>Type:</strong> ${document.file_type || 'N/A'}</p>
                    <p><strong>Size:</strong> ${document.file_size_bytes ? formatFileSize(document.file_size_bytes) : 'N/A'}</p>
                    <p><strong>Uploaded:</strong> ${document.upload_date ? new Date(document.upload_date).toLocaleDateString('en-ZA') : 'N/A'}</p>
                    ${document.description ? `<p><strong>Description:</strong> ${document.description}</p>` : ''}
                `,
                confirmButtonText: 'Close'
            });
        }
        
    } catch (error) {
        console.error('Error viewing document:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load document'
        });
    }
}

async function downloadDocument(id) {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        const doc = await dataFunctionsToUse.getDocument(id);
        let document = doc;
        if (doc && doc.data) {
            document = doc.data;
        } else if (doc && Array.isArray(doc) && doc.length > 0) {
            document = doc[0];
        }
        
        if (!document || !document.storage_url) {
            throw new Error('Document URL not available');
        }
        
        // Log access
        try {
            await dataFunctionsToUse.logDocumentAccess({
                document_id: id,
                accessed_by: null, // TODO: Get current user ID
                access_type: 'download',
                ip_address: null,
                user_agent: navigator.userAgent
            });
        } catch (e) {
            console.warn('Could not log document access:', e);
        }
        
        // Download file
        window.open(document.storage_url, '_blank');
        
    } catch (error) {
        console.error('Error downloading document:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to download document'
        });
    }
}

function switchDocTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Utility function
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

// Export for global access
window.switchDocTab = switchDocTab;
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.loadDocuments = loadDocuments;
