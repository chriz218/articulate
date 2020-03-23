import React from 'react';

function GamePlanningControl({ playerName, playerState, setPlayerState, setGameState, gameState}) {

  const SelectDescriber = () => {
    console.log("SELECTING DESCRIBER");
    setPlayerState({
      role: "Describer"
    });
    setGameState(prevGameState => {
      const newCurrentTurn = prevGameState.currentTurn;
      newCurrentTurn.describer.push(playerName);
      let index = newCurrentTurn.guesser.indexOf(playerName);
      if (index !== -1) newCurrentTurn.guesser.splice(index, 1);
      return {
        ...prevGameState, currentTurn: newCurrentTurn
      }
    });
  };

  const SelectGuesser = () => {
    console.log("SELECTING GUESSER");
    setPlayerState({
      role: "Guesser"
    });
    setGameState(prevGameState => {
      const newCurrentTurn = prevGameState.currentTurn;
      newCurrentTurn.guesser.push(playerName);
      let index = newCurrentTurn.describer.indexOf(playerName);
      if (index !== -1) newCurrentTurn.describer.splice(index, 1);
      return {
        ...prevGameState, currentTurn: newCurrentTurn
      }
    });
  };

  const handlePlay = () => {
    setGameState(prevGameState => {
      let nextTurn = prevGameState.currentTurn;
      nextTurn = {
        ...nextTurn,
        status: "articulating"
      };
      return {
        ...prevGameState,
        currentTurn: nextTurn
      }
    });
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
        <div id="btnDiv">
          <button className="btn" id="correctBtn" onClick={SelectDescriber}>Describer</button>
          <button className="btn" id="skipBtn" onClick={SelectGuesser}>Guesser</button>
        </div>
        <div id="btnDiv">
          <button className="btn" id="foulBtn" onClick={handlePlay}>Play!</button>
        </div>
      </React.Fragment>
  )
}

export default GamePlanningControl;