from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import playergamelog, playercareerstats, commonplayerinfo
from nba_api.stats.static import players
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import requests
import os
from datetime import datetime, timedelta

load_dotenv()  # Load environment variables from .env file
app = FastAPI(title="NBA Stats API", description="API for NBA player statistics and trends")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("ODDS_API_KEY")
ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/"

@app.get("/")
def read_root():
    return {"message": "Welcome to the NBA Stats API!"}

def get_id(full_name: str):
    if not isinstance(full_name, str):
        return "Invalid input, name should be a string"
    player_list = players.get_players()
    for player in player_list:
        if player['full_name'].lower() == full_name.lower():
            return player['id']
    return "Player not found"

@app.get("/players/search/{query}")
def search_players(query: str):
    """Search for players by name"""
    player_list = players.get_players()
    results = []
    
    for player in player_list:
        if query.lower() in player['full_name'].lower():
            results.append(player)
    
    if not results:
        raise HTTPException(status_code=404, detail="No players found matching the query")
    
    return results

@app.get("/players/{player_id}/info")
def get_player_info(player_id: int):
    """Get detailed information about a player"""
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id).get_data_frames()[0]
        return info.to_dict(orient='records')[0]
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error fetching player info: {str(e)}")

@app.get("/players/name/{player_name}/info")
def get_player_info_by_name(player_name: str):
    """Get detailed information about a player by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_info(player_id)

@app.get("/players/{player_id}/games")
def get_player_games(player_id: int, season: str = "2023-24", last_n: Optional[int] = None):
    """Get game logs for a player with optional filtering"""
    try:
        game_log = playergamelog.PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
        
        if game_log.empty:
            raise HTTPException(status_code=404, detail="No game data found")
        
        if last_n:
            game_log = game_log.head(last_n)
        
        return game_log.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error fetching game logs: {str(e)}")

@app.get("/players/name/{player_name}/games")
def get_player_games_by_name(player_name: str, season: str = "2023-24", last_n: Optional[int] = None):
    """Get game logs for a player by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_games(player_id, season, last_n)

@app.get("/last30games/{player_name}")
def get_last_30_games(player_name: str):
    """Get the last 30 games for a player"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    game_log = playergamelog.PlayerGameLog(player_id=player_id, season='2023-24').get_data_frames()[0]
    
    if game_log.empty:
        raise HTTPException(status_code=404, detail="No game data found")
    
    last_30_games = game_log.head(30)  # Get the most recent 30 games
    points = last_30_games[['GAME_DATE', 'MATCHUP','PTS', 'AST', 'REB', 'STL', 'BLK', 'FG3M']]
    return points.to_dict(orient='records')

@app.get("/players/{player_id}/trends")
def get_player_trends(player_id: int, stat: str = "PTS", window: int = 5, season: str = "2023-24"):
    """
    Analyze trends in a player's performance
    
    - stat: The statistic to analyze (PTS, AST, REB, etc.)
    - window: The rolling window size for trend analysis
    """
    try:
        game_log = playergamelog.PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
        
        if game_log.empty:
            raise HTTPException(status_code=404, detail="No game data found")
        
        # Ensure the stat exists
        if stat not in game_log.columns:
            raise HTTPException(status_code=400, detail=f"Statistic '{stat}' not found")
        
        # Calculate rolling averages
        game_log['ROLLING_AVG'] = game_log[stat].rolling(window=window, min_periods=1).mean()
        
        # Calculate trend (positive or negative)
        game_log['TREND'] = game_log['ROLLING_AVG'].diff().apply(lambda x: 'up' if x > 0 else ('down' if x < 0 else 'stable'))
        
        # Calculate percentage change
        game_log['PCT_CHANGE'] = game_log[stat].pct_change() * 100
        
        # Replace NaN values
        game_log = game_log.fillna(0)
        
        # Select relevant columns
        result = game_log[['GAME_DATE', 'MATCHUP', stat, 'ROLLING_AVG', 'TREND', 'PCT_CHANGE']]
        
        return result.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error analyzing trends: {str(e)}")

@app.get("/players/name/{player_name}/trends")
def get_player_trends_by_name(player_name: str, stat: str = "PTS", window: int = 5, season: str = "2023-24"):
    """Analyze trends in a player's performance by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_trends(player_id, stat, window, season)

