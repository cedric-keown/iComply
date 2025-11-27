// Alerts & Notifications JavaScript - Database Integrated

let alertsData = {
    alerts: [],
    rules: []
};

let filteredAlerts = [];
let selectedAlerts = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAlerts();
    setupEventListeners();
    updateLastUpdated();
    
    // Auto-refresh every 60 seconds
    setInterval(() => {
        updateLastUpdated();
        loadAlerts();
    }, 60000);
});

/**
 * Transform database alert to UI format
 */
function transformAlert(dbAlert) {
    const today = new Date();
    const validFrom = dbAlert.valid_from ? new Date(dbAlert.valid_from) : today;
    const dueDate = dbAlert.due_date ? new Date(dbAlert.due_date) : null;
    
    // Calculate days remaining/overdue
    let daysRemaining = null;
    let daysOverdue = null;
    let overdue = false;
    
    if (dueDate) {
        const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
            overdue = true;
            daysOverdue = Math.abs(diff);
        } else {
            daysRemaining = diff;
        }
    }
    
    return {
        id: dbAlert.id || dbAlert.alert_id || `ALT-${dbAlert.id?.substring(0, 8)}`,
        title: dbAlert.alert_title || dbAlert.title || 'Untitled Alert',
        description: dbAlert.alert_message || dbAlert.description || '',
        priority: dbAlert.priority || 'medium',
        category: dbAlert.entity_type || dbAlert.category || 'system',
        created: validFrom.toLocaleDateString('en-ZA') + ' ' + validFrom.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
        createdBy: 'System (automated)',
        dueDate: dueDate ? dueDate.toLocaleDateString('en-ZA') : null,
        overdue: overdue,
        daysOverdue: daysOverdue,
        daysRemaining: daysRemaining,
        assignedTo: null, // TODO: Get from assigned_to if available
        assignedToRole: null,
        status: dbAlert.status || 'active',
        acknowledgedDate: dbAlert.acknowledged_at ? new Date(dbAlert.acknowledged_at).toLocaleDateString('en-ZA') : null,
        acknowledgedBy: null, // TODO: Get user name from acknowledged_by
        progress: dbAlert.status === 'resolved' ? 100 : (dbAlert.status === 'acknowledged' ? 25 : 0),
        representative: null, // TODO: Load representative info if representative_id exists
        impact: dbAlert.priority === 'critical' ? 'high' : (dbAlert.priority === 'high' ? 'medium' : 'low'),
        notifications: {
            email: true,
            sms: false,
            inApp: true
        },
        // Keep original database fields
        _db: dbAlert
    };
}

/**
 * Load Alerts from Database
 */
async function loadAlerts() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            console.warn('dataFunctions not available, using empty data');
            alertsData.alerts = [];
            alertsData.rules = [];
            filteredAlerts = [];
            initializeAlerts();
            return;
        }
        
        // Load alerts
        const alertsResult = await dataFunctionsToUse.getAlerts('active', null, null, null);
        let alerts = alertsResult;
        if (alertsResult && alertsResult.data) {
            alerts = alertsResult.data;
        } else if (alertsResult && Array.isArray(alertsResult)) {
            alerts = alertsResult;
        }
        
        // Transform database alerts to UI format
        alertsData.alerts = (alerts || []).map(transformAlert);
        filteredAlerts = [...alertsData.alerts];
        
        // Update active count badge
        const activeCountBadge = document.getElementById('activeCount');
        if (activeCountBadge) {
            activeCountBadge.textContent = alertsData.alerts.length;
        }
        
        // Load alert rules (if function exists)
        // TODO: Implement getAlertRules when available
        alertsData.rules = [];
        
        initializeAlerts();
        
    } catch (error) {
        console.error('Error loading alerts:', error);
        alertsData.alerts = [];
        alertsData.rules = [];
        filteredAlerts = [];
        initializeAlerts();
    }
}

