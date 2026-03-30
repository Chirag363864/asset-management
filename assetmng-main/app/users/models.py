from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Expense(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class FinancialProfile(Document):
    user_email: str
    monthly_salary: float
    monthly_expenses: List[Expense] = Field(default_factory=list)
    savings_goal: Optional[float] = None
    risk_profile: str = "moderate"
    time_frame: Optional[str] = "medium"
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "financial_profiles"

class ProfileUpdate(BaseModel):
    monthly_salary: Optional[float] = None
    monthly_expenses: Optional[List[Expense]] = None
    savings_goal: Optional[float] = None
    risk_profile: Optional[str] = None
    time_frame: Optional[str] = None

class ProfileResponse(BaseModel):
    user_email: str
    monthly_salary: float
    monthly_expenses: List[Expense]
    savings_goal: Optional[float]
    risk_profile: str
    time_frame: Optional[str]
    total_expenses: float
    disposable_income: float