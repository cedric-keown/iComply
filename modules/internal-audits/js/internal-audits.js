// Internal Audits JavaScript - Database Integrated

let auditsData = {
    audits: [],
    findings: []
};

/**
 * Load Audits from Database
 */
async function loadAudits() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            console.warn('dataFunctions not available, using empty data');
            auditsData.audits = [];
            auditsData.findings = [];
            initializeAudits();
            return;
        }
        
        // Load audits
        const auditsResult = await dataFunctionsToUse.getInternalAudits(null, null);
        let audits = auditsResult;
        if (auditsResult && auditsResult.data) {
            audits = auditsResult.data;
        } else if (auditsResult && Array.isArray(auditsResult)) {
            audits = auditsResult;
        }
        
        auditsData.audits = audits || [];
        
        // TODO: Load findings when function is available
        auditsData.findings = [];
        
        initializeAudits();
        
    } catch (error) {
        console.error('Error loading audits:', error);
        auditsData.audits = [];
        auditsData.findings = [];
        initializeAudits();
    }
}

// Legacy data structure for compatibility
const findingsData = [
    {
        id: 'FIND-2024-011-003',
        auditId: 'AUD-2024-011',
        auditName: 'Q4 Compliance Audit',
        title: 'FICA Verification Backlog - 6 Clients >30 Days',
        category: 'fica',
        severity: 'high',
        status: 'in-progress',
        dateRaised: '30/11/2024',
        daysOpen: 15,
        description: '6 clients have FICA verifications pending for >30 days, creating regulatory risk. Some clients have been pending for up to 45 days.',
        rootCause: 'Resource constraints in FICA verification team, backlog from October, manual verification process slow',
        evidence: ['FICA tracking report (30/11/2024)', 'Client verification log', 'Resource allocation review'],
        regulatoryRisk: 'FICA Act breach exposure, potential FSCA inspection finding, fines up to R10M under Section 45',
        impact: 'High - Immediate action required to prevent regulatory breach',
        recommendations: [
            'Immediate: Prioritize 3 highest-risk clients',
            'Short-term: Allocate additional resources',
            'Long-term: Improve FICA verification process'
        ],
        correctiveActions: 2,
        targetResolution: '31/12/2024'
    },
    {
        id: 'FIND-2024-012-001',
        auditId: 'AUD-2024-012',
        auditName: 'CPD Compliance Audit',
        title: 'CPD Progress - 3 Representatives Behind Schedule',
        category: 'cpd',
        severity: 'medium',
        status: 'draft',
        dateRaised: '15/12/2024',
        daysOpen: 0,
        description: '3 representatives behind expected CPD progress for current cycle period. Representatives have logged <60% of required hours with 167 days remaining.',
        evidence: [
            'David Koopman: 6/18 hours (33%)',
            'Sarah Naidoo: 11/18 hours (61%) + ethics not met',
            'Kagiso Mokoena: 10/18 hours (56%)'
        ],
        impact: 'Potential non-compliance if representatives don\'t complete requirements by May 31, 2025.',
        recommendations: [
            'Immediate intervention for David Koopman',
            'Monthly progress monitoring for all three',
            'Automated reminder system for representatives <70% progress'
        ],
        assignedTo: 'Compliance Officer',
        targetResolution: '31/01/2025'
    },
    {
        id: 'FIND-2024-010-002',
        auditId: 'AUD-2024-010',
        auditName: 'Document Management Audit',
        title: 'Document Retention - 15 Expired Documents Not Archived',
        category: 'documents',
        severity: 'medium',
        status: 'in-progress',
        dateRaised: '30/11/2024',
        daysOpen: 15,
        description: '15 documents that expired in September 2024 not moved to archive folder. Documents still in active filing system.',
        impact: 'Low compliance risk but affects organization and audit readiness.',
        recommendations: ['Archive expired documents and update filing procedures.'],
        assignedTo: 'Admin Staff',
        targetResolution: '20/12/2024',
        progress: 90
    }
];

