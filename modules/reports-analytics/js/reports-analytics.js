// Reports & Analytics JavaScript

// Sample Data
const reportCategories = [
    {
        name: 'Executive Reports',
        access: ['fsp-owner', 'principal'],
        reports: [
            {
                id: 'exec-summary',
                title: 'Executive Compliance Summary',
                icon: '📊',
                description: 'Comprehensive overview of FSP compliance status across all areas: Fit & Proper, CPD, FICA, Documents',
                lastGenerated: '20/11/2024 14:30',
                frequency: 'Monthly',
                format: 'PDF (A4, 15-20 pages)',
                includes: [
                    'Overall compliance score and trend',
                    'Representative compliance breakdown',
                    'Key Individual performance analysis',
                    'Critical alerts and action items',
                    'Month-over-month comparison',
                    'Risk assessment matrix'
                ]
            },
            {
                id: 'financial-performance',
                title: 'Financial Performance vs Compliance',
                icon: '💰',
                description: 'Correlates business performance with compliance metrics to identify high-performing compliant representatives',
                lastGenerated: '15/11/2024 09:00',
                frequency: 'Quarterly',
                format: 'Excel (Interactive Dashboard)',
                includes: [
                    'Revenue by representative',
                    'Compliance score correlation',
                    'Client acquisition vs compliance status',
                    'Productivity analysis',
                    'ROI on CPD investment'
                ]
            },
            {
                id: 'board-report',
                title: 'Board of Directors Report',
                icon: '🎯',
                description: 'High-level strategic report for board meetings and governance oversight',
                lastGenerated: '01/11/2024 10:00',
                frequency: 'Quarterly',
                format: 'PowerPoint (Board Presentation)',
                includes: [
                    'Strategic compliance overview',
                    'Risk heatmap and mitigation strategies',
                    'Regulatory changes impact',
                    'Vicarious liability exposure',
                    'Investment recommendations',
                    'Industry benchmarking'
                ]
            }
        ]
    },
    {
        name: 'CPD Reports',
        access: ['all'],
        reports: [
            {
                id: 'cpd-summary',
                title: 'CPD Compliance Summary',
                icon: '📚',
                description: 'Current cycle progress for all representatives with deadline tracking and risk assessment',
                lastGenerated: '23/11/2024 08:00',
                frequency: 'Weekly',
                format: 'PDF + Excel',
                dataScope: {
                    cycle: '1 June 2024 - 31 May 2025',
                    representatives: 36,
                    averageProgress: '71%',
                    atRisk: 10
                },
                includes: [
                    'Individual progress breakdown',
                    'Ethics hours compliance',
                    'Verifiable hours percentage',
                    'Timeline projection',
                    'At-risk representative details'
                ]
            },
            {
                id: 'cpd-activity-log',
                title: 'CPD Activity Log',
                icon: '📋',
                description: 'Detailed log of all CPD activities submitted, verified, and pending approval this cycle',
                format: 'Excel (Sortable, Filterable)',
                includes: [
                    'Activity Date, Representative, Activity Type',
                    'Provider, Hours, Verifiable, Ethics Hours',
                    'Status, Uploaded Date, Verified By, Certificate'
                ]
            },
            {
                id: 'cpd-provider-analysis',
                title: 'CPD Provider Analysis',
                icon: '🏫',
                description: 'Analysis of which providers are most used and rated highest by your representatives',
                format: 'PDF with charts',
                includes: [
                    'Top 10 providers by usage',
                    'Average quality ratings',
                    'Cost analysis per provider',
                    'Ethics vs technical breakdown',
                    'Representative feedback summary',
                    'Recommendations for preferred providers'
                ]
            }
        ]
    },
    {
        name: 'Fit & Proper Reports',
        access: ['all'],
        reports: [
            {
                id: 'fp-status',
                title: 'Fit & Proper Status Report',
                icon: '✅',
                description: 'Complete overview of all F&P requirements per representative with expiry tracking',
                lastGenerated: '20/11/2024 11:00',
                frequency: 'Monthly',
                format: 'PDF + Excel',
                includes: [
                    'Qualifications status (current/expired)',
                    'RE Exam status and expiry dates',
                    'Class of Business authorizations',
                    'Experience verification',
                    'Character & Integrity declarations',
                    'Upcoming renewal requirements (90 days)',
                    'Non-compliant representatives'
                ]
            },
            {
                id: 'qualification-expiry',
                title: 'Qualification Expiry Calendar',
                icon: '📅',
                description: '12-month rolling calendar of qualification and RE Exam expiry dates for proactive renewal management',
                format: 'PDF Calendar + Excel List',
                includes: [
                    'Monthly expiry breakdown',
                    'Representative contact details',
                    'Qualification type and renewal requirements',
                    'Estimated renewal cost',
                    'Auto-generated reminder schedule'
                ]
            }
        ]
    },
    {
        name: 'FICA Reports',
        access: ['all'],
        reports: [
            {
                id: 'fica-status',
                title: 'FICA Compliance Status',
                icon: '🔐',
                description: 'Client verification status across all representatives with risk categorization and remediation tracking',
                lastGenerated: '22/11/2024 16:00',
                frequency: 'Weekly',
                format: 'PDF + Excel',
                metrics: {
                    totalClients: 1248,
                    verified: 1156,
                    verifiedPercent: 93,
                    pending: 67,
                    overdue: 25
                },
                includes: [
                    'Verification status by representative',
                    'Outstanding documents list',
                    'High-risk client identification',
                    'Review schedule compliance',
                    'Remediation action plan'
                ]
            },
            {
                id: 'fica-doc-audit',
                title: 'FICA Documentation Audit',
                icon: '📄',
                description: 'Detailed audit of FICA documentation completeness and quality for internal or FSCA inspection readiness',
                format: 'Comprehensive PDF Audit Report',
                includes: [
                    'ID document copies (quality, clarity, expiry)',
                    'Proof of address (recency, validity)',
                    'Bank details verification',
                    'Tax compliance status',
                    'Beneficial ownership documentation',
                    'Source of funds/wealth declarations',
                    'Compliance score per client',
                    'Gap analysis and remediation plan',
                    'Risk assessment matrix'
                ]
            }
        ]
    },
    {
        name: 'Document Management Reports',
        access: ['all'],
        reports: [
            {
                id: 'doc-repository',
                title: 'Document Repository Summary',
                icon: '📂',
                description: 'Overview of all compliance documents stored in system with retention schedule and storage metrics',
                lastGenerated: '21/11/2024 09:00',
                frequency: 'Monthly',
                format: 'PDF + Excel',
                statistics: {
                    totalDocuments: 3847,
                    storageUsed: '2.4 GB',
                    documentTypes: 24,
                    retentionCompliant: 98
                },
                includes: [
                    'Document breakdown by category',
                    'Upload activity trend',
                    'Storage growth projection',
                    'Retention schedule compliance',
                    'Upcoming purge requirements',
                    'Access audit trail summary'
                ]
            },
            {
                id: 'doc-access-audit',
                title: 'Document Access Audit Log',
                icon: '🔍',
                description: 'Complete audit trail of who accessed what documents and when - critical for POPI Act compliance',
                format: 'Excel (Sortable, Filterable)',
                includes: [
                    'Timestamp, User, Action (View/Download/Edit/Delete)',
                    'Document Name, Document Type, Client/Rep Ref',
                    'IP Address, Device, Duration, Success/Failed'
                ]
            }
        ]
    },
    {
        name: 'Complaints Management Reports',
        access: ['all'],
        reports: [
            {
                id: 'complaints-register',
                title: 'Complaints Register',
                icon: '📝',
                description: 'Official FAIS-compliant complaints register required under Section 16 of the FAIS Act',
                lastGenerated: '23/11/2024 07:00',
                frequency: 'Monthly',
                format: 'PDF (FSCA Submission Format)',
                period: 'Last 12 months',
                statistics: {
                    total: 14,
                    resolved: 11,
                    resolvedPercent: 79,
                    pending: 3,
                    averageResolutionTime: 18
                },
                includes: [
                    'Complaint details (date, nature, complainant)',
                    'Representative involved',
                    'Resolution status and timeline',
                    'Remedial action taken',
                    'OMBUD escalations',
                    'Trends and root cause analysis'
                ]
            },
            {
                id: 'complaint-trends',
                title: 'Complaint Trend Analysis',
                icon: '📈',
                description: 'Statistical analysis of complaint patterns to identify systemic issues and improvement opportunities',
                format: 'PDF with charts and graphs',
                includes: [
                    'Complaint volume trends (monthly)',
                    'Complaint type distribution',
                    'Representative with most complaints',
                    'Product/service area analysis',
                    'Root cause identification',
                    'Resolution time trends',
                    'Client satisfaction post-resolution',
                    'Preventative recommendations'
                ]
            }
        ]
    },
    {
        name: 'Representative Performance Reports',
        access: ['all'],
        reports: [
            {
                id: 'rep-performance',
                title: 'Representative Performance Dashboard',
                icon: '👥',
                description: 'Comprehensive performance scorecard for each representative across all compliance areas',
                format: 'Excel Dashboard + PDF Summary',
                includes: [
                    'Overall Compliance Score (0-100)',
                    'CPD Progress and Status',
                    'Fit & Proper Status',
                    'FICA Compliance Rate',
                    'Complaints Received',
                    'Client Portfolio Size',
                    'Revenue Generation',
                    'Risk Rating',
                    'Top Performers (Green Zone)',
                    'Average Performers (Blue Zone)',
                    'Needs Improvement (Amber Zone)',
                    'Critical Attention (Red Zone)'
                ]
            }
        ]
    },
    {
        name: 'Key Individual Reports',
        access: ['all'],
        reports: [
            {
                id: 'ki-performance',
                title: 'Key Individual Performance Report',
                icon: '🎖️',
                description: 'Evaluation of Key Individual supervisory effectiveness and team compliance outcomes',
                lastGenerated: '15/11/2024 10:00',
                frequency: 'Quarterly',
                format: 'PDF (Executive Summary)',
                includes: [
                    'Name and FSP Number',
                    'Number of supervised representatives',
                    'Team compliance score',
                    'CPD compliance rate',
                    'FICA compliance rate',
                    'Complaints under supervision',
                    'Supervision quality indicators',
                    'Best practices from top performers',
                    'Support needs identification',
                    'Training recommendations',
                    'Accountability metrics'
                ]
            }
        ]
    },
    {
        name: 'Internal Audit Reports',
        access: ['all'],
        reports: [
            {
                id: 'audit-summary',
                title: 'Internal Audit Summary',
                icon: '🔎',
                description: 'Summary of all internal audits conducted with findings, remediation status, and recommendations',
                lastGenerated: '10/11/2024 14:00',
                frequency: 'Quarterly',
                format: 'PDF (Formal Audit Report)',
                includes: [
                    'Audit scope and methodology',
                    'Findings by severity',
                    'Management responses',
                    'Remediation timeline',
                    'Follow-up schedule',
                    'Compliance improvement trends'
                ]
            }
        ]
    },
    {
        name: 'FSCA Submission Reports',
        access: ['fsp-owner', 'principal', 'compliance-officer'],
        reports: [
            {
                id: 'fsca-annual',
                title: 'Annual FSCA Compliance Report',
                icon: '🏦',
                description: 'Comprehensive annual report formatted for FSCA submission (if requested by regulator)',
                reportingPeriod: '1 Jan 2024 - 31 Dec 2024',
                submissionDeadline: '31 March 2025',
                format: 'PDF (FSCA Template Format)',
                includes: [
                    'FSP Details and License Information',
                    'Representative Register (Section 6A compliance)',
                    'CPD Compliance Summary (Section 8A)',
                    'Fit & Proper Status (Section 6A)',
                    'FICA Compliance Overview',
                    'Complaints Register (Section 16)',
                    'Internal Audit Results',
                    'Compliance Officer Declaration (Section 17)',
                    'Financial Information (if applicable)',
                    'Changes to FSP Structure'
                ]
            }
        ]
    }
];

