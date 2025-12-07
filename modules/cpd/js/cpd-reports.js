// CPD Reports JavaScript

/**
 * Generate Personal CPD Summary Report
 */
async function generatePersonalSummary() {
    try {
        if (!cpdData || !cpdData.selectedRepresentativeId || !cpdData.selectedCycleId) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Representative',
                text: 'Please select a representative and cycle first.'
            });
            return;
        }
        
        Swal.fire({
            title: 'Generating Report...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Get representative details
        const rep = cpdData.representatives.find(r => r.id === cpdData.selectedRepresentativeId);
        
        // Get progress data
        const progress = cpdData.progress || {};
        
        // Get all activities
        const activities = cpdData.activities || [];
        
        // Generate HTML report
        const reportHtml = `
            <div class="cpd-report" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <!-- Header -->
                <div style="text-align: center; border-bottom: 3px solid #5CBDB4; padding-bottom: 20px; margin-bottom: 30px;">
                    <h2 style="color: #5CBDB4; margin: 0;">CPD SUMMARY REPORT</h2>
                    <p style="color: #666; margin: 10px 0 0 0;">${cpdData.cycle?.cycle_name || 'Current Cycle'}</p>
                </div>
                
                <!-- Representative Info -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #333;">Representative Information</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Name:</td>
                            <td style="padding: 8px;">${rep?.first_name || ''} ${rep?.surname || ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">FSP Number:</td>
                            <td style="padding: 8px;">${rep?.fsp_number_new || rep?.representative_number || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Cycle:</td>
                            <td style="padding: 8px;">${cpdData.cycle?.cycle_name || ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Period:</td>
                            <td style="padding: 8px;">${new Date(cpdData.cycle?.start_date).toLocaleDateString('en-ZA')} - ${new Date(cpdData.cycle?.end_date).toLocaleDateString('en-ZA')}</td>
                        </tr>
                    </table>
                </div>
                
                <!-- Progress Summary -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333;">CPD Progress Summary</h4>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                        <thead style="background: #5CBDB4; color: white;">
                            <tr>
                                <th style="padding: 12px; text-align: left;">Requirement</th>
                                <th style="padding: 12px; text-align: center;">Required</th>
                                <th style="padding: 12px; text-align: center;">Logged</th>
                                <th style="padding: 12px; text-align: center;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 12px;">Total Hours</td>
                                <td style="padding: 12px; text-align: center;">${cpdData.cycle?.required_hours || 18}</td>
                                <td style="padding: 12px; text-align: center; font-weight: bold;">${Math.round(parseFloat(progress.total_hours_logged || 0))}</td>
                                <td style="padding: 12px; text-align: center;">
                                    <span style="padding: 4px 12px; border-radius: 12px; background: ${parseFloat(progress.total_hours_logged || 0) >= (cpdData.cycle?.required_hours || 18) ? '#28a745' : '#ffc107'}; color: white; font-size: 12px;">
                                        ${Math.round(parseFloat(progress.progress_percentage || 0))}%
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 12px;">Ethics Hours</td>
                                <td style="padding: 12px; text-align: center;">${cpdData.cycle?.required_ethics_hours || 3}</td>
                                <td style="padding: 12px; text-align: center; font-weight: bold;">${Math.round(parseFloat(progress.ethics_hours_logged || 0))}</td>
                                <td style="padding: 12px; text-align: center;">
                                    <span style="padding: 4px 12px; border-radius: 12px; background: ${parseFloat(progress.ethics_hours_logged || 0) >= (cpdData.cycle?.required_ethics_hours || 3) ? '#28a745' : '#dc3545'}; color: white; font-size: 12px;">
                                        ${parseFloat(progress.ethics_hours_logged || 0) >= (cpdData.cycle?.required_ethics_hours || 3) ? 'Met' : 'Not Met'}
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 12px;">Technical Hours</td>
                                <td style="padding: 12px; text-align: center;">${cpdData.cycle?.required_technical_hours || 14}</td>
                                <td style="padding: 12px; text-align: center; font-weight: bold;">${Math.round(parseFloat(progress.technical_hours_logged || 0))}</td>
                                <td style="padding: 12px; text-align: center;">-</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Verifiable Hours</td>
                                <td style="padding: 12px; text-align: center;">-</td>
                                <td style="padding: 12px; text-align: center; font-weight: bold;">${Math.round(parseFloat(progress.verifiable_hours || 0))}</td>
                                <td style="padding: 12px; text-align: center;">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Activities List -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333;">Activities Logged (${activities.length})</h4>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; font-size: 13px;">
                        <thead style="background: #f8f9fa;">
                            <tr>
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Date</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Activity</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Hours</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Ethics</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activities.map(a => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 10px;">${new Date(a.activity_date).toLocaleDateString('en-ZA')}</td>
                                    <td style="padding: 10px;">${a.activity_name}</td>
                                    <td style="padding: 10px; text-align: center;">${a.total_hours || 0}</td>
                                    <td style="padding: 10px; text-align: center;">${a.ethics_hours || 0}</td>
                                    <td style="padding: 10px; text-align: center;">
                                        <span style="padding: 2px 8px; border-radius: 8px; background: ${a.status === 'verified' ? '#28a745' : '#ffc107'}; color: white; font-size: 11px;">
                                            ${a.status || 'Draft'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                            ${activities.length === 0 ? '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">No activities logged</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
                    <p>Generated on ${new Date().toLocaleDateString('en-ZA', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
            </div>
        `;
        
        Swal.fire({
            title: 'CPD Summary Report',
            html: reportHtml,
            width: '900px',
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: '<i class="fas fa-print me-2"></i>Print',
            showCancelButton: true,
            cancelButtonText: '<i class="fas fa-file-pdf me-2"></i>Export PDF'
        }).then((result) => {
            if (result.isConfirmed) {
                window.print();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Export to PDF functionality
                Swal.fire('Info', 'PDF export will be implemented', 'info');
            }
        });
        
    } catch (error) {
        console.error('Error generating personal summary:', error);
        Swal.fire({
            icon: 'error',
            title: 'Report Generation Failed',
            text: error.message
        });
    }
}

