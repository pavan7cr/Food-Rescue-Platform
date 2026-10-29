# Food Rescue Platform

A full-stack web app that connects surplus food donors with nonprofits.

## Problem
Restaurants and grocery stores throw away edible food every day, while nearby shelters need it. There is no simple way to post surplus food and claim it quickly.

## Features
- Donors post surplus food with title, description, quantity, and location
- Nonprofits browse all donations, newest first
- Nonprofits claim a donation, changing its status from available to claimed
- Claimed donations cannot be claimed again, with a 400 error on a second claim

## Tech Stack
- Backend: Python, FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, JavaScript
- Tools: Uvicorn, npm, Git

## Project Structure
- backend/ - FastAPI app, database models, and APIs
- frontend/ - React app

## How to Run the Backend
1. cd backend
2. python3 -m venv venv
3. source venv/bin/activate
4. pip install -r requirements.txt
5. uvicorn main:app --reload
Backend runs at http://127.0.0.1:8000
API docs at http://127.0.0.1:8000/docs

## How to Run the Frontend
1. cd frontend
2. npm install
3. npm run dev
Frontend runs at http://localhost:5173

## API Endpoints
- GET / - backend health message
- GET /health - ok status
- POST /donations - create a donation
- GET /donations - list donations, newest first
- POST /donations/{id}/claim - claim a donation
