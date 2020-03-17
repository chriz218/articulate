import React from 'react';
import '../CSSFiles/PlayerListContainer.css'

function PlayerListContainer({ gameState, setGameState, playerTeam, setPlayerTeam, socketId, broadcastGameState }){

  function chooseTeam(newTeam) {
    setGameState(prevGameState => {
      let myPlayerObj = {};
      const { teams } = prevGameState;
      teams[playerTeam].forEach((player, index, object) => {
        if(player.socketId === socketId) {
          myPlayerObj = player;
          object.splice(index, 1);
        }
      });
      teams[newTeam].push(myPlayerObj);
      setPlayerTeam(newTeam);
      const newGameState = { ...prevGameState, teams };
      broadcastGameState(newGameState);
      return newGameState;
    })
  }

  function renderTeam(i) {
    return (
        <React.Fragment>
          <button type="button" onClick={() => chooseTeam(i)}>Team {i}</button>
          <p>------------------</p>
          {gameState.teams[i].map(player => {
            return <p>{player.playerName}</p>
          })}
          <p>==========================</p>
        </React.Fragment>
    )
  }


  return (
      <React.Fragment>
        <div className="players-list">
          {gameState.teams.map((team, index) => renderTeam(index))}
        </div>
      </React.Fragment>
  )
}

export default PlayerListContainer;