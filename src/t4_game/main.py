from fastapi import FastAPI
from t4_game.api import game

app = FastAPI()

app.include_router(game.router, prefix="/api/game")
