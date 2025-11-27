// Charts JavaScript for Executive Dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    setTimeout(() => {
        createCPDProgressChart();
    }, 200);
}

let cpdProgressChart = null;

function createCPDProgressChart(completed = 9, inProgress = 2, atRisk = 1) {
    const ctx = document.getElementById('cpdProgressChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (cpdProgressChart) {
        cpdProgressChart.destroy();
    }
    
    cpdProgressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'At Risk'],
            datasets: [{
                data: [completed, inProgress, atRisk],
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

function updateCPDChart(completed, inProgress, atRisk) {
    if (cpdProgressChart) {
        cpdProgressChart.data.datasets[0].data = [completed, inProgress, atRisk];
        cpdProgressChart.update('active');
    } else {
        createCPDProgressChart(completed, inProgress, atRisk);
    }
}

// Make function globally available
window.updateCPDChart = updateCPDChart;

