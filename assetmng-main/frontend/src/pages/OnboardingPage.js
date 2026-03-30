import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { userAPI } from '../utils/api';
import styles from '../styles/ui.module.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    monthly_salary: '',
    monthly_expenses: '',
    savings_goal: '',
    time_frame: '',
    risk_profile: '',
    investment_types: []
  });

  const steps = [
    'Financial Information',
    'Investment Goals',
    'Risk Profile'
  ];

  const timeFrameOptions = [
    { value: 'short', label: 'Short Term (< 1 year)', description: 'Quick returns, higher liquidity' },
    { value: 'medium', label: 'Medium Term (1-5 years)', description: 'Balanced growth and stability' },
    { value: 'long', label: 'Long Term (5+ years)', description: 'Maximum growth potential' }
  ];

  const riskProfiles = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns', color: '#10B981' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return', color: '#0A84FF' },
    { value: 'aggressive', label: 'Aggressive', description: 'High risk, high returns', color: '#F59E0B' }
  ];

  const investmentTypes = [
    { value: 'stocks', label: 'Stocks', icon: '📈' },
    { value: 'mutual_funds', label: 'Mutual Funds', icon: '📊' },
    { value: 'bonds', label: 'Bonds', icon: '📜' },
    { value: 'fixed_deposits', label: 'Fixed Deposits', icon: '🏦' },
    { value: 'gold', label: 'Gold', icon: '✨' },
    { value: 'real_estate', label: 'Real Estate', icon: '🏠' }
  ];

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = () => {
    setError('');
    
    if (activeStep === 0) {
      if (!formData.monthly_salary || formData.monthly_salary <= 0) {
        setError('Please enter your monthly salary');
        return false;
      }
      if (!formData.monthly_expenses || formData.monthly_expenses < 0) {
        setError('Please enter your monthly expenses');
        return false;
      }
      if (parseFloat(formData.monthly_expenses) >= parseFloat(formData.monthly_salary)) {
        setError('Monthly expenses cannot exceed salary');
        return false;
      }
    }

    if (activeStep === 1) {
      if (!formData.time_frame) {
        setError('Please select an investment time frame');
        return false;
      }
      if (formData.investment_types.length === 0) {
        setError('Please select at least one investment type');
        return false;
      }
    }

    if (activeStep === 2) {
      if (!formData.risk_profile) {
        setError('Please select a risk profile');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Create expense object from monthly expenses
      const monthlyExpensesArray = formData.monthly_expenses > 0 ? [{
        category: 'Monthly Expenses',
        amount: parseFloat(formData.monthly_expenses),
        description: 'Total monthly expenses entered during onboarding'
      }] : [];

      const profileData = {
        monthly_salary: parseFloat(formData.monthly_salary),
        monthly_expenses: monthlyExpensesArray,
        savings_goal: formData.savings_goal ? parseFloat(formData.savings_goal) : 0,
        risk_profile: formData.risk_profile,
        time_frame: formData.time_frame
      };

      // Log what we're sending for debugging
      console.log('=== ONBOARDING DATA ===');
      console.log('Sending to backend:', JSON.stringify(profileData, null, 2));
      console.log('Salary:', profileData.monthly_salary);
      console.log('Expenses Array:', profileData.monthly_expenses);
      console.log('Savings Goal:', profileData.savings_goal);
      console.log('Risk Profile:', profileData.risk_profile);
      console.log('Time Frame:', profileData.time_frame);
      console.log('=====================');

      // Update user profile with onboarding data
      const response = await userAPI.updateProfile(profileData);
      console.log('Backend response:', response);

      // Mark onboarding as complete
      localStorage.setItem('onboarding_complete', 'true');

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Failed to save your information. Please try again.');
      setLoading(false);
    }
  };

  const toggleInvestmentType = (type) => {
    setFormData(prev => ({
      ...prev,
      investment_types: prev.investment_types.includes(type)
        ? prev.investment_types.filter(t => t !== type)
        : [...prev.investment_types, type]
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box className={`${styles.fadeIn}`}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <AccountBalance sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Let's understand your finances
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This helps us provide personalized investment recommendations
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monthly Salary"
                  type="number"
                  value={formData.monthly_salary}
                  onChange={(e) => setFormData({ ...formData, monthly_salary: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  placeholder="50000"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monthly Expenses"
                  type="number"
                  value={formData.monthly_expenses}
                  onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  placeholder="30000"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Savings Goal (Optional)"
                  type="number"
                  value={formData.savings_goal}
                  onChange={(e) => setFormData({ ...formData, savings_goal: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  placeholder="100000"
                  helperText="Target amount you want to save"
                />
              </Grid>

              {formData.monthly_salary && formData.monthly_expenses && (
                <Grid item xs={12}>
                  <Card className={styles.surface} sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Monthly Savings Potential
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      ₹{(parseFloat(formData.monthly_salary) - parseFloat(formData.monthly_expenses)).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className={`${styles.fadeIn}`}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <TrendingUp sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                What are your investment goals?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose your preferred time frame and investment types
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Investment Time Frame
              </Typography>
              <Grid container spacing={2}>
                {timeFrameOptions.map((option) => (
                  <Grid item xs={12} key={option.value}>
                    <Card
                      className={styles.glassCard}
                      sx={{
                        cursor: 'pointer',
                        border: formData.time_frame === option.value ? '2px solid' : '1px solid',
                        borderColor: formData.time_frame === option.value ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          borderColor: 'primary.light'
                        }
                      }}
                      onClick={() => setFormData({ ...formData, time_frame: option.value })}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box className={styles.flexBetween}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                          {formData.time_frame === option.value && (
                            <CheckCircle color="primary" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Preferred Investment Types
              </Typography>
              <Grid container spacing={2}>
                {investmentTypes.map((type) => (
                  <Grid item xs={6} sm={4} key={type.value}>
                    <Card
                      className={styles.glassCard}
                      sx={{
                        cursor: 'pointer',
                        border: formData.investment_types.includes(type.value) ? '2px solid' : '1px solid',
                        borderColor: formData.investment_types.includes(type.value) ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => toggleInvestmentType(type.value)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {type.icon}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {type.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box className={`${styles.fadeIn}`}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Security sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Choose your risk profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This determines how we balance risk and returns in your portfolio
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {riskProfiles.map((profile) => (
                <Grid item xs={12} key={profile.value}>
                  <Card
                    className={styles.glassCard}
                    sx={{
                      cursor: 'pointer',
                      border: formData.risk_profile === profile.value ? '2px solid' : '1px solid',
                      borderColor: formData.risk_profile === profile.value ? profile.color : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: profile.color
                      }
                    }}
                    onClick={() => setFormData({ ...formData, risk_profile: profile.value })}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box className={styles.flexBetween}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {profile.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {profile.description}
                          </Typography>
                        </Box>
                        {formData.risk_profile === profile.value && (
                          <CheckCircle sx={{ color: profile.color, fontSize: 32 }} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {formData.risk_profile && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  <Typography variant="body2">
                    <strong>Good choice!</strong> Based on your {formData.risk_profile} risk profile, 
                    we'll recommend a diversified portfolio that matches your comfort level.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        py: 6
      }}
    >
      <Container maxWidth="md">
        <Box className={`${styles.fadeIn} ${styles.mb6}`} sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome to FinanceAdvisor! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let's set up your personalized investment profile
          </Typography>
        </Box>

        <Card className={`${styles.statCard} ${styles.scaleIn}`}>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            {renderStepContent()}

            {loading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                  Setting up your profile...
                </Typography>
              </Box>
            )}

            <Box className={styles.flexBetween} sx={{ mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ 
                  px: 3,
                  borderRadius: '12px'
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  Complete Setup
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default OnboardingPage;
