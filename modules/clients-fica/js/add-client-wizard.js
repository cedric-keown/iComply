// Add Client Wizard JavaScript

let currentStep = 1;
const totalSteps = 7;

function selectClientType(type) {
    document.getElementById('client-type-selection').style.display = 'none';
    document.getElementById('client-wizard').style.display = 'block';
    updateWizardProgress(1);
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

window.selectClientType = selectClientType;
window.nextStep = nextStep;
window.previousStep = previousStep;

