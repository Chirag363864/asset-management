from fastapi import FastAPI, HTTPException, Form, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import asyncio
from typing import Optional, List, Dict
import random
import datetime

app = FastAPI(title="Personal Finance API", version="1.0.0")

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "personal_finance_db"

# MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Collections
users_collection = database["users"]
portfolios_collection = database["portfolios"]
financial_profiles_collection = database["financial_profiles"]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models for authentication
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    id: str

class Token(BaseModel):
    access_token: str
    token_type: str

# MongoDB helper functions
async def get_user_by_email(email: str):
    """Get user from database by email"""
    return await users_collection.find_one({"email": email})

async def create_user(user_data: dict):
    """Create a new user in database"""
    result = await users_collection.insert_one(user_data)
    return result.inserted_id

async def get_user_portfolio(email: str):
    """Get user's portfolio from database"""
    portfolio = await portfolios_collection.find_one({"user_email": email})
    if not portfolio:
        # Create empty portfolio if doesn't exist
        portfolio_data = {
            "user_email": email,
            "investments": []
        }
        await portfolios_collection.insert_one(portfolio_data)
        return portfolio_data
    return portfolio

async def update_user_portfolio(email: str, investments: list):
    """Update user's portfolio in database"""
    await portfolios_collection.update_one(
        {"user_email": email},
        {"$set": {"investments": investments}},
        upsert=True
    )

async def get_user_financial_profile(email: str):
    """Get user's financial profile from database"""
    profile = await financial_profiles_collection.find_one({"user_email": email})
    if not profile:
        # Create default profile if doesn't exist
        default_profile = {
            "user_email": email,
            "monthly_salary": 100000,
            "total_expenses": 0,
            "disposable_income": 100000,
            "savings_goal": 0,
            "available_for_investment": 100000,
            "time_frame": "medium",
            "risk_profile": "moderate"
        }
        await financial_profiles_collection.insert_one(default_profile)
        return default_profile
    return profile

async def update_user_financial_profile(email: str, updates: dict):
    """Update user's financial profile in database"""
    await financial_profiles_collection.update_one(
        {"user_email": email},
        {"$set": updates},
        upsert=True
    )

# Token storage (in production, use Redis or JWT)
tokens_db = {}

def calculate_portfolio_stats(portfolio):
    """Calculate portfolio statistics"""
    total_invested = sum(inv["quantity"] * inv["purchase_price"] for inv in portfolio["investments"])
    total_current = sum(inv["quantity"] * inv["current_price"] for inv in portfolio["investments"])
    total_return = total_current - total_invested
    return_percentage = (total_return / total_invested * 100) if total_invested > 0 else 0
    
    return {
        "total_invested": total_invested,
        "current_value": total_current,
        "total_return": total_return,
        "return_percentage": return_percentage,
        "investment_count": len(portfolio["investments"])
    }

