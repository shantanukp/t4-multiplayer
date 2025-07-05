from typing import Union
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException, status
from json import JSONDecodeError
from fastapi.responses import HTMLResponse
from server.models.game_store import GameStore
from server.models.t4_game import T4Game
from server.models.multi_player_connection_manager import MultiPlayerConnectionManager

router = APIRouter()

def get_new_game_html(game_id: str):
    return f"""
    <!DOCTYPE html>
    <html>
        <head>
            <title>New Game</title>
        </head>
        <body>
            <h2>Game ID: {game_id}</h2>
            <a href="http://localhost:8000/api/game/dev-chat/game/{game_id}/join/" onsubmit="sendMessage(event)" target="_blank">
                Dev chat
            </a>
        </body>
    </html>
    """

def get_dev_chat_html(game_id: str, player_id: int):
    return f"""
    <!DOCTYPE html>
    <html>
        <head>
            <title>Game Chat</title>
        </head>
        <body>
            <h1>WebSocket Chat</h1>
            <h2>Your Player ID: {player_id}</h2>
            <form action="" onsubmit="sendMessage(event)">
                <input type="text" id="messageText" autocomplete="off"/>
                <button>Send</button>
            </form>
            <ul id='messages'>
            </ul>
            <script>
                var ws = new WebSocket(`ws://localhost:8000/api/game/game/{game_id}/ws/{player_id}`);
                ws.onmessage = function(event) {{
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                }};
                function sendMessage(event) {{
                    var input = document.getElementById("messageText")
                    ws.send(input.value)
                    input.value = ''
                    event.preventDefault()
                }}
            </script>
        </body>
    </html>
    """

gameStore = GameStore()

@router.get("/dev-chat/new-game")
async def newGame():
    game_id = gameStore.add_game(T4Game())
    return HTMLResponse(get_new_game_html(game_id))

@router.get("/dev-chat/game/{game_id}/join")
async def inivitePlayer(game_id: str):
    game: T4Game = gameStore.get_game(game_id)
    if game is None:
        return {"error": "Game not found"}
    
    # Check if the game is already full
    if game.get_next_player_id() is None:
        return {"error": "Game is already full"}
    
    return HTMLResponse(get_dev_chat_html(game_id, game.get_next_player_id()))

@router.get("/new-game")
async def newGame():
    game_id = gameStore.add_game(T4Game())
    return {"gameId": game_id}

@router.get("/game/{game_id}/join")
async def inivitePlayer(game_id: str):
    game: T4Game = gameStore.get_game(game_id)
    if game is None:
        return {"error": "Game not found"}
    
    # Check if the game is already full
    if game.get_next_player_id() is None:
        return {"error": "Game is already full"}
    
    return {"playerId": game.get_next_player_id()}

manager = MultiPlayerConnectionManager()

@router.websocket("/game/{game_id}/ws/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    game: T4Game = gameStore.get_game(game_id)
    if game is None:
        await websocket.accept()
        await websocket.send_json({"type": "error", "message": "Game not found"})
        await websocket.close()

    await manager.connect(game_id, player_id, websocket)
    game.add_player(player_id)
    await manager.broadcast_message(game_id, game.get_game_state())

    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received data", data)
            broadcast_message = game.process_move(player_id, data)
            if broadcast_message:
                print(f"Sending data", broadcast_message)
                await manager.broadcast_message(game_id, broadcast_message)
    except WebSocketDisconnect:
        game.remove_player(player_id)
        manager.disconnect(game_id, player_id)
    except JSONDecodeError:
        print(f"Invalid move from player:", player_id)
        await manager.broadcast_message(game_id, {"error": "Invalid move", "playerId": player_id})
