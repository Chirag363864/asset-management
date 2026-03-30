from fastapi import APIRouter, Depends, HTTPException
from app.auth.routes import get_current_user
from app.auth.models import User
from .models import Portfolio, Investment, AddInvestment, PortfolioSummary, InvestmentPerformance
from datetime import datetime
from typing import List
import random

router = APIRouter()

@router.get("/", response_model=Portfolio)
async def get_portfolio(current_user: User = Depends(get_current_user)):
    portfolio = await Portfolio.find_one(Portfolio.user_email == current_user.email)
    
    if not portfolio:
        portfolio = Portfolio(
            user_email=current_user.email,
            investments=[],
            total_invested=0.0,
            current_value=0.0
        )
        await portfolio.insert()
    
    # Update current prices (mock implementation)
    await update_portfolio_values(portfolio)
    
    return portfolio

@router.post("/investment")
async def add_investment(
    investment_data: AddInvestment,
    current_user: User = Depends(get_current_user)
):
    portfolio = await Portfolio.find_one(Portfolio.user_email == current_user.email)
    
    if not portfolio:
        portfolio = Portfolio(user_email=current_user.email)
    
    new_investment = Investment(
        symbol=investment_data.symbol,
        name=investment_data.name,
        quantity=investment_data.quantity,
        purchase_price=investment_data.purchase_price,
        current_price=investment_data.purchase_price,  # Initially same as purchase price
        investment_type=investment_data.investment_type
    )
    
    portfolio.investments.append(new_investment)
    
    # Recalculate portfolio values
    await update_portfolio_values(portfolio)
    await portfolio.save()
    
    return {"message": "Investment added successfully"}

@router.delete("/investment/{symbol}")
async def remove_investment(
    symbol: str,
    current_user: User = Depends(get_current_user)
):
    portfolio = await Portfolio.find_one(Portfolio.user_email == current_user.email)
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Find and remove the investment
    portfolio.investments = [inv for inv in portfolio.investments if inv.symbol != symbol.upper()]
    
    # Recalculate portfolio values
    await update_portfolio_values(portfolio)
    await portfolio.save()
    
    return {"message": f"Investment {symbol} removed successfully"}

@router.get("/summary", response_model=PortfolioSummary)
async def get_portfolio_summary(current_user: User = Depends(get_current_user)):
    portfolio = await Portfolio.find_one(Portfolio.user_email == current_user.email)
    
    if not portfolio or not portfolio.investments:
        return PortfolioSummary(
            total_invested=0.0,
            current_value=0.0,
            total_return=0.0,
            return_percentage=0.0,
            investment_count=0
        )
    
    await update_portfolio_values(portfolio)
    
    # Find top and worst performers
    performances = []
    for inv in portfolio.investments:
        return_pct = ((inv.current_price - inv.purchase_price) / inv.purchase_price) * 100
        performances.append((inv.symbol, return_pct))
    
    performances.sort(key=lambda x: x[1], reverse=True)
    top_performer = performances[0][0] if performances else None
    worst_performer = performances[-1][0] if performances else None
    
    return PortfolioSummary(
        total_invested=portfolio.total_invested,
        current_value=portfolio.current_value,
        total_return=portfolio.total_return,
        return_percentage=portfolio.return_percentage,
        investment_count=len(portfolio.investments),
        top_performer=top_performer,
        worst_performer=worst_performer
    )

@router.get("/performance", response_model=List[InvestmentPerformance])
async def get_investment_performance(current_user: User = Depends(get_current_user)):
    portfolio = await Portfolio.find_one(Portfolio.user_email == current_user.email)
    
    if not portfolio:
        return []
    
    await update_portfolio_values(portfolio)
    
    performances = []
    for inv in portfolio.investments:
        total_value = inv.quantity * inv.current_price
        return_amount = total_value - (inv.quantity * inv.purchase_price)
        return_percentage = ((inv.current_price - inv.purchase_price) / inv.purchase_price) * 100
        
        performances.append(InvestmentPerformance(
            symbol=inv.symbol,
            name=inv.name,
            quantity=inv.quantity,
            purchase_price=inv.purchase_price,
            current_price=inv.current_price,
            total_value=total_value,
            return_amount=return_amount,
            return_percentage=return_percentage,
            investment_type=inv.investment_type
        ))
    
    return performances

async def update_portfolio_values(portfolio: Portfolio):
    """Update current prices and calculate portfolio values (mock implementation)"""
    total_invested = 0.0
    current_value = 0.0
    
    for investment in portfolio.investments:
        # Mock price update (in real implementation, fetch from stock API)
        price_change = random.uniform(-0.1, 0.1)  # -10% to +10% change
        investment.current_price = investment.purchase_price * (1 + price_change)
        
        total_invested += investment.quantity * investment.purchase_price
        current_value += investment.quantity * investment.current_price
    
    portfolio.total_invested = total_invested
    portfolio.current_value = current_value
    portfolio.total_return = current_value - total_invested
    portfolio.return_percentage = ((current_value - total_invested) / total_invested * 100) if total_invested > 0 else 0.0
    portfolio.updated_at = datetime.utcnow()