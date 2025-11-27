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
 * Update Alerts Badge
 */
async function updateAlertsBadge(dataFunctions) {
    try {
        // If there's a getAlerts function, use it
        if (typeof dataFunctions.getAlerts === 'function') {
            const alerts = await dataFunctions.getAlerts();
            let alertsList = alerts;
            if (alerts && alerts.data) {
                alertsList = alerts.data;
            } else if (alerts && Array.isArray(alerts)) {
                alertsList = alerts;
            }
            
            // Count unread or active alerts
            const activeAlerts = (alertsList || []).filter(a => {
                return !a.read || !a.acknowledged || a.status === 'active';
            }).length;
            
            updateBadge('alerts', activeAlerts);
        } else {
            // Fallback: use a default or calculated value
            // Could calculate from various sources (overdue CPD, expiring licenses, etc.)
            updateBadge('alerts', 0);
        }
    } catch (error) {
        console.error('Error updating alerts badge:', error);
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavbarBadges);
} else {
    initializeNavbarBadges();
}

// Export for global access
window.initializeNavbarBadges = initializeNavbarBadges;
window.updateNavbarBadges = updateAllNavbarBadges;
window.updateBadge = updateBadge;

