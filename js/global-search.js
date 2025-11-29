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
                console.warn('dataFunctions.getRepresentatives not available');
                return [];
            }

            // Get all representatives - pass null to get all statuses
            const result = await dataFunctions.getRepresentatives(null);
            let reps = result;
            
            // Handle different response formats
            if (result && result.data) {
                reps = result.data;
            } else if (Array.isArray(result)) {
                reps = result;
            } else if (result && typeof result === 'object') {
                // Try to extract array from object
                reps = Object.values(result).find(v => Array.isArray(v)) || [];
            } else {
                reps = [];
            }

            // Debug logging
            if (reps.length === 0) {
                console.warn('No representatives loaded for search. Result:', result);
            }

            // Filter by search query
            const lowerQuery = query.toLowerCase();
            const filtered = reps.filter(rep => {
                if (!rep) return false;
                
                const firstName = (rep.first_name || '').toLowerCase();
                const surname = (rep.surname || rep.last_name || '').toLowerCase();
                const fullName = `${firstName} ${surname}`.trim();
                const fspNumber = (rep.fsp_number_new || rep.fsp_number || rep.representative_number || '').toLowerCase();
                const email = (rep.email || '').toLowerCase();
                const idNumber = (rep.id_number || '').toLowerCase();

                return fullName.includes(lowerQuery) ||
                       firstName.includes(lowerQuery) ||
                       surname.includes(lowerQuery) ||
                       fspNumber.includes(lowerQuery) ||
                       email.includes(lowerQuery) ||
                       idNumber.includes(lowerQuery);
            }).slice(0, 5); // Limit to 5 results

            console.log(`Search for "${query}": Found ${filtered.length} representatives from ${reps.length} total`);
            return filtered;
        } catch (error) {
            console.error('Error searching representatives:', error);
            console.error('Error details:', error.stack);
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
                // Handle both individual and corporate clients
                const name = client.client_type === 'corporate' 
                    ? (client.company_name || '').toLowerCase()
                    : `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
                const idNumber = (client.id_number || '').toLowerCase();
                const email = (client.email || '').toLowerCase();
                const phone = (client.phone || client.mobile || '').toLowerCase();
                const registrationNumber = (client.registration_number || '').toLowerCase();

                return name.includes(lowerQuery) ||
                       idNumber.includes(lowerQuery) ||
                       email.includes(lowerQuery) ||
                       phone.includes(lowerQuery) ||
                       registrationNumber.includes(lowerQuery);
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
                                        <div class="search-result-title">${escapeHtml(`${rep.first_name || ''} ${rep.surname || rep.last_name || ''}`.trim())}</div>
                                        <div class="search-result-subtitle">${escapeHtml(rep.fsp_number_new || rep.fsp_number || rep.representative_number || 'N/A')}</div>
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
                                        <div class="search-result-title">${escapeHtml(client.client_type === 'corporate' ? (client.company_name || 'Corporate Client') : `${client.first_name || ''} ${client.last_name || ''}`.trim())}</div>
                                        <div class="search-result-subtitle">${escapeHtml(client.client_type === 'corporate' ? (client.registration_number || 'N/A') : (client.id_number || 'N/A'))}</div>
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
     * Helper function to switch tab in iframe and execute action
     */
    function switchTabAndExecute(dashboardContent, tabId, actionFn, retries = 15) {
        const iframe = dashboardContent?.querySelector('iframe');
        
        if (iframe && iframe.contentWindow) {
            try {
                // Try postMessage first
                iframe.contentWindow.postMessage({ action: 'switchTab', tab: tabId }, '*');
                
                // Wait a bit for tab to switch, then execute action
                setTimeout(() => {
                    if (actionFn && typeof actionFn === 'function') {
                        actionFn(iframe.contentWindow);
                    }
                }, 300);
                
                return true;
            } catch (e) {
                console.warn('Could not communicate with iframe:', e);
                return false;
            }
        } else if (retries > 0) {
            // Retry after a short delay if iframe not ready
            setTimeout(() => switchTabAndExecute(dashboardContent, tabId, actionFn, retries - 1), 200);
            return false;
        }
        return false;
    }

    /**
     * Navigate to representative
     */
    function navigateToRepresentative(id) {
        closeSearch();
        console.log('🔍 Navigating to representative:', id);
        
        // Store the ID for later use
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('pendingViewRepId', id);
        }
        
        const dashboardContent = document.getElementById('dashboardContent') || document.getElementById('content-area');
        
        // Navigate to representatives module
        if (typeof handleRoute !== 'undefined') {
            handleRoute('representatives');
        } else if (window.location.hash !== '#representatives') {
            window.location.hash = '#representatives';
        }
        
        // Wait for iframe to load, then switch to directory tab and view profile
        let retryCount = 0;
        const maxRetries = 25;
        
        const attemptNavigation = () => {
            retryCount++;
            const currentDashboardContent = document.getElementById('dashboardContent') || document.getElementById('content-area');
            const iframe = currentDashboardContent?.querySelector('iframe');
            
            if (!iframe || !iframe.contentWindow) {
                if (retryCount < maxRetries) {
                    setTimeout(attemptNavigation, 200);
                } else {
                    console.error('❌ Failed to find iframe after', maxRetries, 'retries');
                }
                return;
            }
            
            const iframeWindow = iframe.contentWindow;
            const iframeDoc = iframe.contentDocument || iframeWindow.document;
            
            console.log('✅ Iframe found, attempting to switch tab');
            
            try {
                // Listen for tab shown event in iframe
                const directoryTab = iframeDoc?.getElementById('directory-tab');
                if (directoryTab) {
                    // Add one-time event listener for when tab is shown
                    const handleTabShown = () => {
                        console.log('📑 Directory tab shown, waiting for data...');
                        // Remove listener
                        directoryTab.removeEventListener('shown.bs.tab', handleTabShown);
                        
                        // Wait a bit for data to load, then view profile
                        const viewProfileAfterLoad = (attempts = 0) => {
                            if (attempts > 20) {
                                console.error('❌ Timeout waiting for data to load');
                                return;
                            }
                            
                            if (iframeWindow.viewRepProfile) {
                                console.log('✅ viewRepProfile available, calling with ID:', id);
                                // Call viewRepProfile - it will handle loading data if needed
                                try {
                                    iframeWindow.viewRepProfile(id);
                                    // Clear stored ID
                                    if (typeof sessionStorage !== 'undefined') {
                                        sessionStorage.removeItem('pendingViewRepId');
                                    }
                                } catch (error) {
                                    console.error('❌ Error calling viewRepProfile:', error);
                                }
                            } else {
                                console.log('⏳ Waiting for viewRepProfile, attempt:', attempts + 1);
                                setTimeout(() => viewProfileAfterLoad(attempts + 1), 200);
                            }
                        };
                        
                        setTimeout(() => viewProfileAfterLoad(), 500);
                    };
                    
                    directoryTab.addEventListener('shown.bs.tab', handleTabShown);
                }
                
                // Switch to directory tab
                if (iframeWindow.switchRepsTab) {
                    console.log('🔄 Using switchRepsTab function');
                    iframeWindow.switchRepsTab('directory-tab');
                } else if (directoryTab) {
                    console.log('🔄 Using Bootstrap tab API');
                    try {
                        if (iframeWindow.bootstrap && iframeWindow.bootstrap.Tab) {
                            const tab = new iframeWindow.bootstrap.Tab(directoryTab);
                            tab.show();
                        } else {
                            directoryTab.click();
                        }
                    } catch (e) {
                        console.warn('⚠️ Error using Bootstrap Tab API, clicking tab:', e);
                        directoryTab.click();
                    }
                } else {
                    console.warn('⚠️ Could not find directory tab element');
                    // Fallback: try to view profile anyway after delay
                    setTimeout(() => {
                        if (iframeWindow.viewRepProfile) {
                            iframeWindow.viewRepProfile(id);
                        }
                    }, 2000);
                }
                
            } catch (error) {
                console.error('❌ Error navigating to representative:', error);
                // Fallback: try to view profile anyway
                setTimeout(() => {
                    if (iframeWindow.viewRepProfile) {
                        iframeWindow.viewRepProfile(id);
                    }
                }, 2000);
            }
        };
        
        // Start attempting navigation after initial delay
        setTimeout(attemptNavigation, 1200);
    }

    /**
     * Navigate to client
     */
    function navigateToClient(id) {
        closeSearch();
        
        const dashboardContent = document.getElementById('dashboardContent') || document.getElementById('content-area');
        
        // Navigate to clients-fica module
        if (typeof handleRoute !== 'undefined') {
            handleRoute('clients-fica');
        } else if (window.location.hash !== '#clients-fica') {
            window.location.hash = '#clients-fica';
        }
        
        // Wait for iframe to load, then switch to portfolio tab and view profile
        setTimeout(() => {
            const currentDashboardContent = document.getElementById('dashboardContent') || document.getElementById('content-area');
            switchTabAndExecute(currentDashboardContent, 'portfolio-tab', (iframeWindow) => {
                // Try direct function calls
                if (iframeWindow.switchClientsFicaTab) {
                    iframeWindow.switchClientsFicaTab('portfolio-tab');
                }
                
                // Wait a bit more for tab to fully switch, then view profile
                setTimeout(() => {
                    if (iframeWindow.viewClientProfile) {
                        iframeWindow.viewClientProfile(id);
                    } else {
                        console.log('viewClientProfile function not found in iframe');
                    }
                }, 400);
            });
        }, 1000);
    }

    /**
     * Navigate to document
     */
    function navigateToDocument(id) {
        closeSearch();
        
        // Navigate to documents module
        if (typeof handleRoute !== 'undefined') {
            handleRoute('documents');
        } else if (window.location.hash !== '#documents') {
            window.location.hash = '#documents';
        }
        
        // Store document ID for potential future use
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('selectedDocumentId', id);
        }
        
        // TODO: Implement document detail view when available
        // For now, just navigate to documents module
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

