class T4Game:
    def __init__(self):
        self.player1 = 'X'
        self.player2 = 'O'
        self.current_player = self.player1
        self.board = [[None for _ in range(4)] for _ in range(4)]
        self.winner = None
        self.players_in_game = {'1': None, '2': None}

    def get_next_player_id(self):
        if self.players_in_game['1'] is None:
            return '1'
        elif self.players_in_game['2'] is None:
            return '2'
        else:
            return None
    
    def add_player(self, player_id):
        if player_id not in ['1', '2']:
            raise Exception("Invalid player ID")
        if self.players_in_game[player_id] is not None:
            raise Exception("Player already in game")
        self.players_in_game[player_id] = True
        
    def remove_player(self, player_id):
        if player_id not in ['1', '2']:
            raise Exception("Invalid player ID")
        self.players_in_game[player_id] = None
        
    def process_move(self, player_id, move):
        if self.winner is not None:
            return None
        
        if player_id != self.current_player:
            return None
        
        row, col = move["row"], move["col"]
        if row < 0 or row >= 4 or col < 0 or col >= 4:
            game_state = self.get_game_state()
            return {"error": "Invalid move", **game_state}
        
        self.play(row, col)
        
        game_state = self.get_game_state()
        return game_state

    def get_game_state(self):
        return {
            "board": self.board,
            "current_player": self.current_player,
            "winner": self.winner,
            "players_in_game": self.players_in_game
        }

    def play(self, row, col):
        if self.board[row][col] is None:
            self.board[row][col] = self.current_player
            if self.check_winner(row, col):
                self.winner = self.current_player
            else:
                self.current_player = self.player2 if self.current_player == self.player1 else self.player1

    def check_winner(self, row, col):
        # Check row
        if all(self.board[row][c] == self.current_player for c in range(4)):
            return True
        # Check column
        if all(self.board[r][col] == self.current_player for r in range(4)):
            return True
        # Check diagonal
        if row == col and all(self.board[i][i] == self.current_player for i in range(4)):
            return True
        # Check anti-diagonal
        if row + col == 3 and all(self.board[i][3 - i] == self.current_player for i in range(4)):
            return True
        return False

    def reset(self):
        self.board = [[None for _ in range(4)] for _ in range(4)]
        self.winner = None
        self.current_player = self.player1