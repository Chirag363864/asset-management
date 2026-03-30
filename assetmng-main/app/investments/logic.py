from typing import Dict, List
from pydantic import BaseModel

class InvestmentRecommendation(BaseModel):
    category: str
    amount: float
    percentage: float
    term: str
    description: str

class InvestmentPlan(BaseModel):
    disposable_income: float
    recommendations: List[InvestmentRecommendation]
    risk_profile: str
    message: str

def calculate_investment_recommendations(
    monthly_salary: float,
    total_expenses: float,
    risk_profile: str
) -> InvestmentPlan:
    disposable_income = monthly_salary - total_expenses
    
    if disposable_income <= 0:
        return InvestmentPlan(
            disposable_income=disposable_income,
            recommendations=[],
            risk_profile=risk_profile,
            message="Consider reducing expenses to start investing"
        )
    
    # Base allocation percentages based on risk profile
    allocations = {
        "conservative": {
            "emergency_fund": {"percentage": 0.4, "term": "Short-term", "description": "Emergency fund for 6-12 months of expenses"},
            "fixed_deposits": {"percentage": 0.3, "term": "Short-term", "description": "Low-risk fixed deposits and bonds"},
            "mutual_funds": {"percentage": 0.2, "term": "Mid-term", "description": "Diversified equity mutual funds"},
            "stocks": {"percentage": 0.1, "term": "Long-term", "description": "Blue-chip dividend-paying stocks"}
        },
        "moderate": {
            "emergency_fund": {"percentage": 0.3, "term": "Short-term", "description": "Emergency fund for unexpected expenses"},
            "fixed_deposits": {"percentage": 0.2, "term": "Short-term", "description": "Government bonds and FDs"},
            "mutual_funds": {"percentage": 0.3, "term": "Mid-term", "description": "Balanced mutual funds"},
            "stocks": {"percentage": 0.2, "term": "Long-term", "description": "Growth stocks and index funds"}
        },
        "aggressive": {
            "emergency_fund": {"percentage": 0.2, "term": "Short-term", "description": "Basic emergency fund"},
            "fixed_deposits": {"percentage": 0.1, "term": "Short-term", "description": "Minimal safe investments"},
            "mutual_funds": {"percentage": 0.3, "term": "Mid-term", "description": "Equity and growth mutual funds"},
            "stocks": {"percentage": 0.4, "term": "Long-term", "description": "High-growth stocks and ETFs"}
        }
    }
    
    allocation = allocations.get(risk_profile, allocations["moderate"])
    
    recommendations = []
    for category, details in allocation.items():
        amount = disposable_income * details["percentage"]
        recommendations.append(InvestmentRecommendation(
            category=category.replace("_", " ").title(),
            amount=round(amount, 2),
            percentage=details["percentage"] * 100,
            term=details["term"],
            description=details["description"]
        ))
    
    return InvestmentPlan(
        disposable_income=disposable_income,
        recommendations=recommendations,
        risk_profile=risk_profile,
        message=f"Investment plan based on your {risk_profile} risk profile"
    )