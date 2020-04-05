import React, {useEffect, useState} from 'react';
import '../../CSSFiles/GamePage.css';
import GameBoard from './GameBoard';
import GameControlArticulating from './GameControlArticulating';
import GameControlPlanning from './GameControlPlanning';
import {CapitaliseFirstLetter, TranslateTeamDisplayed} from '../Util/util';
import {PHASE_ARTICULATING, PHASE_PLANNING, ROLE_OPPONENT} from '../../properties';
import {ToastContainer, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GamePage({playerName, playerTeam, numberOfTeams, gameState, setGameState, broadcastGameState, broadcastToast}) {
    const [playerRole, setPlayerRole] = useState('-');

    const GameControlPanel = () => {
        switch (gameState.currentTurn.phase) {
            case PHASE_PLANNING:
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
            case PHASE_ARTICULATING:
                return (
                    <GameControlArticulating
                        playerRole={playerRole}
                        playerName={playerName}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                        broadcastToast={broadcastToast}
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
            setPlayerRole(ROLE_OPPONENT);
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
            <>
                <ToastContainer
                    draggable={false}
                    transition={Zoom}
                    autoClose={1200}
                    className="Game-Toast"/>
            </>
            <GameBoard gamePositions={gameState.gamePositions}/>
            <div id="Game-CurrentTurn">Current Turn:
                Team {TranslateTeamDisplayed(gameState.currentTurn.team)}
            </div>
            <div id="Game-TeamRoleDiv">
                <div id="Game-Team">
                    Your Team: {TranslateTeamDisplayed(playerTeam)}
                </div>
                <div id="Game-Role">
                    Your Role: {CapitaliseFirstLetter(playerRole)}
                </div>
            </div>
            {GameControlPanel()}
        </div>
    );

}

export default GamePage;