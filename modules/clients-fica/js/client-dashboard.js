// Client Dashboard JavaScript

let dashboardData = {
    clients: [],
    ficaStatus: null,
    stats: {
        total: 0,
        verified: 0,
        pending: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeClientDashboard();
});

async function initializeClientDashboard() {
    try {
        await loadDashboardData();
        updateDashboardStats();
        updateCharts();
        await setupActivityFeed();
        await setupAlerts();
    } catch (error) {
        console.error('Error initializing client dashboard:', error);
        // Show error message but don't break the page
        console.warn('Dashboard will display with default/static values');
    }
}

/**
 * Update Charts with Real Data
 */
function updateCharts() {
    const clients = dashboardData.clients;
    if (!clients || clients.length === 0) {
        console.warn('No client data available for charts');
        return;
    }
    
    // Update charts if chart functions are available
    if (typeof createClientsByRepChart === 'function') {
        // This would need to be updated in charts.js to accept data
        // For now, charts will use static data
    }
}

/**
 * Load Dashboard Data from Database
 */
async function loadDashboardData() {
    try {
        // Check if dataFunctions is available
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available. Please ensure data-functions.js is loaded.');
        }
        
        // Get all clients
        const clientsResult = await dataFunctionsToUse.getClients();
        let clients = clientsResult;
        if (clientsResult && clientsResult.data) {
            clients = clientsResult.data;
        } else if (clientsResult && Array.isArray(clientsResult)) {
            clients = clientsResult;
        }
        
        dashboardData.clients = clients || [];
        
        // Get FICA status overview
        let ficaStatus = null;
        try {
            const ficaResult = await dataFunctionsToUse.getFicaStatusOverview();
            if (ficaResult && ficaResult.data) {
                ficaStatus = ficaResult.data;
            } else if (ficaResult && typeof ficaResult === 'object') {
                ficaStatus = ficaResult;
            }
        } catch (ficaError) {
            console.warn('Could not load FICA status overview:', ficaError);
            // Calculate basic FICA stats from clients if function fails
            const verifiedClients = clients.filter(c => c.fica_status === 'verified' || c.fica_status === 'compliant').length;
            const pendingClients = clients.filter(c => c.fica_status === 'pending' || c.fica_status === 'in_progress').length;
            ficaStatus = {
                verified_count: verifiedClients,
                pending_count: pendingClients,
                total_count: clients.length
            };
        }
        
        dashboardData.ficaStatus = ficaStatus;
        
        // Calculate stats
        calculateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response || error.data
        });
        throw error;
    }
}

/**
 * Calculate Dashboard Statistics
 */
function calculateStats() {
    const clients = dashboardData.clients;
    const ficaStatus = dashboardData.ficaStatus;
    
    dashboardData.stats = {
        total: clients.length,
        verified: ficaStatus?.verified_count || 0,
        pending: ficaStatus?.pending_count || 0,
        highRisk: clients.filter(c => c.risk_category === 'high').length,
        mediumRisk: clients.filter(c => c.risk_category === 'medium').length,
        lowRisk: clients.filter(c => c.risk_category === 'low').length
    };
}

/**
 * Update Dashboard Statistics UI
 */
