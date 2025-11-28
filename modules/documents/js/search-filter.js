// Search & Filter JavaScript - Database Integrated

let searchFilterData = {
    documents: [],
    filters: {
        searchQuery: '',
        documentType: 'all',
        documentCategory: 'all',
        fileType: 'all',
        status: 'all',
        ownerType: 'all',
        dateFrom: null,
        dateTo: null,
        sizeMin: null,
        sizeMax: null,
        tags: []
    },
    results: [],
    sortBy: 'upload_date',
    sortOrder: 'desc'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFilter();
});

async function initializeSearchFilter() {
    const searchTab = document.getElementById('search-tab');
    if (searchTab) {
        searchTab.addEventListener('shown.bs.tab', function() {
            loadDocumentsForSearch();
        });
    }
    
    setupSearchInputs();
    setupFilterControls();
    setupSortControls();
}

/**
 * Load Documents for Search
 */
async function loadDocumentsForSearch() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all documents
        const result = await dataFunctionsToUse.getDocuments(null, null, null, null);
        let documents = result;
        if (result && result.data) {
            documents = result.data;
        } else if (result && Array.isArray(result)) {
            documents = result;
        }
        
        searchFilterData.documents = documents || [];
        applySearchFilters();
        
    } catch (error) {
        console.error('Error loading documents for search:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load documents for search'
        });
    }
}

/**
 * Setup Search Inputs
 */
function setupSearchInputs() {
    // Main search input
    const searchInput = document.querySelector('#search input[type="text"][placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchFilterData.filters.searchQuery = this.value.trim();
            applySearchFilters();
        }, 300));
    }
    
    // Tag search input
    const tagInput = document.querySelector('#search input[placeholder*="tag"]');
    if (tagInput) {
        tagInput.addEventListener('input', debounce(function() {
            const tags = this.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
            searchFilterData.filters.tags = tags;
            applySearchFilters();
        }, 300));
    }
}

/**
 * Setup Filter Controls
 */
function setupFilterControls() {
    // Document Type filter
    const docTypeFilter = document.querySelector('#search select[name="documentType"], #search select[id="documentTypeFilter"]');
    if (docTypeFilter) {
        docTypeFilter.addEventListener('change', function() {
            searchFilterData.filters.documentType = this.value;
            applySearchFilters();
        });
    }
    
    // Category filter
    const categoryFilter = document.querySelector('#search select[name="category"], #search select[id="categoryFilter"]');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            searchFilterData.filters.documentCategory = this.value;
            applySearchFilters();
        });
    }
    
    // File Type filter
    const fileTypeFilter = document.querySelector('#search select[name="fileType"], #search select[id="fileTypeFilter"]');
    if (fileTypeFilter) {
        fileTypeFilter.addEventListener('change', function() {
            searchFilterData.filters.fileType = this.value;
            applySearchFilters();
        });
    }
    
    // Status filter
    const statusFilter = document.querySelector('#search select[name="status"], #search select[id="statusFilter"]');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            searchFilterData.filters.status = this.value;
            applySearchFilters();
        });
    }
    
    // Owner Type filter
    const ownerTypeFilter = document.querySelector('#search select[name="ownerType"], #search select[id="ownerTypeFilter"]');
    if (ownerTypeFilter) {
        ownerTypeFilter.addEventListener('change', function() {
            searchFilterData.filters.ownerType = this.value;
            applySearchFilters();
        });
    }
    
    // Date range filters
    const dateFromInput = document.querySelector('#search input[name="dateFrom"], #search input[id="dateFrom"]');
    if (dateFromInput) {
        dateFromInput.addEventListener('change', function() {
            searchFilterData.filters.dateFrom = this.value || null;
            applySearchFilters();
        });
    }
    
    const dateToInput = document.querySelector('#search input[name="dateTo"], #search input[id="dateTo"]');
    if (dateToInput) {
        dateToInput.addEventListener('change', function() {
            searchFilterData.filters.dateTo = this.value || null;
            applySearchFilters();
        });
    }
    
    // Size filters
    const sizeMinInput = document.querySelector('#search input[name="sizeMin"], #search input[id="sizeMin"]');
    if (sizeMinInput) {
        sizeMinInput.addEventListener('change', function() {
            searchFilterData.filters.sizeMin = this.value ? parseFloat(this.value) : null;
            applySearchFilters();
        });
    }
    
    const sizeMaxInput = document.querySelector('#search input[name="sizeMax"], #search input[id="sizeMax"]');
    if (sizeMaxInput) {
        sizeMaxInput.addEventListener('change', function() {
            searchFilterData.filters.sizeMax = this.value ? parseFloat(this.value) : null;
            applySearchFilters();
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.querySelector('#search button[onclick*="clear"], #search .btn[data-action="clear"]');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

/**
 * Setup Sort Controls
 */
function setupSortControls() {
    const sortSelect = document.querySelector('#search select[name="sortBy"], #search select[id="sortBy"]');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const [field, order] = this.value.split('_');
            searchFilterData.sortBy = field;
            searchFilterData.sortOrder = order;
            applySearchFilters();
        });
    }
}

