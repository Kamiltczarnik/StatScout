from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

Base = declarative_base()

class NflGame(Base):
    __tablename__ = "nfl_games"
    game_id = Column(String, primary_key=True, index=True)
    season = Column(String, nullable=False)
    game_date = Column(String, nullable=False)
    status = Column(String, nullable=False)
    week = Column(String, nullable=False)
    home_team_id = Column(String, nullable=False)
    home_team_name = Column(String, nullable=False)
    home_team_abbr = Column(String, nullable=False)
    home_team_score = Column(Integer)
    away_team_id = Column(String, nullable=False)
    away_team_name = Column(String, nullable=False)
    away_team_abbr = Column(String, nullable=False)
    away_team_score = Column(Integer)

    player_stats = relationship("NflPlayerGameStats", back_populates="game")


class NflPlayer(Base):
    __tablename__ = "nfl_players"
    player_id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    team = Column(String, nullable=False)
    position = Column(String, nullable=False)
    jersey = Column(String)
    birth_date = Column(String)
    height = Column(String)
    weight = Column(String)
    college = Column(String)
    experience = Column(String)
    draft_year = Column(String)
    draft_round = Column(String)
    draft_pick = Column(String)
    headshot_url = Column(String)

    game_stats = relationship("NflPlayerGameStats", back_populates="player")


class NflPlayerGameStats(Base):
    __tablename__ = "nfl_player_game_stats"
    player_id = Column(String, ForeignKey("nfl_players.player_id"), primary_key=True)
    game_id = Column(String, ForeignKey("nfl_games.game_id"), primary_key=True)
    team = Column(String, nullable=False)
    position = Column(String, nullable=False)
    attempts = Column(Integer)
    completions = Column(Integer)
    passing_yards = Column(Float)
    passing_tds = Column(Integer)
    interceptions = Column(Integer)
    sacks = Column(Float)
    sack_yards = Column(Float)
    carries = Column(Integer)
    rushing_yards = Column(Float)
    rushing_tds = Column(Integer)
    targets = Column(Integer)
    receptions = Column(Integer)
    receiving_yards = Column(Float)
    receiving_tds = Column(Integer)
    tackles = Column(Integer)
    assists = Column(Integer)
    combined_tackles = Column(Integer)
    sacks_defense = Column(Float)
    tackles_for_loss = Column(Float)
    qb_hits = Column(Integer)
    passes_defended = Column(Integer)
    fumbles_forced = Column(Integer)
    fumbles_recovered = Column(Integer)

    __table_args__ = (UniqueConstraint('player_id', 'game_id', name='_player_game_uc'),)

    player = relationship("NflPlayer", back_populates="game_stats")
    game = relationship("NflGame", back_populates="player_stats")

class NflTeam(Base):
    __tablename__ = "nfl_teams"
    team_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    abbreviation = Column(String, nullable=False)
    city = Column(String, nullable=False)
    conference = Column(String, nullable=False)
    division = Column(String, nullable=False)


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 