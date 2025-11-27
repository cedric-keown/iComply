// Compliance Dashboard JavaScript

let complianceData = {
    health: null,
    teamMatrix: null,
    cpdProgress: null,
    complaintsSummary: null,
    upcomingDeadlines: []
};

document.addEventListener('DOMContentLoaded', function() {
    initializeComplianceDashboard();
});

async function initializeComplianceDashboard() {
    // Load dashboard data when overview tab is shown
    const overviewTab = document.getElementById('overview-tab');
    if (overviewTab) {
        overviewTab.addEventListener('shown.bs.tab', function() {
            loadComplianceDashboard();
        });
        
        // Also load if already active
        if (overviewTab.classList.contains('active')) {
            loadComplianceDashboard();
        }
    }
    
    setupActivityFeed();
    setupAlerts();
}

/**
 * Load Compliance Dashboard Data
 */
async function loadComplianceDashboard() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all dashboard data in parallel
        const [healthResult, teamMatrixResult, cpdResult, complaintsResult, deadlinesResult] = await Promise.all([
            dataFunctionsToUse.getExecutiveDashboardHealth(),
            dataFunctionsToUse.getTeamComplianceMatrix(),
            dataFunctionsToUse.getCpdProgressDashboard(),
            dataFunctionsToUse.getComplaintsDashboardSummary(),
            dataFunctionsToUse.getUpcomingDeadlines(90)
        ]);
        
        // Process health data
        let health = healthResult;
        if (healthResult && healthResult.data) {
            health = healthResult.data;
        } else if (healthResult && Array.isArray(healthResult) && healthResult.length > 0) {
            health = healthResult[0];
        } else if (healthResult && typeof healthResult === 'object') {
            health = healthResult;
        }
        complianceData.health = health || {};
        
        // Process team matrix
        let teamMatrix = teamMatrixResult;
        if (teamMatrixResult && teamMatrixResult.data) {
            teamMatrix = teamMatrixResult.data;
        } else if (teamMatrixResult && Array.isArray(teamMatrixResult)) {
            teamMatrix = teamMatrixResult;
        }
        complianceData.teamMatrix = teamMatrix || [];
        
        // Process CPD progress
        let cpdProgress = cpdResult;
        if (cpdResult && cpdResult.data) {
            cpdProgress = cpdResult.data;
        } else if (cpdResult && Array.isArray(cpdResult)) {
            cpdProgress = cpdResult;
        }
        complianceData.cpdProgress = cpdProgress || [];
        
        // Process complaints summary
        let complaintsSummary = complaintsResult;
        if (complaintsResult && complaintsResult.data) {
            complaintsSummary = complaintsResult.data;
        } else if (complaintsResult && Array.isArray(complaintsResult) && complaintsResult.length > 0) {
            complaintsSummary = complaintsResult[0];
        } else if (complaintsResult && typeof complaintsResult === 'object') {
            complaintsSummary = complaintsResult;
        }
        complianceData.complaintsSummary = complaintsSummary || {};
        
        // Process upcoming deadlines
        let deadlines = deadlinesResult;
        if (deadlinesResult && deadlinesResult.data) {
            deadlines = deadlinesResult.data;
        } else if (deadlinesResult && Array.isArray(deadlinesResult)) {
            deadlines = deadlinesResult;
        }
        complianceData.upcomingDeadlines = deadlines || [];
        
        // Update dashboard UI
        updateDashboardStats();
        updateActivityFeed();
        updateAlerts();
    } catch (error) {
        console.error('Error loading compliance dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load compliance dashboard data'
        });
    }
}

/**
 * Update Dashboard Statistics
 */
function updateDashboardStats() {
    const health = complianceData.health;
    if (!health) return;
    
    // Overall Compliance
    const overallComplianceEl = document.querySelector('#overview .stat-value.text-success:first-of-type');
    if (overallComplianceEl) {
        const score = health.overall_compliance_score || 0;
        overallComplianceEl.textContent = `${Math.round(score)}%`;
        
        // Update progress bar
        const progressBar = overallComplianceEl.closest('.stat-card')?.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${score}%`;
            progressBar.className = `progress-bar ${score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning' : 'bg-danger'}`;
        }
    }
    
    // Action Required
    const actionRequiredEl = document.querySelectorAll('#overview .stat-value.text-warning')[0];
    if (actionRequiredEl) {
        const actionCount = (health.fit_proper_non_compliant || 0) + 
                           (health.cpd_non_compliant || 0) + 
                           (health.fica_non_compliant || 0) +
                           (complianceData.complaintsSummary.overdue_complaints || 0);
        actionRequiredEl.textContent = actionCount;
    }
    
    // Reps Compliant
    const repsCompliantEl = document.querySelectorAll('#overview .stat-value.text-info')[0];
    if (repsCompliantEl) {
        const totalReps = health.total_representatives || 0;
        const compliantReps = health.fit_proper_compliant || 0;
        repsCompliantEl.textContent = `${compliantReps}/${totalReps}`;
        
        // Update sublabel
        const sublabel = repsCompliantEl.closest('.stat-card')?.querySelector('.stat-sublabel');
        if (sublabel && totalReps > 0) {
            const percentage = Math.round((compliantReps / totalReps) * 100);
            sublabel.textContent = `${percentage}% of team`;
        }
    }
    
    // Update expiring soon
    const expiringSoonEl = document.getElementById('expiring-soon');
    if (expiringSoonEl) {
        const expiringCount = complianceData.upcomingDeadlines.filter(d => d.days_until <= 30).length;
        expiringSoonEl.textContent = expiringCount;
    }
    
    // Update alerts badge
    const alertsBadge = document.getElementById('alerts-badge');
    if (alertsBadge) {
        const alertCount = (health.fit_proper_non_compliant || 0) + 
                          (health.cpd_non_compliant || 0) + 
                          (health.fica_non_compliant || 0) +
                          (complianceData.complaintsSummary.overdue_complaints || 0);
        alertsBadge.textContent = alertCount;
    }
}

