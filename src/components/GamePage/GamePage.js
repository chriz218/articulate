import React, {useEffect, useState} from 'react';
import '../../CSSFiles/GamePage.css';
import GameBoard from './GameBoard';
import GameInstruction from './GameInstructions';
import GameControlsArticulating from './GameControlsArticulating';
import GameControlPlanning from './GameControlPlanning';

function GamePage({isHost, playerName, playerTeam, gameState, setGameState, broadcastGameState, nextTeam}) {
    const [playerState, setPlayerState] = useState({role: '-'});

    const GameControlPanel = () => {
        switch (gameState.currentTurn.phase) {
            case 'planning':
                return (
                    <GameControlPlanning
                        playerName={playerName}
                        playerState={playerState}
                        setPlayerState={setPlayerState}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                    />
                );
            case 'articulating':
                return (
                    <GameControlsArticulating
                        isHost={isHost}
                        playerState={playerState}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                        nextTeam={nextTeam}
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
            setPlayerState({
                role: '-',
            });
        } else {
            setPlayerState({
                role: 'OPPONENT',
            });
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
            <div id="team">Current Turn: Team {gameState.currentTurn.team}</div>
            <div id="teamRoleDiv">
                <div id="team">
                    Your Team: {playerTeam}
                </div>
                <div id="role">
                    Your Role: {playerState.role}
                </div>
            </div>
            <GameInstruction playerState={playerState}
                             currentTurn={gameState.currentTurn}/>
            {GameControlPanel()}
        </div>
    );

}

export default GamePage;