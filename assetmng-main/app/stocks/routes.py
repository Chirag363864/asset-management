from fastapi import APIRouter
import aiohttp
import os
from typing import List, Dict
from pydantic import BaseModel

router = APIRouter()

class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: str
    volume: int

class TrendingStock(BaseModel):
    symbol: str
    name: str
    change_percent: str

@router.get("/live")
async def get_live_stocks():
    """Get live stock data from Alpha Vantage API"""
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
    
    # Extended stock list - Indian + International stocks
    all_stocks = [
        # === INDIAN STOCKS (NSE/BSE) ===
        # Indian IT & Technology
        {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "IT Services", "market": "NSE", "currency": "INR"},
        {"symbol": "INFY.NS", "name": "Infosys Ltd", "sector": "IT Services", "market": "NSE", "currency": "INR"},
        {"symbol": "WIPRO.NS", "name": "Wipro Ltd", "sector": "IT Services", "market": "NSE", "currency": "INR"},
        {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "sector": "IT Services", "market": "NSE", "currency": "INR"},
        {"symbol": "TECHM.NS", "name": "Tech Mahindra", "sector": "IT Services", "market": "NSE", "currency": "INR"},
        
        # Indian Banking & Finance
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking", "market": "NSE", "currency": "INR"},
        {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Banking", "market": "NSE", "currency": "INR"},
        {"symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking", "market": "NSE", "currency": "INR"},
        {"symbol": "AXISBANK.NS", "name": "Axis Bank", "sector": "Banking", "market": "NSE", "currency": "INR"},
        {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Banking", "market": "NSE", "currency": "INR"},
        {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "sector": "NBFC", "market": "NSE", "currency": "INR"},
        
        # Indian Conglomerates
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Conglomerate", "market": "NSE", "currency": "INR"},
        {"symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Engineering", "market": "NSE", "currency": "INR"},
        {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Automotive", "market": "NSE", "currency": "INR"},
        {"symbol": "TATASTEEL.NS", "name": "Tata Steel", "sector": "Metals", "market": "NSE", "currency": "INR"},
        {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "sector": "Automotive", "market": "NSE", "currency": "INR"},
        
        # Indian Pharma
        {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "sector": "Pharma", "market": "NSE", "currency": "INR"},
        {"symbol": "DRREDDY.NS", "name": "Dr. Reddys Laboratories", "sector": "Pharma", "market": "NSE", "currency": "INR"},
        {"symbol": "CIPLA.NS", "name": "Cipla Ltd", "sector": "Pharma", "market": "NSE", "currency": "INR"},
        
        # Indian FMCG
        {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "sector": "FMCG", "market": "NSE", "currency": "INR"},
        {"symbol": "ITC.NS", "name": "ITC Ltd", "sector": "FMCG", "market": "NSE", "currency": "INR"},
        {"symbol": "NESTLEIND.NS", "name": "Nestle India", "sector": "FMCG", "market": "NSE", "currency": "INR"},
        {"symbol": "BRITANNIA.NS", "name": "Britannia Industries", "sector": "FMCG", "market": "NSE", "currency": "INR"},
        {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "sector": "Paints", "market": "NSE", "currency": "INR"},
        
        # Indian Energy
        {"symbol": "NTPC.NS", "name": "NTPC Ltd", "sector": "Power", "market": "NSE", "currency": "INR"},
        {"symbol": "ONGC.NS", "name": "Oil & Natural Gas Corp", "sector": "Oil & Gas", "market": "NSE", "currency": "INR"},
        {"symbol": "BPCL.NS", "name": "Bharat Petroleum", "sector": "Oil & Gas", "market": "NSE", "currency": "INR"},
        
        # Indian Telecom
        {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "sector": "Telecom", "market": "NSE", "currency": "INR"},
        
        # === INTERNATIONAL STOCKS (US) ===
        # Technology
        {"symbol": "AAPL", "name": "Apple Inc.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "MSFT", "name": "Microsoft Corp.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "META", "name": "Meta Platforms Inc.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "NVDA", "name": "NVIDIA Corp.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "AMD", "name": "Advanced Micro Devices", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "INTC", "name": "Intel Corp.", "sector": "Technology", "market": "NASDAQ", "currency": "USD"},
        
        # E-commerce & Retail
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "sector": "E-commerce", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "WMT", "name": "Walmart Inc.", "sector": "Retail", "market": "NYSE", "currency": "USD"},
        
        # Automotive
        {"symbol": "TSLA", "name": "Tesla Inc.", "sector": "Automotive", "market": "NASDAQ", "currency": "USD"},
        {"symbol": "F", "name": "Ford Motor Co.", "sector": "Automotive", "market": "NYSE", "currency": "USD"},
        
        # Finance
        {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Finance", "market": "NYSE", "currency": "USD"},
        {"symbol": "BAC", "name": "Bank of America Corp.", "sector": "Finance", "market": "NYSE", "currency": "USD"},
        {"symbol": "V", "name": "Visa Inc.", "sector": "Finance", "market": "NYSE", "currency": "USD"},
        
        # Healthcare
        {"symbol": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare", "market": "NYSE", "currency": "USD"},
        {"symbol": "PFE", "name": "Pfizer Inc.", "sector": "Pharma", "market": "NYSE", "currency": "USD"},
        
        # Entertainment
        {"symbol": "NFLX", "name": "Netflix Inc.", "sector": "Entertainment", "market": "NASDAQ", "currency": "USD"},
        
        # Energy
        {"symbol": "XOM", "name": "Exxon Mobil Corp.", "sector": "Energy", "market": "NYSE", "currency": "USD"},
    ]
    
    if not api_key:
        # Return mock data for all stocks
        import random
        stocks_data = []
        for stock in all_stocks:
            is_inr = stock["currency"] == "INR"
            
            # Indian stocks: ₹100-5000, US stocks: $50-500
            base_price = (100 + random.random() * 4900) if is_inr else (50 + random.random() * 450)
            change = (random.random() - 0.5) * (100 if is_inr else 20)
            change_percent = (change / base_price) * 100
            
            # Market cap based on currency
            market_cap_value = round(random.random() * 500000 + 10000) if is_inr else round(random.random() * 2000 + 100, 2)
            market_cap = f"₹{market_cap_value} Cr" if is_inr else f"${market_cap_value}B"
            
            stocks_data.append({
                "symbol": stock["symbol"],
                "name": stock["name"],
                "sector": stock["sector"],
                "market": stock["market"],
                "currency": stock["currency"],
                "price": round(base_price, 2),
                "change": round(change, 2),
                "change_percent": f"{'+' if change_percent >= 0 else ''}{change_percent:.2f}%",
                "volume": random.randint(1000000, 100000000 if is_inr else 50000000),
                "high": round(base_price + random.random() * (50 if is_inr else 10), 2),
                "low": round(base_price - random.random() * (50 if is_inr else 10), 2),
                "marketCap": market_cap,
                "pe_ratio": round(15 + random.random() * 30, 2)
            })
        
        return {"stocks": stocks_data}
    
    # If API key exists, fetch real data (limited by API rate limits)
    stocks_data = []
    async with aiohttp.ClientSession() as session:
        for stock in all_stocks[:20]:  # Limit to 20 to avoid rate limits
            try:
                url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={stock['symbol']}&apikey={api_key}"
                async with session.get(url) as response:
                    data = await response.json()
                    
                    if "Global Quote" in data:
                        quote = data["Global Quote"]
                        stocks_data.append({
                            "symbol": quote["01. symbol"],
                            "name": stock["name"],
                            "sector": stock["sector"],
                            "price": float(quote["05. price"]),
                            "change": float(quote["09. change"]),
                            "change_percent": quote["10. change percent"],
                            "volume": int(quote["06. volume"])
                        })
            except Exception as e:
                print(f"Error fetching {stock['symbol']}: {e}")
                continue
    
    return {"stocks": stocks_data}

@router.get("/trending")
async def get_trending_stocks():
    """Get trending stocks"""
    return {
        "trending": [
            {"symbol": "NVDA", "name": "NVIDIA Corp.", "change_percent": "+12.5%"},
            {"symbol": "META", "name": "Meta Platforms Inc.", "change_percent": "+8.3%"},
            {"symbol": "NFLX", "name": "Netflix Inc.", "change_percent": "+5.7%"},
            {"symbol": "AMD", "name": "Advanced Micro Devices", "change_percent": "+4.2%"},
            {"symbol": "COIN", "name": "Coinbase Global Inc.", "change_percent": "+15.8%"}
        ]
    }

@router.get("/search/{symbol}")
async def search_stock(symbol: str):
    """Search for a specific stock"""
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
    
    if not api_key:
        return {
            "symbol": symbol.upper(),
            "name": f"{symbol.upper()} Corp.",
            "price": 123.45,
            "change": 2.34,
            "change_percent": "+1.93%",
            "volume": 1234567
        }
    
    try:
        async with aiohttp.ClientSession() as session:
            url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
            async with session.get(url) as response:
                data = await response.json()
                
                if "Global Quote" in data:
                    quote = data["Global Quote"]
                    return {
                        "symbol": quote["01. symbol"],
                        "name": get_company_name(symbol),
                        "price": float(quote["05. price"]),
                        "change": float(quote["09. change"]),
                        "change_percent": quote["10. change percent"],
                        "volume": int(quote["06. volume"])
                    }
                else:
                    return {"error": "Stock not found"}
    except Exception as e:
        return {"error": f"Error fetching stock data: {str(e)}"}

def get_company_name(symbol: str) -> str:
    """Get company name from symbol (comprehensive mapping)"""
    company_names = {
        # Technology
        "AAPL": "Apple Inc.",
        "MSFT": "Microsoft Corp.",
        "GOOGL": "Alphabet Inc.",
        "META": "Meta Platforms Inc.",
        "NVDA": "NVIDIA Corp.",
        "AMD": "Advanced Micro Devices",
        "INTC": "Intel Corp.",
        "ORCL": "Oracle Corp.",
        "CSCO": "Cisco Systems Inc.",
        "ADBE": "Adobe Inc.",
        # E-commerce & Retail
        "AMZN": "Amazon.com Inc.",
        "BABA": "Alibaba Group",
        "WMT": "Walmart Inc.",
        "HD": "Home Depot Inc.",
        "TGT": "Target Corp.",
        # Automotive
        "TSLA": "Tesla Inc.",
        "F": "Ford Motor Co.",
        "GM": "General Motors Co.",
        "TM": "Toyota Motor Corp.",
        # Finance
        "JPM": "JPMorgan Chase & Co.",
        "BAC": "Bank of America Corp.",
        "WFC": "Wells Fargo & Co.",
        "GS": "Goldman Sachs Group",
        "MS": "Morgan Stanley",
        "V": "Visa Inc.",
        "MA": "Mastercard Inc.",
        "PYPL": "PayPal Holdings Inc.",
        # Healthcare & Pharma
        "JNJ": "Johnson & Johnson",
        "UNH": "UnitedHealth Group",
        "PFE": "Pfizer Inc.",
        "MRNA": "Moderna Inc.",
        "ABBV": "AbbVie Inc.",
        # Entertainment & Media
        "NFLX": "Netflix Inc.",
        "DIS": "Walt Disney Co.",
        "SPOT": "Spotify Technology",
        # Energy
        "XOM": "Exxon Mobil Corp.",
        "CVX": "Chevron Corp.",
        # Crypto & Fintech
        "COIN": "Coinbase Global Inc.",
        "SQ": "Block Inc.",
        # Consumer Goods
        "PEP": "PepsiCo Inc.",
        "KO": "Coca-Cola Co.",
        "PG": "Procter & Gamble Co.",
        "NKE": "Nike Inc.",
        # Aerospace & Defense
        "BA": "Boeing Co.",
        "LMT": "Lockheed Martin Corp.",
    }
    return company_names.get(symbol.upper(), f"{symbol.upper()} Corp.")