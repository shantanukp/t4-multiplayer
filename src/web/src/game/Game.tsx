import './Game.css';
import Board from "./Board"
import { useRef, useState } from "react";
import { BoardValue } from "./game.types";
import Banner from "./Banner";
import { toast } from 'react-toastify';

type GameParams = {
    ws: WebSocket;
    playerId: string;
    gameId: string;
}

export default function Game({ ws, gameId, playerId }: GameParams) {
    const [board, setBoard] = useState<BoardValue[][] | null>(null);
    const [numPlayersConnected, setNumPlayersConnected] = useState<number>(0);
    const nextMove = useRef<BoardValue>('1');
    const winner = useRef<BoardValue>(null);
    const winnerSequence = useRef<number[][]>(null);
    const allPlayersReady = numPlayersConnected === 2;

    if (ws) {
        ws.onmessage = function(event) {
            console.log("Received message from server: ", event.data);
            const message = JSON.parse(event.data);
            if ('error' in message) {
                toast.error(message.error)
            } else {
                updateState(JSON.parse(event.data))
            }
        };
    }

    function onMove(row: number, col: number) {
        if (!board) return;
        if (winner.current || board[row][col] !== null) return;

        const move = {row, col}
        if (!ws) return;
        ws.send(JSON.stringify(move))
    }

    function updateState(wsMessage: {currentPlayer: BoardValue, winner: BoardValue, board: BoardValue[][], playersInGame: Record<string, boolean>, winnerSequence: number[][]}) {
        nextMove.current = wsMessage.currentPlayer;
        winner.current = wsMessage.winner;
        winnerSequence.current = wsMessage.winnerSequence;
        console.log("Current board", board);
        console.log("Setting new board", wsMessage.board);
        setBoard(wsMessage.board);
        setNumPlayersConnected(Object.values(wsMessage.playersInGame).filter(val => val).length)
    }

    function onReset() {
        if (!ws) return;
        ws.send(JSON.stringify({reset: true, playerId}))
    }

    if (!board) {
        return <></>
    }
    
    return (
        <div className="t4Game">
            <h1> Twisted Tic-Tac-Toe</h1>
            <Banner gameId={gameId} playerId={playerId} nextMove={nextMove.current} winner={winner.current} onReset={onReset}/>
            {
                allPlayersReady
                    ? <Board playerId={playerId} nextMove={nextMove.current} board={board} winnerSequence={winnerSequence.current} onMove={onMove}/>
                    : <div> Waiting for all players to join! </div>
            }
        </div>
    )
}