function initializeAlerts() {
    renderAlertsTable();
    renderAlertRules();
    renderHeatmap();
    initializeTooltips();
}

function renderAlertsTable() {
    const tbody = document.getElementById('alertsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredAlerts.forEach(alert => {
        const row = createAlertRow(alert);
        tbody.appendChild(row);
    });
    
    updateSelectedCount();
}

function createAlertRow(alert) {
    const tr = document.createElement('tr');
    tr.className = 'alert-row';
    if (alert.priority === 'critical') {
        tr.classList.add('critical-alert');
    }
    tr.dataset.alertId = alert.id;
    
    // Checkbox
    const tdCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input alert-checkbox';
    checkbox.dataset.alertId = alert.id;
    checkbox.addEventListener('change', handleAlertCheckboxChange);
    tdCheckbox.appendChild(checkbox);
    tr.appendChild(tdCheckbox);
    
    // Priority
    const tdPriority = document.createElement('td');
    tdPriority.innerHTML = createPriorityColumn(alert);
    tr.appendChild(tdPriority);
    
    // Alert
    const tdAlert = document.createElement('td');
    tdAlert.innerHTML = createAlertColumn(alert);
    tr.appendChild(tdAlert);
    
    // Category
    const tdCategory = document.createElement('td');
    tdCategory.innerHTML = createCategoryColumn(alert);
    tr.appendChild(tdCategory);
    
    // Created
    const tdCreated = document.createElement('td');
    tdCreated.innerHTML = createCreatedColumn(alert);
    tr.appendChild(tdCreated);
    
    // Due Date
    const tdDueDate = document.createElement('td');
    tdDueDate.innerHTML = createDueDateColumn(alert);
    tr.appendChild(tdDueDate);
    
    // Assigned To
    const tdAssigned = document.createElement('td');
    tdAssigned.innerHTML = createAssignedColumn(alert);
    tr.appendChild(tdAssigned);
    
    // Status
    const tdStatus = document.createElement('td');
    tdStatus.innerHTML = createStatusColumn(alert);
    tr.appendChild(tdStatus);
    
    // Actions
    const tdActions = document.createElement('td');
    tdActions.innerHTML = createActionsColumn(alert);
    tr.appendChild(tdActions);
    
    // Make row clickable
    tr.addEventListener('click', (e) => {
        if (!e.target.closest('input, button, .dropdown')) {
            showAlertDetails(alert);
        }
    });
    
    return tr;
}

function createPriorityColumn(alert) {
    const priorityClass = alert.priority === 'critical' ? 'critical' :
                          alert.priority === 'high' ? 'high' :
                          alert.priority === 'medium' ? 'medium' : 'low';
    const priorityIcon = alert.priority === 'critical' ? '⚠️' :
                        alert.priority === 'high' ? '⚠️' :
                        alert.priority === 'medium' ? 'ℹ️' : 'ℹ️';
    
    return `
        <div class="priority-badge ${priorityClass}">
            ${priorityIcon} ${alert.priority.toUpperCase()}
        </div>
    `;
}

function createAlertColumn(alert) {
    const titleClass = alert.priority === 'critical' ? 'alert-title critical' : 'alert-title';
    const impactBadge = alert.impact === 'high' ? '<span class="badge bg-danger ms-2">🚨 HIGH IMPACT</span>' : '';
    const repInfo = alert.representative ? `
        <div class="alert-rep-info">
            <div class="rep-avatar-small">${alert.representative.initials}</div>
            <div>
                <div>${alert.representative.name}</div>
                <small class="text-muted">FSCAR: ${alert.representative.fscar}</small>
            </div>
        </div>
    ` : '';
    
    return `
        <div>
            <div class="${titleClass}">${alert.title}</div>
            <div class="alert-reference">${alert.id}</div>
            <div class="alert-description">${alert.description}</div>
            ${impactBadge}
            ${repInfo}
        </div>
    `;
}

