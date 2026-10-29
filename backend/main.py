from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import Base, engine, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Rescue Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DonationCreate(BaseModel):
    title: str
    description: str = ""
    quantity: int
    location: str

@app.get("/")
def home():
    return {"message": "Food Rescue backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/donations")
def create_donation(data: DonationCreate, db: Session = Depends(get_db)):
    donation = models.Donation(
        title=data.title,
        description=data.description,
        quantity=data.quantity,
        location=data.location,
        status="available",
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation

@app.get("/donations")
def list_donations(db: Session = Depends(get_db)):
    return db.query(models.Donation).order_by(models.Donation.id.desc()).all()

@app.post("/donations/{donation_id}/claim")
def claim_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if donation is None:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.status != "available":
        raise HTTPException(status_code=400, detail="Donation already claimed")
    donation.status = "claimed"
    db.commit()
    db.refresh(donation)
    return donation
