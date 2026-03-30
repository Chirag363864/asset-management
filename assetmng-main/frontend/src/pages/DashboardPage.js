import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { userAPI, investmentAPI, stockAPI } from '../utils/api';
import styles from '../styles/ui.module.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({ time_frame: 'medium', risk_profile: 'moderate' });
  const [totalExpenses, setTotalExpenses] = useState('');
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, stocksRes] = await Promise.all([
        userAPI.getFinancialProfile(),
        stockAPI.getLiveStocks()
      ]);
      
      setProfile(profileRes.data);
      setStocks(stocksRes.data.stocks || []);
      
      if (profileRes.data.monthly_salary > 0) {
        const recommendationsRes = await investmentAPI.getRecommendations();
        setRecommendations(recommendationsRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    setUpdateLoading(true);
    try {
      await userAPI.updateProfile(updateData);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateExpensesSummary = async () => {
    if (!totalExpenses) return;
    
    try {
      const response = await fetch('http://localhost:8000/users/expenses-summary', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ total_expenses: parseFloat(totalExpenses) })
      });
      
      if (response.ok) {
        await fetchDashboardData();
        setTotalExpenses('');
      }
    } catch (error) {
      console.error('Error updating expenses:', error);
    }
  };

  const updateInvestmentPreferences = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/investment-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          time_frame: preferences.time_frame,
          risk_profile: preferences.risk_profile
        })
      });
      
      if (response.ok) {
        await fetchDashboardData();
        setShowPreferences(false);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const addExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return;
    
    try {
      await userAPI.addExpense({
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description
      });
      setNewExpense({ category: '', amount: '', description: '' });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={`${styles.pageContainer} page-enter`}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Financial Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Financial Overview */}
        <Grid item xs={12} md={8}>
          <Card className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Overview
            </Typography>
            {profile && (
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      ₹{profile.monthly_salary?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Salary
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error">
                      ₹{profile.total_expenses?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Expenses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      ₹{profile.disposable_income?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available Income
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      ₹{profile.savings_goal?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Savings Goal
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>

        {/* Quick Update Form */}
        <Grid item xs={12} md={4}>
          <Card className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Financial Info
            </Typography>
            <TextField
              fullWidth
              label="Monthly Salary"
              type="number"
              defaultValue={profile?.monthly_salary || 0}
              onBlur={(e) => {
                if (e.target.value !== profile?.monthly_salary?.toString()) {
                  updateProfile({ monthly_salary: parseFloat(e.target.value) });
                }
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Monthly Expenses"
              type="number"
              value={totalExpenses}
              onChange={(e) => setTotalExpenses(e.target.value)}
              onBlur={updateExpensesSummary}
              placeholder={profile?.total_expenses?.toString() || "0"}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowPreferences(true)}
              sx={{ mb: 2 }}
            >
              Set Investment Preferences
            </Button>
            <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Available for Investment: ₹{profile?.available_for_investment?.toLocaleString() || 0}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Investment Recommendations */}
        {recommendations && recommendations.has_recommendations && (
          <Grid item xs={12} md={8}>
            <Card 
              className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} 
              sx={{ 
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(10, 132, 255, 0.2)'
                }
              }}
              onClick={() => setChartDialogOpen(true)}
            >
              <Box className={styles.flexBetween} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personalized Investment Recommendations
                </Typography>
                <Chip 
                  label="Click to expand" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(10, 132, 255, 0.1)',
                    color: 'primary.main'
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {recommendations.message}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Available Amount: ₹{recommendations.available_amount?.toLocaleString()} 
                ({recommendations.money_range} investor category)
              </Typography>
              <Box className={styles.chartSurface}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={recommendations.recommendations}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => 
                        showAmounts 
                          ? `${category}: ₹${recommendations.recommendations.find(r => r.category === category)?.amount?.toLocaleString()}`
                          : `${category} (${percentage}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      onClick={() => setShowAmounts(!showAmounts)}
                    >
                      {recommendations.recommendations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAmounts(!showAmounts);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  {showAmounts ? 'Show Percentages' : 'Show Amounts'}
                </Button>
              </Box>
            </Card>
          </Grid>
        )}

        {recommendations && !recommendations.has_recommendations && (
          <Grid item xs={12} md={8}>
            <Card className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Investment Recommendations
              </Typography>
              <Alert severity="info">
                {recommendations.message}
              </Alert>
            </Card>
          </Grid>
        )}

        {/* Expense Tracking */}
        <Grid item xs={12} md={4}>
            <Card className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Expense
            </Typography>
            <TextField
              fullWidth
              label="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={addExpense}>
              Add Expense
            </Button>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Expenses:
              </Typography>
              {profile?.monthly_expenses?.map((expense, index) => (
                <Chip
                  key={index}
                  label={`${expense.category}: ₹${expense.amount}`}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Live Stocks */}
        <Grid item xs={12}>
            <Card 
              className={`hover-lift ${styles.glassCard} ${styles.gradientBorder}`} 
              sx={{ 
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate('/stocks')}
            >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Stock Prices
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                endIcon={<TrendingUp />}
                sx={{ borderRadius: '12px' }}
              >
                View All Stocks
              </Button>
            </Box>
            <Grid container spacing={2}>
              {stocks.slice(0, 5).map((stock, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <Card 
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 8px 24px ${stock.change >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        {stock.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stock.name}
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                        ${stock.price?.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {stock.change >= 0 ? (
                          <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ 
                            fontWeight: 600,
                            color: stock.change >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.change_percent})
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Click anywhere to view {stocks.length > 5 ? `all ${stocks.length}+` : 'more'} stocks with detailed analysis and real-time charts
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Investment Preferences Dialog */}
      <Dialog open={showPreferences} onClose={() => setShowPreferences(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Set Investment Preferences</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Investment Time Frame</InputLabel>
              <Select
                value={preferences.time_frame}
                onChange={(e) => setPreferences({ ...preferences, time_frame: e.target.value })}
              >
                <MenuItem value="short">Short Term (6-18 months)</MenuItem>
                <MenuItem value="medium">Medium Term (1-3 years)</MenuItem>
                <MenuItem value="long">Long Term (3+ years)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Risk Profile</InputLabel>
              <Select
                value={preferences.risk_profile}
                onChange={(e) => setPreferences({ ...preferences, risk_profile: e.target.value })}
              >
                <MenuItem value="conservative">Conservative (Lower risk, stable returns)</MenuItem>
                <MenuItem value="moderate">Moderate (Balanced risk and returns)</MenuItem>
                <MenuItem value="aggressive">Aggressive (Higher risk, higher potential returns)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreferences(false)}>Cancel</Button>
          <Button onClick={updateInvestmentPreferences} variant="contained">
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expanded Chart Dialog */}
      <Dialog 
        open={chartDialogOpen} 
        onClose={() => setChartDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'var(--surface)',
            backdropFilter: 'var(--glass-blur)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
          Investment Portfolio Breakdown
        </DialogTitle>
        <DialogContent>
          {recommendations && recommendations.has_recommendations && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {recommendations.message}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Total Available: ₹{recommendations.available_amount?.toLocaleString()}
                </Typography>
              </Box>

              <Box className={styles.chartSurface} sx={{ mb: 3 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={recommendations.recommendations}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ category, percentage, amount }) => 
                        `${category}: ${showAmounts ? '₹' + amount?.toLocaleString() : percentage + '%'}`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {recommendations.recommendations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `₹${value.toLocaleString()} (${props.payload.percentage}%)`, 
                        'Amount'
                      ]} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAmounts(!showAmounts)}
                  sx={{ borderRadius: '12px', px: 3 }}
                >
                  {showAmounts ? 'Show Percentages' : 'Show Amounts'}
                </Button>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Detailed Breakdown
              </Typography>
              <Grid container spacing={2}>
                {recommendations.recommendations.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      className={styles.surface}
                      sx={{ 
                        p: 2,
                        border: `2px solid ${pieColors[index % pieColors.length]}40`,
                        borderLeft: `4px solid ${pieColors[index % pieColors.length]}`
                      }}
                    >
                      <Box className={styles.flexBetween} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.category}
                        </Typography>
                        <Chip 
                          label={`${item.percentage}%`}
                          size="small"
                          sx={{ 
                            background: `${pieColors[index % pieColors.length]}20`,
                            color: pieColors[index % pieColors.length],
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: pieColors[index % pieColors.length] }}>
                        ₹{item.amount?.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recommended allocation
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setChartDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;