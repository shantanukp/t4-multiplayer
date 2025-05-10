from fastapi import WebSocket

class MultiPlayerConnectionManager:
    def __init__(self):
        self.connectionsByGameId: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, game_id, player_id, websocket: WebSocket):
        await websocket.accept()
        connectionsForGame = self.connectionsByGameId.get(game_id, {})
        self.connectionsByGameId[game_id] = connectionsForGame

        connectionsForGame[player_id] = websocket

    def disconnect(self, game_id, player_id):
        if game_id in self.connectionsByGameId:
            connectionsForGame = self.connectionsByGameId[game_id]
            if player_id in connectionsForGame:
                del connectionsForGame[player_id]
                if not connectionsForGame:
                    del self.connectionsByGameId[game_id]

    async def send_mesage_to_player(self, game_id, player_id, message: str):
        connectionsForGame = self.connectionsByGameId.get(game_id, {})
        if player_id in connectionsForGame:
            await connectionsForGame[player_id].send_json(message)

    async def broadcast_message(self, game_id, message):
        connectionsForGame = self.connectionsByGameId.get(game_id, {})
        for connection in connectionsForGame.values():
            await connection.send_json(message)
    