const scheduledReports = [
    {
        id: 1,
        name: 'CPD Compliance Summary',
        schedule: 'Weekly (Mondays 08:00)',
        nextRun: '25/11/2024 08:00',
        recipients: ['principal@fsp.co.za', 'compliance@fsp.co.za'],
        format: 'PDF + Excel',
        lastRun: '18/11/2024',
        status: 'active'
    },
    {
        id: 2,
        name: 'Executive Compliance Summary',
        schedule: 'Monthly (1st of month)',
        nextRun: '01/12/2024 06:00',
        recipients: ['board@fsp.co.za', 'principal@fsp.co.za'],
        format: 'PDF',
        lastRun: '01/11/2024',
        status: 'active'
    },
    {
        id: 3,
        name: 'Internal Audit Summary',
        schedule: 'Quarterly (15th)',
        nextRun: '15/02/2025 10:00',
        recipients: ['audit-team@fsp.co.za', 'compliance@fsp.co.za'],
        format: 'PDF',
        lastRun: '15/11/2024',
        status: 'active'
    },
    {
        id: 4,
        name: 'At-Risk Reps Daily Alert',
        schedule: 'Daily (Weekdays 17:00)',
        nextRun: 'N/A',
        recipients: ['ki-team@fsp.co.za', 'compliance@fsp.co.za'],
        format: 'Email Summary',
        lastRun: '20/11/2024',
        status: 'paused'
    }
];

