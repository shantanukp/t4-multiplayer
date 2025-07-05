class T4Game:
    def __init__(self):
        self.boardSize = 3;
        self.board = [[None for _ in range(self.boardSize)] for _ in range(self.boardSize)]
        self.winner = None
        self.winnerSequence = []
        self.players_in_game = {'1': None, '2': None}
        self.player_1 = '1'
        self.player_2 = '2'
        self.current_player = self.player_1

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
            return {"error": "Game finished", "playerId": player_id}
        
        if player_id != self.current_player:
            return {"error": "Not your move", "playerId": player_id}
        
        if "reset" in move:
            print(f"Game reset by player", move["playerId"])
            self.reset()
            game_state = self.get_game_state()
            return game_state

        if "row" not in move or "col" not in move:
            return {"error": "Invalid move", "playerId": player_id}

        row, col = move["row"], move["col"]
        if row < 0 or row >= self.boardSize or col < 0 or col >= self.boardSize:
            game_state = self.get_game_state()
            return {"error": "Invalid move", "playerId": player_id}
        
        self.play(row, col)
        
        game_state = self.get_game_state()
        return game_state

    def get_game_state(self):
        return {
            "board": self.board,
            "currentPlayer": self.current_player,
            "winner": self.winner,
            "playersInGame": self.players_in_game,
            "winnerSequence": self.winnerSequence
        }

    def play(self, row, col):
        if self.board[row][col] is None:
            self.board[row][col] = self.current_player
            winner, winnerSequence = self.check_winner(row, col)
            if winner:
                self.winner = self.current_player
                self.winnerSequence = winnerSequence
            else:
                self.current_player = self.player_2 if self.current_player == self.player_1 else self.player_1

    def check_winner(self, row, col):
        # Check row
        if all(self.board[row][c] == self.current_player for c in range(self.boardSize)):
            return True, [(row, c) for c in range(self.boardSize)]
        # Check column
        if all(self.board[r][col] == self.current_player for r in range(self.boardSize)):
            return True, [(r, col) for r in range(self.boardSize)]
        # Check diagonal
        if row == col and all(self.board[i][i] == self.current_player for i in range(self.boardSize)):
            return True, [(i, i) for i in range(self.boardSize)]
        # Check anti-diagonal
        if row + col == 3 and all(self.board[i][self.boardSize - i - 1] == self.current_player for i in range(self.boardSize)):
            return True, [(i, self.boardSize - i - 1) for i in range(self.boardSize)]
        return False, []

    def reset(self):
        self.board = [[None for _ in range(self.boardSize)] for _ in range(self.boardSize)]
        self.winner = None
        self.current_player = self.player_1