function createCategoryColumn(alert) {
    const categoryMap = {
        'fit-proper': 'Fit & Proper',
        'cpd': 'CPD',
        'fica': 'FICA',
        'documents': 'Documents',
        'insurance': 'Insurance',
        'complaints': 'Complaints',
        'system': 'System'
    };
    
    return `
        <span class="category-badge">${categoryMap[alert.category] || alert.category}</span>
    `;
}

function createCreatedColumn(alert) {
    // Handle both string and Date formats
    let dateStr = alert.created;
    if (alert._db && alert._db.valid_from) {
        const date = new Date(alert._db.valid_from);
        dateStr = date.toLocaleDateString('en-ZA') + ' ' + date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    }
    
    const dateParts = dateStr ? dateStr.split(' ') : ['N/A', ''];
    return `
        <div>
            <div class="fw-bold">${dateParts[0] || 'N/A'}</div>
            ${dateParts[1] ? `<div class="small text-muted">${dateParts[1]}</div>` : ''}
            <div class="small text-muted">${alert.createdBy || 'System'}</div>
        </div>
    `;
}

function createDueDateColumn(alert) {
    if (!alert.dueDate) {
        return `<div class="text-muted">No due date</div>`;
    }
    
    if (alert.overdue) {
        return `
            <div class="due-date overdue">
                <div>${alert.dueDate}</div>
                <div class="text-danger fw-bold">OVERDUE</div>
                ${alert.daysOverdue ? `<span class="badge bg-danger">${alert.daysOverdue} days</span>` : ''}
            </div>
        `;
    } else if (alert.daysRemaining !== null && alert.daysRemaining <= 7) {
        return `
            <div class="due-date soon">
                <div>${alert.dueDate}</div>
                <div class="text-warning">${alert.daysRemaining} days remaining</div>
            </div>
        `;
    } else if (alert.daysRemaining !== null) {
        return `
            <div class="due-date current">
                <div>${alert.dueDate}</div>
                <div class="text-muted">${alert.daysRemaining} days remaining</div>
            </div>
        `;
    } else {
        return `
            <div class="due-date current">
                <div>${alert.dueDate}</div>
            </div>
        `;
    }
}

function createAssignedColumn(alert) {
    if (!alert.assignedTo) {
        return `<div class="text-muted">Unassigned</div>`;
    }
    return `
        <div>
            <div class="fw-bold">${alert.assignedTo}</div>
            ${alert.assignedToRole ? `<div class="small text-muted">${alert.assignedToRole}</div>` : ''}
            ${alert.cc && alert.cc.length > 0 ? `<div class="small text-muted">CC: ${alert.cc.join(', ')}</div>` : ''}
        </div>
    `;
}

function createStatusColumn(alert) {
    const statusClass = alert.status === 'active' ? 'active' :
                       alert.status === 'acknowledged' ? 'acknowledged' :
                       alert.status === 'in-progress' ? 'in-progress' :
                       alert.status === 'resolved' ? 'resolved' :
                       alert.status === 'dismissed' ? 'dismissed' : 'escalated';
    
    let progressHtml = '';
    if (alert.progress !== undefined) {
        progressHtml = `
            <div class="progress mt-2" style="height: 4px;">
                <div class="progress-bar" style="width: ${alert.progress}%"></div>
            </div>
            <small class="text-muted">${alert.progress}%</small>
        `;
    }
    
    return `
        <div>
            <span class="status-badge ${statusClass}">${alert.status.toUpperCase().replace('-', ' ')}</span>
            ${progressHtml}
        </div>
    `;
}