const exportHistory = [
    {
        id: 1,
        name: 'CPD Compliance Summary',
        generated: '23/11/2024 08:15',
        generatedBy: 'Lindiwe Mbatha',
        role: 'Compliance Officer',
        format: 'PDF',
        recipients: ['principal@fsp.co.za', 'compliance@fsp.co.za'],
        fileSize: '2.4 MB',
        status: 'success'
    },
    {
        id: 2,
        name: 'Executive Summary',
        generated: '20/11/2024 06:00',
        generatedBy: 'System (Scheduled)',
        role: 'Automated',
        format: 'PDF',
        recipients: ['board@fsp.co.za'],
        fileSize: '4.1 MB',
        status: 'success'
    },
    {
        id: 3,
        name: 'At-Risk Reps Analysis',
        generated: '18/11/2024 14:30',
        generatedBy: 'Thandi Dlamini',
        role: 'Key Individual',
        format: 'Excel',
        recipients: ['N/A (Downloaded)'],
        fileSize: '856 KB',
        status: 'success'
    },
    {
        id: 4,
        name: 'FSCA Annual Report',
        generated: '15/11/2024 10:00',
        generatedBy: 'Lindiwe Mbatha',
        role: 'Compliance Officer',
        format: 'PDF',
        recipients: ['fsca@fsca.co.za'],
        fileSize: 'N/A',
        status: 'failed'
    }
];

