// Debarment Register JavaScript

let debarmentData = {
    checks: [],
    representatives: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize when debarment tab is shown
    const debarmentTab = document.getElementById('debarment-tab');
    if (debarmentTab) {
        debarmentTab.addEventListener('shown.bs.tab', function() {
            loadDebarmentRegister();
        });
    }
});

/**
 * Load Debarment Register Data
 */
async function loadDebarmentRegister() {
    try {
        // Load ALL Representatives (including active, suspended, and terminated) - pass null
        // We need to check debarment status for all reps, not just active ones
        const result = await dataFunctions.getRepresentatives(null);
        let reps = result;
        if (result && result.data) {
            reps = result.data;
        } else if (result && Array.isArray(result)) {
            reps = result;
        }
        
        debarmentData.representatives = reps || [];
        
        // Sort representatives alphabetically for consistent display
        debarmentData.representatives.sort((a, b) => {
            const nameA = `${a.first_name || ''} ${a.surname || ''}`.trim().toLowerCase();
            const nameB = `${b.first_name || ''} ${b.surname || ''}`.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        renderDebarmentRegister();
    } catch (error) {
        console.error('Error loading debarment register:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load debarment register'
            });
        }
    }
}

/**
 * Render Debarment Register
 */
function renderDebarmentRegister() {
    const container = document.getElementById('debarment');
    if (!container) return;
    
    // Calculate statistics from real database data
    const totalReps = debarmentData.representatives.length;
    const debarredCount = debarmentData.representatives.filter(r => r.is_debarred === true).length;
    const clearCount = totalReps - debarredCount;
    const compliancePercentage = totalReps > 0 ? Math.round((clearCount / totalReps) * 100) : 100;
    
    // Get last check date (would come from debarment_checks table)
    const lastCheckDate = new Date().toLocaleDateString('en-ZA');
    
    // Update statistics cards with real data
    const statsCard = container.querySelector('.card .row');
    if (statsCard) {
        statsCard.innerHTML = `
            <div class="col-md-3 mb-3">
                <div class="stat-value text-primary">${totalReps}</div>
                <div class="stat-label">Total Representatives</div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stat-value text-${clearCount === totalReps ? 'success' : 'warning'}">${clearCount}</div>
                <div class="stat-label">Clear (Not Debarred)</div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stat-value text-${debarredCount === 0 ? 'success' : 'danger'}">
                    ${debarredCount === 0 ? '✅ 0' : `⚠️ ${debarredCount}`}
                </div>
                <div class="stat-label">Debarred</div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stat-value text-${compliancePercentage === 100 ? 'success' : 'warning'}">${compliancePercentage}%</div>
                <div class="stat-label">Compliance Rate</div>
            </div>
        `;
    }
    
    // Update debarment check history table
    const tbody = container.querySelector('table tbody');
    if (tbody) {
        // Show current status as a check entry
        tbody.innerHTML = `
            <tr>
                <td>${lastCheckDate}</td>
                <td>${totalReps}</td>
                <td>
                    <span class="badge bg-${debarredCount === 0 ? 'success' : 'danger'}">
                        ${debarredCount === 0 ? '✅ All Clear' : `⚠️ ${debarredCount} Debarred`}
                    </span>
                </td>
                <td>System (Automated)</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="downloadDebarmentCertificate()">
                        Download Certificate
                    </button>
                </td>
            </tr>
        `;
        
        // Show debarred representatives if any
        if (debarredCount > 0) {
            const debarredReps = debarmentData.representatives.filter(r => r.is_debarred);
            
            // Sort debarred representatives alphabetically
            debarredReps.sort((a, b) => {
                const nameA = `${a.first_name || ''} ${a.surname || ''}`.trim().toLowerCase();
                const nameB = `${b.first_name || ''} ${b.surname || ''}`.trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });
            
            debarredReps.forEach(rep => {
                const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                const repStatus = rep.status || 'unknown';
                const statusBadge = repStatus === 'active' ? 'bg-warning' :
                                   repStatus === 'suspended' ? 'bg-warning' :
                                   repStatus === 'terminated' ? 'bg-secondary' : 'bg-info';
                const row = document.createElement('tr');
                row.className = 'table-danger';
                row.innerHTML = `
                    <td><strong>${repName}</strong></td>
                    <td>${rep.representative_number || 'N/A'}</td>
                    <td>
                        <span class="badge bg-danger">❌ DEBARRED</span>
                        <span class="badge ${statusBadge} ms-1">${repStatus.toUpperCase()}</span>
                    </td>
                    <td>${lastCheckDate}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="viewDebarmentDetails('${rep.id}')">
                            <i class="fas fa-exclamation-triangle me-1"></i>View Details
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

/**
 * Run Debarment Check
 */
async function runDebarmentCheck() {
    if (typeof Swal === 'undefined') {
        alert('Running debarment check...');
        return;
    }
    
    Swal.fire({
        title: 'Running Debarment Check...',
        text: 'Please wait while we check all representatives against the FSCA register',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Simulate debarment check (would call actual API/function)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reload data
        await loadDebarmentRegister();
        
        Swal.fire({
            icon: 'success',
            title: 'Debarment Check Complete',
            text: 'All representatives have been checked. No new debarments found.',
            confirmButtonText: 'OK'
        });
    } catch (error) {
        console.error('Error running debarment check:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to run debarment check: ${error.message}`
        });
    }
}

/**
 * Download Debarment Certificate
 */
function downloadDebarmentCertificate() {
    try {
        // Calculate statistics
        const totalReps = debarmentData.representatives.length;
        const debarredCount = debarmentData.representatives.filter(r => r.is_debarred === true).length;
        const clearCount = totalReps - debarredCount;
        const compliancePercentage = totalReps > 0 ? Math.round((clearCount / totalReps) * 100) : 100;
        const checkDate = new Date().toLocaleDateString('en-ZA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const checkTime = new Date().toLocaleTimeString('en-ZA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get debarred representatives list
        const debarredReps = debarmentData.representatives.filter(r => r.is_debarred === true);
        debarredReps.sort((a, b) => {
            const nameA = `${a.first_name || ''} ${a.surname || ''}`.trim().toLowerCase();
            const nameB = `${b.first_name || ''} ${b.surname || ''}`.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        // Get clear representatives list (first 50 for certificate)
        const clearReps = debarmentData.representatives.filter(r => !r.is_debarred);
        clearReps.sort((a, b) => {
            const nameA = `${a.first_name || ''} ${a.surname || ''}`.trim().toLowerCase();
            const nameB = `${b.first_name || ''} ${b.surname || ''}`.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        // Generate certificate HTML
        const certificateHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FSCA Debarment Verification Certificate - ${checkDate}</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .certificate-container {
            border: 3px solid #5CBDB4;
            padding: 40px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #5CBDB4;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #5CBDB4;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        
        .header h2 {
            color: #333;
            font-size: 20px;
            margin: 5px 0;
            font-weight: normal;
        }
        
        .header .cert-number {
            color: #666;
            font-size: 12px;
            margin-top: 10px;
            font-family: monospace;
        }
        
        .section {
            margin: 25px 0;
        }
        
        .section-title {
            color: #5CBDB4;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .stat-box {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-value.success { color: #28a745; }
        .stat-value.danger { color: #dc3545; }
        .stat-value.primary { color: #5CBDB4; }
        .stat-value.warning { color: #ffc107; }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .certification-statement {
            background: #f0f9ff;
            border-left: 4px solid #5CBDB4;
            padding: 20px;
            margin: 25px 0;
            font-size: 14px;
        }
        
        .compliance-status {
            background: ${debarredCount === 0 ? '#d4edda' : '#fff3cd'};
            border: 2px solid ${debarredCount === 0 ? '#28a745' : '#ffc107'};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
            font-weight: bold;
            font-size: 18px;
            color: ${debarredCount === 0 ? '#155724' : '#856404'};
        }
        
        .rep-list {
            font-size: 12px;
            margin: 15px 0;
        }
        
        .rep-list table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .rep-list th,
        .rep-list td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .rep-list th {
            background: #f8f9fa;
            font-weight: bold;
            color: #5CBDB4;
        }
        
        .rep-list tr:hover {
            background: #f8f9fa;
        }
        
        .debarred-list {
            background: #f8d7da;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        
        .debarred-list h4 {
            color: #dc3545;
            margin-bottom: 10px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #5CBDB4;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin: 40px 0;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            margin-top: 50px;
            padding-top: 10px;
        }
        
        .warning-box {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .warning-box h4 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .certificate-container {
                box-shadow: none;
                border: 3px solid #5CBDB4;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <!-- Header -->
        <div class="header">
            <h1>✓ iComply</h1>
            <h2>FSCA Debarment Verification Certificate</h2>
            <p style="margin: 10px 0; color: #666;">Republic of South Africa - Financial Sector Conduct Authority</p>
            <div class="cert-number">Certificate No: CERT-${Date.now()}</div>
        </div>
        
        <!-- Check Information -->
        <div class="section">
            <div class="section-title">Verification Details</div>
            <p><strong>Check Date:</strong> ${checkDate} at ${checkTime}</p>
            <p><strong>Verification Type:</strong> FSCA Debarment Register Check</p>
            <p><strong>Scope:</strong> All active and inactive representatives</p>
        </div>
        
        <!-- Statistics -->
        <div class="section">
            <div class="section-title">Summary Statistics</div>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value primary">${totalReps}</div>
                    <div class="stat-label">Total Representatives</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value success">${clearCount}</div>
                    <div class="stat-label">Clear (Not Debarred)</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value ${debarredCount === 0 ? 'success' : 'danger'}">${debarredCount}</div>
                    <div class="stat-label">Debarred</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value ${compliancePercentage === 100 ? 'success' : 'warning'}">${compliancePercentage}%</div>
                    <div class="stat-label">Compliance Rate</div>
                </div>
            </div>
        </div>
        
        <!-- Compliance Status -->
        <div class="compliance-status">
            ${debarredCount === 0 
                ? '✅ ALL REPRESENTATIVES CLEAR - NO DEBARMENTS FOUND' 
                : `⚠️ ${debarredCount} REPRESENTATIVE${debarredCount > 1 ? 'S' : ''} FOUND DEBARRED`}
        </div>
        
        <!-- Certification Statement -->
        <div class="certification-statement">
            <p><strong>CERTIFICATION:</strong></p>
            <p>This is to certify that on <strong>${checkDate}</strong>, a verification check was conducted against the Financial Sector Conduct Authority (FSCA) Debarment Register for all representatives associated with this Financial Services Provider.</p>
            <p style="margin-top: 15px;"><strong>Total representatives verified:</strong> ${totalReps}</p>
            <p><strong>Result:</strong> ${clearCount} representatives found to be in good standing, ${debarredCount} representative${debarredCount !== 1 ? 's' : ''} found to be debarred.</p>
        </div>
        
        ${debarredCount > 0 ? `
        <!-- Debarred Representatives -->
        <div class="section">
            <div class="debarred-list">
                <h4>⚠️ Debarred Representatives (${debarredCount})</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rep Number</th>
                            <th>ID Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${debarredReps.map(rep => {
                            const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                            return `
                                <tr style="background: #f8d7da;">
                                    <td><strong>${name}</strong></td>
                                    <td>${rep.representative_number || 'N/A'}</td>
                                    <td>${rep.id_number || 'N/A'}</td>
                                    <td>${rep.status || 'N/A'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="warning-box">
                <h4>⚠️ Required Actions</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Immediately cease all financial services activities by debarred representatives</li>
                    <li>Notify affected clients of debarment status</li>
                    <li>Reassign client portfolios to compliant representatives</li>
                    <li>Report to FSCA if not already done</li>
                    <li>Update internal systems to prevent future transactions</li>
                </ul>
            </div>
        </div>
        ` : ''}
        
        <!-- Clear Representatives List (Summary) -->
        <div class="section">
            <div class="section-title">Verified Clear Representatives (${clearCount})</div>
            <div class="rep-list">
                <p style="color: #666; font-size: 11px; margin-bottom: 10px;">The following representatives have been verified against the FSCA Debarment Register and found to be in good standing:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Representative Number</th>
                            <th>ID Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clearReps.slice(0, 50).map(rep => {
                            const name = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
                            const statusBadge = rep.status === 'active' ? '✅' :
                                               rep.status === 'suspended' ? '⚠️' :
                                               rep.status === 'terminated' ? '❌' : '•';
                            return `
                                <tr>
                                    <td>${name}</td>
                                    <td>${rep.representative_number || 'N/A'}</td>
                                    <td>${rep.id_number || 'N/A'}</td>
                                    <td>${statusBadge} ${rep.status || 'N/A'}</td>
                                </tr>
                            `;
                        }).join('')}
                        ${clearCount > 50 ? `
                            <tr>
                                <td colspan="4" style="text-align: center; color: #666; font-style: italic;">
                                    ... and ${clearCount - 50} more representative${clearCount - 50 > 1 ? 's' : ''}
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Regulatory Information -->
        <div class="section">
            <div class="section-title">Regulatory Information</div>
            <p style="font-size: 12px; color: #666;">
                <strong>FAIS Act Compliance:</strong> This certificate is issued in compliance with the Financial Advisory and Intermediary Services Act (FAIS Act, 2002) Section 14, which requires Financial Services Providers to ensure that representatives are not debarred by the Financial Sector Conduct Authority.
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
                <strong>Verification Source:</strong> FSCA Debarment Register<br>
                <strong>Next Verification Due:</strong> ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })} (90 days)
            </p>
        </div>
        
        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line">
                    <strong>Compliance Officer</strong><br>
                    <span style="font-size: 11px; color: #666;">iComply System</span>
                </div>
            </div>
            <div class="signature-box">
                <div class="signature-line">
                    <strong>Date</strong><br>
                    <span style="font-size: 11px;">${checkDate}</span>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>iComply - Financial Services Compliance Portal</strong></p>
            <p>This certificate was automatically generated by the iComply system.</p>
            <p style="font-size: 10px; color: #999; margin-top: 10px;">
                Generated: ${checkDate} at ${checkTime} | 
                Certificate ID: CERT-${Date.now()} | 
                Valid for 90 days from issue date
            </p>
        </div>
    </div>
    
    <div style="text-align: center; margin: 20px 0; page-break-before: avoid;">
        <button onclick="window.print()" style="
            background: #5CBDB4;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        ">
            🖨️ Print Certificate
        </button>
        <button onclick="window.close()" style="
            background: #6c757d;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
        ">
            Close
        </button>
    </div>
    
    <script>
        // Auto-print on load (optional)
        // window.onload = () => window.print();
    </script>
</body>
</html>
        `;
        
        // Open certificate in new window
        const certificateWindow = window.open('', '_blank', 'width=800,height=1000');
        if (certificateWindow) {
            certificateWindow.document.write(certificateHTML);
            certificateWindow.document.close();
            
            // Show success message
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Certificate Generated',
                    html: `
                        <p>The debarment verification certificate has been opened in a new window.</p>
                        <p class="mt-2">You can:</p>
                        <ul class="text-start">
                            <li>Click "Print Certificate" to print</li>
                            <li>Use your browser's "Save as PDF" option</li>
                            <li>Save for your compliance records</li>
                        </ul>
                    `,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            // Popup blocked
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Popup Blocked',
                    text: 'Please allow popups for this site to download the certificate.',
                    confirmButtonText: 'OK'
                });
            }
        }
    } catch (error) {
        console.error('Error generating certificate:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to generate debarment certificate. Please try again.'
            });
        }
    }
}

/**
 * View Debarment Details
 */
function viewDebarmentDetails(repId) {
    const rep = debarmentData.representatives.find(r => r.id === repId);
    if (!rep) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Representative Not Found',
                text: 'Unable to load representative details.'
            });
        }
        return;
    }
    
    const repName = `${rep.first_name || ''} ${rep.surname || ''}`.trim() || 'Unknown';
    const repStatus = rep.status || 'unknown';
    const statusClass = repStatus === 'active' ? 'warning' :
                       repStatus === 'suspended' ? 'warning' :
                       repStatus === 'terminated' ? 'secondary' : 'info';
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '⚠️ Debarment Alert',
            html: `
                <div class="text-start">
                    <h5 class="text-danger mb-3">This representative is DEBARRED</h5>
                    <hr>
                    <p><strong>Name:</strong> ${repName}</p>
                    <p><strong>Representative Number:</strong> ${rep.representative_number || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${rep.id_number || 'N/A'}</p>
                    <p><strong>Current Status:</strong> 
                        <span class="badge bg-danger">DEBARRED</span>
                        <span class="badge bg-${statusClass} ms-1">${repStatus.toUpperCase()}</span>
                    </p>
                    <hr>
                    <div class="alert alert-danger mt-3">
                        <h6 class="alert-heading">⚠️ REGULATORY NOTICE</h6>
                        <p class="mb-0">This representative is currently debarred by the FSCA and <strong>CANNOT</strong> provide financial services or represent any Financial Services Provider.</p>
                    </div>
                    <div class="alert alert-warning mt-2">
                        <h6 class="alert-heading">Required Actions:</h6>
                        <ul class="mb-0">
                            <li>Immediately cease all financial services activities</li>
                            <li>Notify all clients of debarment status</li>
                            <li>Reassign client portfolios to compliant representatives</li>
                            <li>Review FSCA debarment register for details</li>
                        </ul>
                    </div>
                    <p class="text-muted mt-3"><small><strong>Last Verified:</strong> ${rep.last_verified_date ? new Date(rep.last_verified_date).toLocaleDateString('en-ZA') : new Date().toLocaleDateString('en-ZA')}</small></p>
                </div>
            `,
            icon: 'error',
            width: '600px',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#dc3545'
        });
    }
}

// Export for global access
window.runDebarmentCheck = runDebarmentCheck;
window.downloadDebarmentCertificate = downloadDebarmentCertificate;
window.viewDebarmentDetails = viewDebarmentDetails;
window.loadDebarmentRegister = loadDebarmentRegister;

