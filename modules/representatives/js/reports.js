// Representatives Reports JavaScript

let reportsData = {
    representatives: [],
    compliance: [],
    cpd: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when reports tab is shown
    const reportsTab = document.getElementById('reports-tab');
    if (reportsTab) {
        reportsTab.addEventListener('shown.bs.tab', function() {
            initializeReports();
        });
    }
});

/**
 * Initialize Reports
 */
function initializeReports() {
    console.log('Initializing Representatives Reports...');
}

/**
 * Generate Representatives Summary Report
 */
async function generateRepresentativesSummary() {
    try {
        Swal.fire({
            title: 'Generating Report...',
            text: 'Please wait while we compile the representatives summary',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Load representatives data
        const result = await dataFunctions.getRepresentatives(null);
        let reps = result;
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        if (!reps || reps.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'No representatives found to generate report'
            });
            return;
        }
        
        // Enrich with user profiles
        const enrichedReps = await Promise.all(reps.map(async (rep) => {
            if (rep.user_profile_id) {
                try {
                    const profileResult = await dataFunctions.getUserProfile(rep.user_profile_id);
                    if (profileResult && profileResult.data) {
                        rep.first_name = profileResult.data.first_name;
                        rep.surname = profileResult.data.surname;
                        rep.email = profileResult.data.email;
                    }
                } catch (err) {
                    console.warn('Error loading profile:', err);
                }
            }
            return rep;
        }));
        
        // Calculate statistics
        const stats = {
            total: enrichedReps.length,
            active: enrichedReps.filter(r => r.status === 'active').length,
            suspended: enrichedReps.filter(r => r.status === 'suspended').length,
            terminated: enrichedReps.filter(r => r.status === 'terminated').length,
            class1: enrichedReps.filter(r => r.class_1_long_term).length,
            class2: enrichedReps.filter(r => r.class_2_short_term).length,
            class3: enrichedReps.filter(r => r.class_3_pension).length
        };
        
        // Generate report HTML
        const reportHTML = `
            <div class="text-start">
                <h4 class="mb-4">Representatives Summary Report</h4>
                <p class="text-muted">Generated: ${new Date().toLocaleString('en-ZA')}</p>
                
                <div class="row mb-4">
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-primary mb-0">${stats.total}</h3>
                                <small class="text-muted">Total</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-success mb-0">${stats.active}</h3>
                                <small class="text-muted">Active</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-warning mb-0">${stats.suspended}</h3>
                                <small class="text-muted">Suspended</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-danger mb-0">${stats.terminated}</h3>
                                <small class="text-muted">Terminated</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h5 class="mt-4 mb-3">Categories Breakdown</h5>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-1"><strong>Category I - Long-term</strong></p>
                                <h4 class="text-primary">${stats.class1}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-1"><strong>Category II - Short-term</strong></p>
                                <h4 class="text-info">${stats.class2}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-1"><strong>Category III - Pension</strong></p>
                                <h4 class="text-success">${stats.class3}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h5 class="mt-4 mb-3">Representatives List</h5>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Name</th>
                                <th>FSP Number</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Categories</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrichedReps.map(rep => {
                                const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                const categories = [
                                    rep.class_1_long_term ? 'I' : '',
                                    rep.class_2_short_term ? 'II' : '',
                                    rep.class_3_pension ? 'III' : ''
                                ].filter(c => c).join(', ') || 'None';
                                
                                return `
                                    <tr>
                                        <td>${name}</td>
                                        <td>${rep.fsp_number || 'N/A'}</td>
                                        <td>${rep.email || 'N/A'}</td>
                                        <td><span class="badge bg-${rep.status === 'active' ? 'success' : rep.status === 'suspended' ? 'warning' : 'secondary'}">${rep.status}</span></td>
                                        <td>${categories}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        Swal.fire({
            title: 'Representatives Summary Report',
            html: reportHTML,
            width: '900px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-download me-2"></i>Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                downloadReportAsPDF('Representatives Summary', reportHTML);
            }
        });
        
    } catch (error) {
        console.error('Error generating representatives summary:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to generate representatives summary report'
        });
    }
}

/**
 * Generate Compliance Report
 */