const topAlerts = [
    {
        priority: 'critical',
        title: '6 reps below 50% CPD completion',
        details: 'Due: 31 May 2025 (188 days)',
        actions: ['View Details', 'Assign Actions']
    },
    {
        priority: 'urgent',
        title: '25 FICA verifications overdue',
        details: 'Oldest: 45 days overdue',
        actions: ['View Clients', 'Send Reminders']
    },
    {
        priority: 'attention',
        title: '3 RE Exam renewals in 60 days',
        details: 'Representatives: Botha, Khumalo, Fourie',
        actions: ['Schedule Renewals', 'Notify Reps']
    },
    {
        priority: 'info',
        title: 'Quarterly audit due 15 December 2024',
        details: 'Status: Planning phase',
        actions: ['Start Audit', 'Review Checklist']
    },
    {
        priority: 'success',
        title: '14 reps completed CPD early',
        details: 'Average: 94% completion',
        actions: ['Send Recognition', 'View List']
    }
];

const performanceHeatmap = [
    { name: 'Thabo Maluleke', cpd: 'compliant', fp: 'compliant', fica: 'compliant', docs: 'compliant', overall: 95 },
    { name: 'Sarah v d Merwe', cpd: 'good', fp: 'compliant', fica: 'compliant', docs: 'compliant', overall: 88 },
    { name: 'Johannes Botha', cpd: 'at-risk', fp: 'compliant', fica: 'good', docs: 'compliant', overall: 78 },
    { name: 'Nomvula Khumalo', cpd: 'critical', fp: 'at-risk', fica: 'good', docs: 'good', overall: 45 },
    { name: 'Daniel Fourie', cpd: 'critical', fp: 'critical', fica: 'critical', docs: 'at-risk', overall: 22 }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    setupEventListeners();
});

function initializeReports() {
    renderReportLibrary();
    renderScheduledReports();
    renderExportHistory();
    renderAnalyticsDashboard();
    renderFSCAReports();
    initializeReportBuilder();
}

