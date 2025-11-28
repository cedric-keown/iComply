// Navbar Badges Update Module
// Updates all navbar menu badges with real data from the database

let navbarBadges = {
    initialized: false
};

/**
 * Initialize Navbar Badges
 */
async function initializeNavbarBadges() {
    if (navbarBadges.initialized) return;
    
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            console.warn('dataFunctions not available for navbar badges');
            return;
        }
        
        // Update all badges
        await updateAllNavbarBadges(dataFunctionsToUse);
        
        navbarBadges.initialized = true;
    } catch (error) {
        console.error('Error initializing navbar badges:', error);
    }
}

/**
 * Update All Navbar Badges
 */
async function updateAllNavbarBadges(dataFunctions) {
    try {
        // Update Representatives badge
        await updateRepresentativesBadge(dataFunctions);
        
        // Update CPD badge
        await updateCPDBadge(dataFunctions);
        
        // Update Clients & FICA badge
        await updateClientsBadge(dataFunctions);
        
        // Update Complaints badge
        await updateComplaintsBadge(dataFunctions);
        
        // Update Alerts badge
        await updateAlertsBadge(dataFunctions);
        
        // Update other badges as needed
        // Note: Documents, Fit & Proper, Compliance, Audits may need specific functions
        
    } catch (error) {
        console.error('Error updating navbar badges:', error);
    }
}

/**
 * Update Representatives Badge
 */
async function updateRepresentativesBadge(dataFunctions) {
    try {
        const reps = await dataFunctions.getRepresentatives();
        let repsList = reps;
        if (reps && reps.data) {
            repsList = reps.data;
        } else if (reps && Array.isArray(reps)) {
            repsList = reps;
        }
        
        const activeReps = (repsList || []).filter(r => {
            const status = (r.status || '').toLowerCase();
            return status === 'active' || status === 'authorized';
        }).length;
        
        updateBadge('representatives', activeReps);
    } catch (error) {
        console.error('Error updating representatives badge:', error);
    }
}

/**
 * Update CPD Badge
 */
async function updateCPDBadge(dataFunctions) {
    try {
        // Get CPD activities that need attention (e.g., overdue, pending)
        const cycles = await dataFunctions.getCpdCycles();
        let cyclesList = cycles;
        if (cycles && cycles.data) {
            cyclesList = cycles.data;
        } else if (cycles && Array.isArray(cycles)) {
            cyclesList = cycles;
        }
        
        // Count cycles that need attention
        const currentYear = new Date().getFullYear();
        const activeCycles = (cyclesList || []).filter(c => {
            const cycleYear = new Date(c.cycle_start_date || c.start_date).getFullYear();
            return cycleYear === currentYear;
        }).length;
        
        updateBadge('cpd', activeCycles);
    } catch (error) {
        console.error('Error updating CPD badge:', error);
    }
}

/**
 * Update Clients & FICA Badge
 */
async function updateClientsBadge(dataFunctions) {
    try {
        const clients = await dataFunctions.getClients();
        let clientsList = clients;
        if (clients && clients.data) {
            clientsList = clients.data;
        } else if (clients && Array.isArray(clients)) {
            clientsList = clients;
        }
        
        // Count active clients
        const activeClients = (clientsList || []).filter(c => {
            const status = (c.status || '').toLowerCase();
            return status === 'active' || !status || status === '';
        }).length;
        
        updateBadge('clients', activeClients);
    } catch (error) {
        console.error('Error updating clients badge:', error);
    }
}

/**
 * Update Complaints Badge
 */
async function updateComplaintsBadge(dataFunctions) {
    try {
        const complaints = await dataFunctions.getComplaints();
        let complaintsList = complaints;
        if (complaints && complaints.data) {
            complaintsList = complaints.data;
        } else if (complaints && Array.isArray(complaints)) {
            complaintsList = complaints;
        }
        
        // Count active complaints (not resolved/closed)
        const activeComplaints = (complaintsList || []).filter(c => {
            const status = (c.status || '').toLowerCase();
            return !['resolved', 'closed'].includes(status);
        }).length;
        
        updateBadge('complaints', activeComplaints);
    } catch (error) {
        console.error('Error updating complaints badge:', error);
    }
}

/**
 * Transform database alert to UI format (matching alerts-notifications.js exactly)
 */
