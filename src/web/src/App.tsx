import { useState } from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import Game from './game/Game'
import GameMenu from './game/GameMenu';
import { toast } from 'react-toastify';

function App() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null);

  async function connectWebSocket(newGameId: string) {
    try {
      const data = await (await fetch(`http://localhost:8000/api/game/game/${newGameId}/join/`)).json() as {playerId: string};
      const newWs = new WebSocket(`ws://localhost:8000/api/game/game/${newGameId}/ws/${data.playerId}`);
      setGameId(newGameId);
      setPlayerId(data.playerId);

      // Setup WS
      newWs.onerror = (event) => {
        console.log("Connection error", event);
      }
      newWs.onclose = (event) => {
        console.log("Connection closed", event);
        toast.error("Connection lost to game")
        setWs(null);
      }
      setWs(newWs)
    } catch(err) {
      console.log("Could not connect to game", err)
      toast.error("Could not conenct to game")
    }
  }

  if (!ws || !playerId || !gameId) {
    return <GameMenu onJoinGameSubmit={(gameId) => connectWebSocket(gameId)}/>
  }

  return <Game playerId={playerId} gameId={gameId} ws={ws}/>
}

export default App
