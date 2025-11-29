// Settings & Administration JavaScript
'use strict';

// Import data functions if needed
// Assumes dataFunctions is globally available from data-functions.js

console.log('Settings & Administration JS loading...');

// FSP Configuration State
let currentFSPConfig = null;

// User Profiles Data (loaded from database)
let usersData = [];
let userRolesData = []; // For role dropdown

const keyIndividualsData = [
    {
        name: 'John van Zyl',
        idNumber: '7105145123084',
        fspNumber: 'FSP12345-P-001',
        email: 'john.vanzyl@brightfuture.co.za',
        phone: '+27 82 123 4567',
        appointed: '15 March 2015',
        status: 'active',
        type: 'Principal'
    },
    {
        name: 'Thandi Dlamini',
        fspNumber: 'FSP12345-KI-001',
        supervises: 18,
        categories: 'I, II, III',
        status: 'active',
        type: 'Key Individual'
    },
    {
        name: 'Pieter van Rensburg',
        fspNumber: 'FSP12345-KI-002',
        supervises: 18,
        categories: 'I, II',
        status: 'active',
        type: 'Key Individual'
    },
    {
        name: 'Lindiwe Mbatha',
        fspNumber: 'FSP12345-CO-001',
        appointed: '10 February 2022',
        qualification: 'Bachelor of Commerce (Law)',
        experience: '8 years compliance management',
        status: 'active',
        type: 'Compliance Officer'
    }
];

const integrationsData = [
    {
        id: 1,
        name: 'Email Service',
        icon: 'fas fa-envelope',
        status: 'connected',
        provider: 'Gmail (Google Workspace)',
        account: 'compliance@brightfuture.co.za',
        lastSync: '23/11/2024 15:30',
        features: ['Send notification emails', 'Schedule report delivery', 'Bulk email reminders']
    },
    {
        id: 2,
        name: 'SMS Service',
        icon: 'fas fa-sms',
        status: 'not-connected',
        provider: 'Clickatell / Twilio',
        features: ['Send SMS notifications', 'Two-factor authentication codes', 'Critical alert notifications']
    },
    {
        id: 3,
        name: 'Cloud Storage',
        icon: 'fas fa-cloud',
        status: 'connected',
        provider: 'Google Drive',
        account: 'admin@brightfuture.co.za',
        lastSync: '23/11/2024 14:00',
        features: ['Automatic document backup', 'Report archive storage', 'Shared document access']
    },
    {
        id: 4,
        name: 'Calendar Sync',
        icon: 'fas fa-calendar',
        status: 'not-connected',
        provider: 'Google Calendar, Outlook',
        features: ['Sync CPD deadlines', 'Sync F&P renewal dates', 'Sync FICA review dates']
    },
    {
        id: 5,
        name: 'Accounting Software',
        icon: 'fas fa-calculator',
        status: 'not-connected',
        provider: 'Xero, QuickBooks, Sage',
        features: ['Sync commission data', 'Track CPD provider payments', 'Monitor compliance costs']
    }
];

const auditLogsData = [
    {
        id: 1,
        timestamp: '23/11/2024 15:45:32',
        user: 'Lindiwe Mbatha',
        userRole: 'Compliance Officer',
        action: 'Viewed Report',
        actionCode: 'report_view',
        module: 'Reports & Analytics',
        details: 'CPD Compliance Summary',
        ipAddress: '102.168.1.45',
        location: 'Cape Town',
        status: 'success'
    },
    {
        id: 2,
        timestamp: '23/11/2024 14:30:18',
        user: 'John van Zyl',
        userRole: 'FSP Owner',
        action: 'Updated Settings',
        actionCode: 'settings_update',
        module: 'System Settings',
        details: 'Changed CPD threshold from 60% to 70%',
        ipAddress: '102.168.1.12',
        location: 'Cape Town',
        status: 'success'
    },
    {
        id: 3,
        timestamp: '23/11/2024 08:15:47',
        user: 'Thabo Maluleke',
        userRole: 'Representative',
        action: 'User Login',
        actionCode: 'user_login',
        module: 'Authentication',
        details: 'Successful login (2FA verified)',
        ipAddress: '102.168.1.89',
        location: 'Cape Town',
        status: 'success'
    },
    {
        id: 4,
        timestamp: '22/11/2024 23:45:12',
        user: 'peter.botha@...',
        userRole: 'Unknown',
        action: 'Failed Login',
        actionCode: 'login_failed',
        module: 'Authentication',
        details: 'Invalid password (Attempt 3/5)',
        ipAddress: '41.185.23.45',
        location: 'Johannesburg',
        status: 'failed'
    },
    {
        id: 5,
        timestamp: '22/11/2024 16:20:34',
        user: 'Sarah van der Merwe',
        userRole: 'Representative',
        action: 'Uploaded Document',
        actionCode: 'document_upload',
        module: 'Document Management',
        details: 'CPD Certificate.pdf (File size: 245 KB)',
        ipAddress: '102.168.1.67',
        location: 'Cape Town',
        status: 'success'
    }
];

const backupsData = [
    { date: '23/11/2024 02:00', size: '2.4 GB', status: 'success' },
    { date: '22/11/2024 02:00', size: '2.3 GB', status: 'success' },
    { date: '21/11/2024 02:00', size: '2.3 GB', status: 'success' },
    { date: '20/11/2024 02:00', size: '2.2 GB', status: 'success' },
    { date: '19/11/2024 02:00', size: '2.2 GB', status: 'success' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings & Administration - DOMContentLoaded');
    console.log('dataFunctions available:', typeof dataFunctions !== 'undefined');
    console.log('bootstrap available:', typeof bootstrap !== 'undefined');
    console.log('Swal available:', typeof Swal !== 'undefined');
    
    // Ensure functions are globally available for onclick handlers
    window.editUserProfile = editUserProfile;
    window.viewUserProfile = viewUserProfile;
    window.deleteUserProfile = deleteUserProfile;
    window.resetPassword = resetPassword;
    window.toggleUserStatus = toggleUserStatus;
    window.openAddUserModal = openAddUserModal;
    window.editUserRole = editUserRole;
    window.deleteUserRole = deleteUserRole;
    
    console.log('Window functions exported:', typeof window.editUserProfile);
    
    initializeSettings();
    setupEventListeners();
});

async function initializeSettings() {
    console.log('initializeSettings() called');
    // Load FSP Configuration from database
    await loadFSPConfiguration();
    
    // Load other data
    await loadUserProfiles(); // Load from database
    await loadUserRoles(); // Load roles for dropdown
    // Load key individuals from database
    await loadKeyIndividuals();
    renderIntegrations();
    renderAuditLogs();
    renderBackups();
    await loadSystemSettings();
    
    // Load corporate identity when tab is shown
    document.getElementById('corporate-identity-tab')?.addEventListener('shown.bs.tab', function() {
        initializeCorporateIdentity();
    });
    
    // Load users and roles when User Management tab is shown
    document.getElementById('users-tab')?.addEventListener('shown.bs.tab', async function() {
        await loadUserProfiles();
        await loadUserRoles();
    });
}

// ============================================================================
// FSP CONFIGURATION FUNCTIONS
// ============================================================================

/**
 * Load FSP Configuration from Database
 */
async function loadFSPConfiguration() {
    try {
        // Show loading state
        showLoadingState('fspInfoForm');
        
        // Get FSP configuration from database
        const result = await dataFunctions.getFspConfiguration();
        
        // Handle different response structures
        let fspConfig = result;
        if (result && result.data) {
            fspConfig = result.data;
        }
        
        if (fspConfig && Array.isArray(fspConfig) && fspConfig.length > 0) {
            currentFSPConfig = fspConfig[0];
            populateFSPForm(currentFSPConfig);
            console.log('FSP Configuration loaded successfully:', currentFSPConfig);
        } else if (fspConfig && !Array.isArray(fspConfig)) {
            // Single object response
            currentFSPConfig = fspConfig;
            populateFSPForm(currentFSPConfig);
            console.log('FSP Configuration loaded successfully:', currentFSPConfig);
        } else {
            console.log('No FSP configuration found, form will be empty for initial setup');
            currentFSPConfig = null;
        }
        
        // Load license details and thresholds from system_settings
        await loadLicenseDetails();
        await loadComplianceThresholds();
        
    } catch (error) {
        console.error('Error loading FSP configuration:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to load FSP configuration. Please refresh the page.',
            icon: 'error'
        });
    } finally {
        hideLoadingState('fspInfoForm');
    }
}

/**
 * Populate FSP Form with Data
 */
function populateFSPForm(config) {
    // Basic Information
    document.getElementById('fspName').value = config.fsp_name || '';
    document.getElementById('fspLicense').value = config.fsp_license_number || '';
    document.getElementById('regNumber').value = config.registration_number || '';
    document.getElementById('vatNumber').value = config.vat_number || '';
    
    // Address
    document.getElementById('street').value = config.address_street || '';
    document.getElementById('city').value = config.address_city || '';
    document.getElementById('postalCode').value = config.address_postal_code || '';
    
    // Province mapping
    const provinceMap = {
        'Western Cape': 'WC',
        'Eastern Cape': 'EC',
        'Free State': 'FS',
        'Gauteng': 'GP',
        'KwaZulu-Natal': 'KZN',
        'Limpopo': 'LP',
        'Mpumalanga': 'MP',
        'Northern Cape': 'NC',
        'North West': 'NW'
    };
    
    const provinceCode = provinceMap[config.address_province] || config.address_province;
    if (provinceCode) {
        document.getElementById('province').value = provinceCode;
    }
    
    // Contact Information
    document.getElementById('phone').value = config.phone || '';
    document.getElementById('email').value = config.email || '';
    
    // Website
    const websiteField = document.getElementById('website');
    if (websiteField) {
        websiteField.value = config.website || '';
    }
    
    // License & Authorization section (if exists)
    const licenseNumberField = document.getElementById('licenseNumber');
    if (licenseNumberField) {
        licenseNumberField.value = config.fsp_license_number || '';
    }
    
    // Issue date will be loaded from system_settings
    // Categories will be loaded from system_settings
}

/**
 * Save FSP Configuration to Database
 */
