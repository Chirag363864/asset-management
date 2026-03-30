import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add, TrendingUp, TrendingDown } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { portfolioAPI } from '../utils/api';
import styles from '../styles/ui.module.css';

const PortfolioPage = () => {
  const [, setPortfolio] = useState(null);
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchase_price: '',
    investment_type: 'stock'
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [portfolioRes, summaryRes, performanceRes] = await Promise.all([
        portfolioAPI.getPortfolio(),
        portfolioAPI.getSummary(),
        portfolioAPI.getPerformance()
      ]);
      
      setPortfolio(portfolioRes.data);
      setSummary(summaryRes.data);
      setPerformance(performanceRes.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async () => {
    try {
      await portfolioAPI.addInvestment({
        ...newInvestment,
        quantity: parseFloat(newInvestment.quantity),
        purchase_price: parseFloat(newInvestment.purchase_price)
      });
      setDialogOpen(false);
      setNewInvestment({
        symbol: '',
        name: '',
        quantity: '',
        purchase_price: '',
        investment_type: 'stock'
      });
      await fetchPortfolioData();
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const removeInvestment = async (symbol) => {
    try {
      await portfolioAPI.removeInvestment(symbol);
      await fetchPortfolioData();
    } catch (error) {
      console.error('Error removing investment:', error);
    }
  };

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box className={`${styles.flexBetween} ${styles.fadeIn} ${styles.mb6}`}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Investment Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track, manage, and grow your investments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            size="large"
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            Add Investment
          </Button>
        </Box>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={4}>
          <Card className={`${styles.statCard} ${styles.slideInUp}`}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Portfolio Summary
              </Typography>
              {summary && (
                <Box className={styles.flexCol} sx={{ gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Total Invested
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      ₹{summary.total_invested?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Current Value
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{summary.current_value?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box 
                    className={styles.surface}
                    sx={{ 
                      p: 2, 
                      mt: 1,
                      background: summary.total_return >= 0 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04))'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04))'
                    }}
                  >
                    <Box className={styles.flexBetween} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Return
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: summary.total_return >= 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        ₹{summary.total_return?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box className={styles.flexBetween}>
                      <Typography variant="body2" color="text.secondary">
                        Return %
                      </Typography>
                      <Box 
                        className={summary.return_percentage >= 0 ? styles.statusSuccess : styles.statusError}
                      >
                        {summary.return_percentage?.toFixed(2)}%
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles.flexBetween} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Investments
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {summary.investment_count}
                    </Typography>
                  </Box>
                  {summary.top_performer && (
                    <Box className={styles.flexBetween}>
                      <Typography variant="body2" color="text.secondary">
                        Top Performer
                      </Typography>
                      <Box 
                        sx={{ 
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {summary.top_performer}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Allocation Chart */}
        <Grid item xs={12} md={8}>
          <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay100}`} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Portfolio Allocation
              </Typography>
            {performance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, total_value }) => `${symbol}: ₹${total_value?.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total_value"
                  >
                    {performance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert 
                severity="info"
                sx={{
                  borderRadius: '12px',
                  background: 'rgba(10, 132, 255, 0.08)',
                  border: '1px solid rgba(10, 132, 255, 0.2)'
                }}
              >
                No investments yet. Add your first investment to see portfolio allocation.
              </Alert>
            )}
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Performance Table */}
        <Grid item xs={12}>
          <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay200}`}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Investment Performance
              </Typography>
            {performance.length > 0 ? (
              <TableContainer 
                className={styles.surface} 
                sx={{ 
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow 
                      sx={{ 
                        background: 'rgba(var(--primary-rgb), 0.05)',
                        '& .MuiTableCell-head': {
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid rgba(var(--primary-rgb), 0.1)'
                        }
                      }}
                    >
                      <TableCell>Symbol</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Purchase Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                      <TableCell align="right">Return</TableCell>
                      <TableCell align="right">Return %</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performance.map((investment, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(var(--primary-rgb), 0.03)',
                            transform: 'scale(1.005)'
                          },
                          '& .MuiTableCell-root': {
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <TableCell>
                          <Box className={styles.flexRow} sx={{ gap: 1 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: investment.return_percentage >= 0
                                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))'
                                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
                                color: investment.return_percentage >= 0 ? 'success.main' : 'error.main'
                              }}
                            >
                              {investment.return_percentage >= 0 ? (
                                <TrendingUp fontSize="small" />
                              ) : (
                                <TrendingDown fontSize="small" />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {investment.symbol}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {investment.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: '6px',
                              background: 'rgba(var(--primary-rgb), 0.08)',
                              color: 'var(--primary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              display: 'inline-block'
                            }}
                          >
                            {investment.investment_type}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {investment.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            ₹{investment.purchase_price?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{investment.current_price?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                            ₹{investment.total_value?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontWeight: 600,
                              color: investment.return_amount >= 0 ? 'success.main' : 'error.main' 
                            }}
                          >
                            ₹{investment.return_amount?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box 
                            className={investment.return_percentage >= 0 ? styles.statusSuccess : styles.statusError}
                          >
                            {investment.return_percentage?.toFixed(2)}%
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => removeInvestment(investment.symbol)}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 2
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert 
                severity="info"
                sx={{
                  borderRadius: '12px',
                  background: 'rgba(10, 132, 255, 0.08)',
                  border: '1px solid rgba(10, 132, 255, 0.2)'
                }}
              >
                No investments in your portfolio yet. Start by adding your first investment!
              </Alert>
            )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Investment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Investment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                value={newInvestment.symbol}
                onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value.toUpperCase() })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newInvestment.quantity}
                onChange={(e) => setNewInvestment({ ...newInvestment, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={newInvestment.purchase_price}
                onChange={(e) => setNewInvestment({ ...newInvestment, purchase_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Investment Type</InputLabel>
                <Select
                  value={newInvestment.investment_type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, investment_type: e.target.value })}
                >
                  <MenuItem value="stock">Stock</MenuItem>
                  <MenuItem value="mutual_fund">Mutual Fund</MenuItem>
                  <MenuItem value="bond">Bond</MenuItem>
                  <MenuItem value="etf">ETF</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={addInvestment}
            variant="contained"
            disabled={!newInvestment.symbol || !newInvestment.quantity || !newInvestment.purchase_price}
          >
            Add Investment
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default PortfolioPage;