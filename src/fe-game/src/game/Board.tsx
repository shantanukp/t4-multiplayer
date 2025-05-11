import { BoardValue } from "./game.types";

interface boardParams {
    board: BoardValue[][],
    // winnerSeq: number[] | null,
    // earliestMoves: number[],
    nextMove: BoardValue,
    onMove: (row: number, col: number) => void
}

export default function Board({board, onMove, nextMove}: boardParams) {

    console.log("Rendering board", board);
    const boardSize = board.length;

    const boardRows = new Array(boardSize).fill(0).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="row">
            {new Array(boardSize).fill(0).map((_, colIndex) => {
                // const cellIndex = rowIndex * boardSize + colIndex;
                // const isWinner = winnerSeq?.includes(cellIndex)

                return (
                    <div key={`cell-${rowIndex}#${colIndex}`} className="cell">
                        <button 
                            onClick={() => onMove(rowIndex, colIndex)} 
                            className={`cellButton`}
                            data-next-move={board[rowIndex][colIndex] === null ? nextMove : undefined}
                        >
                            {board[rowIndex][colIndex] === '1' ? 'X' : board[rowIndex][colIndex] === '2' ? 'O' : ''}
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