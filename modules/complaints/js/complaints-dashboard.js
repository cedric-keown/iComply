// Complaints Dashboard JavaScript

let complaintsData = {
    summary: null,
    complaints: [],
    charts: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintsDashboard();
});

async function initializeComplaintsDashboard() {
    // Load dashboard data when tab is shown
    const dashboardTab = document.getElementById('dashboard-tab');
    if (dashboardTab) {
        dashboardTab.addEventListener('shown.bs.tab', function() {
            loadComplaintsDashboard();
        });
        
        // Also load if already active
        if (dashboardTab.classList.contains('active')) {
            loadComplaintsDashboard();
        }
    }
    
    // Initialize Analysis & Trends tab charts when shown
    const analysisTab = document.getElementById('analysis-tab');
    if (analysisTab) {
        analysisTab.addEventListener('shown.bs.tab', function() {
            console.log('Analysis tab shown, initializing charts...');
            // Load complaints data if not already loaded
            if (!complaintsData.complaints || complaintsData.complaints.length === 0) {
                loadComplaintsDashboard().then(() => {
                    // Initialize analysis charts after data loads
                    initializeAnalysisCharts();
                });
            } else {
                // Data already loaded, just initialize analysis charts
                console.log('Data already loaded, initializing analysis charts');
                initializeAnalysisCharts();
            }
        });
    }
    
    setupActivityFeed();
}

/**
 * Load Complaints Dashboard Data
 */
async function loadComplaintsDashboard() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all complaints first (needed for aggregation)
        const complaintsResult = await dataFunctionsToUse.getComplaints(null, null, null, null, null);
        let complaints = complaintsResult;
        if (complaintsResult && complaintsResult.data) {
            complaints = complaintsResult.data;
        } else if (complaintsResult && Array.isArray(complaintsResult)) {
            complaints = complaintsResult;
        }
        
        complaintsData.complaints = complaints || [];
        
        // Load dashboard summary - function returns multiple rows, need to aggregate
        const summaryResult = await dataFunctionsToUse.getComplaintsDashboardSummary();
        let summaryRows = summaryResult;
        if (summaryResult && summaryResult.data) {
            summaryRows = summaryResult.data;
        } else if (summaryResult && Array.isArray(summaryResult)) {
            summaryRows = summaryResult;
        } else if (summaryResult && typeof summaryResult === 'object' && !Array.isArray(summaryResult)) {
            summaryRows = [summaryResult];
        }
        
        // Aggregate the summary rows into a single summary object using all complaints
        const summary = aggregateDashboardSummary(summaryRows || [], complaintsData.complaints);
        complaintsData.summary = summary;
        
        // Update dashboard UI
        updateDashboardStats();
        updateRecentActivity();
        initializeDashboardCharts(); // Only initialize charts on Dashboard tab
        
        // Update status timeline with a slight delay to ensure DOM is ready
        setTimeout(() => {
            updateStatusTimeline(complaintsData.summary);
        }, 100);
        
        // Update navbar badges
        if (typeof updateNavbarBadges === 'function') {
            updateNavbarBadges(dataFunctionsToUse);
        } else if (typeof window.parent !== 'undefined' && typeof window.parent.updateNavbarBadges === 'function') {
            window.parent.updateNavbarBadges(window.parent.dataFunctions);
        }
    } catch (error) {
        console.error('Error loading complaints dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load complaints dashboard data'
        });
    }
}

/**
 * Aggregate Dashboard Summary from rows and complaints
 */
