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
                p_setting_category: data.setting_category || null,
                p_description: data.description || null,
                p_is_public: data.is_public || false
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
                p_role_description: data.role_description || null,
                p_role_level: data.role_level || 1
            }, token);
        },

        getUserRoles: async function (token = null) {
            return await this.callFunction('get_user_roles', {}, token);
        },

        updateUserRole: async function (id, data, token = null) {
            return await this.callFunction('update_user_role', {
                p_id: id,
                p_role_name: data.role_name || null,
                p_role_description: data.role_description || null,
                p_role_level: data.role_level || null
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
                p_email: data.email,
                p_role_id: data.role_id,
                p_first_name: data.first_name,
                p_last_name: data.last_name,
                p_phone: data.phone || null,
                p_job_title: data.job_title || null,
                p_department: data.department || null
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

        updateUserProfile: async function (id, data, token = null) {
            return await this.callFunction('update_user_profile', {
                p_id: id,
                p_first_name: data.first_name || null,
                p_last_name: data.last_name || null,
                p_phone: data.phone || null,
                p_job_title: data.job_title || null,
                p_department: data.department || null,
                p_status: data.status || null
            }, token);
        },

        deleteUserProfile: async function (id, token = null) {
            return await this.callFunction('delete_user_profile', {
                p_id: id
            }, token);
        },

        // ========================================================================
        // PHASE 2: REPRESENTATIVES & KEY INDIVIDUALS
        // ========================================================================

        // ----- REPRESENTATIVES -----

        createRepresentative: async function (data, token = null) {
            return await this.callFunction('create_representative', {
                p_first_name: data.first_name,
                p_last_name: data.last_name,
                p_id_number: data.id_number,
                p_fais_individual_number: data.fais_individual_number || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_representative_type: data.representative_type,
                p_appointment_date: data.appointment_date || null,
                p_termination_date: data.termination_date || null,
                p_status: data.status || 'active'
            }, token);
        },

        getRepresentatives: async function (status = 'active', token = null) {
            return await this.callFunction('get_representatives', {
                p_status: status
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
                p_first_name: data.first_name || null,
                p_last_name: data.last_name || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_status: data.status || null,
                p_termination_date: data.termination_date || null
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
            return await this.callFunction('get_key_individuals', {
                p_status: status
            }, token);
        },

        updateKeyIndividual: async function (id, data, token = null) {
            return await this.callFunction('update_key_individual', {
                p_id: id,
                p_position_title: data.position_title || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_status: data.status || null
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
                p_activity_type: data.activity_type,
                p_activity_title: data.activity_title,
                p_provider_name: data.provider_name || null,
                p_hours_claimed: data.hours_claimed,
                p_description: data.description || null,
                p_verification_status: data.verification_status || 'pending'
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
                p_hours_claimed: data.hours_claimed || null,
                p_verification_status: data.verification_status || null,
                p_verification_notes: data.verification_notes || null
            }, token);
        },

        deleteCpdActivity: async function (id, token = null) {
            return await this.callFunction('delete_cpd_activity', {
                p_id: id
            }, token);
        },

        getCpdProgressSummary: async function (cycleId = null, token = null) {
            return await this.callFunction('get_cpd_progress_summary', {
                p_cpd_cycle_id: cycleId
            }, token);
        },

        // ========================================================================
        // PHASE 4: CLIENTS & FICA
        // ========================================================================

        // ----- CLIENTS -----

        createClient: async function (data, token = null) {
            return await this.callFunction('create_client', {
                p_client_type: data.client_type,
                p_client_category: data.client_category,
                p_first_name: data.first_name || null,
                p_last_name: data.last_name || null,
                p_company_name: data.company_name || null,
                p_id_number: data.id_number || null,
                p_registration_number: data.registration_number || null,
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_onboarding_date: data.onboarding_date || null,
                p_assigned_representative_id: data.assigned_representative_id || null
            }, token);
        },

        getClients: async function (clientType = null, status = 'active', token = null) {
            return await this.callFunction('get_clients', {
                p_client_type: clientType,
                p_status: status
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
                p_email: data.email || null,
                p_phone: data.phone || null,
                p_status: data.status || null,
                p_assigned_representative_id: data.assigned_representative_id || null
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
                p_verification_date: data.verification_date,
                p_verification_type: data.verification_type,
                p_id_verified: data.id_verified || false,
                p_address_verified: data.address_verified || false,
                p_risk_rating: data.risk_rating || 'medium',
                p_verified_by: data.verified_by || null
            }, token);
        },

        getFicaVerifications: async function (clientId, token = null) {
            return await this.callFunction('get_fica_verifications', {
                p_client_id: clientId
            }, token);
        },

        updateFicaVerification: async function (id, data, token = null) {
            return await this.callFunction('update_fica_verification', {
                p_id: id,
                p_id_verified: data.id_verified || null,
                p_address_verified: data.address_verified || null,
                p_risk_rating: data.risk_rating || null,
                p_verification_notes: data.verification_notes || null
            }, token);
        },

        // ----- CLIENT BENEFICIAL OWNERS -----

        createClientBeneficialOwner: async function (data, token = null) {
            return await this.callFunction('create_client_beneficial_owner', {
                p_client_id: data.client_id,
                p_first_name: data.first_name,
                p_last_name: data.last_name,
                p_id_number: data.id_number || null,
                p_ownership_percentage: data.ownership_percentage || null,
                p_relationship_type: data.relationship_type || null,
                p_is_verified: data.is_verified || false
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
                p_is_verified: data.is_verified || null
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
            return await this.callFunction('update_complaint', {
                p_id: id,
                p_status: data.status || null,
                p_priority: data.priority || null,
                p_assigned_to: data.assigned_to || null,
                p_investigation_notes: data.investigation_notes || null,
                p_resolution_description: data.resolution_description || null,
                p_resolution_date: data.resolution_date || null,
                p_acknowledgement_sent_date: data.acknowledgement_sent_date || null,
                p_root_cause: data.root_cause || null,
                p_preventative_action: data.preventative_action || null
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
                p_rule_description: data.rule_description,
                p_rule_type: data.rule_type,
                p_target_entity: data.target_entity,
                p_conditions: data.conditions,
                p_priority: data.priority,
                p_alert_frequency: data.alert_frequency || 'once',
                p_send_email: data.send_email !== undefined ? data.send_email : true,
                p_send_in_app: data.send_in_app !== undefined ? data.send_in_app : true,
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
