// Executive Dashboard Main JavaScript

let dashboardData = {
    health: null,
    teamMatrix: null,
    cpdProgress: null,
    deadlines: null,
    complaints: null,
    fica: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    updateLastRefreshTime();
    setupEventListeners();
    await loadDashboardData();
}

function updateLastRefreshTime() {
    const now = new Date();
    const formatted = formatDateTime(now);
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = formatted;
    }
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function setupEventListeners() {
    // Setup any event listeners here
}

async function loadDashboardData() {
    try {
        // Check if dataFunctions is available - try current window first, then parent window
        let df = null;
        
        // Try current window
        if (typeof dataFunctions !== 'undefined' && dataFunctions) {
            df = dataFunctions;
        }
        // Try parent window (in case it's loaded there)
        else if (window.parent && typeof window.parent.dataFunctions !== 'undefined' && window.parent.dataFunctions) {
            df = window.parent.dataFunctions;
        }
        // Wait a bit if it's still loading
        else {
            let retries = 0;
            while (retries < 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (typeof dataFunctions !== 'undefined' && dataFunctions) {
                    df = dataFunctions;
                    break;
                }
                if (window.parent && typeof window.parent.dataFunctions !== 'undefined' && window.parent.dataFunctions) {
                    df = window.parent.dataFunctions;
                    break;
                }
                retries++;
            }
        }
        
        if (!df) {
            throw new Error('dataFunctions is not loaded. Please ensure data-functions.js is included before dashboard-main.js. Path should be: ../../../js/data-functions.js');
        }
        
        // Use the found dataFunctions and store globally
        window.dataFunctionsToUse = df;
        const dataFunctionsToUse = df;
        
        showLoadingState();
        
        // Load all dashboard data in parallel (including FSP configuration and KI count)
        const [health, teamMatrix, cpdProgress, deadlines, complaints, fica, fspConfig, kiCount] = await Promise.all([
            dataFunctionsToUse.getExecutiveDashboardHealth().catch(err => { console.error('Health data error:', err); return null; }),
            dataFunctionsToUse.getTeamComplianceMatrix().catch(err => { console.error('Team matrix error:', err); return null; }),
            dataFunctionsToUse.getCpdProgressDashboard().catch(err => { console.error('CPD progress error:', err); return null; }),
            dataFunctionsToUse.getUpcomingDeadlines(90).catch(err => { console.error('Deadlines error:', err); return null; }),
            dataFunctionsToUse.getComplaintsDashboardSummary().catch(err => { console.error('Complaints error:', err); return null; }),
            dataFunctionsToUse.getFicaStatusOverview().catch(err => { console.error('FICA error:', err); return null; }),
            dataFunctionsToUse.getFspConfiguration().catch(err => { console.error('FSP config error:', err); return null; }),
            dataFunctionsToUse.getKeyIndividualsCount().catch(err => { console.error('KI count error:', err); return null; })
        ]);
        
        dashboardData = {
            health: health?.data || health,
            teamMatrix: teamMatrix?.data || teamMatrix,
            cpdProgress: cpdProgress?.data || cpdProgress,
            deadlines: deadlines?.data || deadlines,
            complaints: complaints?.data || complaints,
            fica: fica?.data || fica,
            fspConfig: fspConfig?.data || fspConfig,
            kiCount: kiCount?.data || kiCount
        };
        
        // Update all dashboard sections
        updateHealthScore();
        updateTeamOverview();
        updateComplianceAreas();
        updateCPDWidget();
        updateFICAWidget();
        updateDeadlines();
        updateStatistics();
        updateAlerts();
        updateRecentActivity();
        updateFSPLicense();
        updateLicenseDetails();
        updateUserInfo();
        updateAchievements();
        
        hideLoadingState();
        updateLastRefreshTime();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        hideLoadingState();
        
        // Check if session expired before showing error
        if (typeof authService !== 'undefined' && authService.handleErrorWithSessionCheck) {
            await authService.handleErrorWithSessionCheck(error, {
                title: 'Error Loading Dashboard',
                message: 'Failed to load dashboard data. Please try again.'
            });
        } else {
            // Fallback if authService not available
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Dashboard',
                    text: 'Failed to load dashboard data. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
}

function showLoadingState() {
    const loadingElements = document.querySelectorAll('.dashboard-loading');
    loadingElements.forEach(el => el.style.display = 'block');
}

function hideLoadingState() {
    const loadingElements = document.querySelectorAll('.dashboard-loading');
    loadingElements.forEach(el => el.style.display = 'none');
}

function updateHealthScore() {
    // Validate health data exists
    if (!dashboardData.health) return;
    
    // Handle both array and object formats
    let health = null;
    if (Array.isArray(dashboardData.health)) {
        if (dashboardData.health.length === 0) return;
        health = dashboardData.health[0];
    } else if (typeof dashboardData.health === 'object') {
        health = dashboardData.health;
    } else {
        return;
    }
    
    // Validate health object and score property exist
    if (!health || typeof health.overall_compliance_score === 'undefined') {
        console.warn('Health score data not available');
        return;
    }
    
    const score = parseFloat(health.overall_compliance_score) || 0;
    
    // Update health score chart (will be handled by health-score.js)
    if (window.updateHealthScoreChart) {
        window.updateHealthScoreChart(score);
    }
}

function updateTeamOverview() {
    if (!dashboardData.teamMatrix || dashboardData.teamMatrix.length === 0) return;
    
    const matrix = dashboardData.teamMatrix;
    const activeReps = matrix.filter(r => r.rep_status === 'active');
    const compliantReps = activeReps.filter(r => r.compliance_indicator === 'green');
    const nonCompliantReps = activeReps.filter(r => r.compliance_indicator === 'red');
    const atRiskReps = activeReps.filter(r => r.compliance_indicator === 'amber');
    
    // Update team overview stats
    const activeRepsElement = document.querySelector('[data-stat="active-reps"]');
    if (activeRepsElement) {
        activeRepsElement.textContent = activeReps.length;
    }
    
    const compliantCount = compliantReps.length;
    const compliantPct = activeReps.length > 0 ? Math.round((compliantCount / activeReps.length) * 100) : 0;
    const compliantElement = document.querySelector('[data-stat="compliant-reps"]');
    if (compliantElement) {
        compliantElement.textContent = compliantCount;
    }
    const compliantPctElement = document.querySelector('[data-stat="compliant-pct"]');
    if (compliantPctElement) {
        compliantPctElement.textContent = `${compliantPct}%`;
    }
    
    const nonCompliantCount = nonCompliantReps.length;
    const nonCompliantPct = activeReps.length > 0 ? Math.round((nonCompliantCount / activeReps.length) * 100) : 0;
    const nonCompliantElement = document.querySelector('[data-stat="non-compliant-reps"]');
    if (nonCompliantElement) {
        nonCompliantElement.textContent = nonCompliantCount;
    }
    const nonCompliantPctElement = document.querySelector('[data-stat="non-compliant-pct"]');
    if (nonCompliantPctElement) {
        nonCompliantPctElement.textContent = `${nonCompliantPct}%`;
    }
    
    const atRiskElement = document.querySelector('[data-stat="at-risk-reps"]');
    if (atRiskElement) {
        atRiskElement.textContent = atRiskReps.length;
    }
    
    // Update at-risk details
    const atRiskDetails = document.getElementById('atRiskBreakdown');
    if (atRiskDetails && atRiskReps.length > 0) {
        atRiskDetails.innerHTML = atRiskReps.slice(0, 3).map(rep => {
            const cpdProgress = parseFloat(rep.cpd_progress) || 0;
            return `<small>${rep.representative_name} (${Math.round(cpdProgress)}% - ${rep.compliance_indicator === 'red' ? 'critical' : 'warning'})</small><br>`;
        }).join('');
        if (atRiskReps.length > 3) {
            atRiskDetails.innerHTML += `<small class="text-muted">+${atRiskReps.length - 3} more</small>`;
        }
    } else if (atRiskDetails) {
        atRiskDetails.innerHTML = '<small class="text-muted">No at-risk representatives</small>';
    }
    
    // Update score breakdown
    const scoreBreakdown = document.getElementById('scoreBreakdown');
    if (scoreBreakdown && activeReps.length > 0) {
        const scores = activeReps.map(r => {
            // Calculate a simple score based on compliance indicator
            if (r.compliance_indicator === 'green') return 100;
            if (r.compliance_indicator === 'amber') return 70;
            if (r.compliance_indicator === 'red') return 30;
            return 50;
        });
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const highestRep = activeReps[scores.indexOf(highest)];
        const lowestRep = activeReps[scores.indexOf(lowest)];
        
        scoreBreakdown.innerHTML = `
            <small>Highest: ${Math.round(highest)}% (${highestRep?.representative_name || 'N/A'})</small><br>
            <small>Lowest: ${Math.round(lowest)}% (${lowestRep?.representative_name || 'N/A'})</small>
        `;
    }
    
    // Update Team Compliance Matrix table
    updateTeamComplianceMatrixTable(activeReps);
}

function updateTeamComplianceMatrixTable(representatives) {
    const tbody = document.getElementById('teamComplianceMatrixBody');
    if (!tbody) return;
    
    // Sort by compliance indicator (red first, then amber, then green)
    const sortedReps = [...representatives].sort((a, b) => {
        const order = { 'red': 0, 'amber': 1, 'green': 2 };
        return (order[a.compliance_indicator] || 3) - (order[b.compliance_indicator] || 3);
    });
    
    // Show top 10 representatives (or all if less than 10)
    const displayReps = sortedReps.slice(0, 10);
    
    if (displayReps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No representatives found</td></tr>';
        return;
    }
    
    tbody.innerHTML = displayReps.map(rep => {
        // Determine row class based on compliance indicator
        let rowClass = '';
        if (rep.compliance_indicator === 'green') rowClass = 'table-success';
        else if (rep.compliance_indicator === 'red') rowClass = 'table-danger';
        else if (rep.compliance_indicator === 'amber') rowClass = 'table-warning';
        
        // Fit & Proper status
        const fpStatus = rep.fit_proper_status || 'unknown';
        let fpBadge = '';
        if (fpStatus === 'compliant') {
            fpBadge = '<span class="badge bg-success">✓</span>';
        } else if (fpStatus === 'expiring_soon' || fpStatus === 'non_compliant') {
            fpBadge = '<span class="badge bg-danger">✗</span>';
        } else {
            fpBadge = '<span class="badge bg-secondary">-</span>';
        }
        
        // CPD status
        const cpdProgress = parseFloat(rep.cpd_progress) || 0;
        const cpdStatus = rep.cpd_status || 'unknown';
        let cpdBadge = '';
        if (cpdStatus === 'compliant') {
            cpdBadge = `<span class="badge bg-success">${Math.round(cpdProgress)}% ✓</span>`;
        } else if (cpdStatus === 'critical') {
            cpdBadge = `<span class="badge bg-danger">${Math.round(cpdProgress)}% ✗</span>`;
        } else if (cpdStatus === 'at_risk' || cpdStatus === 'on_track') {
            cpdBadge = `<span class="badge bg-warning">${Math.round(cpdProgress)}% ⚠️</span>`;
        } else {
            cpdBadge = '<span class="badge bg-secondary">-</span>';
        }
        
        // FICA status
        const compliantFica = parseInt(rep.compliant_fica_count) || 0;
        const nonCompliantFica = parseInt(rep.non_compliant_fica_count) || 0;
        let ficaBadge = '';
        if (nonCompliantFica > 0) {
            ficaBadge = '<span class="badge bg-danger">✗</span>';
        } else if (compliantFica > 0) {
            ficaBadge = '<span class="badge bg-success">✓</span>';
        } else {
            ficaBadge = '<span class="badge bg-secondary">-</span>';
        }
        
        // Documents status (placeholder - not in current data)
        const docsBadge = '<span class="badge bg-secondary">-</span>';
        
        // Overall compliance
        let overallBadge = '';
        if (rep.compliance_indicator === 'green') {
            overallBadge = '<span class="badge bg-success">Compliant</span>';
        } else if (rep.compliance_indicator === 'red') {
            overallBadge = '<span class="badge bg-danger">Non-Compliant</span>';
        } else if (rep.compliance_indicator === 'amber') {
            overallBadge = '<span class="badge bg-warning">At Risk</span>';
        } else {
            overallBadge = '<span class="badge bg-secondary">Unknown</span>';
        }
        
        // Actions
        const urgentBtn = rep.compliance_indicator === 'red' 
            ? '<button class="btn btn-sm btn-danger me-1" title="Urgent Action Required"><i class="fas fa-exclamation-triangle"></i></button>'
            : '';
        
        return `
            <tr class="${rowClass}">
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm me-2">
                            <i class="fas fa-user"></i>
                        </div>
                        <strong>${rep.representative_name || 'Unknown'}</strong>
                    </div>
                </td>
                <td>${fpBadge}</td>
                <td>${cpdBadge}</td>
                <td>${ficaBadge}</td>
                <td>${docsBadge}</td>
                <td>${overallBadge}</td>
                <td>
                    ${urgentBtn}
                    <button class="btn btn-sm btn-outline-primary me-1" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-outline-secondary" title="Send Reminder"><i class="fas fa-envelope"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add note if there are more representatives
    if (sortedReps.length > 10) {
        tbody.innerHTML += `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <small>Showing top 10 of ${sortedReps.length} representatives. <a href="#" onclick="viewFullTeamMatrix(); return false;">View Full Team Matrix</a> to see all.</small>
                </td>
            </tr>
        `;
    }
}

function updateComplianceAreas() {
    // Validate health data exists
    if (!dashboardData.health) return;
    
    // Handle both array and object formats
    let health = null;
    if (Array.isArray(dashboardData.health)) {
        if (dashboardData.health.length === 0) return;
        health = dashboardData.health[0];
    } else if (typeof dashboardData.health === 'object') {
        health = dashboardData.health;
    } else {
        return;
    }
    
    // Validate health object exists
    if (!health) return;
    
    const totalReps = (health && typeof health.active_representatives !== 'undefined') 
        ? parseInt(health.active_representatives) 
        : 1;
    const matrix = dashboardData.teamMatrix || [];
    const activeReps = matrix.filter(r => r.rep_status === 'active');
    
    // Fit & Proper
    const fitProperCompliant = parseInt(health.fit_proper_compliant) || 0;
    const fitProperPct = Math.round((fitProperCompliant / totalReps) * 100);
    
    // Update mini-gauge
    const fpBadge = document.getElementById('fpBadge');
    if (fpBadge) {
        fpBadge.textContent = `${fitProperPct}%`;
        fpBadge.className = `badge ${fitProperPct >= 85 ? 'bg-success' : fitProperPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
    }
    const fpDetails = document.getElementById('fpDetails');
    if (fpDetails) {
        fpDetails.textContent = `${fitProperCompliant}/${totalReps} compliant`;
    }
    
    // Update Fit & Proper card
    const fpAreaBadge = document.getElementById('fpAreaBadge');
    if (fpAreaBadge) {
        fpAreaBadge.textContent = `${fitProperPct}% Compliant`;
        fpAreaBadge.className = `badge ${fitProperPct >= 85 ? 'bg-success' : fitProperPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
    }
    const fpAreaCount = document.getElementById('fpAreaCount');
    if (fpAreaCount) {
        fpAreaCount.textContent = `${fitProperCompliant} / ${totalReps} Representatives`;
    }
    const fpAreaProgress = document.getElementById('fpAreaProgress');
    if (fpAreaProgress) {
        fpAreaProgress.style.width = `${fitProperPct}%`;
        fpAreaProgress.className = `progress-bar ${fitProperPct >= 85 ? 'bg-success' : fitProperPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
    }
    
    // Count Fit & Proper issues
    const fpIssues = activeReps.filter(r => r.fit_proper_status && r.fit_proper_status !== 'compliant').length;
    const fpAreaDetails = document.getElementById('fpAreaDetails');
    if (fpAreaDetails) {
        fpAreaDetails.innerHTML = `
            <li>✓ Compliant: ${fitProperCompliant}</li>
            <li>${fpIssues > 0 ? '✗' : '✓'} Issues: ${fpIssues} ${fpIssues > 0 ? 'Critical' : 'None'}</li>
        `;
    }
    
    // CPD
    const cpdCompliant = parseInt(health.cpd_compliant) || 0;
    const cpdPct = Math.round((cpdCompliant / totalReps) * 100);
    
    // Update mini-gauge
    const cpdBadge = document.getElementById('cpdBadge');
    if (cpdBadge) {
        cpdBadge.textContent = `${cpdPct}%`;
        cpdBadge.className = `badge ${cpdPct >= 85 ? 'bg-success' : cpdPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
    }
    
    // Calculate CPD stats from progress data
    if (dashboardData.cpdProgress && dashboardData.cpdProgress.length > 0) {
        const cpd = dashboardData.cpdProgress;
        const completed = cpd.filter(r => r.compliance_status === 'compliant').length;
        const inProgress = cpd.filter(r => r.compliance_status === 'on_track' || r.compliance_status === 'at_risk').length;
        const atRisk = cpd.filter(r => r.compliance_status === 'critical').length;
        const avgDaysRemaining = cpd.length > 0 ? Math.round(cpd.reduce((sum, r) => sum + (parseInt(r.days_remaining) || 0), 0) / cpd.length) : 0;
        
        const cpdDetails = document.getElementById('cpdDetails');
        if (cpdDetails) {
            cpdDetails.textContent = `${completed}/${totalReps} compliant • ${avgDaysRemaining} days to deadline`;
        }
        
        // Update CPD card
        const cpdAreaBadge = document.getElementById('cpdAreaBadge');
        if (cpdAreaBadge) {
            cpdAreaBadge.textContent = `${cpdPct}% Compliant`;
            cpdAreaBadge.className = `badge ${cpdPct >= 85 ? 'bg-success' : cpdPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
        }
        const cpdAreaCount = document.getElementById('cpdAreaCount');
        if (cpdAreaCount) {
            cpdAreaCount.textContent = `${completed} / ${totalReps} Representatives`;
        }
        const cpdAreaProgress = document.getElementById('cpdAreaProgress');
        if (cpdAreaProgress) {
            cpdAreaProgress.style.width = `${cpdPct}%`;
            cpdAreaProgress.className = `progress-bar ${cpdPct >= 85 ? 'bg-success' : cpdPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
        }
        const cpdAreaDetails = document.getElementById('cpdAreaDetails');
        if (cpdAreaDetails) {
            cpdAreaDetails.innerHTML = `
                <li>✓ Completed (18+ hrs): ${completed}</li>
                <li>⚠️ In Progress (10-17 hrs): ${inProgress}</li>
                <li>✗ At Risk (< 10 hrs): ${atRisk}</li>
                <li>📅 Days to Deadline: <strong>${avgDaysRemaining} days</strong></li>
            `;
        }
        
        // Calculate team totals
        const totalHours = cpd.reduce((sum, r) => sum + parseFloat(r.total_hours_logged || 0), 0);
        const avgHours = totalReps > 0 ? (totalHours / totalReps).toFixed(1) : 0;
        const cpdAreaSummary = document.getElementById('cpdAreaSummary');
        if (cpdAreaSummary) {
            cpdAreaSummary.textContent = `Team Total: ${Math.round(totalHours)} hrs • Avg: ${avgHours} hrs/person`;
        }
    }
    
    // FICA
    const ficaCompliant = parseInt(health.fica_compliant) || 0;
    const ficaPct = Math.round((ficaCompliant / totalReps) * 100);
    
    // Update mini-gauge
    const ficaBadge = document.getElementById('ficaBadge');
    if (ficaBadge) {
        ficaBadge.textContent = `${ficaPct}%`;
        ficaBadge.className = `badge ${ficaPct >= 85 ? 'bg-success' : ficaPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
    }
    
    // Update FICA details from fica data
    if (dashboardData.fica && dashboardData.fica.length > 0) {
        const fica = dashboardData.fica;
        const compliantCount = fica.find(f => f.fica_status === 'compliant')?.verification_count || 0;
        const totalCount = fica.reduce((sum, f) => sum + parseInt(f.verification_count || 0), 0);
        
        const ficaDetails = document.getElementById('ficaDetails');
        if (ficaDetails) {
            ficaDetails.textContent = `${compliantCount}/${totalCount} clients`;
        }
        
        // Update FICA card
        const ficaAreaBadge = document.getElementById('ficaAreaBadge');
        if (ficaAreaBadge) {
            const ficaCompliantPct = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;
            ficaAreaBadge.textContent = `${ficaCompliantPct}% Compliant`;
            ficaAreaBadge.className = `badge ${ficaCompliantPct >= 85 ? 'bg-success' : ficaCompliantPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
        }
        const ficaAreaCount = document.getElementById('ficaAreaCount');
        if (ficaAreaCount) {
            ficaAreaCount.textContent = `${compliantCount} / ${totalCount} Clients`;
        }
        const ficaAreaProgress = document.getElementById('ficaAreaProgress');
        if (ficaAreaProgress && totalCount > 0) {
            const ficaCompliantPct = Math.round((compliantCount / totalCount) * 100);
            ficaAreaProgress.style.width = `${ficaCompliantPct}%`;
            ficaAreaProgress.className = `progress-bar ${ficaCompliantPct >= 85 ? 'bg-success' : ficaCompliantPct >= 70 ? 'bg-warning' : 'bg-danger'}`;
        }
        const ficaAreaDetails = document.getElementById('ficaAreaDetails');
        if (ficaAreaDetails) {
            const overdue = fica.find(f => f.fica_status === 'non_compliant')?.overdue_reviews || 0;
            const dueSoon = fica.find(f => f.fica_status === 'non_compliant')?.reviews_due_soon || 0;
            ficaAreaDetails.innerHTML = `
                <li>✓ Current: ${compliantCount} clients</li>
                <li>⚠️ Reviews Due (30 days): ${dueSoon}</li>
                <li>✗ Overdue: ${overdue}</li>
            `;
        }
    }
}

function updateCPDWidget() {
    if (!dashboardData.cpdProgress || dashboardData.cpdProgress.length === 0) return;
    
    const cpd = dashboardData.cpdProgress;
    const completed = cpd.filter(r => r.compliance_status === 'compliant').length;
    const inProgress = cpd.filter(r => r.compliance_status === 'on_track' || r.compliance_status === 'at_risk').length;
    const atRisk = cpd.filter(r => r.compliance_status === 'critical').length;
    
    // Update CPD chart (will be handled by charts.js)
    if (window.updateCPDChart) {
        window.updateCPDChart(completed, inProgress, atRisk);
    }
    
    // Update days remaining
    if (cpd.length > 0) {
        const avgDaysRemaining = Math.round(cpd.reduce((sum, r) => sum + (parseInt(r.days_remaining) || 0), 0) / cpd.length);
        const daysRemainingEl = document.getElementById('cpdDaysRemaining');
        if (daysRemainingEl) {
            daysRemainingEl.textContent = avgDaysRemaining;
        }
        
        // Calculate year progress (assuming cycle is 365 days)
        const cycle = cpd[0];
        if (cycle && cycle.start_date && cycle.end_date) {
            const startDate = new Date(cycle.start_date);
            const endDate = new Date(cycle.end_date);
            const today = new Date();
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
            const yearProgress = Math.round((daysElapsed / totalDays) * 100);
            
            const yearProgressEl = document.getElementById('cpdYearProgress');
            if (yearProgressEl) {
                yearProgressEl.style.width = `${yearProgress}%`;
            }
            const yearElapsedEl = document.getElementById('cpdYearElapsed');
            if (yearElapsedEl) {
                yearElapsedEl.textContent = `${yearProgress}% of year elapsed`;
            }
        }
        
        // Update top performers
        const topPerformers = [...cpd]
            .sort((a, b) => parseFloat(b.total_hours_logged || 0) - parseFloat(a.total_hours_logged || 0))
            .slice(0, 3);
        const topPerformersEl = document.getElementById('cpdTopPerformers');
        if (topPerformersEl) {
            if (topPerformers.length > 0) {
                topPerformersEl.innerHTML = topPerformers.map((rep, idx) => {
                    const hours = parseFloat(rep.total_hours_logged || 0);
                    const required = parseFloat(rep.required_hours || 18);
                    const pct = required > 0 ? Math.round((hours / required) * 100) : 0;
                    const medals = ['🥇', '🥈', '🥉'];
                    return `<li>${medals[idx]} ${rep.representative_name}: ${hours.toFixed(1)} hrs (${pct}%)</li>`;
                }).join('');
            } else {
                topPerformersEl.innerHTML = '<li class="text-muted">No data available</li>';
            }
        }
        
        // Update need attention
        const needAttention = [...cpd]
            .filter(r => r.compliance_status === 'critical')
            .sort((a, b) => parseFloat(a.total_hours_logged || 0) - parseFloat(b.total_hours_logged || 0))
            .slice(0, 3);
        const needAttentionEl = document.getElementById('cpdNeedAttention');
        if (needAttentionEl) {
            if (needAttention.length > 0) {
                needAttentionEl.innerHTML = needAttention.map(rep => {
                    const hours = parseFloat(rep.total_hours_logged || 0);
                    const required = parseFloat(rep.required_hours || 18);
                    const pct = required > 0 ? Math.round((hours / required) * 100) : 0;
                    return `<li>🔴 ${rep.representative_name}: ${hours.toFixed(1)} hrs (${pct}%)</li>`;
                }).join('');
            } else {
                needAttentionEl.innerHTML = '<li class="text-muted">No critical issues</li>';
            }
        }
    }
}

function updateFICAWidget() {
    if (!dashboardData.fica || dashboardData.fica.length === 0) return;
    
    const fica = dashboardData.fica;
    const compliant = fica.find(f => f.fica_status === 'compliant');
    const compliantCount = compliant ? parseInt(compliant.verification_count) : 0;
    const totalCount = fica.reduce((sum, f) => sum + parseInt(f.verification_count || 0), 0);
    const compliantPct = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;
    
    // Update FICA widget percentage
    const ficaCompliantPctEl = document.getElementById('ficaCompliantPct');
    if (ficaCompliantPctEl) {
        ficaCompliantPctEl.textContent = `${compliantPct}%`;
        ficaCompliantPctEl.className = `h3 ${compliantPct >= 85 ? 'text-success' : compliantPct >= 70 ? 'text-warning' : 'text-danger'}`;
    }
    
    // Update FICA compliant count
    const ficaCompliantCountEl = document.getElementById('ficaCompliantCount');
    if (ficaCompliantCountEl) {
        ficaCompliantCountEl.textContent = `${compliantCount} / ${totalCount} clients current`;
    }
    
    // Update risk breakdown (simplified - we don't have risk category breakdown in current data)
    const ficaRiskBreakdown = document.getElementById('ficaRiskBreakdown');
    if (ficaRiskBreakdown) {
        const nonCompliant = fica.find(f => f.fica_status === 'non_compliant');
        const nonCompliantCount = nonCompliant ? parseInt(nonCompliant.verification_count) : 0;
        const overdue = fica.reduce((sum, f) => sum + parseInt(f.overdue_reviews || 0), 0);
        const dueSoon = fica.reduce((sum, f) => sum + parseInt(f.reviews_due_soon || 0), 0);
        
        ficaRiskBreakdown.innerHTML = `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>Compliant:</span>
                    <span>${compliantCount}/${totalCount} (${compliantPct}%)</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar ${compliantPct >= 85 ? 'bg-success' : compliantPct >= 70 ? 'bg-warning' : 'bg-danger'}" style="width: ${compliantPct}%"></div>
                </div>
            </div>
            ${nonCompliantCount > 0 ? `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>Non-Compliant:</span>
                    <span>${nonCompliantCount}/${totalCount} (${Math.round((nonCompliantCount / totalCount) * 100)}%)</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-danger" style="width: ${Math.round((nonCompliantCount / totalCount) * 100)}%"></div>
                </div>
            </div>
            ` : ''}
            ${overdue > 0 || dueSoon > 0 ? `
            <div class="alert alert-warning py-2 px-3 mb-0">
                <small>⚠️ ${overdue} overdue reviews • ${dueSoon} due soon</small>
            </div>
            ` : ''}
        `;
    }
}

function updateDeadlines() {
    if (!dashboardData.deadlines || dashboardData.deadlines.length === 0) {
        const deadlineList = document.getElementById('deadlineList');
        if (deadlineList) {
            deadlineList.innerHTML = '<div class="text-center text-muted py-3">No upcoming deadlines</div>';
        }
        return;
    }
    
    const deadlines = dashboardData.deadlines;
    const urgent = deadlines.filter(d => d.urgency === 'urgent' || d.urgency === 'overdue');
    const soon = deadlines.filter(d => d.urgency === 'soon');
    const upcoming = deadlines.filter(d => d.urgency === 'upcoming');
    
    // Update deadline counts
    const urgentElement = document.querySelector('[data-deadline="urgent"]');
    if (urgentElement) {
        urgentElement.textContent = urgent.length;
    }
    
    const soonElement = document.querySelector('[data-deadline="soon"]');
    if (soonElement) {
        soonElement.textContent = soon.length;
    }
    
    const upcomingElement = document.querySelector('[data-deadline="upcoming"]');
    if (upcomingElement) {
        upcomingElement.textContent = upcoming.length;
    }
    
    // Update deadline list (show top 5)
    const deadlineList = document.getElementById('deadlineList');
    if (deadlineList) {
        const sortedDeadlines = [...deadlines].sort((a, b) => {
            const urgencyOrder = { 'overdue': 0, 'urgent': 1, 'soon': 2, 'upcoming': 3 };
            return (urgencyOrder[a.urgency] || 4) - (urgencyOrder[b.urgency] || 4);
        });
        
        const displayDeadlines = sortedDeadlines.slice(0, 5);
        
        if (displayDeadlines.length === 0) {
            deadlineList.innerHTML = '<div class="text-center text-muted py-3">No upcoming deadlines</div>';
        } else {
            deadlineList.innerHTML = displayDeadlines.map(deadline => {
                const deadlineDate = new Date(deadline.deadline_date);
                const daysUntil = parseInt(deadline.days_until) || 0;
                const isOverdue = daysUntil < 0;
                const dateStr = deadlineDate.toLocaleDateString('en-ZA');
                const daysStr = isOverdue ? `${Math.abs(daysUntil)} days ago` : `${daysUntil} days`;
                
                // Safe urgency handling
                const urgency = deadline.urgency || 'upcoming';
                
                let itemClass = 'deadline-item';
                let badgeClass = 'badge';
                let badgeText = urgency.toUpperCase();
                
                if (urgency === 'overdue' || isOverdue) {
                    itemClass += ' overdue';
                    badgeClass += ' bg-danger';
                    badgeText = 'OVERDUE';
                } else if (urgency === 'urgent') {
                    itemClass += ' high';
                    badgeClass += ' bg-warning';
                    badgeText = 'URGENT';
                } else if (urgency === 'soon') {
                    itemClass += ' medium';
                    badgeClass += ' bg-warning';
                    badgeText = 'SOON';
                } else {
                    itemClass += ' upcoming';
                    badgeClass += ' bg-info';
                    badgeText = 'UPCOMING';
                }
                
                return `
                    <div class="${itemClass}">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="deadline-date ${isOverdue ? 'text-danger' : ''}">${dateStr} (${daysStr})</div>
                                <div class="deadline-title">${deadline.deadline_type}</div>
                                <div class="deadline-category">${deadline.representative_name || 'System'}</div>
                            </div>
                            <div>
                                <span class="${badgeClass}">${badgeText}</span>
                                ${isOverdue ? '<button class="btn btn-sm btn-danger mt-2" onclick="resolveDeadline(\'' + deadline.id + '\')">Resolve Now</button>' : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Update "Show All Deadlines" button
        const viewAllBtn = document.getElementById('viewAllDeadlinesBtn');
        if (viewAllBtn) {
            viewAllBtn.textContent = `Show All Deadlines (${deadlines.length} upcoming)`;
        }
    }
}

function updateStatistics() {
    // Validate health data exists
    if (!dashboardData.health) return;
    
    // Handle both array and object formats
    let health = null;
    if (Array.isArray(dashboardData.health)) {
        if (dashboardData.health.length === 0) return;
        health = dashboardData.health[0];
    } else if (typeof dashboardData.health === 'object') {
        health = dashboardData.health;
    } else {
        return;
    }
    
    // Validate health object exists
    if (!health) return;
    
    const matrix = dashboardData.teamMatrix || [];
    const fica = dashboardData.fica || [];
    
    // Update key statistics with safe property access
    const activeRepsElement = document.querySelector('[data-stat="active-reps-count"]');
    if (activeRepsElement && typeof health.active_representatives !== 'undefined') {
        activeRepsElement.textContent = health.active_representatives;
    }
    
    const avgScoreElement = document.querySelector('[data-stat="avg-score"]');
    if (avgScoreElement && typeof health.overall_compliance_score !== 'undefined') {
        avgScoreElement.textContent = `${Math.round(parseFloat(health.overall_compliance_score))}%`;
    }
    
    // Total clients (from FICA or matrix)
    const totalClients = fica.reduce((sum, f) => sum + parseInt(f.verification_count || 0), 0) || 
                       matrix.reduce((sum, r) => sum + parseInt(r.client_count || 0), 0);
    const totalClientsEl = document.getElementById('totalClientsStat');
    if (totalClientsEl) {
        totalClientsEl.textContent = totalClients || '-';
    }
    
    // FICA Compliant percentage
    const ficaCompliant = fica.find(f => f.fica_status === 'compliant');
    const ficaCompliantCount = ficaCompliant ? parseInt(ficaCompliant.verification_count) : 0;
    const ficaCompliantPct = totalClients > 0 ? Math.round((ficaCompliantCount / totalClients) * 100) : 0;
    const ficaCompliantEl = document.getElementById('ficaCompliantStat');
    if (ficaCompliantEl) {
        ficaCompliantEl.textContent = `${ficaCompliantPct}%`;
    }
    
    // Documents (placeholder - not in current data)
    const totalDocumentsEl = document.getElementById('totalDocumentsStat');
    if (totalDocumentsEl) {
        totalDocumentsEl.textContent = '-';
    }
    const documentsCurrentEl = document.getElementById('documentsCurrentStat');
    if (documentsCurrentEl) {
        documentsCurrentEl.textContent = '-';
    }
    
    // Compliance checks (placeholder)
    const complianceChecksEl = document.getElementById('complianceChecksStat');
    if (complianceChecksEl) {
        complianceChecksEl.textContent = '-';
    }
    
    // Audits completed (placeholder)
    const auditsCompletedEl = document.getElementById('auditsCompletedStat');
    if (auditsCompletedEl) {
        auditsCompletedEl.textContent = '-';
    }
}

function updateAlerts() {
    // Validate health data exists
    if (!dashboardData.health) return;
    
    // Handle both array and object formats
    let health = null;
    if (Array.isArray(dashboardData.health)) {
        if (dashboardData.health.length === 0) return;
        health = dashboardData.health[0];
    } else if (typeof dashboardData.health === 'object') {
        health = dashboardData.health;
    } else {
        return;
    }
    
    // Validate health object exists
    if (!health) return;
    
    const deadlines = dashboardData.deadlines || [];
    const complaints = dashboardData.complaints || [];
    
    // Calculate alert counts
    const overdueDeadlines = deadlines.filter(d => d.urgency === 'overdue' || (parseInt(d.days_until) || 0) < 0);
    const urgentDeadlines = deadlines.filter(d => d.urgency === 'urgent' && (parseInt(d.days_until) || 0) >= 0);
    const soonDeadlines = deadlines.filter(d => d.urgency === 'soon');
    const upcomingDeadlines = deadlines.filter(d => d.urgency === 'upcoming');
    
    const openComplaints = parseInt(health.open_complaints) || 0;
    const investigatingComplaints = parseInt(health.investigating_complaints) || 0;
    const totalComplaints = openComplaints + investigatingComplaints;
    
    // Update alert badge
    const alertBadge = document.querySelector('.badge.bg-danger');
    if (alertBadge) {
        const totalAlerts = overdueDeadlines.length + urgentDeadlines.length + totalComplaints;
        alertBadge.textContent = totalAlerts;
    }
    
    // Update critical alerts section
    const alertsContainer = document.getElementById('criticalAlertsContainer');
    if (alertsContainer) {
        const alerts = [];
        
        // Critical: Overdue deadlines
        if (overdueDeadlines.length > 0) {
            const firstOverdue = overdueDeadlines[0];
            alerts.push({
                type: 'critical',
                count: overdueDeadlines.length,
                label: 'CRITICAL ISSUE',
                summary: `${firstOverdue.deadline_type}${firstOverdue.representative_name ? ' - ' + firstOverdue.representative_name : ''}`,
                due: 'OVERDUE',
                icon: '🔴',
                color: 'danger'
            });
        }
        
        // High: Urgent deadlines or complaints
        const highPriorityCount = urgentDeadlines.length + totalComplaints;
        if (highPriorityCount > 0) {
            alerts.push({
                type: 'high',
                count: highPriorityCount,
                label: 'HIGH PRIORITY',
                summary: urgentDeadlines.length > 0 
                    ? `${urgentDeadlines.length} urgent deadlines`
                    : `${totalComplaints} active complaints`,
                due: urgentDeadlines.length > 0 
                    ? `${Math.min(...urgentDeadlines.map(d => parseInt(d.days_until) || 0))} days remaining`
                    : 'Action required',
                icon: '🟠',
                color: 'warning'
            });
        }
        
        // Medium: Soon deadlines or CPD issues
        const cpdAtRisk = dashboardData.cpdProgress ? dashboardData.cpdProgress.filter(r => r.compliance_status === 'critical').length : 0;
        const mediumCount = soonDeadlines.length + (cpdAtRisk > 0 ? 1 : 0);
        if (mediumCount > 0) {
            alerts.push({
                type: 'medium',
                count: mediumCount,
                label: 'MEDIUM PRIORITY',
                summary: cpdAtRisk > 0 
                    ? `${cpdAtRisk} reps behind CPD schedule`
                    : `${soonDeadlines.length} deadlines approaching`,
                due: soonDeadlines.length > 0 
                    ? `${Math.min(...soonDeadlines.map(d => parseInt(d.days_until) || 0))} days remaining`
                    : '30 days remaining',
                icon: '🟡',
                color: 'warning'
            });
        }
        
        // Upcoming: Upcoming deadlines
        if (upcomingDeadlines.length > 0) {
            alerts.push({
                type: 'upcoming',
                count: upcomingDeadlines.length,
                label: 'UPCOMING DEADLINES',
                summary: upcomingDeadlines[0].deadline_type,
                due: `${upcomingDeadlines[0].days_until} days`,
                icon: '📅',
                color: 'info'
            });
        }
        
        // Render alerts (always show 4 cards, fill with placeholders if needed)
        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="col-md-3">
                    <div class="alert-card">
                        <div class="alert-icon-large">✓</div>
                        <div class="alert-count">0</div>
                        <div class="alert-label">ALL CLEAR</div>
                        <div class="alert-summary">No critical issues</div>
                        <div class="alert-due text-success">Compliant</div>
                    </div>
                </div>
            `;
        } else {
            alertsContainer.innerHTML = alerts.slice(0, 4).map(alert => `
                <div class="col-md-3">
                    <div class="alert-card ${alert.type}">
                        <div class="alert-icon-large">${alert.icon}</div>
                        <div class="alert-count">${alert.count}</div>
                        <div class="alert-label">${alert.label}</div>
                        <div class="alert-summary">${alert.summary}</div>
                        <div class="alert-due ${alert.due.includes('OVERDUE') ? 'text-danger' : ''}">${alert.due}</div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-${alert.color}" onclick="viewAlertDetails('${alert.type}')">View Details</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        // Update "View All Alerts" button
        const viewAllBtn = document.getElementById('viewAllAlertsBtn');
        if (viewAllBtn) {
            const totalAlerts = overdueDeadlines.length + urgentDeadlines.length + soonDeadlines.length + upcomingDeadlines.length + totalComplaints;
            viewAllBtn.textContent = `View All Alerts (${totalAlerts})`;
        }
    }
}

async function refreshDashboard() {
    // Show loading indicator
    const refreshBtn = event?.target?.closest('button') || document.querySelector('button[onclick*="refreshDashboard"]');
    if (refreshBtn) {
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        try {
            await loadDashboardData();
            
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
            
            // Show success notification
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Dashboard Refreshed',
                    text: 'All data has been updated',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Refresh Failed',
                    text: 'Failed to refresh dashboard data. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    } else {
        await loadDashboardData();
    }
}

function showTrendChart() {
    // Open trend chart modal
    console.log('Show trend chart');
}

// View Full Team Matrix - Navigate to Team Compliance Matrix module
function viewFullTeamMatrix() {
    // If we're in an iframe, communicate with parent window
    if (window.parent && window.parent !== window) {
        // Try to call parent's handleRoute function
        if (typeof window.parent.handleRoute === 'function') {
            window.parent.handleRoute('team-compliance');
        } else if (typeof window.parent.location !== 'undefined') {
            // Fallback: update parent URL hash
            window.parent.location.hash = '#team-compliance';
        } else {
            // Last resort: open in new window
            window.open('../../index.html#team-compliance', '_blank');
        }
    } else {
        // If not in iframe, update current window
        if (typeof handleRoute === 'function') {
            handleRoute('team-compliance');
        } else {
            window.location.hash = '#team-compliance';
        }
    }
}

// Export Team Matrix to Excel
function exportTeamMatrix() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Export to Excel',
            text: 'This feature will be implemented soon.',
            confirmButtonText: 'OK'
        });
    }
}

// Generate Team Report
function generateTeamReport() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Generate Team Report',
            text: 'This feature will be implemented soon.',
            confirmButtonText: 'OK'
        });
    }
}

// Update Recent Activity Timeline
function updateRecentActivity() {
    const timeline = document.getElementById('activityTimeline');
    if (!timeline) return;
    
    // For now, create activity from available data
    const activities = [];
    
    // Add CPD activities
    if (dashboardData.cpdProgress && dashboardData.cpdProgress.length > 0) {
        const recentCPD = dashboardData.cpdProgress
            .filter(r => parseFloat(r.total_hours_logged || 0) > 0)
            .sort((a, b) => {
                // Sort by most recent activity (simplified)
                return parseFloat(b.total_hours_logged || 0) - parseFloat(a.total_hours_logged || 0);
            })
            .slice(0, 3);
        
        recentCPD.forEach(rep => {
            activities.push({
                type: 'cpd',
                icon: 'bg-success',
                iconClass: 'fa-check',
                user: rep.representative_name,
                description: `CPD activity logged: ${parseFloat(rep.total_hours_logged || 0).toFixed(1)} hours`,
                details: `Progress: ${Math.round(parseFloat(rep.progress_percentage || 0))}%`,
                timeAgo: 'Recently',
                badge: 'CPD',
                badgeColor: 'bg-info'
            });
        });
    }
    
    // Add deadline alerts
    if (dashboardData.deadlines && dashboardData.deadlines.length > 0) {
        const urgentDeadlines = dashboardData.deadlines
            .filter(d => d.urgency === 'urgent' || d.urgency === 'overdue')
            .slice(0, 2);
        
        urgentDeadlines.forEach(deadline => {
            activities.push({
                type: 'deadline',
                icon: deadline.urgency === 'overdue' ? 'bg-danger' : 'bg-warning',
                iconClass: deadline.urgency === 'overdue' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle',
                user: 'System',
                description: `${deadline.deadline_type}${deadline.representative_name ? ' - ' + deadline.representative_name : ''}`,
                details: deadline.urgency === 'overdue' ? 'OVERDUE' : `${deadline.days_until} days remaining`,
                timeAgo: `${Math.abs(parseInt(deadline.days_until) || 0)} days`,
                badge: deadline.deadline_type.split(' ')[0],
                badgeColor: deadline.urgency === 'overdue' ? 'bg-danger' : 'bg-warning'
            });
        });
    }
    
    // Add complaint alerts
    if (dashboardData.health && dashboardData.health.length > 0) {
        const health = dashboardData.health[0];
        if (parseInt(health.open_complaints) > 0 || parseInt(health.investigating_complaints) > 0) {
            activities.push({
                type: 'complaint',
                icon: 'bg-warning',
                iconClass: 'fa-exclamation-triangle',
                user: 'System',
                description: `${parseInt(health.open_complaints) + parseInt(health.investigating_complaints)} active complaints`,
                details: 'Action required',
                timeAgo: 'Today',
                badge: 'Complaints',
                badgeColor: 'bg-warning'
            });
        }
    }
    
    // Sort by time (most recent first) and limit to 5
    const sortedActivities = activities.slice(0, 5);
    
    if (sortedActivities.length === 0) {
        timeline.innerHTML = '<div class="text-center text-muted py-3">No recent activity</div>';
    } else {
        timeline.innerHTML = sortedActivities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-icon ${activity.icon}">
                    <i class="fas ${activity.iconClass}"></i>
                </div>
                <div class="timeline-content">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${activity.user}</strong> ${activity.description}
                            <br><small class="text-muted">${activity.details}</small>
                        </div>
                        <small class="text-muted">${activity.timeAgo}</small>
                    </div>
                    <span class="badge ${activity.badgeColor} mt-1">${activity.badge}</span>
                </div>
            </div>
        `).join('');
    }
}

// Update FSP License Information
function updateFSPLicense() {
    try {
        // Get FSP configuration from dashboardData (loaded in parallel with other data)
        // Handle both { data: [...] } and [...] response structures
        let fspConfig = dashboardData.fspConfig;
        
        // If fspConfig has a data property, use that
        if (fspConfig && fspConfig.data) {
            fspConfig = fspConfig.data;
        }
        
        console.log('FSP Config data:', fspConfig);
        
        if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0) {
            const fsp = fspConfig[0];
            
            console.log('FSP object:', fsp);
            
            // Update FSP name
            const fspNameEl = document.getElementById('fsp-name');
            if (fspNameEl) {
                if (fsp.fsp_name) {
                    fspNameEl.textContent = fsp.fsp_name;
                    console.log('FSP name updated to:', fsp.fsp_name);
                } else {
                    fspNameEl.textContent = 'FSP Name Not Set';
                    console.warn('FSP name not found in configuration');
                }
            }
            
            // Update license number
            const fspNumberEl = document.getElementById('fsp-number');
            if (fspNumberEl) {
                if (fsp.fsp_license_number) {
                    fspNumberEl.textContent = fsp.fsp_license_number;
                    console.log('FSP license number updated to:', fsp.fsp_license_number);
                } else {
                    fspNumberEl.textContent = 'License Not Set';
                    console.warn('FSP license number not found in configuration');
                }
            }
        } else {
            // FSP configuration not loaded or empty
            const fspNameEl = document.getElementById('fsp-name');
            if (fspNameEl) {
                fspNameEl.textContent = 'Not Available';
            }
            const fspNumberEl = document.getElementById('fsp-number');
            if (fspNumberEl) {
                fspNumberEl.textContent = 'Not Available';
            }
            console.warn('FSP configuration not available or empty. Raw data:', dashboardData.fspConfig);
        }
    } catch (error) {
        console.error('Error updating FSP license information:', error);
        const fspNameEl = document.getElementById('fsp-name');
        if (fspNameEl) {
            fspNameEl.textContent = 'Error Loading';
        }
        const fspNumberEl = document.getElementById('fsp-number');
        if (fspNumberEl) {
            fspNumberEl.textContent = 'Error Loading';
        }
    }
}

// Helper function to navigate to modules
function navigateToModule(moduleName) {
    if (window.parent && window.parent !== window) {
        if (typeof window.parent.handleRoute === 'function') {
            window.parent.handleRoute(moduleName);
        } else if (typeof window.parent.location !== 'undefined') {
            window.parent.location.hash = `#${moduleName}`;
        }
    } else {
        if (typeof handleRoute === 'function') {
            handleRoute(moduleName);
        } else {
            window.location.hash = `#${moduleName}`;
        }
    }
}

// Helper functions for alert actions
function viewAlertDetails(type) {
    if (type === 'critical' || type === 'high') {
        viewAllAlerts();
    } else {
        navigateToModule('alerts-notifications');
    }
}

function viewAllAlerts() {
    navigateToModule('alerts-notifications');
}

function createCustomAlert() {
    navigateToModule('alerts-notifications');
}

function generateAlertReport() {
    navigateToModule('reports-analytics');
}

function viewAllDeadlines() {
    navigateToModule('team-compliance');
}

function resolveDeadline(deadlineId) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Resolve Deadline',
            text: 'This feature will be implemented soon.',
            confirmButtonText: 'OK'
        });
    }
}

