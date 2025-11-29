// My Profile JavaScript - Database Integrated

let currentUserProfile = null;
let editMode = {
    personal: false,
    contact: false
};

// Initialize when DOM is ready or when modal is shown
document.addEventListener('DOMContentLoaded', function() {
    // Don't auto-initialize - wait for modal to be shown
    setupModalListeners();
});

function setupModalListeners() {
    const modalElement = document.getElementById('myProfileModal');
    if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', function() {
            initializeMyProfile();
        });
        
        // Reset form states when modal is hidden
        modalElement.addEventListener('hidden.bs.modal', function() {
            // Cancel any active edit modes
            if (editMode.personal) {
                cancelEdit('personal');
            }
            if (editMode.contact) {
                cancelEdit('contact');
            }
        });
    }
}

async function initializeMyProfile() {
    // Check if user is authenticated
    const authServiceAvailable = typeof authService !== 'undefined' && authService;
    const isAuthenticated = authServiceAvailable && authService.isAuthenticated();
    
    // Also check localStorage as fallback
    const hasToken = localStorage.getItem('lambda_token');
    const hasUserInfo = localStorage.getItem('user_info');
    
    if (!isAuthenticated && (!hasToken || !hasUserInfo)) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to view your profile',
            confirmButtonText: 'OK'
        }).then(() => {
            // Close modal if not authenticated
            const modalElement = document.getElementById('myProfileModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
        });
        return;
    }
    
    // Check if modal element exists
    const modalElement = document.getElementById('myProfileModal');
    if (!modalElement) {
        console.warn('My Profile modal element not found');
        return;
    }
    
    await loadUserProfile();
    setupFormHandlers();
}

/**
 * Get Current User ID
 */
function getCurrentUserId() {
    try {
        // Try authService first
        if (typeof authService !== 'undefined' && authService.userInfo) {
            return authService.userInfo.id || authService.userInfo.user_id;
        }
        
        // Try localStorage
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            return user.id || user.user_id;
        }
    } catch (e) {
        console.error('Error getting current user ID:', e);
    }
    return null;
}

/**
 * Load User Profile from Database
 */
async function loadUserProfile() {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User ID not found');
        }
        
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Get user profile
        let profileResult;
        try {
            // Try using getUserProfile function
            if (dataFunctionsToUse.getUserProfile) {
                profileResult = await dataFunctionsToUse.getUserProfile(userId);
            } else {
                // Fallback: use callFunction directly
                profileResult = await dataFunctionsToUse.callFunction('get_user_profile', {
                    p_id: userId
                });
            }
        } catch (e) {
            console.warn('Error getting user profile, trying fallback:', e);
            // Fallback: get from user_profiles using getUserProfiles and filter
            try {
                const allProfiles = await dataFunctionsToUse.getUserProfiles(null);
                if (Array.isArray(allProfiles)) {
                    profileResult = allProfiles.find(p => p.id === userId);
                } else if (allProfiles && allProfiles.data) {
                    profileResult = allProfiles.data.find(p => p.id === userId);
                }
            } catch (e2) {
                console.error('Fallback also failed:', e2);
            }
        }
        
        // Handle different response structures
        let profile = null;
        if (profileResult) {
            if (profileResult.data) {
                profile = Array.isArray(profileResult.data) ? profileResult.data[0] : profileResult.data;
            } else if (Array.isArray(profileResult)) {
                profile = profileResult.length > 0 ? profileResult[0] : null;
            } else if (profileResult.id) {
                profile = profileResult;
            }
        }
        
        if (!profile) {
            // Profile doesn't exist, try to create one from user info
            const userInfo = authService?.userInfo || JSON.parse(localStorage.getItem('user_info') || '{}');
            
            // Try to create profile
            try {
                const createData = {
                    id: userId,
                    first_name: userInfo.first_name || userInfo.firstName || 'User',
                    last_name: userInfo.last_name || userInfo.lastName || '',
                    email: userInfo.email || '',
                    phone: userInfo.phone || null,
                    mobile: userInfo.mobile || null,
                    id_number: userInfo.id_number || null,
                    fsp_number: userInfo.fsp_number || null,
                    role_id: userInfo.role_id || null,
                    status: 'active'
                };
                
                if (dataFunctionsToUse.createUserProfile) {
                    const createResult = await dataFunctionsToUse.createUserProfile(createData);
                    if (createResult && (createResult.success !== false)) {
                        // Profile created, reload it
                        return await loadUserProfile();
                    }
                }
            } catch (createError) {
                console.warn('Could not create profile, using user info:', createError);
            }
            
            // Use user info as fallback
            profile = {
                id: userId,
                first_name: userInfo.first_name || userInfo.firstName || 'User',
                last_name: userInfo.last_name || userInfo.lastName || '',
                email: userInfo.email || '',
                phone: userInfo.phone || null,
                mobile: userInfo.mobile || null,
                id_number: userInfo.id_number || null,
                fsp_number: userInfo.fsp_number || null,
                status: 'active',
                role_id: userInfo.role_id || null
            };
        }
        
        currentUserProfile = profile;
        
        // Load role information if role_id is available
        if (profile.role_id && dataFunctionsToUse.getUserRoles) {
            try {
                const roles = await dataFunctionsToUse.getUserRoles();
                let roleName = 'User';
                
                if (Array.isArray(roles)) {
                    const role = roles.find(r => r.id === profile.role_id);
                    if (role) {
                        roleName = role.role_display_name || role.role_name || 'User';
                    }
                } else if (roles && roles.data) {
                    const role = Array.isArray(roles.data) 
                        ? roles.data.find(r => r.id === profile.role_id)
                        : roles.data;
                    if (role) {
                        roleName = role.role_display_name || role.role_name || 'User';
                    }
                }
                
                // Store role name in profile for display
                profile.role_name = roleName;
            } catch (e) {
                console.warn('Could not load role information:', e);
            }
        }
        
        displayUserProfile(profile);
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load profile. Please try again.',
            confirmButtonText: 'Retry'
        }).then(() => {
            loadUserProfile();
        });
    }
}

