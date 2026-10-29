from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, default="")
    quantity = Column(Integer)
    location = Column(String)
    status = Column(String, default="available")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