function transformAlertForHeader(dbAlert) {
    const today = new Date();
    const validFrom = dbAlert.valid_from ? new Date(dbAlert.valid_from) : today;
    const dueDate = dbAlert.due_date ? new Date(dbAlert.due_date) : null;
    
    // Calculate days remaining/overdue
    let daysRemaining = null;
    let daysOverdue = null;
    let overdue = false;
    
    if (dueDate) {
        const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
            overdue = true;
            daysOverdue = Math.abs(diff);
        } else {
            daysRemaining = diff;
        }
    }
    
    // Generate ID exactly as dashboard does
    const alertId = dbAlert.id || dbAlert.alert_id || `ALT-${dbAlert.id?.substring(0, 8)}`;
    
    return {
        id: alertId || `ALT-${Date.now()}`,
        title: dbAlert.alert_title || dbAlert.title || 'Untitled Alert',
        description: dbAlert.alert_message || dbAlert.description || '',
        priority: (dbAlert.priority || 'medium').toLowerCase(),
        category: dbAlert.entity_type || dbAlert.category || 'system',
        created: validFrom.toLocaleDateString('en-ZA') + ' ' + validFrom.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
        createdBy: 'System (automated)',
        dueDate: dueDate ? dueDate.toLocaleDateString('en-ZA') : null,
        overdue: overdue,
        daysOverdue: daysOverdue,
        daysRemaining: daysRemaining,
        status: (dbAlert.status || 'active').toLowerCase(),
        acknowledgedDate: dbAlert.acknowledged_at ? new Date(dbAlert.acknowledged_at).toLocaleDateString('en-ZA') : null,
        created_at: dbAlert.created_at || dbAlert.valid_from,
        impact: dbAlert.priority === 'critical' ? 'high' : (dbAlert.priority === 'high' ? 'medium' : 'low'),
        // Keep original database fields
        _db: dbAlert
    };
}

/**
 * Update Alerts Badge and Header Dropdown
 */
async function updateAlertsBadge(dataFunctions) {
    try {
        // If there's a getAlerts function, use it
        if (typeof dataFunctions.getAlerts === 'function') {
            const alerts = await dataFunctions.getAlerts('active', null, null, null);
            let alertsList = alerts;
            if (alerts && alerts.data) {
                alertsList = alerts.data;
            } else if (alerts && Array.isArray(alerts)) {
                alertsList = alerts;
            }
            
            // Transform alerts to match dashboard format
            const transformedAlerts = (alertsList || []).map(transformAlertForHeader);
            
            // Filter active alerts (matching dashboard logic)
            const activeAlerts = transformedAlerts.filter(a => {
                const status = (a.status || '').toLowerCase();
                return status === 'active' || !status || status === '';
            });
            
            // Update badge count
            const badgeCount = activeAlerts.length;
            updateHeaderAlertsBadge(badgeCount);
            
            // Update header dropdown with real alerts
            updateHeaderAlertsDropdown(activeAlerts);
            
            // Also update sidebar badge if it exists
            updateBadge('alerts', badgeCount);
        } else {
            // Fallback: use a default or calculated value
            updateHeaderAlertsBadge(0);
            updateHeaderAlertsDropdown([]);
            updateBadge('alerts', 0);
        }
    } catch (error) {
        console.error('Error updating alerts badge:', error);
        updateHeaderAlertsBadge(0);
        updateHeaderAlertsDropdown([]);
    }
}

/**
 * Update the header alerts badge count
 */
function updateHeaderAlertsBadge(count) {
    try {
        const badge = document.querySelector('#alertsButton .badge');
        if (badge) {
            badge.textContent = count || 0;
            // Hide badge if count is 0
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'block';
            }
        }
    } catch (error) {
        console.warn('Could not update header alerts badge:', error);
    }
}

/**
 * Update the header alerts dropdown with real alert data
 */