async function saveFSPConfiguration(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = {
            fsp_name: document.getElementById('fspName').value.trim(),
            fsp_license_number: document.getElementById('fspLicense').value.trim(),
            registration_number: document.getElementById('regNumber').value.trim() || null,
            vat_number: document.getElementById('vatNumber').value.trim() || null,
            address_street: document.getElementById('street').value.trim() || null,
            address_city: document.getElementById('city').value.trim() || null,
            address_province: document.getElementById('province').options[document.getElementById('province').selectedIndex].text,
            address_postal_code: document.getElementById('postalCode').value.trim() || null,
            phone: document.getElementById('phone').value.trim() || null,
            email: document.getElementById('email').value.trim() || null,
            website: document.getElementById('website')?.value.trim() || null
        };
        
        // Validate required fields
        if (!formData.fsp_name || !formData.fsp_license_number) {
            Swal.fire({
                title: 'Validation Error',
                text: 'FSP Name and License Number are required',
                icon: 'warning'
            });
            return;
        }
        
        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your changes',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        let result;
        
        if (currentFSPConfig && currentFSPConfig.id) {
            // Update existing configuration
            result = await dataFunctions.updateFspConfiguration(
                currentFSPConfig.id,
                formData
            );
        } else {
            // Create new configuration
            result = await dataFunctions.createFspConfiguration(formData);
        }
        
        if (result && result.success) {
            // Reload configuration to get latest data
            await loadFSPConfiguration();
            
            Swal.fire({
                title: 'Success!',
                text: 'FSP Configuration saved successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            throw new Error(result?.error || 'Failed to save configuration');
        }
    } catch (error) {
        console.error('Error saving FSP configuration:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save configuration: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Show Loading State on Form
 */
function showLoadingState(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    // Add loading spinner to submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    }
}

/**
 * Hide Loading State on Form
 */
function hideLoadingState(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = false;
    });
    
    // Restore submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = 'Save Changes';
    }
}

/**
 * Load User Profiles from Database
 */
async function loadUserProfiles() {
    console.log('loadUserProfiles() called');
    try {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) {
            console.error('usersTableBody element not found');
            return;
        }
        
        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `;
        
        // Get all user profiles (active and inactive)
        const result = await dataFunctions.getUserProfiles(null); // null = all statuses
        
        // Handle different response formats
        if (result) {
            if (Array.isArray(result)) {
                usersData = result;
            } else if (result.data && Array.isArray(result.data)) {
                usersData = result.data;
            } else if (result.success && result.data && Array.isArray(result.data)) {
                usersData = result.data;
            } else {
                console.warn('Unexpected response format:', result);
                usersData = [];
            }
        } else {
            usersData = [];
        }
        
        // Also get roles to join role information
        const rolesResult = await dataFunctions.getUserRoles();
        if (rolesResult) {
            if (Array.isArray(rolesResult)) {
                userRolesData = rolesResult;
            } else if (rolesResult.data && Array.isArray(rolesResult.data)) {
                userRolesData = rolesResult.data;
            } else if (rolesResult.success && rolesResult.data && Array.isArray(rolesResult.data)) {
                userRolesData = rolesResult.data;
            }
        }
        
        console.log('Loaded usersData:', usersData.length, 'users');
        console.log('Loaded userRolesData:', userRolesData.length, 'roles');
        renderUsersTable();
    } catch (error) {
        console.error('Error loading user profiles:', error);
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error loading users: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Render User Profiles Table
 */
function renderUsersTable() {
    console.log('renderUsersTable() called');
    renderFilteredUsersTable(usersData);
}

/**
 * Render Filtered User Profiles Table
 */
function renderFilteredUsersTable(filteredUsers) {
    console.log('renderFilteredUsersTable() called with', filteredUsers?.length || 0, 'users');
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.error('usersTableBody not found in renderFilteredUsersTable');
        return;
    }
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No users found. ${usersData.length === 0 ? 'Click "Add New User" to create one.' : 'Try adjusting your filters.'}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const tr = document.createElement('tr');
        
        // Find role display name - prefer role_display_name from user data, then lookup in userRolesData, then fallback to role_name
        const roleDisplayName = user.role_display_name || 
                                (userRolesData.find(r => r.id === user.role_id)?.role_display_name) || 
                                (user.role_name || 'No Role');
        
        // Format status badge
        let statusBadge = '';
        if (user.status === 'active') {
            statusBadge = '<span class="badge bg-success">✅ Active</span>';
        } else if (user.status === 'inactive') {
            statusBadge = '<span class="badge bg-secondary">⏸️ Inactive</span>';
        } else if (user.status === 'suspended') {
            statusBadge = '<span class="badge bg-warning">⚠️ Suspended</span>';
        } else {
            statusBadge = `<span class="badge bg-secondary">${user.status || 'Unknown'}</span>`;
        }
        
        // Format last login
        const lastLogin = user.last_login ? 
            new Date(user.last_login).toLocaleString('en-ZA', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : 
            '<span class="text-muted">Never</span>';
        
        // Format created date
        const createdDate = user.created_at ? 
            new Date(user.created_at).toLocaleDateString('en-ZA') : 
            'N/A';
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        const userName = escapeHtml(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown');
        const userEmail = escapeHtml(user.email || '');
        const safeUserId = escapeHtml(user.id);
        const safeUserName = escapeHtml(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown');
        
        tr.innerHTML = `
            <td>${userName}</td>
            <td>${userEmail}</td>
            <td>${escapeHtml(roleDisplayName)}</td>
            <td>${statusBadge}</td>
            <td>${lastLogin}</td>
            <td>${createdDate}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group" aria-label="User actions">
                    <button 
                        type="button"
                        class="btn btn-outline-primary" 
                        onclick="editUserProfile('${safeUserId}')"
                        title="Edit user profile">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        type="button"
                        class="btn btn-outline-secondary" 
                        onclick="resetPassword('${safeUserId}')"
                        title="Reset user password">
                        <i class="fas fa-key"></i>
                    </button>
                    <button 
                        type="button"
                        class="btn btn-outline-info" 
                        onclick="viewUserProfile('${safeUserId}')"
                        title="View user details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${user.status === 'active' ? `
                        <button 
                            type="button"
                            class="btn btn-outline-warning" 
                            onclick="toggleUserStatus('${safeUserId}', 'inactive', '${safeUserName}')"
                            title="Deactivate user account">
                            <i class="fas fa-user-slash"></i>
                        </button>
                    ` : `
                        <button 
                            type="button"
                            class="btn btn-outline-success" 
                            onclick="toggleUserStatus('${safeUserId}', 'active', '${safeUserName}')"
                            title="Activate user account">
                            <i class="fas fa-user-check"></i>
                        </button>
                        <button 
                            type="button"
                            class="btn btn-outline-danger" 
                            onclick="deleteUserProfile('${safeUserId}', '${safeUserName}')"
                            title="Permanently delete user profile">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    console.log('User table rendered with', filteredUsers?.length || 0, 'rows');
    
    // Initialize Bootstrap tooltips for all action buttons
    initializeActionTooltips();
    
    // Setup event delegation for user action buttons
    setupUserActionButtons();
    console.log('Event delegation setup complete');
}

/**
 * Initialize Bootstrap tooltips for action buttons
 */
function initializeActionTooltips() {
    // Check if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        // Destroy existing tooltips first to avoid duplicates
        const existingTooltips = document.querySelectorAll('#usersTableBody [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(element => {
            const tooltipInstance = bootstrap.Tooltip.getInstance(element);
            if (tooltipInstance) {
                tooltipInstance.dispose();
            }
        });
        
        // Initialize new tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#usersTableBody [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Setup User Action Button Event Delegation
 */
function setupUserActionButtons() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.error('usersTableBody not found');
        return;
    }
    
    console.log('Setting up user action buttons - direct binding');
    
    // Directly bind to each button (more reliable than delegation with Bootstrap tooltips)
    const buttons = tbody.querySelectorAll('.user-action-btn');
    console.log('Found', buttons.length, 'user action buttons');
    
    buttons.forEach(button => {
        // Remove any existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = this.dataset.action;
            const userId = this.dataset.userId;
            const userName = this.dataset.userName;
            const newStatus = this.dataset.newStatus;
            
            console.log('User action button clicked:', action, 'userId:', userId);
            
            handleUserAction(action, userId, userName, newStatus);
        });
    });
}

/**
 * Handle User Action
 */
function handleUserAction(action, userId, userName, newStatus) {
    console.log('handleUserAction:', action, userId);
    
    switch (action) {
        case 'edit':
            editUserProfile(userId);
            break;
        case 'reset-password':
            resetPassword(userId);
            break;
        case 'view':
            viewUserProfile(userId);
            break;
        case 'toggle-status':
            toggleUserStatus(userId, newStatus, userName);
            break;
        case 'delete':
            deleteUserProfile(userId, userName);
            break;
        default:
            console.warn('Unknown user action:', action);
    }
}

// Legacy function kept for compatibility (event delegation)
function handleUserActionClick(e) {
    let button = e.target;
    
    // If clicked on icon, find parent button
    if (button.tagName === 'I') {
        button = button.parentElement;
    }
    
    if (!button || !button.classList.contains('user-action-btn')) {
        button = e.target.closest('.user-action-btn');
    }
    
    if (!button) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = button.dataset.action;
    const userId = button.dataset.userId;
    const userName = button.dataset.userName;
    const newStatus = button.dataset.newStatus;
    
    console.log('handleUserActionClick:', action, userId);
    
    handleUserAction(action, userId, userName, newStatus);
}

// Fallback click handler - calls main handler
function handleUserClickFallback(action, userId, userName, newStatus) {
    handleUserAction(action, userId, userName, newStatus);
}

/**
 * Open Add User Modal
 */
function openAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    const form = document.getElementById('addUserForm');
    const roleSelect = document.getElementById('userRole');
    const modalTitle = document.getElementById('addUserModalLabel');
    
    // Reset form
    form.reset();
    form.dataset.editMode = 'false';
    document.getElementById('userId').disabled = false;
    document.getElementById('userEmail').disabled = false;
    modalTitle.textContent = 'Add New User';
    
    // Populate roles dropdown
    roleSelect.innerHTML = '<option value="">Select Role...</option>';
    userRolesData.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.role_display_name;
        roleSelect.appendChild(option);
    });
    
    modal.show();
}

/**
 * Handle Add/Edit User Profile Form Submit
 */
