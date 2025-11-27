// Complaints Analysis & Trends JavaScript

let analysisData = {
    complaints: [],
    charts: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintsAnalysis();
});

async function initializeComplaintsAnalysis() {
    // Load analysis when tab is shown
    const analysisTab = document.getElementById('analysis-tab');
    if (analysisTab) {
        analysisTab.addEventListener('shown.bs.tab', function() {
            // Wait a bit for the tab content to be visible
            setTimeout(() => {
                loadComplaintsAnalysis();
            }, 100);
        });
        
        // Also load if already active
        const analysisPane = document.getElementById('analysis');
        if (analysisPane && analysisPane.classList.contains('active')) {
            setTimeout(() => {
                loadComplaintsAnalysis();
            }, 200);
        }
    }
}

/**
 * Load Complaints Analysis Data
 */
async function loadComplaintsAnalysis() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Check if Chart.js is available (try parent window if in iframe)
        let ChartToUse = typeof Chart !== 'undefined' ? Chart : 
                        (window.parent && typeof window.parent.Chart !== 'undefined' ? window.parent.Chart : undefined);
        
        if (!ChartToUse) {
            console.warn('Chart.js not loaded, waiting...');
            // Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 500));
            ChartToUse = typeof Chart !== 'undefined' ? Chart : 
                        (window.parent && typeof window.parent.Chart !== 'undefined' ? window.parent.Chart : undefined);
            
            if (!ChartToUse) {
                throw new Error('Chart.js is not loaded. Please ensure Chart.js is included in the page.');
            }
        }
        
        // Make Chart available globally for chart rendering functions
        if (typeof Chart === 'undefined' && ChartToUse) {
            window.Chart = ChartToUse;
        }
        
        // Load all complaints
        const complaintsResult = await dataFunctionsToUse.getComplaints(null, null, null, null, null);
        let complaints = complaintsResult;
        if (complaintsResult && complaintsResult.data) {
            complaints = complaintsResult.data;
        } else if (complaintsResult && Array.isArray(complaintsResult)) {
            complaints = complaintsResult;
        }
        
        analysisData.complaints = complaints || [];
        
        console.log('Loaded complaints for analysis:', analysisData.complaints.length);
        
        // Update overview statistics
        updateOverviewStatistics();
        
        // Wait a bit for DOM to be ready, then render charts
        setTimeout(() => {
            renderCharts();
            updateComplianceMetrics();
        }, 100);
        
    } catch (error) {
        console.error('Error loading complaints analysis:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            chartAvailable: typeof Chart !== 'undefined',
            dataFunctionsAvailable: typeof dataFunctions !== 'undefined'
        });
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to load complaints analysis',
            footer: 'Check browser console for more details'
        });
    }
}

/**
 * Update Overview Statistics
 */
function updateOverviewStatistics() {
    const complaints = analysisData.complaints;
    const currentYear = new Date().getFullYear();
    
    // Filter to current year
    const ytdComplaints = complaints.filter(c => {
        const date = new Date(c.complaint_received_date || c.complaint_date || c.created_at);
        return date.getFullYear() === currentYear;
    });
    
    const resolved = ytdComplaints.filter(c => c.status?.toLowerCase() === 'resolved' || c.status?.toLowerCase() === 'closed');
    const active = ytdComplaints.filter(c => !['resolved', 'closed'].includes(c.status?.toLowerCase()));
    
    // Calculate average resolution time
    const resolvedWithDates = resolved.filter(c => c.resolution_date && c.complaint_received_date);
    let avgResolutionTime = 0;
    if (resolvedWithDates.length > 0) {
        const totalDays = resolvedWithDates.reduce((sum, c) => {
            const received = new Date(c.complaint_received_date);
            const resolved = new Date(c.resolution_date);
            return sum + Math.ceil((resolved - received) / (1000 * 60 * 60 * 24));
        }, 0);
        avgResolutionTime = Math.round(totalDays / resolvedWithDates.length);
    }
    
    // Update UI
    const ytdTotal = document.getElementById('ytd-total');
    if (ytdTotal) ytdTotal.textContent = ytdComplaints.length;
    
    const ytdYear = document.getElementById('ytd-year');
    if (ytdYear) ytdYear.textContent = currentYear.toString();
    
    const ytdResolved = document.getElementById('ytd-resolved');
    if (ytdResolved) ytdResolved.textContent = resolved.length;
    
    const ytdResolvedPercent = document.getElementById('ytd-resolved-percent');
    if (ytdResolvedPercent && ytdComplaints.length > 0) {
        const percent = Math.round((resolved.length / ytdComplaints.length) * 100);
        ytdResolvedPercent.textContent = `${percent}%`;
    }
    
    const ytdActive = document.getElementById('ytd-active');
    if (ytdActive) ytdActive.textContent = active.length;
    
    const ytdActivePercent = document.getElementById('ytd-active-percent');
    if (ytdActivePercent && ytdComplaints.length > 0) {
        const percent = Math.round((active.length / ytdComplaints.length) * 100);
        ytdActivePercent.textContent = `${percent}%`;
    }
    
    const avgTime = document.getElementById('avg-resolution-time');
    if (avgTime) avgTime.textContent = avgResolutionTime;
}

