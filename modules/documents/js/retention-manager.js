// Retention Manager JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRetentionManager();
});

function initializeRetentionManager() {
    setupRetentionTabs();
    calculateRetentionDates();
}

function setupRetentionTabs() {
    // Handle retention tab navigation
    const retentionTabs = document.querySelectorAll('#retentionTabs button');
    retentionTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target');
            loadRetentionData(targetId);
        });
    });
}

function loadRetentionData(tabId) {
    console.log('Loading retention data for:', tabId);
    // Implementation would load data for the selected tab
}

function calculateRetentionDates() {
    // Calculate retention dates for all documents
    const retentionInfo = document.querySelectorAll('.retention-info');
    retentionInfo.forEach(info => {
        // Calculate and display retention information
    });
}

function extendRetentionHold(documentId) {
    Swal.fire({
        title: 'Extend Retention Hold',
        input: 'text',
        inputLabel: 'Reason for extension',
        inputPlaceholder: 'Enter reason...',
        showCancelButton: true,
        confirmButtonText: 'Extend Hold',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Success', 'Retention hold extended', 'success');
        }
    });
}

function deleteDocument(documentId) {
    Swal.fire({
        title: 'Delete Document?',
        text: 'Are you sure you want to permanently delete this document?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Show confirmation checklist
            Swal.fire({
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
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Deleted!', 'Document has been deleted.', 'success');
                }
            });
        }
    });
}

