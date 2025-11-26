/**
 * Authentication Service for iComply
 * Integrates with Lambda Proxy for Google OAuth and RBAC
 */

class AuthService {
    constructor() {
        this.proxyUrl = 'https://o4n4qwc7mtdgzqhjkscuheyvji0seljg.lambda-url.af-south-1.on.aws';
        this.token = localStorage.getItem('lambda_token');
        this.userInfo = this.getUserInfo();

        // If we have user info but no role_name, fetch complete info
        if (this.userInfo && !this.userInfo.role_name && this.userInfo.role_id) {
            this.fetchCompleteUserInfo();
        }

        // Validate session on init if we have a token
        if (this.token) {
            this.validateSession().catch(err => {
                console.warn('Session validation warning:', err);
            });
        }
    }

    /**
     * Get user info from localStorage
     */
    getUserInfo() {
        try {
            const userInfo = localStorage.getItem('user_info');
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error parsing user info:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token && !!this.userInfo;
    }

    /**
     * Get current user's role
     */
    getUserRole() {
        // If we have role_name, use it
        if (this.userInfo?.role_name) {
            return this.userInfo.role_name;
        }

        // If we only have role_id, return a default
        return this.userInfo?.role_id ? 'Unknown Role' : 'Viewer';
    }

    /**
     * Check if user has specific role
     */
    hasRole(roleName) {
        return this.getUserRole() === roleName;
    }

    /**
     * Check if user has FSP Owner privileges (highest level)
     */
    isFSPOwner() {
        return this.hasRole('FSP Owner');
    }

    /**
     * Check if user has admin privileges
     */
    isAdmin() {
        return this.hasRole('Admin') || this.isFSPOwner();
    }

    /**
     * Check if user has Compliance Officer role
     */
    isComplianceOfficer() {
        return this.hasRole('Compliance Officer') || this.isAdmin();
    }

    /**
     * Check if user has Key Individual role
     */
    isKeyIndividual() {
        return this.hasRole('Key Individual');
    }

    /**
     * Check if user has Representative role
     */
    isRepresentative() {
        return this.hasRole('FSP Representative') || this.hasRole('Representative');
    }

    /**
     * Check if user has user privileges (standard access)
     */
    isUser() {
        return this.hasRole('User') || this.hasRole('Administrative Staff') || this.isRepresentative() || this.isKeyIndividual() || this.isComplianceOfficer();
    }

    /**
     * Check if user has viewer privileges (read-only)
     */
    isViewer() {
        return this.hasRole('Viewer') || this.isUser();
    }

    /**
     * Authenticates with Google via the Lambda proxy.
     * @param {string} idToken - Google JWT id_token from Google OAuth.
     * @returns {Promise<object>} - The authentication result from the Lambda proxy.
     */
    async authenticateWithGoogle(idToken) {
        try {
            const response = await fetch(`${this.proxyUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    provider: 'google',
                    id_token: idToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.token && result.user) {
                this.token = result.token;
                this.userInfo = result.user;
                localStorage.setItem('lambda_token', result.token);
                localStorage.setItem('user_info', JSON.stringify(result.user));

                // If we don't have role_name, fetch complete user info
                if (!this.userInfo.role_name && this.userInfo.role_id) {
                    await this.fetchCompleteUserInfo();
                }
            }
            return result;
        } catch (error) {
            console.error('Error authenticating with Google:', error);
            throw error;
        }
    }

    /**
     * Fetch complete user info with role name
     */
    async fetchCompleteUserInfo() {
        try {
            const userId = this.userInfo.user_id || this.userInfo.id;

            // Get user profiles from database
            const result = await this.callFunction('get_user_profiles', {
                p_status: 'active'
            });

            // Handle different response formats
            let profiles = [];
            if (result && result.get_user_profiles) {
                profiles = result.get_user_profiles;
            } else if (Array.isArray(result)) {
                profiles = result;
            }

            // Find current user's profile
            const userData = profiles.find(u => u.id === userId || u.email === this.userInfo.email);

            if (userData) {
                this.userInfo = {
                    ...this.userInfo,
                    role_id: userData.role_id,
                    role_name: userData.role_name,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    job_title: userData.job_title,
                    department: userData.department
                };
                localStorage.setItem('user_info', JSON.stringify(this.userInfo));
            }
        } catch (error) {
            console.error('Error fetching complete user info:', error);
        }
    }

    /**
     * Sign out user
     */
    signOut() {
        // Get cc parameter from localStorage (stored as client_guid during sign-in)
        const ccParam = localStorage.getItem('client_guid');

        localStorage.removeItem('lambda_token');
        localStorage.removeItem('user_info');
        this.token = null;
        this.userInfo = null;

        // Preserve cc parameter in redirect
        const signinUrl = ccParam ? `signin.html?cc=${encodeURIComponent(ccParam)}` : 'signin.html';
        window.location.href = signinUrl;
    }

    /**
     * Validate session through health check endpoint
     * As described in INTEGRATION_SUMMARY.md - validates JWT token
     */
    async validateSession() {
        if (!this.token) {
            return false;
        }

        try {
            const response = await fetch(`${this.proxyUrl}/proxy/health`, {
                method: 'POST',  // Lambda requires POST for proxy endpoints
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})  // Empty body for health check
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    console.warn('Session validation failed: token expired');
                    return false;
                }

                // Log other errors for debugging
                const errorData = await response.json().catch(() => ({}));
                console.warn('Session validation failed:', errorData);
                return false;
            }

            const result = await response.json();
            return result.status === 'healthy' || result.authenticated === true;
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    /**
     * Make authenticated API call to Lambda proxy
     * Enhanced with RBAC error handling as per INTEGRATION_SUMMARY.md
     */
    async makeAuthenticatedRequest(endpoint, options = {}) {
        if (!this.token) {
            throw new Error('No authentication token available');
        }

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        };

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${this.proxyUrl}${endpoint}`, requestOptions);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    // Token expired or invalid
                    this.signOut();
                    throw new Error('Authentication expired. Please sign in again.');
                }

                if (response.status === 403) {
                    // RBAC permission denied
                    const rbacError = new Error(errorData.message || 'Permission denied. You do not have access to this resource.');
                    rbacError.code = errorData.code || 'RBAC_PERMISSION_DENIED';
                    rbacError.role = errorData.role || this.getUserRole();
                    throw rbacError;
                }

                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Call a database function through the proxy
     * Enhanced with RBAC error handling as per INTEGRATION_SUMMARY.md
     */
    async callFunction(functionName, params = {}, token = null) {
        try {
            const response = await fetch(`${this.proxyUrl}/proxy/function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || this.token}`
                },
                body: JSON.stringify({
                    function: functionName,
                    params: params
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle authentication errors
                if (response.status === 401) {
                    this.signOut();
                    throw new Error('Authentication expired. Please sign in again.');
                }

                // Handle RBAC permission errors
                if (response.status === 403 || errorData.code === 'RBAC_PERMISSION_DENIED') {
                    const rbacError = new Error(
                        errorData.message ||
                        `Permission denied. You do not have access to execute '${functionName}'.`
                    );
                    rbacError.code = 'RBAC_PERMISSION_DENIED';
                    rbacError.functionName = functionName;
                    rbacError.role = errorData.role || this.getUserRole();
                    throw rbacError;
                }

                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.error) {
                // Check if it's an RBAC error in the response body
                if (result.code === 'RBAC_PERMISSION_DENIED') {
                    const rbacError = new Error(result.error);
                    rbacError.code = 'RBAC_PERMISSION_DENIED';
                    rbacError.functionName = functionName;
                    rbacError.role = this.getUserRole();
                    throw rbacError;
                }
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error(`Error calling ${functionName}:`, error);
            throw error;
        }
    }


    /**
     * Get user profile
     */
    async getUserProfile() {
        return await this.callFunction('get_user_profile', {
            p_user_id: this.userInfo?.user_id
        });
    }

    /**
     * Update user profile
     */
    async updateUserProfile(profileData) {
        return await this.callFunction('update_user_profile', {
            p_user_id: this.userInfo?.user_id,
            ...profileData
        });
    }

    /**
     * Refresh user session
     */
    async refreshSession() {
        try {
            const result = await this.makeAuthenticatedRequest('/auth/refresh');
            if (result.token) {
                this.token = result.token;
                localStorage.setItem('lambda_token', result.token);
            }
            return result;
        } catch (error) {
            console.error('Session refresh failed:', error);
            this.signOut();
            throw error;
        }
    }

    /**
     * Check if user can access specific resource (CLIENT-SIDE ONLY)
     * Note: Server-side RBAC validation is authoritative. This is for UI control only.
     */
    canAccess(resource, operation = 'SELECT') {
        // FSP Owner and Admin have full access
        if (this.isFSPOwner() || this.hasRole('Admin')) {
            return true;
        }

        // Compliance Officer has broad access except role management
        if (this.isComplianceOfficer()) {
            if (['roles', 'role_permissions'].includes(resource) && operation !== 'SELECT') {
                return false;
            }
            return true;
        }

        // Key Individual has supervisory read access
        if (this.isKeyIndividual()) {
            return operation === 'SELECT';
        }

        // Representatives can read and manage their own data
        if (this.isRepresentative()) {
            const writeableResources = ['cpd_activities', 'documents', 'clients'];
            if (writeableResources.includes(resource)) {
                return true;
            }
            return operation === 'SELECT';
        }

        // Administrative Staff has limited write access
        if (this.hasRole('Administrative Staff')) {
            const restrictedResources = ['users', 'roles', 'role_permissions'];
            if (restrictedResources.includes(resource) && operation !== 'SELECT') {
                return false;
            }
            return true;
        }

        // Viewer has read-only access
        if (this.isViewer()) {
            return operation === 'SELECT';
        }

        // Default deny
        return false;
    }

    /**
     * Check if user can execute a specific function (CLIENT-SIDE ONLY)
     * Server-side Lambda always validates against role_permissions table
     * @param {string} functionName - Name of the database function
     * @returns {boolean} - Whether user likely has EXECUTE permission
     */
    checkFunctionPermission(functionName) {
        // Admin and FSP Owner can execute any function
        if (this.isFSPOwner() || this.hasRole('Admin')) {
            return true;
        }

        // Compliance Officer can execute most functions
        if (this.isComplianceOfficer()) {
            // Restricted functions
            const restrictedFunctions = ['delete_user', 'delete_role', 'update_role_permissions'];
            return !restrictedFunctions.includes(functionName);
        }

        // Key Individual has supervisory read access
        if (this.isKeyIndividual()) {
            return functionName.startsWith('get_') || functionName.startsWith('list_');
        }

        // Representatives can read and update their own data
        if (this.isRepresentative()) {
            const allowedPrefixes = ['get_', 'list_', 'create_cpd', 'update_cpd', 'create_document', 'update_document'];
            return allowedPrefixes.some(prefix => functionName.startsWith(prefix));
        }

        // Viewer has read-only access
        if (this.isViewer()) {
            return functionName.startsWith('get_') || functionName.startsWith('list_');
        }

        return false;
    }

    /**
     * Check if user can perform operation on a table (CLIENT-SIDE ONLY)
     * @param {string} tableName - Name of the database table
     * @param {string} operation - Operation (SELECT, INSERT, UPDATE, DELETE)
     * @returns {boolean} - Whether user likely has permission
     */
    checkTablePermission(tableName, operation) {
        return this.canAccess(tableName, operation);
    }

    /**
     * Format RBAC error for display to user
     * @param {Error} error - The RBAC error object
     * @returns {string} - Formatted user-friendly message
     */
    handleRBACError(error) {
        if (error.code === 'RBAC_PERMISSION_DENIED') {
            const role = error.role || this.getUserRole();
            let message = `Permission Denied\n\n`;
            message += `Your role: ${role}\n`;

            if (error.functionName) {
                message += `Function: ${error.functionName}\n`;
            }

            message += `\nYou do not have permission to perform this action. `;
            message += `Please contact your FSP Owner or Administrator if you believe you should have access.`;

            return message;
        }

        return error.message || 'An unknown error occurred';
    }

    /**
     * Display RBAC error using SweetAlert2 (if available)
     * @param {Error} error - The RBAC error object
     */
    showRBACError(error) {
        const message = this.handleRBACError(error);

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: message,
                confirmButtonColor: '#dc3545'
            });
        } else {
            alert(message);
        }
    }

}

// Create global instance
window.authService = new AuthService();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
