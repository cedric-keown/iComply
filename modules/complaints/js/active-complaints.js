// Active Complaints JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeActiveComplaints();
});

function initializeActiveComplaints() {
    setupFilters();
    setupComplaintCards();
}

function setupFilters() {
    const filterInputs = document.querySelectorAll('#active .form-select, #active .form-control');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    console.log('Applying filters...');
    // Implementation would filter complaint cards
}

function setupComplaintCards() {
    const complaintCards = document.querySelectorAll('.complaint-card');
    complaintCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-primary');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                // Open complaint detail view
                console.log('View complaint details');
            });
        }
    });
}