function createActionsColumn(alert) {
    const urgentBtn = alert.priority === 'critical' ? 
        '<button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); handleUrgentAction(\'' + alert.id + '\')">🚨 URGENT</button>' : '';
    
    return `
        <div class="action-buttons">
            ${urgentBtn}
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showAlertDetails('${alert.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); addNote('${alert.id}')">
                <i class="fas fa-sticky-note"></i>
            </button>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); acknowledgeAlert('${alert.id}')">Acknowledge</a></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); addNote('${alert.id}')">Add Note</a></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); changePriority('${alert.id}')">Change Priority</a></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); reassignAlert('${alert.id}')">Reassign</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); dismissAlert('${alert.id}')">Dismiss</a></li>
                    <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); viewHistory('${alert.id}')">View History</a></li>
                </ul>
            </div>
        </div>
    `;
}

function renderAlertRules() {
    const tbody = document.getElementById('rulesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    alertRulesData.forEach(rule => {
        const row = createRuleRow(rule);
        tbody.appendChild(row);
    });
}

function createRuleRow(rule) {
    const tr = document.createElement('tr');
    
    // Status
    const tdStatus = document.createElement('td');
    const statusToggle = document.createElement('div');
    statusToggle.className = 'form-check form-switch';
    statusToggle.innerHTML = `
        <input class="form-check-input rule-status-toggle" type="checkbox" ${rule.status === 'active' ? 'checked' : ''} 
               data-rule-id="${rule.id}" onchange="toggleRule('${rule.id}')">
    `;
    tdStatus.appendChild(statusToggle);
    tr.appendChild(tdStatus);
    
    // Rule Name
    const tdName = document.createElement('td');
    tdName.innerHTML = `
        <div class="fw-bold">${rule.name}</div>
        <div class="small text-muted">${rule.id}</div>
        <div class="small text-muted">Category: ${rule.category}</div>
    `;
    tr.appendChild(tdName);
    
    // Trigger Condition
    const tdTrigger = document.createElement('td');
    tdTrigger.innerHTML = `
        <div class="trigger-condition">${rule.triggerCondition}</div>
        <div class="trigger-plain-english">${rule.triggerPlainEnglish}</div>
        <div class="small text-muted mt-1">Check: ${rule.checkFrequency}</div>
    `;
    tr.appendChild(tdTrigger);
    
    // Priority
    const tdPriority = document.createElement('td');
    const priorityClass = rule.priority === 'critical' ? 'critical' :
                         rule.priority === 'high' ? 'high' :
                         rule.priority === 'medium' ? 'medium' : 'low';
    tdPriority.innerHTML = `<span class="priority-badge ${priorityClass}">${rule.priority.toUpperCase()}</span>`;
    tr.appendChild(tdPriority);
    
    // Recipients
    const tdRecipients = document.createElement('td');
    tdRecipients.innerHTML = `<small>${rule.recipients.join(', ')}</small>`;
    tr.appendChild(tdRecipients);
    
    // Alerts Generated
    const tdGenerated = document.createElement('td');
    tdGenerated.innerHTML = `
        <div>Last 30 Days: <strong>${rule.alertsGenerated30Days}</strong></div>
        ${rule.alertsGenerated12Months ? `<div class="small text-muted">Last 12 Months: ${rule.alertsGenerated12Months}</div>` : ''}
        ${rule.currentlyActive ? `<div class="small text-warning">Currently Active: ${rule.currentlyActive}</div>` : ''}
    `;
    tr.appendChild(tdGenerated);
    
    // Actions
    const tdActions = document.createElement('td');
    tdActions.innerHTML = `
        <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-primary" onclick="editRule('${rule.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-info" onclick="viewRuleAnalytics('${rule.id}')">
                <i class="fas fa-chart-bar"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary" onclick="testRule('${rule.id}')">
                <i class="fas fa-vial"></i>
            </button>
        </div>
    `;
    tr.appendChild(tdActions);
    
    return tr;
}