function renderReportLibrary() {
    const container = document.getElementById('reportCategories');
    if (!container) return;
    
    container.innerHTML = '';
    
    reportCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'report-category';
        
        const title = document.createElement('h3');
        title.className = 'report-category-title';
        title.textContent = category.name;
        categoryDiv.appendChild(title);
        
        const reportsGrid = document.createElement('div');
        reportsGrid.className = 'row g-3';
        
        category.reports.forEach(report => {
            const reportCard = createReportCard(report);
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.appendChild(reportCard);
            reportsGrid.appendChild(col);
        });
        
        categoryDiv.appendChild(reportsGrid);
        container.appendChild(categoryDiv);
    });
}

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    
    let metaHtml = '';
    if (report.lastGenerated) {
        metaHtml += `<div class="report-meta-item"><i class="fas fa-clock"></i> Last: ${report.lastGenerated}</div>`;
    }
    if (report.frequency) {
        metaHtml += `<div class="report-meta-item"><i class="fas fa-sync"></i> ${report.frequency}</div>`;
    }
    if (report.format) {
        metaHtml += `<div class="report-meta-item"><i class="fas fa-file"></i> ${report.format}</div>`;
    }
    
    let includesHtml = '';
    if (report.includes && report.includes.length > 0) {
        includesHtml = '<div class="report-includes"><div class="report-includes-title">Includes:</div><ul class="report-includes-list">';
        report.includes.slice(0, 4).forEach(item => {
            includesHtml += `<li>${item}</li>`;
        });
        if (report.includes.length > 4) {
            includesHtml += `<li>+ ${report.includes.length - 4} more...</li>`;
        }
        includesHtml += '</ul></div>';
    }
    
    card.innerHTML = `
        <div class="report-card-header">
            <div class="report-icon">${report.icon}</div>
            <div>
                <div class="report-title">${report.title}</div>
            </div>
        </div>
        <div class="report-description">${report.description}</div>
        ${metaHtml ? `<div class="report-meta">${metaHtml}</div>` : ''}
        ${includesHtml}
        <div class="report-actions">
            <button class="btn btn-sm btn-primary" onclick="generateReport('${report.id}')">
                <i class="fas fa-play me-1"></i> Generate Now
            </button>
            <button class="btn btn-sm btn-outline-primary" onclick="previewReport('${report.id}')">
                <i class="fas fa-eye me-1"></i> Preview
            </button>
            <button class="btn btn-sm btn-outline-secondary" onclick="scheduleReport('${report.id}')">
                <i class="fas fa-calendar me-1"></i> Schedule
            </button>
        </div>
    `;
    
    return card;
}

