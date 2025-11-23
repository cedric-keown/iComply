// Risk Assessment Calculator

function calculateRiskScore(answers) {
    let score = 0;
    
    // Geographic Risk (0-35 points)
    if (answers.geographicRisk === 'foreign') score += 15;
    if (answers.highRiskJurisdiction) {
        if (answers.jurisdictionType === 'business') score += 10;
        else if (answers.jurisdictionType === 'residential') score += 15;
        else if (answers.jurisdictionType === 'multiple') score += 20;
    }
    
    // Product/Service Risk (0-25 points)
    if (answers.products) {
        answers.products.forEach(product => {
            if (product === 'offshore') score += 20;
            else if (product === 'derivatives') score += 25;
            else if (product === 'investment') score += 10;
            else if (product === 'life') score += 5;
        });
    }
    
    if (answers.transactionVolume === 'low') score += 5;
    else if (answers.transactionVolume === 'medium') score += 10;
    else if (answers.transactionVolume === 'high') score += 15;
    else if (answers.transactionVolume === 'veryHigh') score += 25;
    
    // Customer Risk (0-30 points)
    if (answers.pepStatus === 'domestic') score += 25;
    else if (answers.pepStatus === 'foreign') score += 35;
    else if (answers.pepStatus === 'family') score += 20;
    else if (answers.pepStatus === 'associate') score += 15;
    
    if (answers.highRiskOccupation) {
        if (answers.occupationType === 'cash') score += 15;
        else if (answers.occupationType === 'arms') score += 25;
        else if (answers.occupationType === 'precious') score += 20;
        else if (answers.occupationType === 'remittance') score += 25;
        else if (answers.occupationType === 'crypto') score += 20;
    }
    
    // Channel Risk (0-10 points)
    if (answers.deliveryChannel === 'remoteSA') score += 5;
    else if (answers.deliveryChannel === 'remoteAbroad') score += 15;
    else if (answers.deliveryChannel === 'intermediary') score += 10;
    
    if (answers.paymentMethod === 'credit') score += 5;
    else if (answers.paymentMethod === 'cash') score += 20;
    else if (answers.paymentMethod === 'crypto') score += 25;
    else if (answers.paymentMethod === 'thirdParty') score += 15;
    
    // Additional Factors (0-30 points)
    if (answers.complexity === 'moderate') score += 10;
    else if (answers.complexity === 'complex') score += 20;
    else if (answers.complexity === 'veryComplex') score += 30;
    
    if (answers.sourceOfWealth === 'partial') score += 10;
    else if (answers.sourceOfWealth === 'unclear') score += 25;
    
    if (answers.adverseMedia === 'minor') score += 10;
    else if (answers.adverseMedia === 'significant') score += 30;
    
    // Cap at 100
    score = Math.min(score, 100);
    
    // Classify risk
    let riskLevel, dueDiligence, reviewFrequency;
    if (score <= 25) {
        riskLevel = 'LOW RISK (SDD)';
        dueDiligence = 'Simplified Due Diligence';
        reviewFrequency = '5 years';
    } else if (score <= 50) {
        riskLevel = 'STANDARD RISK (CDD)';
        dueDiligence = 'Customer Due Diligence';
        reviewFrequency = '1 year';
    } else {
        riskLevel = 'HIGH RISK (EDD)';
        dueDiligence = 'Enhanced Due Diligence';
        reviewFrequency = 'Quarterly (3 months)';
    }
    
    return {
        score: score,
        riskLevel: riskLevel,
        dueDiligence: dueDiligence,
        reviewFrequency: reviewFrequency
    };
}

window.calculateRiskScore = calculateRiskScore;