async function handleAddUserProfile(e) {
    e.preventDefault();
    
    try {
        const isEditMode = e.target.dataset.editMode === 'true';
        const userId = document.getElementById('userId').value.trim();
        const firstName = document.getElementById('userFirstName').value.trim();
        const lastName = document.getElementById('userLastName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const mobile = document.getElementById('userMobile').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const idNumber = document.getElementById('userIdNumber').value.trim();
        const fspNumber = document.getElementById('userFspNumber').value.trim();
        const roleId = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            Swal.fire({
                title: 'Validation Error',
                text: 'First Name, Last Name, and Email are required',
                icon: 'error'
            });
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please enter a valid email address',
                icon: 'error'
            });
            return;
        }
        
        // Validate role selection
        if (!roleId) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please select a role for the user',
                icon: 'error'
            });
            return;
        }
        
        // Validate UUID format (only for create)
        if (!isEditMode) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(userId)) {
                Swal.fire({
                    title: 'Validation Error',
                    text: 'User ID must be a valid UUID. This should match an existing auth.users.id',
                    icon: 'error'
                });
                return;
            }
        }
        
        Swal.fire({
            title: isEditMode ? 'Updating...' : 'Creating...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        let result;
        if (isEditMode) {
            // Update existing
            result = await dataFunctions.updateUserProfile(userId, {
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
                phone: phone || null,
                mobile: mobile || null,
                id_number: idNumber || null,
                fsp_number: fspNumber || null,
                status: status
            });
        } else {
            // Create new
            result = await dataFunctions.createUserProfile({
                id: userId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone || null,
                mobile: mobile || null,
                id_number: idNumber || null,
                fsp_number: fspNumber || null,
                status: status
            });
        }
        
        if (result && result.success) {
            Swal.fire({
                title: 'Success!',
                text: isEditMode ? 'User profile updated successfully' : 'User profile created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Close modal and reload
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
            
            // Reset form and edit mode
            e.target.reset();
            e.target.dataset.editMode = 'false';
            document.getElementById('userId').disabled = false;
            document.getElementById('userEmail').disabled = false;
            document.getElementById('addUserModalLabel').textContent = 'Add New User';
            
            await loadUserProfiles();
        } else {
            throw new Error(result?.error || `Failed to ${isEditMode ? 'update' : 'create'} user profile`);
        }
    } catch (error) {
        console.error('Error saving user profile:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save user profile: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Edit User Profile
 */
async function editUserProfile(userId) {
    console.log('editUserProfile called with userId:', userId);
    alert('Edit clicked! User ID: ' + userId); // Debug alert
    try {
        // Find user in current data
        const user = usersData.find(u => u.id === userId);
        if (!user) {
            Swal.fire({
                title: 'Error',
                text: 'User not found',
                icon: 'error'
            });
            return;
        }
        
        // Open modal (reuse add user modal)
        const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
        const form = document.getElementById('addUserForm');
        const modalTitle = document.getElementById('addUserModalLabel');
        const roleSelect = document.getElementById('userRole');
        
        // Change title
        modalTitle.textContent = 'Edit User Profile';
        
        // Populate roles dropdown
        roleSelect.innerHTML = '<option value="">Select Role...</option>';
        userRolesData.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.role_display_name;
            option.selected = role.id === user.role_id;
            roleSelect.appendChild(option);
        });
        
        // Populate form
        document.getElementById('userId').value = user.id;
        document.getElementById('userId').disabled = true; // Can't change ID
        document.getElementById('userFirstName').value = user.first_name || '';
        document.getElementById('userLastName').value = user.last_name || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userEmail').disabled = true; // Can't change email
        document.getElementById('userMobile').value = user.mobile || '';
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userIdNumber').value = user.id_number || '';
        document.getElementById('userFspNumber').value = user.fsp_number || '';
        document.getElementById('userStatus').value = user.status || 'active';
        
        // Store edit mode
        form.dataset.editMode = 'true';
        form.dataset.editUserId = userId;
        
        modal.show();
    } catch (error) {
        console.error('Error opening edit modal:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to load user: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * View User Profile
 */
async function viewUserProfile(userId) {
    console.log('viewUserProfile called with userId:', userId);
    alert('View clicked! User ID: ' + userId); // Debug alert
    try {
        const user = usersData.find(u => u.id === userId);
        if (!user) {
            Swal.fire({
                title: 'Error',
                text: 'User not found',
                icon: 'error'
            });
            return;
        }
        
        const role = userRolesData.find(r => r.id === user.role_id);
        const roleDisplayName = role ? role.role_display_name : 'No Role';
        
        Swal.fire({
            title: `${user.first_name} ${user.last_name}`,
            html: `
                <div class="text-start">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${roleDisplayName}</p>
                    <p><strong>Status:</strong> ${user.status}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                    <p><strong>Mobile:</strong> ${user.mobile || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${user.id_number || 'N/A'}</p>
                    <p><strong>FSP Number:</strong> ${user.fsp_number || 'N/A'}</p>
                    <p><strong>Last Login:</strong> ${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
                    <p><strong>Created:</strong> ${user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
                </div>
            `,
            icon: 'info',
            width: '600px'
        });
    } catch (error) {
        console.error('Error viewing user:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to load user: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Delete User Profile (Soft Delete)
 */
async function deleteUserProfile(userId, userName) {
    const result = await Swal.fire({
        title: 'Delete User Profile',
        text: `Are you sure you want to delete the user profile for "${userName}"? This will set the status to inactive.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
    });
    
    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const deleteResult = await dataFunctions.deleteUserProfile(userId);
            
            if (deleteResult && deleteResult.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User profile has been deleted (set to inactive)',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                await loadUserProfiles();
            } else {
                throw new Error(deleteResult?.error || 'Failed to delete user profile');
            }
        } catch (error) {
            console.error('Error deleting user profile:', error);
            Swal.fire({
                title: 'Error',
                text: `Failed to delete user profile: ${error.message}`,
                icon: 'error'
            });
        }
    }
}

/**
 * Reset Password
 */
async function resetPassword(userId) {
    try {
        const user = usersData.find(u => u.id === userId);
        if (!user) {
            Swal.fire({
                title: 'Error',
                text: 'User not found',
                icon: 'error'
            });
            return;
        }
        
        const result = await Swal.fire({
            title: 'Reset Password',
            html: `
                <p>Reset password for <strong>${user.first_name} ${user.last_name}</strong> (${user.email})?</p>
                <p class="text-muted small">A password reset email will be sent to the user's email address.</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Send Reset Email',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#5CBDB4'
        });
        
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Sending...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Call password reset function (if available in dataFunctions)
            // For now, show success message
            // TODO: Implement actual password reset API call when available
            setTimeout(() => {
                Swal.fire({
                    title: 'Reset Email Sent!',
                    text: `A password reset email has been sent to ${user.email}`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            }, 1000);
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to reset password: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Load Key Individuals from Database
 */
async function loadKeyIndividuals() {
    try {
        console.log('Loading key individuals...');
        const result = await dataFunctions.getKeyIndividuals('active');
        console.log('Raw result from getKeyIndividuals:', result);
        
        let kis = result;
        
        // Handle different response structures from Lambda proxy
        if (result) {
            // Check if result has data property (wrapped response)
            if (result.data && Array.isArray(result.data)) {
                kis = result.data;
            } 
            // Check if result is an array directly
            else if (Array.isArray(result)) {
                kis = result;
            }
            // Check if result has success and data
            else if (result.success && result.data && Array.isArray(result.data)) {
                kis = result.data;
            }
        }
        
        console.log('Processed key individuals array:', kis);
        
        if (kis && Array.isArray(kis) && kis.length > 0) {
            // Transform database data to match expected format
            const transformedKis = kis.map(ki => {
                const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
                return {
                    id: ki.id,
                    name: name,
                    first_name: ki.first_name,
                    surname: ki.surname,
                    id_number: ki.id_number,
                    representative_number: ki.representative_number,
                    appointment_date: ki.appointment_date,
                    ki_type: ki.ki_type,
                    supervises: ki.supervises || ki.current_supervised_count || 0,
                    current_supervised_count: ki.current_supervised_count,
                    status: ki.resignation_date ? 'inactive' : 'active',
                    type: ki.ki_type === 'principal' ? 'Principal' : 
                          ki.ki_type === 'compliance_officer' ? 'Compliance Officer' : 
                          'Key Individual'
                };
            });
            
            console.log('Transformed Key Individuals:', transformedKis);
            // Store the list for editing
            currentKeyIndividualsList = transformedKis;
            renderKeyIndividuals(transformedKis);
        } else {
            console.warn('No key individuals found. Result type:', typeof kis, 'Is array:', Array.isArray(kis), 'Length:', kis?.length, 'Full result:', kis);
            renderKeyIndividuals([]);
        }
    } catch (error) {
        console.error('Error loading key individuals:', error);
        console.error('Error stack:', error.stack);
        renderKeyIndividuals([]);
    }
}

/**
 * Load License Details from System Settings
 */
async function loadLicenseDetails() {
    try {
        // Load license issue date and categories from system_settings
        const settings = await dataFunctions.getSystemSettings();
        let settingsData = settings;
        if (settings && settings.data) {
            settingsData = settings.data;
        }
        
        if (settingsData && Array.isArray(settingsData)) {
            const issueDateSetting = settingsData.find(s => s.setting_key === 'fsp_license_issue_date');
            const categoriesSetting = settingsData.find(s => s.setting_key === 'fsp_license_categories');
            
            // Set issue date
            const issueDateField = document.getElementById('issueDate');
            if (issueDateField && issueDateSetting) {
                const dateValue = typeof issueDateSetting.setting_value === 'string' 
                    ? issueDateSetting.setting_value 
                    : issueDateSetting.setting_value?.value || issueDateSetting.setting_value;
                if (dateValue) {
                    // Convert to YYYY-MM-DD format for date input
                    const date = new Date(dateValue);
                    if (!isNaN(date.getTime())) {
                        issueDateField.value = date.toISOString().split('T')[0];
                    }
                }
            }
            
            // Set categories checkboxes
            if (categoriesSetting) {
                const categories = typeof categoriesSetting.setting_value === 'string'
                    ? JSON.parse(categoriesSetting.setting_value)
                    : categoriesSetting.setting_value;
                
                if (Array.isArray(categories)) {
                    categories.forEach(cat => {
                        const checkbox = document.getElementById(`cat${cat}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                } else if (typeof categories === 'object') {
                    // Handle object format like {cat1: true, cat2: true}
                    Object.keys(categories).forEach(key => {
                        const checkbox = document.getElementById(key);
                        if (checkbox && categories[key]) {
                            checkbox.checked = true;
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error loading license details:', error);
    }
}

/**
 * Load Compliance Thresholds from System Settings
 */
async function loadComplianceThresholds() {
    try {
        const settings = await dataFunctions.getSystemSettings();
        let settingsData = settings;
        if (settings && settings.data) {
            settingsData = settings.data;
        }
        
        if (settingsData && Array.isArray(settingsData)) {
            // CPD thresholds
            const cpdCritical = settingsData.find(s => s.setting_key === 'cpd_critical_threshold');
            const cpdWarning = settingsData.find(s => s.setting_key === 'cpd_warning_threshold');
            const cpdFirstAlert = settingsData.find(s => s.setting_key === 'cpd_first_alert_days');
            
            if (cpdCritical) {
                const value = typeof cpdCritical.setting_value === 'object' ? cpdCritical.setting_value.value : cpdCritical.setting_value;
                document.getElementById('cpdCritical').value = value || 50;
            }
            if (cpdWarning) {
                const value = typeof cpdWarning.setting_value === 'object' ? cpdWarning.setting_value.value : cpdWarning.setting_value;
                document.getElementById('cpdWarning').value = value || 70;
            }
            if (cpdFirstAlert) {
                const value = typeof cpdFirstAlert.setting_value === 'object' ? cpdFirstAlert.setting_value.value : cpdFirstAlert.setting_value;
                document.getElementById('cpdFirstAlert').value = value || 180;
            }
            
            // Fit & Proper thresholds
            const fpFirst = settingsData.find(s => s.setting_key === 'fp_first_notification_days');
            const fpFollowup = settingsData.find(s => s.setting_key === 'fp_followup_days');
            const fpUrgent = settingsData.find(s => s.setting_key === 'fp_urgent_days');
            const fpFinal = settingsData.find(s => s.setting_key === 'fp_final_days');
            
            if (fpFirst) {
                const value = typeof fpFirst.setting_value === 'object' ? fpFirst.setting_value.value : fpFirst.setting_value;
                document.getElementById('fpFirst').value = value || 90;
            }
            if (fpFollowup) {
                const value = typeof fpFollowup.setting_value === 'object' ? fpFollowup.setting_value.value : fpFollowup.setting_value;
                document.getElementById('fpFollowup').value = value || 60;
            }
            if (fpUrgent) {
                const value = typeof fpUrgent.setting_value === 'object' ? fpUrgent.setting_value.value : fpUrgent.setting_value;
                document.getElementById('fpUrgent').value = value || 30;
            }
            if (fpFinal) {
                const value = typeof fpFinal.setting_value === 'object' ? fpFinal.setting_value.value : fpFinal.setting_value;
                document.getElementById('fpFinal').value = value || 7;
            }
        }
    } catch (error) {
        console.error('Error loading compliance thresholds:', error);
    }
}

function renderKeyIndividuals(kis = null) {
    const container = document.getElementById('keyIndividualsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Use provided data or fallback to dummy data
    const dataToRender = kis || keyIndividualsData;
    
    if (!dataToRender || dataToRender.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-3">No key individuals found</div>';
        return;
    }
    
    // Store the list for editing
    currentKeyIndividualsList = dataToRender;
    
    dataToRender.forEach(ki => {
        const div = document.createElement('div');
        div.className = 'key-individual-item';
        
        if (ki.type === 'Principal' || ki.ki_type === 'principal') {
            const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            const idNumber = ki.id_number || ki.idNumber || 'N/A';
            const fspNumber = ki.fsp_number || ki.fspNumber || ki.representative_number || 'N/A';
            const appointed = ki.appointed || (ki.appointment_date ? new Date(ki.appointment_date).toLocaleDateString('en-ZA') : 'N/A');
            
            div.innerHTML = `
                <h6>Principal / FSP Owner</h6>
                <div class="info-item"><strong>Name:</strong> ${name}</div>
                <div class="info-item"><strong>ID Number:</strong> ${idNumber}</div>
                <div class="info-item"><strong>FSP Number:</strong> ${fspNumber}</div>
                <div class="info-item"><strong>Appointed:</strong> ${appointed}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="editKeyIndividual('${ki.id}')">
                    <i class="fas fa-edit me-1"></i> Edit Details
                </button>
            `;
        } else if (ki.type === 'Key Individual' || ki.ki_type === 'key_individual') {
            const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            const supervises = ki.supervises || ki.current_supervised_count || 0;
            const fspNumber = ki.fsp_number || ki.fspNumber || 'N/A';
            const appointed = ki.appointed || (ki.appointment_date ? new Date(ki.appointment_date).toLocaleDateString('en-ZA') : 'N/A');
            
            div.innerHTML = `
                <h6>${name}</h6>
                <div class="info-item"><strong>FSP Number:</strong> ${fspNumber}</div>
                <div class="info-item"><strong>Supervises:</strong> ${supervises} representatives</div>
                <div class="info-item"><strong>Appointed:</strong> ${appointed}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editKeyIndividual('${ki.id}')">
                        <i class="fas fa-edit me-1"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="viewTeam('${ki.id}')">
                        <i class="fas fa-users me-1"></i> View Team
                    </button>
                </div>
            `;
        } else if (ki.type === 'Compliance Officer' || ki.ki_type === 'compliance_officer') {
            const name = ki.name || (ki.first_name && ki.surname ? `${ki.first_name} ${ki.surname}` : 'Unknown');
            const fspNumber = ki.fsp_number || ki.fspNumber || ki.representative_number || 'N/A';
            const appointed = ki.appointed || (ki.appointment_date ? new Date(ki.appointment_date).toLocaleDateString('en-ZA') : 'N/A');
            const qualification = ki.qualification || 'N/A';
            
            div.innerHTML = `
                <h6>Compliance Officer (Section 17)</h6>
                <div class="info-item"><strong>Name:</strong> ${name}</div>
                <div class="info-item"><strong>FSP Number:</strong> ${fspNumber}</div>
                <div class="info-item"><strong>Appointed:</strong> ${appointed}</div>
                <div class="info-item"><strong>Qualification:</strong> ${qualification}</div>
                <div class="info-item"><strong>Experience:</strong> ${ki.experience || 'N/A'}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="editKeyIndividual('${ki.id}')">
                    <i class="fas fa-edit me-1"></i> Edit Details
                </button>
            `;
        }
        
        container.appendChild(div);
    });
    
    // Add button
    const addBtn = document.createElement('div');
    addBtn.className = 'mt-3';
    addBtn.innerHTML = `
        <button class="btn btn-primary" onclick="addKeyIndividual()">
            <i class="fas fa-plus me-1"></i> Add Key Individual
        </button>
    `;
    container.appendChild(addBtn);
}

function renderIntegrations() {
    const container = document.getElementById('integrationsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    integrationsData.forEach(integration => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const statusClass = integration.status === 'connected' ? 'connected' : 'not-connected';
        const statusBadge = integration.status === 'connected' ?
            '<span class="integration-status connected">✅ Connected</span>' :
            '<span class="integration-status not-connected">⚠️ Not Connected</span>';
        
        let featuresHtml = '<ul class="list-unstyled mt-2">';
        integration.features.forEach(feature => {
            featuresHtml += `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`;
        });
        featuresHtml += '</ul>';
        
        col.innerHTML = `
            <div class="integration-card ${statusClass}">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5><i class="${integration.icon} me-2"></i>${integration.name}</h5>
                        ${statusBadge}
                    </div>
                </div>
                <div class="mb-3">
                    <strong>Provider:</strong> ${integration.provider}<br>
                    ${integration.account ? `<strong>Account:</strong> ${integration.account}<br>` : ''}
                    ${integration.lastSync ? `<strong>Last Sync:</strong> ${integration.lastSync}` : ''}
                </div>
                <div class="mb-3">
                    <strong>Features:</strong>
                    ${featuresHtml}
                </div>
                <div class="d-flex gap-2">
                    ${integration.status === 'connected' ? `
                        <button class="btn btn-sm btn-outline-primary" onclick="configureIntegration(${integration.id})">
                            <i class="fas fa-cog me-1"></i> Configure
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="testIntegration(${integration.id})">
                            <i class="fas fa-vial me-1"></i> Test Connection
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="disconnectIntegration(${integration.id})">
                            <i class="fas fa-unlink me-1"></i> Disconnect
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-primary" onclick="connectIntegration(${integration.id})">
                            <i class="fas fa-plug me-1"></i> Connect
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="learnMore(${integration.id})">
                            <i class="fas fa-info-circle me-1"></i> Learn More
                        </button>
                    `}
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function renderAuditLogs() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    auditLogsData.forEach(log => {
        const tr = document.createElement('tr');
        tr.className = 'audit-log-row';
        tr.onclick = () => viewAuditLogDetail(log.id);
        
        const statusBadge = log.status === 'success' ?
            '<span class="audit-status success">✅ Success</span>' :
            '<span class="audit-status failed">❌ Failed</span>';
        
        tr.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${log.user}<br><small class="text-muted">${log.userRole}</small></td>
            <td>${log.action}</td>
            <td>${log.module}</td>
            <td>${log.details}</td>
            <td>${log.ipAddress}<br><small class="text-muted">${log.location}</small></td>
            <td>${statusBadge}</td>
            <td>
                <button class="action-btn" onclick="event.stopPropagation(); viewAuditLogDetail(${log.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderBackups() {
    const tbody = document.getElementById('backupsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    backupsData.forEach(backup => {
        const tr = document.createElement('tr');
        const statusBadge = backup.status === 'success' ?
            '<span class="backup-status success">✅ Success</span>' :
            '<span class="backup-status failed">❌ Failed</span>';
        
        tr.innerHTML = `
            <td>${backup.date}</td>
            <td>${backup.size}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="downloadBackup('${backup.date}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn" onclick="restoreBackup('${backup.date}')" title="Restore">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setupEventListeners() {
    // Add User Button
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        openAddUserModal();
    });
    
    // Add User Form
    document.getElementById('addUserForm')?.addEventListener('submit', handleAddUserProfile);
    
    // System Settings
    document.getElementById('addSystemSettingBtn')?.addEventListener('click', () => {
        openSystemSettingModal();
    });
    document.getElementById('systemSettingForm')?.addEventListener('submit', handleSystemSettingSubmit);
    document.getElementById('applySettingsFilters')?.addEventListener('click', applySettingsFilters);
    
    // User Roles
    document.getElementById('addRoleBtn')?.addEventListener('click', () => {
        openUserRoleModal();
    });
    document.getElementById('userRoleForm')?.addEventListener('submit', handleUserRoleSubmit);
    
    // Test Email Button
    document.getElementById('testEmailBtn')?.addEventListener('click', testEmail);
    
    // Backup Now Button
    document.getElementById('backupNowBtn')?.addEventListener('click', backupNow);
    
    // Export Audit Logs
    document.getElementById('exportAuditLogsBtn')?.addEventListener('click', exportAuditLogs);
    
    // Apply Filters
    document.getElementById('applyUserFilters')?.addEventListener('click', applyUserFilters);
    document.getElementById('applyAuditFilters')?.addEventListener('click', applyAuditFilters);
    document.getElementById('clearAuditFilters')?.addEventListener('click', clearAuditFilters);
    
    // User search - apply filters on Enter key
    document.getElementById('userSearch')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyUserFilters();
        }
    });
    
    // Auto-apply filters when dropdowns change
    document.getElementById('roleFilter')?.addEventListener('change', applyUserFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyUserFilters);
    document.getElementById('sortUsers')?.addEventListener('change', applyUserFilters);
    
    // Form Submissions
    document.getElementById('fspInfoForm')?.addEventListener('submit', saveFSPConfiguration);
    document.getElementById('localizationForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('businessHoursForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('complianceCycleForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('licenseForm')?.addEventListener('submit', saveLicenseForm);
    document.getElementById('thresholdsForm')?.addEventListener('submit', saveThresholdsForm);
    
    // Load key individuals when FSP Configuration tab is shown
    document.getElementById('fsp-tab')?.addEventListener('shown.bs.tab', function() {
        loadKeyIndividuals();
    });
    document.getElementById('emailSettingsForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('escalationForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('passwordPolicyForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('twoFactorForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('sessionForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('backupForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('retentionForm')?.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    Swal.fire({
        title: 'Settings Saved',
        text: 'Your changes have been saved successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

/**
 * Save License Form
 */
async function saveLicenseForm(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = {
            issue_date: document.getElementById('issueDate')?.value || null,
            categories: []
        };
        
        // Get selected categories
        const cat1 = document.getElementById('cat1');
        const cat2 = document.getElementById('cat2');
        const cat3 = document.getElementById('cat3');
        
        if (cat1?.checked) formData.categories.push('Category I - Long-term Insurance');
        if (cat2?.checked) formData.categories.push('Category II - Short-term Insurance');
        if (cat3?.checked) formData.categories.push('Category III - Retail Pension Benefits');
        
        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your license information',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Save to system settings (or you can create a dedicated license table later)
        // For now, save as system settings
        const licenseSettings = {
            'license.issue_date': formData.issue_date,
            'license.categories': JSON.stringify(formData.categories)
        };
        
        // Save each setting
        if (typeof dataFunctions !== 'undefined' && dataFunctions.createSystemSetting) {
            for (const [key, value] of Object.entries(licenseSettings)) {
                if (value) {
                    try {
                        await dataFunctions.createSystemSetting({
                            setting_key: key,
                            setting_value: value,
                            setting_type: typeof value === 'string' && value.startsWith('[') ? 'json' : 'string',
                            setting_category: 'license'
                        });
                    } catch (err) {
                        // Setting might already exist, try to update
                        console.warn(`Setting ${key} might already exist:`, err);
                    }
                }
            }
        }
        
        Swal.fire({
            title: 'Success',
            text: 'License information saved successfully',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Error saving license form:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to save license information. Please try again.',
            icon: 'error'
        });
    }
}

/**
 * Save Thresholds Form
 */
async function saveThresholdsForm(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = {
            cpd_critical: document.getElementById('cpdCritical')?.value || null,
            cpd_warning: document.getElementById('cpdWarning')?.value || null,
            cpd_first_alert: document.getElementById('cpdFirstAlert')?.value || null,
            fp_first: document.getElementById('fpFirst')?.value || null,
            fp_followup: document.getElementById('fpFollowup')?.value || null,
            fp_urgent: document.getElementById('fpUrgent')?.value || null,
            fp_final: document.getElementById('fpFinal')?.value || null
        };
        
        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your threshold settings',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Save to system settings
        if (typeof dataFunctions !== 'undefined' && dataFunctions.createSystemSetting) {
            for (const [key, value] of Object.entries(formData)) {
                if (value !== null && value !== '') {
                    try {
                        await dataFunctions.createSystemSetting({
                            setting_key: `thresholds.${key}`,
                            setting_value: value,
                            setting_type: 'number',
                            setting_category: 'compliance'
                        });
                    } catch (err) {
                        console.warn(`Setting thresholds.${key} might already exist:`, err);
                    }
                }
            }
        }
        
        Swal.fire({
            title: 'Success',
            text: 'Threshold settings saved successfully',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Error saving thresholds form:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to save threshold settings. Please try again.',
            icon: 'error'
        });
    }
}

// handleAddUser is now handleAddUserProfile (defined in user profile management section)

function testEmail() {
    Swal.fire({
        title: 'Test Email Sent',
        text: 'A test email has been sent to your configured email address',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
}

function backupNow() {
    Swal.fire({
        title: 'Backup Started',
        text: 'System backup is in progress. You will be notified when complete.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
}

function exportAuditLogs() {
    Swal.fire({
        title: 'Export Started',
        text: 'Audit logs are being exported. Download will begin shortly.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
}

/**
 * Apply User Filters and Search
 */
function applyUserFilters() {
    const searchTerm = (document.getElementById('userSearch')?.value || '').toLowerCase().trim();
    const roleFilter = document.getElementById('roleFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const sortOption = document.getElementById('sortUsers')?.value || 'name-asc';
    
    // Filter users
    let filtered = [...usersData];
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(user => {
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
            const email = (user.email || '').toLowerCase();
            return fullName.includes(searchTerm) || email.includes(searchTerm);
        });
    }
    
    // Role filter
    if (roleFilter !== 'all') {
        // Filter by role ID (if it's a UUID) or role name
        filtered = filtered.filter(user => {
            if (!user.role_id) return false;
            // Check if roleFilter is a UUID (role ID) or a role name
            const role = userRolesData.find(r => r.id === user.role_id);
            if (!role) return false;
            // Match by role ID (UUID) or role name
            return role.id === roleFilter || 
                   role.role_name === roleFilter || 
                   role.role_display_name === roleFilter;
        });
    }
    
    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
        switch (sortOption) {
            case 'name-asc':
                const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
                const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
                return nameA.localeCompare(nameB);
            case 'name-desc':
                const nameA2 = `${a.first_name || ''} ${a.last_name || ''}`.trim();
                const nameB2 = `${b.first_name || ''} ${b.last_name || ''}`.trim();
                return nameB2.localeCompare(nameA2);
            case 'date-asc':
                return new Date(a.created_at || 0) - new Date(b.created_at || 0);
            case 'date-desc':
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            default:
                return 0;
        }
    });
    
    // Render filtered results
    renderFilteredUsersTable(filtered);
}

function applyAuditFilters() {
    Swal.fire({
        title: 'Filters Applied',
        text: 'Audit logs have been filtered',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function clearAuditFilters() {
    document.getElementById('auditDateRange').value = '30';
    document.getElementById('auditUser').value = 'all';
    document.getElementById('auditAction').value = 'all';
    document.getElementById('auditModule').value = 'all';
    applyAuditFilters();
}

function viewAuditLogDetail(logId) {
    const log = auditLogsData.find(l => l.id === logId);
    if (!log) return;
    
    const modal = new bootstrap.Modal(document.getElementById('auditLogDetailModal'));
    const content = document.getElementById('auditLogDetailContent');
    
    content.innerHTML = `
        <div class="mb-3">
            <strong>Timestamp:</strong> ${log.timestamp}<br>
            <strong>User:</strong> ${log.user} (${log.userRole})<br>
            <strong>Action:</strong> ${log.actionCode}<br>
            <strong>Module:</strong> ${log.module}<br>
            <strong>Status:</strong> <span class="audit-status ${log.status}">${log.status === 'success' ? '✅ Success' : '❌ Failed'}</span>
        </div>
        <hr>
        <div class="mb-3">
            <h6>Session Information</h6>
            <strong>IP Address:</strong> ${log.ipAddress}<br>
            <strong>Location:</strong> ${log.location}, South Africa
        </div>
        <hr>
        <div class="mb-3">
            <h6>Action Details</h6>
            ${log.details}
        </div>
    `;
    
    modal.show();
}

// User Management Functions are now defined in the user profile management section above

// Key Individual Functions
let currentKeyIndividualsList = []; // Store current list for editing

/**
 * Edit Key Individual - Opens modal with current data
 */
function editKeyIndividual(kiIdOrName) {
    // Find the key individual in the current list
    const ki = currentKeyIndividualsList.find(k => k.id === kiIdOrName || k.name === kiIdOrName);
    
    if (!ki) {
        Swal.fire({
            title: 'Error',
            text: 'Key Individual not found',
            icon: 'error'
        });
        return;
    }
    
    // Populate modal with current data
    document.getElementById('editKiId').value = ki.id || '';
    document.getElementById('editKiRepresentativeId').value = ki.representative_id || '';
    document.getElementById('editKiName').value = ki.name || '';
    document.getElementById('editKiType').value = ki.type || ki.ki_type || '';
    document.getElementById('editKiIdNumber').value = ki.id_number || '';
    document.getElementById('editKiRepNumber').value = ki.representative_number || '';
    
    // Format appointment date for input
    if (ki.appointment_date) {
        const appointmentDate = new Date(ki.appointment_date);
        if (!isNaN(appointmentDate.getTime())) {
            document.getElementById('editKiAppointmentDate').value = appointmentDate.toISOString().split('T')[0];
        }
    }
    
    // Format resignation date if exists
    if (ki.resignation_date) {
        const resignationDate = new Date(ki.resignation_date);
        if (!isNaN(resignationDate.getTime())) {
            document.getElementById('editKiResignationDate').value = resignationDate.toISOString().split('T')[0];
        } else {
            document.getElementById('editKiResignationDate').value = '';
        }
    } else {
        document.getElementById('editKiResignationDate').value = '';
    }
    
    document.getElementById('editKiMaxSupervised').value = ki.max_supervised_count || ki.max_supervises || 0;
    document.getElementById('editKiCurrentSupervised').value = ki.current_supervised_count || ki.supervises || 0;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editKeyIndividualModal'));
    modal.show();
}

/**
 * Save Key Individual Changes
 */
async function saveKeyIndividual() {
    try {
        const form = document.getElementById('editKeyIndividualForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const kiId = document.getElementById('editKiId').value;
        if (!kiId) {
            Swal.fire({
                title: 'Error',
                text: 'Key Individual ID is missing',
                icon: 'error'
            });
            return;
        }
        
        const appointmentDate = document.getElementById('editKiAppointmentDate').value;
        const resignationDate = document.getElementById('editKiResignationDate').value || null;
        const maxSupervised = parseInt(document.getElementById('editKiMaxSupervised').value) || 0;
        
        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your changes',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Update key individual
        const updateData = {
            appointment_date: appointmentDate,
            resignation_date: resignationDate,
            max_supervised_count: maxSupervised
        };
        
        const result = await dataFunctions.updateKeyIndividual(kiId, updateData);
        
        // Reload key individuals list
        await loadKeyIndividuals();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editKeyIndividualModal'));
        if (modal) {
            modal.hide();
        }
        
        Swal.fire({
            title: 'Success!',
            text: 'Key Individual updated successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Error saving key individual:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save changes: ${error.message}`,
            icon: 'error'
        });
    }
}

function viewTeam(name) {
    Swal.fire({
        title: 'View Team',
        text: `Team supervised by ${name} would be shown here`,
        icon: 'info'
    });
}

function addKeyIndividual() {
    Swal.fire({
        title: 'Add Key Individual',
        text: 'Add Key Individual form would be shown here',
        icon: 'info'
    });
}

// Integration Functions
function connectIntegration(id) {
    Swal.fire({
        title: 'Connect Integration',
        text: `Connection setup for integration ${id} would be shown here`,
        icon: 'info'
    });
}

function configureIntegration(id) {
    Swal.fire({
        title: 'Configure Integration',
        text: `Configuration for integration ${id} would be shown here`,
        icon: 'info'
    });
}

function testIntegration(id) {
    Swal.fire({
        title: 'Test Connection',
        text: `Testing connection for integration ${id}...`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        Swal.fire('Connection Test', 'Connection successful!', 'success');
    });
}

function disconnectIntegration(id) {
    Swal.fire({
        title: 'Disconnect Integration',
        text: 'Are you sure you want to disconnect this integration?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, disconnect',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Disconnected', 'Integration has been disconnected', 'success');
            renderIntegrations();
        }
    });
}

function learnMore(id) {
    Swal.fire({
        title: 'Integration Information',
        text: `More information about integration ${id} would be shown here`,
        icon: 'info'
    });
}

// Backup Functions
function downloadBackup(date) {
    Swal.fire({
        title: 'Download Backup',
        text: `Downloading backup from ${date}...`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
}

function restoreBackup(date) {
    Swal.fire({
        title: 'Restore Backup',
        text: `Are you sure you want to restore from backup ${date}? This will overwrite current data.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restore',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Restore Started', 'Backup restoration is in progress', 'info');
        }
    });
}

// ============================================================================
// SYSTEM SETTINGS FUNCTIONS
// ============================================================================

let systemSettingsData = [];
let filteredSystemSettings = [];

/**
 * Load System Settings from Database
 */
async function loadSystemSettings() {
    try {
        const tbody = document.getElementById('systemSettingsTableBody');
        if (!tbody) return;
        
        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `;
        
        // Get all system settings
        const result = await dataFunctions.getSystemSettings();
        
        // Handle different response formats from Lambda proxy
        // The function returns a TABLE, so Lambda should return an array
        if (result) {
            // Check if result is an array directly (most likely)
            if (Array.isArray(result)) {
                systemSettingsData = result;
            } 
            // Check if result has data property (wrapped response)
            else if (result.data && Array.isArray(result.data)) {
                systemSettingsData = result.data;
            }
            // Check if result has success and data
            else if (result.success && result.data && Array.isArray(result.data)) {
                systemSettingsData = result.data;
            }
            // Check if result is a single object (shouldn't happen but handle it)
            else if (result.id) {
                systemSettingsData = [result];
            }
            else {
                console.warn('Unexpected response format:', result);
                systemSettingsData = [];
            }
        } else {
            systemSettingsData = [];
        }
        
        filteredSystemSettings = systemSettingsData;
        renderSystemSettingsTable();
    } catch (error) {
        console.error('Error loading system settings:', error);
        const tbody = document.getElementById('systemSettingsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error loading settings: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Render System Settings Table
 */
function renderSystemSettingsTable() {
    const tbody = document.getElementById('systemSettingsTableBody');
    if (!tbody) return;
    
    if (filteredSystemSettings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No system settings found. Click "Add New Setting" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    filteredSystemSettings.forEach(setting => {
        const tr = document.createElement('tr');
        
        // Format value based on type
        let valueDisplay = '';
        if (setting.setting_type === 'json') {
            valueDisplay = `<code>${JSON.stringify(setting.setting_value, null, 2)}</code>`;
        } else if (setting.setting_type === 'boolean') {
            valueDisplay = setting.setting_value ? '<span class="badge bg-success">true</span>' : '<span class="badge bg-secondary">false</span>';
        } else {
            valueDisplay = String(setting.setting_value);
        }
        
        tr.innerHTML = `
            <td><code>${setting.setting_key}</code></td>
            <td>${valueDisplay}</td>
            <td><span class="badge bg-info">${setting.setting_type}</span></td>
            <td><span class="badge bg-secondary">${setting.category || 'N/A'}</span></td>
            <td>${setting.description || '<span class="text-muted">No description</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editSystemSetting('${setting.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn text-danger" onclick="deleteSystemSetting('${setting.id}', '${setting.setting_key}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Open System Setting Modal (for add or edit)
 */
function openSystemSettingModal(settingId = null) {
    const modal = new bootstrap.Modal(document.getElementById('systemSettingModal'));
    const form = document.getElementById('systemSettingForm');
    const modalTitle = document.getElementById('systemSettingModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('settingId').value = settingId || '';
    
    if (settingId) {
        // Edit mode
        modalTitle.textContent = 'Edit System Setting';
        const setting = systemSettingsData.find(s => s.id === settingId);
        if (setting) {
            document.getElementById('settingKey').value = setting.setting_key;
            document.getElementById('settingKey').disabled = true; // Can't change key
            document.getElementById('settingType').value = setting.setting_type;
            document.getElementById('settingType').disabled = true; // Can't change type
            document.getElementById('settingCategory').value = setting.category || 'general';
            document.getElementById('settingCategory').disabled = true; // Can't change category
            
            // Format value based on type
            if (setting.setting_type === 'json') {
                document.getElementById('settingValue').value = JSON.stringify(setting.setting_value, null, 2);
            } else {
                document.getElementById('settingValue').value = String(setting.setting_value);
            }
            
            document.getElementById('settingDescription').value = setting.description || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add System Setting';
        document.getElementById('settingKey').disabled = false;
        document.getElementById('settingType').disabled = false;
        document.getElementById('settingCategory').disabled = false;
    }
    
    modal.show();
}

/**
 * Handle System Setting Form Submit
 */
async function handleSystemSettingSubmit(e) {
    e.preventDefault();
    
    try {
        const settingId = document.getElementById('settingId').value;
        const settingKey = document.getElementById('settingKey').value.trim();
        const settingType = document.getElementById('settingType').value;
        const settingCategory = document.getElementById('settingCategory').value;
        const settingValue = document.getElementById('settingValue').value.trim();
        const description = document.getElementById('settingDescription').value.trim();
        
        // Validate and parse value based on type
        let parsedValue;
        try {
            if (settingType === 'json') {
                parsedValue = JSON.parse(settingValue);
            } else if (settingType === 'number') {
                parsedValue = parseFloat(settingValue);
                if (isNaN(parsedValue)) {
                    throw new Error('Invalid number format');
                }
            } else if (settingType === 'boolean') {
                parsedValue = settingValue.toLowerCase() === 'true';
            } else {
                parsedValue = settingValue;
            }
        } catch (parseError) {
            Swal.fire({
                title: 'Validation Error',
                text: `Invalid ${settingType} value: ${parseError.message}`,
                icon: 'error'
            });
            return;
        }
        
        Swal.fire({
            title: settingId ? 'Updating...' : 'Creating...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        let result;
        if (settingId) {
            // Update existing
            result = await dataFunctions.updateSystemSetting(settingId, {
                setting_value: parsedValue,
                description: description || null
            });
        } else {
            // Create new
            result = await dataFunctions.createSystemSetting({
                setting_key: settingKey,
                setting_value: parsedValue,
                setting_type: settingType,
                setting_category: settingCategory, // Maps to p_category in function
                description: description || null
            });
        }
        
        if (result && result.success) {
            Swal.fire({
                title: 'Success!',
                text: settingId ? 'Setting updated successfully' : 'Setting created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Close modal and reload
            bootstrap.Modal.getInstance(document.getElementById('systemSettingModal')).hide();
            await loadSystemSettings();
        } else {
            throw new Error(result?.error || 'Failed to save setting');
        }
    } catch (error) {
        console.error('Error saving system setting:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save setting: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Edit System Setting
 */
function editSystemSetting(settingId) {
    openSystemSettingModal(settingId);
}

/**
 * Delete System Setting
 */
async function deleteSystemSetting(settingId, settingKey) {
    const result = await Swal.fire({
        title: 'Delete Setting',
        text: `Are you sure you want to delete the setting "${settingKey}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
    });
    
    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const deleteResult = await dataFunctions.deleteSystemSetting(settingId);
            
            if (deleteResult && deleteResult.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Setting has been deleted successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                await loadSystemSettings();
            } else {
                throw new Error(deleteResult?.error || 'Failed to delete setting');
            }
        } catch (error) {
            console.error('Error deleting system setting:', error);
            Swal.fire({
                title: 'Error',
                text: `Failed to delete setting: ${error.message}`,
                icon: 'error'
            });
        }
    }
}

/**
 * Apply Settings Filters
 */
function applySettingsFilters() {
    const categoryFilter = document.getElementById('settingsCategoryFilter')?.value || '';
    const searchTerm = document.getElementById('settingsSearch')?.value.toLowerCase() || '';
    
    filteredSystemSettings = systemSettingsData.filter(setting => {
        const matchesCategory = !categoryFilter || setting.category === categoryFilter;
        const matchesSearch = !searchTerm || 
            setting.setting_key.toLowerCase().includes(searchTerm) ||
            (setting.description && setting.description.toLowerCase().includes(searchTerm));
        
        return matchesCategory && matchesSearch;
    });
    
    renderSystemSettingsTable();
}

/**
 * Toggle User Status (Activate/Deactivate)
 */
async function toggleUserStatus(userId, newStatus, userName) {
    try {
        const action = newStatus === 'active' ? 'activate' : 'deactivate';
        const result = await Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            html: `Are you sure you want to ${action} <strong>${userName}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            cancelButtonText: 'Cancel',
            confirmButtonColor: newStatus === 'active' ? '#28a745' : '#ffc107'
        });
        
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Updating...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const updateResult = await dataFunctions.updateUserProfile(userId, {
                status: newStatus
            });
            
            if (updateResult && updateResult.success) {
                Swal.fire({
                    title: 'Success!',
                    text: `User has been ${action}d successfully`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                await loadUserProfiles();
            } else {
                throw new Error(updateResult?.error || `Failed to ${action} user`);
            }
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to update user status: ${error.message}`,
            icon: 'error'
        });
    }
}

// Make functions globally accessible
window.loadFSPConfiguration = loadFSPConfiguration;
window.editUserProfile = editUserProfile;
window.resetPassword = resetPassword;
window.viewUserProfile = viewUserProfile;
window.deleteUserProfile = deleteUserProfile;
window.openAddUserModal = openAddUserModal;
window.toggleUserStatus = toggleUserStatus;
window.editKeyIndividual = editKeyIndividual;
window.viewTeam = viewTeam;
window.saveKeyIndividual = saveKeyIndividual;
window.addKeyIndividual = addKeyIndividual;
window.connectIntegration = connectIntegration;
window.configureIntegration = configureIntegration;
window.testIntegration = testIntegration;
window.disconnectIntegration = disconnectIntegration;
window.learnMore = learnMore;
window.downloadBackup = downloadBackup;
window.restoreBackup = restoreBackup;
window.viewAuditLogDetail = viewAuditLogDetail;
window.editSystemSetting = editSystemSetting;
window.deleteSystemSetting = deleteSystemSetting;
window.loadSystemSettings = loadSystemSettings;

// ============================================================================
// USER ROLES MANAGEMENT FUNCTIONS
// ============================================================================

// Note: userRolesData is already declared at the top of the file (line 11)

/**
 * Load User Roles from Database
 */
async function loadUserRoles() {
    try {
        const tbody = document.getElementById('userRolesTableBody');
        if (!tbody) return;
        
        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `;
        
        // Get all user roles
        const result = await dataFunctions.getUserRoles();
        
        // Handle different response formats
        if (result) {
            if (Array.isArray(result)) {
                userRolesData = result;
            } else if (result.data && Array.isArray(result.data)) {
                userRolesData = result.data;
            } else if (result.success && result.data && Array.isArray(result.data)) {
                userRolesData = result.data;
            } else if (result.id) {
                userRolesData = [result];
            } else {
                console.warn('Unexpected response format:', result);
                userRolesData = [];
            }
        } else {
            userRolesData = [];
        }
        
        renderUserRolesTable();
    } catch (error) {
        console.error('Error loading user roles:', error);
        const tbody = document.getElementById('userRolesTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error loading roles: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Render User Roles Table
 */
function renderUserRolesTable() {
    const tbody = document.getElementById('userRolesTableBody');
    if (!tbody) return;
    
    if (userRolesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No user roles found. Click "Add New Role" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    userRolesData.forEach(role => {
        const tr = document.createElement('tr');
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        const safeRoleId = escapeHtml(role.id);
        const safeRoleName = escapeHtml(role.role_name);
        
        // Format permissions
        let permissionsDisplay = '';
        try {
            const perms = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
            if (perms.all === true) {
                permissionsDisplay = '<span class="badge bg-success">Full Access</span>';
            } else {
                const actions = perms.actions || [];
                const modules = perms.modules || [];
                permissionsDisplay = `
                    <div>
                        <strong>Actions:</strong> ${actions.length > 0 ? actions.join(', ') : 'None'}<br>
                        <strong>Modules:</strong> ${modules.length > 0 ? (modules.includes('*') ? 'All' : modules.join(', ')) : 'None'}
                    </div>
                `;
            }
        } catch (e) {
            permissionsDisplay = '<span class="text-muted">Invalid JSON</span>';
        }
        
        tr.innerHTML = `
            <td><code>${escapeHtml(role.role_name)}</code></td>
            <td><strong>${escapeHtml(role.role_display_name || '')}</strong></td>
            <td>${escapeHtml(role.role_description || '') || '<span class="text-muted">No description</span>'}</td>
            <td>${permissionsDisplay}</td>
            <td>${role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group" aria-label="Role actions">
                    <button 
                        type="button"
                        class="btn btn-outline-primary" 
                        onclick="editUserRole('${safeRoleId}')"
                        title="Edit role">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        type="button"
                        class="btn btn-outline-danger" 
                        onclick="deleteUserRole('${safeRoleId}', '${safeRoleName}')"
                        title="Delete role permanently">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Initialize Bootstrap tooltips for role action buttons
    initializeRoleActionTooltips();
    
    // Setup event delegation for role action buttons
    setupRoleActionButtons();
}

/**
 * Initialize Bootstrap tooltips for role action buttons
 */
function initializeRoleActionTooltips() {
    // Check if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        // Destroy existing tooltips first to avoid duplicates
        const existingTooltips = document.querySelectorAll('#userRolesTableBody [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(element => {
            const tooltipInstance = bootstrap.Tooltip.getInstance(element);
            if (tooltipInstance) {
                tooltipInstance.dispose();
            }
        });
        
        // Initialize new tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#userRolesTableBody [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Setup Role Action Button Event Delegation
 */
function setupRoleActionButtons() {
    const tbody = document.getElementById('userRolesTableBody');
    if (!tbody) {
        console.error('userRolesTableBody not found');
        return;
    }
    
    console.log('Setting up role action buttons - direct binding');
    
    // Directly bind to each button
    const buttons = tbody.querySelectorAll('.role-action-btn');
    console.log('Found', buttons.length, 'role action buttons');
    
    buttons.forEach(button => {
        // Remove any existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = this.dataset.action;
            const roleId = this.dataset.roleId;
            const roleName = this.dataset.roleName;
            
            console.log('Role action button clicked:', action, 'roleId:', roleId);
            
            handleRoleAction(action, roleId, roleName);
        });
    });
}

/**
 * Handle Role Action
 */
function handleRoleAction(action, roleId, roleName) {
    console.log('handleRoleAction:', action, roleId);
    
    switch (action) {
        case 'edit':
            editUserRole(roleId);
            break;
        case 'delete':
            deleteUserRole(roleId, roleName);
            break;
        default:
            console.warn('Unknown role action:', action);
    }
}

// Legacy function kept for compatibility
function handleRoleActionClick(e) {
    let button = e.target;
    
    // If clicked on icon, find parent button
    if (button.tagName === 'I') {
        button = button.parentElement;
    }
    
    if (!button || !button.classList.contains('role-action-btn')) {
        button = e.target.closest('.role-action-btn');
    }
    
    if (!button) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = button.dataset.action;
    const roleId = button.dataset.roleId;
    const roleName = button.dataset.roleName;
    
    console.log('handleRoleActionClick:', action, roleId);
    
    handleRoleAction(action, roleId, roleName);
}

/**
 * Open User Role Modal (for add or edit)
 */
function openUserRoleModal(roleId = null) {
    const modal = new bootstrap.Modal(document.getElementById('userRoleModal'));
    const form = document.getElementById('userRoleForm');
    const modalTitle = document.getElementById('userRoleModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('roleId').value = roleId || '';
    
    if (roleId) {
        // Edit mode
        modalTitle.textContent = 'Edit User Role';
        const role = userRolesData.find(r => r.id === roleId);
        if (role) {
            document.getElementById('roleName').value = role.role_name;
            document.getElementById('roleName').disabled = true; // Can't change role name
            document.getElementById('roleDisplayName').value = role.role_display_name;
            document.getElementById('roleDescription').value = role.role_description || '';
            
            // Format permissions JSON
            let permissionsJson = '';
            try {
                const perms = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
                permissionsJson = JSON.stringify(perms, null, 2);
            } catch (e) {
                permissionsJson = JSON.stringify(role.permissions || {}, null, 2);
            }
            document.getElementById('rolePermissions').value = permissionsJson;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add User Role';
        document.getElementById('roleName').disabled = false;
        document.getElementById('rolePermissions').value = JSON.stringify({
            all: false,
            actions: ['view'],
            modules: []
        }, null, 2);
    }
    
    modal.show();
}

/**
 * Handle User Role Form Submit
 */
async function handleUserRoleSubmit(e) {
    e.preventDefault();
    
    try {
        const roleId = document.getElementById('roleId').value;
        const roleName = document.getElementById('roleName').value.trim().toLowerCase();
        const roleDisplayName = document.getElementById('roleDisplayName').value.trim();
        const roleDescription = document.getElementById('roleDescription').value.trim();
        const rolePermissionsText = document.getElementById('rolePermissions').value.trim();
        
        // Validate role name format
        if (!/^[a-z0-9_]+$/.test(roleName)) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Role name must be lowercase letters, numbers, and underscores only',
                icon: 'error'
            });
            return;
        }
        
        // Validate and parse permissions JSON
        let permissions;
        try {
            permissions = JSON.parse(rolePermissionsText);
            // Validate structure
            if (typeof permissions !== 'object' || Array.isArray(permissions)) {
                throw new Error('Permissions must be a JSON object');
            }
        } catch (parseError) {
            Swal.fire({
                title: 'Validation Error',
                text: `Invalid JSON format: ${parseError.message}`,
                icon: 'error'
            });
            return;
        }
        
        Swal.fire({
            title: roleId ? 'Updating...' : 'Creating...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        let result;
        if (roleId) {
            // Update existing
            result = await dataFunctions.updateUserRole(roleId, {
                role_display_name: roleDisplayName,
                role_description: roleDescription || null,
                permissions: permissions
            });
        } else {
            // Create new
            result = await dataFunctions.createUserRole({
                role_name: roleName,
                role_display_name: roleDisplayName,
                role_description: roleDescription || null,
                permissions: permissions
            });
        }
        
        if (result && result.success) {
            Swal.fire({
                title: 'Success!',
                text: roleId ? 'Role updated successfully' : 'Role created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Close modal and reload
            bootstrap.Modal.getInstance(document.getElementById('userRoleModal')).hide();
            await loadUserRoles();
        } else {
            throw new Error(result?.error || 'Failed to save role');
        }
    } catch (error) {
        console.error('Error saving user role:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save role: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Edit User Role
 */
function editUserRole(roleId) {
    console.log('editUserRole called with roleId:', roleId);
    alert('Edit Role clicked! Role ID: ' + roleId); // Debug alert
    openUserRoleModal(roleId);
}

/**
 * Delete User Role
 */
async function deleteUserRole(roleId, roleName) {
    const result = await Swal.fire({
        title: 'Delete Role',
        text: `Are you sure you want to delete the role "${roleName}"? This action cannot be undone. If users are assigned to this role, deletion will fail.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
    });
    
    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const deleteResult = await dataFunctions.deleteUserRole(roleId);
            
            if (deleteResult && deleteResult.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Role has been deleted successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                await loadUserRoles();
            } else {
                throw new Error(deleteResult?.error || 'Failed to delete role. Role may be assigned to users.');
            }
        } catch (error) {
            console.error('Error deleting user role:', error);
            Swal.fire({
                title: 'Error',
                text: `Failed to delete role: ${error.message}`,
                icon: 'error'
            });
        }
    }
}

// Make functions globally accessible
window.editUserRole = editUserRole;
window.deleteUserRole = deleteUserRole;
window.loadUserRoles = loadUserRoles;
window.initializeCorporateIdentity = initializeCorporateIdentity;
window.applyBrandingToPage = applyBrandingToPage;

// ============================================================================
// CORPORATE IDENTITY / BRANDING FUNCTIONS
// ============================================================================

/**
 * Initialize Corporate Identity Tab
 */
async function initializeCorporateIdentity() {
    await loadCorporateIdentitySettings();
    setupColorPickers();
    setupFileUploads();
    setupBrandingForms();
}

/**
 * Load Corporate Identity Settings from Database
 */
async function loadCorporateIdentitySettings() {
    try {
        const settings = await dataFunctions.getSystemSettings();
        let settingsData = settings;
        if (settings && settings.data) {
            settingsData = settings.data;
        }
        
        if (settingsData && Array.isArray(settingsData)) {
            // Load primary color
            const primaryColor = settingsData.find(s => s.setting_key === 'branding_primary_color');
            if (primaryColor) {
                const color = typeof primaryColor.setting_value === 'string' 
                    ? primaryColor.setting_value 
                    : primaryColor.setting_value?.value || '#5CBDB4';
                document.getElementById('primaryColor').value = color;
                document.getElementById('primaryColorHex').value = color;
                updateColorPreview('primaryColorPreview', color);
            }
            
            // Load secondary color
            const secondaryColor = settingsData.find(s => s.setting_key === 'branding_secondary_color');
            if (secondaryColor) {
                const color = typeof secondaryColor.setting_value === 'string' 
                    ? secondaryColor.setting_value 
                    : secondaryColor.setting_value?.value || '#6b7280';
                document.getElementById('secondaryColor').value = color;
                document.getElementById('secondaryColorHex').value = color;
                updateColorPreview('secondaryColorPreview', color);
            }
            
            // Load logo
            const logo = settingsData.find(s => s.setting_key === 'branding_logo_url');
            if (logo) {
                const logoUrl = typeof logo.setting_value === 'string' 
                    ? logo.setting_value 
                    : logo.setting_value?.url || logo.setting_value?.value;
                if (logoUrl) {
                    displayLogo(logoUrl);
                }
            }
            
            // Load favicon
            const favicon = settingsData.find(s => s.setting_key === 'branding_favicon_url');
            if (favicon) {
                const faviconUrl = typeof favicon.setting_value === 'string' 
                    ? favicon.setting_value 
                    : favicon.setting_value?.url || favicon.setting_value?.value;
                if (faviconUrl) {
                    displayFavicon(faviconUrl);
                }
            }
            
            // Load company display name
            const displayName = settingsData.find(s => s.setting_key === 'branding_company_display_name');
            if (displayName) {
                const name = typeof displayName.setting_value === 'string' 
                    ? displayName.setting_value 
                    : displayName.setting_value?.value;
                if (name) {
                    document.getElementById('companyDisplayName').value = name;
                }
            }
            
            // Load tagline
            const tagline = settingsData.find(s => s.setting_key === 'branding_company_tagline');
            if (tagline) {
                const taglineValue = typeof tagline.setting_value === 'string' 
                    ? tagline.setting_value 
                    : tagline.setting_value?.value;
                if (taglineValue) {
                    document.getElementById('companyTagline').value = taglineValue;
                }
            }
            
            // Apply branding to page
            applyBrandingToPage();
        }
    } catch (error) {
        console.error('Error loading corporate identity settings:', error);
    }
}

/**
 * Setup Color Pickers with Synchronization
 */
function setupColorPickers() {
    // Primary color picker
    const primaryColorInput = document.getElementById('primaryColor');
    const primaryColorHex = document.getElementById('primaryColorHex');
    
    if (primaryColorInput && primaryColorHex) {
        primaryColorInput.addEventListener('input', function() {
            primaryColorHex.value = this.value;
            updateColorPreview('primaryColorPreview', this.value);
            updatePreviewColors();
        });
        
        primaryColorHex.addEventListener('input', function() {
            if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
                primaryColorInput.value = this.value;
                updateColorPreview('primaryColorPreview', this.value);
                updatePreviewColors();
            }
        });
    }
    
    // Secondary color picker
    const secondaryColorInput = document.getElementById('secondaryColor');
    const secondaryColorHex = document.getElementById('secondaryColorHex');
    
    if (secondaryColorInput && secondaryColorHex) {
        secondaryColorInput.addEventListener('input', function() {
            secondaryColorHex.value = this.value;
            updateColorPreview('secondaryColorPreview', this.value);
            updatePreviewColors();
        });
        
        secondaryColorHex.addEventListener('input', function() {
            if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
                secondaryColorInput.value = this.value;
                updateColorPreview('secondaryColorPreview', this.value);
                updatePreviewColors();
            }
        });
    }
}

/**
 * Update Color Preview
 */
function updateColorPreview(elementId, color) {
    const preview = document.getElementById(elementId);
    if (preview) {
        preview.style.backgroundColor = color;
    }
}

/**
 * Update Preview Colors in Live Preview
 */
function updatePreviewColors() {
    const primaryColor = document.getElementById('primaryColor')?.value || '#5CBDB4';
    const secondaryColor = document.getElementById('secondaryColor')?.value || '#6b7280';
    
    // Update preview navbar
    const previewNavbar = document.querySelector('.preview-navbar');
    if (previewNavbar) {
        previewNavbar.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
    }
    
    // Update preview buttons
    const previewButtons = document.querySelectorAll('.preview-content .btn-primary');
    previewButtons.forEach(btn => {
        btn.style.backgroundColor = primaryColor;
        btn.style.borderColor = primaryColor;
    });
    
    const previewOutlineButtons = document.querySelectorAll('.preview-content .btn-outline-primary');
    previewOutlineButtons.forEach(btn => {
        btn.style.color = primaryColor;
        btn.style.borderColor = primaryColor;
    });
    
    // Update preview progress bar
    const previewProgress = document.querySelector('.preview-content .mt-3 div');
    if (previewProgress) {
        previewProgress.style.backgroundColor = primaryColor;
    }
}

/**
 * Setup File Uploads
 */
function setupFileUploads() {
    // Logo upload
    const logoFile = document.getElementById('logoFile');
    if (logoFile) {
        logoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    Swal.fire({
                        title: 'File Too Large',
                        text: 'Logo file must be less than 2MB',
                        icon: 'error'
                    });
                    this.value = '';
                    return;
                }
                
                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('logoPreview');
                    const placeholder = document.getElementById('logoPlaceholder');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Favicon upload
    const faviconFile = document.getElementById('faviconFile');
    if (faviconFile) {
        faviconFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 100 * 1024) {
                    Swal.fire({
                        title: 'File Too Large',
                        text: 'Favicon file must be less than 100KB',
                        icon: 'error'
                    });
                    this.value = '';
                    return;
                }
                
                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('faviconPreview');
                    const placeholder = document.getElementById('faviconPlaceholder');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/**
 * Display Logo
 */
function displayLogo(url) {
    const preview = document.getElementById('logoPreview');
    const placeholder = document.getElementById('logoPlaceholder');
    const removeBtn = document.getElementById('removeLogoBtn');
    
    if (preview && url) {
        preview.src = url;
        preview.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        if (removeBtn) removeBtn.style.display = 'inline-block';
        
        // Update preview
        const previewLogo = document.getElementById('previewLogo');
        if (previewLogo) {
            previewLogo.src = url;
            previewLogo.style.display = 'block';
        }
        
        // Update preview company name visibility
        const previewCompanyName = document.getElementById('previewCompanyName');
        if (previewCompanyName && previewLogo) {
            previewCompanyName.style.display = 'none';
        }
    }
}

/**
 * Display Favicon
 */
function displayFavicon(url) {
    const preview = document.getElementById('faviconPreview');
    const placeholder = document.getElementById('faviconPlaceholder');
    const removeBtn = document.getElementById('removeFaviconBtn');
    
    if (preview && url) {
        preview.src = url;
        preview.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        if (removeBtn) removeBtn.style.display = 'inline-block';
        
        // Update page favicon
        updatePageFavicon(url);
    }
}

/**
 * Update Page Favicon
 */
function updatePageFavicon(url) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Setup Branding Forms
 */
function setupBrandingForms() {
    // Brand Colors Form
    const brandColorsForm = document.getElementById('brandColorsForm');
    if (brandColorsForm) {
        brandColorsForm.addEventListener('submit', handleBrandColorsSubmit);
    }
    
    // Logo Form
    const logoForm = document.getElementById('logoForm');
    if (logoForm) {
        logoForm.addEventListener('submit', handleLogoSubmit);
    }
    
    // Favicon Form
    const faviconForm = document.getElementById('faviconForm');
    if (faviconForm) {
        faviconForm.addEventListener('submit', handleFaviconSubmit);
    }
    
    // Branding Details Form
    const brandingDetailsForm = document.getElementById('brandingDetailsForm');
    if (brandingDetailsForm) {
        brandingDetailsForm.addEventListener('submit', handleBrandingDetailsSubmit);
    }
    
    // Reset Colors Button
    const resetColorsBtn = document.getElementById('resetColorsBtn');
    if (resetColorsBtn) {
        resetColorsBtn.addEventListener('click', resetColorsToDefault);
    }
    
    // Remove Logo Button
    const removeLogoBtn = document.getElementById('removeLogoBtn');
    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', removeLogo);
    }
    
    // Remove Favicon Button
    const removeFaviconBtn = document.getElementById('removeFaviconBtn');
    if (removeFaviconBtn) {
        removeFaviconBtn.addEventListener('click', removeFavicon);
    }
}

/**
 * Handle Brand Colors Form Submit
 */
async function handleBrandColorsSubmit(e) {
    e.preventDefault();
    
    try {
        const primaryColor = document.getElementById('primaryColor').value;
        const secondaryColor = document.getElementById('secondaryColor').value;
        
        if (!/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Primary color must be a valid hex color (e.g., #5CBDB4)',
                icon: 'error'
            });
            return;
        }
        
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Save primary color
        await saveBrandingSetting('branding_primary_color', primaryColor, 'string', 'branding', 'Primary brand color');
        
        // Save secondary color
        await saveBrandingSetting('branding_secondary_color', secondaryColor, 'string', 'branding', 'Secondary brand color');
        
        // Apply branding immediately
        applyBrandingToPage();
        
        Swal.fire({
            title: 'Success!',
            text: 'Brand colors saved successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error saving brand colors:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save colors: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Handle Logo Upload
 */
async function handleLogoSubmit(e) {
    e.preventDefault();
    
    try {
        const fileInput = document.getElementById('logoFile');
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            Swal.fire({
                title: 'No File Selected',
                text: 'Please select a logo file to upload',
                icon: 'warning'
            });
            return;
        }
        
        const file = fileInput.files[0];
        
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                title: 'Invalid File Type',
                text: 'Logo must be PNG, JPEG, or SVG format',
                icon: 'error'
            });
            return;
        }
        
        // Show progress
        const progressBar = document.getElementById('logoUploadProgress');
        const progressBarInner = progressBar?.querySelector('.progress-bar');
        if (progressBar) progressBar.style.display = 'block';
        
        // Upload to Supabase Storage
        // Note: This requires Supabase client setup. For now, we'll store the file reference.
        // In production, implement actual Supabase Storage upload here.
        
        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // For now, create a data URL (in production, upload to Supabase Storage)
        const reader = new FileReader();
        reader.onload = async function(e) {
            const dataUrl = e.target.result;
            
            // Save logo URL to system settings
            // In production, this would be the Supabase Storage URL
            await saveBrandingSetting('branding_logo_url', dataUrl, 'string', 'branding', 'Company logo URL');
            
            displayLogo(dataUrl);
            
            Swal.fire({
                title: 'Success!',
                text: 'Logo uploaded successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            if (progressBar) progressBar.style.display = 'none';
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error uploading logo:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to upload logo: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Handle Favicon Upload
 */
async function handleFaviconSubmit(e) {
    e.preventDefault();
    
    try {
        const fileInput = document.getElementById('faviconFile');
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            Swal.fire({
                title: 'No File Selected',
                text: 'Please select a favicon file to upload',
                icon: 'warning'
            });
            return;
        }
        
        const file = fileInput.files[0];
        
        // Validate file type
        const allowedTypes = ['image/png', 'image/x-icon', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                title: 'Invalid File Type',
                text: 'Favicon must be ICO, PNG, or SVG format',
                icon: 'error'
            });
            return;
        }
        
        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Create data URL (in production, upload to Supabase Storage)
        const reader = new FileReader();
        reader.onload = async function(e) {
            const dataUrl = e.target.result;
            
            // Save favicon URL to system settings
            await saveBrandingSetting('branding_favicon_url', dataUrl, 'string', 'branding', 'Favicon URL');
            
            displayFavicon(dataUrl);
            
            Swal.fire({
                title: 'Success!',
                text: 'Favicon uploaded successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error uploading favicon:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to upload favicon: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Handle Branding Details Form Submit
 */
async function handleBrandingDetailsSubmit(e) {
    e.preventDefault();
    
    try {
        const displayName = document.getElementById('companyDisplayName').value.trim();
        const tagline = document.getElementById('companyTagline').value.trim();
        
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        if (displayName) {
            await saveBrandingSetting('branding_company_display_name', displayName, 'string', 'branding', 'Company display name');
        }
        
        if (tagline) {
            await saveBrandingSetting('branding_company_tagline', tagline, 'string', 'branding', 'Company tagline');
        }
        
        // Update preview
        const previewName = document.getElementById('previewCompanyName');
        if (previewName && displayName) {
            previewName.textContent = displayName;
            previewName.style.display = 'inline-block';
        }
        
        Swal.fire({
            title: 'Success!',
            text: 'Branding details saved successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error saving branding details:', error);
        Swal.fire({
            title: 'Error',
            text: `Failed to save details: ${error.message}`,
            icon: 'error'
        });
    }
}

/**
 * Save Branding Setting (Helper Function)
 */
async function saveBrandingSetting(key, value, type, category, description) {
    try {
        // Check if setting exists
        const settings = await dataFunctions.getSystemSettings();
        let settingsData = settings;
        if (settings && settings.data) {
            settingsData = settings.data;
        }
        
        const existingSetting = settingsData?.find(s => s.setting_key === key);
        
        if (existingSetting) {
            // Update existing
            await dataFunctions.updateSystemSetting(existingSetting.id, {
                setting_value: value,
                description: description || existingSetting.description
            });
        } else {
            // Create new
            await dataFunctions.createSystemSetting({
                setting_key: key,
                setting_value: value,
                setting_type: type,
                setting_category: category,
                description: description
            });
        }
    } catch (error) {
        console.error(`Error saving branding setting ${key}:`, error);
        throw error;
    }
}

/**
 * Apply Branding to Page (Updates CSS Variables)
 */
function applyBrandingToPage() {
    // Get branding settings
    const primaryColor = document.getElementById('primaryColor')?.value || '#5CBDB4';
    const secondaryColor = document.getElementById('secondaryColor')?.value || '#6b7280';
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--phoenix-primary', primaryColor);
    
    // Calculate RGB values for primary color
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
        root.style.setProperty('--phoenix-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--phoenix-secondary', secondaryColor);
    
    // Update navbar gradient
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
    }
    
    // Update logo in navbar if exists
    const logoUrl = document.getElementById('logoPreview')?.src;
    if (logoUrl) {
        const navbarLogo = document.querySelector('.navbar-brand img');
        if (navbarLogo) {
            navbarLogo.src = logoUrl;
        }
    }
}

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Reset Colors to Default
 */
async function resetColorsToDefault() {
    const result = await Swal.fire({
        title: 'Reset Colors?',
        text: 'This will reset brand colors to default values. Continue?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, reset',
        cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
        document.getElementById('primaryColor').value = '#5CBDB4';
        document.getElementById('primaryColorHex').value = '#5CBDB4';
        document.getElementById('secondaryColor').value = '#6b7280';
        document.getElementById('secondaryColorHex').value = '#6b7280';
        
        updateColorPreview('primaryColorPreview', '#5CBDB4');
        updateColorPreview('secondaryColorPreview', '#6b7280');
        updatePreviewColors();
        
        // Save defaults
        await handleBrandColorsSubmit({ preventDefault: () => {} });
    }
}

/**
 * Remove Logo
 */
async function removeLogo() {
    const result = await Swal.fire({
        title: 'Remove Logo?',
        text: 'This will remove the company logo. Continue?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
        try {
            // Delete setting
            const settings = await dataFunctions.getSystemSettings();
            let settingsData = settings;
            if (settings && settings.data) {
                settingsData = settings.data;
            }
            
            const logoSetting = settingsData?.find(s => s.setting_key === 'branding_logo_url');
            if (logoSetting) {
                await dataFunctions.deleteSystemSetting(logoSetting.id);
            }
            
            // Clear display
            const preview = document.getElementById('logoPreview');
            const placeholder = document.getElementById('logoPlaceholder');
            const removeBtn = document.getElementById('removeLogoBtn');
            
            if (preview) {
                preview.src = '';
                preview.style.display = 'none';
            }
            if (placeholder) placeholder.style.display = 'flex';
            if (removeBtn) removeBtn.style.display = 'none';
            
            Swal.fire({
                title: 'Removed!',
                text: 'Logo has been removed',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error removing logo:', error);
            Swal.fire({
                title: 'Error',
                text: `Failed to remove logo: ${error.message}`,
                icon: 'error'
            });
        }
    }
}

/**
 * Remove Favicon
 */
async function removeFavicon() {
    const result = await Swal.fire({
        title: 'Remove Favicon?',
        text: 'This will remove the favicon. Continue?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
        try {
            // Delete setting
            const settings = await dataFunctions.getSystemSettings();
            let settingsData = settings;
            if (settings && settings.data) {
                settingsData = settings.data;
            }
            
            const faviconSetting = settingsData?.find(s => s.setting_key === 'branding_favicon_url');
            if (faviconSetting) {
                await dataFunctions.deleteSystemSetting(faviconSetting.id);
            }
            
            // Clear display
            const preview = document.getElementById('faviconPreview');
            const placeholder = document.getElementById('faviconPlaceholder');
            const removeBtn = document.getElementById('removeFaviconBtn');
            
            if (preview) {
                preview.src = '';
                preview.style.display = 'none';
            }
            if (placeholder) placeholder.style.display = 'flex';
            if (removeBtn) removeBtn.style.display = 'none';
            
            Swal.fire({
                title: 'Removed!',
                text: 'Favicon has been removed',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error removing favicon:', error);
            Swal.fire({
                title: 'Error',
                text: `Failed to remove favicon: ${error.message}`,
                icon: 'error'
            });
        }
    }
}

