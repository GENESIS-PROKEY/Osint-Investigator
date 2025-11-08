"""
Admin endpoints for data management, user management, and analytics
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.models import User
from app.database import get_db
import threading
import time
import pandas as pd
from app.elasticsearch_client import bulk_index_data

jobs = {}

router = APIRouter()


@router.post("/upload-data")
async def upload_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload Excel/CSV file or JSON data to Elasticsearch."""
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    content = await file.read()
    job_id = f"job_{int(time.time()*1000)}"
    jobs[job_id] = {"status": "running", "processed": 0, "total": 0}

    def worker():
        try:
            from io import BytesIO
            df = pd.read_excel(BytesIO(content)) if file.filename.lower().endswith(('.xlsx', '.xls')) else pd.read_csv(BytesIO(content))
            required = ['type', 'value']
            for col in required:
                if col not in df.columns:
                    jobs[job_id] = {"status": "failed", "error": f"Missing column: {col}"}
                    return
            total = len(df)
            jobs[job_id]["total"] = total
            batch = []
            for idx, row in df.iterrows():
                doc = {
                    "type": str(row['type']).lower(),
                    "value": str(row['value']),
                    "source": str(row.get('source', '')),
                    "additional_info": str(row.get('additional_info', '')),
                }
                batch.append(doc)
                if len(batch) >= 1000:
                    # index chunk
                    try:
                        import asyncio
                        asyncio.run(bulk_index_data(batch))
                    except Exception:
                        pass
                    jobs[job_id]["processed"] += len(batch)
                    batch = []
            if batch:
                try:
                    import asyncio
                    asyncio.run(bulk_index_data(batch))
                except Exception:
                    pass
                jobs[job_id]["processed"] += len(batch)
            jobs[job_id]["status"] = "completed"
        except Exception as e:
            jobs[job_id] = {"status": "failed", "error": str(e)}

    threading.Thread(target=worker, daemon=True).start()
    return {"job_id": job_id}


@router.get("/users")
async def list_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all users with pagination."""
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).all()
    return {
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "plan_type": u.plan_type,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat() if u.created_at else None
            }
            for u in users
        ]
    }


@router.get("/teams")
async def list_teams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all enterprise teams."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from app.models import Team
    teams = db.query(Team).all()
    return {
        "teams": [
            {
                "id": t.id,
                "name": t.name,
                "plan_type": t.plan_type,
                "total_searches": t.total_searches,
                "limit_allocation": t.limit_allocation,
                "admin_user_id": t.admin_user_id,
                "members_count": len(t.members),
                "created_at": t.created_at.isoformat() if t.created_at else None
            }
            for t in teams
        ]
    }


@router.post("/teams")
async def create_team(
    name: str,
    plan_type: str,
    total_searches: int,
    limit_allocation: str,
    admin_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new enterprise team."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from app.models import Team
    team = Team(
        name=name,
        plan_type=plan_type,
        total_searches=total_searches,
        limit_allocation=limit_allocation,
        admin_user_id=admin_user_id
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return {"id": team.id, "name": team.name}


@router.put("/teams/{team_id}")
async def update_team(
    team_id: int,
    name: str = None,
    plan_type: str = None,
    total_searches: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update team settings."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from app.models import Team
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if name:
        team.name = name
    if plan_type:
        team.plan_type = plan_type
    if total_searches is not None:
        team.total_searches = total_searches
    
    db.commit()
    return {"message": "Team updated successfully"}


@router.post("/teams/{team_id}/members")
async def add_team_member(
    team_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a user to a team."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from app.models import Team
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.team_id = team_id
    db.commit()
    return {"message": "Member added successfully"}


@router.delete("/teams/{team_id}/members/{user_id}")
async def remove_team_member(
    team_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a user from a team."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.query(User).filter(User.id == user_id, User.team_id == team_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in team")
    
    user.team_id = None
    db.commit()
    return {"message": "Member removed successfully"}


@router.get("/analytics")
async def get_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get analytics data."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # TODO: Implement analytics
    return {"analytics": {}}


@router.get("/upload-status")
async def upload_status(job_id: str, current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]
