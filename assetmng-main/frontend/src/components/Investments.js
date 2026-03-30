import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Button,
    Grid 
} from '@mui/material';
import { calculateInvestmentRecommendations } from '../services/investmentService';

const Investments = ({ profile, expenses }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState({ allocation: {}, disposableIncome: 0 });

    useEffect(() => {
        if (profile && expenses) {
            const result = calculateInvestmentRecommendations(profile, expenses);
            setRecommendations(result);
        }
    }, [profile, expenses]);

    // Dummy data for testing if props are not provided
    const testProfile = {
        monthly_salary: 5000,
        risk_tolerance: 'medium',
        investment_horizon: '5-10 years'
    };
    const testExpenses = [
        { amount: 1500 },
        { amount: 500 }
    ];

    const finalProfile = profile || testProfile;
    const finalExpenses = expenses || testExpenses;

    useEffect(() => {
        const result = calculateInvestmentRecommendations(finalProfile, finalExpenses);
        setRecommendations(result);
    }, [finalProfile, finalExpenses]);


    return (
        <Container>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Investment Portfolio
                </Typography>
                <Typography variant="h6">
                    Disposable Income: ${recommendations.disposableIncome.toFixed(2)}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Recommended Investments
                        </Typography>
                    </Grid>
                    {Object.entries(recommendations.allocation).map(([asset, percentage]) => (
                        percentage > 0 && (
                            <Grid item xs={12} md={4} key={asset}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="subtitle1">{asset}</Typography>
                                    <Typography variant="body2">
                                        Recommended allocation: {(percentage * 100).toFixed(2)}%
                                    </Typography>
                                </Paper>
                            </Grid>
                        )
                    ))}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/dashboard')}
                            sx={{ mt: 2 }}
                        >
                            Back to Dashboard
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Investments;