async function generateComplianceReport() {
    try {
        Swal.fire({
            title: 'Generating Compliance Report...',
            text: 'Calculating compliance for all representatives',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Load representatives
        const repsResult = await dataFunctions.getRepresentatives(null);
        let reps = repsResult;
        if (repsResult && repsResult.data) {
            reps = repsResult.data;
        } else if (repsResult && Array.isArray(repsResult)) {
            reps = repsResult;
        }
        
        if (!reps || reps.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'No representatives found'
            });
            return;
        }
        
        // Get bulk compliance
        const bulkComplianceResult = await dataFunctions.getAllRepresentativesCompliance();
        let bulkCompliance = bulkComplianceResult;
        if (bulkComplianceResult && bulkComplianceResult.data) {
            bulkCompliance = bulkComplianceResult.data;
        }
        
        // Enrich reps with profiles and compliance
        const enrichedReps = await Promise.all(reps.map(async (rep) => {
            // Get profile
            if (rep.user_profile_id) {
                try {
                    const profileResult = await dataFunctions.getUserProfile(rep.user_profile_id);
                    if (profileResult && profileResult.data) {
                        rep.first_name = profileResult.data.first_name;
                        rep.surname = profileResult.data.surname;
                    }
                } catch (err) {
                    console.warn('Error loading profile:', err);
                }
            }
            
            // Get compliance
            if (bulkCompliance && Array.isArray(bulkCompliance)) {
                const compliance = bulkCompliance.find(c => c.representative_id === rep.id);
                if (compliance && compliance.compliance_data) {
                    rep.compliance = compliance.compliance_data;
                    rep.overallStatus = compliance.compliance_data.overall_status;
                    rep.overallScore = compliance.compliance_data.overall_score;
                }
            }
            
            return rep;
        }));
        
        // Sort by compliance score (lowest first - need attention)
        enrichedReps.sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0));
        
        // Calculate compliance statistics
        const complianceStats = {
            total: enrichedReps.length,
            compliant: enrichedReps.filter(r => r.overallStatus === 'compliant').length,
            atRisk: enrichedReps.filter(r => r.overallStatus === 'at_risk').length,
            nonCompliant: enrichedReps.filter(r => r.overallStatus === 'non_compliant').length,
            avgScore: enrichedReps.reduce((sum, r) => sum + (r.overallScore || 0), 0) / enrichedReps.length
        };
        
        const compliancePct = complianceStats.total > 0 
            ? Math.round((complianceStats.compliant / complianceStats.total) * 100) 
            : 0;
        
        const reportHTML = `
            <div class="text-start">
                <h4 class="mb-4">Compliance Status Report</h4>
                <p class="text-muted">Generated: ${new Date().toLocaleString('en-ZA')}</p>
                
                <div class="alert alert-${compliancePct >= 85 ? 'success' : compliancePct >= 70 ? 'warning' : 'danger'}">
                    <h5 class="mb-2">Overall Compliance: ${compliancePct}%</h5>
                    <p class="mb-0">Average Score: ${Math.round(complianceStats.avgScore)}%</p>
                </div>
                
                <div class="row mb-4">
                    <div class="col-4">
                        <div class="card text-center border-success">
                            <div class="card-body">
                                <h3 class="text-success mb-0">${complianceStats.compliant}</h3>
                                <small class="text-muted">Compliant</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card text-center border-warning">
                            <div class="card-body">
                                <h3 class="text-warning mb-0">${complianceStats.atRisk}</h3>
                                <small class="text-muted">At Risk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card text-center border-danger">
                            <div class="card-body">
                                <h3 class="text-danger mb-0">${complianceStats.nonCompliant}</h3>
                                <small class="text-muted">Non-Compliant</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h5 class="mt-4 mb-3">Detailed Compliance Status</h5>
                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-sm table-striped">
                        <thead class="table-light sticky-top">
                            <tr>
                                <th>Representative</th>
                                <th>Overall Score</th>
                                <th>Status</th>
                                <th>F&P</th>
                                <th>CPD</th>
                                <th>FICA</th>
                                <th>Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrichedReps.map(rep => {
                                const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                const score = Math.round(rep.overallScore || 0);
                                const scoreClass = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger';
                                const statusBadge = rep.overallStatus === 'compliant' ? 'success' :
                                                   rep.overallStatus === 'at_risk' ? 'warning' : 'danger';
                                
                                const fpStatus = rep.compliance?.fit_proper?.status || 'unknown';
                                const cpdStatus = rep.compliance?.cpd?.status || 'unknown';
                                const ficaStatus = rep.compliance?.fica?.status || 'unknown';
                                const docsStatus = rep.compliance?.documents?.status || 'unknown';
                                
                                return `
                                    <tr>
                                        <td><strong>${name}</strong></td>
                                        <td><span class="badge bg-${scoreClass}">${score}%</span></td>
                                        <td><span class="badge bg-${statusBadge}">${(rep.overallStatus || 'unknown').toUpperCase().replace('_', ' ')}</span></td>
                                        <td><small>${fpStatus}</small></td>
                                        <td><small>${cpdStatus}</small></td>
                                        <td><small>${ficaStatus}</small></td>
                                        <td><small>${docsStatus}</small></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                ${complianceStats.nonCompliant > 0 || complianceStats.atRisk > 0 ? `
                    <div class="alert alert-warning mt-4">
                        <h6 class="mb-2">⚠️ Action Required</h6>
                        ${complianceStats.nonCompliant > 0 ? `<p class="mb-1">• ${complianceStats.nonCompliant} representative(s) are non-compliant and require immediate attention</p>` : ''}
                        ${complianceStats.atRisk > 0 ? `<p class="mb-0">• ${complianceStats.atRisk} representative(s) are at risk and should be monitored</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        Swal.fire({
            title: 'Compliance Report',
            html: reportHTML,
            width: '1000px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-download me-2"></i>Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                downloadReportAsPDF('Compliance Report', reportHTML);
            }
        });
        
    } catch (error) {
        console.error('Error generating compliance report:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to generate compliance report'
        });
    }
}

