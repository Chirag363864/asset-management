from fastapi import APIRouter, HTTPException, Depends
from .models import FinancialProfile, ProfileUpdate, Expense, ProfileResponse
from app.auth.routes import get_current_user
from app.auth.models import User
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    profile = await FinancialProfile.find_one(
        FinancialProfile.user_email == current_user.email
    )
    if not profile:
        # Create default profile
        profile = FinancialProfile(
            user_email=current_user.email,
            monthly_salary=0,
            monthly_expenses=[],
            risk_profile=current_user.risk_profile,
            time_frame="medium"
        )
        await profile.insert()
    
    total_expenses = sum(expense.amount for expense in profile.monthly_expenses)
    disposable_income = profile.monthly_salary - total_expenses
    
    return ProfileResponse(
        user_email=profile.user_email,
        monthly_salary=profile.monthly_salary,
        monthly_expenses=profile.monthly_expenses,
        savings_goal=profile.savings_goal,
        risk_profile=profile.risk_profile,
        time_frame=profile.time_frame,
        total_expenses=total_expenses,
        disposable_income=disposable_income
    )

@router.put("/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    profile = await FinancialProfile.find_one(
        FinancialProfile.user_email == current_user.email
    )
    
    if not profile:
        profile = FinancialProfile(user_email=current_user.email)
    
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()
    await profile.save()
    return {"message": "Profile updated successfully"}

@router.post("/expenses")
async def add_expense(
    expense: Expense,
    current_user: User = Depends(get_current_user)
):
    profile = await FinancialProfile.find_one(
        FinancialProfile.user_email == current_user.email
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.monthly_expenses.append(expense)
    profile.updated_at = datetime.utcnow()
    await profile.save()
    return {"message": "Expense added successfully"}

@router.delete("/expenses/{expense_index}")
async def delete_expense(
    expense_index: int,
    current_user: User = Depends(get_current_user)
):
    profile = await FinancialProfile.find_one(
        FinancialProfile.user_email == current_user.email
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if expense_index < 0 or expense_index >= len(profile.monthly_expenses):
        raise HTTPException(status_code=400, detail="Invalid expense index")
    
    profile.monthly_expenses.pop(expense_index)
    profile.updated_at = datetime.utcnow()
    await profile.save()
    return {"message": "Expense deleted successfully"}