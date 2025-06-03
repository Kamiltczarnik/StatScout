from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import nfl_crud, nfl_schemas, nfl_models # Changed to absolute import
from nfl_models import get_db # Changed to absolute import

router = APIRouter()

@router.get("/nfl/teams")
def read_nfl_teams(db: Session = Depends(get_db)):
    teams = nfl_crud.get_nfl_teams(db, season="2024")
    # Return all team info plus record fields
    result = [
        {
            "team_id": t.team_id,
            "name": t.name,
            "abbreviation": t.abbreviation,
            "city": t.city,
            "conference": t.conference,
            "division": t.division,
            "wins": t.wins,
            "losses": t.losses,
            "ties": t.ties,
        }
        for t in teams
    ]
    return {"teams": result}

@router.get("/nfl/schedule", response_model=nfl_schemas.NflScheduleResponse)
def read_nfl_schedule(
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format. If not provided, returns today's schedule for the current season or upcoming if specified"),
    upcoming: bool = Query(False, description="If true, returns all games from week 1 of the 2025 season (upcoming)"),
    season: str = Query("2024", description="Season as a 4-digit year string. Defaults to 2024. Used if date and upcoming are not specified, or with date if provided."),
    db: Session = Depends(get_db)
):
    # Adjust logic to prioritize 'upcoming' for its specific season, then 'date', then default to 'season' for today.
    if upcoming:
        # Upcoming always uses 2025 as per user request
        schedule = nfl_crud.get_nfl_schedule(db, upcoming=True, season="2025")
    elif date:
        schedule = nfl_crud.get_nfl_schedule(db, date=date, season=season) # Use provided season with date
    else:
        # Defaults to today for the specified/default season
        schedule = nfl_crud.get_nfl_schedule(db, season=season)
    return {"games": schedule}

@router.get("/nfl/players", response_model=List[nfl_schemas.NflPlayer])
def read_nfl_players(
    season: str = Query("2024-2025", description="Season in YYYY-YYYY format"), 
    db: Session = Depends(get_db)
):
    players = nfl_crud.get_nfl_players(db, season=season)
    return players

@router.get("/nfl/player/{player_id}", response_model=nfl_schemas.NflPlayerDetailsResponse)
def read_nfl_player_details(player_id: str, db: Session = Depends(get_db)):
    player_details = nfl_crud.get_nfl_player_details(db, player_id=player_id)
    if player_details is None or player_details["player"] is None:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Transform game_log to match the NflPlayerGameStatWithGame schema
    transformed_game_log = []
    if player_details.get("game_log"):
        for stat, game in player_details["game_log"]:
            transformed_game_log.append(
                nfl_schemas.NflPlayerGameStatWithGame(
                    **stat.__dict__, # Convert SQLAlchemy model to dict
                    game=nfl_schemas.NflGameBase(**game.__dict__) # Convert SQLAlchemy model to dict
                )
            )
    
    return nfl_schemas.NflPlayerDetailsResponse(
        player=player_details["player"],
        stats=player_details["stats"],
        game_log=transformed_game_log
    )

@router.get("/nfl/standings", response_model=nfl_schemas.NflStandingsResponse)
def read_nfl_standings(
    season: str = Query("2024-2025", description="Season in YYYY-YYYY format"), 
    db: Session = Depends(get_db)
):
    standings_data = nfl_crud.get_nfl_standings(db, season=season)
    # The crud function returns a list of tuples/ SQLAlchemy Row objects.
    # We need to map these to the NflStandingTeam Pydantic model.
    processed_standings = [
        nfl_schemas.NflStandingTeam(
            team_id=row.team_id,
            name=row.name,
            abbreviation=row.abbreviation,
            city=row.city, # Assuming NflTeam model has city, if not, adjust
            conference=row.conference,
            division=row.division,
            total_wins=row.total_wins,
            total_losses=row.total_losses,
            total_ties=row.total_ties,
            total_points_for=row.total_points_for,
            total_points_against=row.total_points_against
        ) for row in standings_data
    ]
    return nfl_schemas.NflStandingsResponse(standings=processed_standings)

# Placeholder for Scout Picks page (NFL)
@router.get("/nfl/scout-picks")
def nfl_scout_picks():
    # This is a placeholder as requested.
    # You can implement logic here later based on your NFL scouting criteria.
    return {"message": "NFL Scout Picks page is under construction."} 