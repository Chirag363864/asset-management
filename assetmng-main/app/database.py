import motor.motor_asyncio
from beanie import init_beanie
from app.auth.models import User
from app.users.models import FinancialProfile
from app.portfolio.models import Portfolio
import os
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
            serverSelectionTimeoutMS=5000
        )
        
        database = client.finance_db
        
        # Beanie 2.0 initialization - only Document classes, not BaseModel
        await init_beanie(
            database=database,
            document_models=[User, FinancialProfile, Portfolio],
            allow_index_dropping=True
        )
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        raise