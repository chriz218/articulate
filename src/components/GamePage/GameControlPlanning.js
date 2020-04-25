import React, {useEffect, useState} from 'react';
import GameInstruction from './GameInstructions';
import {
    PHASE_ARTICULATING, PHASE_ARTICULATING_SPECIAL,
    PHASE_PLANNING_SPECIAL,
    ROLE_DESCRIBER,
    ROLE_GUESSER,
    ROLE_OPPONENT,
} from '../../properties';
import {Utils} from 'soba-game';

function GameControlPlanning({playerName, playerRole, setPlayerRole, setGameState, gameState, broadcastGameState}) {
    const [disablePlayButton, setDisablePlayButton] = useState(true);

    function Selector(roleFrom, roleTo) {
        console.log('Selecting Role: ' + roleTo.toString());
        setPlayerRole(roleTo.toString());
        setGameState(prevGameState => {
            const newCurrentTurn = prevGameState.currentTurn;
            newCurrentTurn[roleTo].push(playerName);

            let index;
            do {
                index = newCurrentTurn[roleFrom].indexOf(playerName);
                if (index !== -1) newCurrentTurn[roleFrom].splice(index, 1);
            } while (index !== -1);

            const newGameState = {
                ...prevGameState, currentTurn: newCurrentTurn,
            };
            broadcastGameState(newGameState);
            return newGameState;
        });
    }

    const SelectDescriber = () => {
        if (playerRole !== ROLE_DESCRIBER) {
            Selector(ROLE_GUESSER, ROLE_DESCRIBER);
        }
    };

    const SelectGuesser = () => {
        if (playerRole !== ROLE_GUESSER) {
            Selector(ROLE_DESCRIBER, ROLE_GUESSER);
        }
    };

    const handlePlay = () => {
        setGameState(prevGameState => {
            let nextTurn = prevGameState.currentTurn;
            let phase = PHASE_ARTICULATING;
            if (prevGameState.currentTurn.phase === PHASE_PLANNING_SPECIAL) phase = PHASE_ARTICULATING_SPECIAL;

            nextTurn = {
                ...nextTurn,
                phase: phase,
            };

            const newGameState = {
                ...prevGameState,
                currentTurn: nextTurn,
            };
            broadcastGameState(newGameState);
            return newGameState;
        });
    };

    /** Allow game to start if conditions met */
    useEffect(() => {
        const numOfDescribers = gameState.currentTurn.describer.length;
        const numOfGuessers = gameState.currentTurn.guesser.length;
        const team = gameState.currentTurn.team;
        const sizeOfTeam = gameState.teams[team].length;
        const allPlayersSelectedRole = ((numOfDescribers + numOfGuessers) === sizeOfTeam);
        const atLeastOneOfEachRole = (numOfDescribers === 1 && numOfGuessers > 0);
        setDisablePlayButton(!(allPlayersSelectedRole && atLeastOneOfEachRole));
    }, [gameState]);

    const RenderButtons = () => {
        if (playerRole === ROLE_OPPONENT) return (<React.Fragment/>);
        return (
            <React.Fragment>
                <div className="Game-BtnDiv">
                    <button className="Game-Btns" id="Game-DescriberBtn"
                            onClick={SelectDescriber}>Describer
                    </button>
                    <button className="Game-Btns" id="Game-GuesserBtn"
                            onClick={SelectGuesser}>Guesser
                    </button>
                    <button className="Game-Btns" id="Game-PlayBtn"
                            onClick={handlePlay}
                            disabled={disablePlayButton}>Play!
                    </button>
                </div>
            </React.Fragment>
        );
    };

    // TODO: Make a new component to show the describer and guesser lists (styling)
    return (
        <React.Fragment>
            <GameInstruction playerRole={playerRole}
                             currentTurn={gameState.currentTurn}/>
            <div id="Game-DescriberList">
                Describer(s): {Utils.CommaBetweenWords(gameState.currentTurn.describer)}
            </div>
            <div id="Game-GuesserList">
                Guesser(s): {Utils.CommaBetweenWords(gameState.currentTurn.guesser)}
            </div>
            {RenderButtons()}

        </React.Fragment>
    );
}

export default GameControlPlanning;