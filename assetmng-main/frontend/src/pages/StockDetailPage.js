import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  RefreshRounded
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import stockService from '../services/stockService';
import styles from '../styles/ui.module.css';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [stock, setStock] = useState(location.state?.stock || null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area');
  const [watchlist, setWatchlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load watchlist
    const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
    setWatchlist(savedWatchlist);
    
    // Fetch stock data
    fetchStockData();
  }, [symbol, timeRange]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      
      // If stock data not passed, fetch it
      if (!stock) {
        const stockData = await stockService.searchStock(symbol);
        setStock(stockData);
      }

      // Fetch historical data
      const historyData = await stockService.getStockHistory(symbol, timeRange);
      setChartData(historyData.data);

    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStockData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleWatchlist = () => {
    let newWatchlist;
    if (watchlist.includes(symbol)) {
      newWatchlist = watchlist.filter(s => s !== symbol);
    } else {
      newWatchlist = [...watchlist, symbol];
    }
    setWatchlist(newWatchlist);
    localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
  };

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1W') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === '1M') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const currencySymbol = stock.currency === 'INR' ? '₹' : '$';
      const volumeDivisor = stock.currency === 'INR' ? 10000000 : 1000000;
      const volumeUnit = stock.currency === 'INR' ? 'Cr' : 'M';
      
      return (
        <Box 
          className={styles.surface}
          sx={{ 
            p: 2, 
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {new Date(data.time).toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
            {currencySymbol}{data.price.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Volume: {(data.volume / volumeDivisor).toFixed(2)}{volumeUnit}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading || !stock) {
    return (
      <Box className={styles.pageContainer}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  const priceChange = stock.change || 0;
  const isPositive = priceChange >= 0;
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : stock.price;
  const startPrice = chartData.length > 0 ? chartData[0].price : stock.price;
  const priceChangeInRange = currentPrice - startPrice;
  const percentChangeInRange = ((priceChangeInRange / startPrice) * 100).toFixed(2);

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={`${styles.fadeIn} ${styles.mb4}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => navigate('/stocks')}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stock.symbol}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stock.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={toggleWatchlist}
                sx={{ 
                  background: 'var(--surface)',
                  color: watchlist.includes(symbol) ? 'var(--warning)' : 'text.secondary' 
                }}
              >
                {watchlist.includes(symbol) ? <Star /> : <StarBorder />}
              </IconButton>
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ 
                  background: 'var(--surface)',
                  '&:hover': { background: 'var(--surface-elevated)' }
                }}
              >
                <RefreshRounded 
                  sx={{ 
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} 
                />
              </IconButton>
            </Box>
          </Box>

          {/* Price Info */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card className={styles.surface}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                      <Typography variant="h2" sx={{ fontWeight: 700 }}>
                        {stock.currency === 'INR' ? '₹' : '$'}{currentPrice.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </Typography>
                      <Chip 
                        label={stock.market}
                        size="small"
                        sx={{ 
                          background: stock.currency === 'INR' ? 'rgba(255, 153, 51, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: stock.currency === 'INR' ? '#ff9933' : '#3b82f6',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isPositive ? (
                        <TrendingUp sx={{ color: 'var(--success)', fontSize: 28 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'var(--error)', fontSize: 28 }} />
                      )}
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 600,
                          color: isPositive ? 'var(--success)' : 'var(--error)'
                        }}
                      >
                        {priceChangeInRange >= 0 ? '+' : ''}{stock.currency === 'INR' ? '₹' : '$'}{Math.abs(priceChangeInRange).toFixed(2)} 
                        ({percentChangeInRange >= 0 ? '+' : ''}{percentChangeInRange}%)
                      </Typography>
                      <Chip 
                        label={timeRange}
                        size="small"
                        sx={{ 
                          background: 'var(--primary-bg)',
                          color: 'var(--primary)',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Chart Controls */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <ToggleButtonGroup
                      value={timeRange}
                      exclusive
                      onChange={handleTimeRangeChange}
                      size="small"
                    >
                      <ToggleButton value="1D">1D</ToggleButton>
                      <ToggleButton value="1W">1W</ToggleButton>
                      <ToggleButton value="1M">1M</ToggleButton>
                      <ToggleButton value="3M">3M</ToggleButton>
                      <ToggleButton value="1Y">1Y</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                      value={chartType}
                      exclusive
                      onChange={handleChartTypeChange}
                      size="small"
                    >
                      <ToggleButton value="area">Area</ToggleButton>
                      <ToggleButton value="line">Line</ToggleButton>
                      <ToggleButton value="candle">Candle</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'area' ? (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop 
                              offset="5%" 
                              stopColor={isPositive ? '#10B981' : '#EF4444'} 
                              stopOpacity={0.3}
                            />
                            <stop 
                              offset="95%" 
                              stopColor={isPositive ? '#10B981' : '#EF4444'} 
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={formatXAxis}
                          stroke="var(--text-secondary)"
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          stroke="var(--text-secondary)"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke={isPositive ? '#10B981' : '#EF4444'}
                          strokeWidth={3}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    ) : chartType === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={formatXAxis}
                          stroke="var(--text-secondary)"
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          stroke="var(--text-secondary)"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={isPositive ? '#10B981' : '#EF4444'}
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={formatXAxis}
                          stroke="var(--text-secondary)"
                        />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="price" 
                          fill={isPositive ? '#10B981' : '#EF4444'}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Stats Panel */}
            <Grid item xs={12} md={4}>
              <Card className={styles.surface} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Key Statistics
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Open
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stock.currency === 'INR' ? '₹' : '$'}{stock.price?.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        High
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--success)' }}>
                        {stock.currency === 'INR' ? '₹' : '$'}{stock.high?.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Low
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--error)' }}>
                        {stock.currency === 'INR' ? '₹' : '$'}{stock.low?.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Volume
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stock.volume ? (stock.volume / (stock.currency === 'INR' ? 10000000 : 1000000)).toFixed(2) + (stock.currency === 'INR' ? 'Cr' : 'M') : 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Market Cap
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stock.marketCap || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        P/E Ratio
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stock.pe_ratio || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Sector
                      </Typography>
                      <Chip 
                        label={stock.sector || 'N/A'}
                        size="small"
                        sx={{ 
                          mt: 1,
                          background: 'var(--primary-bg)',
                          color: 'var(--primary)',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ 
                      mt: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  >
                    Trade {stock.symbol}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Volume Chart */}
          <Card className={styles.surface}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Trading Volume
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatXAxis}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    stroke="var(--text-secondary)"
                  />
                  <Tooltip 
                    formatter={(value) => [`${(value / 1000000).toFixed(2)}M`, 'Volume']}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default StockDetailPage;
