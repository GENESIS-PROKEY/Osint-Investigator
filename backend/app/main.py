from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn

from app.config import settings
from app.search import router as search_router
from app.admin import router as admin_router
from app.auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    generate_fingerprint_challenge,
    generate_password_challenge,
    generate_circuit_challenge,
    get_current_user
)
from app.database import init_db, get_db
from app.models import User
from app.elasticsearch_client import create_index_if_not_exists
import logging
import secrets
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.stripe_handler import create_checkout_session, construct_event_from_payload
import stripe

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="OSINT Investigator - Search across large datasets",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Include routers
app.include_router(search_router, prefix="/api", tags=["Search"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])


# Startup event
@app.on_event("startup")
async def startup():
    logger.info("Starting up OSINT Investigator API...")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
    
    # Create Elasticsearch index if it doesn't exist (optional)
    try:
        await create_index_if_not_exists()
        logger.info("Elasticsearch index ready")
    except Exception as e:
        logger.warning(f"Elasticsearch not available: {e} - running without search functionality")


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
    next_reset: Optional[str] = None
    daily_limit: Optional[int] = None
    
    class Config:
        from_attributes = True


@app.post("/auth/register")
async def register(data: RegisterRequest, db=Depends(get_db)):
    """Register a new user with email and password."""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(data.password)
    new_user = User(
        email=data.email,
        password_hash=hashed_password,
        auth_provider="email",
        plan_type="free",
        searches_remaining=10
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate verification token
    new_user.verification_token = secrets.token_urlsafe(32)
    db.commit()

    # TODO: Send verification email via SendGrid if configured
    # Fallback: log the verification link
    logger.info(f"Verification link: {settings.FRONTEND_URL}/verify?token={new_user.verification_token}")

    # Create access token (allow login, but gate searches until verified)
    token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "plan": new_user.plan_type,
            "searches_remaining": new_user.searches_remaining
        }
    }


@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, data: LoginRequest, db=Depends(get_db)):
    """Login with email and password."""
    
    # Find user
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    
    # Create access token
    token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "plan": user.plan_type,
            "searches_remaining": user.searches_remaining
        }
    }


@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    # Compute simple next reset and daily limit per plan
    plan_limits = {
        "free": {"daily": 0, "monthly": 10},
        "pro": {"daily": 10, "monthly": 300},
        "investigator": {"daily": 50, "monthly": 1500},
        "enterprise_basic": {"daily": 100, "monthly": 99999},
        "enterprise_unlimited": {"daily": 999999, "monthly": 9999999},
    }
    limits = plan_limits.get(current_user.plan_type, {"daily": 0, "monthly": 0})
    next_reset = (current_user.searches_reset_date or datetime.utcnow()) + timedelta(days=1)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "plan_type": current_user.plan_type,
        "searches_remaining": current_user.searches_remaining,
        "is_verified": current_user.is_verified,
        "next_reset": next_reset.isoformat(),
        "daily_limit": limits["daily"],
    }

# Email verification endpoints
@app.post("/auth/request-verification")
async def request_verification(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    if current_user.is_verified:
        return {"message": "Already verified"}
    current_user.verification_token = secrets.token_urlsafe(32)
    db.commit()
    logger.info(f"Verification link: {settings.FRONTEND_URL}/verify?token={current_user.verification_token}")
    return {"message": "Verification email sent"}

@app.get("/auth/verify")
async def verify_email(token: str, db=Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "Email verified"}


# Billing: Stripe Checkout
class CheckoutRequest(BaseModel):
    plan_key: str  # 'pro' | 'investigator' | 'enterprise_basic'
    success_url: str
    cancel_url: str


@app.post("/billing/create-checkout-session")
async def billing_checkout(data: CheckoutRequest, current_user: User = Depends(get_current_user)):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=400, detail="Stripe not configured")
    session = await create_checkout_session(
        plan_key=data.plan_key,
        customer_email=current_user.email,
        success_url=data.success_url,
        cancel_url=data.cancel_url,
    )
    return session


@app.post("/billing/webhook")
async def stripe_webhook(request: Request, db=Depends(get_db)):
    payload = await request.body()
    sig = request.headers.get('stripe-signature', '')
    try:
        event = construct_event_from_payload(payload, sig)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    event_type = event.get("type")
    obj = event.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        email = obj.get("customer_details", {}).get("email")
        plan_key = obj.get("metadata", {}).get("plan_key")
        subscription_id = obj.get("subscription")
        customer_id = obj.get("customer")
        if email and plan_key:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.plan_type = plan_key
                user.searches_remaining = 0  # will be refilled on reset job
                user.stripe_customer_id = customer_id
                user.stripe_subscription_id = subscription_id
                db.commit()

    elif event_type == "invoice.payment_succeeded":
        # Could refill monthly counters here
        pass

    elif event_type in ("customer.subscription.deleted", "customer.subscription.canceled"):
        customer_id = obj.get("customer")
        if customer_id:
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.plan_type = "free"
                user.stripe_subscription_id = None
                db.commit()

    return {"received": True}


# Mini-game challenge endpoints
@app.get("/auth/challenge/fingerprint")
async def get_fingerprint_challenge():
    """Get a fingerprint matching challenge."""
    challenge = generate_fingerprint_challenge()
    return challenge


@app.get("/auth/challenge/password")
async def get_password_challenge():
    """Get a password slot challenge."""
    challenge = generate_password_challenge()
    return challenge


@app.get("/auth/challenge/circuit")
async def get_circuit_challenge():
    """Get a circuit puzzle challenge."""
    challenge = generate_circuit_challenge()
    return challenge


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