function renderHeatmap() {
    const heatmap = document.getElementById('alertHeatmap');
    if (!heatmap) return;
    
    // Simple heatmap visualization
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    
    let html = '<div class="heatmap-grid">';
    html += '<div></div>'; // Empty cell for day labels
    
    // Day headers
    days.forEach(day => {
        html += `<div class="text-center fw-bold small">${day}</div>`;
    });
    
    // Priority rows
    priorities.forEach(priority => {
        html += `<div class="fw-bold small">${priority}</div>`;
        days.forEach(() => {
            const intensity = Math.floor(Math.random() * 4); // 0-3
            const cellClass = intensity === 0 ? '' : intensity === 1 ? 'low' : intensity === 2 ? 'medium' : 'high';
            html += `<div class="heatmap-cell ${cellClass}" title="${priority} alerts"></div>`;
        });
    });
    
    html += '</div>';
    heatmap.innerHTML = html;
}

function setupEventListeners() {
    // Search
    document.getElementById('alertSearch')?.addEventListener('input', handleSearch);
    document.getElementById('clearSearch')?.addEventListener('click', clearSearch);
    
    // Filters
    document.getElementById('priorityFilter')?.addEventListener('change', applyFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('sortFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    
    // Select All
    document.getElementById('selectAllAlerts')?.addEventListener('change', handleSelectAllAlerts);
    
    // Summary Cards
    document.querySelectorAll('.alert-summary-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const filter = card.dataset.filter;
            if (filter) {
                applyCardFilter(filter);
            }
        });
    });
    
    // Action Buttons
    document.getElementById('createAlertBtn')?.addEventListener('click', showCreateAlertModal);
    document.getElementById('createAlertBtn2')?.addEventListener('click', showCreateAlertModal);
    document.getElementById('configureRulesBtn')?.addEventListener('click', () => {
        document.getElementById('rules-tab').click();
    });
    document.getElementById('notificationSettingsBtn')?.addEventListener('click', () => {
        document.getElementById('settings-tab').click();
    });
    document.getElementById('refreshIcon')?.addEventListener('click', refreshData);
    document.getElementById('saveNotificationSettings')?.addEventListener('click', saveNotificationSettings);
    
    // Create Rule
    document.getElementById('createRuleBtn')?.addEventListener('click', showCreateRuleModal);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const clearBtn = document.getElementById('clearSearch');
    
    if (query) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    applyFilters();
}

function clearSearch() {
    document.getElementById('alertSearch').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    applyFilters();
}

function applyFilters() {
    const searchQuery = document.getElementById('alertSearch')?.value.toLowerCase() || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'priority';
    
    filteredAlerts = alertsData.filter(alert => {
        // Search
        if (searchQuery && !alert.title.toLowerCase().includes(searchQuery) && 
            !alert.description.toLowerCase().includes(searchQuery) &&
            !alert.id.toLowerCase().includes(searchQuery)) {
            return false;
        }
        
        // Priority Filter
        if (priorityFilter !== 'all' && alert.priority !== priorityFilter) {
            return false;
        }
        
        // Category Filter
        if (categoryFilter !== 'all' && alert.category !== categoryFilter) {
            return false;
        }
        
        // Status Filter
        if (statusFilter !== 'all' && alert.status !== statusFilter) {
            return false;
        }
        
        return true;
    });
    
    // Sort
    sortAlerts(sortFilter);
    
    renderAlertsTable();
}

function sortAlerts(sortBy) {
    filteredAlerts.sort((a, b) => {
        switch(sortBy) {
            case 'priority':
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'date-newest':
                return new Date(b.created) - new Date(a.created);
            case 'date-oldest':
                return new Date(a.created) - new Date(b.created);
            case 'due-date':
                if (a.overdue && !b.overdue) return -1;
                if (!a.overdue && b.overdue) return 1;
                return (a.daysRemaining || 999) - (b.daysRemaining || 999);
            default:
                return 0;
        }
    });
}

function clearFilters() {
    document.getElementById('alertSearch').value = '';
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('sortFilter').value = 'priority';
    document.getElementById('clearSearch').style.display = 'none';
    applyFilters();
}

function applyCardFilter(filter) {
    if (filter === 'all') {
        clearFilters();
    } else {
        document.getElementById('priorityFilter').value = filter;
        applyFilters();
    }
}

