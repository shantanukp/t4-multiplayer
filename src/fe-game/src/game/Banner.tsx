import { BoardValue } from "./game.types";

interface BannerParams {
    gameId: string,
    playerId: string,
    winner: BoardValue,
    nextMove: BoardValue,
    onReset: () => void,
}

export default function Banner({gameId, playerId, winner, nextMove, onReset}: BannerParams) {

    const nextMoveText = nextMove === playerId ? "Your Move!" : "Opponent's Move!"
    const winnerText = winner === playerId ? "You win!!!" : "You lose :("

    return (
        <div className="banner">
            <div className="bannerText">
                <span>Game Id: {gameId}</span>
            </div>
            <div className="bannerText">
                {!winner ? <span>{nextMoveText}</span> : <></>}
                {winner ? <span>{winnerText}</span> : <></>}
            </div>
            <button onClick={onReset}>Reset</button>
        </div>
    )
}