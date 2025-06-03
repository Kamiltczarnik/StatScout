from sqlalchemy.orm import Session
import nfl_models
from sqlalchemy import func, case
from datetime import datetime, timedelta

def get_nfl_teams(db: Session):
    return db.query(nfl_models.NflTeam).all()

def get_nfl_schedule(db: Session, date: str = None, upcoming: bool = False, season: str = "2024-2025"):
    query = db.query(nfl_models.NflGame)
    if date:
        query = query.filter(nfl_models.NflGame.game_date == date)
    elif upcoming:
        today = datetime.now().strftime("%Y-%m-%d")
        seven_days_later = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        query = query.filter(nfl_models.NflGame.game_date >= today,
                               nfl_models.NflGame.game_date <= seven_days_later,
                               nfl_models.NflGame.season == "2025-2026") # Future season for upcoming games
    else:
        # Default to today's games for the specified season if no date or upcoming flag
        today = datetime.now().strftime("%Y-%m-%d")
        query = query.filter(nfl_models.NflGame.game_date == today, nfl_models.NflGame.season == season)
    return query.order_by(nfl_models.NflGame.game_date).all()

def get_nfl_player_stats(db: Session, season: str = "2024-2025"):
    return (
        db.query(nfl_models.NflPlayerGameStats)
        .join(nfl_models.NflGame, nfl_models.NflPlayerGameStats.game_id == nfl_models.NflGame.game_id)
        .filter(nfl_models.NflGame.season == season)
        .all()
    )

def get_nfl_players(db: Session, season: str = "2024-2025"):
    # This function might need adjustment based on how you associate players with a season
    # Assuming all players in nfl_players table are relevant or you have a season field in nfl_players
    return db.query(nfl_models.NflPlayer).all()


def get_nfl_player_details(db: Session, player_id: str):
    player = db.query(nfl_models.NflPlayer).filter(nfl_models.NflPlayer.player_id == player_id).first()
    if not player:
        return None

    stats = (
        db.query(
            func.sum(nfl_models.NflPlayerGameStats.attempts).label("total_attempts"),
            func.sum(nfl_models.NflPlayerGameStats.completions).label("total_completions"),
            func.sum(nfl_models.NflPlayerGameStats.passing_yards).label("total_passing_yards"),
            func.sum(nfl_models.NflPlayerGameStats.passing_tds).label("total_passing_tds"),
            func.sum(nfl_models.NflPlayerGameStats.interceptions).label("total_interceptions"),
            func.sum(nfl_models.NflPlayerGameStats.sacks).label("total_sacks"),
            func.sum(nfl_models.NflPlayerGameStats.sack_yards).label("total_sack_yards"),
            func.sum(nfl_models.NflPlayerGameStats.carries).label("total_carries"),
            func.sum(nfl_models.NflPlayerGameStats.rushing_yards).label("total_rushing_yards"),
            func.sum(nfl_models.NflPlayerGameStats.rushing_tds).label("total_rushing_tds"),
            func.sum(nfl_models.NflPlayerGameStats.targets).label("total_targets"),
            func.sum(nfl_models.NflPlayerGameStats.receptions).label("total_receptions"),
            func.sum(nfl_models.NflPlayerGameStats.receiving_yards).label("total_receiving_yards"),
            func.sum(nfl_models.NflPlayerGameStats.receiving_tds).label("total_receiving_tds"),
            func.sum(nfl_models.NflPlayerGameStats.tackles).label("total_tackles"),
            func.sum(nfl_models.NflPlayerGameStats.assists).label("total_assists"),
            func.sum(nfl_models.NflPlayerGameStats.combined_tackles).label("total_combined_tackles"),
            func.sum(nfl_models.NflPlayerGameStats.sacks_defense).label("total_sacks_defense"),
            func.sum(nfl_models.NflPlayerGameStats.tackles_for_loss).label("total_tackles_for_loss"),
            func.sum(nfl_models.NflPlayerGameStats.qb_hits).label("total_qb_hits"),
            func.sum(nfl_models.NflPlayerGameStats.passes_defended).label("total_passes_defended"),
            func.sum(nfl_models.NflPlayerGameStats.fumbles_forced).label("total_fumbles_forced"),
            func.sum(nfl_models.NflPlayerGameStats.fumbles_recovered).label("total_fumbles_recovered"),
            func.count(nfl_models.NflPlayerGameStats.game_id).label("games_played")
        )
        .filter(nfl_models.NflPlayerGameStats.player_id == player_id)
        .filter(nfl_models.NflGame.season == "2024-2025") # Assuming current season stats
        .join(nfl_models.NflGame, nfl_models.NflPlayerGameStats.game_id == nfl_models.NflGame.game_id)
        .first()
    )

    game_log = (
        db.query(nfl_models.NflPlayerGameStats, nfl_models.NflGame)
        .join(nfl_models.NflGame, nfl_models.NflPlayerGameStats.game_id == nfl_models.NflGame.game_id)
        .filter(nfl_models.NflPlayerGameStats.player_id == player_id)
        .filter(nfl_models.NflGame.season == "2024-2025") # Current season game log
        .order_by(nfl_models.NflGame.game_date.desc())
        .all()
    )

    return {"player": player, "stats": stats, "game_log": game_log}


