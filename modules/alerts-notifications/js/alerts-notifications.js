// Alerts & Notifications JavaScript - Database Integrated

let alertsData = {
    alerts: [],
    allAlerts: [], // All alerts (all statuses) for dashboard statistics
    rules: []
};

let filteredAlerts = [];
let selectedAlerts = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAlerts();
    setupEventListeners();
    updateLastUpdated();
    setupMessageListener();
    
    // Auto-refresh every 60 seconds
    setInterval(() => {
        updateLastUpdated();
        loadAlerts();
    }, 60000);
});

/**
 * Setup message listener for parent window communication
 */
function setupMessageListener() {
    window.addEventListener('message', function(event) {
        // Handle switchTab message
        if (event.data && event.data.action === 'switchTab') {
            const tabId = event.data.tab;
            const tabButton = document.getElementById(tabId);
            if (tabButton) {
                tabButton.click();
            }
        }
        
        // Handle clickButton message (for triggering buttons from Quick Actions)
        if (event.data && event.data.action === 'clickButton') {
            const buttonId = event.data.buttonId;
            const button = document.getElementById(buttonId);
            if (button) {
                button.click();
            }
        }
        
        // Handle showAlertDetails message
        if (event.data && event.data.action === 'showAlertDetails') {
            const alertId = event.data.alertId;
            if (alertId) {
                // Function to try showing the alert
                const tryShowAlert = (attempts = 0) => {
                    // Wait for alerts to load if needed
                    if (alertsData.alerts && alertsData.alerts.length > 0) {
                        showAlertDetails(alertId);
                    } else if (attempts < 10) {
                        // Wait a bit and try again
                        setTimeout(() => {
                            tryShowAlert(attempts + 1);
                        }, 500);
                    } else {
                        console.warn('Could not find alert after waiting for data to load:', alertId);
                    }
                };
                
                // Start trying to show the alert
                tryShowAlert();
            }
        }
    });
}

/**
 * Transform database alert rule to UI format
 */
function transformRule(dbRule, allAlerts = []) {
    // Parse conditions JSONB
    const conditions = typeof dbRule.conditions === 'string' 
        ? JSON.parse(dbRule.conditions) 
        : (dbRule.conditions || {});
    
    // Build trigger condition description
    let triggerCondition = '';
    let triggerPlainEnglish = '';
    
    if (conditions.field && conditions.operator) {
        const fieldName = conditions.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const operator = conditions.operator;
        const value = conditions.value;
        
        switch (operator) {
            case 'less_than_days':
                triggerCondition = `${conditions.field} < NOW() + INTERVAL '${value} days'`;
                triggerPlainEnglish = `${fieldName} is within ${value} days`;
                break;
            case 'less_than':
                triggerCondition = `${conditions.field} < ${value === 'today' ? 'NOW()' : value}`;
                triggerPlainEnglish = `${fieldName} is ${value === 'today' ? 'overdue' : 'before ' + value}`;
                break;
            case 'equals':
                triggerCondition = `${conditions.field} = ${value}`;
                triggerPlainEnglish = `${fieldName} equals ${value}`;
                break;
            case 'less_than':
                triggerCondition = `${conditions.field} < ${value}`;
                triggerPlainEnglish = `${fieldName} is below ${value}`;
                break;
            default:
                triggerCondition = `${conditions.field} ${operator} ${value}`;
                triggerPlainEnglish = `${fieldName} ${operator} ${value}`;
        }
    }
    
    // Build recipients list
    const recipients = [];
    if (dbRule.notify_representative) recipients.push('Representative');
    if (dbRule.notify_key_individual) recipients.push('Key Individual');
    if (dbRule.notify_compliance_officer) recipients.push('Compliance Officer');
    if (dbRule.notify_fsp_owner) recipients.push('FSP Owner');
    
    // Calculate alerts generated from actual alerts data
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    // Filter alerts by rule ID - check both transformed and raw database fields
    const ruleAlerts = (allAlerts || []).filter(alert => {
        const alertRuleId = alert.alert_rule_id || alert._db?.alert_rule_id;
        return alertRuleId === dbRule.id;
    });
    
    // Calculate alerts generated in last 30 days
    const alertsGenerated30Days = ruleAlerts.filter(alert => {
        const alertDate = new Date(alert.created_at || alert._db?.created_at || alert.valid_from || alert.created || 0);
        return alertDate >= thirtyDaysAgo && alertDate <= now;
    }).length;
    
    // Calculate alerts generated in last 12 months
    const alertsGenerated12Months = ruleAlerts.filter(alert => {
        const alertDate = new Date(alert.created_at || alert._db?.created_at || alert.valid_from || alert.created || 0);
        return alertDate >= twelveMonthsAgo && alertDate <= now;
    }).length;
    
    // Calculate currently active alerts
    const currentlyActive = ruleAlerts.filter(alert => {
        const status = alert.status || alert._db?.status || 'active';
        return status === 'active';
    }).length;
    
    return {
        id: dbRule.id,
        name: dbRule.rule_name,
        description: dbRule.rule_description || '',
        category: dbRule.target_entity || 'system',
        triggerCondition: triggerCondition,
        triggerPlainEnglish: triggerPlainEnglish || dbRule.rule_description || 'Condition met',
        checkFrequency: dbRule.alert_frequency || 'once',
        priority: (dbRule.priority || 'medium').toLowerCase(),
        recipients: recipients.length > 0 ? recipients : ['System'],
        alertsGenerated30Days: alertsGenerated30Days,
        alertsGenerated12Months: alertsGenerated12Months,
        currentlyActive: currentlyActive,
        status: dbRule.is_active ? 'active' : 'inactive',
        escalationEnabled: dbRule.escalation_enabled || false,
        escalationDelay: dbRule.escalation_delay_hours || 24,
        escalationTo: dbRule.escalation_to_role || null,
        sendEmail: dbRule.send_email || false,
        sendSms: dbRule.send_sms || false,
        sendInApp: dbRule.send_in_app !== false, // Default true
        isSystemRule: dbRule.is_system_rule || false,
        _db: dbRule // Keep original for full details
    };
}

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
        alert_rule_id: dbAlert.alert_rule_id || null, // Preserve rule ID for linking
        created_at: dbAlert.created_at || validFrom.toISOString(), // Preserve for date calculations
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
        
        // Load ALL alerts (all statuses) for complete history and dashboard stats
        const allAlertsResult = await dataFunctionsToUse.getAlerts(null, null, null, null); // null = all statuses
        let allAlerts = allAlertsResult;
        if (allAlertsResult && allAlertsResult.data) {
            allAlerts = allAlertsResult.data;
        } else if (allAlertsResult && Array.isArray(allAlertsResult)) {
            allAlerts = allAlertsResult;
        }
        
        // Transform all alerts to UI format
        alertsData.allAlerts = (allAlerts || []).map(transformAlert);
        
        // Filter to active alerts for the main view
        alertsData.alerts = alertsData.allAlerts.filter(alert => alert.status === 'active');
        filteredAlerts = [...alertsData.alerts];
        
        // Update active count badge (only active alerts)
        const activeCountBadge = document.getElementById('activeCount');
        if (activeCountBadge) {
            activeCountBadge.textContent = alertsData.alerts.length;
        }
        
        // Load alert rules
        if (typeof dataFunctionsToUse.getAlertRules === 'function') {
            const rulesResult = await dataFunctionsToUse.getAlertRules(true, null, null);
            let rules = rulesResult;
            if (rulesResult && rulesResult.data) {
                rules = rulesResult.data;
            } else if (rulesResult && Array.isArray(rulesResult)) {
                rules = rulesResult;
            }
            
            // Transform database rules to UI format with alert counts (use allAlerts for accurate counts)
            alertsData.rules = (rules || []).map(rule => transformRule(rule, alertsData.allAlerts || []));
        } else {
        alertsData.rules = [];
        }
        
        initializeAlerts();
        
    } catch (error) {
        console.error('Error loading alerts:', error);
        alertsData.alerts = [];
        alertsData.allAlerts = [];
        alertsData.rules = [];
        filteredAlerts = [];
        initializeAlerts();
    }
}

