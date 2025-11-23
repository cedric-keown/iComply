// Charts JavaScript for Clients & FICA Module

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    setTimeout(() => {
        createClientsByRepChart();
        createClientsByRiskChart();
        createClientsByProductChart();
        createRiskDistributionChart();
    }, 100);
}

function createClientsByRepChart() {
    const ctx = document.getElementById('clientsByRepChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sarah Naidoo', 'Thabo Mokoena', 'Pieter Vermeulen', 'Johan Smith'],
                datasets: [{
                    label: 'Clients',
                    data: [85, 72, 54, 37],
                    backgroundColor: '#5CBDB4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function createClientsByRiskChart() {
    const ctx = document.getElementById('clientsByRiskChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low (SDD)', 'Standard (CDD)', 'High (EDD)', 'Not Assessed'],
                datasets: [{
                    data: [180, 48, 8, 12],
                    backgroundColor: [
                        '#28A745',
                        '#17A2B8',
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

function createClientsByProductChart() {
    const ctx = document.getElementById('clientsByProductChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['LT Insurance', 'Investments', 'ST Insurance', 'Pension Funds'],
                datasets: [{
                    label: 'Clients',
                    data: [165, 98, 72, 45],
                    backgroundColor: [
                        '#5CBDB4',
                        '#17A2B8',
                        '#28A745',
                        '#FFC107'
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
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function createRiskDistributionChart() {
    const ctx = document.getElementById('riskDistributionChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low (SDD)', 'Standard (CDD)', 'High (EDD)', 'Not Assessed'],
                datasets: [{
                    data: [180, 48, 8, 12],
                    backgroundColor: [
                        '#28A745',
                        '#17A2B8',
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