function aggregateDashboardSummary(summaryRows, allComplaints) {
    const summary = {
        total_complaints: allComplaints.length || 0,
        active_complaints: 0,
        overdue_complaints: 0,
        resolved_this_month: 0,
        ombudsman_cases: 0,
        open_complaints: 0,
        acknowledged_complaints: 0,
        investigating_complaints: 0,
        resolved_complaints: 0,
        closed_complaints: 0,
        approaching_deadline: 0,
        average_resolution_days: 0,
        six_week_resolution_rate: 0,
        six_month_closure_rate: 0
    };
    
    // Calculate from all complaints
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    allComplaints.forEach(complaint => {
        const status = (complaint.status || '').toLowerCase();
        
        // Active complaints (not resolved/closed)
        if (!['resolved', 'closed'].includes(status)) {
            summary.active_complaints++;
        }
        
        // Overdue
        if (complaint.is_overdue || (complaint.resolution_due_date && new Date(complaint.resolution_due_date) < now)) {
            summary.overdue_complaints++;
        }
        
        // Resolved this month
        if (status === 'resolved' || status === 'closed') {
            if (complaint.resolution_date) {
                const resDate = new Date(complaint.resolution_date);
                if (resDate >= currentMonthStart) {
                    summary.resolved_this_month++;
                }
            }
        }
        
        // Ombudsman cases
        if (complaint.escalated_to_ombud === true || complaint.escalated_to_ombud === 'true') {
            summary.ombudsman_cases++;
        }
        
        // Status counts
        if (status === 'open') summary.open_complaints++;
        else if (status === 'acknowledged') summary.acknowledged_complaints++;
        else if (status === 'investigating') summary.investigating_complaints++;
        else if (status === 'resolved') summary.resolved_complaints++;
        else if (status === 'closed') summary.closed_complaints++;
        else if (status === 'pending' || status === 'pending_info') summary.open_complaints++; // Count pending as open
        
        // Approaching deadline (within 7 days)
        if (complaint.resolution_due_date) {
            const dueDate = new Date(complaint.resolution_due_date);
            if (dueDate > now && dueDate <= sevenDaysFromNow && !['resolved', 'closed'].includes(status)) {
                summary.approaching_deadline++;
            }
        }
    });
    
    // Calculate average resolution time
    const resolvedWithDates = allComplaints.filter(c => 
        c.resolution_date && c.complaint_received_date && 
        (c.status === 'resolved' || c.status === 'closed')
    );
    if (resolvedWithDates.length > 0) {
        const totalDays = resolvedWithDates.reduce((sum, c) => {
            const received = new Date(c.complaint_received_date);
            const resolved = new Date(c.resolution_date);
            return sum + Math.ceil((resolved - received) / (1000 * 60 * 60 * 24));
        }, 0);
        summary.average_resolution_days = Math.round(totalDays / resolvedWithDates.length);
    }
    
    // Calculate 6-week resolution rate
    const withDeadline = allComplaints.filter(c => c.resolution_due_date);
    const resolvedWithin6Weeks = allComplaints.filter(c => {
        if (!c.resolution_due_date || !c.resolution_date) return false;
        const resolved = new Date(c.resolution_date);
        const deadline = new Date(c.resolution_due_date);
        return resolved <= deadline;
    });
    summary.six_week_resolution_rate = withDeadline.length > 0 
        ? (resolvedWithin6Weeks.length / withDeadline.length) * 100 
        : 0;
    
    // Calculate 6-month closure rate
    const resolved = allComplaints.filter(c => c.status === 'resolved' || c.status === 'closed');
    summary.six_month_closure_rate = allComplaints.length > 0 
        ? (resolved.length / allComplaints.length) * 100 
        : 0;
    
    return summary;
}

/**
 * Update Dashboard Statistics
 */
