// CPD Dashboard JavaScript

let cpdData = {
    cycles: [], // All available cycles
    cycle: null, // Currently selected cycle
    selectedCycleId: null, // ID of selected cycle
    progress: null,
    activities: [],
    representatives: [],
    selectedRepresentativeId: null,
    myRepresentativeId: null, // Current user's own representative
    repComplianceStatus: {}, // Cache of compliance status by rep ID
    charts: {} // Store Chart.js instances for proper cleanup
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCPDDashboard();
});

async function initializeCPDDashboard() {
    try {
        // Load cycles first
        await loadCycles();
        
        // Load representatives
        await loadRepresentatives();
        
        // Load compliance status for selected cycle
        await loadRepComplianceForCycle();
        
        // Setup UI selectors
        setupCycleSelector();
        setupRepresentativeSelector();
        
        // Check if user has any representatives to view
        if (!cpdData.selectedRepresentativeId || cpdData.representatives.length === 0) {
            showNoAccessMessage();
            return;
        }
        
        // Load CPD data for selected cycle and representative
        await loadCpdDashboardData();
        
        updateProgressCircle();
        updateDashboardStats();
        initializeCharts();
        renderRecentActivities();
        renderCpdAlerts();
        setupTabSwitching();
        updateCycleInfo();
    } catch (error) {
        console.error('Error initializing CPD dashboard:', error);
    }
}

/**
 * Load All CPD Cycles
 */
async function loadCycles() {
    try {
        console.log('📅 Loading all CPD cycles...');
        
        // Get ALL cycles (not just active)
        const cyclesResult = await dataFunctions.getCpdCycles(null);
        let cycles = cyclesResult;
        if (cyclesResult && cyclesResult.data) {
            cycles = cyclesResult.data;
        } else if (Array.isArray(cyclesResult)) {
            cycles = cyclesResult;
        }
        
        cpdData.cycles = cycles || [];
        console.log(`✅ Loaded ${cpdData.cycles.length} CPD cycles`);
        
        // Auto-select active cycle
        const activeCycle = cpdData.cycles.find(c => c.status === 'active');
        if (activeCycle) {
            cpdData.selectedCycleId = activeCycle.id;
            cpdData.cycle = activeCycle;
            console.log(`🎯 Auto-selected active cycle: ${activeCycle.cycle_name}`);
        } else if (cpdData.cycles.length > 0) {
            // If no active cycle, select the most recent one
            const sortedCycles = [...cpdData.cycles].sort((a, b) => 
                new Date(b.start_date) - new Date(a.start_date)
            );
            cpdData.selectedCycleId = sortedCycles[0].id;
            cpdData.cycle = sortedCycles[0];
            console.log(`🎯 Auto-selected most recent cycle: ${sortedCycles[0].cycle_name}`);
        }
        
    } catch (error) {
        console.error('Error loading CPD cycles:', error);
        cpdData.cycles = [];
    }
}

/**
 * Setup Cycle Selector Dropdown
 */
function setupCycleSelector() {
    const selector = document.getElementById('cycleSelector');
    if (!selector) return;
    
    selector.innerHTML = '';
    
    if (cpdData.cycles.length === 0) {
        selector.innerHTML = '<option value="">No cycles available</option>';
        return;
    }
    
    // Sort cycles by start date (most recent first)
    const sortedCycles = [...cpdData.cycles].sort((a, b) => 
        new Date(b.start_date) - new Date(a.start_date)
    );
    
    sortedCycles.forEach(cycle => {
        const option = document.createElement('option');
        option.value = cycle.id;
        
        // Format dates  
        const startDate = new Date(cycle.start_date);
        const endDate = new Date(cycle.end_date);
        
        // Status badge
        let statusIcon = '';
        if (cycle.status === 'active') {
            statusIcon = '🟢 ';
        } else if (cycle.status === 'completed') {
            statusIcon = '✓ ';
        } else if (cycle.status === 'upcoming') {
            statusIcon = '⏳ ';
        }
        
        option.textContent = `${statusIcon}${cycle.cycle_name} (${startDate.toLocaleDateString('en-ZA', {month: 'short', year: 'numeric'})} - ${endDate.toLocaleDateString('en-ZA', {month: 'short', year: 'numeric'})})`;
        
        if (cycle.id === cpdData.selectedCycleId) {
            option.selected = true;
        }
        
        selector.appendChild(option);
    });
    
    // Add change event listener
    selector.addEventListener('change', async function() {
        const newCycleId = this.value;
        console.log('📅 Cycle selector changed:', {
            previousId: cpdData.selectedCycleId,
            newId: newCycleId,
            selectedText: this.options[this.selectedIndex]?.text
        });
        
        cpdData.selectedCycleId = newCycleId;
        cpdData.cycle = cpdData.cycles.find(c => c.id === newCycleId);
        
        // Refresh dashboard data and compliance badges
        await loadRepComplianceForCycle();
        setupRepresentativeSelector(); // Update badges
        await refreshCpdData();
        
        console.log('✅ Dashboard refreshed for cycle:', newCycleId);
    });
}

/**
 * Show No Access Message when user is not linked
 */
function showNoAccessMessage() {
    // Hide all dashboard content
    const dashboardContent = document.querySelector('#dashboard .container-fluid');
    if (!dashboardContent) return;
    
    dashboardContent.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow-lg border-warning">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-unlink fa-4x text-warning mb-4"></i>
                        <h3 class="mb-3">CPD Module Access Not Available</h3>
                        <p class="lead mb-4">You are not currently linked to a representative record.</p>
                        
                        <div class="alert alert-warning text-start">
                            <h6 class="alert-heading">
                                <i class="fas fa-info-circle me-2"></i>Why Can't I Access CPD?
                            </h6>
                            <ul class="mb-0">
                                <li>CPD tracking requires a link to a representative record</li>
                                <li>This links your user account to your representative profile</li>
                                <li>Once linked, you can track and manage your CPD activities</li>
                            </ul>
                        </div>
                        
                        <div class="alert alert-info text-start mt-3">
                            <h6 class="alert-heading">
                                <i class="fas fa-user-cog me-2"></i>How to Get Access
                            </h6>
                            <ol class="mb-0">
                                <li>Contact your <strong>System Administrator</strong> or <strong>Compliance Officer</strong></li>
                                <li>Request to be linked to your representative record</li>
                                <li>They can link you via <strong>Settings → User Management → Edit User Profile</strong></li>
                                <li>Once linked, refresh this page to access the CPD module</li>
                            </ol>
                        </div>
                        
                        <div class="mt-4">
                            <button class="btn btn-primary btn-lg me-2" onclick="window.location.reload()">
                                <i class="fas fa-sync-alt me-2"></i>Refresh Page
                            </button>
                            <a href="/" class="btn btn-outline-secondary btn-lg">
                                <i class="fas fa-home me-2"></i>Return to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.warn('⚠️ CPD module access blocked - user not linked to representative');
}

/**
 * Load Representatives for Dropdown
 * Filters based on user role and supervision structure
 */
