import { ReactNode } from 'react';

export default function GameBox({children}: {children?: ReactNode}) {
    return (
        <div className="t4Game">
            <h1> Twisted Tic-Tac-Toe</h1>
            {children}
        </div>        
    )
}