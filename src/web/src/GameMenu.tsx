import { useState } from 'react'
import { toast } from 'react-toastify';

type GameMenuParams = {
    onJoinGameSubmit: (gameId: string) => void; 
}

export default function GameMenu({ onJoinGameSubmit }: GameMenuParams) {
    const [showJoinGameMenu, setShowJoinGameMenu] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string>("");

    if (showJoinGameMenu) {
        return (
            <div className="login-form">
                <input 
                    type="text" 
                    placeholder="Enter game id"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                />
                <button onClick={() => onJoinGameSubmit(gameId)}>Join Game</button>
                <button onClick={() => setShowJoinGameMenu(false)}>Back</button>                
            </div>
        )
    }

    const startNewGame =  async () => {
        try {
            const data = await (await fetch(`http://localhost:8000/api/game/new-game`)).json() as {gameId: string};
            onJoinGameSubmit(data.gameId)
            toast.success('Created a new game')
            console.log("Created a new game")
        } catch(err) {
            console.log("Could not start a new game", err)
            toast.error('Could not start a new game')
        }
    }

    return (
        <div className="login-form">
            <button onClick={() => startNewGame()}>New Game</button>
            <button onClick={() => setShowJoinGameMenu(true)}>Join Game</button>
        </div>
    )
}