/**
 * Render All Charts
 */
function renderCharts() {
    try {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not available');
            return;
        }
        
        renderCategoryChart();
        renderTrendChart();
        renderTrendOverTimeChart();
        renderResolutionTimeDistributionChart();
        renderPriorityChart();
        renderStatusChart();
        renderRepresentativeChart();
    } catch (error) {
        console.error('Error rendering charts:', error);
    }
}

/**
 * Render Category Chart
 */
function renderCategoryChart() {
    const ctx = document.getElementById('analysisCategoryChart');
    if (!ctx) {
        console.warn('Category chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    // Destroy existing chart
    if (analysisData.charts.categoryChart) {
        analysisData.charts.categoryChart.destroy();
    }
    
    // Count by category
    const categoryCounts = {};
    analysisData.complaints.forEach(complaint => {
        const category = complaint.complaint_category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    
    analysisData.charts.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: [
                    '#5CBDB4',
                    '#17A2B8',
                    '#28A745',
                    '#FFC107',
                    '#DC3545',
                    '#6c757d',
                    '#6610f2'
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

/**
 * Render Resolution Time Trend Chart
 */
function renderTrendChart() {
    const ctx = document.getElementById('resolutionTrendChart');
    if (!ctx) {
        console.warn('Trend chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.trendChart) {
        analysisData.charts.trendChart.destroy();
    }
    
    // Get resolved complaints with resolution dates
    const resolved = analysisData.complaints
        .filter(c => (c.status?.toLowerCase() === 'resolved' || c.status?.toLowerCase() === 'closed') && c.resolution_date && c.complaint_received_date)
        .map(c => {
            const received = new Date(c.complaint_received_date);
            const resolved = new Date(c.resolution_date);
            return {
                days: Math.ceil((resolved - received) / (1000 * 60 * 60 * 24)),
                month: resolved.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })
            };
        });
    
    // Group by month
    const monthlyData = {};
    resolved.forEach(item => {
        monthlyData[item.month] = monthlyData[item.month] || [];
        monthlyData[item.month].push(item.days);
    });
    
    const months = Object.keys(monthlyData).sort();
    const avgDays = months.map(month => {
        const days = monthlyData[month];
        return Math.round(days.reduce((a, b) => a + b, 0) / days.length);
    });
    
    analysisData.charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months.length > 0 ? months : ['No Data'],
            datasets: [{
                label: 'Average Resolution Time (Days)',
                data: avgDays.length > 0 ? avgDays : [0],
                borderColor: '#5CBDB4',
                backgroundColor: 'rgba(92, 189, 180, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            }
        }
    });
}

/**
 * Render Trend Over Time Chart
 */
function renderTrendOverTimeChart() {
    const ctx = document.getElementById('trendOverTimeChart');
    if (!ctx) {
        console.warn('Trend over time chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.trendOverTimeChart) {
        analysisData.charts.trendOverTimeChart.destroy();
    }
    
    // Group complaints by month
    const monthlyCounts = {};
    analysisData.complaints.forEach(complaint => {
        const date = new Date(complaint.complaint_received_date || complaint.complaint_date || complaint.created_at);
        const monthKey = date.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });
    
    const months = Object.keys(monthlyCounts).sort();
    const counts = months.map(month => monthlyCounts[month]);
    
    analysisData.charts.trendOverTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months.length > 0 ? months : ['No Data'],
            datasets: [{
                label: 'Complaints Received',
                data: counts.length > 0 ? counts : [0],
                borderColor: '#17A2B8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Complaints'
                    }
                }
            }
        }
    });
}

/**
 * Render Resolution Time Distribution Chart
 */
function renderResolutionTimeDistributionChart() {
    const ctx = document.getElementById('resolutionTimeDistributionChart');
    if (!ctx) {
        console.warn('Resolution time distribution chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.resolutionTimeDistributionChart) {
        analysisData.charts.resolutionTimeDistributionChart.destroy();
    }
    
    // Get resolution times
    const resolutionTimes = analysisData.complaints
        .filter(c => c.resolution_date && c.complaint_received_date)
        .map(c => {
            const received = new Date(c.complaint_received_date);
            const resolved = new Date(c.resolution_date);
            return Math.ceil((resolved - received) / (1000 * 60 * 60 * 24));
        });
    
    // Bucket into ranges
    const buckets = {
        '0-7 days': 0,
        '8-14 days': 0,
        '15-21 days': 0,
        '22-28 days': 0,
        '29-42 days': 0,
        '43+ days': 0
    };
    
    resolutionTimes.forEach(days => {
        if (days <= 7) buckets['0-7 days']++;
        else if (days <= 14) buckets['8-14 days']++;
        else if (days <= 21) buckets['15-21 days']++;
        else if (days <= 28) buckets['22-28 days']++;
        else if (days <= 42) buckets['29-42 days']++;
        else buckets['43+ days']++;
    });
    
    const labels = Object.keys(buckets);
    const data = Object.values(buckets);
    
    analysisData.charts.resolutionTimeDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Complaints',
                data: data,
                backgroundColor: [
                    '#28A745',
                    '#5CBDB4',
                    '#17A2B8',
                    '#FFC107',
                    '#FF9800',
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Complaints'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Resolution Time'
                    }
                }
            }
        }
    });
}

