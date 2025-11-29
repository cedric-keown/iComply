/**
 * Recent Activities Tracker
 * Tracks user navigation and displays last 10 activities in navbar dropdown
 */

var RecentActivities = (function() {
    'use strict';
    
    const STORAGE_KEY = 'recent_activities';
    const MAX_ACTIVITIES = 10;
    
    // Module/Route to Display Name mapping
    const moduleNames = {
        'dashboard': 'Dashboard',
        'executive': 'Executive Dashboard',
        'executive-dashboard': 'Executive Dashboard',
        'representatives': 'Representatives Management',
        'representatives-management': 'Representatives Management',
        'clients': 'Clients & FICA',
        'clients-fica': 'Clients & FICA',
        'clients-and-fica': 'Clients & FICA',
        'fica': 'FICA Management',
        'cpd': 'CPD Management',
        'cpd-management': 'CPD Management',
        'documents': 'Document Management',
        'document-management': 'Document Management',
        'fit-proper': 'Fit & Proper',
        'fit-and-proper': 'Fit & Proper',
        'complaints': 'Complaints Management',
        'complaints-management': 'Complaints Management',
        'compliance': 'Compliance Management',
        'compliance-management': 'Compliance Management',
        'alerts': 'Alerts & Notifications',
        'alerts-notifications': 'Alerts & Notifications',
        'notifications': 'Alerts & Notifications',
        'audits': 'Internal Audits',
        'internal-audits': 'Internal Audits',
        'reports': 'Reports & Analytics',
        'reports-analytics': 'Reports & Analytics',
        'analytics': 'Reports & Analytics',
        'team-compliance': 'Team Compliance Matrix',
        'team-compliance-matrix': 'Team Compliance Matrix',
        'team-matrix': 'Team Compliance Matrix',
        'settings': 'Settings & Administration',
        'settings-administration': 'Settings & Administration',
        'administration': 'Settings & Administration'
    };
    
    // Module icons
    const moduleIcons = {
        'dashboard': 'fa-tachometer-alt',
        'executive': 'fa-chart-line',
        'representatives': 'fa-users',
        'clients': 'fa-user-tie',
        'cpd': 'fa-graduation-cap',
        'documents': 'fa-file-alt',
        'fit-proper': 'fa-check-circle',
        'complaints': 'fa-exclamation-triangle',
        'compliance': 'fa-shield-alt',
        'alerts': 'fa-bell',
        'audits': 'fa-clipboard-check',
        'reports': 'fa-chart-bar',
        'team-compliance': 'fa-users-cog',
        'settings': 'fa-cog'
    };
    
    /**
     * Get activities from storage
     */
    function getActivities() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error reading activities from storage:', e);
            return [];
        }
    }
    
    /**
     * Save activities to storage
     */
    function saveActivities(activities) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error('Error saving activities to storage:', e);
        }
    }
    
    /**
     * Add a new activity
     */
    function addActivity(route, moduleName = null, icon = null) {
        const activities = getActivities();
        const now = new Date();
        
        // Get display name
        const displayName = moduleName || moduleNames[route] || route;
        const displayIcon = icon || moduleIcons[route] || 'fa-circle';
        
        // Create activity object
        const activity = {
            id: Date.now() + Math.random(), // Unique ID
            route: route,
            name: displayName,
            icon: displayIcon,
            timestamp: now.toISOString(),
            timeAgo: formatTimeAgo(now)
        };
        
        // Remove duplicate if exists (same route)
        const existingIndex = activities.findIndex(a => a.route === route);
        if (existingIndex > -1) {
            activities.splice(existingIndex, 1);
        }
        
        // Add to beginning
        activities.unshift(activity);
        
        // Keep only last MAX_ACTIVITIES
        if (activities.length > MAX_ACTIVITIES) {
            activities.splice(MAX_ACTIVITIES);
        }
        
        // Update timestamps for all activities
        activities.forEach(a => {
            a.timeAgo = formatTimeAgo(new Date(a.timestamp));
        });
        
        saveActivities(activities);
        updateDropdown();
        
        return activity;
    }
    
    /**
     * Format time ago
     */
    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
        }
    }
    
    /**
     * Update dropdown display
     */
    function updateDropdown() {
        const activities = getActivities();
        const container = document.getElementById('recentActivitiesList');
        
        if (!container) return;
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="dropdown-item text-muted text-center py-3">
                    <i class="fas fa-history me-2"></i>No recent activities
                </div>
            `;
            return;
        }
        
        let html = '';
        activities.forEach(activity => {
            html += `
                <a class="dropdown-item recent-activity-item" href="#" data-route="${escapeHtml(activity.route)}">
                    <div class="d-flex align-items-center">
                        <div class="activity-icon me-3">
                            <i class="fas ${activity.icon}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="fw-semibold">${escapeHtml(activity.name)}</div>
                            <small class="text-muted">${activity.timeAgo}</small>
                        </div>
                    </div>
                </a>
            `;
        });
        
        container.innerHTML = html;
        
        // Attach click handlers
        container.querySelectorAll('.recent-activity-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const route = this.getAttribute('data-route');
                if (route) {
                    navigateToRoute(route);
                }
            });
        });
    }
    
    /**
     * Navigate to route
     */
    function navigateToRoute(route) {
        if (typeof handleRoute === 'function') {
            handleRoute(route);
        } else if (typeof _appRouter !== 'undefined' && _appRouter.routeTo) {
            _appRouter.routeTo(route);
        } else {
            // Fallback: use hash
            window.location.hash = '#' + route;
        }
        
        // Close dropdown
        const dropdown = document.querySelector('#recentActivitiesButton');
        if (dropdown) {
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
            if (bsDropdown) {
                bsDropdown.hide();
            }
        }
    }
    
    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Clear all activities
     */
    function clearActivities() {
        saveActivities([]);
        updateDropdown();
    }
    
    /**
     * Initialize
     */
    function init() {
        // Update dropdown on page load
        updateDropdown();
        
        // Update timestamps periodically
        setInterval(() => {
            const activities = getActivities();
            if (activities.length > 0) {
                let updated = false;
                activities.forEach(a => {
                    const newTimeAgo = formatTimeAgo(new Date(a.timestamp));
                    if (newTimeAgo !== a.timeAgo) {
                        a.timeAgo = newTimeAgo;
                        updated = true;
                    }
                });
                if (updated) {
                    saveActivities(activities);
                    updateDropdown();
                }
            }
        }, 60000); // Update every minute
        
        // Add clear button handler
        const clearButton = document.getElementById('clearRecentActivities');
        if (clearButton) {
            clearButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Clear all recent activities?')) {
                    clearActivities();
                }
            });
        }
    }
    
    return {
        init: init,
        addActivity: addActivity,
        getActivities: getActivities,
        clearActivities: clearActivities,
        updateDropdown: updateDropdown
    };
})();