function updateDashboardStats() {
    const summary = complaintsData.summary;
    if (!summary) return;
    
    // Total Complaints
    const totalEl = document.getElementById('total-complaints');
    if (totalEl) {
        totalEl.textContent = summary.total_complaints || 0;
    }
    
    // This year complaints
    const currentYear = new Date().getFullYear();
    const thisYearComplaints = complaintsData.complaints.filter(c => {
        const date = new Date(c.complaint_received_date || c.complaint_date || c.created_at);
        return date.getFullYear() === currentYear;
    }).length;
    const thisYearEl = document.getElementById('this-year-complaints');
    if (thisYearEl) {
        thisYearEl.textContent = `This year: ${thisYearComplaints} complaints`;
    }
    
    // Active Cases
    const activeEl = document.getElementById('active-cases');
    if (activeEl) {
        activeEl.textContent = summary.active_complaints || 0;
    }
    
    // Approaching Deadline
    const approachingEl = document.getElementById('approaching-deadline');
    if (approachingEl) {
        approachingEl.textContent = summary.approaching_deadline || 0;
    }
    
    // Ombudsman Cases (only update once)
    const ombudsmanEl = document.getElementById('ombudsman-cases');
    if (ombudsmanEl && summary.ombudsman_cases !== undefined) {
        ombudsmanEl.textContent = summary.ombudsman_cases || 0;
    }
    
    // Average Resolution Time
    const avgTimeEl = document.getElementById('avg-resolution-time');
    if (avgTimeEl) {
        const avgDays = summary.average_resolution_days || 0;
        avgTimeEl.textContent = `${avgDays} days`;
    }
    
    // Update badge counts
    const activeBadge = document.querySelector('#active-tab .badge, #active-complaints-badge');
    if (activeBadge && summary.active_complaints !== undefined) {
        activeBadge.textContent = summary.active_complaints;
    }
    
    // Update FAIS compliance stats
    const sixWeekEl = document.getElementById('six-week-resolution');
    const sixWeekLabel = document.getElementById('six-week-label');
    if (sixWeekEl && summary.six_week_resolution_rate !== undefined) {
        const rate = summary.six_week_resolution_rate || 0;
        sixWeekEl.textContent = `${Math.round(rate)}%`;
        if (sixWeekLabel && summary.total_complaints !== undefined) {
            const resolved = Math.round((rate / 100) * (summary.total_complaints || 0));
            sixWeekLabel.textContent = `6-Week Resolution (${resolved}/${summary.total_complaints || 0})`;
        }
    }
    
    const sixMonthEl = document.getElementById('six-month-closure');
    const sixMonthLabel = document.getElementById('six-month-label');
    if (sixMonthEl && summary.six_month_closure_rate !== undefined) {
        const rate = summary.six_month_closure_rate || 0;
        sixMonthEl.textContent = `${Math.round(rate)}%`;
        if (sixMonthLabel && summary.total_complaints !== undefined) {
            const closed = Math.round((rate / 100) * (summary.total_complaints || 0));
            sixMonthLabel.textContent = `6-Month Closure (${closed}/${summary.total_complaints || 0})`;
        }
    }
    
    // Status timeline will be updated with delay in loadComplaintsDashboard
    
    // Update FAIS status
    const faisStatusEl = document.getElementById('fais-status');
    if (faisStatusEl) {
        const isCompliant = summary.six_week_resolution_rate >= 100 && summary.six_month_closure_rate >= 100;
        faisStatusEl.textContent = isCompliant ? '✅ COMPLIANT' : '⚠️ REVIEW NEEDED';
        faisStatusEl.className = isCompliant ? 'badge bg-success fs-6' : 'badge bg-warning fs-6';
    }
    
    // Update navbar badge for complaints
    updateNavbarBadges(summary);
}

/**
 * Update Status Timeline
 */
function updateStatusTimeline(summary) {
    console.log('Updating status timeline with summary:', summary);
    
    if (!summary) {
        console.warn('No summary data for status timeline');
        return;
    }
    
    // Use the aggregated counts from our summary
    const receivedEl = document.getElementById('status-received');
    const acknowledgedEl = document.getElementById('status-acknowledged');
    const investigatingEl = document.getElementById('status-investigating');
    const resolvedEl = document.getElementById('status-resolved');
    const closedEl = document.getElementById('status-closed');
    
    console.log('Status timeline elements found:', {
        received: !!receivedEl,
        acknowledged: !!acknowledgedEl,
        investigating: !!investigatingEl,
        resolved: !!resolvedEl,
        closed: !!closedEl
    });
    
    // Received = total complaints
    if (receivedEl) {
        receivedEl.textContent = summary.total_complaints || 0;
        console.log('Set received:', summary.total_complaints);
    }
    if (acknowledgedEl) {
        acknowledgedEl.textContent = summary.acknowledged_complaints || 0;
        console.log('Set acknowledged:', summary.acknowledged_complaints);
    }
    if (investigatingEl) {
        investigatingEl.textContent = summary.investigating_complaints || 0;
        console.log('Set investigating:', summary.investigating_complaints);
    }
    if (resolvedEl) {
        resolvedEl.textContent = summary.resolved_complaints || 0;
        console.log('Set resolved:', summary.resolved_complaints);
    }
    if (closedEl) {
        closedEl.textContent = summary.closed_complaints || 0;
        console.log('Set closed:', summary.closed_complaints);
    }
    
    console.log('Status timeline updated');
}

/**
 * Update Recent Activity Feed
 */
