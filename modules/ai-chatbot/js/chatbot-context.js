/**
 * AI Chatbot Context Detection
 * Detects current context (module, page, user role, etc.)
 */

var ChatbotContext = (function() {
    'use strict';

    /**
     * Detect current context
     * @returns {object} Context object with module, page, user info, etc.
     */
    function detect() {
        const context = {
            module: detectModule(),
            page: detectPage(),
            userRole: detectUserRole(),
            route: detectRoute(),
            timestamp: new Date().toISOString()
        };

        // Add module-specific context
        switch (context.module) {
            case 'cpd':
                context.cpdContext = detectCPDContext();
                break;
            case 'fica':
            case 'clients-fica':
                context.ficaContext = detectFICAContext();
                break;
            case 'representatives':
                context.representativesContext = detectRepresentativesContext();
                break;
            case 'complaints':
                context.complaintsContext = detectComplaintsContext();
                break;
            case 'alerts':
                context.alertsContext = detectAlertsContext();
                break;
        }

        return context;
    }

    /**
     * Detect current module
     * @returns {string} Module name
     */
    function detectModule() {
        // Check URL hash or route
        const hash = window.location.hash;
        const path = window.location.pathname;

        // Check for route parameter
        const urlParams = new URLSearchParams(window.location.search);
        const route = urlParams.get('route') || hash.replace('#', '');

        // Check content area for module indicators
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            const moduleClasses = contentArea.className.match(/module-(\w+)/);
            if (moduleClasses) {
                return moduleClasses[1];
            }
        }

        // Check for data attributes
        const activeNavItem = document.querySelector('.sidebar-menu-item.active');
        if (activeNavItem) {
            const routeAttr = activeNavItem.getAttribute('data-route');
            if (routeAttr) {
                return routeAttr;
            }
        }

        // Map common routes to modules
        const routeMap = {
            'cpd': 'cpd',
            'cpd-management': 'cpd',
            'fica': 'fica',
            'clients-fica': 'clients-fica',
            'representatives': 'representatives',
            'representatives-management': 'representatives',
            'complaints': 'complaints',
            'complaints-management': 'complaints',
            'alerts': 'alerts',
            'alerts-notifications': 'alerts',
            'executive-dashboard': 'executive-dashboard',
            'client-management': 'client-management',
            'fit-and-proper': 'fit-and-proper',
            'internal-audits': 'internal-audits',
            'documents': 'documents',
            'reports-analytics': 'reports-analytics',
            'settings-administration': 'settings-administration',
            'team-compliance': 'team-compliance'
        };

        return routeMap[route] || routeMap[hash.replace('#', '')] || 'general';
    }

    /**
     * Detect current page/view
     * @returns {string} Page identifier
     */
    function detectPage() {
        const hash = window.location.hash;
        const activeView = document.querySelector('.view.active, .tab-pane.active');
        
        if (activeView) {
            const viewId = activeView.id || activeView.getAttribute('data-view');
            if (viewId) {
                return viewId;
            }
        }

        // Check for specific page indicators
        const pageIndicators = {
            'dashboard': document.querySelector('.dashboard-view, #dashboard'),
            'form': document.querySelector('form, .form-view'),
            'list': document.querySelector('.data-table, .list-view'),
            'detail': document.querySelector('.detail-view, .profile-view')
        };

        for (const [page, element] of Object.entries(pageIndicators)) {
            if (element) {
                return page;
            }
        }

        return 'unknown';
    }

    /**
     * Detect user role
     * @returns {string} User role
     */
    function detectUserRole() {
        // Check auth service
        if (typeof authService !== 'undefined' && authService.userInfo) {
            return authService.userInfo.role || authService.userInfo.user_role || 'user';
        }

        // Check user menu
        const userMenu = document.querySelector('.user-menu-dropdown');
        if (userMenu) {
            const roleText = userMenu.textContent;
            if (roleText.includes('Admin') || roleText.includes('Administrator')) {
                return 'admin';
            }
            if (roleText.includes('Compliance')) {
                return 'compliance_officer';
            }
            if (roleText.includes('Representative')) {
                return 'representative';
            }
        }

        return 'user';
    }

    /**
     * Detect current route
     * @returns {string} Route identifier
     */
    function detectRoute() {
        // Check app router
        if (typeof _appRouter !== 'undefined' && _appRouter.currentRoute) {
            return _appRouter.currentRoute;
        }

        // Check URL
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            return hash;
        }

        const path = window.location.pathname;
        if (path && path !== '/') {
            return path;
        }

        return 'dashboard';
    }

    /**
     * Detect CPD-specific context
     * @returns {object} CPD context
     */
    function detectCPDContext() {
        const context = {};

        // Check for CPD progress
        const progressElement = document.querySelector('.cpd-progress, [data-cpd-progress]');
        if (progressElement) {
            context.progress = progressElement.getAttribute('data-cpd-progress') || 
                             progressElement.textContent.match(/\d+/)?.[0];
        }

        // Check for cycle end date
        const cycleElement = document.querySelector('.cpd-cycle-end, [data-cycle-end]');
        if (cycleElement) {
            context.cycleEndDate = cycleElement.getAttribute('data-cycle-end');
        }

        // Check for active form
        const formElement = document.querySelector('form[data-cpd-form]');
        if (formElement) {
            context.activeForm = formElement.getAttribute('data-cpd-form');
        }

        return context;
    }

    /**
     * Detect FICA-specific context
     * @returns {object} FICA context
     */
    function detectFICAContext() {
        const context = {};

        // Check for client selection
        const selectedClient = document.querySelector('.client-selected, [data-client-id]');
        if (selectedClient) {
            context.clientId = selectedClient.getAttribute('data-client-id');
        }

        // Check for verification status
        const verificationStatus = document.querySelector('.fica-status, [data-fica-status]');
        if (verificationStatus) {
            context.verificationStatus = verificationStatus.getAttribute('data-fica-status');
        }

        // Check for risk level
        const riskLevel = document.querySelector('.risk-level, [data-risk-level]');
        if (riskLevel) {
            context.riskLevel = riskLevel.getAttribute('data-risk-level');
        }

        return context;
    }

    /**
     * Detect Representatives-specific context
     * @returns {object} Representatives context
     */
    function detectRepresentativesContext() {
        const context = {};

        // Check for selected representative
        const selectedRep = document.querySelector('.representative-selected, [data-representative-id]');
        if (selectedRep) {
            context.representativeId = selectedRep.getAttribute('data-representative-id');
        }

        // Check for active form
        const formElement = document.querySelector('form[data-representative-form]');
        if (formElement) {
            context.activeForm = formElement.getAttribute('data-representative-form');
        }

        return context;
    }

    /**
     * Detect Complaints-specific context
     * @returns {object} Complaints context
     */
    function detectComplaintsContext() {
        const context = {};

        // Check for selected complaint
        const selectedComplaint = document.querySelector('.complaint-selected, [data-complaint-id]');
        if (selectedComplaint) {
            context.complaintId = selectedComplaint.getAttribute('data-complaint-id');
        }

        // Check for complaint status
        const statusElement = document.querySelector('.complaint-status, [data-complaint-status]');
        if (statusElement) {
            context.status = statusElement.getAttribute('data-complaint-status');
        }

        return context;
    }

    /**
     * Detect Alerts-specific context
     * @returns {object} Alerts context
     */
    function detectAlertsContext() {
        const context = {};

        // Check for alert count
        const alertBadge = document.querySelector('.alert-badge, [data-alert-count]');
        if (alertBadge) {
            context.alertCount = alertBadge.getAttribute('data-alert-count') || 
                               alertBadge.textContent.match(/\d+/)?.[0];
        }

        // Check for selected alert
        const selectedAlert = document.querySelector('.alert-selected, [data-alert-id]');
        if (selectedAlert) {
            context.alertId = selectedAlert.getAttribute('data-alert-id');
            context.alertPriority = selectedAlert.getAttribute('data-alert-priority');
            context.alertCategory = selectedAlert.getAttribute('data-alert-category');
        }

        return context;
    }

    /**
     * Get context-specific suggestions
     * @param {object} context - Current context
     * @returns {Array<string>} Array of suggestion strings
     */
    function getSuggestions(context) {
        const suggestions = [];

        // General suggestions
        suggestions.push('How do I navigate this module?');
        suggestions.push('What are the key features here?');

        // Module-specific suggestions
        switch (context.module) {
            case 'cpd':
                suggestions.push('How do I log CPD hours?');
                suggestions.push('What are the CPD requirements?');
                suggestions.push('How do I upload CPD activities?');
                break;

            case 'fica':
            case 'clients-fica':
                suggestions.push('What documents are required for FICA verification?');
                suggestions.push('How do I complete a FICA review?');
                suggestions.push('What is the risk assessment process?');
                break;

            case 'representatives':
                suggestions.push('How do I add a new representative?');
                suggestions.push('What are the Fit & Proper requirements?');
                suggestions.push('How do I update representative information?');
                break;

            case 'complaints':
                suggestions.push('How do I log a new complaint?');
                suggestions.push('What is the complaints process?');
                suggestions.push('How do I update complaint status?');
                break;

            case 'alerts':
                suggestions.push('How do I resolve this alert?');
                suggestions.push('What do these alert priorities mean?');
                break;

            case 'executive-dashboard':
                suggestions.push('What does the health score mean?');
                suggestions.push('How do I interpret these metrics?');
                break;
        }

        // Role-specific suggestions
        if (context.userRole === 'representative') {
            suggestions.push('What are my compliance obligations?');
            suggestions.push('How do I check my CPD progress?');
        }

        if (context.userRole === 'compliance_officer' || context.userRole === 'admin') {
            suggestions.push('How do I generate compliance reports?');
            suggestions.push('What are the key compliance deadlines?');
        }

        return suggestions.slice(0, 4); // Return top 4 suggestions
    }

    // Public API
    return {
        detect: detect,
        getSuggestions: getSuggestions
    };
})();

