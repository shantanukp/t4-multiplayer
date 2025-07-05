import { BoardValue } from "./game.types";

interface boardParams {
    board: BoardValue[][],
    // winnerSeq: number[] | null,
    // earliestMoves: number[],
    nextMove: BoardValue,
    playerId: string,
    winnerSequence: number[][] | null,
    onMove: (row: number, col: number) => void
}

export default function Board({board, onMove, nextMove, winnerSequence, playerId}: boardParams) {

    console.log("Rendering board", board);
    const boardSize = board.length;
    const isMyMove = nextMove === playerId;

    const getSymbolForPlayer = (player: string | null) => {
        if (player === '1') 
            return 'X'
        if (player === '2')
            return 'O'
        return ''
    }

    const boardRows = new Array(boardSize).fill(0).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="row">
            {new Array(boardSize).fill(0).map((_, colIndex) => {
                const isWinner = !!(winnerSequence || []).find(item => item[0] === rowIndex && item[1] === colIndex)

                return (
                    <div key={`cell-${rowIndex}#${colIndex}`} className="cell">
                        <button 
                            disabled={!isMyMove}
                            onClick={() => onMove(rowIndex, colIndex)} 
                            className={`cellButton ${isWinner ? 'winnerCell' : ''}`}
                            data-next-move={board[rowIndex][colIndex] === null ? getSymbolForPlayer(playerId) : undefined}
                        >
                            {getSymbolForPlayer(board[rowIndex][colIndex])}
                        </button>
                    </div>
                )}
            )}
        </div>
    ))

    return (
        <>
            <div className="board">
                {boardRows}
            </div>
        </>
    )
}