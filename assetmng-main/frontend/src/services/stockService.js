import axios from 'axios';

const API_URL = 'http://localhost:8000';

const stockService = {
  // Get all live stocks
  getLiveStocks: async () => {
    try {
      const response = await axios.get(`${API_URL}/stocks/live`);
      return response.data;
    } catch (error) {
      console.error('Error fetching live stocks:', error);
      throw error;
    }
  },

  // Get trending stocks
  getTrendingStocks: async () => {
    try {
      const response = await axios.get(`${API_URL}/stocks/trending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      throw error;
    }
  },

  // Search for a specific stock
  searchStock: async (symbol) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/search/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error searching stock:', error);
      throw error;
    }
  },

  // Get stock historical data (mock for now)
  getStockHistory: async (symbol, timeRange = '1D') => {
    try {
      // Mock historical data - in production, this would call a real API
      const generateHistoricalData = () => {
        const dataPoints = timeRange === '1D' ? 50 : 
                          timeRange === '1W' ? 100 : 
                          timeRange === '1M' ? 150 : 
                          timeRange === '1Y' ? 250 : 50;
        
        const data = [];
        let basePrice = 100 + Math.random() * 100;
        const now = new Date();
        
        for (let i = dataPoints; i >= 0; i--) {
          const timestamp = new Date(now - i * (timeRange === '1D' ? 600000 : 
                                                 timeRange === '1W' ? 3600000 : 
                                                 timeRange === '1M' ? 14400000 : 
                                                 86400000));
          
          // Random walk
          const change = (Math.random() - 0.5) * 5;
          basePrice += change;
          
          data.push({
            time: timestamp.toISOString(),
            price: parseFloat(basePrice.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000) + 500000
          });
        }
        
        return data;
      };

      return {
        symbol,
        data: generateHistoricalData()
      };
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw error;
    }
  }
};

export default stockService;
