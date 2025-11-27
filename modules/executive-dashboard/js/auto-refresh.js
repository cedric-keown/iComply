// Auto-Refresh JavaScript

let refreshInterval = 5 * 60 * 1000; // 5 minutes
let refreshTimer;

function startAutoRefresh() {
    refreshTimer = setInterval(() => {
        refreshDashboardData();
    }, refreshInterval);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
}

async function refreshDashboardData() {
    // Update last refresh time
    const now = new Date();
    const formatted = formatDateTime(now);
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = formatted;
    }
    
    // Fetch fresh data from the API
    if (typeof window.loadDashboardData === 'function') {
        await window.loadDashboardData();
    } else {
        console.log('Auto-refreshing dashboard data...');
    }
}

// Start auto-refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    startAutoRefresh();
});

// Stop auto-refresh when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
    }
});

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