/**
 * Generate CPD Compliance Certificate
 */
async function generateComplianceCertificate() {
    try {
        if (!cpdData || !cpdData.selectedRepresentativeId || !cpdData.selectedCycleId) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Representative',
                text: 'Please select a representative and cycle first.'
            });
            return;
        }
        
        const progress = cpdData.progress || {};
        const rep = cpdData.representatives.find(r => r.id === cpdData.selectedRepresentativeId);
        
        // Check if compliant
        const isCompliant = progress.compliance_status === 'compliant';
        
        if (!isCompliant) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Not Compliant',
                text: 'This representative has not met the CPD requirements yet. Generate certificate anyway?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Generate',
                cancelButtonText: 'Cancel'
            });
            
            if (!result.isConfirmed) return;
        }
        
        const certificateHtml = `
            <div style="max-width: 700px; margin: 0 auto; padding: 40px; border: 10px solid #5CBDB4; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);">
                <div style="text-align: center;">
                    <h1 style="color: #5CBDB4; font-size: 32px; margin: 0 0 10px 0;">CERTIFICATE OF CPD COMPLIANCE</h1>
                    <p style="color: #666; font-size: 14px;">Financial Advisory and Intermediary Services Act, 2002</p>
                    <hr style="border: 2px solid #5CBDB4; width: 100px; margin: 20px auto;">
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">This is to certify that</p>
                    <h2 style="color: #5CBDB4; font-size: 28px; margin: 10px 0;">${rep?.first_name || ''} ${rep?.surname || ''}</h2>
                    <p style="color: #666; font-size: 14px;">FSP Number: ${rep?.fsp_number_new || rep?.representative_number || 'N/A'}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 15px; color: #333; line-height: 1.8;">
                        has ${isCompliant ? '<strong style="color: #28a745;">SUCCESSFULLY COMPLETED</strong>' : '<strong style="color: #ffc107;">PARTIALLY COMPLETED</strong>'} 
                        the Continuing Professional Development requirements<br>
                        for the cycle period <strong>${new Date(cpdData.cycle?.start_date).toLocaleDateString('en-ZA')} - ${new Date(cpdData.cycle?.end_date).toLocaleDateString('en-ZA')}</strong>
                    </p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 30px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Total Hours Completed:</strong></td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;"><strong style="color: #5CBDB4; font-size: 18px;">${Math.round(parseFloat(progress.total_hours_logged || 0))} / ${cpdData.cycle?.required_hours || 18}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">Ethics Hours:</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${Math.round(parseFloat(progress.ethics_hours_logged || 0))} hours</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">Technical Hours:</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${Math.round(parseFloat(progress.technical_hours_logged || 0))} hours</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">Verifiable Hours:</td>
                            <td style="padding: 10px; text-align: right;">${Math.round(parseFloat(progress.verifiable_hours || 0))} hours</td>
                        </tr>
                    </table>
                </div>
                
                <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        Certificate generated on ${new Date().toLocaleDateString('en-ZA', {day: 'numeric', month: 'long', year: 'numeric'})}
                    </p>
                    <p style="color: #999; font-size: 11px; margin: 10px 0 0 0;">
                        This is a system-generated document
                    </p>
                </div>
            </div>
        `;
        
        Swal.fire({
            title: `${isCompliant ? '✅' : '⚠️'} CPD Compliance Certificate`,
            html: reportHtml,
            width: '900px',
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: '<i class="fas fa-print me-2"></i>Print Certificate',
            showCancelButton: true,
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                window.print();
            }
        });
        
    } catch (error) {
        console.error('Error generating certificate:', error);
        Swal.fire({
            icon: 'error',
            title: 'Certificate Generation Failed',
            text: error.message
        });
    }
}

