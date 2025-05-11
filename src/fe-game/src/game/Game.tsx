import './Game.css';
import Board from "./Board"
import { useRef, useState } from "react";
import { BoardValue } from "./game.types";
import Banner from "./Banner";


export default function Game({ ws }: {ws: WebSocket | null}) {

    const boardSize = 4;

    const [board, setBoard] = useState<BoardValue[][]>(new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(null)));
    const nextMove = useRef<BoardValue>('1');
    const winner = useRef<BoardValue>(null);

    if (ws) {
        ws.onmessage = function(event) {
            console.log("Received message from server: ", event.data);
            updateState(JSON.parse(event.data))
        };
    }

    function onMove(row: number, col: number) {
        if (winner.current || board[row][col] !== null) return;

        const move = {row, col}
        if (!ws) return;
        ws.send(JSON.stringify(move))
    }

    function updateState(wsMessage: {current_player: BoardValue, winner: BoardValue, board: BoardValue[][]}) {
        nextMove.current = wsMessage.current_player;
        winner.current = wsMessage.winner;
        console.log("Current board", board);
        console.log("Setting new board", wsMessage.board);
        setBoard(wsMessage.board);
    }

    function onReset() {
        console.log('reset');
    }
    
    return (
        <div className="t4Game">
            <h1> Twisted Tic-Tac-Toe</h1>
            <Banner nextMove={nextMove.current} winner={winner.current} onReset={onReset}/>
            <Board nextMove={nextMove.current} board={board} onMove={onMove}/>
        </div>
    )
}