function renderScheduledReports() {
    const tbody = document.getElementById('scheduledReportsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    scheduledReports.forEach(report => {
        const tr = document.createElement('tr');
        const statusBadge = report.status === 'active' ?
            '<span class="badge bg-success">✅ Active</span>' :
            '<span class="badge bg-secondary">⏸️ Paused</span>';
        
        tr.innerHTML = `
            <td>${report.name}</td>
            <td>${report.schedule}</td>
            <td>${report.nextRun}</td>
            <td>${report.recipients.join(', ')}</td>
            <td>${report.format}</td>
            <td>${report.lastRun}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${report.status === 'active' ?
                        '<button class="btn btn-outline-secondary" title="Pause"><i class="fas fa-pause"></i></button>' :
                        '<button class="btn btn-outline-success" title="Resume"><i class="fas fa-play"></i></button>'
                    }
                    <button class="btn btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-outline-danger" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderExportHistory() {
    const tbody = document.getElementById('exportHistoryTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    exportHistory.forEach(exportItem => {
        const tr = document.createElement('tr');
        const statusBadge = exportItem.status === 'success' ?
            '<span class="export-status-badge success">✅ Success</span>' :
            '<span class="export-status-badge failed">❌ Failed</span>';
        
        tr.innerHTML = `
            <td>${exportItem.name}</td>
            <td>${exportItem.generated}<br><small class="text-muted">${getTimeAgo(exportItem.generated)}</small></td>
            <td>${exportItem.generatedBy}<br><small class="text-muted">${exportItem.role}</small></td>
            <td>${exportItem.format}</td>
            <td>${exportItem.recipients}</td>
            <td>${exportItem.fileSize}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="Download"><i class="fas fa-download"></i></button>
                    <button class="btn btn-outline-secondary" title="Save"><i class="fas fa-save"></i></button>
                    <button class="btn btn-outline-info" title="Email"><i class="fas fa-envelope"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAnalyticsDashboard() {
    renderComplianceHealthGauge();
    renderComplianceTrends();
    renderRepDistribution();
    renderTopAlerts();
    renderPerformanceHeatmap();
}

function renderComplianceHealthGauge() {
    const ctx = document.getElementById('complianceHealthGauge');
    if (!ctx) return;
    
    // Create a donut chart as a gauge
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [78, 22],
                backgroundColor: ['#5CBDB4', '#e0e0e0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                
                ctx.save();
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#4A4A4A';
                ctx.fillText('78%', centerX, centerY - 10);
                ctx.font = '14px Arial';
                ctx.fillText('⚠️ AT RISK', centerX, centerY + 15);
                ctx.restore();
            }
        }]
    });
    
    // Render components
    const components = document.getElementById('complianceComponents');
    if (components) {
        components.innerHTML = `
            <div class="row g-2 mt-3">
                <div class="col-6">
                    <small>CPD Compliance: <strong>72%</strong> ⚠️</small>
                </div>
                <div class="col-6">
                    <small>Fit & Proper: <strong>95%</strong> ✅</small>
                </div>
                <div class="col-6">
                    <small>FICA Compliance: <strong>93%</strong> ✅</small>
                </div>
                <div class="col-6">
                    <small>Document Mgmt: <strong>88%</strong> ✅</small>
                </div>
                <div class="col-6">
                    <small>Complaints Mgmt: <strong>100%</strong> 🏆</small>
                </div>
            </div>
            <div class="mt-2">
                <small class="text-muted">Trend: ↓ 2% from last month | Action: Focus on CPD compliance</small>
            </div>
        `;
    }
}

