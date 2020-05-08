import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';
import {PAGE_HOME} from '../../properties';
import '../../CSSFiles/GameOverPage.css';

function GameOverPage({setPage, gameState, leaveRoom}) {
    function refresh() {
        leaveRoom(gameState.roomCode, () => {
            console.log('Left Room: ' + gameState.roomCode);
        });
        setPage(PAGE_HOME);
    }

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <h1 className="GameOverHeader">GAME OVER!</h1>
            <div className="Winner">
                The Winner is Team {TranslateTeamDisplayed(gameState.winner)} !!
            </div>
            <div className="BtnContainer">
                <button className="RefreshBtn" onClick={() => refresh()}>Return to Home</button>
            </div>
        </div>
    );
}

export default GameOverPage;