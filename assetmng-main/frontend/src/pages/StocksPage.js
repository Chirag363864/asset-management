import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  RefreshRounded,
  ShowChart,
  Star,
  StarBorder
} from '@mui/icons-material';
import stockService from '../services/stockService';
import styles from '../styles/ui.module.css';

const StocksPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  // Extended stock list - Indian stocks (NSE/BSE) + major international stocks
  const extendedStockList = [
    // === INDIAN STOCKS (NSE/BSE) - Currency: INR ===
    
    // Indian IT & Technology
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    { symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    { symbol: 'WIPRO.NS', name: 'Wipro Ltd', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    { symbol: 'LTI.NS', name: 'LTIMindtree', sector: 'IT Services', market: 'NSE', currency: 'INR' },
    
    // Indian Banking & Finance
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking', market: 'NSE', currency: 'INR' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking', market: 'NSE', currency: 'INR' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking', market: 'NSE', currency: 'INR' },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking', market: 'NSE', currency: 'INR' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking', market: 'NSE', currency: 'INR' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'NBFC', market: 'NSE', currency: 'INR' },
    { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance', sector: 'Insurance', market: 'NSE', currency: 'INR' },
    { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', sector: 'Insurance', market: 'NSE', currency: 'INR' },
    
    // Indian Conglomerates & Heavy Industries
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Conglomerate', market: 'NSE', currency: 'INR' },
    { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Engineering', market: 'NSE', currency: 'INR' },
    { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Conglomerate', market: 'NSE', currency: 'INR' },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Automotive', market: 'NSE', currency: 'INR' },
    { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals', market: 'NSE', currency: 'INR' },
    { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Automotive', market: 'NSE', currency: 'INR' },
    { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Automotive', market: 'NSE', currency: 'INR' },
    
    // Indian Pharma & Healthcare
    { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', sector: 'Pharma', market: 'NSE', currency: 'INR' },
    { symbol: 'DRREDDY.NS', name: 'Dr. Reddys Laboratories', sector: 'Pharma', market: 'NSE', currency: 'INR' },
    { symbol: 'CIPLA.NS', name: 'Cipla Ltd', sector: 'Pharma', market: 'NSE', currency: 'INR' },
    { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', sector: 'Healthcare', market: 'NSE', currency: 'INR' },
    { symbol: 'DIVISLAB.NS', name: 'Divis Laboratories', sector: 'Pharma', market: 'NSE', currency: 'INR' },
    
    // Indian FMCG & Consumer
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG', market: 'NSE', currency: 'INR' },
    { symbol: 'ITC.NS', name: 'ITC Ltd', sector: 'FMCG', market: 'NSE', currency: 'INR' },
    { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG', market: 'NSE', currency: 'INR' },
    { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', sector: 'FMCG', market: 'NSE', currency: 'INR' },
    { symbol: 'DABUR.NS', name: 'Dabur India', sector: 'FMCG', market: 'NSE', currency: 'INR' },
    { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Paints', market: 'NSE', currency: 'INR' },
    
    // Indian Energy & Power
    { symbol: 'NTPC.NS', name: 'NTPC Ltd', sector: 'Power', market: 'NSE', currency: 'INR' },
    { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', sector: 'Power', market: 'NSE', currency: 'INR' },
    { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corp', sector: 'Oil & Gas', market: 'NSE', currency: 'INR' },
    { symbol: 'BPCL.NS', name: 'Bharat Petroleum', sector: 'Oil & Gas', market: 'NSE', currency: 'INR' },
    { symbol: 'IOC.NS', name: 'Indian Oil Corp', sector: 'Oil & Gas', market: 'NSE', currency: 'INR' },
    
    // Indian Telecom & Media
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom', market: 'NSE', currency: 'INR' },
    { symbol: 'ZOMATO.NS', name: 'Zomato Ltd', sector: 'Food Tech', market: 'NSE', currency: 'INR' },
    
    // Indian Metals & Mining
    { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals', market: 'NSE', currency: 'INR' },
    { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals', market: 'NSE', currency: 'INR' },
    { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Mining', market: 'NSE', currency: 'INR' },
    
    // === INTERNATIONAL STOCKS (US) - Currency: USD ===
    
    // Technology
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology', market: 'NYSE', currency: 'USD' },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', market: 'NASDAQ', currency: 'USD' },
    
    // E-commerce & Retail
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-commerce', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'BABA', name: 'Alibaba Group', sector: 'E-commerce', market: 'NYSE', currency: 'USD' },
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Retail', market: 'NYSE', currency: 'USD' },
    { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Retail', market: 'NYSE', currency: 'USD' },
    { symbol: 'TGT', name: 'Target Corp.', sector: 'Retail', market: 'NYSE', currency: 'USD' },
    
    // Automotive
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'F', name: 'Ford Motor Co.', sector: 'Automotive', market: 'NYSE', currency: 'USD' },
    { symbol: 'GM', name: 'General Motors Co.', sector: 'Automotive', market: 'NYSE', currency: 'USD' },
    
    // Finance
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', market: 'NYSE', currency: 'USD' },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Finance', market: 'NYSE', currency: 'USD' },
    { symbol: 'WFC', name: 'Wells Fargo & Co.', sector: 'Finance', market: 'NYSE', currency: 'USD' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Finance', market: 'NYSE', currency: 'USD' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Finance', market: 'NYSE', currency: 'USD' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Finance', market: 'NASDAQ', currency: 'USD' },
    
    // Healthcare & Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', market: 'NYSE', currency: 'USD' },
    { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', market: 'NYSE', currency: 'USD' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Pharma', market: 'NYSE', currency: 'USD' },
    
    // Entertainment & Media
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Entertainment', market: 'NYSE', currency: 'USD' },
    
    // Energy
    { symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', market: 'NYSE', currency: 'USD' },
    { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy', market: 'NYSE', currency: 'USD' },
    
    // Crypto & Fintech
    { symbol: 'COIN', name: 'Coinbase Global Inc.', sector: 'Crypto', market: 'NASDAQ', currency: 'USD' },
    
    // Consumer Goods
    { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Goods', market: 'NASDAQ', currency: 'USD' },
    { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Goods', market: 'NYSE', currency: 'USD' },
  ];

  useEffect(() => {
    fetchStocksData();
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
    setWatchlist(savedWatchlist);
  }, []);

  useEffect(() => {
    filterStocks();
  }, [searchQuery, stocks, tabValue, watchlist]);

  const fetchStocksData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock data for all stocks with realistic variations
      const mockStocks = extendedStockList.map(stock => {
        const isINR = stock.currency === 'INR';
        
        // Indian stocks: ₹100-5000, US stocks: $50-500
        const basePrice = isINR 
          ? 100 + Math.random() * 4900 
          : 50 + Math.random() * 450;
        
        const change = (Math.random() - 0.5) * (isINR ? 100 : 20);
        const changePercent = (change / basePrice) * 100;
        
        // Market cap based on currency
        const marketCapValue = isINR
          ? (Math.random() * 500000 + 10000).toFixed(0) // Crores
          : (Math.random() * 2000 + 100).toFixed(2); // Billions
        
        return {
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          market: stock.market,
          currency: stock.currency,
          price: parseFloat(basePrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          change_percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          volume: Math.floor(Math.random() * (isINR ? 100000000 : 50000000)) + 1000000,
          high: parseFloat((basePrice + Math.random() * (isINR ? 50 : 10)).toFixed(2)),
          low: parseFloat((basePrice - Math.random() * (isINR ? 50 : 10)).toFixed(2)),
          marketCap: isINR ? `₹${marketCapValue} Cr` : `$${marketCapValue}B`,
          pe_ratio: (15 + Math.random() * 30).toFixed(2)
        };
      });

      setStocks(mockStocks);
      setFilteredStocks(mockStocks);

      // Fetch trending stocks
      const trendingData = await stockService.getTrendingStocks();
      setTrending(trendingData.trending || []);

    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStocksData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterStocks = () => {
    let filtered = [...stocks];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.market.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab
    if (tabValue === 1) { // Indian Stocks
      filtered = filtered.filter(stock => stock.currency === 'INR');
    } else if (tabValue === 2) { // US Stocks
      filtered = filtered.filter(stock => stock.currency === 'USD');
    } else if (tabValue === 3) { // Gainers
      filtered = filtered.filter(stock => stock.change > 0).sort((a, b) => b.change - a.change);
    } else if (tabValue === 4) { // Losers
      filtered = filtered.filter(stock => stock.change < 0).sort((a, b) => a.change - b.change);
    } else if (tabValue === 5) { // Watchlist
      filtered = filtered.filter(stock => watchlist.includes(stock.symbol));
    }

    setFilteredStocks(filtered);
  };

  const toggleWatchlist = (symbol) => {
    let newWatchlist;
    if (watchlist.includes(symbol)) {
      newWatchlist = watchlist.filter(s => s !== symbol);
    } else {
      newWatchlist = [...watchlist, symbol];
    }
    setWatchlist(newWatchlist);
    localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
  };

  const handleStockClick = (stock) => {
    navigate(`/stocks/${stock.symbol}`, { state: { stock } });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
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

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={`${styles.fadeIn} ${styles.mb6}`}>
          <Box className={styles.flexBetween} sx={{ mb: 2 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Live Stock Market
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time market data for {stocks.length}+ stocks across all sectors
              </Typography>
            </Box>
            <Tooltip title="Refresh Data">
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
            </Tooltip>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by symbol, name, or sector (e.g., AAPL, Apple, Technology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'var(--surface)'
              }
            }}
          />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }
              }}
            >
              <Tab label={`All Stocks (${stocks.length})`} />
              <Tab label="Indian Stocks (NSE/BSE)" />
              <Tab label="US Stocks" />
              <Tab label="Top Gainers" />
              <Tab label="Top Losers" />
              <Tab label={`Watchlist (${watchlist.length})`} />
            </Tabs>
          </Box>
        </Box>

        {/* Trending Stocks Banner */}
        {trending.length > 0 && tabValue === 0 && (
          <Card className={`${styles.glassCard} ${styles.fadeIn} ${styles.mb4}`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'var(--success)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Trending Now
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {trending.map((stock, index) => (
                  <Chip
                    key={index}
                    label={`${stock.symbol} ${stock.change_percent}`}
                    sx={{
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => {
                      const trendingStock = stocks.find(s => s.symbol === stock.symbol);
                      if (trendingStock) handleStockClick(trendingStock);
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Stocks Grid */}
        {filteredStocks.length === 0 ? (
          <Box className={styles.surface} sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No stocks found matching your search
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredStocks.map((stock, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={stock.symbol}>
                <Card 
                  className={`${styles.surface} ${styles.slideInUp} ${styles[`delay${(index % 12) * 50}`]}`}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 32px ${stock.change >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }
                  }}
                  onClick={() => handleStockClick(stock)}
                >
                  <CardContent>
                    <Box className={styles.flexBetween} sx={{ mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {stock.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {stock.name}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        sx={{ 
                          color: watchlist.includes(stock.symbol) ? 'var(--warning)' : 'text.secondary' 
                        }}
                      >
                        {watchlist.includes(stock.symbol) ? <Star /> : <StarBorder />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={stock.sector}
                        size="small"
                        sx={{ 
                          fontSize: '0.75rem',
                          background: 'var(--primary-bg)',
                          color: 'var(--primary)'
                        }}
                      />
                      <Chip 
                        label={stock.market}
                        size="small"
                        sx={{ 
                          fontSize: '0.75rem',
                          background: stock.currency === 'INR' ? 'rgba(255, 153, 51, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: stock.currency === 'INR' ? '#ff9933' : '#3b82f6',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stock.currency === 'INR' ? '₹' : '$'}{stock.price.toLocaleString(stock.currency === 'INR' ? 'en-IN' : 'en-US')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        {stock.change >= 0 ? (
                          <TrendingUp sx={{ color: 'var(--success)', fontSize: 20 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'var(--error)', fontSize: 20 }} />
                        )}
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            color: stock.change >= 0 ? 'var(--success)' : 'var(--error)'
                          }}
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.currency === 'INR' ? '₹' : '$'}{Math.abs(stock.change).toFixed(2)} ({stock.change_percent})
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid var(--border)' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Volume
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {(stock.volume / (stock.currency === 'INR' ? 10000000 : 1000000)).toFixed(2)}{stock.currency === 'INR' ? 'Cr' : 'M'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Market Cap
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {stock.marketCap}
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      sx={{ 
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      <ShowChart sx={{ mr: 0.5, fontSize: 18 }} />
                      View Details
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default StocksPage;
