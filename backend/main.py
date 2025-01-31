from fastapi import FastAPI
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
import pandas as pd

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

def get_id(fullName):
    if(type(fullName) != str):
        return("Not a string / Name")
    players = players.get_players()
    for player in players:
        if player['full_name'] == fullName:
            return(player['id'])
    return("Name not found")