// Settings & Administration JavaScript

// Import data functions if needed
// Assumes dataFunctions is globally available from data-functions.js

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
    initializeSettings();
    setupEventListeners();
});

async function initializeSettings() {
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
    try {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
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
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (usersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No users found. Click "Add New User" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    usersData.forEach(user => {
        const tr = document.createElement('tr');
        
        // Find role display name
        const role = userRolesData.find(r => r.id === user.role_id);
        const roleDisplayName = role ? role.role_display_name : (user.role_name || 'No Role');
        
        // Format status badge
        const statusBadge = user.status === 'active' ?
            '<span class="user-status-badge active">✅ Active</span>' :
            '<span class="user-status-badge inactive">⏸️ Inactive</span>';
        
        // Format last login
        const lastLogin = user.last_login ? 
            new Date(user.last_login).toLocaleString('en-ZA', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : 
            'Never';
        
        // Format created date
        const createdDate = user.created_at ? 
            new Date(user.created_at).toLocaleDateString('en-ZA') : 
            'N/A';
        
        tr.innerHTML = `
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            <td>${roleDisplayName}</td>
            <td>${statusBadge}</td>
            <td>${lastLogin}</td>
            <td>${createdDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUserProfile('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="resetPassword('${user.id}')" title="Reset Password">
                        <i class="fas fa-key"></i>
                    </button>
                    <button class="action-btn" onclick="viewUserProfile('${user.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${user.status === 'inactive' ? `
                        <button class="action-btn text-danger" onclick="deleteUserProfile('${user.id}', '${user.first_name} ${user.last_name}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
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
        
        // Validate UUID format (only for create)
        if (!isEditMode) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(userId)) {
                Swal.fire({
                    title: 'Validation Error',
                    text: 'User ID must be a valid UUID',
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
 * Reset Password (Placeholder)
 */
function resetPassword(userId) {
    Swal.fire({
        title: 'Reset Password',
        text: 'Password reset functionality will be implemented with authentication system',
        icon: 'info'
    });
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

function applyUserFilters() {
    Swal.fire({
        title: 'Filters Applied',
        text: 'User list has been filtered',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
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
                setting_category: settingCategory, // Maps to p_setting_category in function
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

// Make functions globally accessible
window.loadFSPConfiguration = loadFSPConfiguration;
window.editUserProfile = editUserProfile;
window.resetPassword = resetPassword;
window.viewUserProfile = viewUserProfile;
window.deleteUserProfile = deleteUserProfile;
window.openAddUserModal = openAddUserModal;
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
            <td><code>${role.role_name}</code></td>
            <td><strong>${role.role_display_name}</strong></td>
            <td>${role.role_description || '<span class="text-muted">No description</span>'}</td>
            <td>${permissionsDisplay}</td>
            <td>${role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUserRole('${role.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn text-danger" onclick="deleteUserRole('${role.id}', '${role.role_name}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
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

