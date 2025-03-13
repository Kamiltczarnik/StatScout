import matplotlib
matplotlib.use("Agg")
import math
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from io import BytesIO
import json
from typing import List, Dict, Any
import matplotlib.pyplot as plt
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, StreamingResponse
import time
from nhlpy.nhl_client import NHLClient
from functools import lru_cache

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_games_with_travel_for_date(game_date, lookback_days=3):
    """
    Returns a list of matchups for a given game_date.
    Each matchup includes the home and away team names and their computed travel distances.
    """
    client = NHLClient()
    try:
        day_response = client.schedule.get_schedule(date=game_date.isoformat())
        games_list = day_response.get("games", [])
    except Exception as e:
        print(f"Error fetching schedule for {game_date}: {e}")
        return []
    travel_data = fetch_travel_data_for_date(game_date, lookback_days)
    matchups = []
    for game in games_list:
        try:
            home_team = game["homeTeam"]["commonName"]["default"]
            away_team = game["awayTeam"]["commonName"]["default"]
        except KeyError:
            continue
        matchup = {
            "game_id": game.get("id"),
            "game_date": game_date.isoformat(),
            "home_team": home_team,
            "away_team": away_team,
            "home_travel": travel_data.get(home_team, 0),
            "away_travel": travel_data.get(away_team, 0),
        }
        matchups.append(matchup)
    return matchups

# Expanded mapping of arena names to (latitude, longitude)
venue_coords = {
    "Amalie Arena": (27.9476, -82.4572),
    "Amerant Bank Arena": (43.0389, -87.9065),
    "American Airlines Center": (32.7905, -96.8104),
    "Ball Arena": (39.7439, -104.9942),
    "Bridgestone Arena": (36.1667, -86.7783),
    "Canada Life Centre": (49.8951, -97.1384),
    "Canadian Tire Centre": (45.3266, -75.7230),
    "Capital One Arena": (38.8983, -77.0201),
    "Centre Bell": (45.5048, -73.5772),
    "Climate Pledge Arena": (47.6225, -122.3505),
    "Crypto.com Arena": (34.0430, -118.2673),
    "Delta Center": (40.7683, -111.8881),
    "Enterprise Center": (38.6287, -90.1970),
    "Ford Field": (42.3400, -83.0456),
    "Honda Center": (33.8003, -117.8827),
    "KeyBank Center": (42.8864, -78.8784),
    "Lenovo Center": (42.7300, -73.6800),
    "Little Caesars Arena": (42.3410, -83.0458),
    "Madison Square Garden": (40.7505, -73.9934),
    "MetLife Stadium": (40.8135, -74.0745),
    "Nationwide Arena": (39.9690, -82.9988),
    "Ohio Stadium": (40.0026, -83.0163),
    "PPG Paints Arena": (40.4398, -80.0027),
    "Prudential Center": (40.7330, -74.1687),
    "Rogers Arena": (49.2827, -123.1207),
    "Rogers Place": (53.5461, -113.4938),
    "Scotiabank Arena": (43.6435, -79.3791),
    "Scotiabank Saddledome": (51.0447, -114.0719),
    "T-Mobile Arena": (36.1024, -115.1728),
    "TD Garden": (42.3662, -71.0621),
    "UBS Arena": (40.7371, -73.7076),
    "United Center": (41.8807, -87.6742),
    "Wells Fargo Center": (39.9012, -75.1726),
    "Xcel Energy Center": (44.9537, -93.0900),
    "Coors Field": (39.7555, -104.9942)
}

