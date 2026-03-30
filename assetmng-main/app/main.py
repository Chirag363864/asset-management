from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.investments.routes import router as investments_router
from app.stocks.routes import router as stocks_router
from app.portfolio.routes import router as portfolio_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown - cleanup if needed

app = FastAPI(
    title="Personal Finance & Investment Advisor",
    description="A comprehensive platform for financial management and investment advice",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(investments_router, prefix="/investments", tags=["Investments"])
app.include_router(stocks_router, prefix="/stocks", tags=["Stocks"])
app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])

@app.get("/")
async def root():
    return {"message": "Personal Finance & Investment Advisor API"}