function handleAlertCheckboxChange(e) {
    const alertId = e.target.dataset.alertId;
    if (e.target.checked) {
        selectedAlerts.add(alertId);
    } else {
        selectedAlerts.delete(alertId);
    }
    updateSelectedCount();
}

function handleSelectAllAlerts(e) {
    const checked = e.target.checked;
    document.querySelectorAll('.alert-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
        const alertId = checkbox.dataset.alertId;
        if (checked) {
            selectedAlerts.add(alertId);
        } else {
            selectedAlerts.delete(alertId);
        }
    });
    updateSelectedCount();
}

function updateSelectedCount() {
    const count = selectedAlerts.size;
    document.getElementById('selectedAlertsCount').textContent = count;
    const bulkBar = document.getElementById('bulkActionsBar');
    if (count > 0) {
        bulkBar.style.display = 'block';
    } else {
        bulkBar.style.display = 'none';
    }
}

function showAlertDetails(alertId) {
    const alert = typeof alertId === 'string' ? 
        alertsData.find(a => a.id === alertId) : alertId;
    if (!alert) return;
    
    const modal = new bootstrap.Modal(document.getElementById('alertDetailModal'));
    document.getElementById('alertDetailModalLabel').textContent = alert.title;
    document.getElementById('alertDetailContent').innerHTML = `
        <div class="expanded-alert-panel">
            <div class="section">
                <h6>Full Description</h6>
                <p><strong>Alert ID:</strong> ${alert.id}</p>
                <p>${alert.description}</p>
            </div>
            <div class="section">
                <h6>Impact Assessment</h6>
                <p><strong>Impact Level:</strong> <span class="badge bg-danger">🚨 ${alert.impact.toUpperCase()}</span></p>
            </div>
            <div class="section">
                <h6>Activity History</h6>
                <div class="activity-timeline">
                    <div class="activity-entry">
                        <div class="activity-time">${alert.created}</div>
                        <div class="activity-action">Alert created</div>
                        <div class="activity-details">By: ${alert.createdBy}</div>
                    </div>
                    ${alert.acknowledgedDate ? `
                    <div class="activity-entry">
                        <div class="activity-time">${alert.acknowledgedDate}</div>
                        <div class="activity-action">Alert acknowledged</div>
                        <div class="activity-details">By: ${alert.acknowledgedBy}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    modal.show();
}

function showCreateAlertModal() {
    const modal = new bootstrap.Modal(document.getElementById('createAlertModal'));
    document.getElementById('createAlertForm').innerHTML = `
        <form id="alertForm">
            <div class="mb-3">
                <label class="form-label">Alert Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="alertTitle" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Priority <span class="text-danger">*</span></label>
                <div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="priority" id="priorityCritical" value="critical">
                        <label class="form-check-label" for="priorityCritical">Critical</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="priority" id="priorityHigh" value="high">
                        <label class="form-check-label" for="priorityHigh">High</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="priority" id="priorityMedium" value="medium" checked>
                        <label class="form-check-label" for="priorityMedium">Medium</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="priority" id="priorityLow" value="low">
                        <label class="form-check-label" for="priorityLow">Low</label>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Category <span class="text-danger">*</span></label>
                <select class="form-select" id="alertCategory" required>
                    <option value="">Select category...</option>
                    <option value="fit-proper">Fit & Proper</option>
                    <option value="cpd">CPD</option>
                    <option value="fica">FICA</option>
                    <option value="documents">Documents</option>
                    <option value="insurance">Insurance</option>
                    <option value="complaints">Complaints</option>
                    <option value="system">System</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Description <span class="text-danger">*</span></label>
                <textarea class="form-control" id="alertDescription" rows="4" required></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-control" id="alertDueDate">
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-danger">Create Alert</button>
            </div>
        </form>
    `;
    
    document.getElementById('alertForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Alert Created',
            text: 'Custom alert has been created successfully',
            icon: 'success'
        });
        modal.hide();
    });
    
    modal.show();
}

