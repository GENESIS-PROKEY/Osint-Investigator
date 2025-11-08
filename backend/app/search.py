from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from app.elasticsearch_client import search_data, get_index_stats
from app.auth import get_current_user
from app.models import User, SearchLog
from app.database import get_db
from slowapi.util import get_remote_address
from slowapi import Limiter
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


class SearchQuery(BaseModel):
    query: str
    type: Optional[str] = None  # email, phone, username, vehicle, upi, or None for all


@router.get("/search")
@limiter.limit("30/minute")
async def search(
    request: Request,
    q: str,
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for data across all or specific types.
    Results are grouped by data type for step-by-step display.
    """
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")
    
    # Require verified email
    if not current_user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before searching")

    # Check if user has searches remaining
    if current_user.searches_remaining <= 0:
        raise HTTPException(
            status_code=403,
            detail="Search limit reached. Please upgrade your plan."
        )
    
    # Validate type if provided
    valid_types = ["email", "phone", "username", "vehicle", "upi"]
    if type and type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(valid_types)}")
    
    try:
        # Search Elasticsearch
        results = await search_data(q, type)
        
        # Calculate total results
        total_results = sum(len(v) for v in results.values())
        
        # Log search
        search_log = SearchLog(
            user_id=current_user.id,
            query=q,
            data_type=type,
            results_count=total_results,
            timestamp=datetime.utcnow()
        )
        db.add(search_log)
        
        # Decrement search count
        current_user.searches_remaining -= 1
        db.commit()
        
        # Ensure all data types are represented even if empty
        all_types = ["email", "phone", "username", "vehicle", "upi"]
        formatted_results = {}
        
        for dtype in all_types:
            if dtype in results:
                formatted_results[dtype] = {
                    "count": len(results[dtype]),
                    "results": results[dtype][:10]  # Limit to top 10 per type
                }
            else:
                formatted_results[dtype] = {
                    "count": 0,
                    "results": []
                }
        
        return {
            "query": q,
            "type": type or "all",
            "total_results": total_results,
            "results_by_type": formatted_results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    """Get Elasticsearch index statistics."""
    try:
        stats = await get_index_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")