const correctiveActionsData = [
    {
        id: 'CA-2024-011-003-A',
        findingId: 'FIND-2024-011-003',
        action: 'Complete FICA verification for 3 high-priority clients',
        assignedTo: 'Linda Zwane',
        assignedToRole: 'FICA Officer',
        dueDate: '20/12/2024',
        priority: 'high',
        status: 'in-progress',
        progress: 67,
        steps: [
            { name: 'Prioritize 3 clients', status: 'complete', date: '30/11/2024' },
            { name: 'Request missing documents', status: 'complete', date: '01/12/2024' },
            { name: 'Complete verifications', status: 'in-progress', progress: 67, note: '2/3 done' },
            { name: 'Update system records', status: 'pending' }
        ],
        updates: [
            { date: '15/12/2024', note: '2 of 3 clients verified (John Ndlovu, Sarah Thompson)' },
            { date: '13/12/2024', note: 'Documents received from 2 clients' },
            { date: '01/12/2024', note: 'Document requests sent' }
        ]
    },
    {
        id: 'CA-2024-010-002-A',
        findingId: 'FIND-2024-010-002',
        action: 'Archive all expired documents and update procedures',
        assignedTo: 'Admin Staff',
        dueDate: '20/12/2024',
        priority: 'medium',
        status: 'in-progress',
        progress: 90,
        steps: [
            { name: 'Identify all expired documents', status: 'complete', date: '30/11/2024' },
            { name: 'Create archive folders', status: 'complete', date: '05/12/2024' },
            { name: 'Move documents to archive', status: 'in-progress', progress: 87, note: '13/15 done' },
            { name: 'Update filing procedures', status: 'in-progress', note: 'draft ready' },
            { name: 'Train staff on new procedures', status: 'pending' }
        ],
        updates: [
            { date: '15/12/2024', note: '13/15 documents archived, procedures drafted' },
            { date: '10/12/2024', note: 'Archive structure created' },
            { date: '05/12/2024', note: 'Document inventory completed' }
        ]
    }
];

const complianceScores = [
    { category: 'Fit & Proper Compliance', score: 98, status: 'excellent', lastAudited: '30/11/2024', findings: 0 },
    { category: 'CPD Compliance', score: 92, status: 'very-good', lastAudited: '10/12/2024 (In progress)', findings: 1 },
    { category: 'FICA Verification', score: 95, status: 'excellent', lastAudited: '15/10/2024', findings: 2 },
    { category: 'Document Management', score: 96, status: 'excellent', lastAudited: '30/11/2024', findings: 0 },
    { category: 'Complaints Handling', score: 100, status: 'perfect', lastAudited: '30/09/2024', findings: 0 },
    { category: 'Representatives Management', score: 94, status: 'very-good', lastAudited: '30/11/2024', findings: 0 }
];

const recentActivity = [
    { date: '10/12/2024', activity: 'CPD Compliance Audit started', type: 'Internal', auditor: 'Compliance Officer', status: 'in-progress' },
    { date: '30/11/2024', activity: 'Quarterly compliance audit completed', type: 'Internal', auditor: 'Compliance Officer', status: 'complete' },
    { date: '15/11/2024', activity: 'F&P documentation review', type: 'Internal', auditor: 'Compliance Officer', status: 'complete' },
    { date: '01/11/2024', activity: 'FICA verification spot check', type: 'Internal', auditor: 'FICA Officer', status: 'complete' },
    { date: '15/10/2024', activity: 'Monthly compliance check', type: 'Internal', auditor: 'Compliance Officer', status: 'complete' }
];

// Initialize
// Listen for postMessage to switch tabs (from Quick Actions)
window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'switchTab') {
        const tabId = event.data.tab;
        const tabButton = document.getElementById(tabId);
        if (tabButton) {
            tabButton.click();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initializeAudits();
    setupEventListeners();
});

function initializeAudits() {
    renderComplianceScores();
    renderRecentActivity();
    renderAuditPhases();
    renderAuditFindings();
    renderFindingsList();
    renderCorrectiveActions();
    renderAuditHistory();
    renderFSCAHistory();
    renderReadinessChecklist();
    renderSpecializedAudits();
    initializeCharts();
}