# Mapping of team names to their home venue names.
team_home_venues = {
    "Jets": "Canada Life Centre",
    "Winnipeg Jets": "Canada Life Centre",
    "Utah Hockey Club": "Delta Center"
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_team_games(games):
    """
    Organize games by team.
    Returns a dictionary where keys are team names and values are lists of tuples:
    (game_date, lat, lon, is_home).
    """
    team_games = defaultdict(list)
    for game in games:
        try:
            game_date = datetime.fromisoformat(game['startTimeUTC'].replace("Z", "+00:00")).date()
        except Exception:
            continue
        try:
            venue_info = game['venue']
            if "location" in venue_info:
                lat = venue_info["location"]["lat"]
                lon = venue_info["location"]["lon"]
            else:
                venue_name = venue_info.get("default")
                if venue_name and venue_name in venue_coords:
                    lat, lon = venue_coords[venue_name]
                else:
                    continue
        except (KeyError, TypeError):
            continue
        for side in ['homeTeam', 'awayTeam']:
            try:
                team_name = game[side]['commonName']['default']
                is_home = (side == 'homeTeam')
                team_games[team_name].append((game_date, lat, lon, is_home))
            except KeyError:
                continue
    return team_games

def calculate_travel_distance(games_list, team, home_venue=None):
    """
    Compute cumulative travel for a team based on a list of games.
    If the first game is away and home_venue is provided, add the distance from home to that game.
    """
    games_list.sort(key=lambda x: x[0])
    total_distance = 0
    if home_venue and games_list and not games_list[0][3]:
        home_coords = venue_coords.get(home_venue)
        if home_coords:
            total_distance += haversine(home_coords[0], home_coords[1], games_list[0][1], games_list[0][2])
    if not games_list:
        return total_distance
    prev_lat, prev_lon = games_list[0][1], games_list[0][2]
    for game in games_list[1:]:
        lat, lon = game[1], game[2]
        total_distance += haversine(prev_lat, prev_lon, lat, lon)
        prev_lat, prev_lon = lat, lon
    return total_distance

def fetch_travel_data_for_date(game_date, lookback_days=3):
    """
    For a target game_date, fetch schedule data for [game_date - lookback_days, game_date]
    and compute cumulative travel for teams playing on game_date.
    Anchors calculation to the team's home venue if needed.
    """
    start_date = game_date - timedelta(days=lookback_days)
    client = NHLClient()
    games = []
    current_date = start_date
    while current_date <= game_date:
        try:
            day_response = client.schedule.get_schedule(date=current_date.isoformat())
            games.extend(day_response.get("games", []))
        except Exception as e:
            print(f"Error on {current_date}: {e}")
        current_date += timedelta(days=1)
    team_games = get_team_games(games)
    travel_data = {}
    for team, games_list in team_games.items():
        filtered_games = [g for g in games_list if start_date <= g[0] <= game_date]
        if any(g[0] == game_date for g in filtered_games):
            home_venue = team_home_venues.get(team)
            travel_distance = calculate_travel_distance(filtered_games, team, home_venue)
            travel_data[team] = travel_distance
    return travel_data

def best_odds_for_date(target_date, lookback_days=3, travel_threshold=100, night_start_hour=18, require_back_to_back=True):
    """
    Returns best odds matchups for a specific target_date.
    Applies these criteria:
      - Away game.
      - (If require_back_to_back is True) The away team must have played an away game on the previous day.
      - Local start time is >= night_start_hour.
      - Cumulative travel over the lookback window > travel_threshold.
    """
    client = NHLClient()
    try:
        schedule_target = client.schedule.get_schedule(date=target_date.isoformat())
        games_target = schedule_target.get("games", [])
    except Exception as e:
        print(f"Error fetching schedule for {target_date}: {e}")
        return []

    travel_data = fetch_travel_data_for_date(target_date, lookback_days)
    
    # Build mapping of team's most recent game in the lookback window.
    start_date = target_date - timedelta(days=lookback_days)
    games_all = []
    current_date = start_date
    while current_date <= target_date:
        try:
            day_resp = client.schedule.get_schedule(date=current_date.isoformat())
            games_all.extend(day_resp.get("games", []))
        except Exception as e:
            print(f"Error on {current_date}: {e}")
        current_date += timedelta(days=1)
    team_last_game = {}
    team_games = get_team_games(games_all)
    for team, games_list in team_games.items():
        filtered = [g for g in games_list if start_date <= g[0] <= target_date]
        if filtered:
            team_last_game[team] = max(filtered, key=lambda x: x[0])
    
    best_matchups = []
    for game in games_target:
        try:
            away_team = game["awayTeam"]["commonName"]["default"]
            home_team = game["homeTeam"]["commonName"]["default"]
        except KeyError:
            continue

        # Check back-to-back condition if required.
        if require_back_to_back:
            try:
                yesterday = target_date - timedelta(days=1)
                schedule_yesterday = client.schedule.get_schedule(date=yesterday.isoformat())
                games_yesterday = schedule_yesterday.get("games", [])
                away_yesterday = {g["awayTeam"]["commonName"]["default"] for g in games_yesterday if "awayTeam" in g}
            except Exception:
                away_yesterday = set()
            if away_team not in away_yesterday:
                continue

        try:
            start_dt = datetime.fromisoformat(game['startTimeUTC'].replace("Z", "+00:00"))
            if 'easternUTCOffset' in game:
                offset_str = game['easternUTCOffset']
                sign = 1 if offset_str[0] == '+' else -1
                hours = int(offset_str[1:3])
                minutes = int(offset_str[4:6])
                offset = timezone(timedelta(hours=sign * hours, minutes=sign * minutes))
                local_dt = start_dt.astimezone(offset)
            else:
                local_dt = start_dt
        except Exception:
            continue

        if local_dt.hour < night_start_hour:
            continue

        team_travel = travel_data.get(away_team, 0)
        if team_travel < travel_threshold:
            continue

        best_matchups.append({
            "game_id": game.get("id"),
            "game_date": target_date.isoformat(),
            "away_team": away_team,
            "home_team": home_team,
            "away_travel": team_travel,
            "local_start_time": local_dt.strftime("%H:%M")
        })
    best_matchups.sort(key=lambda x: x["away_travel"], reverse=True)
    return best_matchups

# --------------------
# Best Odds Endpoints (Back-to-Back Requirement)
# --------------------
@app.get("/best-odds/back-to-back/today")
def best_odds_back_to_back_today():
    target_date = datetime.today().date()
    matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=100, night_start_hour=18, require_back_to_back=True)
    return JSONResponse(content={"best_odds_matchups_today": matchups})

