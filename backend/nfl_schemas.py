from pydantic import BaseModel
from typing import List, Optional, Union

# Base models for individual entities
class NflTeamBase(BaseModel):
    team_id: str
    name: str
    abbreviation: str
    city: str
    conference: str
    division: str

    class Config:
        from_attributes = True

class NflPlayerBase(BaseModel):
    player_id: str
    full_name: str
    team: str
    position: str
    jersey: Optional[str] = None
    birth_date: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    college: Optional[str] = None
    experience: Optional[str] = None
    draft_year: Optional[str] = None
    draft_round: Optional[str] = None
    draft_pick: Optional[str] = None
    headshot_url: Optional[str] = None

    class Config:
        from_attributes = True

class NflGameBase(BaseModel):
    game_id: str
    season: str
    game_date: str
    status: str
    week: str
    home_team_id: str
    home_team_name: str
    home_team_abbr: str
    home_team_score: Optional[int] = None
    away_team_id: str
    away_team_name: str
    away_team_abbr: str
    away_team_score: Optional[int] = None

    class Config:
        from_attributes = True

class NflPlayerGameStatsBase(BaseModel):
    player_id: str
    game_id: str
    team: str
    position: str
    attempts: Optional[int] = None
    completions: Optional[int] = None
    passing_yards: Optional[float] = None
    passing_tds: Optional[int] = None
    interceptions: Optional[int] = None
    sacks: Optional[float] = None
    sack_yards: Optional[float] = None
    carries: Optional[int] = None
    rushing_yards: Optional[float] = None
    rushing_tds: Optional[int] = None
    targets: Optional[int] = None
    receptions: Optional[int] = None
    receiving_yards: Optional[float] = None
    receiving_tds: Optional[int] = None
    tackles: Optional[int] = None
    assists: Optional[int] = None
    combined_tackles: Optional[int] = None
    sacks_defense: Optional[float] = None
    tackles_for_loss: Optional[float] = None
    qb_hits: Optional[int] = None
    passes_defended: Optional[int] = None
    fumbles_forced: Optional[int] = None
    fumbles_recovered: Optional[int] = None

    class Config:
        from_attributes = True

# Schemas for API responses
class NflTeam(NflTeamBase):
    pass

class NflPlayer(NflPlayerBase):
    pass

class NflGame(NflGameBase):
    pass

class NflPlayerGameStats(NflPlayerGameStatsBase):
    pass    

class NflPlayerDetailStats(BaseModel):
    total_attempts: Optional[int] = None
    total_completions: Optional[int] = None
    total_passing_yards: Optional[float] = None
    total_passing_tds: Optional[int] = None
    total_interceptions: Optional[int] = None
    total_sacks: Optional[float] = None
    total_sack_yards: Optional[float] = None
    total_carries: Optional[int] = None
    total_rushing_yards: Optional[float] = None
    total_rushing_tds: Optional[int] = None
    total_targets: Optional[int] = None
    total_receptions: Optional[int] = None
    total_receiving_yards: Optional[float] = None
    total_receiving_tds: Optional[int] = None
    total_tackles: Optional[int] = None
    total_assists: Optional[int] = None
    total_combined_tackles: Optional[int] = None
    total_sacks_defense: Optional[float] = None
    total_tackles_for_loss: Optional[float] = None
    total_qb_hits: Optional[int] = None
    total_passes_defended: Optional[int] = None
    total_fumbles_forced: Optional[int] = None
    total_fumbles_recovered: Optional[int] = None
    games_played: Optional[int] = None

    class Config:
        from_attributes = True
        
class NflPlayerGameStatWithGame(NflPlayerGameStatsBase):
    game: NflGameBase

class NflPlayerDetailsResponse(BaseModel):
    player: NflPlayerBase
    stats: Optional[NflPlayerDetailStats] = None
    game_log: List[NflPlayerGameStatWithGame] = []

    class Config:
        from_attributes = True

class NflStandingTeam(NflTeamBase):
    total_wins: int
    total_losses: int
    total_ties: int
    total_points_for: int
    total_points_against: int

class NflStandingsResponse(BaseModel):
    standings: List[NflStandingTeam]

    class Config:
        from_attributes = True

class NflScheduleResponse(BaseModel):
    games: List[NflGame]

    class Config:
        from_attributes = True 