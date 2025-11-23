// Compliance Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeComplianceDashboard();
});

function initializeComplianceDashboard() {
    setupActivityFeed();
    setupAlerts();
}

function setupActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-outline-primary');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log('View activity details');
            });
        }
    });
}

function setupAlerts() {
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        const actionBtn = item.querySelector('.btn-danger, .btn-warning, .btn-info');
        const dismissBtn = item.querySelector('.btn-outline-secondary');
        
        if (actionBtn) {
            actionBtn.addEventListener('click', function() {
                console.log('Take action on alert');
            });
        }
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
                item.style.opacity = '0.5';
                setTimeout(() => {
                    item.remove();
                }, 300);
            });
        }
    });
}

function switchComplianceTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchComplianceTab = switchComplianceTab;

