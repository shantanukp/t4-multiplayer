from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api import game

origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # React web app
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game.router, prefix="/api/game")