async function loadRepresentatives() {
    try {
        const result = await dataFunctions.getRepresentatives(null);
        let allReps = result;
        
        if (result && result.data) {
            allReps = result.data;
        } else if (Array.isArray(result)) {
            allReps = result;
        }
        
        let currentUserProfile = null;
        let currentUserRep = null;
        let currentUserRole = null;
        
        // Try to get current user's information from localStorage (most reliable)
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                console.log('📦 Parsed user_info object:', user);
                console.log('📦 Available keys:', Object.keys(user));
                
                currentUserProfile = {
                    id: user.profile_id || user.id,
                    first_name: user.first_name || user.firstName,
                    last_name: user.last_name || user.lastName,
                    email: user.email,
                    role_name: user.role_name || user.role,
                    role_id: user.role_id
                };
                currentUserRole = currentUserProfile.role_name || '';
                
                console.log('👤 User from localStorage:', {
                    name: `${currentUserProfile.first_name} ${currentUserProfile.last_name}`,
                    email: currentUserProfile.email,
                    role: currentUserRole,
                    roleType: typeof currentUserRole
                });
            } catch (e) {
                console.error('Error parsing user_info from localStorage:', e);
            }
        }
        
        // Fallback to authService if localStorage doesn't have user info
        if (!currentUserProfile && typeof authService !== 'undefined' && authService.getCurrentUser) {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.id) {
                // Try to get all profiles and find by email if available
                try {
                    const allProfilesResult = await dataFunctions.getUserProfiles(null);
                    let allProfiles = allProfilesResult;
                    if (allProfilesResult && allProfilesResult.data) {
                        allProfiles = allProfilesResult.data;
                    } else if (Array.isArray(allProfilesResult)) {
                        allProfiles = allProfilesResult;
                    }
                    
                    // Find profile by auth user email
                    if (currentUser.email && allProfiles) {
                        currentUserProfile = allProfiles.find(p => p.email === currentUser.email);
                        if (currentUserProfile) {
                            currentUserRole = currentUserProfile.role_name || currentUserProfile.role || '';
                        }
                    }
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            }
        }
        
        // Final database fallback if role is still empty
        if (!currentUserRole) {
            console.warn('⚠️ No role found in localStorage, querying database...');
            
            // Try multiple localStorage keys
            let userId = null;
            const authUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            
            userId = authUser.id || userInfo.id || currentUserProfile?.id;
            
            console.log('🔍 Auth user from localStorage:', authUser);
            console.log('🔍 User info ID:', userInfo.id);
            console.log('🔍 Using ID:', userId);
            
            if (userId) {
                try {
                    const profilesResult = await dataFunctions.getUserProfiles(null);
                    let allProfiles = profilesResult;
                    if (profilesResult && profilesResult.data) {
                        allProfiles = profilesResult.data;
                    } else if (Array.isArray(profilesResult)) {
                        allProfiles = profilesResult;
                    }
                    
                    console.log('📊 Loaded profiles:', allProfiles?.length || 0);
                    
                    if (allProfiles && Array.isArray(allProfiles)) {
                        const dbProfile = allProfiles.find(p => p.id === userId);
                        
                        if (dbProfile) {
                            currentUserProfile = dbProfile;
                            console.log('✅ Found profile in database:', {
                                id: dbProfile.id,
                                name: `${dbProfile.first_name} ${dbProfile.last_name}`,
                                email: dbProfile.email,
                                role_id: dbProfile.role_id
                            });
                            
                            // Get role name from role_id
                            if (dbProfile.role_id) {
                                console.log('🔍 Looking for role ID:', dbProfile.role_id);
                                const rolesResult = await dataFunctions.getUserRoles();
                                let roles = rolesResult;
                                if (rolesResult && rolesResult.data) {
                                    roles = rolesResult.data;
                                } else if (Array.isArray(rolesResult)) {
                                    roles = rolesResult;
                                }
                                
                                console.log('📊 Loaded roles:', roles?.length || 0);
                                
                                const roleObj = roles?.find(r => r.id === dbProfile.role_id);
                                if (roleObj) {
                                    currentUserRole = roleObj.role_name || '';
                                    console.log('✅ Found role from database:', currentUserRole);
                                } else {
                                    console.error('❌ Role not found for role_id:', dbProfile.role_id);
                                }
                            } else {
                                console.error('❌ Profile has no role_id');
                            }
                        } else {
                            console.error('❌ Profile not found for ID:', userId);
                            console.error('   Available profile IDs:', allProfiles?.map(p => p.id).join(', '));
                        }
                    } else {
                        console.error('❌ No profiles returned from database');
                    }
                } catch (error) {
                    console.error('❌ Database fallback failed:', error);
                }
            } else {
                console.error('❌ No auth user ID in localStorage');
            }
        }
        
        console.log('📋 Final user context for RBAC:', {
            hasProfile: !!currentUserProfile,
            hasRole: !!currentUserRole,
            role: currentUserRole
        });
        
        // Find representative linked to this user
        if (currentUserProfile && currentUserProfile.id) {
            currentUserRep = allReps.find(r => r.user_profile_id === currentUserProfile.id);
            if (currentUserRep) {
                cpdData.myRepresentativeId = currentUserRep.id;
                cpdData.selectedRepresentativeId = currentUserRep.id;
            }
        }
        
        // Apply role-based filtering
        let filteredReps = await filterRepresentativesByRole(
            allReps, 
            currentUserProfile, 
            currentUserRep, 
            currentUserRole
        );
        
        cpdData.representatives = filteredReps || [];
        
        // If no auto-selection, select first representative
        if (!cpdData.selectedRepresentativeId && cpdData.representatives.length > 0) {
            cpdData.selectedRepresentativeId = cpdData.representatives[0].id;
        }
        
        // Compliance status will be loaded separately via loadRepComplianceForCycle()
        
        // Update user context banner
        updateUserContextBanner(currentUserProfile, currentUserRep, currentUserRole, filteredReps.length, allReps.length);
        
    } catch (error) {
        console.error('Error loading representatives:', error);
        cpdData.representatives = [];
    }
}

/**
 * Update User Context Banner
 * Shows logged-in user's representative and access constraints
 */
function updateUserContextBanner(userProfile, userRep, userRole, filteredCount, totalCount) {
    const banner = document.getElementById('userContextBanner');
    const nameElement = document.getElementById('userContextName');
    const accessElement = document.getElementById('userContextAccess');
    const badgeElement = document.getElementById('userContextBadge');
    
    if (!banner || !nameElement || !accessElement || !badgeElement) return;
    
    // Build user context information
    let userName = 'Guest User';
    let linkedRepName = 'Not Linked';
    let accessLevel = 'Limited Access';
    let accessBadge = '<span class="badge bg-secondary">No Access</span>';
    let bannerClass = 'alert-warning';
    
    if (userProfile) {
        userName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'User';
    }
    
    if (userRep) {
        linkedRepName = `${userRep.first_name || ''} ${userRep.surname || ''}`.trim() || 'Unknown';
        const repNumber = userRep.representative_number || 'N/A';
        linkedRepName += ` (${repNumber})`;
    }
    
    // Determine access level
    const fullAccessRoles = ['admin', 'super admin', 'compliance officer', 'administrator'];
    const hasFullAccess = userRole && fullAccessRoles.some(role => 
        userRole.toLowerCase().includes(role)
    );
    
    if (hasFullAccess) {
        accessLevel = `Full Access: Can view all ${totalCount} representatives`;
        accessBadge = '<span class="badge bg-success fs-6"><i class="fas fa-crown me-1"></i>Full Access</span>';
        bannerClass = 'alert-success';
    } else if (filteredCount > 1) {
        // If user can see more than just their own rep, they're a supervisor
        const teamCount = filteredCount - 1; // Subtract self
        accessLevel = `Supervisor Access: Can view your CPD + ${teamCount} supervised representative${teamCount !== 1 ? 's' : ''}`;
        accessBadge = '<span class="badge bg-primary fs-6"><i class="fas fa-users me-1"></i>Supervisor</span>';
        bannerClass = 'alert-primary';
    } else if (userRep) {
        accessLevel = 'Personal Access: Can view only your own CPD data';
        accessBadge = '<span class="badge bg-info fs-6"><i class="fas fa-user me-1"></i>Personal</span>';
        bannerClass = 'alert-info';
    } else {
        accessLevel = 'No representative link - Contact administrator for CPD access';
        accessBadge = '<span class="badge bg-warning fs-6"><i class="fas fa-exclamation-triangle me-1"></i>Not Linked</span>';
        bannerClass = 'alert-warning';
    }
    
    // Update banner content
    nameElement.innerHTML = `
        ${userName} 
        ${userRep ? `<i class="fas fa-arrow-right mx-2"></i> Linked to: <strong>${linkedRepName}</strong>` : ''}
    `;
    
    accessElement.textContent = accessLevel;
    accessElement.className = ''; // Remove text-muted class for better visibility
    accessElement.style.color = 'white'; // Make text white for colored banners
    accessElement.style.opacity = '0.95'; // Slight transparency for elegance
    
    badgeElement.innerHTML = accessBadge;
    
    // Update banner styling
    banner.className = `alert ${bannerClass} mb-0 py-2`;
    banner.style.display = 'block';
}