def get_nfl_standings(db: Session, season: str = "2024-2025"):
    # Calculate wins, losses, ties, points_for, points_against
    # This query is a bit complex, might need adjustments based on exact schema and needs

    home_games = (
        db.query(
            nfl_models.NflGame.home_team_id.label("team_id"),
            func.sum(case((nfl_models.NflGame.home_team_score > nfl_models.NflGame.away_team_score, 1), else_=0)).label("wins"),
            func.sum(case((nfl_models.NflGame.home_team_score < nfl_models.NflGame.away_team_score, 1), else_=0)).label("losses"),
            func.sum(case((nfl_models.NflGame.home_team_score == nfl_models.NflGame.away_team_score, 1), else_=0)).label("ties"),
            func.sum(nfl_models.NflGame.home_team_score).label("points_for"),
            func.sum(nfl_models.NflGame.away_team_score).label("points_against")
        )
        .filter(nfl_models.NflGame.season == season)
        .group_by(nfl_models.NflGame.home_team_id)
        .subquery()
    )

    away_games = (
        db.query(
            nfl_models.NflGame.away_team_id.label("team_id"),
            func.sum(case((nfl_models.NflGame.away_team_score > nfl_models.NflGame.home_team_score, 1), else_=0)).label("wins"),
            func.sum(case((nfl_models.NflGame.away_team_score < nfl_models.NflGame.home_team_score, 1), else_=0)).label("losses"),
            func.sum(case((nfl_models.NflGame.away_team_score == nfl_models.NflGame.home_team_score, 1), else_=0)).label("ties"),
            func.sum(nfl_models.NflGame.away_team_score).label("points_for"),
            func.sum(nfl_models.NflGame.home_team_score).label("points_against")
        )
        .filter(nfl_models.NflGame.season == season)
        .group_by(nfl_models.NflGame.away_team_id)
        .subquery()
    )

    # Assign total_wins to a variable for use in both select and order_by
    total_wins = (func.coalesce(home_games.c.wins, 0) + func.coalesce(away_games.c.wins, 0)).label("total_wins")

    query = (
        db.query(
            nfl_models.NflTeam.team_id,
            nfl_models.NflTeam.name,
            nfl_models.NflTeam.abbreviation,
            nfl_models.NflTeam.city,
            nfl_models.NflTeam.conference,
            nfl_models.NflTeam.division,
            total_wins,
            (func.coalesce(home_games.c.losses, 0) + func.coalesce(away_games.c.losses, 0)).label("total_losses"),
            (func.coalesce(home_games.c.ties, 0) + func.coalesce(away_games.c.ties, 0)).label("total_ties"),
            (func.coalesce(home_games.c.points_for, 0) + func.coalesce(away_games.c.points_for, 0)).label("total_points_for"),
            (func.coalesce(home_games.c.points_against, 0) + func.coalesce(away_games.c.points_against, 0)).label("total_points_against")
        )
        .outerjoin(home_games, nfl_models.NflTeam.team_id == home_games.c.team_id)
        .outerjoin(away_games, nfl_models.NflTeam.team_id == away_games.c.team_id)
        .order_by(
            nfl_models.NflTeam.conference,
            nfl_models.NflTeam.division,
            total_wins.desc()
        )
    )

    return query.all() 