function initializeAlerts() {
    updateDashboardStats();
    renderAlertsTable();
    renderAlertRules();
    renderRuleSummaryCards();
    renderHeatmap();
    initializeTooltips();
    updateFilterCounts();
    setupRuleEventListeners();
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
    
    if (!alertsData.rules || alertsData.rules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">No alert rules configured</td></tr>';
        return;
    }
    
    alertsData.rules.forEach(rule => {
        const row = createRuleRow(rule);
        tbody.appendChild(row);
    });
}

function renderRuleSummaryCards() {
    if (!alertsData.rules || alertsData.rules.length === 0) return;
    
    const activeRules = alertsData.rules.filter(r => r.status === 'active').length;
    const disabledRules = alertsData.rules.filter(r => r.status === 'inactive').length;
    
    // Calculate total alerts generated in last 30 days
    const totalAlerts30Days = alertsData.rules.reduce((sum, rule) => sum + (rule.alertsGenerated30Days || 0), 0);
    
    // Calculate average alerts per day (last 30 days)
    const avgAlertsPerDay = (totalAlerts30Days / 30).toFixed(1);
    
    // Update summary cards
    const activeCard = document.querySelector('.rule-summary-card .summary-number.text-success');
    if (activeCard) {
        activeCard.textContent = activeRules;
    }
    
    const disabledCard = document.querySelector('.rule-summary-card .summary-number.text-secondary');
    if (disabledCard) {
        disabledCard.textContent = disabledRules;
    }
    
    // Update alerts generated card
    const alertsCard = document.querySelector('.rule-summary-card .summary-number');
    if (alertsCard && alertsCard.textContent === '127') {
        alertsCard.textContent = totalAlerts30Days;
    }
    
    // Update average alerts per day
    const avgCard = document.querySelectorAll('.rule-summary-card .summary-number');
    if (avgCard.length >= 4 && avgCard[3].textContent === '4.2') {
        avgCard[3].textContent = avgAlertsPerDay;
    }
}

