// Document Library JavaScript - Database Integrated

let documentsData = {
    documents: [],
    filters: {
        category: 'all',
        status: 'all',
        documentType: 'all',
        quickFilter: null,
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
        // Charts are handled by storage-analytics.js for the storage tab
        updateActiveFilterStates();
        
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
    const totalEl = document.getElementById('totalDocumentsCount');
    if (totalEl) {
        totalEl.textContent = docs.length;
    }
    
    // Calculate documents added this month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonth = docs.filter(doc => {
        if (!doc.upload_date) return false;
        const uploadDate = new Date(doc.upload_date);
        return uploadDate >= firstDayOfMonth;
    }).length;
    
    const trendEl = document.getElementById('documentsTrend');
    if (trendEl) {
        if (thisMonth > 0) {
            trendEl.textContent = `+${thisMonth} this month`;
            trendEl.className = 'text-success';
        } else {
            trendEl.textContent = 'No new documents this month';
            trendEl.className = 'text-muted';
        }
    }
    
    // Expiring soon (next 30 days) - based on delete_after_date or expiry_date
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringSoon = docs.filter(doc => {
        const expiryDate = doc.delete_after_date || doc.expiry_date;
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;
    
    const expiringEl = document.getElementById('expiringSoonCount');
    if (expiringEl) {
        expiringEl.textContent = expiringSoon;
    }
    
    // Pending review (documents with status 'pending')
    const pendingReview = docs.filter(doc => doc.status === 'pending').length;
    const pendingEl = document.getElementById('pendingReviewCount');
    if (pendingEl) {
        pendingEl.textContent = pendingReview;
    }
    
    // Calculate storage used
    const totalSize = docs.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0);
    const totalSizeGB = totalSize / (1024 * 1024 * 1024);
    const maxSizeGB = 10; // 10GB limit
    const percentUsed = Math.min((totalSizeGB / maxSizeGB) * 100, 100);
    
    // Update storage progress circle
    const progressCircle = document.querySelector('#library .progress-circle-small circle.progress-bar');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 35;
        const offset = circumference - (percentUsed / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    const progressText = document.querySelector('#library .progress-text');
    if (progressText) {
        progressText.textContent = Math.round(percentUsed) + '%';
    }
    
    const storageLabel = document.getElementById('storageUsed');
    if (storageLabel) {
        storageLabel.textContent = `${totalSizeGB.toFixed(2)} GB / ${maxSizeGB} GB`;
    }
    
    const storagePercent = document.getElementById('storagePercent');
    if (storagePercent) {
        storagePercent.textContent = Math.round(percentUsed) + '%';
    }
}

/**
 * Update Sidebar Counts
 */
function updateSidebarCounts() {
    const docs = documentsData.documents;
    
    // Count by document type
    const documentTypeCounts = {};
    docs.forEach(doc => {
        const docType = (doc.document_type || '').toLowerCase();
        documentTypeCounts[docType] = (documentTypeCounts[docType] || 0) + 1;
    });
    
    // Count by category
    const categoryCounts = {};
    docs.forEach(doc => {
        const cat = (doc.document_category || 'other').toLowerCase();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // Update sidebar badges
    const sidebarBadges = document.querySelectorAll('.sidebar-menu .badge');
    sidebarBadges.forEach(badge => {
        const link = badge.closest('a');
        if (link) {
            const filter = link.getAttribute('data-filter');
            const filterType = link.getAttribute('data-filter-type');
            
            if (!filter || filter === 'all') {
                return; // Skip "all" filter
            }
            
            let count = 0;
            
            if (filterType === 'document_type') {
                // Count by document type
                Object.keys(documentTypeCounts).forEach(docType => {
                    if (docType.includes(filter.toLowerCase()) || filter.toLowerCase().includes(docType)) {
                        count += documentTypeCounts[docType];
                    }
                });
            } else if (filterType === 'category') {
                // Count by category
                count = categoryCounts[filter.toLowerCase()] || 0;
            } else if (filterType === 'quick') {
                // Count for quick filters
                const today = new Date();
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(today.getDate() - 7);
                const userId = getCurrentUserId();
                
                switch (filter) {
                    case 'my-docs':
                        if (userId) {
                            count = docs.filter(d => d.uploaded_by === userId).length;
                        } else {
                            count = docs.length;
                        }
                        break;
                    case 'shared':
                        if (userId) {
                            count = docs.filter(d => d.uploaded_by !== userId).length;
                        } else {
                            count = docs.length;
                        }
                        break;
                    case 'recent':
                        count = docs.filter(d => {
                            if (!d.upload_date && !d.created_at) return false;
                            const uploadDate = new Date(d.upload_date || d.created_at);
                            return uploadDate >= sevenDaysAgo;
                        }).length;
                        break;
                    case 'favorites':
                        count = docs.filter(d => (d.access_count || 0) > 5).length;
                        break;
                }
            }
            
            badge.textContent = count;
        }
    });
    
    // Update "All Documents" badge
    const allBadge = document.querySelector('[data-filter="all"] .badge');
    if (allBadge) {
        allBadge.textContent = docs.length;
    }
    
    // Update status badges
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const activeDocs = docs.filter(d => d.status === 'active' || !d.status).length;
    const expiredDocs = docs.filter(d => {
        const expiryDate = d.delete_after_date || d.expiry_date;
        if (!expiryDate) return false;
        return new Date(expiryDate) < today;
    }).length;
    const archivedDocs = docs.filter(d => d.status === 'archived').length;
    const expiringDocs = docs.filter(d => {
        const expiryDate = d.delete_after_date || d.expiry_date;
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;
    const pendingDocs = docs.filter(d => d.status === 'pending').length;
    
    const activeBadge = document.querySelector('[data-filter="active"] .badge');
    if (activeBadge) activeBadge.textContent = activeDocs;
    
    const expiredBadge = document.querySelector('[data-filter="expired"] .badge');
    if (expiredBadge) expiredBadge.textContent = expiredDocs;
    
    const archivedBadge = document.querySelector('[data-filter="archived"] .badge');
    if (archivedBadge) archivedBadge.textContent = archivedDocs;
    
    const expiringBadge = document.querySelector('[data-filter="expiring"] .badge');
    if (expiringBadge) expiringBadge.textContent = expiringDocs;
    
    const pendingBadge = document.querySelector('[data-filter="pending"] .badge');
    if (pendingBadge) pendingBadge.textContent = pendingDocs;
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
    
    // Filter by document type (e.g., cpd_certificate, id_document, etc.)
    if (documentsData.filters.documentType && documentsData.filters.documentType !== 'all') {
        docs = docs.filter(d => {
            const docType = (d.document_type || '').toLowerCase();
            const filterType = documentsData.filters.documentType.toLowerCase();
            // Handle partial matches (e.g., "agreement" matches "client_agreement")
            return docType.includes(filterType) || filterType.includes(docType);
        });
    }
    
    // Filter by category (compliance, regulatory, operational)
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
                const expiryDate = d.delete_after_date || d.expiry_date;
                if (!expiryDate) return false;
                const expiry = new Date(expiryDate);
                return expiry >= today && expiry <= thirtyDaysFromNow;
            });
        } else if (documentsData.filters.status === 'expired') {
            docs = docs.filter(d => {
                const expiryDate = d.delete_after_date || d.expiry_date;
                if (!expiryDate) return false;
                return new Date(expiryDate) < new Date();
            });
        } else {
            docs = docs.filter(d => (d.status || 'active') === documentsData.filters.status);
        }
    }
    
    // Quick filters
    if (documentsData.filters.quickFilter) {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        switch (documentsData.filters.quickFilter) {
            case 'my-docs':
                // Filter by current user (if available)
                const userId = getCurrentUserId();
                if (userId) {
                    docs = docs.filter(d => d.uploaded_by === userId);
                } else {
                    // If no user ID, show all active documents
                    docs = docs.filter(d => d.status === 'active' || !d.status);
                }
                break;
            case 'shared':
                // Documents shared with current user (placeholder - would need sharing table)
                // For now, show documents not uploaded by current user
                const currentUserId = getCurrentUserId();
                if (currentUserId) {
                    docs = docs.filter(d => d.uploaded_by !== currentUserId);
                }
                break;
            case 'recent':
                // Documents uploaded in last 7 days
                docs = docs.filter(d => {
                    if (!d.upload_date && !d.created_at) return false;
                    const uploadDate = new Date(d.upload_date || d.created_at);
                    return uploadDate >= sevenDaysAgo;
                });
                // Sort by most recent first
                docs.sort((a, b) => {
                    const dateA = new Date(a.upload_date || a.created_at || 0);
                    const dateB = new Date(b.upload_date || b.created_at || 0);
                    return dateB - dateA;
                });
                break;
            case 'favorites':
                // Documents marked as favorites (placeholder - would need favorites table)
                // For now, show documents with high access count (frequently viewed)
                docs = docs.filter(d => (d.access_count || 0) > 5);
                docs.sort((a, b) => (b.access_count || 0) - (a.access_count || 0));
                break;
        }
    }
    
    // Filter by search
    if (documentsData.filters.search) {
        const searchLower = documentsData.filters.search.toLowerCase();
        docs = docs.filter(d => {
            return (d.document_name || '').toLowerCase().includes(searchLower) ||
                   (d.description || '').toLowerCase().includes(searchLower) ||
                   (d.file_name || '').toLowerCase().includes(searchLower) ||
                   ((d.tags || []).some(tag => tag.toLowerCase().includes(searchLower)));
        });
    }
    
    return docs;
}

/**
 * Get Current User ID
 */
function getCurrentUserId() {
    try {
        // Try to get from authService
        if (typeof authService !== 'undefined' && authService.user && authService.user.id) {
            return authService.user.id;
        }
        // Try to get from localStorage
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            return user.id || user.user_id || null;
        }
    } catch (e) {
        console.warn('Could not get current user ID:', e);
    }
    return null;
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
            const filterType = this.getAttribute('data-filter-type');
            
            // Update active state - only remove active from same filter type group
            const sameTypeLinks = document.querySelectorAll(`[data-filter-type="${filterType}"]`);
            sameTypeLinks.forEach(l => l.classList.remove('active'));
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
    // Get the filter type from the clicked element
    const clickedLink = document.querySelector(`[data-filter="${filter}"]`);
    const filterType = clickedLink?.getAttribute('data-filter-type') || 'category';
    
    // Reset only the filter type being changed, keep others active
    if (filterType === 'category') {
        documentsData.filters.category = filter === 'all' ? 'all' : filter;
        // Reset document type when changing category
        if (filter === 'all') {
            documentsData.filters.documentType = 'all';
        }
    } else if (filterType === 'status') {
        documentsData.filters.status = filter;
    } else if (filterType === 'document_type') {
        documentsData.filters.documentType = filter;
        // Reset category when changing document type
        documentsData.filters.category = 'all';
    } else if (filterType === 'quick') {
        documentsData.filters.quickFilter = filter;
        // Reset other filters when using quick filter
        documentsData.filters.category = 'all';
        documentsData.filters.documentType = 'all';
        documentsData.filters.status = 'all';
    }
    
    // Clear search when applying sidebar filter
    documentsData.filters.search = '';
    const searchInput = document.querySelector('#searchBar input[type="text"]');
    if (searchInput) {
        searchInput.value = '';
    }
    
    renderDocuments();
    
    // Update active states based on current filters
    updateActiveFilterStates();
}