/**
 * Display User Profile
 */
function displayUserProfile(profile) {
    // Update header
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
    document.getElementById('profileFullName').textContent = fullName;
    document.getElementById('profileEmail').textContent = profile.email || '-';
    
    // Get role name if available
    const userInfo = authService?.userInfo || JSON.parse(localStorage.getItem('user_info') || '{}');
    const roleName = userInfo.role_name || userInfo.role || 'User';
    document.getElementById('profileRole').textContent = roleName;
    document.getElementById('userRole').textContent = roleName;
    
    // Update status
    const status = profile.status || 'active';
    const statusEl = document.getElementById('profileStatus');
    statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusEl.className = status === 'active' ? 'badge bg-success fs-6' : 'badge bg-warning fs-6';
    
    // Personal Information
    document.getElementById('firstName').value = profile.first_name || '';
    document.getElementById('lastName').value = profile.last_name || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('idNumber').value = profile.id_number || '';
    document.getElementById('fspNumber').value = profile.fsp_number || '';
    document.getElementById('status').value = status;
    
    // Contact Details
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('mobile').value = profile.mobile || '';
    
    // Account Information
    document.getElementById('userId').textContent = profile.id || '-';
    
    if (profile.created_at) {
        const createdDate = new Date(profile.created_at);
        document.getElementById('accountCreated').textContent = createdDate.toLocaleDateString('en-ZA');
    } else {
        document.getElementById('accountCreated').textContent = '-';
    }
    
    if (profile.updated_at) {
        const updatedDate = new Date(profile.updated_at);
        document.getElementById('lastUpdated').textContent = updatedDate.toLocaleDateString('en-ZA');
    } else {
        document.getElementById('lastUpdated').textContent = '-';
    }
    
    if (profile.last_login) {
        const lastLoginDate = new Date(profile.last_login);
        document.getElementById('lastLogin').textContent = lastLoginDate.toLocaleDateString('en-ZA');
    } else {
        document.getElementById('lastLogin').textContent = 'Never';
    }
}

/**
 * Setup Form Handlers
 */
function setupFormHandlers() {
    // Personal Information Form
    const personalForm = document.getElementById('personalInfoForm');
    if (personalForm) {
        personalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await savePersonalInfo();
        });
    }
    
    // Contact Information Form
    const contactForm = document.getElementById('contactInfoForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveContactInfo();
        });
    }
    
    // Change Password Form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await changePassword();
        });
    }
}

/**
 * Toggle Edit Mode
 */