def asset_allocation(amount, time_frame, risk_profile):
    """Asset allocation algorithm based on amount, time frame, and risk profile"""
    # Determine money range tier
    if amount < 100000:
        money_range = "small"
    elif amount <= 1000000:
        money_range = "medium"
    else:
        money_range = "large"

    # Enhanced allocation matrix by time_frame, risk_profile, money_range
    allocation_matrix = {
        "short": {  # 6-18 months
            "conservative": {
                "small":   [0.40, 0.25, 0.20, 0.10, 0.00, 0.05, 0.00],
                "medium":  [0.25, 0.20, 0.20, 0.15, 0.05, 0.10, 0.05],
                "large":   [0.15, 0.15, 0.20, 0.20, 0.15, 0.10, 0.05],
            },
            "moderate": {
                "small":   [0.25, 0.20, 0.20, 0.25, 0.00, 0.10, 0.00],
                "medium":  [0.15, 0.10, 0.15, 0.30, 0.10, 0.10, 0.10],
                "large":   [0.10, 0.10, 0.15, 0.35, 0.15, 0.10, 0.05],
            },
            "aggressive": {
                "small":   [0.10, 0.10, 0.10, 0.45, 0.00, 0.10, 0.15],
                "medium":  [0.05, 0.05, 0.10, 0.40, 0.10, 0.10, 0.20],
                "large":   [0.02, 0.08, 0.10, 0.35, 0.15, 0.10, 0.20],
            }
        },
        "medium": {  # 1-3 years
            "conservative": {
                "small":   [0.30, 0.20, 0.25, 0.20, 0.00, 0.05, 0.00],
                "medium":  [0.20, 0.15, 0.25, 0.25, 0.05, 0.05, 0.05],
                "large":   [0.10, 0.10, 0.25, 0.30, 0.15, 0.05, 0.05],
            },
            "moderate": {
                "small":   [0.20, 0.15, 0.20, 0.35, 0.00, 0.05, 0.05],
                "medium":  [0.10, 0.10, 0.20, 0.40, 0.10, 0.05, 0.05],
                "large":   [0.05, 0.10, 0.20, 0.45, 0.15, 0.05, 0.00],
            },
            "aggressive": {
                "small":   [0.05, 0.10, 0.15, 0.50, 0.00, 0.10, 0.10],
                "medium":  [0.05, 0.05, 0.15, 0.50, 0.10, 0.05, 0.10],
                "large":   [0.02, 0.03, 0.15, 0.55, 0.15, 0.05, 0.05],
            }
        },
        "long": {  # 3+ years
            "conservative": {
                "small":   [0.20, 0.15, 0.30, 0.30, 0.00, 0.05, 0.00],
                "medium":  [0.15, 0.10, 0.30, 0.35, 0.05, 0.05, 0.00],
                "large":   [0.05, 0.10, 0.30, 0.40, 0.10, 0.05, 0.00],
            },
            "moderate": {
                "small":   [0.10, 0.10, 0.25, 0.45, 0.00, 0.05, 0.05],
                "medium":  [0.05, 0.10, 0.25, 0.50, 0.05, 0.05, 0.00],
                "large":   [0.05, 0.05, 0.25, 0.55, 0.10, 0.00, 0.00],
            },
            "aggressive": {
                "small":   [0.05, 0.05, 0.20, 0.60, 0.00, 0.05, 0.05],
                "medium":  [0.02, 0.03, 0.20, 0.65, 0.05, 0.05, 0.00],
                "large":   [0.01, 0.02, 0.20, 0.70, 0.07, 0.00, 0.00],
            }
        }
    }

    asset_names = [
        "FD/Savings", "Short Debt MF", "Bonds", "Stocks/MF",
        "Real Estate", "Gold", "Crypto"
    ]

    # Validate input
    if time_frame not in allocation_matrix:
        raise ValueError(f"Invalid time_frame: {time_frame}")
    if risk_profile not in allocation_matrix[time_frame]:
        raise ValueError(f"Invalid risk_profile: {risk_profile}")

    # Select percentage split
    percents = allocation_matrix[time_frame][risk_profile][money_range]
    asset_split = {asset: round(amount * pct, 2) for asset, pct in zip(asset_names, percents)}

    return {
        "allocation": asset_split,
        "percentages": {asset: round(pct * 100, 1) for asset, pct in zip(asset_names, percents)},
        "inputs": {"amount": amount, "time_frame": time_frame, "risk_profile": risk_profile, "money_range": money_range}
    }

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token not in tokens_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    email = tokens_db[token]
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@app.get("/")
async def root():
    return {"message": "Personal Finance API is running!", "status": "success"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Personal Finance API"}

@app.post("/auth/signup")
async def signup(user: UserSignup):
    print(f"Signup attempt - Email: {user.email}, Name: {user.name}")
    
    # Check if user already exists
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        print(f"User {user.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Store user (in production, hash the password)
    user_data = {
        "name": user.name,
        "email": user.email,
        "password": user.password,  # In production, hash this!
        "created_at": datetime.datetime.utcnow()
    }
    user_id = await create_user(user_data)
    
    print(f"User created successfully: {user.email}")
    
    return {
        "message": "User created successfully",
        "user": {
            "id": str(user_id),
            "name": user.name,
            "email": user.email
        }
    }

@app.post("/auth/login")
async def login(username: str = Form(...), password: str = Form(...)):
    print(f"Login attempt - Username: {username}, Password: {password}")
    
    # Check if user exists and password matches
    user = await get_user_by_email(username)
    if not user:
        print(f"User {username} not found in database")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if user["password"] != password:
        print(f"Password mismatch for user {username}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create mock token (in production, use JWT)
    token = f"mock_token_for_{username}_{len(tokens_db)}"
    tokens_db[token] = username
    
    print(f"Login successful for {username}, token: {token}")
    return {
        "access_token": token,
        "token_type": "bearer"
    }

# Debug endpoint to see registered users
@app.get("/debug/users")
async def debug_users():
    users = []
    async for user in users_collection.find({}):
        users.append({
            "name": user["name"],
            "email": user["email"],
            "created_at": user.get("created_at", "N/A")
        })
    
    return {
        "users": [user["email"] for user in users],
        "total_users": len(users),
        "user_details": users
    }

@app.get("/auth/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"]
    }

@app.get("/users/profile")
async def get_financial_profile(current_user: dict = Depends(get_current_user)):
    profile = await get_user_financial_profile(current_user["email"])
    return {
        "user_email": current_user["email"],
        "monthly_salary": profile["monthly_salary"],
        "total_expenses": profile["total_expenses"],
        "monthly_expenses": profile.get("expense_breakdown", []),
        "savings_goal": profile["savings_goal"],
        "risk_profile": profile["risk_profile"],
        "time_frame": profile["time_frame"],
        "disposable_income": profile["monthly_salary"] - profile["total_expenses"],
        "available_for_investment": profile["available_for_investment"]
    }

@app.get("/portfolio/")
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    portfolio = await get_user_portfolio(current_user["email"])
    stats = calculate_portfolio_stats(portfolio)
    
    return {
        "investments": portfolio["investments"],
        **stats
    }

@app.get("/portfolio/summary")
async def get_portfolio_summary(current_user: dict = Depends(get_current_user)):
    portfolio = await get_user_portfolio(current_user["email"])
    stats = calculate_portfolio_stats(portfolio)
    
    # Find top and worst performers
    top_performer = None
    worst_performer = None
    
    if portfolio["investments"]:
        investments_with_return = []
        for inv in portfolio["investments"]:
            return_pct = ((inv["current_price"] - inv["purchase_price"]) / inv["purchase_price"]) * 100
            investments_with_return.append((inv["symbol"], return_pct))
        
        if investments_with_return:
            top_performer = max(investments_with_return, key=lambda x: x[1])[0]
            worst_performer = min(investments_with_return, key=lambda x: x[1])[0]
    
    return {
        **stats,
        "top_performer": top_performer,
        "worst_performer": worst_performer
    }

@app.post("/portfolio/investment")
async def add_investment(
    investment: dict,
    current_user: dict = Depends(get_current_user)
):
    print(f"Adding investment for user {current_user['email']}: {investment}")
    
    portfolio = await get_user_portfolio(current_user["email"])
    
    # Create new investment with current price defaulting to purchase price
    new_investment = {
        "symbol": investment.get("symbol").upper(),
        "name": investment.get("name"),
        "quantity": float(investment.get("quantity")),
        "purchase_price": float(investment.get("purchase_price")),
        "current_price": float(investment.get("purchase_price")),  # Start with purchase price
        "investment_type": investment.get("investment_type", "stock")
    }
    
    # Add to user's portfolio
    portfolio["investments"].append(new_investment)
    
    # Update database
    await update_user_portfolio(current_user["email"], portfolio["investments"])
    
    print(f"Investment added successfully. Portfolio now has {len(portfolio['investments'])} investments")
    
    return {
        "message": "Investment added successfully",
        "investment": new_investment
    }

@app.delete("/portfolio/investment/{symbol}")
async def remove_investment(symbol: str, current_user: dict = Depends(get_current_user)):
    print(f"Removing investment {symbol} for user {current_user['email']}")
    
    portfolio = get_user_portfolio(current_user["email"])
    
    # Remove investment by symbol
    original_count = len(portfolio["investments"])
    portfolio["investments"] = [inv for inv in portfolio["investments"] if inv["symbol"] != symbol.upper()]
    
    if len(portfolio["investments"]) < original_count:
        print(f"Investment {symbol} removed successfully")
        return {"message": f"Investment {symbol} removed successfully"}
    else:
        print(f"Investment {symbol} not found")
        raise HTTPException(status_code=404, detail=f"Investment {symbol} not found")

@app.get("/portfolio/performance")
async def get_portfolio_performance(current_user: dict = Depends(get_current_user)):
    portfolio = await get_user_portfolio(current_user["email"])
    
    # Calculate performance for each investment
    performance_data = []
    for inv in portfolio["investments"]:
        total_value = inv["quantity"] * inv["current_price"]
        total_invested = inv["quantity"] * inv["purchase_price"]
        return_amount = total_value - total_invested
        return_percentage = (return_amount / total_invested * 100) if total_invested > 0 else 0
        
        performance_data.append({
            "symbol": inv["symbol"],
            "name": inv["name"],
            "quantity": inv["quantity"],
            "purchase_price": inv["purchase_price"],
            "current_price": inv["current_price"],
            "total_value": total_value,
            "return_amount": return_amount,
            "return_percentage": return_percentage,
            "investment_type": inv["investment_type"]
        })
    
    return performance_data

# Additional expense management endpoints
class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: str = ""

class ProfileUpdate(BaseModel):
    monthly_salary: float = None
    risk_profile: str = None

@app.put("/users/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    profile = await get_user_financial_profile(current_user["email"])
    
    # Update fields if provided
    updates = {}
    if profile_data.monthly_salary is not None:
        updates["monthly_salary"] = profile_data.monthly_salary
        profile["monthly_salary"] = profile_data.monthly_salary
    if profile_data.risk_profile is not None:
        updates["risk_profile"] = profile_data.risk_profile
        profile["risk_profile"] = profile_data.risk_profile
    
    # Calculate available for investment (salary - expenses - savings goal)
    disposable_income = profile["monthly_salary"] - profile["total_expenses"]
    updates["available_for_investment"] = max(0, disposable_income - profile.get("savings_goal", 0))
    profile["available_for_investment"] = updates["available_for_investment"]
    
    # Save to database
    await update_user_financial_profile(current_user["email"], updates)
    
    return {
        "message": "Profile updated successfully",
        "user_email": current_user["email"],
        "monthly_salary": profile["monthly_salary"],
        "risk_profile": profile["risk_profile"],
        "disposable_income": disposable_income,
        "available_for_investment": profile["available_for_investment"]
    }

# New endpoint for updating investment preferences
class InvestmentPreferences(BaseModel):
    time_frame: str
    risk_profile: str

@app.put("/users/investment-preferences")
async def update_investment_preferences(
    preferences: InvestmentPreferences,
    current_user: dict = Depends(get_current_user)
):
    updates = {
        "time_frame": preferences.time_frame,
        "risk_profile": preferences.risk_profile
    }
    await update_user_financial_profile(current_user["email"], updates)
    
    return {
        "message": "Investment preferences updated successfully",
        "time_frame": preferences.time_frame,
        "risk_profile": preferences.risk_profile
    }

class ExpensesSummary(BaseModel):
    total_expenses: float

# New endpoint for updating expenses
@app.put("/users/expenses-summary")
async def update_expenses_summary(
    expenses: ExpensesSummary,
    current_user: dict = Depends(get_current_user)
):
    profile = await get_user_financial_profile(current_user["email"])
    
    # Recalculate available for investment
    disposable_income = profile["monthly_salary"] - expenses.total_expenses
    available_for_investment = max(0, disposable_income - profile.get("savings_goal", 0))
    
    updates = {
        "total_expenses": expenses.total_expenses,
        "available_for_investment": available_for_investment
    }
    await update_user_financial_profile(current_user["email"], updates)
    
    return {
        "message": "Expenses updated successfully",
        "total_expenses": expenses.total_expenses,
        "disposable_income": disposable_income,
        "available_for_investment": available_for_investment
    }

@app.post("/users/expenses")
async def add_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user)
):
    # In a real app, save to database
    return {
        "message": "Expense added successfully",
        "expense": {
            "category": expense.category,
            "amount": expense.amount,
            "description": expense.description
        }
    }

@app.delete("/users/expenses/{expense_index}")
async def delete_expense(expense_index: int, current_user: dict = Depends(get_current_user)):
    return {"message": f"Expense {expense_index} deleted successfully"}

@app.get("/stocks/live")
async def get_live_stocks():
    return {
        "stocks": [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.23, "change": 2.45, "change_percent": "+1.42%"},
            {"symbol": "MSFT", "name": "Microsoft", "price": 378.85, "change": 5.23, "change_percent": "+1.40%"},
            {"symbol": "GOOGL", "name": "Alphabet", "price": 2847.92, "change": -12.45, "change_percent": "-0.43%"},
            {"symbol": "TSLA", "name": "Tesla", "price": 248.50, "change": 8.75, "change_percent": "+3.65%"},
            {"symbol": "AMZN", "name": "Amazon", "price": 3342.88, "change": 15.20, "change_percent": "+0.46%"}
        ]
    }

