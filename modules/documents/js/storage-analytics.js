// Storage Analytics JavaScript - Database Integrated

document.addEventListener('DOMContentLoaded', function() {
    initializeStorageAnalytics();
});

// Store chart instance globally to prevent conflicts
let storageCategoryChartInstance = null;
let chartInitializationInProgress = false;

async function initializeStorageAnalytics() {
    const storageTab = document.getElementById('storage-tab');
    if (storageTab) {
        storageTab.addEventListener('shown.bs.tab', function() {
            loadStorageAnalytics();
        });
        
        // Also load if tab is already active
        if (storageTab.classList.contains('active')) {
            loadStorageAnalytics();
        }
    }
}

async function loadStorageAnalytics() {
    try {
        // First, ensure any existing chart is destroyed before loading new data
        const ctx = document.getElementById('storageCategoryChart');
        if (ctx) {
            // Destroy stored instance
            if (storageCategoryChartInstance) {
                try {
                    storageCategoryChartInstance.destroy();
                } catch (e) {
                    console.warn('Error destroying stored chart instance:', e);
                }
                storageCategoryChartInstance = null;
            }
            
            // Destroy any Chart.js registered instance
            try {
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {
                    existingChart.destroy();
                }
            } catch (e) {
                console.warn('Error destroying Chart.js registered chart:', e);
            }
            
            // Clear canvas
            try {
                const context = ctx.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, ctx.width || ctx.clientWidth || 400, ctx.height || ctx.clientHeight || 200);
                }
            } catch (e) {
                console.warn('Error clearing canvas:', e);
            }
        }
        
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all documents to calculate storage
        const result = await dataFunctionsToUse.getDocuments(null, null, null, null);
        let documents = result;
        if (result && result.data) {
            documents = result.data;
        } else if (result && Array.isArray(result)) {
            documents = result;
        }
        
        documents = documents || [];
        
        // Calculate total storage
        const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0);
        const totalSizeGB = totalSize / (1024 * 1024 * 1024);
        const maxSizeGB = 10;
        const percentUsed = Math.min((totalSizeGB / maxSizeGB) * 100, 100);
        
        // Update storage display
        const storageTotalEl = document.getElementById('storageTotalDisplay');
        if (storageTotalEl) {
            storageTotalEl.textContent = `${totalSizeGB.toFixed(2)} GB / ${maxSizeGB} GB`;
        }
        
        const storageStatusEl = document.getElementById('storageStatus');
        if (storageStatusEl) {
            if (percentUsed >= 90) {
                storageStatusEl.textContent = '⚠️ Storage nearly full';
                storageStatusEl.className = 'text-danger';
            } else if (percentUsed >= 75) {
                storageStatusEl.textContent = '⚠️ Storage getting full';
                storageStatusEl.className = 'text-warning';
            } else {
                storageStatusEl.textContent = '✅ Sufficient storage';
                storageStatusEl.className = 'text-success';
            }
        }
        
        // Update storage progress circle
        const progressCircle = document.querySelector('#storage .progress-circle-large circle.progress-bar');
        if (progressCircle) {
            const circumference = 2 * Math.PI * 65;
            const offset = circumference - (percentUsed / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        const progressText = document.querySelector('#storage .progress-text-large');
        if (progressText) {
            progressText.textContent = Math.round(percentUsed) + '%';
        }
        
        // Calculate storage by category
        const categoryStorage = {};
        documents.forEach(doc => {
            const cat = doc.document_category || 'Other';
            categoryStorage[cat] = (categoryStorage[cat] || 0) + (doc.file_size_bytes || 0);
        });
        
        // Update storage by category chart (with delay to ensure canvas is ready)
        setTimeout(() => {
            updateStorageCategoryChart(categoryStorage);
        }, 200);
        
        // Calculate storage by user (if uploaded_by is available)
        const userStorage = {};
        documents.forEach(doc => {
            const userId = doc.uploaded_by || 'unknown';
            userStorage[userId] = userStorage[userId] || { size: 0, count: 0 };
            userStorage[userId].size += (doc.file_size_bytes || 0);
            userStorage[userId].count += 1;
        });
        
        // Update storage by user table
        renderStorageByUser(userStorage);
        
    } catch (error) {
        console.error('Error loading storage analytics:', error);
        const container = document.getElementById('storageByUserContainer');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load storage analytics data.
                </div>
            `;
        }
    }
}

function updateStorageCategoryChart(categoryStorage) {
    // Prevent multiple simultaneous chart initializations
    if (chartInitializationInProgress) {
        console.warn('Chart initialization already in progress, skipping');
        return;
    }
    
    const ctx = document.getElementById('storageCategoryChart');
    if (!ctx || typeof Chart === 'undefined') {
        console.warn('Chart canvas or Chart.js not available');
        return;
    }
    
    // Ensure the canvas is actually visible (not in a hidden tab)
    const storageTab = document.getElementById('storage');
    if (storageTab && !storageTab.classList.contains('active') && !storageTab.classList.contains('show')) {
        console.warn('Storage tab is not active, skipping chart creation');
        return;
    }
    
    chartInitializationInProgress = true;
    
    // Wait a bit to ensure any pending chart operations complete
    // This helps prevent race conditions
    setTimeout(() => {
        // Destroy existing chart instance if it exists
        if (storageCategoryChartInstance) {
            try {
                storageCategoryChartInstance.destroy();
                storageCategoryChartInstance = null;
            } catch (e) {
                console.warn('Error destroying stored chart instance:', e);
            }
        }
        
        // Also check Chart.js's internal registry and destroy
        try {
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }
        } catch (e) {
            console.warn('Error destroying Chart.js registered chart:', e);
        }
        
        // Clear the canvas context completely
        try {
            const context = ctx.getContext('2d');
            if (context) {
                // Get actual canvas dimensions
                const width = ctx.width || ctx.clientWidth || 400;
                const height = ctx.height || ctx.clientHeight || 200;
                context.clearRect(0, 0, width, height);
            }
        } catch (e) {
            console.warn('Error clearing canvas:', e);
        }
        
        const labels = Object.keys(categoryStorage);
        const data = Object.values(categoryStorage).map(bytes => parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(2)));
        
        // Create new chart instance
        try {
            storageCategoryChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels.length > 0 ? labels : ['No Data'],
                    datasets: [{
                        data: data.length > 0 ? data : [1],
                        backgroundColor: [
                            '#5CBDB4',
                            '#17A2B8',
                            '#28A745',
                            '#FFC107',
                            '#DC3545',
                            '#6c757d',
                            '#007bff',
                            '#6610f2'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + ' GB';
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating storage category chart:', error);
            storageCategoryChartInstance = null;
            // Show error message in the chart container
            const chartContainer = ctx.closest('.card-body');
            if (chartContainer) {
                chartContainer.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Unable to display chart. Please refresh the page.
                    </div>
                `;
            }
        }
        
        chartInitializationInProgress = false;
    }, 100); // Small delay to ensure previous operations complete
}

function renderStorageByUser(userStorage) {
    const container = document.getElementById('storageByUserContainer');
    if (!container) return;
    
    const userEntries = Object.entries(userStorage);
    if (userEntries.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No user storage data available.
            </div>
        `;
        return;
    }
    
    // Sort by size (largest first)
    userEntries.sort((a, b) => b[1].size - a[1].size);
    
    const totalSize = userEntries.reduce((sum, [, data]) => sum + data.size, 0);
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Documents</th>
                        <th>Storage Used</th>
                        <th>% of Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${userEntries.map(([userId, data]) => {
                        const sizeGB = (data.size / (1024 * 1024 * 1024)).toFixed(2);
                        const percent = totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : 0;
                        const displayName = userId === 'unknown' ? 'Unknown' : `User ${userId.substring(0, 8)}`;
                        
                        return `
                            <tr>
                                <td>${displayName}</td>
                                <td>${data.count}</td>
                                <td>${sizeGB} GB</td>
                                <td>${percent}%</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Export for global access
window.loadStorageAnalytics = loadStorageAnalytics;

