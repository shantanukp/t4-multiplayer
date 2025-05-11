import { BoardValue } from "./game.types";

interface BannerParams {
    winner: BoardValue,
    nextMove: BoardValue,
    onReset: () => void,
}

export default function Banner({winner, nextMove, onReset}: BannerParams) {
    return (
        <div className="banner">
            <div className="bannerText">
                <span>Next Move: {nextMove}</span>
                <span>{winner ? `Winner: ${winner}`: ''}</span>
            </div>
            <button onClick={onReset}>Reset</button>
        </div>
    )
}