@app.get("/investments/recommendations")
async def get_investment_recommendations(current_user: dict = Depends(get_current_user)):
    profile = await get_user_financial_profile(current_user["email"])
    
    # Check if user has enough data for recommendations
    if profile["monthly_salary"] <= 0:
        return {
            "message": "Please update your monthly salary first",
            "has_recommendations": False
        }
    
    disposable_income = profile["monthly_salary"] - profile["total_expenses"]
    available_amount = max(0, disposable_income - profile.get("savings_goal", 0))
    
    if available_amount <= 0:
        return {
            "message": "No funds available for investment. Consider reducing expenses or adjusting savings goal.",
            "has_recommendations": False,
            "disposable_income": disposable_income,
            "available_amount": 0
        }
    
    # Get asset allocation recommendation
    try:
        allocation_result = asset_allocation(
            amount=available_amount,
            time_frame=profile["time_frame"],
            risk_profile=profile["risk_profile"]
        )
        
        # Convert to format expected by frontend
        recommendations = []
        for asset, amount in allocation_result["allocation"].items():
            if amount > 0:  # Only include assets with non-zero allocation
                recommendations.append({
                    "category": asset,
                    "amount": amount,
                    "percentage": allocation_result["percentages"][asset]
                })
        
        return {
            "has_recommendations": True,
            "risk_profile": profile["risk_profile"],
            "time_frame": profile["time_frame"],
            "available_amount": available_amount,
            "disposable_income": disposable_income,
            "money_range": allocation_result["inputs"]["money_range"],
            "recommendations": recommendations,
            "message": f"Based on your {profile['risk_profile']} risk profile and {profile['time_frame']}-term investment horizon"
        }
        
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {
            "message": "Error generating recommendations. Please check your preferences.",
            "has_recommendations": False
        }

@app.get("/api/stocks/trending")
async def get_trending_stocks():
    # Mock data for testing
    return {
        "trending_stocks": [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 150.00, "change": "+2.5%"},
            {"symbol": "MSFT", "name": "Microsoft", "price": 300.00, "change": "+1.8%"},
            {"symbol": "GOOGL", "name": "Alphabet", "price": 2500.00, "change": "+3.2%"},
            {"symbol": "TSLA", "name": "Tesla", "price": 800.00, "change": "-1.5%"},
            {"symbol": "AMZN", "name": "Amazon", "price": 3200.00, "change": "+0.9%"}
        ]
    }

@app.get("/api/investments/recommendations")
async def get_investment_recommendations():
    # Mock investment recommendations
    return {
        "recommendations": {
            "conservative": {
                "bonds": 60,
                "stocks": 30,
                "cash": 10
            },
            "moderate": {
                "bonds": 40,
                "stocks": 50,
                "cash": 10
            },
            "aggressive": {
                "bonds": 20,
                "stocks": 70,
                "cash": 10
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)