function updateRecentActivity() {
    const activityContainer = document.querySelector('#dashboard .activity-list, #dashboard #recent-activity-list, #dashboard [data-activity-feed]');
    if (!activityContainer) return;
    
    // Get recent complaints (last 10)
    const recentComplaints = complaintsData.complaints
        .sort((a, b) => new Date(b.complaint_date || b.created_at) - new Date(a.complaint_date || a.created_at))
        .slice(0, 10);
    
    if (recentComplaints.length === 0) {
        activityContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No recent complaints activity.
            </div>
        `;
        return;
    }
    
    activityContainer.innerHTML = recentComplaints.map(complaint => {
        const date = new Date(complaint.complaint_date || complaint.created_at).toLocaleDateString('en-ZA');
        const priorityBadge = complaint.priority === 'high' 
            ? '<span class="badge bg-danger">High</span>'
            : complaint.priority === 'medium'
            ? '<span class="badge bg-warning">Medium</span>'
            : '<span class="badge bg-info">Low</span>';
        
        const statusBadge = complaint.status === 'resolved'
            ? '<span class="badge bg-success">Resolved</span>'
            : complaint.status === 'investigating'
            ? '<span class="badge bg-info">Investigating</span>'
            : '<span class="badge bg-warning">Open</span>';
        
        return `
            <div class="activity-item card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1 me-3">
                            <h6 class="mb-1">${complaint.complaint_reference_number || 'N/A'} - ${complaint.complainant_name || 'Unknown'}</h6>
                            <p class="mb-1 text-muted">${complaint.complaint_category || 'N/A'}</p>
                            <p class="mb-0 small text-muted">${date} • ${priorityBadge} • ${statusBadge}</p>
                        </div>
                        <div class="flex-shrink-0 align-self-center">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewComplaintDetails('${complaint.id}')">View</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Initialize Dashboard Charts (Dashboard tab only)
 */
function initializeDashboardCharts() {
    const summary = complaintsData.summary;
    if (!summary) return;
    
    // Check if Chart.js is available
    const ChartToUse = typeof Chart !== 'undefined' ? Chart : 
                      (window.parent && typeof window.parent.Chart !== 'undefined' ? window.parent.Chart : undefined);
    
    if (!ChartToUse) {
        console.warn('Chart.js not available, skipping chart initialization');
        return;
    }
    
    // Make Chart available if needed
    if (typeof Chart === 'undefined' && ChartToUse) {
        window.Chart = ChartToUse;
    }
    
    // Category Chart (on Dashboard tab)
    const ctx = document.getElementById('categoryChart');
    if (ctx) {
        // Destroy existing chart if it exists
        if (complaintsData.charts.categoryChart) {
            complaintsData.charts.categoryChart.destroy();
        }
        
        // Get category breakdown from complaints and consolidate similar categories
        const categoryCounts = {};
        complaintsData.complaints.forEach(complaint => {
            let category = complaint.complaint_category || 'Other';
            
            // Consolidate and clean up category names
            if (category.toLowerCase().includes('claim')) {
                category = 'Claims';
            } else if (category.toLowerCase().includes('service') || category.toLowerCase().includes('communication')) {
                category = 'Service Quality';
            } else if (category.toLowerCase().includes('admin') || category.toLowerCase().includes('processing')) {
                category = 'Administrative';
            } else if (category.toLowerCase().includes('product') || category.toLowerCase().includes('mis-sell')) {
                category = 'Product Issues';
            } else if (category.toLowerCase().includes('fee') || category.toLowerCase().includes('financial') || category.toLowerCase().includes('billing') || category.toLowerCase().includes('payment')) {
                category = 'Financial';
            } else if (category.toLowerCase().includes('invest') || category.toLowerCase().includes('advice')) {
                category = 'Investment Advice';
            } else if (category.toLowerCase().includes('data') || category.toLowerCase().includes('privacy')) {
                category = 'Data Protection';
            } else if (category.toLowerCase().includes('policy')) {
                category = 'Policy Admin';
            }
            
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        // Sort by count descending
        const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1]);
        
        const labels = sortedCategories.map(([category]) => category);
        const data = sortedCategories.map(([, count]) => count);
        
        try {
            complaintsData.charts.categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels.length > 0 ? labels : ['No Data'],
                    datasets: [{
                        data: data.length > 0 ? data : [1],
                        backgroundColor: [
                            '#5CBDB4', // Teal
                            '#17A2B8', // Info blue
                            '#28A745', // Success green
                            '#FFC107', // Warning yellow
                            '#DC3545', // Danger red
                            '#6c757d', // Secondary gray
                            '#007bff', // Primary blue
                            '#fd7e14', // Orange
                            '#6f42c1', // Purple
                            '#e83e8c'  // Pink
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12
                                },
                                boxWidth: 15,
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map(function(label, i) {
                                            const value = data.datasets[0].data[i];
                                            const percentage = ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                            return {
                                                text: `${label} (${value} - ${percentage}%)`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                hidden: false,
                                                index: i
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating category chart:', error);
        }
    }
}

/**
 * Initialize Analysis Charts (Analysis & Trends tab only)
 */
function initializeAnalysisCharts() {
    const summary = complaintsData.summary;
    if (!summary) {
        console.warn('No summary data available for analysis charts');
        return;
    }
    
    // Check if Chart.js is available
    const ChartToUse = typeof Chart !== 'undefined' ? Chart : 
                      (window.parent && typeof window.parent.Chart !== 'undefined' ? window.parent.Chart : undefined);
    
    if (!ChartToUse) {
        console.warn('Chart.js not available, skipping chart initialization');
        return;
    }
    
    // Make Chart available if needed
    if (typeof Chart === 'undefined' && ChartToUse) {
        window.Chart = ChartToUse;
    }
    
    // Status Chart (on Analysis & Trends tab)
    const statusCtx = document.getElementById('statusChart');
    console.log('Status chart canvas element:', statusCtx);
    console.log('Complaints data for status chart:', complaintsData.complaints.length, complaintsData.complaints);
    
    if (statusCtx) {
        if (complaintsData.charts.statusChart) {
            complaintsData.charts.statusChart.destroy();
        }
        
        // Get actual status counts from complaints
        const statusCounts = {};
        complaintsData.complaints.forEach(c => {
            const status = (c.status || 'unknown').toLowerCase();
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        console.log('Status counts for chart:', statusCounts);
        
        // Prepare data for chart - only show statuses that have complaints
        const chartData = [];
        const chartLabels = [];
        const chartColors = [];
        
        const statusConfig = {
            'open': { label: 'Open', color: '#FFC107' },
            'acknowledged': { label: 'Acknowledged', color: '#17A2B8' },
            'investigating': { label: 'Investigating', color: '#007bff' },
            'pending': { label: 'Pending', color: '#ffc107' },
            'pending_info': { label: 'Pending Info', color: '#fd7e14' },
            'resolved': { label: 'Resolved', color: '#28A745' },
            'closed': { label: 'Closed', color: '#6c757d' }
        };
        
        Object.entries(statusCounts).forEach(([status, count]) => {
            const config = statusConfig[status] || { label: status, color: '#6c757d' };
            chartLabels.push(config.label);
            chartData.push(count);
            chartColors.push(config.color);
        });
        
        console.log('Creating status chart with data:', chartData, 'labels:', chartLabels);
        
        try {
            complaintsData.charts.statusChart = new Chart(statusCtx, {
                type: 'bar',
                data: {
                    labels: chartLabels.length > 0 ? chartLabels : ['No Data'],
                    datasets: [{
                        label: 'Number of Complaints',
                        data: chartData.length > 0 ? chartData : [0],
                        backgroundColor: chartColors.length > 0 ? chartColors : ['#6c757d'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + ' complaint' + (context.parsed.y !== 1 ? 's' : '');
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating status chart:', error);
        }
    }
}

function setupActivityFeed() {
    // Activity feed interactions are handled in updateRecentActivity
}

function viewComplaintDetails(complaintId) {
    // Switch to active complaints tab and show details
    switchComplaintsTab('active-tab');
    // TODO: Open complaint detail modal or navigate to detail view
    console.log('View complaint details:', complaintId);
}

/**
 * Update Navbar Badges
 */
function updateNavbarBadges(summary) {
    if (!summary) return;
    
    // Update complaints badge in main navbar (if accessible)
    try {
        const complaintsNavBadge = document.querySelector('[data-route="complaints"] .menu-badge');
        if (complaintsNavBadge) {
            complaintsNavBadge.textContent = summary.active_complaints || 0;
        }
        
        // Also try parent window if in iframe
        if (window.parent && window.parent !== window) {
            const parentComplaintsBadge = window.parent.document.querySelector('[data-route="complaints"] .menu-badge');
            if (parentComplaintsBadge) {
                parentComplaintsBadge.textContent = summary.active_complaints || 0;
            }
        }
    } catch (error) {
        // Cross-origin or iframe access might fail, that's okay
        console.warn('Could not update navbar badge:', error);
    }
}

function switchComplaintsTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access - ensure it's available immediately
window.switchComplaintsTab = switchComplaintsTab;
window.viewComplaintDetails = viewComplaintDetails;
window.loadComplaintsDashboard = loadComplaintsDashboard;

// Also make available on parent window if in iframe
if (window.parent && window.parent !== window) {
    try {
        window.parent.switchComplaintsTab = switchComplaintsTab;
    } catch (e) {
        // Cross-origin access might fail
    }
}

