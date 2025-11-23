// Executive Dashboard Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    updateLastRefreshTime();
    setupEventListeners();
}

function updateLastRefreshTime() {
    const now = new Date();
    const formatted = formatDateTime(now);
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = formatted;
    }
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function setupEventListeners() {
    // Setup any event listeners here
}

function refreshDashboard() {
    // Show loading indicator
    const refreshBtn = event.target.closest('button');
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate refresh
    setTimeout(() => {
        updateLastRefreshTime();
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
        
        // Show success notification
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Dashboard Refreshed',
                text: 'All data has been updated',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }, 1000);
}

function showTrendChart() {
    // Open trend chart modal
    console.log('Show trend chart');
}

window.refreshDashboard = refreshDashboard;
window.showTrendChart = showTrendChart;