/**
 * Filter Representatives Based on User Role and Supervision Structure
 */
async function filterRepresentativesByRole(allReps, userProfile, userRep, userRole) {
    try {
        console.log('Filtering representatives by role and supervision...', {
            userRole,
            userRepId: userRep?.id,
            totalReps: allReps?.length
        });
        
        // Check if user has full access (Admin, Compliance Officer, FSP Owner, etc.)
        // Note: Database stores 'fsp_owner' but display might be 'FSP Owner' or 'fsp owner'
        const fullAccessRoles = ['admin', 'super admin', 'compliance officer', 'administrator', 'fsp owner', 'fsp_owner'];
        const normalizedUserRole = (userRole || '').toLowerCase().replace(/_/g, ' '); // Normalize underscores to spaces
        const hasFullAccess = fullAccessRoles.some(role => 
            normalizedUserRole.includes(role) || normalizedUserRole.replace(/ /g, '_').includes(role)
        );
        
        console.log('🔐 Access check:');
        console.log('   - User Role (raw):', userRole);
        console.log('   - User Role (type):', typeof userRole);
        console.log('   - Normalized:', normalizedUserRole);
        console.log('   - Full Access Roles:', fullAccessRoles);
        console.log('   - Has Full Access:', hasFullAccess);
        console.log('   - User Rep:', userRep?.id);
        console.log('   - User Profile:', userProfile?.first_name, userProfile?.last_name);
        
        if (hasFullAccess) {
            console.log('✅ User has full access role - showing all representatives');
            return allReps;
        }
        
        // If user not linked to a representative and doesn't have full access role, show none
        if (!userRep) {
            console.warn('⚠️ User not linked to representative and no full access role - no CPD access');
            return [];
        }
        
        // Check if user's representative is a Key Individual (Supervisor)
        // A supervisor has a Key Individual record
        let keyIndividuals = [];
        try {
            const kisResult = await dataFunctions.getKeyIndividuals();
            if (kisResult && kisResult.data) {
                keyIndividuals = kisResult.data;
            } else if (Array.isArray(kisResult)) {
                keyIndividuals = kisResult;
            }
        } catch (error) {
            console.error('Error loading key individuals:', error);
        }
        
        // Find the KI record for this user's representative
        const kiRecord = keyIndividuals.find(ki => ki.representative_id === userRep.id);
        
        if (kiRecord) {
            // User is a supervisor (has KI record) - show own rep + supervised reps
            console.log('✅ User is Key Individual/Supervisor - showing supervised reps');
            
            // IMPORTANT: supervised_by_ki_id references representatives.id, not key_individuals.id
            // So we filter by userRep.id (the representative ID), not kiRecord.id
            const supervisedReps = allReps.filter(r => 
                r.id === userRep.id || // Own rep
                r.supervised_by_ki_id === userRep.id // Reps supervised by this rep
            );
            
            console.log(`   → Showing ${supervisedReps.length} representatives (self + ${supervisedReps.length - 1} supervised)`);
            return supervisedReps;
        }
        
        // Regular user - show only their own representative
        console.log('ℹ️ Regular user - showing only own representative');
        return [userRep];
        
    } catch (error) {
        console.error('Error filtering representatives:', error);
        // On error, show only user's own rep as fallback
        return userRep ? [userRep] : [];
    }
}

/**
 * Load CPD Compliance Status for All Representatives
 */
async function loadRepresentativeComplianceStatus() {
    try {
        if (!cpdData.cycle) return;
        
        // Get progress summary for all reps in current cycle (pass null for rep ID to get all)
        const summaryResult = await dataFunctions.getCpdProgressSummary(cpdData.cycle.id, null);
        let summaries = summaryResult;
        
        if (summaryResult && summaryResult.data) {
            summaries = summaryResult.data;
        } else if (Array.isArray(summaryResult)) {
            summaries = summaryResult;
        }
        
        // Build compliance status cache
        if (summaries && Array.isArray(summaries)) {
            summaries.forEach(summary => {
                if (summary.representative_id) {
                    cpdData.repComplianceStatus[summary.representative_id] = {
                        status: summary.compliance_status || 'unknown',
                        progress: parseFloat(summary.progress_percentage || 0),
                        hours: parseFloat(summary.total_hours_logged || 0)
                    };
                }
            });
        }
    } catch (error) {
        console.error('Error loading representative compliance status:', error);
    }
}

/**
 * Get Compliance Badge HTML
 */
function getComplianceBadge(repId) {
    const compliance = cpdData.repComplianceStatus[repId];
    if (!compliance) {
        return '<span class="badge bg-secondary badge-sm">?</span>';
    }
    
    const status = compliance.status;
    const progress = Math.round(compliance.progress);
    
    if (status === 'compliant' || progress >= 100) {
        return `<span class="badge bg-success badge-sm" title="Compliant - ${progress}%">✓ ${progress}%</span>`;
    } else if (status === 'on_track' || progress >= 70) {
        return `<span class="badge bg-info badge-sm" title="On Track - ${progress}%">⟳ ${progress}%</span>`;
    } else if (status === 'at_risk' || progress >= 40) {
        return `<span class="badge bg-warning badge-sm" title="At Risk - ${progress}%">⚠ ${progress}%</span>`;
    } else {
        return `<span class="badge bg-danger badge-sm" title="Critical - ${progress}%">✗ ${progress}%</span>`;
    }
}

/**
 * Setup Representative Selector Dropdown
 */