function renderComplianceScores() {
    const container = document.getElementById('complianceScores');
    if (!container) return;
    
    container.innerHTML = '';
    
    complianceScores.forEach(item => {
        const scoreClass = item.score >= 96 ? 'excellent' : 
                          item.score >= 90 ? 'very-good' : 
                          item.score >= 80 ? 'good' : 'fair';
        const statusIcon = item.score >= 96 ? '✅' : 
                          item.score >= 90 ? '✅' : 
                          item.score >= 80 ? '✓' : '⚠️';
        
        const div = document.createElement('div');
        div.className = `compliance-score-item ${scoreClass}`;
        div.innerHTML = `
            <div class="compliance-score-header">
                <div>
                    <div class="compliance-score-name">${item.category}</div>
                    <small class="text-muted">Last Audited: ${item.lastAudited} | Findings: ${item.findings} open</small>
                </div>
                <div class="compliance-score-value ${scoreClass}">${item.score}/100</div>
            </div>
            <div class="compliance-score-progress">
                <div class="d-flex justify-content-between mb-1">
                    <span>${statusIcon} ${item.status.toUpperCase().replace('-', ' ')}</span>
                    <span>${item.score}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar bg-success" style="width: ${item.score}%"></div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderRecentActivity() {
    const tbody = document.getElementById('recentActivityTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    recentActivity.forEach(activity => {
        const tr = document.createElement('tr');
        const statusIcon = activity.status === 'complete' ? '✅' : '⏳';
        const statusBadge = activity.status === 'complete' ? 
            '<span class="badge bg-success">Complete</span>' : 
            '<span class="badge bg-info">In Progress</span>';
        
        tr.innerHTML = `
            <td>${activity.date}</td>
            <td>${activity.activity}</td>
            <td>${activity.type}</td>
            <td>${activity.auditor}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAuditPhases() {
    const container = document.getElementById('auditPhases');
    if (!container) return;
    
    const phases = [
        {
            name: 'Phase 1: Planning & Preparation',
            status: 'complete',
            tasks: [
                { name: 'Define audit scope and objectives', status: 'complete', date: '10/12/2024' },
                { name: 'Assign audit team', status: 'complete', date: '10/12/2024' },
                { name: 'Prepare audit checklist', status: 'complete', date: '10/12/2024' },
                { name: 'Notify stakeholders', status: 'complete', date: '10/12/2024' }
            ]
        },
        {
            name: 'Phase 2: Data Collection',
            status: 'in-progress',
            tasks: [
                { name: 'Extract CPD data from system', status: 'complete', date: '11/12/2024' },
                { name: 'Review CPD tracking logs', status: 'complete', date: '12/12/2024' },
                { name: 'Interview representatives', status: 'in-progress', progress: 50 },
                { name: 'Review certificates and evidence', status: 'in-progress', progress: 60 },
                { name: 'Verify ethics requirements', status: 'pending' }
            ]
        },
        {
            name: 'Phase 3: Analysis & Evaluation',
            status: 'in-progress',
            tasks: [
                { name: 'Analyze compliance rates', status: 'in-progress', progress: 30 },
                { name: 'Identify gaps and issues', status: 'pending' },
                { name: 'Assess risk exposure', status: 'pending' },
                { name: 'Compare to previous audits', status: 'pending' }
            ]
        },
        {
            name: 'Phase 4: Reporting',
            status: 'pending',
            tasks: [
                { name: 'Draft audit findings', status: 'pending' },
                { name: 'Develop recommendations', status: 'pending' },
                { name: 'Prepare final report', status: 'pending' },
                { name: 'Present to FSP Owner', status: 'pending' }
            ]
        },
        {
            name: 'Phase 5: Follow-Up',
            status: 'pending',
            tasks: [
                { name: 'Assign corrective actions', status: 'pending' },
                { name: 'Set deadlines', status: 'pending' },
                { name: 'Schedule follow-up review', status: 'pending' }
            ]
        }
    ];
    
    container.innerHTML = '';
    
    phases.forEach(phase => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = `audit-phase ${phase.status}`;
        
        let tasksHtml = '<ul class="phase-tasks">';
        phase.tasks.forEach(task => {
            let icon = '📋';
            if (task.status === 'complete') icon = '✅';
            else if (task.status === 'in-progress') icon = '⏳';
            
            let progressHtml = '';
            if (task.progress) {
                progressHtml = ` <small class="text-muted">(${task.progress}% complete)</small>`;
            }
            
            tasksHtml += `
                <li class="phase-task">
                    <span class="phase-task-icon">${icon}</span>
                    <span>${task.name}${task.date ? ' (' + task.date + ')' : ''}${progressHtml}</span>
                </li>
            `;
        });
        tasksHtml += '</ul>';
        
        phaseDiv.innerHTML = `
            <div class="phase-header">
                <div class="phase-name">${phase.name}</div>
                <div class="phase-status">
                    ${phase.status === 'complete' ? '<span class="badge bg-success">Complete</span>' : 
                      phase.status === 'in-progress' ? '<span class="badge bg-info">In Progress</span>' : 
                      '<span class="badge bg-secondary">Pending</span>'}
                </div>
            </div>
            ${tasksHtml}
        `;
        container.appendChild(phaseDiv);
    });
}

function renderAuditFindings() {
    const container = document.getElementById('auditFindingsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const auditFindings = findingsData.filter(f => f.auditId === 'AUD-2024-012');
    
    auditFindings.forEach(finding => {
        const card = createFindingCard(finding, true);
        container.appendChild(card);
    });
}

function renderFindingsList() {
    const container = document.getElementById('findingsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    findingsData.forEach(finding => {
        const card = createFindingCard(finding, false);
        container.appendChild(card);
    });
}

function createFindingCard(finding, isPreliminary) {
    const card = document.createElement('div');
    card.className = `finding-card ${finding.severity}`;
    
    const severityClass = finding.severity === 'critical' ? 'critical' :
                         finding.severity === 'high' ? 'high' :
                         finding.severity === 'medium' ? 'medium' : 'low';
    
    const statusBadge = finding.status === 'draft' ? 
        '<span class="badge bg-secondary">Draft</span>' :
        finding.status === 'in-progress' ?
        '<span class="badge bg-info">In Progress</span>' :
        '<span class="badge bg-success">Resolved</span>';
    
    card.innerHTML = `
        <div class="finding-header">
            <div>
                <div class="finding-title">${finding.title}</div>
                <div class="finding-id">Finding ID: ${finding.id}</div>
            </div>
            <div>
                <span class="finding-severity ${severityClass}">${finding.severity.toUpperCase()}</span>
                ${statusBadge}
            </div>
        </div>
        <div class="finding-meta">
            <span><strong>Audit:</strong> ${finding.auditName}</span>
            <span><strong>Category:</strong> ${finding.category.toUpperCase()}</span>
            <span><strong>Date Raised:</strong> ${finding.dateRaised}</span>
            ${finding.daysOpen > 0 ? `<span><strong>Days Open:</strong> ${finding.daysOpen} days</span>` : ''}
        </div>
        <div class="finding-description">
            <strong>Finding Description:</strong><br>
            ${finding.description}
        </div>
        ${finding.evidence ? `
        <div class="finding-evidence">
            <h6>Evidence:</h6>
            <ul>
                ${finding.evidence.map(e => `<li>${e}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        ${finding.impact ? `
        <div class="finding-impact">
            <h6>Impact Assessment:</h6>
            <p>${finding.impact}</p>
        </div>
        ` : ''}
        ${finding.recommendations ? `
        <div class="finding-recommendation">
            <h6>Recommended Actions:</h6>
            <ol>
                ${finding.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ol>
        </div>
        ` : ''}
        <div class="mt-3 d-flex gap-2">
            <button class="btn btn-sm btn-primary" onclick="viewFindingDetails('${finding.id}')">
                <i class="fas fa-eye me-1"></i> View Details
            </button>
            ${isPreliminary ? `
            <button class="btn btn-sm btn-outline-primary" onclick="editFinding('${finding.id}')">
                <i class="fas fa-edit me-1"></i> Edit Finding
            </button>
            <button class="btn btn-sm btn-outline-success" onclick="markFindingFinal('${finding.id}')">
                <i class="fas fa-check me-1"></i> Mark Final
            </button>
            ` : `
            <button class="btn btn-sm btn-outline-primary" onclick="addCorrectiveAction('${finding.id}')">
                <i class="fas fa-plus me-1"></i> Add Action
            </button>
            `}
        </div>
    `;
    
    return card;
}

function renderCorrectiveActions() {
    const container = document.getElementById('correctiveActionsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    correctiveActionsData.forEach(action => {
        const card = document.createElement('div');
        card.className = `corrective-action-card ${action.priority}`;
        
        const priorityClass = action.priority === 'high' ? 'high' : 'medium';
        const statusBadge = action.status === 'complete' ?
            '<span class="badge bg-success">Complete</span>' :
            '<span class="badge bg-info">In Progress</span>';
        
        let stepsHtml = '<ul class="action-steps">';
        action.steps.forEach(step => {
            let icon = '📋';
            if (step.status === 'complete') icon = '✅';
            else if (step.status === 'in-progress') icon = '⏳';
            
            let progressHtml = '';
            if (step.progress) {
                progressHtml = ` <small class="text-muted">(${step.progress}%)</small>`;
            }
            if (step.note) {
                progressHtml += ` <small class="text-muted">- ${step.note}</small>`;
            }
            
            stepsHtml += `
                <li class="action-step">
                    <span class="action-step-icon">${icon}</span>
                    <span>${step.name}${step.date ? ' (' + step.date + ')' : ''}${progressHtml}</span>
                </li>
            `;
        });
        stepsHtml += '</ul>';
        
        let updatesHtml = '';
        if (action.updates && action.updates.length > 0) {
            updatesHtml = '<div class="progress-updates"><strong>Progress Updates:</strong>';
            action.updates.forEach(update => {
                updatesHtml += `<div class="progress-update">• ${update.date}: ${update.note}</div>`;
            });
            updatesHtml += '</div>';
        }
        
        card.innerHTML = `
            <div class="action-header">
                <div>
                    <div class="action-id">CORRECTIVE ACTION #${action.id}</div>
                    <div class="finding-title">${action.action}</div>
                    <small class="text-muted">Related Finding: ${action.findingId}</small>
                </div>
                <div>
                    <span class="finding-severity ${priorityClass}">${action.priority.toUpperCase()}</span>
                    ${statusBadge}
                </div>
            </div>
            <div class="finding-meta">
                <span><strong>Assigned To:</strong> ${action.assignedTo}${action.assignedToRole ? ' (' + action.assignedToRole + ')' : ''}</span>
                <span><strong>Due Date:</strong> ${action.dueDate}</span>
            </div>
            <div class="action-progress">
                <div class="d-flex justify-content-between mb-1">
                    <span>Progress: ${action.progress}%</span>
                    <span>${action.status.toUpperCase().replace('-', ' ')}</span>
                </div>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar bg-info" style="width: ${action.progress}%"></div>
                </div>
            </div>
            <div class="mt-3">
                <h6>Action Steps:</h6>
                ${stepsHtml}
            </div>
            ${updatesHtml}
            <div class="mt-3 d-flex gap-2">
                <button class="btn btn-sm btn-primary" onclick="updateActionProgress('${action.id}')">
                    <i class="fas fa-edit me-1"></i> Update Progress
                </button>
                <button class="btn btn-sm btn-success" onclick="markActionComplete('${action.id}')">
                    <i class="fas fa-check me-1"></i> Mark Complete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderAuditHistory() {
    const tbody = document.getElementById('auditHistoryTable');
    if (!tbody) return;
    
    const history = [
        { date: '30/11/2024', name: 'Q4 Compliance Audit', type: 'Internal', auditor: 'Compliance Officer', score: 94, findings: 3, status: 'complete' },
        { date: '15/11/2024', name: 'F&P Documentation Review', type: 'Internal', auditor: 'Compliance Officer', score: 98, findings: 0, status: 'complete' },
        { date: '15/10/2024', name: 'Monthly Compliance Check', type: 'Internal', auditor: 'Compliance Officer', score: 95, findings: 1, status: 'complete' },
        { date: '30/09/2024', name: 'Q3 Compliance Audit', type: 'Internal', auditor: 'Compliance Officer', score: 95, findings: 2, status: 'complete' },
        { date: '15/09/2024', name: 'Document Retention Audit', type: 'Internal', auditor: 'Admin Staff', score: 96, findings: 2, status: 'complete' },
        { date: '15/08/2024', name: 'Representative Files Audit', type: 'Internal', auditor: 'Compliance Officer', score: 94, findings: 1, status: 'complete' },
        { date: '30/06/2024', name: 'Q2 Compliance Audit', type: 'Internal', auditor: 'Compliance Officer', score: 93, findings: 3, status: 'complete' },
        { date: '01/06/2024', name: 'CPD Cycle Review', type: 'Internal', auditor: 'Compliance Officer', score: 92, findings: 2, status: 'complete' }
    ];
    
    tbody.innerHTML = '';
    
    history.forEach(audit => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${audit.date}</td>
            <td>${audit.name}</td>
            <td>${audit.type}</td>
            <td>${audit.auditor}</td>
            <td><strong>${audit.score}/100</strong></td>
            <td>${audit.findings} ${audit.findings === 1 ? 'finding' : 'findings'}</td>
            <td><span class="badge bg-success">✅ Complete</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewAuditDetails('${audit.date}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFSCAHistory() {
    const tbody = document.getElementById('fscaHistoryTable');
    if (!tbody) return;
    
    const history = [
        { date: '15/08/2023', type: 'Routine', duration: '3 days', outcome: 'Satisfactory', findings: '0 major', status: 'closed' },
        { date: '22/03/2021', type: 'Routine', duration: '2 days', outcome: 'Satisfactory', findings: '1 minor', status: 'closed' },
        { date: '10/09/2019', type: 'Follow-up', duration: '1 day', outcome: 'Satisfactory', findings: '0', status: 'closed' },
        { date: '15/05/2019', type: 'Routine', duration: '3 days', outcome: 'Requires improvement', findings: '3 moderate', status: 'closed' }
    ];
    
    tbody.innerHTML = '';
    
    history.forEach(inspection => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${inspection.date}</td>
            <td>${inspection.type}</td>
            <td>${inspection.duration}</td>
            <td>${inspection.outcome}</td>
            <td>${inspection.findings}</td>
            <td><span class="badge bg-success">✅ Closed</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderReadinessChecklist() {
    const container = document.getElementById('readinessChecklist');
    if (!container) return;
    
    const categories = [
        {
            name: 'Category 1: FSP Documentation',
            score: 100,
            items: [
                'FSP License (current and valid)',
                'Business Plan (updated within 12 months)',
                'Compliance Manual (current version)',
                'Risk Management Framework',
                'FAIS Act Policies & Procedures',
                'FICA Policies & Procedures',
                'POPIA Compliance Documentation'
            ]
        },
        {
            name: 'Category 2: Representative Files',
            score: 100,
            items: [
                'Representative Register (all current)',
                'Fit & Proper Declarations (all signed)',
                'CPD Records (current cycle)',
                'Supervision Agreements (all executed)',
                'Employment/Appointment Contracts',
                'Debarment Checks (all conducted)',
                'FICA Verifications (all compliant)'
            ]
        },
        {
            name: 'Category 3: Client Records',
            score: 95,
            items: [
                'Client Register (up-to-date)',
                'FICA Verification Records (95% complete)',
                'Needs Advice Records (some missing - in progress)',
                'Suitability Assessments',
                'Product Disclosure Documents',
                'Client Communications Log'
            ]
        },
        {
            name: 'Category 4: Compliance Records',
            score: 100,
            items: [
                'Complaints Register (current)',
                'Internal Audit Reports (last 3 years)',
                'Risk Assessments (current)',
                'Training Records',
                'Board/Management Meeting Minutes',
                'Compliance Officer Reports'
            ]
        },
        {
            name: 'Category 5: Financial Records',
            score: 100,
            items: [
                'Financial Statements (last 3 years)',
                'Trust Account Records (if applicable)',
                'Professional Indemnity Insurance (current)',
                'Fidelity Insurance (current)',
                'Capital Adequacy Records'
            ]
        }
    ];
    
    container.innerHTML = '';
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'checklist-category';
        
        let itemsHtml = '<ul class="checklist-items">';
        category.items.forEach(item => {
            const isIncomplete = item.includes('missing') || item.includes('in progress');
            const icon = isIncomplete ? '⏳' : '✅';
            itemsHtml += `
                <li class="checklist-item">
                    <span class="checklist-item-icon">${icon}</span>
                    <span>${item}</span>
                </li>
            `;
        });
        itemsHtml += '</ul>';
        
        categoryDiv.innerHTML = `
            <h6>${category.name} (${category.score}% Complete)</h6>
            ${itemsHtml}
        `;
        container.appendChild(categoryDiv);
    });
}

function renderSpecializedAudits() {
    const tbody = document.getElementById('specializedAuditsTable');
    if (!tbody) return;
    
    const audits = [
        { type: 'Fit & Proper Review', frequency: 'Quarterly', lastCompleted: '30/11/2024', nextScheduled: '28/02/2025', status: 'scheduled' },
        { type: 'CPD Compliance', frequency: 'Bi-annual', lastCompleted: '10/12/2024', nextScheduled: '01/06/2025', status: 'in-progress' },
        { type: 'FICA Verification', frequency: 'Monthly', lastCompleted: '15/11/2024', nextScheduled: '15/01/2025', status: 'scheduled' },
        { type: 'Document Retention', frequency: 'Annual', lastCompleted: '15/09/2024', nextScheduled: '15/09/2025', status: 'scheduled' },
        { type: 'Complaints Review', frequency: 'Quarterly', lastCompleted: '30/09/2024', nextScheduled: '31/03/2025', status: 'scheduled' },
        { type: 'Risk Assessment', frequency: 'Bi-annual', lastCompleted: '30/06/2024', nextScheduled: '31/12/2024', status: 'scheduled' },
        { type: 'Representative Files', frequency: 'Annual', lastCompleted: '15/08/2024', nextScheduled: '15/08/2025', status: 'scheduled' }
    ];
    
    tbody.innerHTML = '';
    
    audits.forEach(audit => {
        const tr = document.createElement('tr');
        const statusBadge = audit.status === 'in-progress' ?
            '<span class="badge bg-info">⏳ In Progress</span>' :
            '<span class="badge bg-secondary">📋 Scheduled</span>';
        
        tr.innerHTML = `
            <td>${audit.type}</td>
            <td>${audit.frequency}</td>
            <td>${audit.lastCompleted}</td>
            <td>${audit.nextScheduled}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initializeCharts() {
    // Compliance Trend Chart
    const ctx = document.getElementById('complianceTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Dec 2023', 'Mar 2024', 'Jun 2024', 'Sep 2024', 'Dec 2024'],
                datasets: [{
                    label: 'Compliance Score',
                    data: [88, 91, 93, 95, 94],
                    borderColor: '#5CBDB4',
                    backgroundColor: 'rgba(92, 189, 180, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Target (90)',
                    data: [90, 90, 90, 90, 90],
                    borderColor: '#28A745',
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }
}

function setupEventListeners() {
    // Schedule New Audit
    document.getElementById('scheduleNewAuditBtn')?.addEventListener('click', showScheduleAuditModal);
    document.getElementById('scheduleAuditForm')?.addEventListener('submit', handleScheduleAudit);
    
    // Add Finding
    document.getElementById('addFindingBtn')?.addEventListener('click', showAddFindingModal);
    
    // Add Note
    document.getElementById('addNoteBtn')?.addEventListener('click', showAddNoteModal);
    
    // Add Corrective Action
    document.getElementById('addCorrectiveActionBtn')?.addEventListener('click', showAddCorrectiveActionModal);
    
    // Schedule Mock Inspection
    document.getElementById('scheduleMockInspectionBtn')?.addEventListener('click', showScheduleMockInspectionModal);
    
    // Filters
    document.getElementById('applyFindingsFiltersBtn')?.addEventListener('click', applyFindingsFilters);
    document.getElementById('clearFindingsFiltersBtn')?.addEventListener('click', clearFindingsFilters);
}

function showScheduleAuditModal() {
    const modal = new bootstrap.Modal(document.getElementById('scheduleAuditModal'));
    modal.show();
}

function handleScheduleAudit(e) {
    e.preventDefault();
    Swal.fire({
        title: 'Audit Scheduled',
        text: 'New audit has been scheduled successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    bootstrap.Modal.getInstance(document.getElementById('scheduleAuditModal')).hide();
}

function showAddFindingModal() {
    Swal.fire({
        title: 'Add New Finding',
        text: 'Finding creation form would be implemented here',
        icon: 'info'
    });
}

function showAddNoteModal() {
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

function showAddCorrectiveActionModal() {
    Swal.fire({
        title: 'Add Corrective Action',
        text: 'Corrective action form would be implemented here',
        icon: 'info'
    });
}

function showScheduleMockInspectionModal() {
    Swal.fire({
        title: 'Schedule Mock Inspection',
        text: 'Mock inspection scheduling form would be implemented here',
        icon: 'info'
    });
}

function applyFindingsFilters() {
    Swal.fire({
        title: 'Filters Applied',
        text: 'Findings have been filtered',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function clearFindingsFilters() {
    document.getElementById('severityFilter').value = 'all';
    document.getElementById('findingStatusFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('dateRangeFilter').value = '30';
    applyFindingsFilters();
}

function viewFindingDetails(findingId) {
    const finding = findingsData.find(f => f.id === findingId);
    if (!finding) return;
    
    const modal = new bootstrap.Modal(document.getElementById('findingDetailModal'));
    document.getElementById('findingDetailModalLabel').textContent = finding.title;
    document.getElementById('findingDetailContent').innerHTML = `
        <div class="finding-card ${finding.severity}">
            ${createFindingCard(finding, false).innerHTML}
        </div>
    `;
    modal.show();
}

function editFinding(findingId) {
    Swal.fire({
        title: 'Edit Finding',
        text: `Edit form for finding ${findingId} would be shown here`,
        icon: 'info'
    });
}

function markFindingFinal(findingId) {
    Swal.fire({
        title: 'Mark as Final',
        text: `Finding ${findingId} has been marked as final`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function addCorrectiveAction(findingId) {
    Swal.fire({
        title: 'Add Corrective Action',
        text: `Add corrective action for finding ${findingId}`,
        icon: 'info'
    });
}

function updateActionProgress(actionId) {
    Swal.fire({
        title: 'Update Progress',
        text: `Progress update form for action ${actionId} would be shown here`,
        icon: 'info'
    });
}

function markActionComplete(actionId) {
    Swal.fire({
        title: 'Mark Complete',
        text: `Action ${actionId} has been marked as complete`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function viewAuditDetails(auditDate) {
    Swal.fire({
        title: 'Audit Details',
        text: `Full details for audit on ${auditDate} would be displayed here`,
        icon: 'info'
    });
}

// Make functions globally accessible
window.viewFindingDetails = viewFindingDetails;
window.editFinding = editFinding;
window.markFindingFinal = markFindingFinal;
window.addCorrectiveAction = addCorrectiveAction;
window.updateActionProgress = updateActionProgress;
window.markActionComplete = markActionComplete;
window.viewAuditDetails = viewAuditDetails;