function toggleEditMode(section) {
    editMode[section] = !editMode[section];
    
    if (section === 'personal') {
        const inputs = ['firstName', 'lastName', 'idNumber', 'fspNumber'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = !editMode.personal;
        });
        
        const editBtn = document.getElementById('editPersonalBtn');
        const actions = document.getElementById('personalFormActions');
        
        if (editMode.personal) {
            editBtn.innerHTML = '<i class="fas fa-times me-1"></i>Cancel';
            editBtn.className = 'btn btn-sm btn-outline-danger';
            actions.style.display = 'block';
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit me-1"></i>Edit';
            editBtn.className = 'btn btn-sm btn-outline-primary';
            actions.style.display = 'none';
            // Reset form to original values
            if (currentUserProfile) {
                document.getElementById('firstName').value = currentUserProfile.first_name || '';
                document.getElementById('lastName').value = currentUserProfile.last_name || '';
                document.getElementById('idNumber').value = currentUserProfile.id_number || '';
                document.getElementById('fspNumber').value = currentUserProfile.fsp_number || '';
            }
        }
    } else if (section === 'contact') {
        const inputs = ['phone', 'mobile'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = !editMode.contact;
        });
        
        const editBtn = document.getElementById('editContactBtn');
        const actions = document.getElementById('contactFormActions');
        
        if (editMode.contact) {
            editBtn.innerHTML = '<i class="fas fa-times me-1"></i>Cancel';
            editBtn.className = 'btn btn-sm btn-outline-danger';
            actions.style.display = 'block';
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit me-1"></i>Edit';
            editBtn.className = 'btn btn-sm btn-outline-primary';
            actions.style.display = 'none';
            // Reset form to original values
            if (currentUserProfile) {
                document.getElementById('phone').value = currentUserProfile.phone || '';
                document.getElementById('mobile').value = currentUserProfile.mobile || '';
            }
        }
    }
}

/**
 * Cancel Edit
 */
function cancelEdit(section) {
    editMode[section] = false;
    toggleEditMode(section);
}

/**
 * Save Personal Information
 */
async function savePersonalInfo() {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User ID not found');
        }
        
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        const updateData = {
            first_name: document.getElementById('firstName').value.trim(),
            last_name: document.getElementById('lastName').value.trim(),
            id_number: document.getElementById('idNumber').value.trim() || null,
            fsp_number: document.getElementById('fspNumber').value.trim() || null
        };
        
        // Validate required fields
        if (!updateData.first_name || !updateData.last_name) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'First name and last name are required'
            });
            return;
        }
        
        const result = await dataFunctionsToUse.updateUserProfile(userId, updateData);
        
        // Check result
        let success = false;
        if (result && result.success === false) {
            throw new Error(result.error || 'Update failed');
        } else if (result && (result.success === true || result.id)) {
            success = true;
        } else if (Array.isArray(result) && result.length > 0) {
            success = true;
        } else if (result && !result.error) {
            success = true;
        }
        
        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Reload profile
            await loadUserProfile();
            cancelEdit('personal');
        } else {
            throw new Error('Update failed');
        }
        
    } catch (error) {
        console.error('Error saving personal information:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to update profile. Please try again.'
        });
    }
}

/**
 * Save Contact Information
 */
async function saveContactInfo() {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User ID not found');
        }
        
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        const updateData = {
            phone: document.getElementById('phone').value.trim() || null,
            mobile: document.getElementById('mobile').value.trim() || null
        };
        
        const result = await dataFunctionsToUse.updateUserProfile(userId, updateData);
        
        // Check result
        let success = false;
        if (result && result.success === false) {
            throw new Error(result.error || 'Update failed');
        } else if (result && (result.success === true || result.id)) {
            success = true;
        } else if (Array.isArray(result) && result.length > 0) {
            success = true;
        } else if (result && !result.error) {
            success = true;
        }
        
        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Contact information updated successfully',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Reload profile
            await loadUserProfile();
            cancelEdit('contact');
        } else {
            throw new Error('Update failed');
        }
        
    } catch (error) {
        console.error('Error saving contact information:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to update contact information. Please try again.'
        });
    }
}

/**
 * Change Password
 */
async function changePassword() {
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate
        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'All password fields are required'
            });
            return;
        }
        
        if (newPassword.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'New password must be at least 8 characters long'
            });
            return;
        }
        
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'New passwords do not match'
            });
            return;
        }
        
        // Note: Password change would typically go through auth service
        // This is a placeholder - actual implementation depends on your auth system
        Swal.fire({
            icon: 'info',
            title: 'Password Change',
            text: 'Password change functionality requires integration with your authentication system. Please contact your administrator.',
            confirmButtonText: 'OK'
        });
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
        
    } catch (error) {
        console.error('Error changing password:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to change password. Please try again.'
        });
    }
}

// Export for global access
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.initializeMyProfile = initializeMyProfile;

