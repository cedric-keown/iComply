// Health Score Chart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHealthScore();
});

function initializeHealthScore() {
    setTimeout(() => {
        createHealthScoreChart();
    }, 100);
}

let healthScoreChart = null;

function createHealthScoreChart(score = null) {
    const ctx = document.getElementById('healthScoreChart');
    if (!ctx) return;
    
    // If score is provided, use it; otherwise use default
    const healthScore = score !== null ? score : 87;
    const color = healthScore >= 85 ? '#28A745' : healthScore >= 70 ? '#FFC107' : '#DC3545';
    
    // Destroy existing chart if it exists
    if (healthScoreChart) {
        healthScoreChart.destroy();
    }
    
    healthScoreChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [healthScore, 100 - healthScore],
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
    
    // Update score text
    const scoreElement = document.getElementById('healthScoreValue');
    if (scoreElement) {
        scoreElement.textContent = Math.round(healthScore);
    }
    
    // Update score label color
    if (scoreElement) {
        scoreElement.style.color = color;
    }
}

function updateHealthScoreChart(score) {
    if (healthScoreChart) {
        const color = score >= 85 ? '#28A745' : score >= 70 ? '#FFC107' : '#DC3545';
        healthScoreChart.data.datasets[0].data = [score, 100 - score];
        healthScoreChart.data.datasets[0].backgroundColor = [color, '#e9ecef'];
        healthScoreChart.update('active');
        
        // Update score text
        const scoreElement = document.getElementById('healthScoreValue');
        if (scoreElement) {
            scoreElement.textContent = Math.round(score);
            scoreElement.style.color = color;
        }
    } else {
        createHealthScoreChart(score);
    }
}

// Make function globally available
window.updateHealthScoreChart = updateHealthScoreChart;

