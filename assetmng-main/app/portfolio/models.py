from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Investment(BaseModel):
    symbol: str
    name: str
    quantity: float
    purchase_price: float
    current_price: float
    investment_date: datetime = Field(default_factory=datetime.utcnow)
    investment_type: str = "stock"  # stock, mutual_fund, bond, etc.

class Portfolio(Document):
    user_email: str
    investments: List[Investment] = Field(default_factory=list)
    total_invested: float = 0.0
    current_value: float = 0.0
    total_return: float = 0.0
    return_percentage: float = 0.0
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "portfolios"

class AddInvestment(BaseModel):
    symbol: str
    name: str
    quantity: float
    purchase_price: float
    investment_type: str = "stock"

class PortfolioSummary(BaseModel):
    total_invested: float
    current_value: float
    total_return: float
    return_percentage: float
    investment_count: int
    top_performer: Optional[str] = None
    worst_performer: Optional[str] = None

class InvestmentPerformance(BaseModel):
    symbol: str
    name: str
    quantity: float
    purchase_price: float
    current_price: float
    total_value: float
    return_amount: float
    return_percentage: float
    investment_type: str