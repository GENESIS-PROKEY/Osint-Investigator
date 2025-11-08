from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import secrets
import random

from app.config import settings
from app.models import User
from app.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get the current authenticated user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Query database for user
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user


def generate_api_key() -> str:
    """Generate a unique API key."""
    return secrets.token_urlsafe(32)


# Mini-game challenge generation
def generate_fingerprint_challenge():
    """Generate a fingerprint matching challenge."""
    fingerprints = [f"fingerprint_{i}" for i in range(8)]
    target = random.choice(fingerprints)
    return {
        "fingerprints": fingerprints,
        "target": target,
        "challenge_id": secrets.token_urlsafe(16)
    }


def generate_password_challenge():
    """Generate a password slot challenge."""
    slots = 6
    correct_positions = [random.randint(0, 35) for _ in range(slots)]
    return {
        "slots": slots,
        "correct_positions": correct_positions,
        "challenge_id": secrets.token_urlsafe(16)
    }


def generate_circuit_challenge():
    """Generate a circuit puzzle challenge."""
    nodes = ["lightning", "connector_1", "connector_2", "connector_3", "lock"]
    connections = [
        {"from": "lightning", "to": "connector_1", "type": "L"},
        {"from": "connector_1", "to": "connector_2", "type": "T"},
        {"from": "connector_2", "to": "connector_3", "type": "L"},
        {"from": "connector_3", "to": "lock", "type": "T"}
    ]
    return {
        "nodes": nodes,
        "connections": connections,
        "challenge_id": secrets.token_urlsafe(16)
    }


def validate_challenge_solution(challenge_type: str, challenge_id: str, user_solution: dict) -> bool:
    """Validate a mini-game challenge solution."""
    # For MVP, accept all solutions - in production, validate against stored challenge
    # This is a placeholder for the validation logic
    return True
