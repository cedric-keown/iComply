// Retention Manager JavaScript - Database Integrated

document.addEventListener('DOMContentLoaded', function() {
    initializeRetentionManager();
});

async function initializeRetentionManager() {
    const retentionTab = document.getElementById('retention-tab');
    if (retentionTab) {
        retentionTab.addEventListener('shown.bs.tab', function() {
            loadRetentionData();
        });
    }
    
    setupRetentionTabs();
}

async function loadRetentionData() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all documents
        const result = await dataFunctionsToUse.getDocuments(null, null, null, null);
        let documents = result;
        if (result && result.data) {
            documents = result.data;
        } else if (result && Array.isArray(result)) {
            documents = result;
        }
        
        // Filter documents by retention status
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const expiringSoon = (documents || []).filter(doc => {
            if (!doc.expiry_date || !doc.delete_after_date) return false;
            const deleteDate = new Date(doc.delete_after_date);
            return deleteDate >= today && deleteDate <= thirtyDaysFromNow;
        });
        
        const expired = (documents || []).filter(doc => {
            if (!doc.delete_after_date) return false;
            return new Date(doc.delete_after_date) < today;
        });
        
        const readyForDeletion = (documents || []).filter(doc => {
            if (!doc.delete_after_date) return false;
            const deleteDate = new Date(doc.delete_after_date);
            const daysPast = Math.floor((today - deleteDate) / (1000 * 60 * 60 * 24));
            return daysPast >= 0 && daysPast <= 30; // Within 30 days past deletion date
        });
        
        // Calculate stats
        const activeDocs = (documents || []).filter(doc => doc.status === 'active' || !doc.status).length;
        const holdDocs = (documents || []).filter(doc => doc.status === 'hold' || doc.status === 'legal_hold').length;
        
        // Update retention stats
        const activeCountEl = document.getElementById('retentionActiveCount');
        if (activeCountEl) activeCountEl.textContent = activeDocs;
        
        const expiringCountEl = document.getElementById('retentionExpiringCount');
        if (expiringCountEl) expiringCountEl.textContent = expiringSoon.length;
        
        const eligibleCountEl = document.getElementById('retentionEligibleCount');
        if (eligibleCountEl) eligibleCountEl.textContent = readyForDeletion.length;
        
        const holdCountEl = document.getElementById('retentionHoldCount');
        if (holdCountEl) holdCountEl.textContent = holdDocs;
        
        renderRetentionData({
            expiringSoon,
            expired,
            readyForDeletion,
            total: documents.length
        });
        
    } catch (error) {
        console.error('Error loading retention data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load retention data'
        });
    }
}

