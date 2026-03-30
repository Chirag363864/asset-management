const calculateInvestmentRecommendations = (profile, expenses) => {
    if (!profile) {
        return { allocation: {}, disposableIncome: 0 };
    }

    const { monthly_salary, risk_tolerance, investment_horizon } = profile;

    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);
    const disposableIncome = parseFloat(monthly_salary || 0) - totalExpenses;

    let allocation = {
        'Fixed Deposits': 0,
        'Mutual Funds': 0,
        'Stocks': 0,
        'Gold': 0,
    };

    if (disposableIncome <= 0) {
        return { allocation, disposableIncome };
    }

    // Adjust allocation based on risk tolerance
    switch (risk_tolerance) {
        case 'low':
            allocation = { 'Fixed Deposits': 0.5, 'Mutual Funds': 0.3, 'Gold': 0.2, 'Stocks': 0 };
            break;
        case 'medium':
            allocation = { 'Fixed Deposits': 0.3, 'Mutual Funds': 0.4, 'Gold': 0.15, 'Stocks': 0.15 };
            break;
        case 'high':
            allocation = { 'Fixed Deposits': 0.1, 'Mutual Funds': 0.3, 'Gold': 0.1, 'Stocks': 0.5 };
            break;
        default:
            allocation = { 'Fixed Deposits': 0.3, 'Mutual Funds': 0.4, 'Gold': 0.15, 'Stocks': 0.15 };
            break;
    }

    // Adjust allocation based on investment horizon
    const horizonMap = {
        '<1 year': 0.8,
        '1-3 years': 0.9,
        '3-5 years': 1.0,
        '5-10 years': 1.1,
        '>10 years': 1.2
    };

    const horizonFactor = horizonMap[investment_horizon] || 1.0;

    // A more sophisticated model would be needed for a real application
    for (const key in allocation) {
        if (key === 'Stocks') {
            allocation[key] *= horizonFactor;
        } else {
            allocation[key] *= (2 - horizonFactor);
        }
    }

    // Normalize the allocation to sum to 1
    const totalAllocation = Object.values(allocation).reduce((acc, value) => acc + value, 0);
    if (totalAllocation > 0) {
        for (const key in allocation) {
            allocation[key] /= totalAllocation;
        }
    }

    return { allocation, disposableIncome };
};

export { calculateInvestmentRecommendations };