/**
 * Generate CPD Summary Report
 */
async function generateCPDSummary() {
    try {
        Swal.fire({
            title: 'Generating CPD Report...',
            text: 'Compiling CPD data for all representatives',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Load representatives
        const repsResult = await dataFunctions.getRepresentatives('active');
        let reps = repsResult;
        if (repsResult && repsResult.data) {
            reps = repsResult.data;
        } else if (repsResult && Array.isArray(repsResult)) {
            reps = repsResult;
        }
        
        if (!reps || reps.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'No active representatives found'
            });
            return;
        }
        
        // Get CPD compliance for each representative
        const cpdData = await Promise.all(reps.map(async (rep) => {
            try {
                // Get profile
                if (rep.user_profile_id) {
                    const profileResult = await dataFunctions.getUserProfile(rep.user_profile_id);
                    if (profileResult && profileResult.data) {
                        rep.first_name = profileResult.data.first_name;
                        rep.surname = profileResult.data.surname;
                    }
                }
                
                // Get CPD compliance
                const cpdResult = await dataFunctions.calculateCPDCompliance(rep.id);
                let cpd = cpdResult;
                if (cpdResult && cpdResult.data) {
                    cpd = cpdResult.data;
                }
                
                rep.cpd = cpd || {
                    earned_hours: 0,
                    required_hours: 18,
                    earned_ethics: 0,
                    required_ethics: 3,
                    status: 'pending',
                    percentage: 0
                };
                
                return rep;
            } catch (err) {
                console.warn('Error loading CPD data:', err);
                rep.cpd = {
                    earned_hours: 0,
                    required_hours: 18,
                    earned_ethics: 0,
                    required_ethics: 3,
                    status: 'unknown',
                    percentage: 0
                };
                return rep;
            }
        }));
        
        // Sort by CPD completion percentage (lowest first)
        cpdData.sort((a, b) => (a.cpd.percentage || 0) - (b.cpd.percentage || 0));
        
        // Calculate CPD statistics
        const cpdStats = {
            total: cpdData.length,
            completed: cpdData.filter(r => r.cpd.status === 'completed').length,
            inProgress: cpdData.filter(r => r.cpd.status === 'in_progress').length,
            behind: cpdData.filter(r => r.cpd.status === 'behind').length,
            totalHoursEarned: cpdData.reduce((sum, r) => sum + (r.cpd.earned_hours || 0), 0),
            totalHoursRequired: cpdData.reduce((sum, r) => sum + (r.cpd.required_hours || 18), 0),
            avgCompletion: cpdData.reduce((sum, r) => sum + (r.cpd.percentage || 0), 0) / cpdData.length
        };
        
        const reportHTML = `
            <div class="text-start">
                <h4 class="mb-4">CPD Summary Report</h4>
                <p class="text-muted">Generated: ${new Date().toLocaleString('en-ZA')} | Year: ${new Date().getFullYear()}</p>
                
                <div class="alert alert-${cpdStats.avgCompletion >= 90 ? 'success' : cpdStats.avgCompletion >= 70 ? 'warning' : 'danger'}">
                    <h5 class="mb-2">Overall CPD Completion: ${Math.round(cpdStats.avgCompletion)}%</h5>
                    <p class="mb-0">Total Hours Earned: ${cpdStats.totalHoursEarned} / ${cpdStats.totalHoursRequired}</p>
                </div>
                
                <div class="row mb-4">
                    <div class="col-4">
                        <div class="card text-center border-success">
                            <div class="card-body">
                                <h3 class="text-success mb-0">${cpdStats.completed}</h3>
                                <small class="text-muted">Completed</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card text-center border-info">
                            <div class="card-body">
                                <h3 class="text-info mb-0">${cpdStats.inProgress}</h3>
                                <small class="text-muted">In Progress</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card text-center border-danger">
                            <div class="card-body">
                                <h3 class="text-danger mb-0">${cpdStats.behind}</h3>
                                <small class="text-muted">Behind</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h5 class="mt-4 mb-3">CPD Status by Representative</h5>
                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-sm table-striped">
                        <thead class="table-light sticky-top">
                            <tr>
                                <th>Representative</th>
                                <th>Hours Earned</th>
                                <th>Required</th>
                                <th>Ethics</th>
                                <th>Progress</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cpdData.map(rep => {
                                const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                                const earned = rep.cpd.earned_hours || 0;
                                const required = rep.cpd.required_hours || 18;
                                const ethics = rep.cpd.earned_ethics || 0;
                                const ethicsReq = rep.cpd.required_ethics || 3;
                                const percentage = rep.cpd.percentage || 0;
                                const status = rep.cpd.status || 'unknown';
                                const statusClass = status === 'completed' ? 'success' :
                                                   status === 'in_progress' ? 'info' : 'danger';
                                const progressClass = percentage >= 100 ? 'success' : percentage >= 67 ? 'warning' : 'danger';
                                
                                return `
                                    <tr>
                                        <td><strong>${name}</strong></td>
                                        <td>${earned.toFixed(1)}</td>
                                        <td>${required}</td>
                                        <td>${ethics.toFixed(1)} / ${ethicsReq}</td>
                                        <td>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar bg-${progressClass}" style="width: ${Math.min(percentage, 100)}%">
                                                    ${Math.round(percentage)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td><span class="badge bg-${statusClass}">${status.toUpperCase().replace('_', ' ')}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                ${cpdStats.behind > 0 ? `
                    <div class="alert alert-danger mt-4">
                        <h6 class="mb-2">⚠️ CPD Attention Required</h6>
                        <p class="mb-0">${cpdStats.behind} representative(s) are behind on CPD requirements and need to complete training urgently.</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        Swal.fire({
            title: 'CPD Summary Report',
            html: reportHTML,
            width: '1000px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-download me-2"></i>Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#5CBDB4'
        }).then((result) => {
            if (result.isConfirmed) {
                downloadReportAsPDF('CPD Summary Report', reportHTML);
            }
        });
        
    } catch (error) {
        console.error('Error generating CPD report:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to generate CPD summary report'
        });
    }
}

/**
 * Download Report as PDF
 */
function downloadReportAsPDF(reportName, htmlContent) {
    // For now, use browser's print functionality
    // In production, would use a PDF generation library like jsPDF or html2pdf
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${reportName}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; font-family: Arial, sans-serif; }
                .badge { display: inline-block; padding: 0.25em 0.6em; }
                .progress { background-color: #e9ecef; height: 20px; border-radius: 4px; overflow: hidden; }
                .progress-bar { height: 100%; transition: none; }
                .bg-success { background-color: #28a745 !important; color: white; }
                .bg-warning { background-color: #ffc107 !important; color: black; }
                .bg-danger { background-color: #dc3545 !important; color: white; }
                .bg-info { background-color: #17a2b8 !important; color: white; }
                .text-success { color: #28a745 !important; }
                .text-warning { color: #ffc107 !important; }
                .text-danger { color: #dc3545 !important; }
                .text-info { color: #17a2b8 !important; }
                .text-primary { color: #5CBDB4 !important; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${htmlContent}
            <div class="mt-4 text-center no-print">
                <button onclick="window.print()" class="btn btn-primary me-2">
                    <i class="fas fa-print me-2"></i>Print / Save as PDF
                </button>
                <button onclick="window.close()" class="btn btn-secondary">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Export functions to window
window.generateRepresentativesSummary = generateRepresentativesSummary;
window.generateComplianceReport = generateComplianceReport;
window.generateCPDSummary = generateCPDSummary;

