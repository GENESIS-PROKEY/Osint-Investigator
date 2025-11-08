from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "OSINT Investigator"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./osint.db"
    
    # Elasticsearch
    ELASTICSEARCH_HOST: str = "http://localhost:9200"
    ELASTICSEARCH_INDEX: str = "osint_data"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Stripe (for payments)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Email (SendGrid - optional for now)
    SENDGRID_API_KEY: Optional[str] = None
    FROM_EMAIL: str = "noreply@osintinvestigator.com"
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Admin
    ADMIN_EMAIL: str = "admin@osintinvestigator.com"
    
    class Config:
        env_file = ".env"


settings = Settings()
