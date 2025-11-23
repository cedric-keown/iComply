// Client Portfolio JavaScript

let currentView = 'list';

function setPortfolioView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('[onclick*="setPortfolioView"]').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide views
    const listView = document.getElementById('portfolio-list-view');
    // Grid and table views would be shown/hidden here
    
    console.log('View changed to:', view);
}

window.setPortfolioView = setPortfolioView;