function updateHeaderAlertsDropdown(alerts) {
    try {
        const dropdownMenu = document.querySelector('#alertsButton').closest('.dropdown')?.querySelector('.dropdown-menu');
        if (!dropdownMenu) return;
        
        // Sort alerts by priority (critical first, then high, medium, low) - matching dashboard sort
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const sortedAlerts = [...alerts].sort((a, b) => {
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;
            if (bPriority !== aPriority) {
                return bPriority - aPriority;
            }
            // If same priority, sort by date (newest first)
            const aDate = new Date(a.created_at || a._db?.created_at || a._db?.valid_from || 0);
            const bDate = new Date(b.created_at || b._db?.created_at || b._db?.valid_from || 0);
            return bDate - aDate;
        });
        
        // Get top 5 alerts for dropdown
        const topAlerts = sortedAlerts.slice(0, 5);
        
        // Build dropdown HTML
        let dropdownHTML = `
            <li class="dropdown-header d-flex justify-content-between align-items-center">
                <span>Alerts & Notifications</span>
                <button class="btn btn-sm btn-link p-0" onclick="event.stopPropagation(); markAllAlertsRead()">Mark All</button>
            </li>
            <li><hr class="dropdown-divider"></li>
        `;
        
        if (topAlerts.length === 0) {
            dropdownHTML += `
                <li>
                    <div class="px-3 py-2 text-center text-muted">
                        <i class="fas fa-check-circle mb-2"></i>
                        <p class="mb-0 small">No active alerts</p>
                    </div>
                </li>
            `;
        } else {
            topAlerts.forEach(alert => {
                // Use the same priority formatting as the dashboard
                const priority = alert.priority || 'medium';
                const priorityClass = priority === 'critical' ? 'critical' : 
                                    priority === 'high' ? 'high' : 'medium';
                const priorityIcon = priority === 'critical' ? '⚠️' : 
                                   priority === 'high' ? '⚠️' : 
                                   priority === 'medium' ? 'ℹ️' : 'ℹ️';
                const priorityLabel = priority.toUpperCase();
                
                // Format time ago using the same date field as dashboard
                const timeAgo = formatTimeAgo(alert.created_at || alert._db?.created_at || alert._db?.valid_from);
                
                // Get alert title and message (using transformed fields)
                const title = alert.title || 'Untitled Alert';
                const message = alert.description || '';
                
                // Use the same alert ID format as dashboard
                const alertId = alert.id;
                
                dropdownHTML += `
                    <li>
                        <div class="alert-item ${priorityClass} px-3 py-2">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <strong>${priorityIcon} ${priorityLabel}</strong>
                                    <p class="mb-1 small">${title}</p>
                                    ${message ? `<p class="mb-1 small text-muted">${message.substring(0, 60)}${message.length > 60 ? '...' : ''}</p>` : ''}
                                    <small class="text-muted">${timeAgo}</small>
                                </div>
                                <button class="btn btn-sm btn-outline-primary ms-2" onclick="event.stopPropagation(); viewAlert('${alertId}')">View</button>
                            </div>
                        </div>
                    </li>
                `;
            });
        }
        
        dropdownHTML += `
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-center" href="#" onclick="event.stopPropagation(); navigateToAlerts()">View All Alerts (${alerts.length})</a></li>
        `;
        
        dropdownMenu.innerHTML = dropdownHTML;
    } catch (error) {
        console.error('Error updating header alerts dropdown:', error);
    }
}

/**
 * Format time ago string
 */
function formatTimeAgo(dateString) {
    if (!dateString) return 'Recently';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        // Return formatted date for older alerts
        return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' });
    } catch (error) {
        return 'Recently';
    }
}

/**
 * Navigate to alerts page
 */
function navigateToAlerts() {
    try {
        // Close the dropdown
        const dropdown = document.querySelector('#alertsButton').closest('.dropdown');
        if (dropdown) {
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('[data-bs-toggle="dropdown"]'));
            if (bsDropdown) {
                bsDropdown.hide();
            }
        }
        
        // Navigate to alerts page
        if (typeof handleRoute === 'function') {
            handleRoute('alerts-notifications');
        } else if (typeof _appRouter !== 'undefined' && _appRouter.routeTo) {
            _appRouter.routeTo('alerts-notifications');
        } else {
            window.location.hash = '#alerts-notifications';
        }
    } catch (error) {
        console.error('Error navigating to alerts:', error);
    }
}

/**
 * View a specific alert (matching dashboard showAlertDetails function)
 */