function setupRepresentativeSelector() {
    const selector = document.getElementById('representativeSelector');
    const searchInput = document.getElementById('repSearchInput');
    
    if (!selector) return;
    
    // Store all representatives for filtering
    const allReps = [...cpdData.representatives].sort((a, b) => {
        const nameA = `${a.first_name || ''} ${a.surname || ''}`.trim().toLowerCase();
        const nameB = `${b.first_name || ''} ${b.surname || ''}`.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    // Function to populate dropdown
    function populateDropdown(repsToShow) {
        selector.innerHTML = '';
        
        if (repsToShow.length === 0) {
            selector.innerHTML = '<option value="">No representatives found</option>';
            return;
        }
        
        repsToShow.forEach(rep => {
            const option = document.createElement('option');
            option.value = rep.id;
            option.dataset.repId = rep.id;
            
            const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
            const repNumber = rep.representative_number || 'N/A';
            const status = rep.status || 'active';
            
            // Get compliance badge text
            const compliance = cpdData.repComplianceStatus[rep.id];
            const complianceText = compliance ? ` [${Math.round(compliance.progress)}%]` : '';
            
            option.textContent = `${name} (${repNumber})${complianceText} - ${status.toUpperCase()}`;
            
            if (rep.id === cpdData.selectedRepresentativeId) {
                option.selected = true;
            }
            
            selector.appendChild(option);
        });
    }
    
    // Initial population
    populateDropdown(allReps);
    
    // Setup search/filter
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (!searchTerm) {
                populateDropdown(allReps);
                return;
            }
            
            const filtered = allReps.filter(rep => {
                const name = `${rep.first_name || ''} ${rep.surname || ''}`.toLowerCase();
                const repNumber = (rep.representative_number || '').toLowerCase();
                const idNumber = (rep.id_number || '').toLowerCase();
                
                return name.includes(searchTerm) || 
                       repNumber.includes(searchTerm) || 
                       idNumber.includes(searchTerm);
            });
            
            populateDropdown(filtered);
            
            // Show result count
            if (filtered.length > 0 && searchTerm) {
                searchInput.style.borderColor = '#198754'; // green
            } else if (filtered.length === 0 && searchTerm) {
                searchInput.style.borderColor = '#dc3545'; // red
            } else {
                searchInput.style.borderColor = '';
            }
        });
        
        // Clear search on Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.style.borderColor = '';
                populateDropdown(allReps);
            }
        });
    }
    
    // Add change event listener
    selector.addEventListener('change', async function() {
        const newRepId = this.value;
        console.log('📋 Representative selector changed:', {
            previousId: cpdData.selectedRepresentativeId,
            newId: newRepId,
            selectedText: this.options[this.selectedIndex]?.text
        });
        
        cpdData.selectedRepresentativeId = newRepId;
        updateSelectedRepInfo();
        await refreshCpdData();
        
        console.log('✅ Dashboard refreshed for rep:', newRepId);
    });
    
    // Update info display
    updateSelectedRepInfo();
    
    // Update "My CPD" toggle visibility
    updateMyRepToggle();
}

/**
 * Update Selected Representative Info Display
 */
function updateSelectedRepInfo() {
    const infoElement = document.getElementById('selectedRepInfo');
    if (!infoElement) return;
    
    if (!cpdData.selectedRepresentativeId) {
        infoElement.innerHTML = '<small class="text-muted">No representative selected</small>';
        return;
    }
    
    const selectedRep = cpdData.representatives.find(r => r.id === cpdData.selectedRepresentativeId);
    if (!selectedRep) {
        infoElement.innerHTML = '<small class="text-muted">Representative not found</small>';
        return;
    }
    
    const name = `${selectedRep.first_name || ''} ${selectedRep.surname || ''}`.trim() || 'Unknown';
    const repNumber = selectedRep.representative_number || 'N/A';
    const complianceBadge = getComplianceBadge(selectedRep.id);
    
    // Show if viewing your own rep
    const isMyRep = selectedRep.id === cpdData.myRepresentativeId;
    const myRepBadge = isMyRep ? '<span class="badge bg-primary badge-sm ms-1">YOU</span>' : '';
    
    infoElement.innerHTML = `
        <small>
            <i class="fas fa-user-circle me-1"></i>
            <strong>${name}</strong> (${repNumber})
            ${myRepBadge}
            ${complianceBadge}
        </small>
    `;
}

/**
 * Update My Representative Toggle Button
 */
function updateMyRepToggle() {
    const toggleBtn = document.getElementById('myRepToggle');
    if (!toggleBtn) return;
    
    // Show/hide based on whether viewing own rep
    if (cpdData.myRepresentativeId && cpdData.selectedRepresentativeId !== cpdData.myRepresentativeId) {
        toggleBtn.style.display = 'inline-block';
        toggleBtn.classList.add('btn-primary');
        toggleBtn.classList.remove('btn-outline-primary');
    } else {
        // Still show but disabled/styled differently when viewing own rep
        toggleBtn.style.display = 'inline-block';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-outline-primary');
        
        if (cpdData.selectedRepresentativeId === cpdData.myRepresentativeId) {
            toggleBtn.disabled = true;
            toggleBtn.title = 'Already viewing your CPD';
        } else {
            toggleBtn.disabled = false;
            toggleBtn.title = 'Switch to my representative';
        }
    }
}

/**
 * Switch to My Representative
 */
function switchToMyRep() {
    if (!cpdData.myRepresentativeId) {
        Swal.fire({
            icon: 'info',
            title: 'No Representative Linked',
            text: 'Your user account is not linked to a representative record.',
            footer: 'Please contact your administrator to link your account.'
        });
        return;
    }
    
    if (cpdData.selectedRepresentativeId === cpdData.myRepresentativeId) {
        return; // Already viewing own rep
    }
    
    // Update selection
    cpdData.selectedRepresentativeId = cpdData.myRepresentativeId;
    
    // Update dropdown
    const selector = document.getElementById('representativeSelector');
    if (selector) {
        selector.value = cpdData.myRepresentativeId;
    }
    
    // Clear search
    const searchInput = document.getElementById('repSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.style.borderColor = '';
    }
    
    // Update UI and reload data
    updateSelectedRepInfo();
    updateMyRepToggle();
    refreshCpdData();
}

/**
 * Refresh CPD Data for Selected Representative
 */
async function refreshCpdData() {
    try {
        // Show loading state
        const progressValue = document.getElementById('cpdProgressValue');
        if (progressValue) {
            progressValue.textContent = 'Loading...';
        }
        
        // Reload data
        await loadCpdDashboardData();
        updateProgressCircle();
        updateDashboardStats();
        initializeCharts();
        renderRecentActivities();
        renderCpdAlerts();
        updateCycleInfo();
        
        // If on activity log tab, refresh it too
        const logTab = document.getElementById('log-tab');
        if (logTab && logTab.classList.contains('active') && typeof loadActivityLog === 'function') {
            await loadActivityLog();
        }
        
        // Update toggle button state
        updateMyRepToggle();
        
    } catch (error) {
        console.error('Error refreshing CPD data:', error);
    }
}

/**
 * Load CPD Dashboard Data from Database
 */
/**
 * Load Representative Compliance Status for Selected Cycle
 */
async function loadRepComplianceForCycle() {
    try {
        if (!cpdData.selectedCycleId) return;
        
        console.log('📊 Loading compliance status for cycle:', cpdData.selectedCycleId);
        
        // Get progress summary for all reps in selected cycle
        const summaryResult = await dataFunctions.getCpdProgressSummary(cpdData.selectedCycleId, null);
        let summaries = summaryResult;
        if (summaryResult && summaryResult.data) {
            summaries = summaryResult.data;
        } else if (Array.isArray(summaryResult)) {
            summaries = summaryResult;
        }
        
        // Build compliance status cache by rep ID
        cpdData.repComplianceStatus = {};
        if (summaries && Array.isArray(summaries)) {
            summaries.forEach(summary => {
                if (summary.representative_id) {
                    cpdData.repComplianceStatus[summary.representative_id] = {
                        status: summary.compliance_status,
                        progress: parseFloat(summary.progress_percentage || 0),
                        hours: parseFloat(summary.total_hours_logged || 0)
                    };
                }
            });
        }
        
        console.log(`✅ Loaded compliance for ${Object.keys(cpdData.repComplianceStatus).length} representatives`);
        
    } catch (error) {
        console.error('Error loading rep compliance:', error);
        cpdData.repComplianceStatus = {};
    }
}