function setupRuleEventListeners() {
    // Create Rule button
    const createRuleBtn = document.getElementById('createRuleBtn');
    if (createRuleBtn) {
        createRuleBtn.addEventListener('click', () => {
            showCreateRuleModal();
        });
    }
    
    // Rule Analytics button
    const ruleAnalyticsBtn = document.getElementById('ruleAnalyticsBtn');
    if (ruleAnalyticsBtn) {
        ruleAnalyticsBtn.addEventListener('click', () => {
            const totalRules = alertsData.rules.length;
            const activeRules = alertsData.rules.filter(r => r.status === 'active').length;
            const totalAlerts = alertsData.alerts.length;
            const totalAlerts30Days = alertsData.rules.reduce((sum, rule) => sum + (rule.alertsGenerated30Days || 0), 0);
            
            Swal.fire({
                title: 'Overall Rule Analytics',
                html: `
                    <div class="text-start">
                        <h6>Summary</h6>
                        <ul class="list-unstyled">
                            <li><strong>Total Rules:</strong> ${totalRules}</li>
                            <li><strong>Active Rules:</strong> ${activeRules}</li>
                            <li><strong>Inactive Rules:</strong> ${totalRules - activeRules}</li>
                        </ul>
                        <hr>
                        <h6>Alert Generation</h6>
                        <ul class="list-unstyled">
                            <li><strong>Total Alerts:</strong> ${totalAlerts}</li>
                            <li><strong>Alerts (30 Days):</strong> ${totalAlerts30Days}</li>
                            <li><strong>Avg per Day:</strong> ${(totalAlerts30Days / 30).toFixed(1)}</li>
                        </ul>
                    </div>
                `,
                width: '500px',
                confirmButtonText: 'Close'
            });
        });
    }
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
    
    // Calculate heatmap data from actual alerts
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    const priorityLabels = ['Critical', 'High', 'Medium', 'Low'];
    
    // Get last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }
    
    // Count alerts by priority and day
    const heatmapData = {};
    priorities.forEach(priority => {
        heatmapData[priority] = last7Days.map(date => {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            
            return alertsData.alerts.filter(alert => {
                const alertDate = alert._db?.valid_from ? new Date(alert._db.valid_from) : new Date(alert.created);
                return alert.priority === priority && 
                       alertDate >= dayStart && 
                       alertDate <= dayEnd;
            }).length;
        });
    });
    
    let html = '<div class="heatmap-grid">';
    html += '<div></div>'; // Empty cell for day labels
    
    // Day headers
    last7Days.forEach((date, idx) => {
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
        html += `<div class="text-center fw-bold small" title="${date.toLocaleDateString('en-ZA')}">${dayName}</div>`;
    });
    
    // Priority rows
    priorities.forEach((priority, pIdx) => {
        html += `<div class="fw-bold small">${priorityLabels[pIdx]}</div>`;
        heatmapData[priority].forEach(count => {
            const intensity = Math.min(count, 10); // Cap at 10 for visualization
            const cellClass = intensity === 0 ? '' : intensity <= 2 ? 'low' : intensity <= 5 ? 'medium' : 'high';
            html += `<div class="heatmap-cell ${cellClass}" title="${priorityLabels[pIdx]}: ${count} alerts"></div>`;
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
    
    filteredAlerts = alertsData.alerts.filter(alert => {
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
    // If alertId is already an alert object, use it directly
    if (typeof alertId !== 'string') {
        var alert = alertId;
    } else {
        // Find alert by ID in the alerts array
        var alert = alertsData.alerts.find(a => {
            // Try exact match first
            if (a.id === alertId) return true;
            // Try matching with database ID
            if (a._db && (a._db.id === alertId || a._db.alert_id === alertId)) return true;
            // Try matching UUID substring
            if (a._db && a._db.id && alertId.includes(a._db.id.substring(0, 8))) return true;
            return false;
        });
    }
    
    if (!alert) {
        console.warn('Alert not found:', alertId, 'Available alerts:', alertsData.alerts.map(a => a.id));
        return;
    }
    
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


async function toggleRule(ruleId) {
    try {
        const rule = alertsData.rules.find(r => r.id === ruleId);
        if (!rule) {
            Swal.fire('Error', 'Rule not found', 'error');
            return;
        }
        
        const newStatus = rule.status === 'active' ? 'inactive' : 'active';
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (dataFunctionsToUse && typeof dataFunctionsToUse.updateAlertRule === 'function') {
            await dataFunctionsToUse.updateAlertRule(ruleId, {
                is_active: newStatus === 'active'
            });
            
            // Update local data
            rule.status = newStatus;
            rule._db.is_active = newStatus === 'active';
            
            // Re-render rules table
            renderAlertRules();
            renderRuleSummaryCards();
            
    Swal.fire({
                title: 'Rule Updated',
                text: `Rule has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            // Fallback if dataFunctions not available
            rule.status = newStatus;
            renderAlertRules();
            renderRuleSummaryCards();
            Swal.fire({
                title: 'Rule Updated',
                text: `Rule has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
        }
    } catch (error) {
        console.error('Error toggling rule:', error);
        Swal.fire('Error', 'Failed to update rule status', 'error');
    }
}

function editRule(ruleId) {
    const rule = alertsData.rules.find(r => r.id === ruleId);
    if (!rule) {
        Swal.fire('Error', 'Rule not found', 'error');
        return;
    }
    
    const dbRule = rule._db;
    
    Swal.fire({
        title: 'Edit Alert Rule',
        html: `
            <div class="text-start">
                <div class="mb-3">
                    <label class="form-label">Rule Name</label>
                    <input type="text" class="form-control" id="editRuleName" value="${rule.name}" readonly>
                    <small class="text-muted">System rules cannot be renamed</small>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="editRuleDescription" rows="3">${rule.description || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Priority</label>
                    <select class="form-select" id="editRulePriority">
                        <option value="low" ${rule.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${rule.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${rule.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="critical" ${rule.priority === 'critical' ? 'selected' : ''}>Critical</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Alert Frequency</label>
                    <select class="form-select" id="editRuleFrequency">
                        <option value="once" ${rule.checkFrequency === 'once' ? 'selected' : ''}>Once</option>
                        <option value="daily" ${rule.checkFrequency === 'daily' ? 'selected' : ''}>Daily</option>
                        <option value="weekly" ${rule.checkFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="until_resolved" ${rule.checkFrequency === 'until_resolved' ? 'selected' : ''}>Until Resolved</option>
                    </select>
                </div>
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="editRuleEmail" ${rule.sendEmail ? 'checked' : ''}>
                        <label class="form-check-label" for="editRuleEmail">Send Email Notification</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="editRuleSms" ${rule.sendSms ? 'checked' : ''}>
                        <label class="form-check-label" for="editRuleSms">Send SMS Notification (Critical only)</label>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        preConfirm: async () => {
            const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                ? dataFunctions 
                : (window.dataFunctions || window.parent?.dataFunctions);
            
            if (!dataFunctionsToUse || typeof dataFunctionsToUse.updateAlertRule !== 'function') {
                Swal.showValidationMessage('Data functions not available');
                return false;
            }
            
            try {
                await dataFunctionsToUse.updateAlertRule(ruleId, {
                    rule_description: document.getElementById('editRuleDescription').value,
                    priority: document.getElementById('editRulePriority').value,
                    alert_frequency: document.getElementById('editRuleFrequency').value,
                    send_email: document.getElementById('editRuleEmail').checked,
                    send_sms: document.getElementById('editRuleSms').checked
                });
                
                // Reload rules to get updated data
                await loadAlerts();
                return true;
            } catch (error) {
                Swal.showValidationMessage(`Error: ${error.message}`);
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Success', 'Rule updated successfully', 'success');
        }
    });
}

function viewRuleAnalytics(ruleId) {
    const rule = alertsData.rules.find(r => r.id === ruleId);
    if (!rule) {
        Swal.fire('Error', 'Rule not found', 'error');
        return;
    }
    
    // Get all alerts for this rule
    const ruleAlerts = alertsData.alerts.filter(alert => {
        return alert._db && alert._db.alert_rule_id === ruleId;
    });
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const alerts30Days = ruleAlerts.filter(a => {
        const date = new Date(a.created || a._db?.created_at || 0);
        return date >= thirtyDaysAgo;
    });
    
    const alerts7Days = ruleAlerts.filter(a => {
        const date = new Date(a.created || a._db?.created_at || 0);
        return date >= sevenDaysAgo;
    });
    
    const byStatus = {
        active: ruleAlerts.filter(a => a.status === 'active').length,
        resolved: ruleAlerts.filter(a => a.status === 'resolved').length,
        acknowledged: ruleAlerts.filter(a => a.status === 'acknowledged').length,
        dismissed: ruleAlerts.filter(a => a.status === 'dismissed').length
    };
    
    const byPriority = {
        critical: ruleAlerts.filter(a => a.priority === 'critical').length,
        high: ruleAlerts.filter(a => a.priority === 'high').length,
        medium: ruleAlerts.filter(a => a.priority === 'medium').length,
        low: ruleAlerts.filter(a => a.priority === 'low').length
    };
    
    Swal.fire({
        title: `Analytics: ${rule.name}`,
        html: `
            <div class="text-start">
                <h6 class="mb-3">Alert Statistics</h6>
                <div class="row g-3 mb-3">
                    <div class="col-6">
                        <div class="border rounded p-2">
                            <div class="fw-bold text-primary">${ruleAlerts.length}</div>
                            <small>Total Alerts (All Time)</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="border rounded p-2">
                            <div class="fw-bold text-success">${rule.alertsGenerated30Days}</div>
                            <small>Last 30 Days</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="border rounded p-2">
                            <div class="fw-bold text-info">${alerts7Days.length}</div>
                            <small>Last 7 Days</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="border rounded p-2">
                            <div class="fw-bold text-warning">${rule.currentlyActive}</div>
                            <small>Currently Active</small>
                        </div>
                    </div>
                </div>
                
                <h6 class="mb-2 mt-3">By Status</h6>
                <div class="small mb-2">
                    <span class="badge bg-success me-1">Active: ${byStatus.active}</span>
                    <span class="badge bg-primary me-1">Resolved: ${byStatus.resolved}</span>
                    <span class="badge bg-info me-1">Acknowledged: ${byStatus.acknowledged}</span>
                    <span class="badge bg-secondary">Dismissed: ${byStatus.dismissed}</span>
                </div>
                
                <h6 class="mb-2 mt-3">By Priority</h6>
                <div class="small mb-2">
                    <span class="badge bg-danger me-1">Critical: ${byPriority.critical}</span>
                    <span class="badge bg-warning me-1">High: ${byPriority.high}</span>
                    <span class="badge bg-info me-1">Medium: ${byPriority.medium}</span>
                    <span class="badge bg-secondary">Low: ${byPriority.low}</span>
                </div>
                
                <div class="mt-3">
                    <small class="text-muted">Rule Status: <strong>${rule.status === 'active' ? 'Active' : 'Inactive'}</strong></small><br>
                    <small class="text-muted">Check Frequency: <strong>${rule.checkFrequency}</strong></small>
                </div>
            </div>
        `,
        width: '600px',
        showConfirmButton: true,
        confirmButtonText: 'Close'
    });
}

async function testRule(ruleId) {
    const rule = alertsData.rules.find(r => r.id === ruleId);
    if (!rule) {
        Swal.fire('Error', 'Rule not found', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Testing Rule...',
        text: 'Checking current data against rule conditions',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Simulate rule testing - in a real implementation, this would call a backend function
        // that evaluates the rule conditions against current data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Calculate how many alerts would be generated
        const ruleAlerts = alertsData.alerts.filter(alert => {
            return alert._db && alert._db.alert_rule_id === ruleId && alert.status === 'active';
        });
        
        const wouldGenerate = ruleAlerts.length;
        
        Swal.fire({
            title: 'Test Results',
            html: `
                <div class="text-start">
                    <p><strong>Rule:</strong> ${rule.name}</p>
                    <p><strong>Condition:</strong> ${rule.triggerPlainEnglish}</p>
                    <hr>
                    <p class="mb-2"><strong>Test Results:</strong></p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        This rule would currently generate <strong>${wouldGenerate}</strong> active alert(s) based on current data.
                    </div>
                    ${wouldGenerate > 0 ? `
                        <p class="small text-muted mt-2">
                            Note: These alerts may already exist. The rule checks data continuously based on its frequency setting (${rule.checkFrequency}).
                        </p>
                    ` : `
                        <p class="small text-success mt-2">
                            ✓ No alerts would be generated. All conditions are currently met.
                        </p>
                    `}
                </div>
            `,
            icon: wouldGenerate > 0 ? 'warning' : 'success',
            confirmButtonText: 'Close'
        });
    } catch (error) {
        console.error('Error testing rule:', error);
        Swal.fire('Error', 'Failed to test rule', 'error');
    }
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
        loadAlerts().then(() => {
            icon.classList.remove('fa-spin');
            updateLastUpdated();
            Swal.fire({
                title: 'Refreshed',
                text: 'Data has been refreshed',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }).catch(error => {
            icon.classList.remove('fa-spin');
            console.error('Error refreshing:', error);
        });
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

/**
 * Update Dashboard Statistics from Real Data
 */
function updateDashboardStats() {
    // Use ALL alerts (not just active) for comprehensive statistics
    // Prefer allAlerts if available, otherwise use alerts
    const allAlerts = (alertsData.allAlerts && alertsData.allAlerts.length > 0) 
        ? alertsData.allAlerts 
        : (alertsData.alerts || []);
    
    // Filter to active alerts only for the main dashboard cards
    const activeAlerts = allAlerts.filter(a => a.status === 'active');
    
    // Calculate counts by priority (from active alerts)
    const criticalCount = activeAlerts.filter(a => a.priority === 'critical').length;
    const highCount = activeAlerts.filter(a => a.priority === 'high').length;
    const mediumCount = activeAlerts.filter(a => a.priority === 'medium').length;
    const lowCount = activeAlerts.filter(a => a.priority === 'low').length;
    const totalActive = activeAlerts.length;
    
    // Calculate overdue count (from active alerts)
    const overdueCount = activeAlerts.filter(a => a.overdue === true).length;
    
    // Calculate acknowledged count (from all alerts)
    const acknowledgedCount = allAlerts.filter(a => a.status === 'acknowledged').length;
    
    // Update summary cards
    updateSummaryCard('all', totalActive);
    updateSummaryCard('critical', criticalCount);
    updateSummaryCard('high', highCount);
    updateSummaryCard('medium', mediumCount);
    updateSummaryCard('overdue', overdueCount);
    updateSummaryCard('acknowledged', acknowledgedCount);
    
    // Calculate today's alerts (from all alerts)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const todayAlerts = allAlerts.filter(a => {
        const alertDate = a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : 
                         (a.created ? new Date(a.created) : new Date()));
        return alertDate >= today && alertDate <= todayEnd;
    }).length;
    
    // Calculate yesterday's alerts for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    const yesterdayAlerts = allAlerts.filter(a => {
        const alertDate = a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : 
                         (a.created ? new Date(a.created) : new Date()));
        return alertDate >= yesterday && alertDate <= yesterdayEnd;
    }).length;
    
    const todayTrend = todayAlerts > yesterdayAlerts ? `+${todayAlerts - yesterdayAlerts} vs yesterday` :
                      todayAlerts < yesterdayAlerts ? `${todayAlerts - yesterdayAlerts} vs yesterday` :
                      'Same as yesterday';
    
    // Update quick statistics
    updateQuickStat('alerts-today', todayAlerts);
    const todayTrendEl = document.querySelector('#alerts-today').parentElement.querySelector('small');
    if (todayTrendEl) {
        todayTrendEl.textContent = todayTrend;
    }
    
    // Calculate average response time from resolved alerts
    const resolvedAlerts = allAlerts.filter(a => a.status === 'resolved' && a._db?.resolved_at && a._db?.created_at);
    let avgResponseTime = '-';
    if (resolvedAlerts.length > 0) {
        const totalResponseTime = resolvedAlerts.reduce((sum, alert) => {
            const created = new Date(alert._db.created_at || alert._db.valid_from);
            const resolved = new Date(alert._db.resolved_at);
            const hours = (resolved - created) / (1000 * 60 * 60);
            return sum + hours;
        }, 0);
        const avgHours = (totalResponseTime / resolvedAlerts.length).toFixed(1);
        avgResponseTime = `${avgHours} hrs`;
    }
    updateQuickStat('avg-response-time', avgResponseTime);
    
    // Calculate dismissed in last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dismissed7Days = allAlerts.filter(a => {
        if (a.status !== 'dismissed') return false;
        const alertDate = a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : 
                         (a.created ? new Date(a.created) : new Date()));
        return alertDate >= sevenDaysAgo;
    }).length;
    
    // Calculate dismissed in previous 7 days for comparison
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const dismissedPrev7Days = allAlerts.filter(a => {
        if (a.status !== 'dismissed') return false;
        const alertDate = a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : 
                         (a.created ? new Date(a.created) : new Date()));
        return alertDate >= fourteenDaysAgo && alertDate < sevenDaysAgo;
    }).length;
    
    const dismissedTrend = dismissed7Days > dismissedPrev7Days ? `+${dismissed7Days - dismissedPrev7Days} vs previous week` :
                           dismissed7Days < dismissedPrev7Days ? `${dismissed7Days - dismissedPrev7Days} vs previous week` :
                           'Same as previous week';
    
    updateQuickStat('dismissed-7days', dismissed7Days);
    const dismissedTrendEl = document.querySelector('#dismissed-7days').parentElement.querySelector('small');
    if (dismissedTrendEl) {
        dismissedTrendEl.textContent = dismissedTrend;
    }
    
    // Calculate escalated in last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const escalated30Days = allAlerts.filter(a => {
        if (!a._db?.escalated) return false;
        const alertDate = a._db?.escalated_at ? new Date(a._db.escalated_at) :
                         (a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : new Date()));
        return alertDate >= thirtyDaysAgo;
    }).length;
    
    updateQuickStat('escalated-30days', escalated30Days);
    
    // Update history tab statistics
    updateHistoryStats(allAlerts);
}

function updateSummaryCard(filter, count) {
    // Try to find by ID first
    const idMap = {
        'all': 'summary-total-active',
        'critical': 'summary-critical',
        'high': 'summary-high',
        'medium': 'summary-medium',
        'overdue': 'summary-overdue',
        'acknowledged': 'summary-acknowledged'
    };
    
    const id = idMap[filter];
    if (id) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = count;
            return;
        }
    }
    
    // Fallback to card selector
    const card = document.querySelector(`.alert-summary-card[data-filter="${filter}"]`);
    if (!card) return;
    
    const numberEl = card.querySelector('.summary-number');
    if (numberEl) {
        numberEl.textContent = count;
    }
}

function updateQuickStat(statId, value) {
    const statEl = document.getElementById(statId);
    if (statEl) {
        statEl.textContent = value;
    }
}

/**
 * Update History Tab Statistics
 */
function updateHistoryStats(allAlerts) {
    // Calculate statistics for last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const alerts90Days = allAlerts.filter(a => {
        const alertDate = a._db?.created_at ? new Date(a._db.created_at) : 
                         (a._db?.valid_from ? new Date(a._db.valid_from) : 
                         (a.created ? new Date(a.created) : new Date()));
        return alertDate >= ninetyDaysAgo;
    });
    
    // Total alerts in last 90 days
    const totalAlerts90Days = alerts90Days.length;
    const historyTab = document.getElementById('history');
    if (historyTab) {
        const historyStatCards = historyTab.querySelectorAll('.stat-card .stat-number');
        
        // Update total alerts
        if (historyStatCards.length > 0) {
            historyStatCards[0].textContent = totalAlerts90Days;
        }
        
        // Average resolution time
        const resolvedAlerts90Days = alerts90Days.filter(a => a.status === 'resolved' && a._db?.resolved_at && a._db?.created_at);
        let avgResolutionTime = '-';
        if (resolvedAlerts90Days.length > 0) {
            const totalResolutionTime = resolvedAlerts90Days.reduce((sum, alert) => {
                const created = new Date(alert._db.created_at || alert._db.valid_from);
                const resolved = new Date(alert._db.resolved_at);
                const days = (resolved - created) / (1000 * 60 * 60 * 24);
                return sum + days;
            }, 0);
            const avgDays = (totalResolutionTime / resolvedAlerts90Days.length).toFixed(1);
            avgResolutionTime = `${avgDays} days`;
        }
        
        // Update avg resolution time
        if (historyStatCards.length > 1) {
            historyStatCards[1].textContent = avgResolutionTime;
        }
        
        // Dismissed count and percentage
        const dismissed90Days = alerts90Days.filter(a => a.status === 'dismissed').length;
        const dismissedPercentage = totalAlerts90Days > 0 ? ((dismissed90Days / totalAlerts90Days) * 100).toFixed(0) : 0;
        
        if (historyStatCards.length > 2) {
            historyStatCards[2].textContent = `${dismissed90Days} (${dismissedPercentage}%)`;
        }
        
        // Escalated count and percentage
        const escalated90Days = alerts90Days.filter(a => a._db?.escalated === true).length;
        const escalatedPercentage = totalAlerts90Days > 0 ? ((escalated90Days / totalAlerts90Days) * 100).toFixed(0) : 0;
        
        if (historyStatCards.length > 3) {
            historyStatCards[3].textContent = `${escalated90Days} (${escalatedPercentage}%)`;
        }
    }
}

/**
 * Update Filter Counts in Dropdowns
 */
function updateFilterCounts() {
    const alerts = alertsData.alerts || [];
    
    // Count by category
    const categoryCounts = {};
    alerts.forEach(alert => {
        const category = alert.category || 'system';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Update category filter options
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        const options = categoryFilter.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            if (value !== 'all' && value !== '') {
                const count = categoryCounts[value] || 0;
                const label = option.textContent.split(' (')[0];
                option.textContent = `${label} (${count})`;
            }
        });
    }
    
    // Count by status
    const statusCounts = {};
    alerts.forEach(alert => {
        const status = alert.status || 'active';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Update status filter options
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        const options = statusFilter.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            if (value !== 'all' && value !== '') {
                const count = statusCounts[value] || 0;
                const label = option.textContent.split(' (')[0];
                option.textContent = `${label} (${count})`;
            }
        });
    }
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
function showCreateRuleModal() {
    Swal.fire({
        title: 'Create New Alert Rule',
        html: `
            <form id="createRuleForm" class="text-start">
                <!-- Rule Name -->
                <div class="mb-3">
                    <label class="form-label">Rule Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="newRuleName" required 
                           placeholder="e.g., RE5 Certificate Expiring Soon">
                    <small class="text-muted">Unique name for this alert rule</small>
                </div>
                
                <!-- Rule Description -->
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="newRuleDescription" rows="2" 
                              placeholder="Describe what this rule monitors and when it triggers"></textarea>
                </div>
                
                <!-- Rule Type -->
                <div class="mb-3">
                    <label class="form-label">Rule Type <span class="text-danger">*</span></label>
                    <select class="form-select" id="newRuleType" required>
                        <option value="">Select rule type...</option>
                        <option value="expiry">Expiry (monitors expiration dates)</option>
                        <option value="threshold">Threshold (monitors numeric values)</option>
                        <option value="deadline">Deadline (monitors upcoming deadlines)</option>
                        <option value="overdue">Overdue (monitors past due items)</option>
                        <option value="status_change">Status Change (monitors status changes)</option>
                    </select>
                </div>
                
                <!-- Target Entity -->
                <div class="mb-3">
                    <label class="form-label">Target Entity <span class="text-danger">*</span></label>
                    <select class="form-select" id="newTargetEntity" required>
                        <option value="">Select entity type...</option>
                        <option value="fit_and_proper">Fit & Proper</option>
                        <option value="fica">FICA</option>
                        <option value="cpd">CPD</option>
                        <option value="insurance">Insurance</option>
                        <option value="complaints">Complaints</option>
                        <option value="documents">Documents</option>
                        <option value="compliance">Compliance</option>
                        <option value="training">Training</option>
                        <option value="internal_audit">Internal Audit</option>
                        <option value="representative">Representative</option>
                        <option value="client">Client</option>
                        <option value="system">System</option>
                    </select>
                </div>
                
                <!-- Condition Field -->
                <div class="mb-3">
                    <label class="form-label">Field to Monitor <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="newConditionField" required 
                           placeholder="e.g., re5_expiry_date, next_review_date">
                    <small class="text-muted" id="fieldHelper">Database field name to monitor</small>
                    <div id="fieldSuggestions" class="mt-1" style="display: none;">
                        <small class="text-info">Common fields for this entity:</small>
                        <div id="fieldSuggestionsList" class="small text-muted"></div>
                    </div>
                </div>
                
                <!-- Condition Operator -->
                <div class="mb-3">
                    <label class="form-label">Condition Operator <span class="text-danger">*</span></label>
                    <select class="form-select" id="newConditionOperator" required>
                        <option value="">Select operator...</option>
                        <option value="less_than_days">Less than X days away</option>
                        <option value="less_than">Less than (overdue)</option>
                        <option value="equals">Equals</option>
                        <option value="greater_than">Greater than</option>
                        <option value="not_equals">Not equals</option>
                    </select>
                </div>
                
                <!-- Condition Value -->
                <div class="mb-3">
                    <label class="form-label">Condition Value <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="newConditionValue" required 
                           placeholder="e.g., 30 (for days), today, or a specific value">
                    <small class="text-muted" id="valueHelper">Value to compare against</small>
                </div>
                
                <!-- Priority -->
                <div class="mb-3">
                    <label class="form-label">Priority <span class="text-danger">*</span></label>
                    <select class="form-select" id="newRulePriority" required>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                
                <!-- Alert Frequency -->
                <div class="mb-3">
                    <label class="form-label">Check Frequency <span class="text-danger">*</span></label>
                    <select class="form-select" id="newAlertFrequency" required>
                        <option value="once">Once (when condition first met)</option>
                        <option value="daily" selected>Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="until_resolved">Until Resolved</option>
                    </select>
                </div>
                
                <!-- Notification Channels -->
                <div class="mb-3">
                    <label class="form-label">Notification Channels</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newSendEmail" checked>
                        <label class="form-check-label" for="newSendEmail">Send Email Notification</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newSendSms">
                        <label class="form-check-label" for="newSendSms">Send SMS Notification (Critical priority recommended)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newSendInApp" checked disabled>
                        <label class="form-check-label" for="newSendInApp">In-App Notification (always enabled)</label>
                    </div>
                </div>
                
                <!-- Recipients -->
                <div class="mb-3">
                    <label class="form-label">Notify Recipients</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newNotifyRep" checked>
                        <label class="form-check-label" for="newNotifyRep">Representative (affected)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newNotifyKI" checked>
                        <label class="form-check-label" for="newNotifyKI">Key Individual</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newNotifyCompliance" checked>
                        <label class="form-check-label" for="newNotifyCompliance">Compliance Officer</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newNotifyFSP">
                        <label class="form-check-label" for="newNotifyFSP">FSP Owner</label>
                    </div>
                </div>
                
                <!-- Escalation -->
                <div class="mb-3">
                    <label class="form-label">Escalation Settings</label>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="newEscalationEnabled">
                        <label class="form-check-label" for="newEscalationEnabled">Enable Escalation</label>
                    </div>
                    <div id="escalationSettings" style="display: none; padding-left: 20px;">
                        <div class="mb-2">
                            <label class="form-label small">Escalation Delay (hours)</label>
                            <input type="number" class="form-control form-control-sm" id="newEscalationDelay" 
                                   value="24" min="1" max="168">
                        </div>
                        <div>
                            <label class="form-label small">Escalate To</label>
                            <select class="form-select form-select-sm" id="newEscalationTo">
                                <option value="compliance_officer">Compliance Officer</option>
                                <option value="key_individual">Key Individual</option>
                                <option value="fsp_owner">FSP Owner</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Active Status -->
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newRuleActive" checked>
                        <label class="form-check-label" for="newRuleActive">Activate rule immediately</label>
                    </div>
                </div>
            </form>
        `,
        width: '700px',
        showCancelButton: true,
        confirmButtonText: 'Create Rule',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            // Show/hide escalation settings based on checkbox
            const escalationCheckbox = document.getElementById('newEscalationEnabled');
            const escalationSettings = document.getElementById('escalationSettings');
            
            if (escalationCheckbox && escalationSettings) {
                escalationCheckbox.addEventListener('change', (e) => {
                    escalationSettings.style.display = e.target.checked ? 'block' : 'none';
                });
            }
            
            // Show field suggestions based on target entity
            const targetEntity = document.getElementById('newTargetEntity');
            const fieldSuggestions = document.getElementById('fieldSuggestions');
            const fieldSuggestionsList = document.getElementById('fieldSuggestionsList');
            
            const fieldMap = {
                'fit_and_proper': ['re5_expiry_date', 're5_issue_date', 're1_expiry_date', 're1_issue_date', 'cob_class_1_date', 'cob_class_2_date', 'cob_class_3_date'],
                'fica': ['next_review_date', 'completeness_percentage', 'verification_date', 'id_verification_date', 'address_verification_date'],
                'cpd': ['cycle_end_date', 'total_hours', 'ethics_hours', 'technical_hours', 'activity_date'],
                'insurance': ['insurance_expiry_date', 'insurance_start_date', 'coverage_amount'],
                'complaints': ['acknowledgement_due_date', 'resolution_due_date', 'complaint_date', 'complaint_received_date'],
                'documents': ['expiry_date', 'document_date', 'upload_date'],
                'compliance': ['inspection_date', 'review_date', 'audit_date'],
                'training': ['training_due_date', 'training_completion_date'],
                'internal_audit': ['remediation_due_date', 'audit_period_end', 'planned_completion_date'],
                'representative': ['onboarding_date', 'authorization_date', 'deauthorization_date', 'is_debarred'],
                'client': ['client_since', 'next_review_date']
            };
            
            if (targetEntity && fieldSuggestions && fieldSuggestionsList) {
                targetEntity.addEventListener('change', (e) => {
                    const entity = e.target.value;
                    if (fieldMap[entity]) {
                        fieldSuggestions.style.display = 'block';
                        fieldSuggestionsList.innerHTML = fieldMap[entity].map(field => 
                            `<span class="badge bg-light text-dark me-1" style="cursor: pointer;" onclick="document.getElementById('newConditionField').value='${field}'">${field}</span>`
                        ).join('');
                    } else {
                        fieldSuggestions.style.display = 'none';
                    }
                });
            }
            
            // Update value helper text based on operator
            const conditionOperator = document.getElementById('newConditionOperator');
            const valueHelper = document.getElementById('valueHelper');
            const conditionValue = document.getElementById('newConditionValue');
            
            if (conditionOperator && valueHelper && conditionValue) {
                conditionOperator.addEventListener('change', (e) => {
                    const operator = e.target.value;
                    switch(operator) {
                        case 'less_than_days':
                            valueHelper.textContent = 'Enter number of days (e.g., 30 for 30 days)';
                            conditionValue.placeholder = '30';
                            conditionValue.type = 'number';
                            break;
                        case 'less_than':
                            valueHelper.textContent = 'Enter "today" for current date, or a specific date';
                            conditionValue.placeholder = 'today';
                            conditionValue.type = 'text';
                            break;
                        case 'equals':
                            valueHelper.textContent = 'Enter the exact value to match';
                            conditionValue.placeholder = 'exact value';
                            conditionValue.type = 'text';
                            break;
                        case 'greater_than':
                            valueHelper.textContent = 'Enter the minimum value';
                            conditionValue.placeholder = 'minimum value';
                            conditionValue.type = 'number';
                            break;
                        case 'not_equals':
                            valueHelper.textContent = 'Enter the value that should not match';
                            conditionValue.placeholder = 'value to exclude';
                            conditionValue.type = 'text';
                            break;
                        default:
                            valueHelper.textContent = 'Value to compare against';
                            conditionValue.placeholder = 'value';
                            conditionValue.type = 'text';
                    }
                });
            }
        },
        preConfirm: async () => {
            // Validate form
            const ruleName = document.getElementById('newRuleName').value.trim();
            const ruleType = document.getElementById('newRuleType').value;
            const targetEntity = document.getElementById('newTargetEntity').value;
            const conditionField = document.getElementById('newConditionField').value.trim();
            const conditionOperator = document.getElementById('newConditionOperator').value;
            const conditionValue = document.getElementById('newConditionValue').value.trim();
            const priority = document.getElementById('newRulePriority').value;
            
            if (!ruleName || !ruleType || !targetEntity || !conditionField || !conditionOperator || !conditionValue) {
                Swal.showValidationMessage('Please fill in all required fields');
                return false;
            }
            
            // Check if rule name already exists
            const existingRule = alertsData.rules.find(r => r.name.toLowerCase() === ruleName.toLowerCase());
            if (existingRule) {
                Swal.showValidationMessage('A rule with this name already exists. Please choose a different name.');
                return false;
            }
            
            // Build conditions JSONB object
            let conditionValueParsed = conditionValue;
            // Try to parse as number if it's numeric
            if (!isNaN(conditionValue) && conditionValue !== '') {
                conditionValueParsed = parseFloat(conditionValue);
            } else if (conditionValue.toLowerCase() === 'today') {
                conditionValueParsed = 'today';
            }
            
            const conditions = {
                field: conditionField,
                operator: conditionOperator,
                value: conditionValueParsed
            };
            
            // Build rule data
            const ruleData = {
                rule_name: ruleName,
                rule_description: document.getElementById('newRuleDescription').value.trim() || null,
                rule_type: ruleType,
                target_entity: targetEntity,
                conditions: conditions,
                priority: priority,
                alert_frequency: document.getElementById('newAlertFrequency').value,
                send_email: document.getElementById('newSendEmail').checked,
                send_sms: document.getElementById('newSendSms').checked,
                send_in_app: true, // Always true
                notify_representative: document.getElementById('newNotifyRep').checked,
                notify_key_individual: document.getElementById('newNotifyKI').checked,
                notify_compliance_officer: document.getElementById('newNotifyCompliance').checked,
                notify_fsp_owner: document.getElementById('newNotifyFSP').checked,
                escalation_enabled: document.getElementById('newEscalationEnabled').checked,
                escalation_delay_hours: document.getElementById('newEscalationEnabled').checked 
                    ? parseInt(document.getElementById('newEscalationDelay').value) : null,
                escalation_to_role: document.getElementById('newEscalationEnabled').checked
                    ? document.getElementById('newEscalationTo').value : null,
                is_active: document.getElementById('newRuleActive').checked
            };
            
            const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                ? dataFunctions 
                : (window.dataFunctions || window.parent?.dataFunctions);
            
            if (!dataFunctionsToUse || typeof dataFunctionsToUse.createAlertRule !== 'function') {
                Swal.showValidationMessage('Data functions not available');
                return false;
            }
            
            try {
                // Create rule with all fields
                const result = await dataFunctionsToUse.createAlertRule({
                    rule_name: ruleData.rule_name,
                    rule_description: ruleData.rule_description,
                    rule_type: ruleData.rule_type,
                    target_entity: ruleData.target_entity,
                    conditions: ruleData.conditions,
                    priority: ruleData.priority,
                    alert_frequency: ruleData.alert_frequency,
                    send_email: ruleData.send_email,
                    send_sms: ruleData.send_sms,
                    send_in_app: ruleData.send_in_app,
                    notify_representative: ruleData.notify_representative,
                    notify_key_individual: ruleData.notify_key_individual,
                    notify_compliance_officer: ruleData.notify_compliance_officer,
                    notify_fsp_owner: ruleData.notify_fsp_owner,
                    escalation_enabled: ruleData.escalation_enabled,
                    escalation_delay_hours: ruleData.escalation_delay_hours,
                    escalation_to_role: ruleData.escalation_to_role,
                    is_active: ruleData.is_active
                });
                
                return { success: true, result: result };
            } catch (error) {
                console.error('Error creating rule:', error);
                const errorMessage = error.message || 'Failed to create rule';
                // Check if it's a duplicate name error
                if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
                    Swal.showValidationMessage('A rule with this name already exists. Please choose a different name.');
                } else {
                    Swal.showValidationMessage(`Error: ${errorMessage}`);
                }
                return false;
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Reload rules to show the new one
            await loadAlerts();
            Swal.fire({
                title: 'Success!',
                text: 'Alert rule created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

window.toggleRule = toggleRule;
window.editRule = editRule;
window.viewRuleAnalytics = viewRuleAnalytics;
window.testRule = testRule;
window.showCreateRuleModal = showCreateRuleModal;

