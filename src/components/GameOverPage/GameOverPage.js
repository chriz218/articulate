import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';
import {PAGE_HOME} from '../../properties';

function GameOverPage({setPage, gameState, leaveRoom}) {
    function refresh() {
        // TODO: Disconnect and leave room
        leaveRoom(gameState.roomCode, () => {
            console.log("Left Room: " + gameState.roomCode)
        });

        // Refresh
        setPage(PAGE_HOME);
    }

    return (
        <div>
            <h1>GAME OVER!</h1>
            <div>
                The Winner is Team {TranslateTeamDisplayed(gameState.winner)} !!
            </div>
            <button onClick={() => refresh()}>Return to Home</button>
        </div>
    );
}

export default GameOverPage;