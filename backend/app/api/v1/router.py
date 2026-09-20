"""API v1 Router aggregation."""

from fastapi import APIRouter
from .endpoints import attendance

api_router = APIRouter()
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
