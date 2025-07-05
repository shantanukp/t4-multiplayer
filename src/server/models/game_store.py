import random
import string
class GameStore:
    def __init__(self):
        self.games = {}

    def generate_unique_id(self):
        return ''.join(random.choices(string.ascii_uppercase, k=6))

    def add_game(self, game_data):
        game_id = self.generate_unique_id()
        self.games[game_id] = game_data
        return game_id

    def get_game(self, game_id):
        return self.games.get(game_id)

    def remove_game(self, game_id):
        if game_id in self.games:
            del self.games[game_id]