@app.get("/best-odds/back-to-back/tomorrow")
def best_odds_back_to_back_tomorrow():
    target_date = datetime.today().date() + timedelta(days=1)
    matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=100, night_start_hour=18, require_back_to_back=True)
    return JSONResponse(content={"best_odds_matchups_tomorrow": matchups})

@app.get("/best-odds/back-to-back/future")
def best_odds_back_to_back_future():
    today = datetime.today().date()
    combined_matchups = []
    for delta in range(2, 8):  # Day after tomorrow through 7 days from today.
        target_date = today + timedelta(days=delta)
        matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=100, night_start_hour=18, require_back_to_back=True)
        combined_matchups.extend(matchups)
    combined_matchups.sort(key=lambda x: x["away_travel"], reverse=True)
    return JSONResponse(content={"best_odds_matchups_future": combined_matchups})

# --------------------
# Next Best Odds Endpoints (Without Back-to-Back Requirement)
# --------------------
@app.get("/next-best-odds/today")
def next_best_odds_today():
    target_date = datetime.today().date()
    matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=1000, night_start_hour=18, require_back_to_back=False)
    return JSONResponse(content={"next_best_odds_matchups_today": matchups})

@app.get("/next-best-odds/tomorrow")
def next_best_odds_tomorrow():
    target_date = datetime.today().date() + timedelta(days=1)
    matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=1000, night_start_hour=18, require_back_to_back=False)
    return JSONResponse(content={"next_best_odds_matchups_tomorrow": matchups})

