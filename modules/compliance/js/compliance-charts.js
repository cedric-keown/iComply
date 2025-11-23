// Compliance Charts JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeComplianceCharts();
});

function initializeComplianceCharts() {
    // Wait for charts to be ready
    setTimeout(() => {
        createComplianceByAreaChart();
        createCPDProgressChart();
        createDocumentStatusChart();
        createComplianceTrendChart();
        createComplianceAreaChart();
    }, 100);
}

function createComplianceByAreaChart() {
    const ctx = document.getElementById('complianceByAreaChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Fit & Proper', 'CPD', 'FICA', 'Debarment', 'Other'],
                datasets: [{
                    data: [95, 87, 92, 100, 88],
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

function createCPDProgressChart() {
    const ctx = document.getElementById('cpdProgressChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['On Track', 'Behind', 'Critical', 'Complete'],
                datasets: [{
                    label: 'Representatives',
                    data: [8, 4, 2, 1],
                    backgroundColor: [
                        '#28A745',
                        '#FFC107',
                        '#DC3545',
                        '#5CBDB4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }
}

function createDocumentStatusChart() {
    const ctx = document.getElementById('documentStatusChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Current', 'Expiring Soon', 'Expired', 'Missing'],
                datasets: [{
                    data: [850, 120, 15, 45],
                    backgroundColor: [
                        '#28A745',
                        '#FFC107',
                        '#DC3545',
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

function createComplianceTrendChart() {
    const ctx = document.getElementById('complianceTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Compliance Rate (%)',
                    data: [82, 84, 85, 86, 87, 86, 88, 87, 89, 88, 87, 87],
                    borderColor: '#5CBDB4',
                    backgroundColor: 'rgba(92, 189, 180, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Target',
                    data: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90],
                    borderColor: '#28A745',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 75,
                        max: 100
                    }
                }
            }
        });
    }
}

function createComplianceAreaChart() {
    const ctx = document.getElementById('complianceAreaChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['F&P', 'CPD', 'FICA', 'Debarment', 'PI Ins', 'Training'],
                datasets: [{
                    label: 'Compliance Rate (%)',
                    data: [95, 87, 92, 100, 98, 90],
                    backgroundColor: [
                        '#5CBDB4',
                        '#17A2B8',
                        '#28A745',
                        '#FFC107',
                        '#6c757d',
                        '#DC3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100
                    }
                }
            }
        });
    }
}

