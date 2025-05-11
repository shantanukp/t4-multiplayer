import uuid
class GameStore:
    def __init__(self):
        self.games = {}

    def add_game(self, game_data):
        game_id = str(uuid.uuid4())
        self.games[game_id] = game_data
        return game_id

    def get_game(self, game_id):
        return self.games.get(game_id)

    def remove_game(self, game_id):
        if game_id in self.games:
            del self.games[game_id]
