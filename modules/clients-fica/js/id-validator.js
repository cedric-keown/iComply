// SA ID Number Validator

function validateSAID(idNumber) {
    // Remove spaces and non-digits
    idNumber = idNumber.replace(/\D/g, '');
    
    // Check length
    if (idNumber.length !== 13) {
        return { valid: false, error: 'ID number must be 13 digits' };
    }
    
    // Extract components
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));
    const gender = parseInt(idNumber.substring(6, 10));
    const citizenship = parseInt(idNumber.substring(10, 11));
    const checksum = parseInt(idNumber.substring(12, 13));
    
    // Validate date
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return { valid: false, error: 'Invalid date in ID number' };
    }
    
    // Luhn algorithm for checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        let digit = parseInt(idNumber[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    
    const calculatedChecksum = (10 - (sum % 10)) % 10;
    
    if (calculatedChecksum !== checksum) {
        return { valid: false, error: 'Invalid checksum' };
    }
    
    // Extract date of birth
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    const dateOfBirth = new Date(fullYear, month - 1, day);
    
    return {
        valid: true,
        dateOfBirth: dateOfBirth,
        gender: gender < 5000 ? 'Female' : 'Male',
        citizenship: citizenship === 0 ? 'SA Citizen' : 'Permanent Resident'
    };
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const idInputs = document.querySelectorAll('input[type="text"][placeholder*="ID"], input[name*="id"]');
    idInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const result = validateSAID(this.value);
            if (!result.valid) {
                this.classList.add('is-invalid');
                // Show error message
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
});

window.validateSAID = validateSAID;