/**
 * Generate Activity History Report
 */
async function generateActivityHistory() {
    try {
        if (!cpdData || !cpdData.selectedRepresentativeId) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Representative',
                text: 'Please select a representative first.'
            });
            return;
        }
        
        Swal.fire({
            title: 'Generating Report...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Get representative details
        const rep = cpdData.representatives.find(r => r.id === cpdData.selectedRepresentativeId);
        const activities = cpdData.activities || [];
        
        // Sort by date
        const sortedActivities = [...activities].sort((a, b) => 
            new Date(b.activity_date) - new Date(a.activity_date)
        );
        
        const reportHtml = `
            <div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #5CBDB4;">Activity History Report</h2>
                    <p>${rep?.first_name || ''} ${rep?.surname || ''} | ${cpdData.cycle?.cycle_name || 'All Cycles'}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead style="background: #5CBDB4; color: white;">
                        <tr>
                            <th style="padding: 12px; text-align: left;">Date</th>
                            <th style="padding: 12px; text-align: left;">Activity</th>
                            <th style="padding: 12px; text-align: left;">Provider</th>
                            <th style="padding: 12px; text-align: center;">Total</th>
                            <th style="padding: 12px; text-align: center;">Ethics</th>
                            <th style="padding: 12px; text-align: center;">Technical</th>
                            <th style="padding: 12px; text-align: center;">Type</th>
                            <th style="padding: 12px; text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedActivities.map(a => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px;">${new Date(a.activity_date).toLocaleDateString('en-ZA')}</td>
                                <td style="padding: 10px;">${a.activity_name || '-'}</td>
                                <td style="padding: 10px;">${a.provider_name || '-'}</td>
                                <td style="padding: 10px; text-align: center; font-weight: bold;">${a.total_hours || 0}</td>
                                <td style="padding: 10px; text-align: center;">${a.ethics_hours || 0}</td>
                                <td style="padding: 10px; text-align: center;">${a.technical_hours || 0}</td>
                                <td style="padding: 10px; text-align: center;">${a.verifiable ? 'Verifiable' : 'Non-ver.'}</td>
                                <td style="padding: 10px; text-align: center;">
                                    <span style="padding: 3px 8px; border-radius: 8px; background: ${a.status === 'verified' ? '#28a745' : a.status === 'pending' ? '#ffc107' : '#6c757d'}; color: white; font-size: 10px;">
                                        ${a.status || 'Draft'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                        ${activities.length === 0 ? '<tr><td colspan="8" style="padding: 30px; text-align: center; color: #999;">No activities logged</td></tr>' : ''}
                    </tbody>
                    <tfoot style="background: #f8f9fa; font-weight: bold;">
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right;">TOTALS:</td>
                            <td style="padding: 12px; text-align: center;">${activities.reduce((sum, a) => sum + (parseFloat(a.total_hours) || 0), 0).toFixed(1)}</td>
                            <td style="padding: 12px; text-align: center;">${activities.reduce((sum, a) => sum + (parseFloat(a.ethics_hours) || 0), 0).toFixed(1)}</td>
                            <td style="padding: 12px; text-align: center;">${activities.reduce((sum, a) => sum + (parseFloat(a.technical_hours) || 0), 0).toFixed(1)}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
                
                <p style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    Generated on ${new Date().toLocaleString('en-ZA')}
                </p>
            </div>
        `;
        
        Swal.fire({
            title: 'Activity History',
            html: reportHtml,
            width: '1000px',
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: '<i class="fas fa-print me-2"></i>Print',
            showCancelButton: true,
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                window.print();
            }
        });
        
    } catch (error) {
        console.error('Error generating activity history:', error);
        Swal.fire({
            icon: 'error',
            title: 'Report Generation Failed',
            text: error.message
        });
    }
}

// Export functions
window.generatePersonalSummary = generatePersonalSummary;
window.generateComplianceCertificate = generateComplianceCertificate;
window.generateActivityHistory = generateActivityHistory;

