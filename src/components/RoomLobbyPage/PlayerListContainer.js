import React from 'react';
import '../../CSSFiles/PlayerListContainer.css'

function PlayerListContainer({ gameState, setGameState, playerTeam, setPlayerTeam, socketId, broadcastGameState }) {

  /** Removes player from current team and add them to the selected team*/
  function chooseTeam(newTeam) {
    if (newTeam !== playerTeam) {
      setGameState(prevGameState => {
        let myPlayerObj = {};
        const { teams } = prevGameState;
        teams[playerTeam].forEach((player, index, object) => {
          if (player.socketId === socketId) {
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
  }

  /** Display a button to choose the team and lists its current members*/
  function renderTeam(i) {
    console.log(gameState.teams)
    console.log(gameState.teams.length)
    let PlayerListSectionDynamicStyle
    let PlayerListSubSectionDynamicStyle
    if (gameState.teams.length === 2) {
      PlayerListSectionDynamicStyle = "PlayerListSectionDynamicStyle1"
      PlayerListSubSectionDynamicStyle = "PlayerListSubSectionDynamicStyle1"
    } else {
      PlayerListSectionDynamicStyle = "PlayerListSectionDynamicStyle2"
      PlayerListSubSectionDynamicStyle = "PlayerListSubSectionDynamicStyle2"
    }
    return (
      <div key={i} id={`team${i}`} className={PlayerListSectionDynamicStyle}>
        <button type="button" id="PlayerListTeamBtn" onClick={() => chooseTeam(i)}>Team {i}</button>
        <div className={PlayerListSubSectionDynamicStyle}>
          {gameState.teams[i].map((player, index) => {
            return <p key={index}>{player.playerName}</p>
          })}
        </div>
      </div>
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