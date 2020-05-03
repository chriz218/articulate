import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';
import {PAGE_HOME} from '../../properties';

function GameOverPage({setPage, gameState}) {
    function refresh() {
        // TODO: Disconnect and leave room


        // Refresh
        setPage(PAGE_HOME);
    }

    return (
        <div>
            <h1>GAME OVER!</h1>
            <div>
                The Winner is Team {TranslateTeamDisplayed(gameState.winner)} !!
            </div>
            <button onClick={() => refresh()}>Return to Homepage</button>
        </div>
    );
}

export default GameOverPage;