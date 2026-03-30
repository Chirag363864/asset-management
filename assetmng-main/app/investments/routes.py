from fastapi import APIRouter, Depends, HTTPException
from app.auth.routes import get_current_user
from app.auth.models import User
from app.users.models import FinancialProfile
from .logic import calculate_investment_recommendations, InvestmentPlan

router = APIRouter()

@router.get("/recommendations")
async def get_investment_recommendations(current_user: User = Depends(get_current_user)):
    profile = await FinancialProfile.find_one(
        FinancialProfile.user_email == current_user.email
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    
    total_expenses = sum(expense.amount for expense in profile.monthly_expenses)
    
    recommendations = calculate_investment_recommendations(
        profile.monthly_salary,
        total_expenses,
        profile.risk_profile
    )
    
    # Convert to dict and add available_amount and has_recommendations
    response = recommendations.dict()
    response['available_amount'] = recommendations.disposable_income
    response['has_recommendations'] = len(recommendations.recommendations) > 0
    response['total_expenses'] = total_expenses
    
    return response

@router.get("/risk-profiles")
async def get_risk_profiles():
    return {
        "risk_profiles": [
            {
                "name": "conservative",
                "description": "Low risk, steady returns, focus on capital preservation",
                "characteristics": ["High safety", "Low volatility", "Lower returns"]
            },
            {
                "name": "moderate", 
                "description": "Balanced approach with moderate risk and returns",
                "characteristics": ["Balanced portfolio", "Moderate volatility", "Steady growth"]
            },
            {
                "name": "aggressive",
                "description": "High risk, high potential returns, growth-focused",
                "characteristics": ["High growth potential", "Higher volatility", "Long-term focus"]
            }
        ]
    }