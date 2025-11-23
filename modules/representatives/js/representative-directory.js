// Representative Directory JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRepresentativeDirectory();
});

function initializeRepresentativeDirectory() {
    setupFilters();
    setupRepCards();
}

function setupFilters() {
    const filterInputs = document.querySelectorAll('#directory .form-select, #directory .form-control');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    console.log('Applying filters...');
    // Implementation would filter representative cards
}

function setupRepCards() {
    const repCards = document.querySelectorAll('.rep-card');
    repCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-primary, .btn-warning');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log('View representative profile');
            });
        }
    });
}

