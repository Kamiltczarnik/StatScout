#  StatScout  🏀
Your go-to scouting tool for NBA stats and trends. StatScout helps you identify profitable betting opportunities by analyzing historical data and predictive analytics.  

## Full-Stack React + FastAPI App  
A web application built with React (frontend) and FastAPI (backend).  

## Setup Instructions  

### 1. Clone the Repository  
 - git clone https://github.com/Kamiltczarnik/StatScout.git
 - cd StatScout

## 2. Backend Setup (FastAPI)  

### Set up the virtual environment  
 - cd backend
 - python -m venv venv # Create virtual environment
 - source venv/bin/activate # (Mac/Linux)
 - venv\Scripts\activate # (Windows)

### Install dependencies  
 - pip install -r requirements.txt

### Start the FastAPI server  
 - uvicorn main:app --reload

Backend is now running at:  
http://127.0.0.1:8000  

API Documentation (Swagger UI) available at:  
http://127.0.0.1:8000/docs  

## 3. Frontend Setup (React)  

### Go to the frontend folder & install dependencies  
 - cd ../frontend
 - npm install

### Start the React app  
 - npm run dev

Frontend is now running at:  
http://localhost:5173  






