// Client Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeClientDashboard();
});

function initializeClientDashboard() {
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
    // Alert handling logic
    const alertButtons = document.querySelectorAll('.alert .btn');
    alertButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Alert action clicked');
        });
    });
}

function switchClientsFicaTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchClientsFicaTab = switchClientsFicaTab;