function viewAlert(alertId) {
    try {
        // Close the dropdown
        const dropdown = document.querySelector('#alertsButton').closest('.dropdown');
        if (dropdown) {
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('[data-bs-toggle="dropdown"]'));
            if (bsDropdown) {
                bsDropdown.hide();
            }
        }
        
        // Navigate to alerts page first
        if (window.handleRoute) {
            window.handleRoute('alerts-notifications');
        }
        
        // Wait for module to load, then show the alert
        let attempts = 0;
        const maxAttempts = 30; // Increase attempts for more reliability
        
        const checkAndShowAlert = () => {
            const iframe = document.getElementById('dashboardContent')?.querySelector('iframe');
            
            if (!iframe || !iframe.contentWindow) {
                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkAndShowAlert, 200);
                } else {
                    console.warn('Could not find alerts iframe after multiple attempts');
                }
                return;
            }
            
            // Check if iframe is loaded and contains the alerts module
            try {
                const iframeUrl = iframe.contentWindow.location.href;
                if (!iframeUrl.includes('alerts_notifications.html')) {
                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(checkAndShowAlert, 200);
                    }
                    return;
                }
                
                // Switch to Active Alerts tab first
                iframe.contentWindow.postMessage({ 
                    action: 'switchTab', 
                    tab: 'active-tab' 
                }, '*');
                
                // Wait for tab to switch and alerts to load, then show the alert
                setTimeout(() => {
                    iframe.contentWindow.postMessage({ 
                        action: 'showAlertDetails', 
                        alertId: alertId 
                    }, '*');
                }, 1000);
                
            } catch (e) {
                // Cross-origin or other error - try sending message anyway
                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(() => {
                        // Try sending messages even if we can't check the URL
                        iframe.contentWindow.postMessage({ 
                            action: 'switchTab', 
                            tab: 'active-tab' 
                        }, '*');
                        
                        setTimeout(() => {
                            iframe.contentWindow.postMessage({ 
                                action: 'showAlertDetails', 
                                alertId: alertId 
                            }, '*');
                        }, 1000);
                    }, 500);
                } else {
                    console.warn('Could not show alert in iframe after multiple attempts:', e);
                }
            }
        };
        
        // Start checking after a short delay to allow navigation
        setTimeout(checkAndShowAlert, 300);
    } catch (error) {
        console.error('Error viewing alert:', error);
    }
}

/**
 * Mark all alerts as read
 */
function markAllAlertsRead() {
    // This would call an API to mark all alerts as read
    // For now, just refresh the alerts
    const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
        ? dataFunctions 
        : (window.dataFunctions || window.parent?.dataFunctions);
    
    if (dataFunctionsToUse) {
        updateAlertsBadge(dataFunctionsToUse);
    }
}

/**
 * Update a specific badge in the navbar
 */
function updateBadge(route, count) {
    try {
        // Find badge in current window
        const badge = document.querySelector(`[data-route="${route}"] .menu-badge`);
        if (badge) {
            badge.textContent = count || 0;
        }
        
        // Also try parent window if in iframe
        if (window.parent && window.parent !== window) {
            try {
                const parentBadge = window.parent.document.querySelector(`[data-route="${route}"] .menu-badge`);
                if (parentBadge) {
                    parentBadge.textContent = count || 0;
                }
            } catch (e) {
                // Cross-origin or access denied, that's okay
            }
        }
    } catch (error) {
        console.warn(`Could not update badge for ${route}:`, error);
    }
}

// Auto-refresh alerts every 60 seconds
let alertsRefreshInterval = null;

/**
 * Start auto-refreshing alerts
 */
function startAlertsAutoRefresh() {
    // Clear existing interval if any
    if (alertsRefreshInterval) {
        clearInterval(alertsRefreshInterval);
    }
    
    // Refresh every 60 seconds
    alertsRefreshInterval = setInterval(async () => {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (dataFunctionsToUse) {
            await updateAlertsBadge(dataFunctionsToUse);
        }
    }, 60000); // 60 seconds
}

/**
 * Stop auto-refreshing alerts
 */
function stopAlertsAutoRefresh() {
    if (alertsRefreshInterval) {
        clearInterval(alertsRefreshInterval);
        alertsRefreshInterval = null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeNavbarBadges().then(() => {
            startAlertsAutoRefresh();
        });
    });
} else {
    initializeNavbarBadges().then(() => {
        startAlertsAutoRefresh();
    });
}

// Export for global access
window.initializeNavbarBadges = initializeNavbarBadges;
window.updateNavbarBadges = updateAllNavbarBadges;
window.updateBadge = updateBadge;
window.updateAlertsBadge = updateAlertsBadge;
window.navigateToAlerts = navigateToAlerts;
window.viewAlert = viewAlert;
window.markAllAlertsRead = markAllAlertsRead;
window.startAlertsAutoRefresh = startAlertsAutoRefresh;
window.stopAlertsAutoRefresh = stopAlertsAutoRefresh;

