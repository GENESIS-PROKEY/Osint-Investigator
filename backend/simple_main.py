from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OSINT Investigator",
    description="OSINT Investigator - Search across large datasets",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "OSINT Investigator API"}

# Pydantic models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    plan_type: str
    searches_remaining: int
    is_verified: bool

# Mock user storage
users_db = {}
user_counter = 1

@app.post("/auth/register")
async def register(data: RegisterRequest):
    """Register a new user with email and password."""
    
    # Check if user already exists
    if data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    global user_counter
    new_user = {
        "id": user_counter,
        "email": data.email,
        "password": data.password,  # In real app, this would be hashed
        "plan_type": "free",
        "searches_remaining": 10,
        "is_verified": True
    }
    
    users_db[data.email] = new_user
    user_counter += 1
    
    # Mock token
    token = f"mock_token_{new_user['id']}"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "plan": new_user["plan_type"],
            "searches_remaining": new_user["searches_remaining"]
        }
    }

@app.post("/auth/login")
async def login(data: LoginRequest):
    """Login with email and password."""
    
    # Find user
    if data.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = users_db[data.email]
    
    # Verify password (in real app, this would be hashed)
    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Mock token
    token = f"mock_token_{user['id']}"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "plan": user["plan_type"],
            "searches_remaining": user["searches_remaining"]
        }
    }

@app.get("/auth/me")
async def get_current_user_info():
    """Get current user information."""
    # Mock user for testing
    return {
        "id": 1,
        "email": "test@example.com",
        "plan_type": "free",
        "searches_remaining": 10,
        "is_verified": True
    }

@app.get("/api/search")
async def search(q: str, type: Optional[str] = None):
    """Mock search endpoint."""
    # Mock search results
    mock_results = {
        "email": {
            "count": 3,
            "results": [
                {"value": f"{q}@gmail.com", "source": "gmail"},
                {"value": f"{q}@yahoo.com", "source": "yahoo"},
                {"value": f"{q}@outlook.com", "source": "outlook"}
            ]
        },
        "phone": {
            "count": 2,
            "results": [
                {"value": "+1-555-0123", "source": "phonebook"},
                {"value": "+1-555-0456", "source": "directory"}
            ]
        },
        "username": {
            "count": 1,
            "results": [
                {"value": f"@{q}", "source": "social"}
            ]
        }
    }
    
    if type and type in mock_results:
        return {"results_by_type": {type: mock_results[type]}}
    
    return {"results_by_type": mock_results}

if __name__ == "__main__":
    uvicorn.run(
        "simple_main:app",
        host="127.0.0.1",
        port=8002,
        reload=True
    )