/**
 * Update Activity Feed
 */
function updateActivityFeed() {
    const activityContainer = document.querySelector('#overview .activity-list, #overview #compliance-activity-feed, #overview [data-activity-feed]');
    if (!activityContainer) return;
    
    // Combine upcoming deadlines and recent activity
    const activities = complianceData.upcomingDeadlines.slice(0, 10).map(deadline => ({
        type: 'deadline',
        title: deadline.deadline_type || 'Upcoming Deadline',
        description: deadline.description || '',
        date: deadline.deadline_date,
        daysUntil: deadline.days_until,
        entity: deadline.entity_name || 'N/A'
    }));
    
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                No upcoming deadlines or urgent activities.
            </div>
        `;
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => {
        const date = new Date(activity.date).toLocaleDateString('en-ZA');
        const urgencyBadge = activity.daysUntil <= 7 
            ? '<span class="badge bg-danger">Urgent</span>'
            : activity.daysUntil <= 30
            ? '<span class="badge bg-warning">Soon</span>'
            : '<span class="badge bg-info">Upcoming</span>';
        
        return `
            <div class="activity-item card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${activity.title}</h6>
                            <p class="mb-1 text-muted">${activity.entity}</p>
                            <p class="mb-0 small text-muted">${date} • ${activity.daysUntil} days remaining ${urgencyBadge}</p>
                        </div>
                        <button class="btn btn-sm btn-outline-primary">View</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update Alerts
 */
function updateAlerts() {
    const alertsContainer = document.querySelector('#overview .alerts-list, #overview #dashboard-alerts, #overview [data-alerts-list]');
    if (!alertsContainer) return;
    
    const alerts = [];
    
    // Add compliance alerts
    const health = complianceData.health;
    if (health) {
        if (health.fit_proper_non_compliant > 0) {
            alerts.push({
                type: 'danger',
                title: 'Fit & Proper Non-Compliance',
                message: `${health.fit_proper_non_compliant} representative(s) are non-compliant`,
                action: 'Review Fit & Proper Status'
            });
        }
        
        if (health.cpd_non_compliant > 0) {
            alerts.push({
                type: 'warning',
                title: 'CPD Non-Compliance',
                message: `${health.cpd_non_compliant} representative(s) are behind on CPD requirements`,
                action: 'Review CPD Progress'
            });
        }
        
        if (health.fica_non_compliant > 0) {
            alerts.push({
                type: 'info',
                title: 'FICA Non-Compliance',
                message: `${health.fica_non_compliant} client(s) require FICA verification`,
                action: 'Review FICA Queue'
            });
        }
    }
    
    // Add complaints alerts
    const complaints = complianceData.complaintsSummary;
    if (complaints && complaints.overdue_complaints > 0) {
        alerts.push({
            type: 'danger',
            title: 'Overdue Complaints',
            message: `${complaints.overdue_complaints} complaint(s) are overdue`,
            action: 'Review Complaints'
        });
    }
    
    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                No urgent alerts. All systems are compliant.
            </div>
        `;
        return;
    }
    
    alertsContainer.innerHTML = alerts.map(alert => {
        const alertClass = alert.type === 'danger' ? 'border-danger' : alert.type === 'warning' ? 'border-warning' : 'border-info';
        const btnClass = alert.type === 'danger' ? 'btn-danger' : alert.type === 'warning' ? 'btn-warning' : 'btn-info';
        
        return `
            <div class="alert-item card mb-3 ${alertClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${alert.title}</h6>
                            <p class="mb-0 text-muted">${alert.message}</p>
                        </div>
                        <div>
                            <button class="btn btn-sm ${btnClass} me-2">${alert.action}</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="dismissAlert(this)">Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupActivityFeed() {
    // Activity feed interactions are handled in updateActivityFeed
}

function setupAlerts() {
    // Alert interactions are handled in updateAlerts
}

function dismissAlert(btn) {
    const alertItem = btn.closest('.alert-item');
    if (alertItem) {
        alertItem.style.opacity = '0.5';
        setTimeout(() => {
            alertItem.remove();
        }, 300);
    }
}

function switchComplianceTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchComplianceTab = switchComplianceTab;
window.dismissAlert = dismissAlert;
window.loadComplianceDashboard = loadComplianceDashboard;