function showCreateRuleModal() {
    Swal.fire({
        title: 'Create Alert Rule',
        text: 'Alert rule creation form would be implemented here',
        icon: 'info'
    });
}

function toggleRule(ruleId) {
    Swal.fire({
        title: 'Rule Toggled',
        text: `Rule ${ruleId} status has been updated`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function editRule(ruleId) {
    Swal.fire({
        title: 'Edit Rule',
        text: `Edit form for rule ${ruleId} would be shown here`,
        icon: 'info'
    });
}

function viewRuleAnalytics(ruleId) {
    Swal.fire({
        title: 'Rule Analytics',
        text: `Analytics for rule ${ruleId} would be displayed here`,
        icon: 'info'
    });
}

function testRule(ruleId) {
    Swal.fire({
        title: 'Test Rule',
        text: `Testing rule ${ruleId}...`,
        icon: 'info'
    });
}

function acknowledgeAlert(alertId) {
    Swal.fire({
        title: 'Alert Acknowledged',
        text: `Alert ${alertId} has been acknowledged`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function addNote(alertId) {
    Swal.fire({
        title: 'Add Note',
        input: 'textarea',
        inputPlaceholder: 'Enter your note...',
        showCancelButton: true,
        confirmButtonText: 'Save Note',
        preConfirm: (note) => {
            if (!note) {
                Swal.showValidationMessage('Please enter a note');
            }
            return note;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Note Added', 'Your note has been saved', 'success');
        }
    });
}

function changePriority(alertId) {
    Swal.fire({
        title: 'Change Priority',
        text: `Priority change form for alert ${alertId} would be shown here`,
        icon: 'info'
    });
}

function reassignAlert(alertId) {
    Swal.fire({
        title: 'Reassign Alert',
        text: `Reassignment form for alert ${alertId} would be shown here`,
        icon: 'info'
    });
}

function dismissAlert(alertId) {
    Swal.fire({
        title: 'Dismiss Alert',
        input: 'textarea',
        inputPlaceholder: 'Reason for dismissal...',
        showCancelButton: true,
        confirmButtonText: 'Dismiss',
        preConfirm: (reason) => {
            if (!reason) {
                Swal.showValidationMessage('Please provide a reason');
            }
            return reason;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Alert Dismissed', 'The alert has been dismissed', 'success');
        }
    });
}

function viewHistory(alertId) {
    Swal.fire({
        title: 'Alert History',
        text: `Full history for alert ${alertId} would be displayed here`,
        icon: 'info'
    });
}

function handleUrgentAction(alertId) {
    Swal.fire({
        title: 'Urgent Action Required',
        text: 'Urgent action modal would be shown here',
        icon: 'warning',
        confirmButtonText: 'Take Action'
    });
}

function updateLastUpdated() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = `${dateStr} ${timeStr}`;
    }
}

function refreshData() {
    const icon = document.getElementById('refreshIcon');
    if (icon) {
        icon.classList.add('fa-spin');
        setTimeout(() => {
            icon.classList.remove('fa-spin');
            updateLastUpdated();
            Swal.fire({
                title: 'Refreshed',
                text: 'Data has been refreshed',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }, 1000);
    }
}

function saveNotificationSettings() {
    Swal.fire({
        title: 'Settings Saved',
        text: 'Your notification settings have been saved',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Make functions globally accessible
window.showAlertDetails = showAlertDetails;
window.handleUrgentAction = handleUrgentAction;
window.addNote = addNote;
window.acknowledgeAlert = acknowledgeAlert;
window.changePriority = changePriority;
window.reassignAlert = reassignAlert;
window.dismissAlert = dismissAlert;
window.viewHistory = viewHistory;
window.toggleRule = toggleRule;
window.editRule = editRule;
window.viewRuleAnalytics = viewRuleAnalytics;
window.testRule = testRule;

