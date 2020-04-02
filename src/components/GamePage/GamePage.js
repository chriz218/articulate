import React, {useEffect, useState} from 'react';
import '../../CSSFiles/GamePage.css';
import GameBoard from './GameBoard';
import GameInstruction from './GameInstructions';
import GameControlsArticulating from './GameControlsArticulating';
import GameControlPlanning from './GameControlPlanning';
import {CapitaliseFirstLetter, TranslateTeamDisplayed} from '../Util/util';

function GamePage({playerName, playerTeam, numberOfTeams, gameState, setGameState, broadcastGameState}) {
    const [playerRole, setPlayerRole] = useState('-');

    const GameControlPanel = () => {
        switch (gameState.currentTurn.phase) {
            case 'planning':
                return (
                    <GameControlPlanning
                        playerName={playerName}
                        playerRole={playerRole}
                        setPlayerRole={setPlayerRole}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                    />
                );
            case 'articulating':
                return (
                    <GameControlsArticulating
                        playerRole={playerRole}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                        numberOfTeams={numberOfTeams}
                    />
                );
            default:
                console.log('ERROR: Wrong phase input: ',
                    gameState.currentTurn.phase);
                return;
        }
    };

    /** New Turn: Reset currentTurn values in gameState*/
    useEffect(() => {
        if (playerTeam === gameState.currentTurn.team) {
            setPlayerRole('-');
        } else {
            setPlayerRole('opponent');
        }

        setGameState(prevGameState => {
            console.log('New Turn');
            const newCurrentTurn = {
                ...prevGameState.currentTurn,
                describer: [],
                guesser: [],
            };
            const newGameState = {
                ...prevGameState,
                currentTurn: newCurrentTurn,
            };
            return newGameState;
        });

    }, [gameState.currentTurn.team]);

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <GameBoard gamePositions={gameState.gamePositions}/>
            <div className="Game-Team">Current Turn:
                Team {TranslateTeamDisplayed(gameState.currentTurn.team)}
            </div>
            <div id="Game-TeamRoleDiv">
                <div className="Game-Team">
                    Your Team: {TranslateTeamDisplayed(playerTeam)}
                </div>
                <div id="Game-Role">
                    Your Role: {CapitaliseFirstLetter(playerRole)}
                </div>
            </div>
            <GameInstruction playerRole={playerRole}
                             currentTurn={gameState.currentTurn}/>
            {GameControlPanel()}
        </div>
    );

}

export default GamePage;