/**
 * Apply Search Filters
 */
function applySearchFilters() {
    let results = [...searchFilterData.documents];
    
    // Text search
    if (searchFilterData.filters.searchQuery) {
        const query = searchFilterData.filters.searchQuery.toLowerCase();
        results = results.filter(doc => {
            return (doc.document_name || '').toLowerCase().includes(query) ||
                   (doc.description || '').toLowerCase().includes(query) ||
                   (doc.file_name || '').toLowerCase().includes(query) ||
                   (doc.document_owner_type || '').toLowerCase().includes(query);
        });
    }
    
    // Tag search
    if (searchFilterData.filters.tags.length > 0) {
        results = results.filter(doc => {
            const docTags = (doc.tags || []).map(t => t.toLowerCase());
            return searchFilterData.filters.tags.some(tag => 
                docTags.some(docTag => docTag.includes(tag.toLowerCase()))
            );
        });
    }
    
    // Document Type filter
    if (searchFilterData.filters.documentType && searchFilterData.filters.documentType !== 'all') {
        results = results.filter(doc => {
            const docType = (doc.document_type || '').toLowerCase();
            return docType.includes(searchFilterData.filters.documentType.toLowerCase());
        });
    }
    
    // Category filter
    if (searchFilterData.filters.documentCategory && searchFilterData.filters.documentCategory !== 'all') {
        results = results.filter(doc => {
            return (doc.document_category || '').toLowerCase() === searchFilterData.filters.documentCategory.toLowerCase();
        });
    }
    
    // File Type filter
    if (searchFilterData.filters.fileType && searchFilterData.filters.fileType !== 'all') {
        results = results.filter(doc => {
            const fileType = (doc.file_type || '').toLowerCase();
            return fileType.includes(searchFilterData.filters.fileType.toLowerCase());
        });
    }
    
    // Status filter
    if (searchFilterData.filters.status && searchFilterData.filters.status !== 'all') {
        if (searchFilterData.filters.status === 'expiring') {
            const today = new Date();
            const thirtyDaysFromNow = new Date(today);
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            results = results.filter(doc => {
                const expiryDate = doc.delete_after_date || doc.expiry_date;
                if (!expiryDate) return false;
                const expiry = new Date(expiryDate);
                return expiry >= today && expiry <= thirtyDaysFromNow;
            });
        } else if (searchFilterData.filters.status === 'expired') {
            results = results.filter(doc => {
                const expiryDate = doc.delete_after_date || doc.expiry_date;
                if (!expiryDate) return false;
                return new Date(expiryDate) < new Date();
            });
        } else {
            results = results.filter(doc => (doc.status || 'active') === searchFilterData.filters.status);
        }
    }
    
    // Owner Type filter
    if (searchFilterData.filters.ownerType && searchFilterData.filters.ownerType !== 'all') {
        results = results.filter(doc => {
            return (doc.document_owner_type || '').toLowerCase() === searchFilterData.filters.ownerType.toLowerCase();
        });
    }
    
    // Date range filter
    if (searchFilterData.filters.dateFrom) {
        const fromDate = new Date(searchFilterData.filters.dateFrom);
        results = results.filter(doc => {
            const docDate = doc.upload_date || doc.document_date || doc.created_at;
            if (!docDate) return false;
            return new Date(docDate) >= fromDate;
        });
    }
    
    if (searchFilterData.filters.dateTo) {
        const toDate = new Date(searchFilterData.filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        results = results.filter(doc => {
            const docDate = doc.upload_date || doc.document_date || doc.created_at;
            if (!docDate) return false;
            return new Date(docDate) <= toDate;
        });
    }
    
    // Size filters (in MB)
    if (searchFilterData.filters.sizeMin !== null) {
        const minBytes = searchFilterData.filters.sizeMin * 1024 * 1024;
        results = results.filter(doc => (doc.file_size_bytes || 0) >= minBytes);
    }
    
    if (searchFilterData.filters.sizeMax !== null) {
        const maxBytes = searchFilterData.filters.sizeMax * 1024 * 1024;
        results = results.filter(doc => (doc.file_size_bytes || 0) <= maxBytes);
    }
    
    // Sort results
    results.sort((a, b) => {
        let aVal, bVal;
        
        switch (searchFilterData.sortBy) {
            case 'name':
                aVal = (a.document_name || '').toLowerCase();
                bVal = (b.document_name || '').toLowerCase();
                break;
            case 'size':
                aVal = a.file_size_bytes || 0;
                bVal = b.file_size_bytes || 0;
                break;
            case 'upload_date':
            default:
                aVal = new Date(a.upload_date || a.created_at || 0);
                bVal = new Date(b.upload_date || b.created_at || 0);
                break;
        }
        
        if (searchFilterData.sortOrder === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
    
    searchFilterData.results = results;
    renderSearchResults();
    updateSearchStats();
}

/**
 * Render Search Results
 */
function renderSearchResults() {
    const resultsContainer = document.getElementById('searchResultsContainer');
    if (!resultsContainer) return;
    
    const results = searchFilterData.results;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-5x text-muted mb-4"></i>
                <h4>No documents found</h4>
                <p class="text-muted">Try adjusting your search criteria or filters</p>
                <button class="btn btn-primary mt-3" onclick="clearAllFilters()">
                    <i class="fas fa-times me-2"></i>Clear All Filters
                </button>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Document Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Owner</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(doc => {
                        const uploadDate = doc.upload_date ? new Date(doc.upload_date).toLocaleDateString('en-ZA') : 'N/A';
                        const fileSize = doc.file_size_bytes ? formatFileSize(doc.file_size_bytes) : 'N/A';
                        const fileType = doc.file_type || 'file';
                        const category = doc.document_category || 'other';
                        const status = doc.status || 'active';
                        const ownerType = doc.document_owner_type || 'unknown';
                        
                        const statusBadge = status === 'active' 
                            ? '<span class="badge bg-success">Active</span>'
                            : status === 'archived'
                            ? '<span class="badge bg-secondary">Archived</span>'
                            : '<span class="badge bg-warning">Pending</span>';
                        
                        return `
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        ${getFileIconForType(fileType, 'small')}
                                        <div class="ms-2">
                                            <strong>${doc.document_name}</strong>
                                            ${doc.description ? `<br><small class="text-muted">${doc.description.substring(0, 50)}${doc.description.length > 50 ? '...' : ''}</small>` : ''}
                                        </div>
                                    </div>
                                </td>
                                <td><span class="badge bg-info">${fileType.toUpperCase()}</span></td>
                                <td><span class="badge bg-primary">${category}</span></td>
                                <td><small>${ownerType}</small></td>
                                <td>${fileSize}</td>
                                <td>${uploadDate}</td>
                                <td>${statusBadge}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="downloadDocument('${doc.id}')" title="Download">
                                        <i class="fas fa-download"></i>
                                    </button>
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
 * Get File Icon for Type (small version)
 */
function getFileIconForType(fileType, size = 'normal') {
    // Use local implementation to avoid conflicts
    const type = (fileType || '').toLowerCase();
    const iconSize = size === 'small' ? 'fa-2x' : 'fa-4x';
    
    if (type.includes('pdf')) {
        return `<i class="fas fa-file-pdf ${iconSize} text-danger"></i>`;
    } else if (type.includes('word') || type.includes('doc')) {
        return `<i class="fas fa-file-word ${iconSize} text-primary"></i>`;
    } else if (type.includes('excel') || type.includes('xls') || type.includes('sheet')) {
        return `<i class="fas fa-file-excel ${iconSize} text-success"></i>`;
    } else if (type.includes('image') || type.includes('jpg') || type.includes('png')) {
        return `<i class="fas fa-file-image ${iconSize} text-info"></i>`;
    } else {
        return `<i class="fas fa-file ${iconSize} text-secondary"></i>`;
    }
}

/**
 * Format File Size
 */
function formatFileSize(bytes) {
    // Fallback implementation (don't call window.formatFileSize to avoid recursion)
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Update Search Statistics
 */
function updateSearchStats() {
    const totalDocs = searchFilterData.documents.length;
    const filteredDocs = searchFilterData.results.length;
    
    const statsEl = document.getElementById('searchStats');
    if (statsEl) {
        statsEl.textContent = `Showing ${filteredDocs} of ${totalDocs} documents`;
    }
    
    // Update active filter count badge
    const activeFiltersCount = Object.values(searchFilterData.filters).filter(v => {
        if (Array.isArray(v)) return v.length > 0;
        return v && v !== 'all' && v !== '';
    }).length;
    
    const filterBadge = document.getElementById('activeFiltersBadge');
    if (filterBadge) {
        if (activeFiltersCount > 0) {
            filterBadge.textContent = activeFiltersCount;
            filterBadge.style.display = 'inline-block';
        } else {
            filterBadge.style.display = 'none';
        }
    }
}

/**
 * Clear All Filters
 */
function clearAllFilters() {
    searchFilterData.filters = {
        searchQuery: '',
        documentType: 'all',
        documentCategory: 'all',
        fileType: 'all',
        status: 'all',
        ownerType: 'all',
        dateFrom: null,
        dateTo: null,
        sizeMin: null,
        sizeMax: null,
        tags: []
    };
    
    // Reset all form inputs
    const searchInput = document.querySelector('#search input[type="text"][placeholder*="Search"]');
    if (searchInput) searchInput.value = '';
    
    const tagInput = document.querySelector('#search input[placeholder*="tag"]');
    if (tagInput) tagInput.value = '';
    
    const selects = document.querySelectorAll('#search select');
    selects.forEach(select => {
        if (select.options.length > 0) {
            select.selectedIndex = 0;
        }
    });
    
    const dateInputs = document.querySelectorAll('#search input[type="date"]');
    dateInputs.forEach(input => input.value = '');
    
    const sizeInputs = document.querySelectorAll('#search input[type="number"]');
    sizeInputs.forEach(input => input.value = '');
    
    applySearchFilters();
    
    Swal.fire({
        icon: 'success',
        title: 'Filters Cleared',
        text: 'All search filters have been reset',
        timer: 1500,
        showConfirmButton: false
    });
}

/**
 * Debounce Utility
 */
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
window.clearAllFilters = clearAllFilters;
window.loadDocumentsForSearch = loadDocumentsForSearch;