/**
 * Render Priority Chart
 */
function renderPriorityChart() {
    const ctx = document.getElementById('priorityChart');
    if (!ctx) {
        console.warn('Priority chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.priorityChart) {
        analysisData.charts.priorityChart.destroy();
    }
    
    const priorityCounts = {
        'high': 0,
        'medium': 0,
        'low': 0
    };
    
    analysisData.complaints.forEach(complaint => {
        const priority = (complaint.priority || 'medium').toLowerCase();
        if (priorityCounts[priority] !== undefined) {
            priorityCounts[priority]++;
        }
    });
    
    analysisData.charts.priorityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                label: 'Complaints by Priority',
                data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
                backgroundColor: ['#DC3545', '#FFC107', '#28A745']
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

/**
 * Render Status Chart
 */
function renderStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) {
        console.warn('Status chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.statusChart) {
        analysisData.charts.statusChart.destroy();
    }
    
    const statusCounts = {};
    analysisData.complaints.forEach(complaint => {
        const status = (complaint.status || 'open').toLowerCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const labels = Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    const data = Object.values(statusCounts);
    
    analysisData.charts.statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: [
                    '#17A2B8',
                    '#FFC107',
                    '#28A745',
                    '#DC3545',
                    '#6c757d'
                ]
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

/**
 * Render Representative Chart
 */
function renderRepresentativeChart() {
    const ctx = document.getElementById('representativeChart');
    if (!ctx) {
        console.warn('Representative chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }
    
    if (analysisData.charts.representativeChart) {
        analysisData.charts.representativeChart.destroy();
    }
    
    // Count complaints by representative
    const repCounts = {};
    analysisData.complaints.forEach(complaint => {
        if (complaint.representative_id) {
            const repId = complaint.representative_id;
            repCounts[repId] = (repCounts[repId] || 0) + 1;
        }
    });
    
    // Sort by count and take top 10
    const sorted = Object.entries(repCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sorted.map(([repId]) => `Rep ${repId.substring(0, 8)}`);
    const data = sorted.map(([, count]) => count);
    
    analysisData.charts.representativeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                label: 'Complaints',
                data: data.length > 0 ? data : [0],
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

/**
 * Update Compliance Metrics
 */
function updateComplianceMetrics() {
    const complaints = analysisData.complaints;
    
    // 48-hour acknowledgment (assuming all have acknowledgement_due_date set)
    const withAckDate = complaints.filter(c => c.acknowledgement_due_date);
    const acknowledged = complaints.filter(c => c.acknowledgement_sent_date);
    const ackRate = withAckDate.length > 0 ? Math.round((acknowledged.length / withAckDate.length) * 100) : 0;
    
    // 6-week resolution rate
    const withDeadline = complaints.filter(c => c.resolution_due_date);
    const resolvedWithin6Weeks = complaints.filter(c => {
        if (!c.resolution_due_date || !c.resolution_date) return false;
        const resolved = new Date(c.resolution_date);
        const deadline = new Date(c.resolution_due_date);
        return resolved <= deadline;
    });
    const resolutionRate = withDeadline.length > 0 ? Math.round((resolvedWithin6Weeks.length / withDeadline.length) * 100) : 0;
    
    // 6-month closure rate (assuming all resolved complaints are closed within 6 months)
    const resolved = complaints.filter(c => c.status?.toLowerCase() === 'resolved' || c.status?.toLowerCase() === 'closed');
    const closureRate = complaints.length > 0 ? Math.round((resolved.length / complaints.length) * 100) : 0;
    
    // Escalation rate
    const escalated = complaints.filter(c => c.ombud_escalation_date || c.fsca_escalation_date);
    const escalationRate = complaints.length > 0 ? Math.round((escalated.length / complaints.length) * 100) : 0;
    
    // Update UI
    const compliance48hr = document.getElementById('compliance-48hr');
    if (compliance48hr) compliance48hr.textContent = `${ackRate}%`;
    
    const compliance6week = document.getElementById('compliance-6week');
    if (compliance6week) compliance6week.textContent = `${resolutionRate}%`;
    
    const compliance6month = document.getElementById('compliance-6month');
    if (compliance6month) compliance6month.textContent = `${closureRate}%`;
    
    const complianceEscalation = document.getElementById('compliance-escalation');
    if (complianceEscalation) complianceEscalation.textContent = `${escalationRate}%`;
}

