/**
 * Global Search Functionality
 * Provides unified search across representatives, clients, and documents
 */

var GlobalSearch = (function() {
    'use strict';

    let searchTimeout = null;
    let searchResults = [];
    let isSearchOpen = false;

    /**
     * Initialize global search
     */
    function init() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;

        // Create search results container
        createSearchResultsContainer();

        // Event listeners
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', handleSearchFocus);
        searchInput.addEventListener('blur', handleSearchBlur);
        searchInput.addEventListener('keydown', handleSearchKeydown);

        // Keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });

        // Close search on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isSearchOpen) {
                closeSearch();
            }
        });
    }

    /**
     * Create search results container
     */
    function createSearchResultsContainer() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;

        const searchContainer = searchInput.closest('.global-search');
        if (!searchContainer) return;

        // Check if container already exists
        if (document.getElementById('searchResultsContainer')) return;

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResultsContainer';
        resultsContainer.className = 'search-results-container';
        searchContainer.appendChild(resultsContainer);
    }

    /**
     * Handle search input
     */
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // If query is too short, clear results
        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    }

    /**
     * Handle search focus
     */
    function handleSearchFocus(e) {
        const query = e.target.value.trim();
        if (query.length >= 2 && searchResults.length > 0) {
            showSearchResults();
        }
    }

    /**
     * Handle search blur
     */
    function handleSearchBlur(e) {
        // Delay to allow click events on results
        setTimeout(() => {
            if (!document.querySelector('.search-results-container:hover')) {
                closeSearch();
            }
        }, 200);
    }

    /**
     * Handle keyboard navigation in search
     */
    function handleSearchKeydown(e) {
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (!resultsContainer || !isSearchOpen) return;

        const activeResult = resultsContainer.querySelector('.search-result-item.active');
        const allResults = resultsContainer.querySelectorAll('.search-result-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeResult) {
                activeResult.classList.remove('active');
                const next = activeResult.nextElementSibling || allResults[0];
                if (next) {
                    next.classList.add('active');
                    next.scrollIntoView({ block: 'nearest' });
                }
            } else if (allResults.length > 0) {
                allResults[0].classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeResult) {
                activeResult.classList.remove('active');
                const prev = activeResult.previousElementSibling || allResults[allResults.length - 1];
                if (prev) {
                    prev.classList.add('active');
                    prev.scrollIntoView({ block: 'nearest' });
                }
            } else if (allResults.length > 0) {
                allResults[allResults.length - 1].classList.add('active');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeResult) {
                const link = activeResult.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        }
    }

    /**
     * Perform search across all entities
     */
    async function performSearch(query) {
        try {
            showSearchLoading();

            // Perform parallel searches
            const [representatives, clients, documents] = await Promise.all([
                searchRepresentatives(query),
                searchClients(query),
                searchDocuments(query)
            ]);

            searchResults = {
                representatives: representatives || [],
                clients: clients || [],
                documents: documents || []
            };

            displaySearchResults(query);
        } catch (error) {
            console.error('Search error:', error);
            showSearchError(error.message);
        }
    }

    /**
     * Search representatives
     */
    async function searchRepresentatives(query) {
        try {
            if (typeof dataFunctions === 'undefined' || !dataFunctions.getRepresentatives) {
                return [];
            }

            const result = await dataFunctions.getRepresentatives('all');
            let reps = result;
            
            // Handle different response formats
            if (result && result.data) {
                reps = result.data;
            } else if (Array.isArray(result)) {
                reps = result;
            } else {
                reps = [];
            }

            // Filter by search query
            const lowerQuery = query.toLowerCase();
            return reps.filter(rep => {
                const name = `${rep.first_name || ''} ${rep.last_name || ''}`.toLowerCase();
                const fspNumber = (rep.fsp_number_new || rep.fsp_number || '').toLowerCase();
                const email = (rep.email || '').toLowerCase();
                const idNumber = (rep.id_number || '').toLowerCase();

                return name.includes(lowerQuery) ||
                       fspNumber.includes(lowerQuery) ||
                       email.includes(lowerQuery) ||
                       idNumber.includes(lowerQuery);
            }).slice(0, 5); // Limit to 5 results
        } catch (error) {
            console.error('Error searching representatives:', error);
            return [];
        }
    }

    /**
     * Search clients
     */
    async function searchClients(query) {
        try {
            if (typeof dataFunctions === 'undefined' || !dataFunctions.getClients) {
                return [];
            }

            const result = await dataFunctions.getClients();
            let clients = result;
            
            // Handle different response formats
            if (result && result.data) {
                clients = result.data;
            } else if (Array.isArray(result)) {
                clients = result;
            } else {
                clients = [];
            }

            // Filter by search query
            const lowerQuery = query.toLowerCase();
            return clients.filter(client => {
                const name = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
                const idNumber = (client.id_number || '').toLowerCase();
                const email = (client.email || '').toLowerCase();
                const phone = (client.phone || '').toLowerCase();

                return name.includes(lowerQuery) ||
                       idNumber.includes(lowerQuery) ||
                       email.includes(lowerQuery) ||
                       phone.includes(lowerQuery);
            }).slice(0, 5); // Limit to 5 results
        } catch (error) {
            console.error('Error searching clients:', error);
            return [];
        }
    }

    /**
     * Search documents
     */
    async function searchDocuments(query) {
        try {
            if (typeof dataFunctions === 'undefined' || !dataFunctions.getDocuments) {
                return [];
            }

            const result = await dataFunctions.getDocuments();
            let docs = result;
            
            // Handle different response formats
            if (result && result.data) {
                docs = result.data;
            } else if (Array.isArray(result)) {
                docs = result;
            } else {
                docs = [];
            }

            // Filter by search query
            const lowerQuery = query.toLowerCase();
            return docs.filter(doc => {
                const name = (doc.document_name || doc.file_name || '').toLowerCase();
                const type = (doc.document_type || '').toLowerCase();
                const category = (doc.document_category || '').toLowerCase();
                const description = (doc.description || '').toLowerCase();

                return name.includes(lowerQuery) ||
                       type.includes(lowerQuery) ||
                       category.includes(lowerQuery) ||
                       description.includes(lowerQuery);
            }).slice(0, 5); // Limit to 5 results
        } catch (error) {
            console.error('Error searching documents:', error);
            return [];
        }
    }

    /**
     * Display search results
     */
    function displaySearchResults(query) {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;

        const totalResults = 
            searchResults.representatives.length +
            searchResults.clients.length +
            searchResults.documents.length;

        if (totalResults === 0) {
            container.innerHTML = `
                <div class="search-results-empty">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
            showSearchResults();
            return;
        }

        let html = '';

        // Representatives section
        if (searchResults.representatives.length > 0) {
            html += `
                <div class="search-results-section">
                    <div class="search-results-header">
                        <i class="fas fa-user-tie"></i>
                        <span>Representatives (${searchResults.representatives.length})</span>
                    </div>
                    <div class="search-results-list">
                        ${searchResults.representatives.map(rep => `
                            <div class="search-result-item" data-type="representative" data-id="${rep.id}">
                                <a href="#" onclick="event.preventDefault(); GlobalSearch.navigateToRepresentative('${rep.id}'); return false;">
                                    <div class="search-result-icon">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <div class="search-result-content">
                                        <div class="search-result-title">${escapeHtml(`${rep.first_name || ''} ${rep.last_name || ''}`.trim())}</div>
                                        <div class="search-result-subtitle">${escapeHtml(rep.fsp_number_new || rep.fsp_number || 'N/A')}</div>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Clients section
        if (searchResults.clients.length > 0) {
            html += `
                <div class="search-results-section">
                    <div class="search-results-header">
                        <i class="fas fa-users"></i>
                        <span>Clients (${searchResults.clients.length})</span>
                    </div>
                    <div class="search-results-list">
                        ${searchResults.clients.map(client => `
                            <div class="search-result-item" data-type="client" data-id="${client.id}">
                                <a href="#" onclick="event.preventDefault(); GlobalSearch.navigateToClient('${client.id}'); return false;">
                                    <div class="search-result-icon">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="search-result-content">
                                        <div class="search-result-title">${escapeHtml(`${client.first_name || ''} ${client.last_name || ''}`.trim())}</div>
                                        <div class="search-result-subtitle">${escapeHtml(client.id_number || 'N/A')}</div>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Documents section
        if (searchResults.documents.length > 0) {
            html += `
                <div class="search-results-section">
                    <div class="search-results-header">
                        <i class="fas fa-file"></i>
                        <span>Documents (${searchResults.documents.length})</span>
                    </div>
                    <div class="search-results-list">
                        ${searchResults.documents.map(doc => `
                            <div class="search-result-item" data-type="document" data-id="${doc.id}">
                                <a href="#" onclick="event.preventDefault(); GlobalSearch.navigateToDocument('${doc.id}'); return false;">
                                    <div class="search-result-icon">
                                        <i class="fas fa-file-${getDocumentIcon(doc.document_type)}"></i>
                                    </div>
                                    <div class="search-result-content">
                                        <div class="search-result-title">${escapeHtml(doc.document_name || doc.file_name || 'Untitled')}</div>
                                        <div class="search-result-subtitle">${escapeHtml(doc.document_type || 'Document')}</div>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        showSearchResults();
    }

    /**
     * Show search loading state
     */
    function showSearchLoading() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="search-results-loading">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>Searching...</span>
            </div>
        `;
        showSearchResults();
    }

    /**
     * Show search error
     */
    function showSearchError(message) {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="search-results-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        showSearchResults();
    }

    /**
     * Show search results container
     */
    function showSearchResults() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;

        container.style.display = 'block';
        isSearchOpen = true;
    }

    /**
     * Hide search results container
     */
    function hideSearchResults() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;

        container.style.display = 'none';
        isSearchOpen = false;
    }

    /**
     * Close search
     */
    function closeSearch() {
        hideSearchResults();
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.blur();
        }
    }

    /**
     * Navigate to representative
     */
    function navigateToRepresentative(id) {
        closeSearch();
        if (typeof _appRouter !== 'undefined') {
            _appRouter.routeTo('representatives-grid');
            // TODO: Navigate to specific representative detail page
            setTimeout(() => {
                // Could trigger a filter or highlight
                console.log('Navigate to representative:', id);
            }, 500);
        }
    }

    /**
     * Navigate to client
     */
    function navigateToClient(id) {
        closeSearch();
        // TODO: Navigate to client detail page
        console.log('Navigate to client:', id);
    }

    /**
     * Navigate to document
     */
    function navigateToDocument(id) {
        closeSearch();
        // TODO: Navigate to document detail page
        console.log('Navigate to document:', id);
    }

    /**
     * Get document icon based on type
     */
    function getDocumentIcon(type) {
        const iconMap = {
            'pdf': 'pdf',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'docx': 'word',
            'xlsx': 'excel',
            'cpd_certificate': 'certificate',
            'id_document': 'id-card',
            'proof_of_address': 'address-card'
        };
        return iconMap[type?.toLowerCase()] || 'alt';
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        init: init,
        close: closeSearch,
        navigateToRepresentative: navigateToRepresentative,
        navigateToClient: navigateToClient,
        navigateToDocument: navigateToDocument
    };
})();