function sendReminders() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Send Reminders',
            text: 'This feature will be implemented soon.',
            confirmButtonText: 'OK'
        });
    }
}

// Update License Details
function updateLicenseDetails() {
    try {
        // Get FSP configuration data
        let fspConfig = dashboardData.fspConfig;
        if (fspConfig && fspConfig.data) {
            fspConfig = fspConfig.data;
        }
        
        const matrix = dashboardData.teamMatrix || [];
        const health = dashboardData.health && dashboardData.health.length > 0 ? dashboardData.health[0] : null;
        
        // Update license issue date (use created_at from FSP configuration as registration date)
        const issueDateEl = document.getElementById('license-issue-date');
        if (issueDateEl) {
            if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0 && fspConfig[0].created_at) {
                const issueDate = new Date(fspConfig[0].created_at);
                issueDateEl.textContent = issueDate.toLocaleDateString('en-ZA');
            } else {
                issueDateEl.textContent = 'Not Available';
            }
        }
        
        // Calculate years licensed
        const yearsEl = document.getElementById('license-years');
        if (yearsEl) {
            if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0 && fspConfig[0].created_at) {
                const issueDate = new Date(fspConfig[0].created_at);
                const today = new Date();
                const diffTime = Math.abs(today - issueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);
                yearsEl.textContent = `${years} years, ${months} months`;
            } else {
                yearsEl.textContent = 'Not Available';
            }
        }
        
        // License Type (use registration number format or show as Category I - standard)
        const licenseTypeEl = document.getElementById('license-type');
        if (licenseTypeEl) {
            if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0 && fspConfig[0].registration_number) {
                // Could parse registration number or show standard type
                licenseTypeEl.textContent = 'Category I - Long-term Insurance, Investments';
            } else {
                licenseTypeEl.textContent = 'Not Available';
            }
        }
        
        // Representatives count
        const repsEl = document.getElementById('license-reps');
        if (repsEl) {
            if (matrix && matrix.length > 0) {
                const activeReps = matrix.filter(r => r.rep_status === 'active').length;
                const suspendedReps = matrix.filter(r => r.rep_status === 'suspended').length;
                repsEl.textContent = `${activeReps} active, ${suspendedReps} suspended`;
            } else if (health && health.active_representatives) {
                repsEl.textContent = `${health.active_representatives} active, 0 suspended`;
            } else {
                repsEl.textContent = 'Loading...';
            }
        }
        
        // Key Individuals count
        const kisEl = document.getElementById('license-kis');
        if (kisEl) {
            if (dashboardData.kiCount !== null && dashboardData.kiCount !== undefined) {
                let count = dashboardData.kiCount;
                // Handle different response structures
                if (typeof count === 'object') {
                    if (count.data !== undefined) {
                        count = count.data;
                    } else if (count.get_key_individuals_count !== undefined) {
                        count = count.get_key_individuals_count;
                    } else if (Array.isArray(count) && count.length > 0) {
                        count = count[0].get_key_individuals_count || count[0];
                    }
                }
                if (typeof count === 'number') {
                    kisEl.textContent = `${count} appointed`;
                } else {
                    kisEl.textContent = 'Not Available';
                }
            } else {
                kisEl.textContent = 'Loading...';
            }
        }
        
        // Compliance Officer - would need to query user_profiles or key_individuals
        const complianceOfficerEl = document.getElementById('license-compliance-officer');
        if (complianceOfficerEl) {
            complianceOfficerEl.textContent = 'Not Available';
        }
        
        // License valid until - calculate from issue date + typical 5-year license period
        const validUntilEl = document.getElementById('license-valid-until');
        if (validUntilEl) {
            if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0 && fspConfig[0].created_at) {
                const issueDate = new Date(fspConfig[0].created_at);
                // Assume 5-year license period (typical for FSP licenses)
                const validUntil = new Date(issueDate);
                validUntil.setFullYear(validUntil.getFullYear() + 5);
                const today = new Date();
                const diffTime = validUntil - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 0) {
                    validUntilEl.textContent = `Valid Until: ${validUntil.toLocaleDateString('en-ZA')} (${diffDays} days remaining)`;
                } else {
                    validUntilEl.textContent = `Expired: ${validUntil.toLocaleDateString('en-ZA')} (${Math.abs(diffDays)} days ago)`;
                }
            } else {
                validUntilEl.textContent = 'License information not available';
            }
        }
        
        console.log('License details updated');
    } catch (error) {
        console.error('Error updating license details:', error);
    }
}

