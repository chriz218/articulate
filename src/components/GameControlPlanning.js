import React, {useState, useEffect} from 'react';

function GameControlPlanning({ playerName, playerState, setPlayerState, setGameState, gameState, broadcastGameState}) {
  const [disablePlayButton, setDisablePlayButton] = useState(true);

  function Selector(roleFrom, roleTo) {
    console.log("Selecting Role: " + roleTo.toString().toUpperCase());
    setPlayerState({
      role: roleTo.toString().toUpperCase()
    });
    setGameState(prevGameState => {
      const newCurrentTurn = prevGameState.currentTurn;
      newCurrentTurn[roleTo].push(playerName);

      let index;
      do{
        index = newCurrentTurn[roleFrom].indexOf(playerName);
        if (index !== -1) newCurrentTurn[roleFrom].splice(index, 1);
      }while(index !== -1);

      const newGameState = {
        ...prevGameState, currentTurn: newCurrentTurn
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  }

  const SelectDescriber = () => {
    Selector("guesser", "describer");
  };

  const SelectGuesser = () => {
    Selector("describer", "guesser");
  };

  const handlePlay = () => {
    console.log("PlayButtonDisabled: ", disablePlayButton);

    setGameState(prevGameState => {
      let nextTurn = prevGameState.currentTurn;
      nextTurn = {
        ...nextTurn,
        phase: "articulating"
      };
      const newGameState = {
        ...prevGameState,
        currentState: "articulating",
        currentTurn: nextTurn
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  };

  // Start Game if Allowed
  useEffect(() => {
    const numOfDescribers = gameState.currentTurn.describer.length;
    const numOfGuessers = gameState.currentTurn.guesser.length;
    const team = gameState.currentTurn.team;
    const sizeOfTeam = gameState.teams[team].length;
    const allPlayersSelectedRole = (( numOfDescribers + numOfGuessers ) === sizeOfTeam);
    const atLeastOneOfEachRole = (numOfDescribers > 0 && numOfGuessers > 0);
    setDisablePlayButton(!(allPlayersSelectedRole && atLeastOneOfEachRole));
  }, [gameState.currentTurn.describer, gameState.currentTurn.guesser]);

  const RenderButtons = () => {
    if(playerState.role === "OPPONENT") return (<React.Fragment />);
    return (
      <React.Fragment>
        <div id="btnDiv">
          <button className="btn" id="correctBtn" onClick={SelectDescriber}>Describer</button>
          <button className="btn" id="skipBtn" onClick={SelectGuesser}>Guesser</button>
        </div>
        <div id="btnDiv">
          <button className="btn" id="foulBtn" onClick={handlePlay} disabled={disablePlayButton}>Play!</button>
        </div>
      </React.Fragment>
    )
  };

  return (
      <React.Fragment>
        <div>
          Describer: {gameState.currentTurn.describer.map((each, index) => {
            if(index === 0) {
              return each;
            }
            return ", " + each;
          })}
        </div>
        <div>
          Guesser: {gameState.currentTurn.guesser.map((each, index) => {
          if(index === 0) {
            return each;
          }
          return ", " + each;
        })}
        </div>
        {RenderButtons()}

      </React.Fragment>
  )
}

export default GameControlPlanning;