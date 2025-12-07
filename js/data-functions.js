/**
 * Data Functions Module for iComply
 * Handles all CRUD operations and data management functionality
 * Organized by implementation phases from supabase_implementation_sequence.md
 */

var _dataFunctions = function () {
    return {
        proxyUrl: 'https://o4n4qwc7mtdgzqhjkscuheyvji0seljg.lambda-url.af-south-1.on.aws/proxy/function',

        init: function () {
        },

        /**
         * Get current authentication token
         */
        getToken: function () {
            // First try to get from authService if available
            if (typeof authService !== 'undefined' && authService.token) {
                return authService.token;
            }
            // Fallback to localStorage
            return localStorage.getItem('lambda_token');
        },

        /**
         * Check if user is authenticated
         */
        isAuthenticated: function () {
            const token = this.getToken();
            return !!token;
        },

        /**
         * Get authentication status info
         */
        getAuthStatus: function () {
            const token = this.getToken();
            const userInfo = localStorage.getItem('user_info');

            return {
                hasToken: !!token,
                tokenLength: token ? token.length : 0,
                hasUserInfo: !!userInfo,
                userInfo: userInfo ? JSON.parse(userInfo) : null,
                authServiceAvailable: typeof authService !== 'undefined'
            };
        },

        /**
         * Check if current user has admin privileges
         */
        hasAdminRole: function () {
            const userInfo = localStorage.getItem('user_info');
            if (!userInfo) return false;

            const user = JSON.parse(userInfo);
            const roleName = user.role_name || user.role || '';

            return roleName.toLowerCase().includes('admin') ||
                roleName.toLowerCase().includes('super admin');
        },

        /**
         * Debug function to show current user info
         */
        debugUserInfo: function () {
            const authStatus = this.getAuthStatus();
            return authStatus;
        },

        /**
         * Generic function call to Lambda proxy
         */
        callFunction: async function (functionName, params = {}, token = null) {
            const authToken = token || this.getToken();

            if (!authToken) {
                throw new Error('No authentication token available. Please sign in again.');
            }

            try {
                const response = await fetch(this.proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        function: functionName,
                        params: params
                    })
                });

                if (!response.ok) {
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    let errorData = null;
                    try {
                        const responseText = await response.text();
                        try {
                            errorData = JSON.parse(responseText);
                            errorMessage = errorData.message || errorData.error || errorMessage;
                        } catch (e) {
                            errorMessage = responseText || response.statusText || errorMessage;
                        }
                    } catch (e) {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}`);
                }
                return data;

            } catch (error) {
                throw error;
            }
        },

        // ========================================================================
        // PHASE 1: FOUNDATION & AUTHENTICATION
        // ========================================================================

        // ----- FSP CONFIGURATION -----

        createFspConfiguration: async function (data, token = null) {
            return await this.callFunction('create_fsp_configuration', {
                p_fsp_name: data.fsp_name,
                p_fsp_license_number: data.fsp_license_number,
                p_registration_number: data.registration_number || null,
                p_vat_number: data.vat_number || null,
                p_address_street: data.address_street || null,
                p_address_city: data.address_city || null,
                p_address_province: data.address_province || null,
                p_address_postal_code: data.address_postal_code || null,
                p_phone: data.phone || null,
                p_email: data.email || null,
                p_website: data.website || null
            }, token);
        },

        getFspConfiguration: async function (token = null) {
            return await this.callFunction('get_fsp_configuration', {}, token);
        },

        /**
         * Get Key Individuals count
         */
        getKeyIndividualsCount: async function (token = null) {
            return await this.callFunction('get_key_individuals_count', {}, token);
        },

        updateFspConfiguration: async function (id, data, token = null) {
            return await this.callFunction('update_fsp_configuration', {
                p_id: id,
                p_fsp_name: data.fsp_name || null,
                p_fsp_license_number: data.fsp_license_number || null,
                p_registration_number: data.registration_number || null,
                p_vat_number: data.vat_number || null,
                p_address_street: data.address_street || null,
                p_address_city: data.address_city || null,
                p_address_province: data.address_province || null,
                p_address_postal_code: data.address_postal_code || null,
                p_phone: data.phone || null,
                p_email: data.email || null,
                p_website: data.website || null
            }, token);
        },

        // ----- SYSTEM SETTINGS -----

        createSystemSetting: async function (data, token = null) {
            return await this.callFunction('create_system_setting', {
                p_setting_key: data.setting_key,
                p_setting_value: data.setting_value,
                p_setting_type: data.setting_type,
                p_category: data.setting_category || null,
                p_description: data.description || null
            }, token);
        },

        getSystemSettings: async function (category = null, token = null) {
            return await this.callFunction('get_system_settings', {
                p_category: category
            }, token);
        },

        updateSystemSetting: async function (id, data, token = null) {
            return await this.callFunction('update_system_setting', {
                p_id: id,
                p_setting_value: data.setting_value || null,
                p_description: data.description || null
            }, token);
        },

        deleteSystemSetting: async function (id, token = null) {
            return await this.callFunction('delete_system_setting', {
                p_id: id
            }, token);
        },

        // ----- USER ROLES -----

        createUserRole: async function (data, token = null) {
            return await this.callFunction('create_user_role', {
                p_role_name: data.role_name,
                p_role_display_name: data.role_display_name,
                p_role_description: data.role_description || null,
                p_permissions: data.permissions || {}
            }, token);
        },

        getUserRoles: async function (token = null) {
            return await this.callFunction('get_user_roles', {}, token);
        },

        updateUserRole: async function (id, data, token = null) {
            return await this.callFunction('update_user_role', {
                p_id: id,
                p_role_display_name: data.role_display_name || null,
                p_role_description: data.role_description || null,
                p_permissions: data.permissions || null
            }, token);
        },

        deleteUserRole: async function (id, token = null) {
            return await this.callFunction('delete_user_role', {
                p_id: id
            }, token);
        },

        // ----- USER PROFILES -----

        createUserProfile: async function (data, token = null) {
            return await this.callFunction('create_user_profile', {
                p_id: data.id, // UUID matching auth.users.id
                p_role_id: data.role_id,
                p_first_name: data.first_name,
                p_last_name: data.last_name,
                p_email: data.email,
                p_phone: data.phone || null,
                p_mobile: data.mobile || null,
                p_id_number: data.id_number || null,
                p_fsp_number: data.fsp_number || null,
                p_status: data.status || 'active'
            }, token);
        },

        getUserProfiles: async function (statusOrParams = 'active', token = null) {
            // Handle both call formats:
            // 1. getUserProfiles('active', token) - simple status string
            // 2. getUserProfiles({ p_status: 'active' }, token) - params object
            let status = 'active';

            if (typeof statusOrParams === 'string') {
                status = statusOrParams;
            } else if (statusOrParams && typeof statusOrParams === 'object') {
                status = statusOrParams.p_status || 'active';
            }

            return await this.callFunction('get_user_profiles', {
                p_status: status
            }, token);
        },

        getUserProfile: async function (userId, token = null) {
            return await this.callFunction('get_user_profile', {
                p_id: userId
            }, token);
        },

        updateUserProfile: async function (id, data, token = null) {
            return await this.callFunction('update_user_profile', {
                p_id: id,
                p_role_id: data.role_id || null,
                p_first_name: data.first_name || null,
                p_last_name: data.last_name || null,
                p_phone: data.phone || null,
                p_mobile: data.mobile || null,
                p_id_number: data.id_number || null,
                p_fsp_number: data.fsp_number || null,
                p_status: data.status || null
            }, token);
        },

        deleteUserProfile: async function (id, token = null) {
            return await this.callFunction('delete_user_profile', {
                p_id: id
            }, token);
        },

        linkUserToRepresentative: async function (userProfileId, representativeId, token = null) {
            return await this.callFunction('link_user_to_representative', {
                p_user_profile_id: userProfileId,
                p_representative_id: representativeId
            }, token);
        },

        // ========================================================================
        // PHASE 2: REPRESENTATIVES & KEY INDIVIDUALS
        // ========================================================================

        // ----- REPRESENTATIVES -----

        createRepresentative: async function (data, token = null) {
            // Use the comprehensive function that handles all representative details
            return await this.callFunction('create_representative_full', {
                p_first_name: data.first_name,
                p_surname: data.surname || data.last_name,
                p_id_number: data.id_number,
                p_fsp_number: data.fsp_number || data.representative_number || null,
                p_supervised_by_ki_id: data.supervised_by_ki_id || null,
                p_class_1_long_term: data.class_1_long_term || false,
                p_class_2_short_term: data.class_2_short_term || false,
                p_class_3_pension: data.class_3_pension || false,
                p_status: data.status || 'active',
                p_onboarding_date: data.onboarding_date || null,
                p_authorization_date: data.authorization_date || null,
                p_user_profile_id: data.user_profile_id || null
            }, token);
        },

        getRepresentatives: async function (status = 'active', token = null) {
            // If status is explicitly null or undefined, pass null to get all
            const statusParam = (status === null || status === undefined) ? null : status;
            return await this.callFunction('get_representatives', {
                p_status: statusParam
            }, token);
        },

        getRepresentative: async function (id, token = null) {
            return await this.callFunction('get_representative', {
                p_id: id
            }, token);
        },

        updateRepresentative: async function (id, data, token = null) {
            return await this.callFunction('update_representative', {
                p_id: id,
                p_supervised_by_ki_id: data.supervised_by_ki_id || null,
                p_class_1_long_term: data.class_1_long_term !== undefined ? data.class_1_long_term : null,
                p_class_2_short_term: data.class_2_short_term !== undefined ? data.class_2_short_term : null,
                p_class_3_pension: data.class_3_pension !== undefined ? data.class_3_pension : null,
                p_status: data.status || null,
                p_authorization_date: data.authorization_date || null,
                p_deauthorization_date: data.deauthorization_date || null,
                p_deauthorization_reason: data.deauthorization_reason || null
            }, token);
        },

        deleteRepresentative: async function (id, token = null) {
            return await this.callFunction('delete_representative', {
                p_id: id
            }, token);
        },

        // ----- KEY INDIVIDUALS -----

        createKeyIndividual: async function (data, token = null) {
            return await this.callFunction('create_key_individual', {
                p_first_name: data.first_name,
                p_last_name: data.last_name,
                p_id_number: data.id_number,
                p_position_title: data.position_title,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_appointment_date: data.appointment_date || null,
                p_status: data.status || 'active'
            }, token);
        },

        getKeyIndividuals: async function (status = 'active', token = null) {
            // Use the new function that returns active key individuals with representative details
            if (status === 'active') {
                return await this.callFunction('get_active_key_individuals', {}, token);
            } else {
                // Fallback to original function for other statuses
                return await this.callFunction('get_key_individuals', {
                    p_ki_type: null
                }, token);
            }
        },

        updateKeyIndividual: async function (id, data, token = null) {
            // Use the full update function that supports appointment_date
            return await this.callFunction('update_key_individual_full', {
                p_id: id,
                p_appointment_date: data.appointment_date || null,
                p_resignation_date: data.resignation_date || null,
                p_max_supervised_count: data.max_supervised_count || null
            }, token);
        },

        deleteKeyIndividual: async function (id, token = null) {
            return await this.callFunction('delete_key_individual', {
                p_id: id
            }, token);
        },

        // ----- SUPERVISION RECORDS -----

        createSupervisionRecord: async function (data, token = null) {
            return await this.callFunction('create_supervision_record', {
                p_representative_id: data.representative_id,
                p_supervision_date: data.supervision_date,
                p_supervision_type: data.supervision_type,
                p_conducted_by: data.conducted_by,
                p_findings: data.findings || null,
                p_action_items: data.action_items || null,
                p_outcome: data.outcome || null
            }, token);
        },

        getSupervisionRecords: async function (representativeId = null, token = null) {
            return await this.callFunction('get_supervision_records', {
                p_representative_id: representativeId
            }, token);
        },

        updateSupervisionRecord: async function (id, data, token = null) {
            return await this.callFunction('update_supervision_record', {
                p_id: id,
                p_findings: data.findings || null,
                p_action_items: data.action_items || null,
                p_outcome: data.outcome || null,
                p_follow_up_date: data.follow_up_date || null
            }, token);
        },

        deleteSupervisionRecord: async function (id, token = null) {
            return await this.callFunction('delete_supervision_record', {
                p_id: id
            }, token);
        },

        // ========================================================================
        // PHASE 3: CORE COMPLIANCE TRACKING
        // ========================================================================

        // ----- FIT AND PROPER RECORDS -----

        createFitAndProperRecord: async function (data, token = null) {
            return await this.callFunction('create_fit_and_proper_record', {
                p_individual_id: data.individual_id,
                p_individual_type: data.individual_type,
                p_assessment_date: data.assessment_date,
                p_assessment_type: data.assessment_type,
                p_assessment_outcome: data.assessment_outcome || null,
                p_expiry_date: data.expiry_date || null,
                p_conducted_by: data.conducted_by || null
            }, token);
        },

        getFitAndProperRecords: async function (individualId = null, individualType = null, token = null) {
            return await this.callFunction('get_fit_and_proper_records', {
                p_individual_id: individualId,
                p_individual_type: individualType
            }, token);
        },

        updateFitAndProperRecord: async function (id, data, token = null) {
            return await this.callFunction('update_fit_and_proper_record', {
                p_id: id,
                p_assessment_outcome: data.assessment_outcome || null,
                p_expiry_date: data.expiry_date || null,
                p_notes: data.notes || null
            }, token);
        },

        deleteFitAndProperRecord: async function (id, token = null) {
            return await this.callFunction('delete_fit_and_proper_record', {
                p_id: id
            }, token);
        },

        // ----- CPD CYCLES -----

        createCpdCycle: async function (data, token = null) {
            return await this.callFunction('create_cpd_cycle', {
                p_cycle_name: data.cycle_name,
                p_start_date: data.start_date,
                p_end_date: data.end_date,
                p_required_hours: data.required_hours || 30,
                p_description: data.description || null
            }, token);
        },

        getCpdCycles: async function (status = 'active', token = null) {
            return await this.callFunction('get_cpd_cycles', {
                p_status: status
            }, token);
        },

        updateCpdCycle: async function (id, data, token = null) {
            return await this.callFunction('update_cpd_cycle', {
                p_id: id,
                p_status: data.status || null,
                p_description: data.description || null
            }, token);
        },

        // ----- CPD ACTIVITIES -----

        createCpdActivity: async function (data, token = null) {
            return await this.callFunction('create_cpd_activity', {
                p_representative_id: data.representative_id,
                p_cpd_cycle_id: data.cpd_cycle_id,
                p_activity_date: data.activity_date,
                p_activity_name: data.activity_name || data.activity_title,
                p_activity_type: data.activity_type || null,
                p_provider_name: data.provider_name || null,
                p_total_hours: data.total_hours || data.hours_claimed || 0,
                p_ethics_hours: data.ethics_hours || 0,
                p_technical_hours: data.technical_hours || 0,
                p_class_1_applicable: data.class_1_applicable || false,
                p_class_2_applicable: data.class_2_applicable || false,
                p_class_3_applicable: data.class_3_applicable || false,
                p_verifiable: data.verifiable !== undefined ? data.verifiable : true,
                p_certificate_attached: data.certificate_attached || false,
                p_uploaded_by: data.uploaded_by || null
            }, token);
        },

        getCpdActivities: async function (representativeId = null, cycleId = null, token = null) {
            return await this.callFunction('get_cpd_activities', {
                p_representative_id: representativeId,
                p_cpd_cycle_id: cycleId
            }, token);
        },

        updateCpdActivity: async function (id, data, token = null) {
            return await this.callFunction('update_cpd_activity', {
                p_id: id,
                p_activity_name: data.activity_name || null,
                p_total_hours: data.total_hours || data.hours_claimed || null,
                p_ethics_hours: data.ethics_hours || null,
                p_technical_hours: data.technical_hours || null,
                p_certificate_attached: data.certificate_attached || null
            }, token);
        },

        deleteCpdActivity: async function (id, token = null) {
            return await this.callFunction('delete_cpd_activity', {
                p_id: id
            }, token);
        },

        getCpdProgressSummary: async function (cycleId = null, representativeId = null, token = null) {
            return await this.callFunction('get_cpd_progress_summary', {
                p_representative_id: representativeId,
                p_cpd_cycle_id: cycleId
            }, token);
        },
        
        // CPD Providers CRUD
        getCpdProviders: async function (activeOnly = true, token = null) {
            const query = activeOnly 
                ? 'SELECT * FROM cpd_providers WHERE is_active = true ORDER BY provider_name'
                : 'SELECT * FROM cpd_providers ORDER BY provider_name';
            return await this.queryTable('cpd_providers', query, token);
        },
        
        createCpdProvider: async function (data, token = null) {
            return await this.insertRecord('cpd_providers', {
                provider_name: data.provider_name,
                provider_type: data.provider_type || 'other',
                accreditation_number: data.accreditation_number || null,
                contact_person: data.contact_person || null,
                contact_email: data.contact_email || null,
                contact_phone: data.contact_phone || null,
                website_url: data.website_url || null,
                is_accredited: data.is_accredited || false,
                is_active: data.is_active !== false,
                notes: data.notes || null
            }, token);
        },
        
        updateCpdProvider: async function (id, data, token = null) {
            return await this.updateRecord('cpd_providers', id, {
                provider_name: data.provider_name,
                provider_type: data.provider_type,
                accreditation_number: data.accreditation_number,
                contact_person: data.contact_person,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                website_url: data.website_url,
                is_accredited: data.is_accredited,
                is_active: data.is_active,
                notes: data.notes,
                updated_at: new Date().toISOString()
            }, token);
        },
        
        deleteCpdProvider: async function (id, token = null) {
            // Soft delete by marking as inactive
            return await this.updateRecord('cpd_providers', id, {
                is_active: false,
                updated_at: new Date().toISOString()
            }, token);
        },

        // ========================================================================
        // PHASE 4: CLIENTS & FICA
        // ========================================================================

        // ----- CLIENTS -----

        createClient: async function (data, token = null) {
            return await this.callFunction('create_client', {
                p_assigned_representative_id: data.assigned_representative_id || null,
                p_client_type: data.client_type,
                p_title: data.title || null,
                p_first_name: data.first_name || null,
                p_last_name: data.last_name || null,
                p_id_number: data.id_number || null,
                p_date_of_birth: data.date_of_birth || null,
                p_company_name: data.company_name || null,
                p_registration_number: data.registration_number || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_mobile: data.mobile || null,
                p_client_since: data.client_since || data.onboarding_date || null,
                p_risk_category: data.risk_category || 'low'
            }, token);
        },

        getClients: async function (assignedRepresentativeId = null, clientType = null, status = 'active', riskCategory = null, token = null) {
            return await this.callFunction('get_clients', {
                p_assigned_representative_id: assignedRepresentativeId,
                p_client_type: clientType,
                p_status: status,
                p_risk_category: riskCategory
            }, token);
        },

        getClient: async function (id, token = null) {
            return await this.callFunction('get_client', {
                p_id: id
            }, token);
        },

        updateClient: async function (id, data, token = null) {
            return await this.callFunction('update_client', {
                p_id: id,
                p_assigned_representative_id: data.assigned_representative_id || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_mobile: data.mobile || null,
                p_address_street: data.address_street || null,
                p_address_city: data.address_city || null,
                p_address_province: data.address_province || null,
                p_address_postal_code: data.address_postal_code || null,
                p_status: data.status || null,
                p_risk_category: data.risk_category || null,
                p_pep_status: data.pep_status || null
            }, token);
        },

        deleteClient: async function (id, token = null) {
            return await this.callFunction('delete_client', {
                p_id: id
            }, token);
        },

        // ----- FICA VERIFICATIONS -----

        createFicaVerification: async function (data, token = null) {
            return await this.callFunction('create_fica_verification', {
                p_client_id: data.client_id,
                p_representative_id: data.representative_id || null,
                p_verification_type: data.verification_type,
                p_verification_date: data.verification_date || null,
                p_review_frequency_months: data.review_frequency_months || 60
            }, token);
        },

        getFicaVerifications: async function (clientId = null, representativeId = null, ficaStatus = null, token = null) {
            return await this.callFunction('get_fica_verifications', {
                p_client_id: clientId,
                p_representative_id: representativeId,
                p_fica_status: ficaStatus
            }, token);
        },

        updateFicaVerification: async function (id, data, token = null) {
            return await this.callFunction('update_fica_verification', {
                p_id: id,
                p_id_document_type: data.id_document_type || null,
                p_id_document_verified: data.id_document_verified || null,
                p_address_document_verified: data.address_document_verified || null,
                p_bank_details_verified: data.bank_details_verified || null,
                p_tax_reference_verified: data.tax_reference_verified || null,
                p_fica_status: data.fica_status || null,
                p_verified_by: data.verified_by || null,
                p_verification_notes: data.verification_notes || null
            }, token);
        },

        // ----- CLIENT BENEFICIAL OWNERS -----

        createClientBeneficialOwner: async function (data, token = null) {
            return await this.callFunction('create_client_beneficial_owner', {
                p_client_id: data.client_id,
                p_full_name: data.full_name || (data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : null),
                p_id_number: data.id_number || null,
                p_nationality: data.nationality || null,
                p_ownership_percentage: data.ownership_percentage || null,
                p_control_type: data.control_type || null,
                p_pep_status: data.pep_status || false
            }, token);
        },

        getClientBeneficialOwners: async function (clientId, token = null) {
            return await this.callFunction('get_client_beneficial_owners', {
                p_client_id: clientId
            }, token);
        },

        updateClientBeneficialOwner: async function (id, data, token = null) {
            return await this.callFunction('update_client_beneficial_owner', {
                p_id: id,
                p_ownership_percentage: data.ownership_percentage || null,
                p_id_verified: data.id_verified || null,
                p_id_verification_date: data.id_verification_date || null,
                p_pep_status: data.pep_status || null
            }, token);
        },

        deleteClientBeneficialOwner: async function (id, token = null) {
            return await this.callFunction('delete_client_beneficial_owner', {
                p_id: id
            }, token);
        },

        // ========================================================================
        // PHASE 5: DOCUMENTS & COMPLAINTS
        // ========================================================================

        // ----- DOCUMENTS -----

        createDocument: async function (data, token = null) {
            return await this.callFunction('create_document', {
                p_document_owner_type: data.document_owner_type,
                p_document_owner_id: data.document_owner_id,
                p_document_name: data.document_name,
                p_document_type: data.document_type,
                p_document_category: data.document_category,
                p_file_name: data.file_name,
                p_file_size_bytes: data.file_size_bytes || null,
                p_file_type: data.file_type || null,
                p_storage_path: data.storage_path || null,
                p_storage_url: data.storage_url || null,
                p_document_date: data.document_date || null,
                p_expiry_date: data.expiry_date || null,
                p_retention_period_years: data.retention_period_years || 5,
                p_is_sensitive: data.is_sensitive || false,
                p_uploaded_by: data.uploaded_by || null
            }, token);
        },

        getDocuments: async function (ownerType = null, ownerId = null, category = null, status = 'active', token = null) {
            return await this.callFunction('get_documents', {
                p_document_owner_type: ownerType,
                p_document_owner_id: ownerId,
                p_document_category: category,
                p_status: status
            }, token);
        },

        getDocument: async function (id, token = null) {
            return await this.callFunction('get_document', {
                p_id: id
            }, token);
        },

        updateDocument: async function (id, data, token = null) {
            return await this.callFunction('update_document', {
                p_id: id,
                p_document_name: data.document_name || null,
                p_description: data.description || null,
                p_tags: data.tags || null,
                p_expiry_date: data.expiry_date || null,
                p_status: data.status || null
            }, token);
        },

        deleteDocument: async function (id, token = null) {
            return await this.callFunction('delete_document', {
                p_id: id
            }, token);
        },

        logDocumentAccess: async function (data, token = null) {
            return await this.callFunction('log_document_access', {
                p_document_id: data.document_id,
                p_accessed_by: data.accessed_by,
                p_access_type: data.access_type,
                p_ip_address: data.ip_address || null,
                p_user_agent: data.user_agent || null
            }, token);
        },

        // ----- COMPLAINTS -----

        createComplaint: async function (data, token = null) {
            return await this.callFunction('create_complaint', {
                p_complaint_reference_number: data.complaint_reference_number,
                p_complainant_name: data.complainant_name,
                p_complaint_date: data.complaint_date,
                p_complaint_received_date: data.complaint_received_date,
                p_complaint_channel: data.complaint_channel,
                p_complaint_category: data.complaint_category,
                p_complaint_description: data.complaint_description,
                p_client_id: data.client_id || null,
                p_representative_id: data.representative_id || null,
                p_complainant_email: data.complainant_email || null,
                p_complainant_phone: data.complainant_phone || null,
                p_priority: data.priority || 'medium',
                p_severity: data.severity || 'minor',
                p_assigned_to: data.assigned_to || null,
                p_created_by: data.created_by || null
            }, token);
        },

        getComplaints: async function (status = null, priority = null, assignedTo = null, representativeId = null, isOverdue = null, token = null) {
            return await this.callFunction('get_complaints', {
                p_status: status,
                p_priority: priority,
                p_assigned_to: assignedTo,
                p_representative_id: representativeId,
                p_is_overdue: isOverdue
            }, token);
        },

        getComplaint: async function (id, token = null) {
            return await this.callFunction('get_complaint', {
                p_id: id
            }, token);
        },

        updateComplaint: async function (id, data, token = null) {
            // Don't convert empty strings to null - send actual values
            return await this.callFunction('update_complaint', {
                p_id: id,
                p_status: data.status !== undefined ? data.status : null,
                p_priority: data.priority !== undefined ? data.priority : null,
                p_assigned_to: data.assigned_to !== undefined && data.assigned_to !== '' ? data.assigned_to : null,
                p_investigation_notes: data.investigation_notes !== undefined ? data.investigation_notes : null,
                p_resolution_description: data.resolution_description !== undefined ? data.resolution_description : null,
                p_resolution_date: data.resolution_date !== undefined && data.resolution_date !== '' ? data.resolution_date : null,
                p_acknowledgement_sent_date: data.acknowledgement_sent_date !== undefined && data.acknowledgement_sent_date !== '' ? data.acknowledgement_sent_date : null,
                p_root_cause: data.root_cause !== undefined ? data.root_cause : null,
                p_preventative_action: data.preventative_action !== undefined ? data.preventative_action : null
            }, token);
        },

        addComplaintCommunication: async function (data, token = null) {
            return await this.callFunction('add_complaint_communication', {
                p_complaint_id: data.complaint_id,
                p_communication_date: data.communication_date,
                p_communication_type: data.communication_type,
                p_communication_direction: data.communication_direction,
                p_from_party: data.from_party,
                p_to_party: data.to_party,
                p_message: data.message,
                p_subject: data.subject || null,
                p_logged_by: data.logged_by || null
            }, token);
        },

        getComplaintCommunications: async function (complaintId, token = null) {
            return await this.callFunction('get_complaint_communications', {
                p_complaint_id: complaintId
            }, token);
        },

        // ========================================================================
        // PHASE 6: ALERTS & MONITORING
        // ========================================================================

        // ----- ALERT RULES -----

        createAlertRule: async function (data, token = null) {
            return await this.callFunction('create_alert_rule', {
                p_rule_name: data.rule_name,
                p_rule_description: data.rule_description || null,
                p_rule_type: data.rule_type,
                p_target_entity: data.target_entity,
                p_conditions: data.conditions,
                p_priority: data.priority,
                p_alert_frequency: data.alert_frequency || 'once',
                p_send_email: data.send_email !== undefined ? data.send_email : true,
                p_send_sms: data.send_sms !== undefined ? data.send_sms : false,
                p_send_in_app: data.send_in_app !== undefined ? data.send_in_app : true,
                p_notify_representative: data.notify_representative !== undefined ? data.notify_representative : true,
                p_notify_key_individual: data.notify_key_individual !== undefined ? data.notify_key_individual : true,
                p_notify_compliance_officer: data.notify_compliance_officer !== undefined ? data.notify_compliance_officer : true,
                p_notify_fsp_owner: data.notify_fsp_owner !== undefined ? data.notify_fsp_owner : false,
                p_escalation_enabled: data.escalation_enabled !== undefined ? data.escalation_enabled : false,
                p_escalation_delay_hours: data.escalation_delay_hours || null,
                p_escalation_to_role: data.escalation_to_role || null,
                p_is_active: data.is_active !== undefined ? data.is_active : true,
                p_created_by: data.created_by || null
            }, token);
        },

        getAlertRules: async function (isActive = null, targetEntity = null, token = null) {
            return await this.callFunction('get_alert_rules', {
                p_is_active: isActive,
                p_target_entity: targetEntity
            }, token);
        },

        updateAlertRule: async function (id, data, token = null) {
            return await this.callFunction('update_alert_rule', {
                p_id: id,
                p_rule_description: data.rule_description || null,
                p_conditions: data.conditions || null,
                p_priority: data.priority || null,
                p_is_active: data.is_active || null
            }, token);
        },

        deleteAlertRule: async function (id, token = null) {
            return await this.callFunction('delete_alert_rule', {
                p_id: id
            }, token);
        },

        // ----- ALERTS -----

        createAlert: async function (data, token = null) {
            return await this.callFunction('create_alert', {
                p_alert_rule_id: data.alert_rule_id,
                p_alert_title: data.alert_title,
                p_alert_message: data.alert_message,
                p_priority: data.priority,
                p_entity_type: data.entity_type,
                p_entity_id: data.entity_id,
                p_representative_id: data.representative_id || null,
                p_client_id: data.client_id || null
            }, token);
        },

        getAlerts: async function (status = 'active', priority = null, representativeId = null, entityType = null, token = null) {
            return await this.callFunction('get_alerts', {
                p_status: status,
                p_priority: priority,
                p_representative_id: representativeId,
                p_entity_type: entityType
            }, token);
        },

        acknowledgeAlert: async function (id, acknowledgedBy, token = null) {
            return await this.callFunction('acknowledge_alert', {
                p_id: id,
                p_acknowledged_by: acknowledgedBy
            }, token);
        },

        resolveAlert: async function (id, resolvedBy, resolutionNotes = null, token = null) {
            return await this.callFunction('resolve_alert', {
                p_id: id,
                p_resolved_by: resolvedBy,
                p_resolution_notes: resolutionNotes
            }, token);
        },

        // ----- INTERNAL AUDITS -----

        createInternalAudit: async function (data, token = null) {
            return await this.callFunction('create_internal_audit', {
                p_audit_reference_number: data.audit_reference_number,
                p_audit_name: data.audit_name,
                p_audit_type: data.audit_type,
                p_audit_scope: data.audit_scope,
                p_audit_period_start: data.audit_period_start,
                p_audit_period_end: data.audit_period_end,
                p_planned_start_date: data.planned_start_date || null,
                p_planned_completion_date: data.planned_completion_date || null,
                p_lead_auditor: data.lead_auditor || null,
                p_created_by: data.created_by || null
            }, token);
        },

        getInternalAudits: async function (status = null, auditType = null, token = null) {
            return await this.callFunction('get_internal_audits', {
                p_status: status,
                p_audit_type: auditType
            }, token);
        },

        updateInternalAudit: async function (id, data, token = null) {
            return await this.callFunction('update_internal_audit', {
                p_id: id,
                p_status: data.status || null,
                p_actual_start_date: data.actual_start_date || null,
                p_actual_completion_date: data.actual_completion_date || null,
                p_overall_rating: data.overall_rating || null,
                p_executive_summary: data.executive_summary || null,
                p_key_risks_identified: data.key_risks_identified || null,
                p_recommendations: data.recommendations || null
            }, token);
        },

        createAuditFinding: async function (data, token = null) {
            return await this.callFunction('create_audit_finding', {
                p_internal_audit_id: data.internal_audit_id,
                p_finding_reference_number: data.finding_reference_number,
                p_finding_title: data.finding_title,
                p_finding_description: data.finding_description,
                p_area_audited: data.area_audited,
                p_severity: data.severity,
                p_recommendation: data.recommendation,
                p_remediation_owner: data.remediation_owner || null,
                p_remediation_due_date: data.remediation_due_date || null
            }, token);
        },

        getAuditFindings: async function (internalAuditId, remediationStatus = null, token = null) {
            return await this.callFunction('get_audit_findings', {
                p_internal_audit_id: internalAuditId,
                p_remediation_status: remediationStatus
            }, token);
        },

        // ========================================================================
        // PHASE 7: DASHBOARDS & REPORTING
        // ========================================================================

        // ----- REPORT TEMPLATES -----

        createReportTemplate: async function (data, token = null) {
            return await this.callFunction('create_report_template', {
                p_template_name: data.template_name,
                p_template_description: data.template_description,
                p_template_category: data.template_category,
                p_report_type: data.report_type,
                p_data_sources: data.data_sources,
                p_report_structure: data.report_structure,
                p_created_by: data.created_by || null
            }, token);
        },

        getReportTemplates: async function (templateCategory = null, isActive = true, token = null) {
            return await this.callFunction('get_report_templates', {
                p_template_category: templateCategory,
                p_is_active: isActive
            }, token);
        },

        generateReport: async function (data, token = null) {
            return await this.callFunction('generate_report', {
                p_report_template_id: data.report_template_id,
                p_report_name: data.report_name,
                p_date_range_start: data.date_range_start || null,
                p_date_range_end: data.date_range_end || null,
                p_filters_applied: data.filters_applied || null,
                p_output_format: data.output_format || 'pdf',
                p_generated_by: data.generated_by || null
            }, token);
        },

        getGeneratedReports: async function (generatedBy = null, status = null, limit = 50, token = null) {
            return await this.callFunction('get_generated_reports', {
                p_generated_by: generatedBy,
                p_status: status,
                p_limit: limit
            }, token);
        },

        // ----- DASHBOARD DATA -----

        /**
         * Get Executive Dashboard Health data
         * Returns overall compliance metrics
         */
        getExecutiveDashboardHealth: async function (token = null) {
            return await this.callFunction('get_executive_dashboard_health', {}, token);
        },

        /**
         * Get Team Compliance Matrix data
         * Returns compliance status for all representatives
         */
        getTeamComplianceMatrix: async function (token = null) {
            return await this.callFunction('get_team_compliance_matrix', {}, token);
        },

        /**
         * Get CPD Progress Dashboard data
         * Returns CPD progress for all active representatives
         */
        getCpdProgressDashboard: async function (token = null) {
            return await this.callFunction('get_cpd_progress_dashboard', {}, token);
        },

        /**
         * Get Upcoming Deadlines
         * Returns all upcoming deadlines (default: next 90 days)
         */
        getUpcomingDeadlines: async function (days = 90, token = null) {
            return await this.callFunction('get_upcoming_deadlines', {
                p_days_ahead: days
            }, token);
        },

        /**
         * Get Complaints Dashboard Summary
         * Returns complaints aggregated by status and priority
         */
        getComplaintsDashboardSummary: async function (token = null) {
            return await this.callFunction('get_complaints_dashboard_summary', {}, token);
        },

        /**
         * Get FICA Status Overview
         * Returns FICA verification status breakdown
         */
        getFicaStatusOverview: async function (token = null) {
            return await this.callFunction('get_fica_status_overview', {}, token);
        },

        // ========================================================================
        // FIT & PROPER MANAGEMENT
        // ========================================================================

        /**
         * Get Fit & Proper Records
         * Returns Fit & Proper records for a representative or all records
         */
        getFitAndProperRecords: async function (representativeId = null, overallStatus = null, token = null) {
            return await this.callFunction('get_fit_and_proper_records', {
                p_representative_id: representativeId,
                p_overall_status: overallStatus
            }, token);
        },

        /**
         * Create Fit & Proper Record
         * Creates a new Fit & Proper record for a representative
         */
        createFitAndProperRecord: async function (data, token = null) {
            return await this.callFunction('create_fit_and_proper_record', {
                p_representative_id: data.representative_id,
                p_re5_qualification_name: data.re5_qualification_name || null,
                p_re5_qualification_number: data.re5_qualification_number || null,
                p_re5_issue_date: data.re5_issue_date || null,
                p_re5_expiry_date: data.re5_expiry_date || null,
                p_re1_qualification_name: data.re1_qualification_name || null,
                p_re1_qualification_number: data.re1_qualification_number || null,
                p_re1_issue_date: data.re1_issue_date || null,
                p_re1_expiry_date: data.re1_expiry_date || null
            }, token);
        },

        /**
         * Update Fit & Proper Record
         * Updates an existing Fit & Proper record
         */
        updateFitAndProperRecord: async function (id, data, token = null) {
            return await this.callFunction('update_fit_and_proper_record', {
                p_id: id,
                p_re5_expiry_date: data.re5_expiry_date || null,
                p_re1_expiry_date: data.re1_expiry_date || null,
                p_cob_class_1_date: data.cob_class_1_date || null,
                p_cob_class_2_date: data.cob_class_2_date || null,
                p_cob_class_3_date: data.cob_class_3_date || null,
                p_industry_experience_years: data.industry_experience_years || null,
                p_experience_verified: data.experience_verified || null,
                p_criminal_record_check_date: data.criminal_record_check_date || null,
                p_criminal_record_clear: data.criminal_record_clear || null,
                p_credit_check_date: data.credit_check_date || null,
                p_credit_check_clear: data.credit_check_clear || null,
                p_overall_status: data.overall_status || null,
                p_next_review_date: data.next_review_date || null
            }, token);
        },

        // ========================================================================
        // COMPREHENSIVE COMPLIANCE TRACKING SYSTEM
        // ========================================================================

        // ----- CPD TRACKING -----

        createCPDRecord: async function (data, token = null) {
            return await this.callFunction('create_cpd_record', {
                p_representative_id: data.representative_id,
                p_activity_type: data.activity_type,
                p_activity_name: data.activity_name,
                p_provider: data.provider || null,
                p_activity_date: data.activity_date,
                p_hours_earned: data.hours_earned,
                p_ethics_hours: data.ethics_hours || 0,
                p_verifiable: data.verifiable !== undefined ? data.verifiable : true,
                p_verification_document: data.verification_document || null,
                p_notes: data.notes || null
            }, token);
        },

        getCPDRecords: async function (representativeId, year = null, token = null) {
            return await this.callFunction('get_cpd_records', {
                p_representative_id: representativeId,
                p_year: year
            }, token);
        },

        calculateCPDCompliance: async function (representativeId, year = null, token = null) {
            return await this.callFunction('calculate_cpd_compliance', {
                p_representative_id: representativeId,
                p_year: year
            }, token);
        },

        // ----- QUALIFICATIONS (FIT & PROPER) -----

        createQualification: async function (data, token = null) {
            return await this.callFunction('create_qualification', {
                p_representative_id: data.representative_id,
                p_qualification_type: data.qualification_type,
                p_qualification_name: data.qualification_name,
                p_issuing_authority: data.issuing_authority || null,
                p_issue_date: data.issue_date || null,
                p_expiry_date: data.expiry_date || null,
                p_verification_document: data.verification_document || null,
                p_notes: data.notes || null
            }, token);
        },

        getQualifications: async function (representativeId, token = null) {
            return await this.callFunction('get_qualifications', {
                p_representative_id: representativeId
            }, token);
        },

        calculateFPCompliance: async function (representativeId, token = null) {
            return await this.callFunction('calculate_fp_compliance', {
                p_representative_id: representativeId
            }, token);
        },

        // ----- FICA VERIFICATION -----

        createFICARecord: async function (data, token = null) {
            return await this.callFunction('create_fica_record', {
                p_representative_id: data.representative_id,
                p_client_name: data.client_name,
                p_verification_status: data.verification_status || 'pending',
                p_risk_rating: data.risk_rating || 'medium'
            }, token);
        },

        getFICARecords: async function (representativeId, token = null) {
            return await this.callFunction('get_fica_records', {
                p_representative_id: representativeId
            }, token);
        },

        calculateFICACompliance: async function (representativeId, token = null) {
            return await this.callFunction('calculate_fica_compliance', {
                p_representative_id: representativeId
            }, token);
        },

        // ----- DOCUMENT MANAGEMENT -----

        createDocument: async function (data, token = null) {
            return await this.callFunction('create_document', {
                p_representative_id: data.representative_id,
                p_document_type: data.document_type,
                p_document_name: data.document_name,
                p_document_url: data.document_url || null,
                p_issue_date: data.issue_date || null,
                p_expiry_date: data.expiry_date || null,
                p_requires_renewal: data.requires_renewal || false
            }, token);
        },

        getDocuments: async function (representativeId, token = null) {
            return await this.callFunction('get_documents', {
                p_representative_id: representativeId
            }, token);
        },

        calculateDocumentCompliance: async function (representativeId, token = null) {
            return await this.callFunction('calculate_document_compliance', {
                p_representative_id: representativeId
            }, token);
        },

        // ----- COMPREHENSIVE COMPLIANCE CALCULATION -----

        getRepresentativeCompliance: async function (representativeId, year = null, token = null) {
            return await this.callFunction('get_representative_compliance', {
                p_representative_id: representativeId,
                p_year: year
            }, token);
        },

        getAllRepresentativesCompliance: async function (year = null, token = null) {
            return await this.callFunction('get_all_representatives_compliance', {
                p_year: year
            }, token);
        }
    }
}();

// Create global instance
const dataFunctions = _dataFunctions;

// Make it available globally
window.dataFunctions = dataFunctions;

// Auto-initialize
$(document).ready(function () {
    _dataFunctions.init();
});
