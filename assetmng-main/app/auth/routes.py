from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from .models import User, UserCreate, UserLogin, Token, UserResponse
import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    # Always pre-hash with SHA256 to handle any password length
    password_hash = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return bcrypt.checkpw(password_hash.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    # Always pre-hash with SHA256 to handle any password length and avoid bcrypt 72-byte limit
    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    # Now hash with bcrypt - the SHA256 output is always 64 chars, well under 72 byte limit
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_hash.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await User.find_one(User.email == email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    print(f"🔵 Signup attempt - Email: {user_data.email}, Name: {user_data.name}")
    
    try:
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            print(f"❌ User {user_data.email} already exists")
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        print(f"🔵 Hashing password...")
        try:
            with open("d:/Vs code/Banking Fraud/hash_debug.log", "a") as f:
                f.write(f"\n=== HASHING ATTEMPT ===\n")
                f.write(f"Password: {user_data.password}\n")
            hashed_password = get_password_hash(user_data.password)
            with open("d:/Vs code/Banking Fraud/hash_debug.log", "a") as f:
                f.write(f"Success! Hash: {hashed_password}\n")
        except Exception as hash_err:
            with open("d:/Vs code/Banking Fraud/hash_debug.log", "a") as f:
                import traceback
                f.write(f"ERROR: {str(hash_err)}\n")
                f.write(traceback.format_exc())
            raise
        
        print(f"🔵 Creating user document...")
        user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=hashed_password
        )
        
        print(f"🔵 Inserting user into database...")
        await user.insert()
        
        print(f"✅ User created successfully: {user.email}")
        
        return UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            risk_profile=user.risk_profile,
            created_at=user.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Signup error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Signup failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        risk_profile=current_user.risk_profile,
        created_at=current_user.created_at
    )