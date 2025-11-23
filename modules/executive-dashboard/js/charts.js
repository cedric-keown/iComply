// Charts JavaScript for Executive Dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    setTimeout(() => {
        createCPDProgressChart();
    }, 200);
}

function createCPDProgressChart() {
    const ctx = document.getElementById('cpdProgressChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'At Risk'],
                datasets: [{
                    data: [9, 2, 1],
                    backgroundColor: [
                        '#28A745',
                        '#FFC107',
                        '#DC3545'
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

