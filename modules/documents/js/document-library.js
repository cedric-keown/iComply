// Document Library JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDocumentLibrary();
    initializeCharts();
    setupViewToggle();
    setupSidebar();
});

function initializeDocumentLibrary() {
    setupFilters();
    setupSearch();
    setupDocumentCards();
}

function initializeCharts() {
    // Storage by Category Chart
    const ctx = document.getElementById('storageCategoryChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['FICA', 'Correspondence', 'Client Agreements', 'CPD', 'Financial', 'Other'],
                datasets: [{
                    data: [856, 534, 412, 278, 189, 131],
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

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('[data-view]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
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
            if (gridView) gridView.style.display = 'block';
            break;
        case 'list':
            if (listView) listView.style.display = 'block';
            break;
        case 'table':
            if (tableView) tableView.style.display = 'block';
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
    console.log('Applying filters...');
    // Implementation would filter document cards/table
}

function applyFilter(filter) {
    console.log('Applying filter:', filter);
    // Implementation would filter documents by category/status
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
            performSearch(this.value);
        }, 300));
    }
}

function performSearch(query) {
    console.log('Searching for:', query);
    // Implementation would search documents
}

function setupDocumentCards() {
    // Setup document card interactions
    const documentCards = document.querySelectorAll('.document-card');
    documentCards.forEach(card => {
        // View button
        const viewBtn = card.querySelector('.btn-outline-primary');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                viewDocument(card);
            });
        }
        
        // Download button
        const downloadBtn = card.querySelector('.fa-download')?.closest('button');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadDocument(card);
            });
        }
    });
}

function viewDocument(card) {
    const docName = card.querySelector('.document-name')?.textContent;
    Swal.fire({
        title: 'View Document',
        text: `Opening ${docName}...`,
        icon: 'info',
        showConfirmButton: false,
        timer: 1500
    });
}

function downloadDocument(card) {
    const docName = card.querySelector('.document-name')?.textContent;
    Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `Downloading ${docName}...`,
        timer: 2000,
        showConfirmButton: false
    });
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