async function loadCpdDashboardData() {
    try {
        console.log('📊 Loading CPD dashboard data for representative:', cpdData.selectedRepresentativeId);
        console.log('📅 Using CPD cycle:', cpdData.cycle?.cycle_name, 'ID:', cpdData.selectedCycleId);
        
        // Use the selected cycle (already loaded)
        if (!cpdData.cycle || !cpdData.selectedCycleId) {
            console.warn('⚠️ No cycle selected');
            return;
        }
        
        if (cpdData.cycle) {
            
            // Get progress summary for selected representative and cycle
            try {
                // Pass selected CYCLE ID and representative ID to filter progress
                console.log('🔍 Fetching progress summary for:', {
                    cycleId: cpdData.selectedCycleId,
                    representativeId: cpdData.selectedRepresentativeId
                });
                
                const progressResult = await dataFunctions.getCpdProgressSummary(
                    cpdData.selectedCycleId,
                    cpdData.selectedRepresentativeId
                );
                let progress = progressResult;
                if (progressResult && progressResult.data) {
                    progress = progressResult.data;
                } else if (progressResult && Array.isArray(progressResult)) {
                    // If it's an array, take the first item or create a summary
                    progress = progressResult.length > 0 ? progressResult[0] : null;
                } else if (progressResult && typeof progressResult === 'object') {
                    progress = progressResult;
                }
                cpdData.progress = progress;
                console.log('✅ Progress loaded:', progress);
            } catch (progressError) {
                console.error('❌ Error loading CPD progress summary:', progressError);
                // Set default progress structure to prevent UI errors
                cpdData.progress = {
                    total_hours_logged: 0,
                    ethics_hours_logged: 0,
                    technical_hours_logged: 0,
                    activity_count: 0,
                    progress_percentage: 0,
                    compliance_status: 'unknown'
                };
            }
            
            // Get activities for selected representative and cycle
            try {
                const activitiesResult = await dataFunctions.getCpdActivities(
                    cpdData.selectedRepresentativeId, 
                    cpdData.selectedCycleId
                );
                let activities = activitiesResult;
                if (activitiesResult && activitiesResult.data) {
                    activities = activitiesResult.data;
                } else if (activitiesResult && Array.isArray(activitiesResult)) {
                    activities = activitiesResult;
                }
                cpdData.activities = activities || [];
                console.log('✅ Activities loaded:', activities?.length || 0, 'activities');
            } catch (activitiesError) {
                console.error('❌ Error loading CPD activities:', activitiesError);
                // Set empty array to prevent UI errors
                cpdData.activities = [];
            }
        }
    } catch (error) {
        console.error('Error loading CPD dashboard data:', error);
        throw error;
    }
}

function updateProgressCircle() {
    let progress = 0;
    let hoursEarned = 0;
    let hoursRequired = 18;
    
    if (cpdData.progress) {
        // Progress summary returns: total_hours_logged, ethics_hours_logged, technical_hours_logged
        hoursEarned = parseFloat(cpdData.progress.total_hours_logged || cpdData.progress.total_hours_earned || cpdData.progress.total_hours || 0);
        hoursRequired = parseFloat(cpdData.cycle?.required_hours || 18);
        progress = hoursRequired > 0 ? Math.round((hoursEarned / hoursRequired) * 100) : 0;
    }
    
    console.log('🔄 Updating progress circle:', { hoursEarned, hoursRequired, progress });
    
    // Update progress circle
    const circumference = 2 * Math.PI * 85; // radius = 85
    const offset = circumference - (progress / 100) * circumference;
    
    const progressCircle = document.querySelector('.progress-circle-progress');
    if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
        
        // Set color based on progress
        if (progress < 60) {
            progressCircle.classList.remove('progress-amber', 'progress-green');
            progressCircle.classList.add('progress-red');
        } else if (progress < 80) {
            progressCircle.classList.remove('progress-red', 'progress-green');
            progressCircle.classList.add('progress-amber');
        } else {
            progressCircle.classList.remove('progress-red', 'progress-amber');
            progressCircle.classList.add('progress-green');
        }
    }
    
    // Update progress text
    const progressValue = document.getElementById('cpdProgressValue') || document.querySelector('.progress-value');
    const progressPercentage = document.getElementById('cpdProgressPercentage') || document.querySelector('.progress-percentage');
    if (progressValue) {
        if (hoursEarned > 0 || hoursRequired > 0) {
            progressValue.textContent = `${Math.round(hoursEarned)} / ${Math.round(hoursRequired)}`;
        } else {
            progressValue.textContent = '- / -';
        }
    }
    if (progressPercentage) {
        if (progress > 0) {
            progressPercentage.textContent = `${progress}%`;
        } else {
            progressPercentage.textContent = '-';
        }
    }
}

/**
 * Update Dashboard Statistics
 */
