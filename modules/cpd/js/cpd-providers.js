// CPD Providers Management JavaScript

let providersData = [];
let currentProviderId = null;

/**
 * Initialize Providers Tab
 */
async function initializeProvidersTab() {
    console.log('🔄 Initializing providers tab...');
    await loadProviders();
}

/**
 * Load All CPD Providers
 */
async function loadProviders() {
    try {
        const tbody = document.querySelector('#providersTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">Loading providers...</p>
                </td>
            </tr>
        `;
        
        const result = await dataFunctions.getCpdProviders(false); // Get all providers
        let providers = result;
        if (result && result.data) {
            providers = result.data;
        } else if (Array.isArray(result)) {
            providers = result;
        }
        
        providersData = providers || [];
        console.log(`✅ Loaded ${providersData.length} CPD providers`);
        
        renderProvidersTable();
        
    } catch (error) {
        console.error('❌ Error loading providers:', error);
        const tbody = document.querySelector('#providersTable tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">
                        Error loading providers: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Render Providers Table
 */
function renderProvidersTable() {
    const tbody = document.querySelector('#providersTable tbody');
    if (!tbody) return;
    
    if (providersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No providers found. Click "Add Provider" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = providersData.map(provider => {
        const typeLabel = {
            'training_institution': 'Training Institution',
            'professional_body': 'Professional Body',
            'university': 'University',
            'online_platform': 'Online Platform',
            'conference_organizer': 'Conference Organizer',
            'other': 'Other'
        }[provider.provider_type] || provider.provider_type;
        
        const accreditedBadge = provider.is_accredited 
            ? '<span class="badge bg-success">✓ Accredited</span>'
            : '<span class="badge bg-secondary">Not Accredited</span>';
        
        const statusBadge = provider.is_active
            ? '<span class="badge bg-success">Active</span>'
            : '<span class="badge bg-secondary">Inactive</span>';
        
        const contact = provider.contact_person 
            ? `${provider.contact_person}${provider.contact_email ? '<br><small class="text-muted">' + provider.contact_email + '</small>' : ''}`
            : '<span class="text-muted">-</span>';
        
        return `
            <tr>
                <td>
                    <strong>${escapeHtml(provider.provider_name)}</strong>
                    ${provider.accreditation_number ? '<br><small class="text-muted">Acc: ' + escapeHtml(provider.accreditation_number) + '</small>' : ''}
                </td>
                <td>${typeLabel}</td>
                <td>${accreditedBadge}</td>
                <td>${contact}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editProvider('${provider.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProvider('${provider.id}')" title="Deactivate">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Open Add Provider Modal
 */
function openAddProviderModal() {
    currentProviderId = null;
    const modal = new bootstrap.Modal(document.getElementById('providerModal'));
    const form = document.getElementById('providerForm');
    
    // Reset form
    form.reset();
    document.getElementById('providerId').value = '';
    document.getElementById('providerModalLabel').innerHTML = '<i class="fas fa-building me-2"></i>Add CPD Provider';
    document.getElementById('isActive').checked = true;
    
    modal.show();
}

/**
 * Edit Provider
 */
function editProvider(providerId) {
    const provider = providersData.find(p => p.id === providerId);
    if (!provider) return;
    
    currentProviderId = providerId;
    const modal = new bootstrap.Modal(document.getElementById('providerModal'));
    
    // Populate form
    document.getElementById('providerId').value = provider.id;
    document.getElementById('providerName').value = provider.provider_name || '';
    document.getElementById('providerType').value = provider.provider_type || '';
    document.getElementById('accreditationNumber').value = provider.accreditation_number || '';
    document.getElementById('isAccredited').checked = provider.is_accredited || false;
    document.getElementById('isActive').checked = provider.is_active !== false;
    document.getElementById('contactPerson').value = provider.contact_person || '';
    document.getElementById('contactEmail').value = provider.contact_email || '';
    document.getElementById('contactPhone').value = provider.contact_phone || '';
    document.getElementById('websiteUrl').value = provider.website_url || '';
    document.getElementById('providerNotes').value = provider.notes || '';
    
    document.getElementById('providerModalLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Edit CPD Provider';
    
    modal.show();
}

/**
 * Save Provider
 */
async function saveProvider() {
    const form = document.getElementById('providerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const providerData = {
        provider_name: document.getElementById('providerName').value.trim(),
        provider_type: document.getElementById('providerType').value,
        accreditation_number: document.getElementById('accreditationNumber').value.trim() || null,
        is_accredited: document.getElementById('isAccredited').checked,
        is_active: document.getElementById('isActive').checked,
        contact_person: document.getElementById('contactPerson').value.trim() || null,
        contact_email: document.getElementById('contactEmail').value.trim() || null,
        contact_phone: document.getElementById('contactPhone').value.trim() || null,
        website_url: document.getElementById('websiteUrl').value.trim() || null,
        notes: document.getElementById('providerNotes').value.trim() || null
    };
    
    try {
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        let result;
        if (currentProviderId) {
            // Update existing
            result = await dataFunctions.updateCpdProvider(currentProviderId, providerData);
        } else {
            // Create new
            result = await dataFunctions.createCpdProvider(providerData);
        }
        
        if (result && (result.success !== false)) {
            Swal.fire({
                icon: 'success',
                title: 'Provider Saved',
                text: `CPD Provider ${currentProviderId ? 'updated' : 'created'} successfully.`,
                timer: 2000
            });
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('providerModal'))?.hide();
            
            // Reload providers
            await loadProviders();
        } else {
            throw new Error(result?.error || 'Failed to save provider');
        }
        
    } catch (error) {
        console.error('Error saving provider:', error);
        Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: error.message
        });
    }
}

/**
 * Delete Provider
 */
async function deleteProvider(providerId) {
    const provider = providersData.find(p => p.id === providerId);
    if (!provider) return;
    
    const result = await Swal.fire({
        title: 'Deactivate Provider?',
        html: `Are you sure you want to deactivate <strong>${provider.provider_name}</strong>?<br><small class="text-muted">This will mark it as inactive but keep the record.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Deactivate',
        confirmButtonColor: '#dc3545'
    });
    
    if (!result.isConfirmed) return;
    
    try {
        Swal.fire({
            title: 'Deactivating...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        const deleteResult = await dataFunctions.deleteCpdProvider(providerId);
        
        if (deleteResult && deleteResult.success !== false) {
            Swal.fire({
                icon: 'success',
                title: 'Provider Deactivated',
                timer: 2000
            });
            
            await loadProviders();
        } else {
            throw new Error(deleteResult?.error || 'Failed to deactivate provider');
        }
        
    } catch (error) {
        console.error('Error deactivating provider:', error);
        Swal.fire({
            icon: 'error',
            title: 'Deactivation Failed',
            text: error.message
        });
    }
}

/**
 * Helper function to escape HTML
 */
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Export functions
window.initializeProvidersTab = initializeProvidersTab;
window.openAddProviderModal = openAddProviderModal;
window.editProvider = editProvider;
window.saveProvider = saveProvider;
window.deleteProvider = deleteProvider;