@app.get("/next-best-odds/future")
def next_best_odds_future():
    today = datetime.today().date()
    combined_matchups = []
    for delta in range(2, 8):  # Day after tomorrow through 7 days from today.
        target_date = today + timedelta(days=delta)
        matchups = best_odds_for_date(target_date, lookback_days=3, travel_threshold=1000, night_start_hour=18, require_back_to_back=False)
        combined_matchups.extend(matchups)
    combined_matchups.sort(key=lambda x: x["away_travel"], reverse=True)
    return JSONResponse(content={"next_best_odds_matchups_future": combined_matchups})

# --------------------
# Existing Endpoints
# --------------------
@app.get("/travel")
def get_travel_endpoint():
    game_date = datetime.today().date()
    travel_data = fetch_travel_data_for_date(game_date, lookback_days=3)
    return JSONResponse(content=travel_data)

@app.get("/travel-chart")
def get_travel_chart():
    game_date = datetime.today().date()
    travel_data = fetch_travel_data_for_date(game_date, lookback_days=3)
    teams = list(travel_data.keys())
    distances = list(travel_data.values())
    
    plt.figure(figsize=(10, 6))
    plt.bar(teams, distances)
    plt.xlabel("NHL Teams")
    plt.ylabel("Cumulative Travel Distance (km)")
    plt.title("Travel Distance in the Past 3 Days for Teams Playing Today")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    
    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    
    return StreamingResponse(buf, media_type="image/png")

@app.get("/matchups/today")
def matchups_today():
    game_date = datetime.today().date()
    matchups = get_games_with_travel_for_date(game_date, lookback_days=3)
    return JSONResponse(content={"matchups": matchups})

@app.get("/matchups/week")
def matchups_week():
    today = datetime.today().date()
    all_matchups = []
    for delta in range(1, 8):
        game_date = today + timedelta(days=delta)
        matchups = get_games_with_travel_for_date(game_date, lookback_days=3)
        all_matchups.extend(matchups)
    all_matchups.sort(key=lambda x: max(x["home_travel"], x["away_travel"]), reverse=True)
    return JSONResponse(content={"matchups": all_matchups})

@app.get("/teams")
def get_teams():
    client = NHLClient()

    # Get teams information from the NHL API.
    teams_info = client.teams.teams_info()
    
    # Get standings for the current season.
    standings = client.standings.get_standings()
    
    # Use the "standings" key from the response.
    records = standings.get("standings")
    if records is None:
        print("Unexpected standings response structure:", standings)
        # Return teams info without any record details.
        return {"teams": teams_info}
    
    # Build a dictionary of team records keyed by the team's default name.
    team_records = {}
    for record in records:
        team_name = record.get("teamName", {}).get("default")
        if team_name:
            team_records[team_name] = {
                "wins": record.get("wins"),
                "losses": record.get("losses"),
                "ot": record.get("otLosses", 0),
                "points": record.get("points"),
                # You can add more fields as needed.
            }
    
    # Merge the records into teams_info by matching the team name.
    for team in teams_info:
        # Ensure the names match—if necessary, you can normalize them (e.g., lower-case).
        team_name = team.get("name")
        team["record"] = team_records.get(team_name)
    
    return {"teams": teams_info}



@app.get("/team-standings")
def get_team_standings():
    client = NHLClient()
    standings = client.standings.get_standings(season="20232024")
    return {"standings": standings}

def clean_name(ntype: str, name_obj: Dict[str, Any]) -> str:
    return name_obj.get("default", "") if name_obj else ""

def fetch_team_roster(team_abbr: str, season: str) -> Dict[str, List[Dict[str, Any]]]:
    client = NHLClient()
    try:
        roster = client.teams.roster(team_abbr=team_abbr, season=season)
        return roster
    except Exception as e:
        print(f"Error fetching roster for team {team_abbr}: {e}")
        return {}

