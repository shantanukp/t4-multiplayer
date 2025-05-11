import { useState } from 'react'
import './App.css'
import Game from './game/Game'

function App() {
  const [gameId, setGameId] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);


  function connectWebSocket() {
    const newWs = new WebSocket(`ws://localhost:8000/api/game/game/${gameId}/ws/${playerId}`);
    setWs(newWs)
    newWs.onerror = (event) => {
      console.log("Connection error", event);
      // setWs(null);
    }
    newWs.onclose = (event) => {
      console.log("Connection closed", event);
      setWs(null);
    }
  }

  if (!ws) {
    return (
      <div className="login-form">
        <input 
          type="text" 
          placeholder="Enter game id"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Enter player id"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        />
        <button onClick={() => connectWebSocket()}>Join</button>
      </div>
    )
  }

  return (
    <Game ws={ws}/>
  )
}

export default App
