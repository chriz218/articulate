import React, {useState, useEffect} from 'react';

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
        Selector('guesser', 'describer');
    };

    const SelectGuesser = () => {
        Selector('describer', 'guesser');
    };

    const handlePlay = () => {
        console.log('PlayButtonDisabled: ', disablePlayButton);

        setGameState(prevGameState => {
            let nextTurn = prevGameState.currentTurn;
            nextTurn = {
                ...nextTurn,
                phase: 'articulating',
            };
            const newGameState = {
                ...prevGameState,
                currentState: 'articulating',
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
        const allPlayersSelectedRole = ((numOfDescribers + numOfGuessers) ===
            sizeOfTeam);
        const atLeastOneOfEachRole = (numOfDescribers > 0 && numOfGuessers > 0);
        setDisablePlayButton(!(allPlayersSelectedRole && atLeastOneOfEachRole));
    }, [gameState.currentTurn.describer, gameState.currentTurn.guesser]);

    // TODO : Styling the buttons (visually disabled)
    const RenderButtons = () => {
        if (playerRole === 'opponent') return (<React.Fragment/>);
        return (
            <React.Fragment>
                <div className="Game-BtnDiv">
                    <button className="Game-Btns" id="Game-DescriberBtn"
                            onClick={SelectDescriber}>Describer
                    </button>
                    <button className="Game-Btns" id="Game-GuesserBtn"
                            onClick={SelectGuesser}>Guesser
                    </button>
                </div>
                <div className="Game-BtnDiv">
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
            <div>
                Describer: {gameState.currentTurn.describer.map(
                (each, index) => {
                    if (index === 0) {
                        return each;
                    }
                    return ', ' + each;
                })}
            </div>
            <div>
                Guesser: {gameState.currentTurn.guesser.map((each, index) => {
                if (index === 0) {
                    return each;
                }
                return ', ' + each;
            })}
            </div>
            {RenderButtons()}

        </React.Fragment>
    );
}

export default GameControlPlanning;