function updateDashboardStats() {
    console.log('📊 updateDashboardStats called with:', {
        hasProgress: !!cpdData.progress,
        hasCycle: !!cpdData.cycle,
        progress: cpdData.progress,
        cycle: cpdData.cycle
    });
    
    if (!cpdData.progress && !cpdData.cycle) {
        console.warn('⚠️ No progress or cycle data available');
        return;
    }
    
    const progress = cpdData.progress || {};
    const cycle = cpdData.cycle || {};
    
    // Update Total Hours card
    const totalHoursValueEl = document.getElementById('cpdTotalHoursValue');
    const totalHoursSublabelEl = document.getElementById('cpdTotalHoursSublabel');
    const totalHoursProgressEl = document.getElementById('cpdTotalHoursProgress');
    
    console.log('🎯 Total Hours elements:', {
        valueEl: !!totalHoursValueEl,
        sublabelEl: !!totalHoursSublabelEl,
        progressEl: !!totalHoursProgressEl
    });
    
    if (totalHoursValueEl || totalHoursSublabelEl || totalHoursProgressEl) {
        const hoursEarned = parseFloat(progress.total_hours_logged || progress.total_hours_earned || progress.total_hours || 0);
        const hoursRequired = parseFloat(cycle.required_hours || 18);
        const percentage = hoursRequired > 0 ? Math.round((hoursEarned / hoursRequired) * 100) : 0;
        
        console.log('💯 Updating Total Hours:', { hoursEarned, hoursRequired, percentage });
        
        if (totalHoursValueEl) {
            totalHoursValueEl.textContent = Math.round(hoursEarned) || 0;
            console.log('✅ Set totalHoursValue to:', totalHoursValueEl.textContent);
        }
        if (totalHoursSublabelEl) {
            totalHoursSublabelEl.textContent = `of ${Math.round(hoursRequired)} required`;
        }
        if (totalHoursProgressEl) {
            totalHoursProgressEl.style.width = `${percentage}%`;
        }
    }
    
    // Update Ethics Hours card
    const ethicsValueEl = document.getElementById('cpdEthicsHoursValue');
    const ethicsSublabelEl = document.getElementById('cpdEthicsHoursSublabel');
    
    if (ethicsValueEl || ethicsSublabelEl) {
        const ethicsHours = parseFloat(progress.ethics_hours_logged || progress.ethics_hours_earned || progress.ethics_hours || 0);
        const ethicsRequired = parseFloat(cycle.required_ethics_hours || 3);
        
        if (ethicsValueEl) {
            ethicsValueEl.textContent = Math.round(ethicsHours) || 0;
        }
        
        if (ethicsSublabelEl) {
            if (ethicsHours >= ethicsRequired) {
                ethicsSublabelEl.innerHTML = `<span class="badge bg-success">✅ Minimum met (${Math.round(ethicsRequired)} required)</span>`;
            } else {
                ethicsSublabelEl.innerHTML = `<span class="badge bg-warning">⚠️ ${Math.round(ethicsRequired - ethicsHours)} hours remaining</span>`;
            }
        }
    }
    
    // Update Verifiable Hours card
    const verifiableValueEl = document.getElementById('cpdVerifiableHoursValue');
    const verifiableSublabelEl = document.getElementById('cpdVerifiableHoursSublabel');
    const verifiableProgressEl = document.getElementById('cpdVerifiableHoursProgress');
    
    if (verifiableValueEl || verifiableSublabelEl || verifiableProgressEl) {
        const verifiableHours = parseFloat(progress.verifiable_hours || 0);
        const totalHours = parseFloat(progress.total_hours_logged || progress.total_hours_earned || progress.total_hours || 0);
        
        if (verifiableValueEl) {
            verifiableValueEl.textContent = Math.round(verifiableHours) || 0;
        }
        
        if (verifiableSublabelEl) {
            verifiableSublabelEl.textContent = `of ${totalHours > 0 ? Math.round(totalHours) : 0} total`;
        }
        
        if (verifiableProgressEl && totalHours > 0) {
            const percentage = Math.round((verifiableHours / totalHours) * 100);
            verifiableProgressEl.style.width = `${percentage}%`;
        }
    }
    
    // Update Activities count card
    const activitiesCountEl = document.getElementById('cpdActivitiesCountValue');
    if (activitiesCountEl) {
        const activityCount = parseInt(progress.activity_count || cpdData.activities?.length || 0);
        activitiesCountEl.textContent = activityCount;
    }
    
    // Update Technical CPD Breakdown
    const technicalHours = parseFloat(progress.technical_hours_logged || progress.technical_hours || 0);
    const technicalRequired = parseFloat(cycle.required_technical_hours || 14);
    const technicalPercentage = technicalRequired > 0 ? Math.round((technicalHours / technicalRequired) * 100) : 0;
    const technicalRemaining = Math.max(0, technicalRequired - technicalHours);
    
    const technicalLabelEl = document.getElementById('technicalHoursLabel');
    const technicalPercentageEl = document.getElementById('technicalHoursPercentage');
    const technicalProgressBar = document.getElementById('technicalHoursProgressBar');
    const technicalRemainingEl = document.getElementById('technicalHoursRemaining');
    
    if (technicalLabelEl) {
        technicalLabelEl.textContent = `Technical CPD: ${Math.round(technicalHours)} hours${technicalPercentage >= 100 ? ' ✅' : ''}`;
    }
    if (technicalPercentageEl) {
        const percentClass = technicalPercentage >= 100 ? 'text-success' : technicalPercentage >= 70 ? 'text-warning' : 'text-danger';
        technicalPercentageEl.className = percentClass;
        technicalPercentageEl.textContent = `${technicalPercentage}%`;
    }
    if (technicalProgressBar) {
        const barClass = technicalPercentage >= 100 ? 'bg-success' : technicalPercentage >= 70 ? 'bg-warning' : 'bg-danger';
        technicalProgressBar.className = `progress-bar ${barClass}`;
        technicalProgressBar.style.width = `${Math.min(technicalPercentage, 100)}%`;
        technicalProgressBar.textContent = `${Math.round(technicalHours)} / ${Math.round(technicalRequired)}`;
    }
    if (technicalRemainingEl) {
        const remainingClass = technicalRemaining === 0 ? 'text-success' : 'text-muted';
        technicalRemainingEl.className = remainingClass;
        technicalRemainingEl.textContent = technicalRemaining > 0 ? `${Math.round(technicalRemaining)} hours remaining` : 'Requirement met';
    }
    
    // Update Ethics Breakdown (in Requirements section, not the card)
    const ethicsLabelEl = document.getElementById('ethicsHoursLabel');
    const ethicsPercentageEl = document.getElementById('ethicsHoursPercentage');
    const ethicsProgressBar = document.getElementById('ethicsHoursProgressBar');
    const ethicsRemainingEl = document.getElementById('ethicsHoursRemaining');
    
    const ethicsHoursBreakdown = parseFloat(progress.ethics_hours_logged || progress.ethics_hours_earned || progress.ethics_hours || 0);
    const ethicsRequiredBreakdown = parseFloat(cycle.required_ethics_hours || 3);
    const ethicsPercentageBreakdown = ethicsRequiredBreakdown > 0 ? Math.round((ethicsHoursBreakdown / ethicsRequiredBreakdown) * 100) : 0;
    const ethicsRemainingBreakdown = Math.max(0, ethicsRequiredBreakdown - ethicsHoursBreakdown);
    
    if (ethicsLabelEl) {
        ethicsLabelEl.textContent = `Ethics: ${Math.round(ethicsHoursBreakdown)} hours${ethicsPercentageBreakdown >= 100 ? ' ✅' : ''}`;
    }
    if (ethicsPercentageEl) {
        const percentClass = ethicsPercentageBreakdown >= 100 ? 'text-success' : ethicsPercentageBreakdown >= 70 ? 'text-warning' : 'text-danger';
        ethicsPercentageEl.className = percentClass;
        ethicsPercentageEl.textContent = `${ethicsPercentageBreakdown}%`;
    }
    if (ethicsProgressBar) {
        const barClass = ethicsPercentageBreakdown >= 100 ? 'bg-success' : ethicsPercentageBreakdown >= 70 ? 'bg-warning' : 'bg-danger';
        ethicsProgressBar.className = `progress-bar ${barClass}`;
        ethicsProgressBar.style.width = `${Math.min(ethicsPercentageBreakdown, 100)}%`;
        ethicsProgressBar.textContent = `${Math.round(ethicsHoursBreakdown)} / ${Math.round(ethicsRequiredBreakdown)}`;
    }
    if (ethicsRemainingEl) {
        const remainingClass = ethicsRemainingBreakdown === 0 ? 'text-success' : 'text-muted';
        ethicsRemainingEl.className = remainingClass;
        ethicsRemainingEl.textContent = ethicsRemainingBreakdown > 0 ? `${Math.round(ethicsRemainingBreakdown)} hours remaining` : 'Requirement met';
    }
    
    // Update cycle info
    if (cpdData.cycle) {
        const cycleNameEl = document.getElementById('cpdCycleName') || document.querySelector('#dashboard .lead');
        if (cycleNameEl) {
            cycleNameEl.textContent = cpdData.cycle.cycle_name || 'Current Cycle';
        }
        
        const cyclePeriodEl = document.getElementById('cpdCyclePeriod') || document.querySelector('#dashboard [data-cycle-period]');
        if (cyclePeriodEl && cpdData.cycle.start_date && cpdData.cycle.end_date) {
            const startDate = new Date(cpdData.cycle.start_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
            const endDate = new Date(cpdData.cycle.end_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
            cyclePeriodEl.textContent = `${startDate} - ${endDate}`;
        }
        
        // Update days remaining
        const daysRemainingEl = document.getElementById('cpdDaysRemaining');
        const daysUntilDeadlineEl = document.getElementById('cpdDaysUntilDeadline');
        const statusBadgeEl = document.getElementById('cpdStatusBadge');
        if (cpdData.cycle.end_date) {
            const cycleEnd = new Date(cpdData.cycle.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysRemaining = Math.ceil((cycleEnd - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemainingEl) {
                daysRemainingEl.textContent = `${daysRemaining} days`;
            }
            if (daysUntilDeadlineEl) {
                daysUntilDeadlineEl.textContent = `${daysRemaining} days until deadline`;
            }
            if (statusBadgeEl) {
                if (daysRemaining < 30) {
                    statusBadgeEl.className = 'badge bg-danger fs-6';
                    statusBadgeEl.textContent = '⚠️ URGENT';
                } else if (daysRemaining < 90) {
                    statusBadgeEl.className = 'badge bg-warning fs-6';
                    statusBadgeEl.textContent = '⚠️ IN PROGRESS';
                } else {
                    statusBadgeEl.className = 'badge bg-info fs-6';
                    statusBadgeEl.textContent = '✅ ON TRACK';
                }
            }
        }
    }
}

function initializeCharts() {
    // Destroy existing charts before creating new ones
    if (cpdData.charts.verifiableChart) {
        cpdData.charts.verifiableChart.destroy();
        cpdData.charts.verifiableChart = null;
    }
    
    // Verifiable Status Pie Chart
    const ctx = document.getElementById('verifiableChart');
    if (ctx) {
        const progress = cpdData.progress || {};
        const verifiableHours = parseFloat(progress.verifiable_hours || 0);
        const totalHours = parseFloat(progress.total_hours_logged || progress.total_hours_earned || progress.total_hours || 0);
        const nonVerifiableHours = Math.max(0, totalHours - verifiableHours);
        
        console.log('📊 Verifiable chart data:', {
            verifiableHours,
            totalHours,
            nonVerifiableHours
        });
        
        // If no data, show placeholder
        if (totalHours === 0) {
            const chartCard = ctx.closest('.card-body');
            if (chartCard) {
                chartCard.innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                        <p class="text-muted">No CPD hours logged yet</p>
                        <small class="text-muted">Verifiable hours will be tracked here</small>
                    </div>
                `;
            }
            return;
        }
        
        cpdData.charts.verifiableChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Verifiable', 'Non-verifiable'],
                datasets: [{
                    data: [verifiableHours, nonVerifiableHours],
                    backgroundColor: [
                        '#17A2B8',
                        '#6c757d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        // Update chart legend text
        const verifiableLabel = document.querySelector('#dashboard .badge.bg-info')?.parentElement?.querySelector('span:last-child');
        const nonVerifiableLabel = document.querySelector('#dashboard .badge.bg-secondary')?.parentElement?.querySelector('span:last-child');
        
        if (verifiableLabel && totalHours > 0) {
            const percentage = Math.round((verifiableHours / totalHours) * 100);
            verifiableLabel.textContent = `Verifiable: ${Math.round(verifiableHours)} hours (${percentage}%)`;
        }
        if (nonVerifiableLabel && totalHours > 0) {
            const percentage = Math.round((nonVerifiableHours / totalHours) * 100);
            nonVerifiableLabel.textContent = `Non-verifiable: ${Math.round(nonVerifiableHours)} hours (${percentage}%)`;
        }
    }
}

/**
 * Render CPD Alerts & Reminders
 */
function renderCpdAlerts() {
    const container = document.getElementById('cpdAlertsContainer');
    if (!container || !cpdData.cycle || !cpdData.progress) return;
    
    const progress = cpdData.progress;
    const cycle = cpdData.cycle;
    const activities = cpdData.activities || [];
    
    const totalHours = parseFloat(progress.total_hours_logged || 0);
    const requiredHours = parseFloat(cycle.required_hours || 18);
    const ethicsHours = parseFloat(progress.ethics_hours_logged || 0);
    const requiredEthics = parseFloat(cycle.required_ethics_hours || 3);
    const hoursRemaining = Math.max(0, requiredHours - totalHours);
    
    // Calculate days remaining
    const endDate = new Date(cycle.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    // Count pending activities
    const pendingCount = activities.filter(a => a.status === 'pending').length;
    
    let alerts = [];
    
    // Alert 1: Hours remaining (if not compliant)
    if (hoursRemaining > 0) {
        const urgency = hoursRemaining > 10 ? 'warning' : hoursRemaining > 5 ? 'danger' : 'danger';
        const icon = hoursRemaining > 10 ? 'exclamation-triangle' : 'exclamation-circle';
        alerts.push(`
            <div class="alert alert-${urgency} d-flex align-items-center mb-3">
                <i class="fas fa-${icon} fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${hoursRemaining > 10 ? 'CPD Progress Update' : 'CPD Deadline Approaching!'}</h6>
                    <p class="mb-0">You have <strong>${daysRemaining} days</strong> remaining to complete <strong>${Math.round(hoursRemaining)} CPD hours</strong></p>
                </div>
                <button class="btn btn-${urgency}" onclick="switchTab('upload-tab')">
                    <i class="fas fa-upload me-1"></i>Upload Activity
                </button>
            </div>
        `);
    } else {
        // Compliant!
        alerts.push(`
            <div class="alert alert-success d-flex align-items-center mb-3">
                <i class="fas fa-check-circle fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">CPD Requirement Met! 🎉</h6>
                    <p class="mb-0">You've completed <strong>${Math.round(totalHours)} hours</strong> (${Math.round((totalHours/requiredHours)*100)}% of requirement)</p>
                </div>
            </div>
        `);
    }
    
    // Alert 2: Ethics requirement
    if (ethicsHours < requiredEthics) {
        const ethicsRemaining = requiredEthics - ethicsHours;
        alerts.push(`
            <div class="alert alert-danger d-flex align-items-center mb-3">
                <i class="fas fa-shield-alt fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">Ethics Hours Required</h6>
                    <p class="mb-0">You need <strong>${ethicsRemaining.toFixed(1)} more ethics hours</strong> (${ethicsHours.toFixed(1)}/${requiredEthics} completed)</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="switchTab('upload-tab')">
                    <i class="fas fa-plus me-1"></i>Add Ethics CPD
                </button>
            </div>
        `);
    } else {
        alerts.push(`
            <div class="alert alert-success d-flex align-items-center mb-3">
                <i class="fas fa-shield-check fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">Ethics Requirement Met ✅</h6>
                    <p class="mb-0">You've completed <strong>${ethicsHours.toFixed(1)} hours</strong> of Ethics CPD (${Math.round((ethicsHours/requiredEthics)*100)}%)</p>
                </div>
            </div>
        `);
    }
    
    // Alert 3: Pending activities
    if (pendingCount > 0) {
        alerts.push(`
            <div class="alert alert-info d-flex align-items-center mb-3">
                <i class="fas fa-clock fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">Awaiting Verification</h6>
                    <p class="mb-0"><strong>${pendingCount} ${pendingCount === 1 ? 'activity' : 'activities'}</strong> pending approval by Compliance Officer</p>
                </div>
                <button class="btn btn-info btn-sm" onclick="switchTab('log-tab')">
                    <i class="fas fa-list me-1"></i>View Pending
                </button>
            </div>
        `);
    }
    
    // Alert 4: No activities logged (if critical)
    if (activities.length === 0) {
        alerts = [`
            <div class="alert alert-danger d-flex align-items-center mb-3">
                <i class="fas fa-exclamation-circle fa-2x me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">No CPD Activities Logged!</h6>
                    <p class="mb-0">You haven't logged any CPD activities for this cycle yet. <strong>${daysRemaining} days</strong> remaining to complete <strong>${requiredHours} hours</strong>.</p>
                </div>
                <button class="btn btn-danger" onclick="switchTab('upload-tab')">
                    <i class="fas fa-plus me-1"></i>Upload First Activity
                </button>
            </div>
        `];
    }
    
    // Render alerts
    if (alerts.length > 0) {
        container.innerHTML = alerts.join('');
    } else {
        container.innerHTML = `
            <div class="text-center py-3 text-muted">
                <i class="fas fa-check-circle fa-2x mb-2 text-success"></i>
                <p class="mb-0">No alerts - All requirements met!</p>
            </div>
        `;
    }
}

/**
 * Render Recent Activities
 */
function renderRecentActivities() {
    const activityList = document.querySelector('#dashboard .activity-list');
    if (!activityList || !cpdData.activities) return;
    
    // Sort by date (most recent first) and take first 5
    const recentActivities = [...cpdData.activities]
        .sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date))
        .slice(0, 5);
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>No activities logged yet. <a href="#" onclick="switchTab('upload-tab')">Upload your first activity</a>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentActivities.map(activity => {
        const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
        const statusBadge = activity.status === 'verified' 
            ? '<span class="badge bg-success">✅ Verified</span>'
            : activity.status === 'pending'
            ? '<span class="badge bg-warning">⏳ Awaiting approval</span>'
            : activity.status === 'rejected'
            ? '<span class="badge bg-danger">❌ Rejected</span>'
            : '<span class="badge bg-secondary">Draft</span>';
        
        const verifiableBadge = activity.verifiable 
            ? '<span class="badge bg-primary">Verifiable</span>'
            : '<span class="badge bg-secondary">Non-verifiable</span>';
        
        const certificateLink = activity.certificate_attached
            ? `<a href="#" class="ms-2">Certificate - Download</a>`
            : '';
        
        return `
            <div class="activity-item">
                <div class="activity-icon bg-${activity.status === 'verified' ? 'success' : activity.status === 'pending' ? 'warning' : 'secondary'}">
                    <i class="fas fa-${activity.status === 'verified' ? 'check' : 'clock'}"></i>
                </div>
                <div class="activity-content">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h6 class="mb-1">${activity.activity_name || 'Untitled Activity'}</h6>
                            <p class="mb-1 small text-muted">
                                <span class="badge bg-primary">${activity.provider_name || 'Unknown Provider'}</span>
                                ${verifiableBadge}
                                | ${date} | ${activity.total_hours || 0} hrs | ${activity.activity_type || 'Other'}
                            </p>
                            <p class="mb-0 small">
                                ${statusBadge}
                                ${certificateLink}
                            </p>
                        </div>
                        <div class="activity-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewCpdActivity('${activity.id}')">View</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editCpdActivity('${activity.id}')">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCycleInfo() {
    if (!cpdData.cycle || !cpdData.cycle.end_date) return;
    
    // Calculate days remaining
    const cycleEnd = new Date(cpdData.cycle.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((cycleEnd - today) / (1000 * 60 * 60 * 24));
    
    // Update any elements that show days remaining
    const daysElements = document.querySelectorAll('[data-days-remaining]');
    daysElements.forEach(el => {
        el.textContent = daysRemaining;
    });
    
    // Update cycle status badge
    const statusBadge = document.querySelector('#dashboard .badge.bg-warning');
    if (statusBadge) {
        if (daysRemaining < 30) {
            statusBadge.className = 'badge bg-danger fs-6';
            statusBadge.textContent = '⚠️ URGENT';
        } else if (daysRemaining < 90) {
            statusBadge.className = 'badge bg-warning fs-6';
            statusBadge.textContent = '⚠️ IN PROGRESS';
        } else {
            statusBadge.className = 'badge bg-info fs-6';
            statusBadge.textContent = '✅ ON TRACK';
        }
    }
    
    // Update alerts
    const progress = cpdData.progress || {};
    const hoursEarned = parseFloat(progress.total_hours_logged || progress.total_hours_earned || progress.total_hours || 0);
    const hoursRequired = parseFloat(cpdData.cycle.required_hours || 18);
    const hoursRemaining = Math.max(0, hoursRequired - hoursEarned);
    
    const deadlineAlert = document.querySelector('#dashboard .alert-warning');
    if (deadlineAlert && hoursRemaining > 0) {
        const alertText = deadlineAlert.querySelector('p');
        if (alertText) {
            alertText.textContent = `You have ${daysRemaining} days remaining to complete ${Math.round(hoursRemaining)} CPD hours`;
        }
    }
}

/**
 * View CPD Activity
 */
function viewCpdActivity(activityId) {
    const activity = cpdData.activities.find(a => a.id === activityId);
    if (!activity) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Activity not found'
        });
        return;
    }
    
    const date = new Date(activity.activity_date).toLocaleDateString('en-ZA');
    
    Swal.fire({
        title: activity.activity_name || 'Activity Details',
        html: `
            <div class="text-start">
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Provider:</strong> ${activity.provider_name || 'N/A'}</p>
                <p><strong>Type:</strong> ${activity.activity_type || 'N/A'}</p>
                <p><strong>Total Hours:</strong> ${activity.total_hours || 0}</p>
                <p><strong>Ethics Hours:</strong> ${activity.ethics_hours || 0}</p>
                <p><strong>Technical Hours:</strong> ${activity.technical_hours || 0}</p>
                <p><strong>Status:</strong> <span class="badge bg-${activity.status === 'verified' ? 'success' : activity.status === 'pending' ? 'warning' : 'secondary'}">${activity.status || 'Draft'}</span></p>
                <p><strong>Verifiable:</strong> ${activity.verifiable ? 'Yes' : 'No'}</p>
                ${activity.certificate_attached ? '<p><strong>Certificate:</strong> Attached</p>' : ''}
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        cancelButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            editCpdActivity(activityId);
        }
    });
}

/**
 * Edit CPD Activity
 */
function editCpdActivity(activityId) {
    // Switch to upload tab and load activity data
    switchTab('upload-tab');
    // TODO: Load activity data into form
    console.log('Edit activity:', activityId);
}

// Export functions
window.viewCpdActivity = viewCpdActivity;
window.editCpdActivity = editCpdActivity;
window.refreshCpdData = refreshCpdData;
window.switchToMyRep = switchToMyRep;

function setupTabSwitching() {
    // Handle tab changes
    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target');
            console.log('📑 Tab shown:', targetId);
            
            // Initialize specific tab content when shown
            if (targetId === '#log' && typeof window.initializeActivityLog === 'function') {
                window.initializeActivityLog();
            } else if (targetId === '#upload' && typeof window.initializeUploadActivity === 'function') {
                window.initializeUploadActivity();
            } else if (targetId === '#providers' && typeof window.initializeProvidersTab === 'function') {
                window.initializeProvidersTab();
            }
        });
    });
}

function switchTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

function initializeActivityLog() {
    // Initialize activity log functionality
    console.log('Activity log initialized');
}

function initializeUploadForm() {
    // Initialize upload form functionality
    setupFileUpload();
    setupUploadMethodSelection();
}

function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('certificateFile');
    
    if (uploadZone && fileInput) {
        // Click to browse
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

function handleFileUpload(file) {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a PDF, JPG, or PNG file.'
        });
        return;
    }
    
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be less than 5MB.'
        });
        return;
    }
    
    // Show preview
    showFilePreview(file);
}

function showFilePreview(file) {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadZone.innerHTML = `
                <div class="text-center py-3">
                    <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                    <p class="mb-1"><strong>${file.name}</strong></p>
                    <p class="small text-muted mb-2">${(file.size / 1024).toFixed(2)} KB</p>
                    <button class="btn btn-sm btn-outline-primary me-2">View</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFile()">Remove</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function removeFile() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('certificateFile');
    
    if (uploadZone) {
        uploadZone.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-cloud-upload-alt fa-4x text-muted mb-3"></i>
                <p class="mb-2"><strong>Drag & drop your certificate here</strong></p>
                <p class="text-muted mb-3">or</p>
                <button class="btn btn-primary">Browse Files</button>
                <p class="mt-3 small text-muted">PDF, JPG, PNG - Max 5MB</p>
            </div>
        `;
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
}

function setupUploadMethodSelection() {
    const methodCards = document.querySelectorAll('.upload-method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all
            methodCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            toggleUploadForm(method);
        });
    });
}

function toggleUploadForm(method) {
    const certificateForm = document.getElementById('certificateUploadForm');
    // Show/hide form sections based on method
    // This would show manual entry form if method === 'manual'
}

// Export function for tab switching
window.switchTab = switchTab;

