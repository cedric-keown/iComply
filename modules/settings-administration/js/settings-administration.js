// Settings & Administration JavaScript

// Sample Data
const usersData = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'van Zyl',
        email: 'john.vanzyl@brightfuture.co.za',
        role: 'FSP Owner/Principal',
        roleCode: 'fsp-owner',
        status: 'active',
        lastLogin: '23/11/2024 14:30',
        createdDate: '15/01/2022',
        online: true
    },
    {
        id: 2,
        firstName: 'Thandi',
        lastName: 'Dlamini',
        email: 'thandi.dlamini@brightfuture.co.za',
        role: 'Key Individual',
        roleCode: 'key-individual',
        status: 'active',
        lastLogin: '23/11/2024 08:15',
        createdDate: '20/03/2022',
        online: false
    },
    {
        id: 3,
        firstName: 'Lindiwe',
        lastName: 'Mbatha',
        email: 'lindiwe.mbatha@brightfuture.co.za',
        role: 'Compliance Officer',
        roleCode: 'compliance-officer',
        status: 'active',
        lastLogin: '23/11/2024 09:00',
        createdDate: '10/02/2022',
        online: false
    },
    {
        id: 4,
        firstName: 'Thabo',
        lastName: 'Maluleke',
        email: 'thabo.maluleke@brightfuture.co.za',
        role: 'Representative',
        roleCode: 'representative',
        status: 'active',
        lastLogin: '22/11/2024 16:45',
        createdDate: '05/06/2023',
        online: false
    },
    {
        id: 5,
        firstName: 'Sarah',
        lastName: 'Naidoo',
        email: 'sarah.naidoo@brightfuture.co.za',
        role: 'Admin Staff',
        roleCode: 'admin',
        status: 'active',
        lastLogin: '23/11/2024 07:30',
        createdDate: '12/08/2023',
        online: false
    },
    {
        id: 6,
        firstName: 'Peter',
        lastName: 'Botha',
        email: 'peter.botha@brightfuture.co.za',
        role: 'Representative',
        roleCode: 'representative',
        status: 'inactive',
        lastLogin: '15/08/2024',
        createdDate: '18/04/2023',
        online: false
    }
];

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

function initializeSettings() {
    renderUsersTable();
    renderKeyIndividuals();
    renderIntegrations();
    renderAuditLogs();
    renderBackups();
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    usersData.forEach(user => {
        const tr = document.createElement('tr');
        const statusBadge = user.status === 'active' ?
            '<span class="user-status-badge active">✅ Active</span>' :
            '<span class="user-status-badge inactive">⏸️ Inactive</span>';
        
        const onlineIndicator = user.online ? '<span class="badge bg-success ms-1">Online</span>' : '<span class="badge bg-secondary ms-1">Offline</span>';
        
        tr.innerHTML = `
            <td>${user.firstName} ${user.lastName}${onlineIndicator}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${statusBadge}</td>
            <td>${user.lastLogin}</td>
            <td>${user.createdDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="resetPassword(${user.id})" title="Reset Password">
                        <i class="fas fa-key"></i>
                    </button>
                    <button class="action-btn" onclick="viewUser(${user.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${user.status === 'inactive' ? `
                        <button class="action-btn" onclick="deleteUser(${user.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderKeyIndividuals() {
    const container = document.getElementById('keyIndividualsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    keyIndividualsData.forEach(ki => {
        const div = document.createElement('div');
        div.className = 'key-individual-item';
        
        if (ki.type === 'Principal') {
            div.innerHTML = `
                <h6>Principal / FSP Owner</h6>
                <div class="info-item"><strong>Name:</strong> ${ki.name}</div>
                <div class="info-item"><strong>ID Number:</strong> ${ki.idNumber}</div>
                <div class="info-item"><strong>FSP Number:</strong> ${ki.fspNumber}</div>
                <div class="info-item"><strong>Email:</strong> ${ki.email}</div>
                <div class="info-item"><strong>Phone:</strong> ${ki.phone}</div>
                <div class="info-item"><strong>Appointed:</strong> ${ki.appointed}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="editKeyIndividual('${ki.name}')">
                    <i class="fas fa-edit me-1"></i> Edit Details
                </button>
            `;
        } else if (ki.type === 'Key Individual') {
            div.innerHTML = `
                <h6>${ki.name}</h6>
                <div class="info-item"><strong>FSP Number:</strong> ${ki.fspNumber}</div>
                <div class="info-item"><strong>Supervises:</strong> ${ki.supervises} representatives</div>
                <div class="info-item"><strong>Categories:</strong> ${ki.categories}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editKeyIndividual('${ki.name}')">
                        <i class="fas fa-edit me-1"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="viewTeam('${ki.name}')">
                        <i class="fas fa-users me-1"></i> View Team
                    </button>
                </div>
            `;
        } else if (ki.type === 'Compliance Officer') {
            div.innerHTML = `
                <h6>Compliance Officer (Section 17)</h6>
                <div class="info-item"><strong>Name:</strong> ${ki.name}</div>
                <div class="info-item"><strong>FSP Number:</strong> ${ki.fspNumber}</div>
                <div class="info-item"><strong>Appointed:</strong> ${ki.appointed}</div>
                <div class="info-item"><strong>Qualification:</strong> ${ki.qualification}</div>
                <div class="info-item"><strong>Experience:</strong> ${ki.experience}</div>
                <div class="info-item"><strong>Status:</strong> <span class="badge bg-success">✅ Active</span></div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="editKeyIndividual('${ki.name}')">
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
        const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
        modal.show();
    });
    
    // Add User Form
    document.getElementById('addUserForm')?.addEventListener('submit', handleAddUser);
    
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
    document.getElementById('fspInfoForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('localizationForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('businessHoursForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('complianceCycleForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('licenseForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('thresholdsForm')?.addEventListener('submit', handleFormSubmit);
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

function handleAddUser(e) {
    e.preventDefault();
    Swal.fire({
        title: 'User Created',
        text: 'New user has been created successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    renderUsersTable();
}

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

// User Management Functions
function editUser(userId) {
    Swal.fire({
        title: 'Edit User',
        text: `Edit form for user ${userId} would be shown here`,
        icon: 'info'
    });
}

function resetPassword(userId) {
    Swal.fire({
        title: 'Reset Password',
        text: `Password reset email has been sent to user ${userId}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
}

function viewUser(userId) {
    Swal.fire({
        title: 'User Details',
        text: `User details for user ${userId} would be shown here`,
        icon: 'info'
    });
}

function deleteUser(userId) {
    Swal.fire({
        title: 'Delete User',
        text: `Are you sure you want to delete user ${userId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Deleted', 'User has been deleted', 'success');
            renderUsersTable();
        }
    });
}

// Key Individual Functions
function editKeyIndividual(name) {
    Swal.fire({
        title: 'Edit Key Individual',
        text: `Edit form for ${name} would be shown here`,
        icon: 'info'
    });
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

// Make functions globally accessible
window.editUser = editUser;
window.resetPassword = resetPassword;
window.viewUser = viewUser;
window.deleteUser = deleteUser;
window.editKeyIndividual = editKeyIndividual;
window.viewTeam = viewTeam;
window.addKeyIndividual = addKeyIndividual;
window.connectIntegration = connectIntegration;
window.configureIntegration = configureIntegration;
window.testIntegration = testIntegration;
window.disconnectIntegration = disconnectIntegration;
window.learnMore = learnMore;
window.downloadBackup = downloadBackup;
window.restoreBackup = restoreBackup;
window.viewAuditLogDetail = viewAuditLogDetail;

