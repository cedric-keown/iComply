// Audit Trail JavaScript - Database Integrated

document.addEventListener('DOMContentLoaded', function() {
    initializeAuditTrail();
});

async function initializeAuditTrail() {
    const auditTab = document.getElementById('audit-tab');
    if (auditTab) {
        auditTab.addEventListener('shown.bs.tab', function() {
            loadAuditTrail();
        });
    }
}

async function loadAuditTrail() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Try to get document access logs
        // Note: This function may need to be implemented in data-functions.js
        let accessLogs = [];
        try {
            if (dataFunctionsToUse.getDocumentAccessLog) {
                const result = await dataFunctionsToUse.getDocumentAccessLog();
                accessLogs = result?.data || result || [];
            }
        } catch (e) {
            console.warn('Document access log function not available:', e);
        }
        
        // Calculate stats
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const totalActivities = accessLogs.length;
        const thisMonthAccess = accessLogs.filter(log => {
            if (!log.accessed_at && !log.created_at) return false;
            const logDate = new Date(log.accessed_at || log.created_at);
            return logDate >= firstDayOfMonth;
        }).length;
        
        const thisMonthModifications = accessLogs.filter(log => {
            if (log.access_type !== 'modify' && log.access_type !== 'update') return false;
            if (!log.accessed_at && !log.created_at) return false;
            const logDate = new Date(log.accessed_at || log.created_at);
            return logDate >= firstDayOfMonth;
        }).length;
        
        const thisMonthDeletions = accessLogs.filter(log => {
            if (log.access_type !== 'delete') return false;
            if (!log.accessed_at && !log.created_at) return false;
            const logDate = new Date(log.accessed_at || log.created_at);
            return logDate >= firstDayOfMonth;
        }).length;
        
        // Update stats
        const totalEl = document.getElementById('auditTotalActivities');
        if (totalEl) totalEl.textContent = totalActivities.toLocaleString();
        
        const accessEl = document.getElementById('auditAccessCount');
        if (accessEl) accessEl.textContent = thisMonthAccess.toLocaleString();
        
        const modEl = document.getElementById('auditModificationsCount');
        if (modEl) modEl.textContent = thisMonthModifications.toLocaleString();
        
        const delEl = document.getElementById('auditDeletionsCount');
        if (delEl) delEl.textContent = thisMonthDeletions.toLocaleString();
        
        // Render audit log table
        renderAuditLog(accessLogs);
        
    } catch (error) {
        console.error('Error loading audit trail:', error);
        const container = document.getElementById('auditLogContainer');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Audit trail data is not available. This feature requires document access logging to be enabled.
                </div>
            `;
        }
    }
}

function renderAuditLog(logs) {
    const container = document.getElementById('auditLogContainer');
    if (!container) return;
    
    if (!logs || logs.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No audit log entries found. Document access logging will appear here once documents are accessed.
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.accessed_at || a.created_at || 0);
        const dateB = new Date(b.accessed_at || b.created_at || 0);
        return dateB - dateA;
    });
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Activity Type</th>
                        <th>Document Name</th>
                        <th>Category</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedLogs.slice(0, 100).map(log => {
                        const timestamp = log.accessed_at || log.created_at || 'N/A';
                        const date = timestamp !== 'N/A' ? new Date(timestamp).toLocaleString('en-ZA') : 'N/A';
                        const accessType = log.access_type || 'view';
                        const badgeClass = accessType === 'view' ? 'bg-info' : 
                                          accessType === 'download' ? 'bg-primary' :
                                          accessType === 'upload' ? 'bg-success' :
                                          accessType === 'delete' ? 'bg-danger' : 'bg-secondary';
                        const badgeIcon = accessType === 'view' ? '👁️' :
                                         accessType === 'download' ? '⬇️' :
                                         accessType === 'upload' ? '📤' :
                                         accessType === 'delete' ? '🗑️' : '📝';
                        
                        return `
                            <tr>
                                <td>${date}</td>
                                <td>${log.user_name || log.accessed_by || 'System'}</td>
                                <td><span class="badge ${badgeClass}">${badgeIcon} ${accessType.charAt(0).toUpperCase() + accessType.slice(1)}</span></td>
                                <td>${log.document_name || 'N/A'}</td>
                                <td>${log.document_category || 'N/A'}</td>
                                <td>${log.details || log.user_agent || 'N/A'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${sortedLogs.length > 100 ? `<div class="text-center mt-3"><small class="text-muted">Showing first 100 of ${sortedLogs.length} entries</small></div>` : ''}
    `;
}

// Export for global access
window.loadAuditTrail = loadAuditTrail;