function renderComplianceTrends() {
    const ctx = document.getElementById('complianceTrendsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'],
            datasets: [
                {
                    label: 'Fit & Proper',
                    data: [95, 96, 95, 97, 95, 95, 95],
                    borderColor: '#28A745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'CPD',
                    data: [75, 78, 80, 82, 70, 72, 72],
                    borderColor: '#5CBDB4',
                    backgroundColor: 'rgba(92, 189, 180, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Overall Health',
                    data: [80, 82, 84, 86, 78, 78, 78],
                    borderColor: '#6c757d',
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

function renderRepDistribution() {
    const ctx = document.getElementById('repDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Compliant (72%)', 'At Risk (11%)', 'Critical (17%)'],
            datasets: [{
                data: [26, 4, 6],
                backgroundColor: ['#28A745', '#FFC107', '#DC3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderTopAlerts() {
    const container = document.getElementById('topAlertsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    topAlerts.forEach((alert, index) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${alert.priority}`;
        
        const priorityIcon = alert.priority === 'critical' ? '🔴' :
                           alert.priority === 'urgent' ? '⚠️' :
                           alert.priority === 'attention' ? '⚠️' :
                           alert.priority === 'info' ? 'ℹ️' : '✅';
        
        alertDiv.innerHTML = `
            <div class="alert-title">${index + 1}. ${priorityIcon} ${alert.priority.toUpperCase()}: ${alert.title}</div>
            <div class="alert-details">${alert.details}</div>
            <div class="alert-actions">
                ${alert.actions.map(action => 
                    `<button class="btn btn-sm btn-outline-primary">${action}</button>`
                ).join('')}
            </div>
        `;
        container.appendChild(alertDiv);
    });
    
    const viewAll = document.createElement('div');
    viewAll.className = 'text-center mt-3';
    viewAll.innerHTML = '<a href="#" class="btn btn-sm btn-outline-primary">View All Alerts →</a>';
    container.appendChild(viewAll);
}

function renderPerformanceHeatmap() {
    const tbody = document.getElementById('heatmapTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    performanceHeatmap.forEach(rep => {
        const tr = document.createElement('tr');
        
        const getBadge = (status) => {
            const badges = {
                'compliant': '<span class="performance-badge compliant">🟢</span>',
                'good': '<span class="performance-badge good">🔵</span>',
                'at-risk': '<span class="performance-badge at-risk">🟡</span>',
                'critical': '<span class="performance-badge critical">🔴</span>'
            };
            return badges[status] || '';
        };
        
        tr.innerHTML = `
            <td>${rep.name}</td>
            <td>${getBadge(rep.cpd)}</td>
            <td>${getBadge(rep.fp)}</td>
            <td>${getBadge(rep.fica)}</td>
            <td>${getBadge(rep.docs)}</td>
            <td><strong>${getBadge(rep.overall >= 80 ? 'compliant' : rep.overall >= 70 ? 'good' : rep.overall >= 50 ? 'at-risk' : 'critical')} ${rep.overall}%</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFSCAReports() {
    const container = document.getElementById('fscaReportTemplates');
    if (!container) return;
    
    const fscaReports = reportCategories.find(cat => cat.name === 'FSCA Submission Reports');
    if (!fscaReports) return;
    
    container.innerHTML = '';
    
    fscaReports.reports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'fsca-template-card';
        
        let sectionsHtml = '';
        if (report.includes && report.includes.length > 0) {
            sectionsHtml = '<div class="fsca-sections">';
            report.includes.forEach(section => {
                sectionsHtml += `
                    <div class="fsca-section-item">
                        <i class="fas fa-check-circle"></i>
                        <span>${section}</span>
                    </div>
                `;
            });
            sectionsHtml += '</div>';
        }
        
        card.innerHTML = `
            <div class="fsca-template-header">
                <div class="fsca-template-icon">${report.icon}</div>
                <div>
                    <div class="fsca-template-title">${report.title}</div>
                    <div class="fsca-template-meta">
                        ${report.reportingPeriod ? `Reporting Period: ${report.reportingPeriod}<br>` : ''}
                        ${report.submissionDeadline ? `Submission Deadline: ${report.submissionDeadline}<br>` : ''}
                        Format: ${report.format}
                    </div>
                </div>
            </div>
            <div class="report-description">${report.description}</div>
            ${sectionsHtml}
            <div class="report-actions mt-3">
                <button class="btn btn-primary" onclick="generateFSCAReport('${report.id}')">
                    <i class="fas fa-play me-1"></i> Generate Report
                </button>
                <button class="btn btn-outline-primary" onclick="previewReport('${report.id}')">
                    <i class="fas fa-eye me-1"></i> Preview
                </button>
                <button class="btn btn-outline-info" onclick="emailFSCAReport('${report.id}')">
                    <i class="fas fa-envelope me-1"></i> Email FSCA
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function initializeReportBuilder() {
    renderDataSources();
    setupBuilderNavigation();
}

function renderDataSources() {
    const container = document.getElementById('dataSourcesList');
    if (!container) return;
    
    const sources = [
        { id: 'representatives', name: 'Representatives', fields: ['Name', 'FSP Number', 'Status', 'Categories', 'Supervisors'] },
        { id: 'cpd', name: 'CPD Activities', fields: ['Hours', 'Dates', 'Providers', 'Status', 'Verifiable'] },
        { id: 'fp', name: 'Fit & Proper Records', fields: ['Qualifications', 'RE Exams', 'Character Declarations'] },
        { id: 'fica', name: 'FICA Verifications', fields: ['Client Details', 'Verification Status', 'Documents'] },
        { id: 'documents', name: 'Documents', fields: ['Document Types', 'Upload Dates', 'Access Logs'] },
        { id: 'complaints', name: 'Complaints', fields: ['Complaint Details', 'Status', 'Resolution Timeline'] },
        { id: 'clients', name: 'Clients', fields: ['Client Info', 'Portfolio Value', 'Representative'] },
        { id: 'audits', name: 'Internal Audits', fields: ['Audit Findings', 'Remediation Status', 'Dates'] }
    ];
    
    container.innerHTML = '';
    
    sources.forEach(source => {
        const item = document.createElement('div');
        item.className = 'data-source-item';
        item.innerHTML = `
            <input type="checkbox" id="source-${source.id}" value="${source.id}">
            <label for="source-${source.id}" class="ms-2">
                <strong>${source.name}</strong>
                <div class="data-source-fields">
                    └─ ${source.fields.join(', ')}
                </div>
            </label>
        `;
        
        item.querySelector('input').addEventListener('change', function() {
            item.classList.toggle('selected', this.checked);
            updateSelectedSourcesCount();
        });
        
        container.appendChild(item);
    });
}

function updateSelectedSourcesCount() {
    const count = document.querySelectorAll('#dataSourcesList input[type="checkbox"]:checked').length;
    document.getElementById('selectedSourcesCount').textContent = count;
}

function setupBuilderNavigation() {
    let currentStep = 1;
    
    document.getElementById('nextStepBtn')?.addEventListener('click', function() {
        if (currentStep < 6) {
            document.getElementById(`step${currentStep}`).classList.add('d-none');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.remove('d-none');
            updateStepIndicator(currentStep);
            
            if (currentStep > 1) {
                document.getElementById('prevStepBtn').style.display = 'block';
            }
            if (currentStep === 6) {
                this.textContent = 'Save Template';
            }
        }
    });
    
    document.getElementById('prevStepBtn')?.addEventListener('click', function() {
        if (currentStep > 1) {
            document.getElementById(`step${currentStep}`).classList.add('d-none');
            currentStep--;
            document.getElementById(`step${currentStep}`).classList.remove('d-none');
            updateStepIndicator(currentStep);
            
            if (currentStep === 1) {
                this.style.display = 'none';
            }
            document.getElementById('nextStepBtn').textContent = 'Next →';
        }
    });
}

function updateStepIndicator(step) {
    document.querySelectorAll('.step').forEach((s, index) => {
        const stepNum = index + 1;
        s.classList.remove('active', 'completed');
        if (stepNum < step) {
            s.classList.add('completed');
        } else if (stepNum === step) {
            s.classList.add('active');
        }
    });
}

function setupEventListeners() {
    document.getElementById('scheduleReportBtn')?.addEventListener('click', showScheduleModal);
    document.getElementById('scheduleReportForm')?.addEventListener('submit', handleScheduleReport);
    document.getElementById('createCustomReportBtn')?.addEventListener('click', function() {
        document.getElementById('builder-tab').click();
    });
    document.getElementById('scheduleNewReportBtn')?.addEventListener('click', showScheduleModal);
}

function showScheduleModal() {
    const modal = new bootstrap.Modal(document.getElementById('scheduleReportModal'));
    modal.show();
}

function handleScheduleReport(e) {
    e.preventDefault();
    Swal.fire({
        title: 'Report Scheduled',
        text: 'Report has been scheduled successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    bootstrap.Modal.getInstance(document.getElementById('scheduleReportModal')).hide();
}

function generateReport(reportId) {
    Swal.fire({
        title: 'Generating Report...',
        html: 'Please wait while we generate your report.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        Swal.fire({
            title: 'Report Generated',
            text: 'Your report has been generated successfully',
            icon: 'success',
            confirmButtonText: 'Download'
        });
    }, 2000);
}

function previewReport(reportId) {
    const modal = new bootstrap.Modal(document.getElementById('reportPreviewModal'));
    document.getElementById('reportPreviewContent').innerHTML = `
        <div class="text-center p-5">
            <i class="fas fa-file-pdf fa-5x text-danger mb-3"></i>
            <h5>Report Preview</h5>
            <p class="text-muted">Preview functionality would display the report here</p>
        </div>
    `;
    modal.show();
}

function scheduleReport(reportId) {
    showScheduleModal();
}

function generateFSCAReport(reportId) {
    Swal.fire({
        title: 'Generate FSCA Report?',
        text: 'This will generate a comprehensive FSCA compliance report',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Generate',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            generateReport(reportId);
        }
    });
}

function emailFSCAReport(reportId) {
    Swal.fire({
        title: 'Email FSCA Report',
        text: 'Email functionality would be implemented here',
        icon: 'info'
    });
}

function getTimeAgo(dateString) {
    // Simple time ago calculation
    const date = new Date(dateString.split(' ')[0].split('/').reverse().join('-'));
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
}

// Make functions globally accessible
window.generateReport = generateReport;
window.previewReport = previewReport;
window.scheduleReport = scheduleReport;
window.generateFSCAReport = generateFSCAReport;
window.emailFSCAReport = emailFSCAReport;