function renderRetentionData(data) {
    // Update expiring soon section
    const expiringContainer = document.querySelector('#retention [data-retention="expiring"]');
    if (expiringContainer) {
        if (data.expiringSoon.length === 0) {
            expiringContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>No documents expiring in the next 30 days
                </div>
            `;
        } else {
            expiringContainer.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Category</th>
                                <th>Delete After</th>
                                <th>Days Remaining</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.expiringSoon.map(doc => {
                                const deleteDate = new Date(doc.delete_after_date);
                                const today = new Date();
                                const daysRemaining = Math.ceil((deleteDate - today) / (1000 * 60 * 60 * 24));
                                
                                return `
                                    <tr>
                                        <td>${doc.document_name}</td>
                                        <td><span class="badge bg-primary">${doc.document_category || 'N/A'}</span></td>
                                        <td>${deleteDate.toLocaleDateString('en-ZA')}</td>
                                        <td><span class="badge ${daysRemaining <= 7 ? 'bg-danger' : 'bg-warning'}">${daysRemaining} days</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="extendRetentionHold('${doc.id}')">Extend Hold</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    // Update expired section
    const expiredContainer = document.querySelector('#retention [data-retention="expired"]');
    if (expiredContainer) {
        if (data.expired.length === 0) {
            expiredContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>No expired documents
                </div>
            `;
        } else {
            expiredContainer.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Category</th>
                                <th>Delete After</th>
                                <th>Days Overdue</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.expired.map(doc => {
                                const deleteDate = new Date(doc.delete_after_date);
                                const today = new Date();
                                const daysOverdue = Math.floor((today - deleteDate) / (1000 * 60 * 60 * 24));
                                
                                return `
                                    <tr>
                                        <td>${doc.document_name}</td>
                                        <td><span class="badge bg-primary">${doc.document_category || 'N/A'}</span></td>
                                        <td>${deleteDate.toLocaleDateString('en-ZA')}</td>
                                        <td><span class="badge bg-danger">${daysOverdue} days overdue</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="extendRetentionHold('${doc.id}')">Extend Hold</button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument('${doc.id}')">Delete</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    // Update ready for deletion section
    const readyContainer = document.querySelector('#retention [data-retention="ready"]');
    if (readyContainer) {
        if (data.readyForDeletion.length === 0) {
            readyContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>No documents ready for deletion
                </div>
            `;
        } else {
            readyContainer.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Category</th>
                                <th>Delete After</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.readyForDeletion.map(doc => {
                                return `
                                    <tr>
                                        <td>${doc.document_name}</td>
                                        <td><span class="badge bg-primary">${doc.document_category || 'N/A'}</span></td>
                                        <td>${new Date(doc.delete_after_date).toLocaleDateString('en-ZA')}</td>
                                        <td><span class="badge bg-success">✅ Ready for deletion</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument('${doc.id}')">Delete</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
}

function setupRetentionTabs() {
    // Handle retention tab navigation
    const retentionTabs = document.querySelectorAll('#retentionTabs button');
    retentionTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target');
            loadRetentionData();
        });
    });
}

async function extendRetentionHold(documentId) {
    const { value: reason } = await Swal.fire({
        title: 'Extend Retention Hold',
        input: 'text',
        inputLabel: 'Reason for extension',
        inputPlaceholder: 'Enter reason...',
        showCancelButton: true,
        confirmButtonText: 'Extend Hold',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'Please provide a reason for extending the retention hold';
            }
        }
    });
    
    if (reason) {
        try {
            const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                ? dataFunctions 
                : (window.dataFunctions || window.parent?.dataFunctions);
            
            if (!dataFunctionsToUse) {
                throw new Error('dataFunctions is not available');
            }
            
            // Update document to extend retention
            // Calculate new delete_after_date (add 1 year)
            const today = new Date();
            const newDeleteDate = new Date(today);
            newDeleteDate.setFullYear(today.getFullYear() + 1);
            
            await dataFunctionsToUse.updateDocument(documentId, {
                delete_after_date: newDeleteDate.toISOString().split('T')[0],
                description: reason // Store reason in description or use a separate field
            });
            
            Swal.fire('Success', 'Retention hold extended', 'success');
            loadRetentionData();
            
        } catch (error) {
            console.error('Error extending retention hold:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to extend retention hold'
            });
        }
    }
}

async function deleteDocument(documentId) {
    const result = await Swal.fire({
        title: 'Delete Document?',
        text: 'Are you sure you want to permanently delete this document?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
        // Show confirmation checklist
        const checklistResult = await Swal.fire({
            title: 'Deletion Checklist',
            html: `
                <div class="text-start">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check1">
                        <label class="form-check-label" for="check1">No active legal proceedings</label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check2">
                        <label class="form-check-label" for="check2">No ongoing disputes</label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check3">
                        <label class="form-check-label" for="check3">Compliance officer approval obtained</label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirm Deletion',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const check1 = document.getElementById('check1').checked;
                const check2 = document.getElementById('check2').checked;
                const check3 = document.getElementById('check3').checked;
                if (!check1 || !check2 || !check3) {
                    Swal.showValidationMessage('Please confirm all items');
                    return false;
                }
                return true;
            }
        });
        
        if (checklistResult.isConfirmed) {
            try {
                const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
                    ? dataFunctions 
                    : (window.dataFunctions || window.parent?.dataFunctions);
                
                if (!dataFunctionsToUse) {
                    throw new Error('dataFunctions is not available');
                }
                
                await dataFunctionsToUse.deleteDocument(documentId);
                
                Swal.fire('Deleted!', 'Document has been deleted.', 'success');
                loadRetentionData();
                
                // Reload document library if it's loaded
                if (typeof loadDocuments === 'function') {
                    loadDocuments();
                }
                
            } catch (error) {
                console.error('Error deleting document:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete document'
                });
            }
        }
    }
}

// Export for global access
window.extendRetentionHold = extendRetentionHold;
window.deleteDocument = deleteDocument;