/**
 * Update Active Filter States in Sidebar
 */
function updateActiveFilterStates() {
    // Remove all active states first
    const allLinks = document.querySelectorAll('.sidebar-menu a');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Set active state for current filters
    if (documentsData.filters.category && documentsData.filters.category !== 'all') {
        const categoryLink = document.querySelector(`[data-filter="${documentsData.filters.category}"][data-filter-type="category"]`);
        if (categoryLink) categoryLink.classList.add('active');
    } else if (documentsData.filters.category === 'all') {
        const allLink = document.querySelector('[data-filter="all"][data-filter-type="category"]');
        if (allLink) allLink.classList.add('active');
    }
    
    if (documentsData.filters.status && documentsData.filters.status !== 'all') {
        const statusLink = document.querySelector(`[data-filter="${documentsData.filters.status}"][data-filter-type="status"]`);
        if (statusLink) statusLink.classList.add('active');
    }
    
    if (documentsData.filters.documentType && documentsData.filters.documentType !== 'all') {
        const typeLink = document.querySelector(`[data-filter="${documentsData.filters.documentType}"][data-filter-type="document_type"]`);
        if (typeLink) typeLink.classList.add('active');
    }
    
    if (documentsData.filters.quickFilter) {
        const quickLink = document.querySelector(`[data-filter="${documentsData.filters.quickFilter}"][data-filter-type="quick"]`);
        if (quickLink) quickLink.classList.add('active');
    }
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
    // Note: The storageCategoryChart canvas is only in the Storage Analytics tab
    // and is managed by storage-analytics.js, so we don't create charts here
    // This function is kept for potential future chart needs in the library tab
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
window.formatFileSize = formatFileSize;
window.getFileIconForType = getFileIconForType;