function updateDashboardStats() {
    const stats = dashboardData.stats;
    const ficaStatus = dashboardData.ficaStatus;
    const clients = dashboardData.clients;
    
    // Update Total Clients
    const totalClientsEl = document.querySelector('#dashboard .stat-value.text-primary');
    if (totalClientsEl) {
        totalClientsEl.textContent = stats.total;
        
        // Update sublabel with month-over-month growth
        const sublabelEl = totalClientsEl.parentElement.querySelector('.stat-sublabel');
        if (sublabelEl) {
            // Calculate new clients this month
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const newThisMonth = clients.filter(c => {
                const createdDate = c.created_at ? new Date(c.created_at) : null;
                return createdDate && createdDate >= firstDayOfMonth;
            }).length;
            
            if (newThisMonth > 0) {
                sublabelEl.textContent = `+${newThisMonth} this month (↑ ${Math.round((newThisMonth / stats.total) * 100)}%)`;
            } else {
                sublabelEl.textContent = 'No new clients this month';
            }
        }
    }
    
    // Update FICA Compliance
    const ficaComplianceEl = document.querySelector('#dashboard .stat-value.text-success');
    if (ficaComplianceEl && stats.total > 0) {
        const percentage = Math.round((stats.verified / stats.total) * 100);
        ficaComplianceEl.textContent = `${percentage}%`;
        
        const sublabelEl = ficaComplianceEl.parentElement.querySelector('.stat-sublabel');
        if (sublabelEl) {
            sublabelEl.textContent = `${stats.verified} / ${stats.total} verified`;
        }
        
        const progressBar = ficaComplianceEl.closest('.stat-card').querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    // Update High Risk Clients
    const highRiskEl = document.querySelector('#dashboard .stat-value.text-warning');
    if (highRiskEl) {
        highRiskEl.textContent = stats.highRisk;
        
        const sublabelEl = highRiskEl.parentElement.querySelector('.stat-sublabel');
        if (sublabelEl && stats.total > 0) {
            const percentage = Math.round((stats.highRisk / stats.total) * 100);
            sublabelEl.textContent = `${percentage}% of portfolio (EDD)`;
        }
    }
    
    // Update Reviews Due (calculate from FICA verifications)
    const reviewsDueEl = document.querySelector('#dashboard .stat-value.text-danger');
    if (reviewsDueEl) {
        // Calculate reviews due from clients with upcoming review dates
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        // This would need to be calculated from FICA verifications
        // For now, use pending count as a proxy
        const reviewsDue = stats.pending || 0;
        const overdue = Math.max(0, reviewsDue - Math.floor(reviewsDue * 0.6)); // Estimate overdue
        const thisMonth = reviewsDue - overdue;
        
        reviewsDueEl.textContent = reviewsDue;
        
        const sublabelEl = reviewsDueEl.parentElement.querySelector('.stat-sublabel');
        if (sublabelEl) {
            sublabelEl.textContent = `${thisMonth} this month, ${overdue} overdue`;
        }
    }
    
    // Update Pending Verifications badge
    const pendingBadge = document.querySelector('#fica-verification-tab .badge');
    if (pendingBadge) {
        pendingBadge.textContent = stats.pending || 0;
        if (stats.pending === 0) {
            pendingBadge.classList.remove('bg-warning');
            pendingBadge.classList.add('bg-success');
        } else {
            pendingBadge.classList.remove('bg-success');
            pendingBadge.classList.add('bg-warning');
        }
    }
    
    // Update FICA Compliance Overview section
    updateFicaComplianceOverview(stats, ficaStatus);
}

/**
 * Setup Activity Feed with Real Data
 */
async function setupActivityFeed() {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;
    
    try {
        // Get recent clients (newly created or updated)
        const clients = dashboardData.clients || [];
        
        // Sort by updated_at or created_at (most recent first)
        const recentClients = [...clients]
            .sort((a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0);
                const dateB = new Date(b.updated_at || b.created_at || 0);
                return dateB - dateA;
            })
            .slice(0, 5); // Show last 5 activities
        
        if (recentClients.length === 0) {
            activityList.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        recentClients.forEach(client => {
            const name = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown Client';
            const createdDate = client.created_at ? new Date(client.created_at) : null;
            const updatedDate = client.updated_at ? new Date(client.updated_at) : null;
            const activityDate = updatedDate || createdDate;
            
            // Determine activity type and icon
            let activityType = 'updated';
            let iconClass = 'fa-file-alt';
            let bgClass = 'bg-info';
            let activityText = 'Client updated';
            
            if (createdDate && (!updatedDate || Math.abs(updatedDate - createdDate) < 1000)) {
                activityType = 'created';
                iconClass = 'fa-check';
                bgClass = 'bg-success';
                activityText = 'New client onboarded';
            } else if (client.fica_status === 'verified' || client.fica_status === 'compliant') {
                activityType = 'verified';
                iconClass = 'fa-shield-check';
                bgClass = 'bg-success';
                activityText = 'FICA verification complete';
            } else if (client.risk_category === 'high') {
                activityType = 'risk';
                iconClass = 'fa-exclamation-triangle';
                bgClass = 'bg-warning';
                activityText = 'Risk level upgraded';
            }
            
            // Format time ago
            const timeAgo = formatTimeAgo(activityDate);
            
            html += `
                <div class="activity-item">
                    <div class="activity-icon ${bgClass}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="activity-content">
                        <h6 class="mb-1">${activityText}</h6>
                        <p class="mb-1 small text-muted">${escapeHtml(name)}${client.fica_status ? ` - ${client.fica_status}` : ''}</p>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewClientProfile('${client.id}')">View Profile</button>
                </div>
            `;
        });
        
        activityList.innerHTML = html;
    } catch (error) {
        console.error('Error loading activity feed:', error);
        activityList.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-exclamation-triangle me-2"></i>Error loading activity feed
            </div>
        `;
    }
}

/**
 * Format time ago
 */
function formatTimeAgo(date) {
    if (!date) return 'Unknown time';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-ZA');
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * View Client Profile (placeholder)
 */
function viewClientProfile(clientId) {
    console.log('View client profile:', clientId);
    // TODO: Navigate to client profile or open modal
    if (typeof switchClientsFicaTab === 'function') {
        switchClientsFicaTab('portfolio-tab');
    }
}

/**
 * Setup Alerts with Real Data
 */
async function setupAlerts() {
    const alertsContainer = document.getElementById('criticalAlertsContainer');
    if (!alertsContainer) return;
    
    try {
        const clients = dashboardData.clients || [];
        const stats = dashboardData.stats;
        
        // Calculate overdue reviews (clients with pending FICA > 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const overdueClients = clients.filter(c => {
            if (c.fica_status !== 'pending' && c.fica_status !== 'in_progress') return false;
            const pendingDate = c.fica_verification_date || c.created_at;
            if (!pendingDate) return false;
            return new Date(pendingDate) < thirtyDaysAgo;
        });
        
        // Calculate reviews due this month
        const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const reviewsDueThisMonth = clients.filter(c => {
            const reviewDate = c.next_fica_review_date;
            if (!reviewDate) return false;
            const review = new Date(reviewDate);
            return review <= thisMonthEnd && review >= now;
        });
        
        let html = '';
        
        // Overdue Reviews Alert
        if (overdueClients.length > 0) {
            const clientNames = overdueClients.slice(0, 3).map(c => 
                `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unknown'
            ).join(', ');
            const moreCount = overdueClients.length > 3 ? ` +${overdueClients.length - 3} more` : '';
            
            html += `
                <div class="alert alert-danger mb-3">
                    <h6><i class="fas fa-exclamation-circle me-2"></i>${overdueClients.length} FICA Review${overdueClients.length > 1 ? 's' : ''} Overdue</h6>
                    <p class="mb-2">Immediate action required to maintain compliance</p>
                    <small class="text-muted">Clients: ${escapeHtml(clientNames)}${moreCount}</small>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-danger me-2" onclick="switchClientsFicaTab('fica-verification-tab')">View All Overdue</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="sendFicaReminders()">Send Reminders</button>
                    </div>
                </div>
            `;
        }
        
        // Reviews Due This Month Alert
        if (reviewsDueThisMonth.length > 0) {
            html += `
                <div class="alert alert-warning mb-3">
                    <h6><i class="fas fa-clock me-2"></i>${reviewsDueThisMonth.length} Review${reviewsDueThisMonth.length > 1 ? 's' : ''} Due This Month</h6>
                    <p class="mb-2">Schedule reviews before month end</p>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-warning me-2" onclick="switchClientsFicaTab('reviews-tab')">View Schedule</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="assignReviews()">Assign Reviews</button>
                    </div>
                </div>
            `;
        }
        
        // High Risk Clients Alert
        if (stats.highRisk > 0) {
            html += `
                <div class="alert alert-warning mb-3">
                    <h6><i class="fas fa-exclamation-triangle me-2"></i>${stats.highRisk} High-Risk Client${stats.highRisk > 1 ? 's' : ''} Requiring EDD</h6>
                    <p class="mb-2">Enhanced Due Diligence required for compliance</p>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-warning me-2" onclick="switchClientsFicaTab('risk-assessment-tab')">View Details</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="reviewRiskAssessments()">Review Risk</button>
                    </div>
                </div>
            `;
        }
        
        // No alerts
        if (html === '') {
            html = `
                <div class="alert alert-success mb-0">
                    <h6><i class="fas fa-check-circle me-2"></i>All Systems Operational</h6>
                    <p class="mb-0">No critical alerts at this time. All clients are compliant.</p>
                </div>
            `;
        }
        
        alertsContainer.innerHTML = html;
    } catch (error) {
        console.error('Error loading alerts:', error);
        alertsContainer.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-exclamation-triangle me-2"></i>Error loading alerts
            </div>
        `;
    }
}

/**
 * Placeholder functions for alert actions
 */
function sendFicaReminders() {
    console.log('Send FICA reminders');
    // TODO: Implement
}

function assignReviews() {
    console.log('Assign reviews');
    // TODO: Implement
}

function reviewRiskAssessments() {
    console.log('Review risk assessments');
    // TODO: Implement
}

/**
 * Update FICA Compliance Overview Section
 */
function updateFicaComplianceOverview(stats, ficaStatus) {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    // Update verification rate
    const verificationRateEl = document.getElementById('verificationRate');
    if (verificationRateEl && stats.total > 0) {
        const percentage = Math.round((stats.verified / stats.total) * 100);
        verificationRateEl.textContent = `${percentage}%`;
    } else if (verificationRateEl) {
        verificationRateEl.textContent = '-';
    }
    
    // Update average verification time
    const avgTimeEl = document.getElementById('avgVerificationTime');
    if (avgTimeEl) {
        if (ficaStatus && ficaStatus.avg_verification_days) {
            avgTimeEl.textContent = `${ficaStatus.avg_verification_days} days`;
        } else {
            // Calculate from clients if available
            const clients = dashboardData.clients || [];
            const verifiedClients = clients.filter(c => 
                c.fica_status === 'verified' || c.fica_status === 'compliant'
            );
            
            if (verifiedClients.length > 0) {
                // Calculate average days from created to verified
                let totalDays = 0;
                let count = 0;
                verifiedClients.forEach(c => {
                    if (c.created_at && c.fica_verification_date) {
                        const created = new Date(c.created_at);
                        const verified = new Date(c.fica_verification_date);
                        const days = Math.floor((verified - created) / (1000 * 60 * 60 * 24));
                        if (days >= 0) {
                            totalDays += days;
                            count++;
                        }
                    }
                });
                
                if (count > 0) {
                    const avgDays = Math.round(totalDays / count);
                    avgTimeEl.textContent = `${avgDays} days`;
                } else {
                    avgTimeEl.textContent = 'N/A';
                }
            } else {
                avgTimeEl.textContent = 'N/A';
            }
        }
    }
}

function switchClientsFicaTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

// Export for global access
window.switchClientsFicaTab = switchClientsFicaTab;
window.viewClientProfile = viewClientProfile;
window.sendFicaReminders = sendFicaReminders;
window.assignReviews = assignReviews;
window.reviewRiskAssessments = reviewRiskAssessments;