def fetch_all_players(season: str = "20242025") -> List[Dict[str, Any]]:
    """
    Fetches rosters for all NHL teams for the given season.
    Combines players from forwards, defensemen, and goalies into one list.
    """
    client = NHLClient(verbose=True)
    players = []
    teams_info = client.teams.teams_info()
    teams = teams_info.get("teams") if isinstance(teams_info, dict) and "teams" in teams_info else teams_info

    for team in teams:
        team_abbr = team.get("abbr")
        team_name = team.get("name")
        if not team_abbr:
            print(f"Skipping team {team_name} because no abbreviation found.")
            continue

        roster = fetch_team_roster(team_abbr, season)
        for category in ["forwards", "defensemen", "goalies"]:
            for p in roster.get(category, []):
                # Add category information for filtering later.
                p["category"] = category
                p["team"] = team_abbr
                p["firstName"] = clean_name("firstName", p.get("firstName"))
                p["lastName"] = clean_name("lastName", p.get("lastName"))
                p["fullName"] = f"{p.get('firstName', '')} {p.get('lastName', '')}".strip()
                if category == "goalies":
                    p["position"] = "G"
                    p["isGoalie"] = True
                else:
                    p["position"] = p.get("position", {}).get("abbreviation", "")
                    p["isGoalie"] = False
                players.append(p)
        # To avoid rate limiting, wait a bit between teams.
        time.sleep(1)
    return players

# --- Existing endpoint for player stats ---
# import logging
# logging.basicConfig(level=logging.DEBUG)

@app.get("/players/stats")
def get_player_stats(
    season: str = Query("20242025", min_length=8, max_length=8)
):
    client = NHLClient(verbose=True)
    try:
        stats_response = client.stats.skater_stats_summary_simple(
            start_season=season, end_season=season
        )
        if isinstance(stats_response, list):
            stats_data = stats_response
        else:
            stats_data = stats_response.get("data", [])
        
        players = []
        for player in stats_data:
            players.append({
                "name": player.get("skaterFullName", "Unknown"),
                "team": player.get("teamAbbrevs", ""),
                "gp": player.get("gamesPlayed", 0),
                "g": player.get("goals", 0),
                "a": player.get("assists", 0),
                "pts": player.get("points", 0),
                "plusMinus": player.get("plusMinus", 0),
            })
        return JSONResponse(content={"players": players})
    except Exception as e:
        print(f"Error fetching player stats: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)




# --- New endpoints for players by position ---
@app.get("/players/forwards")
def get_forwards(
    season: str = Query("20242025", min_length=8, max_length=8)
):
    players = fetch_all_players(season)
    forwards = [p for p in players if p.get("category") == "forwards"]
    return JSONResponse(content={"forwards": forwards})

@app.get("/players/defensemen")
def get_defensemen(
    season: str = Query("20242025", min_length=8, max_length=8)
):
    players = fetch_all_players(season)
    defensemen = [p for p in players if p.get("category") == "defensemen"]
    return JSONResponse(content={"defensemen": defensemen})

@app.get("/players/goalies")
def get_goalies(
    season: str = Query("20242025", min_length=8, max_length=8)
):
    players = fetch_all_players(season)
    goalies = [p for p in players if p.get("category") == "goalies"]
    return JSONResponse(content={"goalies": goalies})

@app.get("/")
def read_root():
    client = NHLClient()
    date = datetime.today().date()
    schedule_data = client.schedule.get_schedule(date.isoformat())
    print(json.dumps(schedule_data, indent=2))
    return {"message": "Welcome to the NHL Travel API! Available endpoints: /travel, /travel-chart, /matchups/today, /matchups/week, /best-odds/back-to-back/today, /best-odds/back-to-back/tomorrow, /best-odds/back-to-back/future, /next-best-odds/today, /next-best-odds/tomorrow, /next-best-odds/future"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
