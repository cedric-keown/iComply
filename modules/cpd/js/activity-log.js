// Activity Log JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeActivityLog();
});

function initializeActivityLog() {
    setupFilters();
    setupSearch();
    setupTableActions();
}

function setupFilters() {
    // Filter functionality
    const filterInputs = document.querySelectorAll('#log select, #log input[type="text"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
        input.addEventListener('input', applyFilters);
    });
}

function applyFilters() {
    // Apply filters to table
    const searchTerm = document.querySelector('#log input[type="text"]')?.value.toLowerCase() || '';
    const statusFilter = document.querySelector('#log select')?.value || 'All';
    
    const rows = document.querySelectorAll('#log tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const status = row.querySelector('.badge')?.textContent || '';
        
        let show = true;
        
        if (searchTerm && !text.includes(searchTerm)) {
            show = false;
        }
        
        if (statusFilter !== 'All' && !status.includes(statusFilter)) {
            show = false;
        }
        
        row.style.display = show ? '' : 'none';
    });
}

function setupSearch() {
    const searchInput = document.querySelector('#log input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

function setupTableActions() {
    // Handle view/edit/delete actions
    document.querySelectorAll('#log .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.textContent.trim();
            const row = this.closest('tr');
            
            if (action === 'View') {
                viewActivity(row);
            } else if (action === 'Edit') {
                editActivity(row);
            } else if (action === 'Delete') {
                deleteActivity(row);
            } else if (action === 'Download') {
                downloadCertificate(row);
            }
        });
    });
}

function viewActivity(row) {
    // Show activity details modal
    Swal.fire({
        title: 'Activity Details',
        html: getActivityDetails(row),
        width: '800px',
        showCloseButton: true,
        showConfirmButton: false
    });
}

function getActivityDetails(row) {
    const cells = row.querySelectorAll('td');
    return `
        <div class="text-start">
            <h5>${cells[1].textContent}</h5>
            <p><strong>Date:</strong> ${cells[0].textContent}</p>
            <p><strong>Provider:</strong> ${cells[2].textContent}</p>
            <p><strong>Hours:</strong> ${cells[3].textContent}</p>
            <p><strong>Category:</strong> ${cells[4].textContent}</p>
            <p><strong>Type:</strong> ${cells[5].textContent}</p>
            <p><strong>Status:</strong> ${cells[6].innerHTML}</p>
        </div>
    `;
}

function editActivity(row) {
    // Switch to upload tab with pre-filled form
    switchTab('upload-tab');
    // Pre-fill form with activity data
}

function deleteActivity(row) {
    Swal.fire({
        title: 'Delete Activity?',
        text: 'Are you sure you want to delete this CPD activity?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            row.remove();
            Swal.fire('Deleted!', 'The activity has been deleted.', 'success');
        }
    });
}

function downloadCertificate(row) {
    // Simulate download
    Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Your certificate is being downloaded.'
    });
}

function exportToExcel() {
    Swal.fire({
        icon: 'info',
        title: 'Exporting...',
        text: 'Preparing Excel export...',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Export Complete',
            text: 'Your Excel file has been downloaded.'
        });
    });
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

