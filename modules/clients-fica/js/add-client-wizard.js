// Add Client Wizard JavaScript

// Listen for postMessage to switch tabs (from Quick Actions)
window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'switchTab') {
        const tabId = event.data.tab;
        const tabButton = document.getElementById(tabId);
        if (tabButton) {
            tabButton.click();
        }
    }
});

let currentStep = 1;
const totalSteps = 7;
let clientType = null;
let wizardData = {};

function selectClientType(type) {
    clientType = type;
    document.getElementById('client-type-selection').style.display = 'none';
    document.getElementById('client-wizard').style.display = 'block';
    updateWizardProgress(1);
    
    // Show step 1
    document.getElementById('step-1').classList.add('active');
}

function nextStep(step) {
    if (step <= totalSteps) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        
        // Show next step
        currentStep = step;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        updateWizardProgress(step);
    }
}

function previousStep() {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        updateWizardProgress(currentStep);
    } else {
        // Return to client type selection
        document.getElementById('client-type-selection').style.display = 'block';
        document.getElementById('client-wizard').style.display = 'none';
    }
}

function updateWizardProgress(step) {
    const percentage = (step / totalSteps) * 100;
    const progressBar = document.getElementById('wizard-progress');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.textContent = `Step ${step} of ${totalSteps}`;
    }
    
    // Update step indicators
    document.querySelectorAll('.wizard-steps .step').forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

/**
 * Save Step Data
 */
function saveStepData(step) {
    const stepEl = document.getElementById(`step-${step}`);
    if (!stepEl) return;
    
    // Collect data from step based on step number
    // This is a simplified version - would need to be expanded based on actual form fields
    if (step === 1) {
        wizardData.title = stepEl.querySelector('select')?.value || null;
        wizardData.first_name = stepEl.querySelectorAll('input[type="text"]')[0]?.value || null;
        wizardData.last_name = stepEl.querySelectorAll('input[type="text"]')[1]?.value || null;
        wizardData.date_of_birth = stepEl.querySelector('input[type="date"]')?.value || null;
    }
    // Add more steps as needed
}

/**
 * Submit Client
 */
async function submitClient() {
    try {
        // Collect all wizard data
        for (let i = 1; i <= totalSteps; i++) {
            saveStepData(i);
        }
        
        // Prepare client data
        const clientData = {
            client_type: clientType,
            title: wizardData.title,
            first_name: wizardData.first_name,
            last_name: wizardData.last_name,
            date_of_birth: wizardData.date_of_birth,
            id_number: wizardData.id_number,
            email: wizardData.email,
            phone: wizardData.phone,
            mobile: wizardData.mobile,
            client_since: new Date().toISOString().split('T')[0],
            risk_category: wizardData.risk_category || 'low',
            assigned_representative_id: wizardData.assigned_representative_id || null
        };
        
        // Show loading
        Swal.fire({
            title: 'Creating Client...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Submit to database
        const result = await dataFunctions.createClient(clientData);
        
        let response = result;
        if (result && result.data) {
            response = result.data;
        } else if (result && typeof result === 'object' && result.success !== undefined) {
            response = result;
        }
        
        if (response && response.success !== false && !response.error) {
            Swal.fire({
                icon: 'success',
                title: 'Client Created!',
                text: 'Client has been created successfully.',
                confirmButtonText: 'OK'
            }).then(() => {
                // Switch to portfolio tab
                if (typeof switchClientsFicaTab === 'function') {
                    switchClientsFicaTab('portfolio-tab');
                }
                // Reload portfolio
                if (typeof loadClientPortfolio === 'function') {
                    loadClientPortfolio();
                }
                // Reset wizard
                resetWizard();
            });
        } else {
            throw new Error(response?.error || 'Failed to create client');
        }
    } catch (error) {
        console.error('Error creating client:', error);
        Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: error.message || 'Failed to create client. Please try again.'
        });
    }
}

/**
 * Reset Wizard
 */
function resetWizard() {
    currentStep = 1;
    clientType = null;
    wizardData = {};
    document.getElementById('client-type-selection').style.display = 'block';
    document.getElementById('client-wizard').style.display = 'none';
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step-1').classList.add('active');
    updateWizardProgress(1);
}

window.selectClientType = selectClientType;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.submitClient = submitClient;

