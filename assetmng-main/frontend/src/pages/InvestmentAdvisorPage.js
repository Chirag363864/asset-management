import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Timeline,
  AccountBalance,
  ShowChart,
  ExpandMore,
  CheckCircle
} from '@mui/icons-material';
import styles from '../styles/ui.module.css';

const InvestmentAdvisorPage = () => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const durationOptions = [
    { value: '1', label: '1 Month', type: 'short' },
    { value: '3', label: '3 Months', type: 'short' },
    { value: '6', label: '6 Months', type: 'short' },
    { value: '12', label: '1 Year', type: 'medium' },
    { value: '24', label: '2 Years', type: 'medium' },
    { value: '36', label: '3 Years', type: 'medium' },
    { value: '60', label: '5 Years', type: 'long' },
    { value: '120', label: '10+ Years', type: 'long' }
  ];

  const investmentOptions = {
    short: [
      {
        name: 'Liquid Mutual Funds',
        description: 'Low risk, high liquidity',
        returns: '3-4%',
        risk: 'Very Low',
        liquidity: 'Instant',
        icon: '💧',
        color: '#10B981'
      },
      {
        name: 'Upcoming IPOs',
        description: 'New company listings',
        returns: '10-30%',
        risk: 'High',
        liquidity: '1-3 days',
        icon: '🚀',
        color: '#F59E0B'
      },
      {
        name: 'Short Term FD',
        description: 'Fixed guaranteed returns',
        returns: '5-6%',
        risk: 'Very Low',
        liquidity: 'Low',
        icon: '🏦',
        color: '#0A84FF'
      },
      {
        name: 'Arbitrage Funds',
        description: 'Market neutral strategy',
        returns: '4-5%',
        risk: 'Low',
        liquidity: 'Instant',
        icon: '⚖️',
        color: '#10B981'
      }
    ],
    medium: [
      {
        name: 'Balanced Mutual Funds',
        description: 'Equity + Debt mix',
        returns: '8-12%',
        risk: 'Moderate',
        liquidity: '1-2 days',
        icon: '📊',
        color: '#0A84FF'
      },
      {
        name: 'Blue Chip Stocks',
        description: 'Top company stocks',
        returns: '12-15%',
        risk: 'Moderate',
        liquidity: 'Instant',
        icon: '📈',
        color: '#0A84FF'
      },
      {
        name: 'Corporate Bonds',
        description: 'Fixed income securities',
        returns: '7-9%',
        risk: 'Low',
        liquidity: 'Moderate',
        icon: '📜',
        color: '#10B981'
      },
      {
        name: 'Gold ETF',
        description: 'Digital gold investment',
        returns: '8-10%',
        risk: 'Moderate',
        liquidity: 'Instant',
        icon: '✨',
        color: '#FFD166'
      },
      {
        name: 'Bank FD',
        description: 'Guaranteed returns',
        returns: '6-7%',
        risk: 'Very Low',
        liquidity: 'Low',
        icon: '🏦',
        color: '#0A84FF'
      }
    ],
    long: [
      {
        name: 'Equity Mutual Funds',
        description: 'Growth focused funds',
        returns: '12-18%',
        risk: 'High',
        liquidity: '1-2 days',
        icon: '📈',
        color: '#10B981'
      },
      {
        name: 'Index Funds',
        description: 'Market tracking funds',
        returns: '10-15%',
        risk: 'Moderate',
        liquidity: '1-2 days',
        icon: '📊',
        color: '#0A84FF'
      },
      {
        name: 'PPF',
        description: 'Tax saving, guaranteed',
        returns: '7-8%',
        risk: 'Very Low',
        liquidity: 'Very Low',
        icon: '🔒',
        color: '#10B981'
      },
      {
        name: 'Real Estate Funds',
        description: 'Property investment',
        returns: '10-12%',
        risk: 'Moderate',
        liquidity: 'Low',
        icon: '🏠',
        color: '#F59E0B'
      },
      {
        name: 'Small Cap Stocks',
        description: 'High growth potential',
        returns: '15-25%',
        risk: 'Very High',
        liquidity: 'Instant',
        icon: '🚀',
        color: '#F59E0B'
      },
      {
        name: 'NPS',
        description: 'Retirement planning',
        returns: '9-12%',
        risk: 'Low',
        liquidity: 'Very Low',
        icon: '🎯',
        color: '#0A84FF'
      }
    ]
  };

  const getRecommendations = () => {
    if (!amount || !duration) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const months = parseInt(duration);
      let category;
      
      if (months <= 6) category = 'short';
      else if (months <= 36) category = 'medium';
      else category = 'long';

      const options = investmentOptions[category];
      const investAmount = parseFloat(amount);

      // Calculate suggested allocation
      const allocation = options.map((option, index) => {
        const percentage = category === 'short' 
          ? [40, 30, 20, 10][index] || 0
          : category === 'medium'
          ? [25, 25, 20, 15, 15][index] || 0
          : [25, 20, 15, 15, 15, 10][index] || 0;
        
        const allocatedAmount = (investAmount * percentage) / 100;
        const minReturn = parseFloat(option.returns.split('-')[0]);
        const maxReturn = parseFloat(option.returns.split('-')[1] || minReturn);
        const avgReturn = (minReturn + maxReturn) / 2;
        const years = months / 12;
        const expectedReturns = allocatedAmount * (1 + (avgReturn / 100)) ** years - allocatedAmount;

        return {
          ...option,
          percentage,
          amount: allocatedAmount,
          expectedReturns: expectedReturns
        };
      }).filter(item => item.percentage > 0);

      setRecommendations({
        category,
        totalAmount: investAmount,
        duration: months,
        allocation
      });
      setLoading(false);
    }, 1000);
  };

  const getTotalExpectedReturns = () => {
    if (!recommendations) return 0;
    return recommendations.allocation.reduce((sum, item) => sum + item.expectedReturns, 0);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very Low': return '#10B981';
      case 'Low': return '#0A84FF';
      case 'Moderate': return '#FFD166';
      case 'High': return '#F59E0B';
      case 'Very High': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={`${styles.fadeIn} ${styles.mb6}`}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, var(--primary), var(--success))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Investment Advisor 💡
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get personalized investment recommendations based on your available funds
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid item xs={12} lg={4}>
            <Card className={`${styles.statCard} ${styles.slideInUp}`}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  <AttachMoney sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Enter Investment Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Investment Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    placeholder="50000"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Investment Duration</InputLabel>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      label="Investment Duration"
                    >
                      {durationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={getRecommendations}
                    disabled={!amount || !duration || loading}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ShowChart sx={{ mr: 1 }} />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                </Box>

                {amount && duration && (
                  <Box className={styles.surface} sx={{ p: 2, mt: 3 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Investment Summary
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      ₹{parseFloat(amount).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      for {durationOptions.find(d => d.value === duration)?.label}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations Section */}
          <Grid item xs={12} lg={8}>
            {!recommendations ? (
              <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay100}`}>
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Timeline sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Enter your investment details to get personalized recommendations
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box>
                {/* Summary Card */}
                <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay100} ${styles.mb6}`}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Investment Strategy
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box className={styles.surface} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Investment
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mt: 1 }}>
                            ₹{recommendations.totalAmount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box className={styles.surface} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main', mt: 1 }}>
                            {durationOptions.find(d => d.value === duration)?.label}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box className={styles.surface} sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' }}>
                          <Typography variant="caption" color="text.secondary">
                            Expected Returns
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mt: 1 }}>
                            ₹{getTotalExpectedReturns().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Allocation Table */}
                <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay200}`}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Recommended Portfolio Allocation
                    </Typography>

                    <Grid container spacing={2}>
                      {recommendations.allocation.map((item, index) => (
                        <Grid item xs={12} key={index}>
                          <Accordion
                            className={styles.surface}
                            sx={{
                              borderRadius: '12px !important',
                              '&:before': { display: 'none' },
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Box className={styles.flexBetween} sx={{ width: '100%', pr: 2 }}>
                                <Box className={styles.flexRow} sx={{ gap: 2, flex: 1 }}>
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: '12px',
                                      background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '1.5rem'
                                    }}
                                  >
                                    {item.icon}
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {item.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {item.description}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: item.color }}>
                                    ₹{item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </Typography>
                                  <Chip
                                    label={`${item.percentage}%`}
                                    size="small"
                                    sx={{
                                      background: `${item.color}20`,
                                      color: item.color,
                                      fontWeight: 600
                                    }}
                                  />
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Expected Returns
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {item.returns} p.a.
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Risk Level
                                  </Typography>
                                  <Chip
                                    label={item.risk}
                                    size="small"
                                    sx={{
                                      background: `${getRiskColor(item.risk)}20`,
                                      color: getRiskColor(item.risk),
                                      fontWeight: 600,
                                      mt: 0.5
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Liquidity
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {item.liquidity}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Projected Gain
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                                    ₹{item.expectedReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      ))}
                    </Grid>

                    <Alert severity="info" sx={{ mt: 3, borderRadius: '12px' }}>
                      <Typography variant="body2">
                        <strong>Note:</strong> These are AI-generated recommendations based on historical data. 
                        Actual returns may vary. Please consult a financial advisor before making investment decisions.
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestmentAdvisorPage;
