// Health Score Chart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHealthScore();
});

function initializeHealthScore() {
    setTimeout(() => {
        createHealthScoreChart();
    }, 100);
}

function createHealthScoreChart() {
    const ctx = document.getElementById('healthScoreChart');
    if (ctx) {
        const score = 87;
        const color = score >= 85 ? '#28A745' : score >= 70 ? '#FFC107' : '#DC3545';
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [color, '#e9ecef'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }
}