// Update User Info
function updateUserInfo() {
    // Try to get current user from localStorage or session
    try {
        const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            const userNameEl = document.getElementById('current-user-name');
            if (userNameEl) {
                userNameEl.textContent = user.name || user.first_name + ' ' + user.last_name || 'User';
            }
            const userRoleEl = document.getElementById('current-user-role');
            if (userRoleEl) {
                userRoleEl.textContent = user.role || user.role_name || 'User';
            }
        } else {
            // Fallback to placeholder
            const userNameEl = document.getElementById('current-user-name');
            if (userNameEl) {
                userNameEl.textContent = 'User';
            }
            const userRoleEl = document.getElementById('current-user-role');
            if (userRoleEl) {
                userRoleEl.textContent = 'User';
            }
        }
    } catch (error) {
        console.warn('Could not load user info:', error);
        const userNameEl = document.getElementById('current-user-name');
        if (userNameEl) {
            userNameEl.textContent = 'User';
        }
        const userRoleEl = document.getElementById('current-user-role');
        if (userRoleEl) {
            userRoleEl.textContent = 'User';
        }
    }
}

// Update Achievements
function updateAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    const achievementsCount = document.getElementById('achievements-count');
    
    if (!achievementsList) return;
    
    // Get achievements from various data sources
    const achievements = [];
    
    // CPD completions
    if (dashboardData.cpdProgress && dashboardData.cpdProgress.length > 0) {
        const completed = dashboardData.cpdProgress.filter(r => r.compliance_status === 'compliant');
        completed.slice(0, 3).forEach(rep => {
            achievements.push({
                rep: rep.representative_name,
                achievement: 'CPD completed',
                hours: parseFloat(rep.total_hours_logged || 0).toFixed(1)
            });
        });
    }
    
    // Fit & Proper renewals (placeholder - would need additional data)
    // FICA audits (placeholder - would need additional data)
    
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<small class="text-muted">No recent achievements</small>';
        if (achievementsCount) {
            achievementsCount.textContent = '0';
        }
    } else {
        achievementsList.innerHTML = achievements.map(ach => 
            `<small>${ach.rep}: ${ach.achievement}${ach.hours ? ' (' + ach.hours + ' hrs)' : ''}</small><br>`
        ).join('');
        if (achievementsCount) {
            achievementsCount.textContent = achievements.length;
        }
    }
}

function runQuickCheck() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Quick Check',
            text: 'This feature will be implemented soon.',
            confirmButtonText: 'OK'
        });
    }
}

// Make functions globally available
window.refreshDashboard = refreshDashboard;
window.showTrendChart = showTrendChart;
window.loadDashboardData = loadDashboardData;
window.viewFullTeamMatrix = viewFullTeamMatrix;
window.exportTeamMatrix = exportTeamMatrix;
window.generateTeamReport = generateTeamReport;
window.navigateToModule = navigateToModule;
window.viewAlertDetails = viewAlertDetails;
window.viewAllAlerts = viewAllAlerts;
window.createCustomAlert = createCustomAlert;
window.generateAlertReport = generateAlertReport;
window.viewAllDeadlines = viewAllDeadlines;
window.resolveDeadline = resolveDeadline;
window.sendReminders = sendReminders;

