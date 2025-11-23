// Representatives Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRepresentativesDashboard();
});

function initializeRepresentativesDashboard() {
    setupActivityFeed();
    setupComplianceMatrix();
}

function setupActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-outline-primary, .btn-warning');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log('View activity details');
            });
        }
    });
}

function setupComplianceMatrix() {
    const viewBtns = document.querySelectorAll('#dashboard .btn-outline-primary');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('View representative profile');
        });
    });
}

function switchRepsTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchRepsTab = switchRepsTab;

