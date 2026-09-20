"""Attendance Endpoints for face verification and check-in logs."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from pydantic import BaseModel

router = APIRouter()


class AttendanceRecord(BaseModel):
    user_id: str
    user_name: str
    timestamp: datetime
    confidence: float
    status: str


class VerifyResponse(BaseModel):
    matched: bool
    user_id: Optional[str] = None
    confidence: float = 0.0
    message: str


# In-memory mock database store
MOCK_ATTENDANCE_DB: List[AttendanceRecord] = []


@router.get("/logs", response_model=List[AttendanceRecord])
async def get_attendance_logs():
    """Retrieve list of recent attendance logs."""
    return MOCK_ATTENDANCE_DB


@router.post("/verify", response_model=VerifyResponse)
async def verify_face(file: UploadFile = File(...)):
    """Upload face image frame to verify identity and record attendance."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not a valid image."
        )

    # Placeholder for face recognition & liveness check logic
    return VerifyResponse(
        matched=True,
        user_id="EMP-001",
        confidence=0.98,
        message="Face successfully verified and check-in logged."
    )
