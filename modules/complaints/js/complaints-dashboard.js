// Complaints Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintsDashboard();
    initializeCharts();
});

function initializeComplaintsDashboard() {
    setupActivityFeed();
}

function initializeCharts() {
    // Category Chart
    const ctx = document.getElementById('categoryChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Claims Issues', 'Service Quality', 'Communication', 'Product Issues', 'Other'],
                datasets: [{
                    data: [12, 10, 6, 4, 2],
                    backgroundColor: [
                        '#5CBDB4',
                        '#17A2B8',
                        '#28A745',
                        '#FFC107',
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

function setupActivityFeed() {
    // Activity feed interactions
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-outline-primary');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                // Navigate to complaint detail
                console.log('View complaint details');
            });
        }
    });
}

function switchComplaintsTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchComplaintsTab = switchComplaintsTab;