@app.get("/players/{player_id}/comparison")
def get_player_comparison(
    player_id: int, 
    stat: str = "PTS", 
    season: str = "2023-24",
    vs_season: str = "2022-23"
):
    """Compare a player's performance between two seasons"""
    try:
        # Get current season data
        current_season = playergamelog.PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
        
        # Get previous season data
        previous_season = playergamelog.PlayerGameLog(player_id=player_id, season=vs_season).get_data_frames()[0]
        
        if current_season.empty or previous_season.empty:
            raise HTTPException(status_code=404, detail="Game data not found for one or both seasons")
        
        # Calculate averages
        current_avg = current_season[stat].mean()
        previous_avg = previous_season[stat].mean()
        
        # Calculate improvement percentage
        improvement_pct = ((current_avg - previous_avg) / previous_avg) * 100 if previous_avg != 0 else 0
        
        return {
            "current_season": season,
            "current_avg": current_avg,
            "previous_season": vs_season,
            "previous_avg": previous_avg,
            "improvement_pct": improvement_pct,
            "trend": "up" if improvement_pct > 0 else "down" if improvement_pct < 0 else "stable"
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error comparing seasons: {str(e)}")

@app.get("/players/name/{player_name}/comparison")
def get_player_comparison_by_name(
    player_name: str, 
    stat: str = "PTS", 
    season: str = "2023-24",
    vs_season: str = "2022-23"
):
    """Compare a player's performance between two seasons by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_comparison(player_id, stat, season, vs_season)

@app.get("/players/{player_id}/hot-zones")
def get_player_hot_zones(player_id: int, stat: str = "PTS", season: str = "2023-24", threshold: float = 0):
    """
    Identify 'hot zones' where a player performs above a threshold
    
    - stat: The statistic to analyze
    - threshold: The performance threshold (0 means above average)
    """
    try:
        game_log = playergamelog.PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
        
        if game_log.empty:
            raise HTTPException(status_code=404, detail="No game data found")
        
        # Calculate average for the stat
        avg = game_log[stat].mean()
        
        # If threshold is 0, use the average as threshold
        actual_threshold = avg if threshold == 0 else threshold
        
        # Identify hot games
        hot_games = game_log[game_log[stat] > actual_threshold]
        
        if hot_games.empty:
            return {
                "message": f"No games found where {stat} > {actual_threshold}",
                "average": avg,
                "hot_games": []
            }
        
        # Analyze hot games
        result = {
            "average": avg,
            "threshold": actual_threshold,
            "hot_games_count": len(hot_games),
            "total_games_count": len(game_log),
            "hot_percentage": (len(hot_games) / len(game_log)) * 100,
            "hot_games": hot_games[['GAME_DATE', 'MATCHUP', stat]].to_dict(orient='records')
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error analyzing hot zones: {str(e)}")

@app.get("/players/name/{player_name}/hot-zones")
def get_player_hot_zones_by_name(
    player_name: str, 
    stat: str = "PTS", 
    season: str = "2023-24", 
    threshold: float = 0
):
    """Identify 'hot zones' where a player performs above a threshold by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_hot_zones(player_id, stat, season, threshold)

@app.get("/players/{player_id}/image")
def get_player_image_url(player_id: int):
    """Get the URL for a player's headshot image"""
    return {
        "image_url": f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"
    }

@app.get("/players/name/{player_name}/image")
def get_player_image_url_by_name(player_name: str):
    """Get the URL for a player's headshot image by name"""
    player_id = get_id(player_name)
    if isinstance(player_id, str):
        raise HTTPException(status_code=404, detail=player_id)
    
    return get_player_image_url(player_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

