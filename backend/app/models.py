from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for OAuth users
    auth_provider = Column(String, default="email")  # email, google, github, apple
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    plan_type = Column(String, default="free")  # free, pro, investigator, enterprise_basic, enterprise_unlimited
    searches_remaining = Column(Integer, default=10)
    searches_reset_date = Column(DateTime, default=datetime.utcnow)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    api_key = Column(String, unique=True, nullable=True)
    
    team = relationship("Team", back_populates="members")
    search_logs = relationship("SearchLog", back_populates="user")


class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    plan_type = Column(String, default="enterprise_basic")
    total_searches = Column(Integer, default=100)
    limit_allocation = Column(String, default="shared")  # shared or individual
    custom_limits = Column(JSON, nullable=True)  # {"user_id": limit}
    admin_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("User", back_populates="team")


class SearchLog(Base):
    __tablename__ = "search_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query = Column(String, nullable=False)
    data_type = Column(String, nullable=True)  # All, email, phone, etc.
    results_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="search_logs")
