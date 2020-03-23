import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/GamePage.css'
import GameBoard from './GameBoard';
import GamePlayerControls from './GamePlayerControls';
import GamePlanningControl from './GamePlanningControl';



function GamePage({ playerName, playerTeam, gameState, setGameState }) {
  const [timer, setTimer] = useState(60);
  const [playerState, setPlayerState] = useState({role: 'Describer'});

  return (
      <div>
        <h1 className="ArticulateTitle">Articulate</h1>
        <GameBoard gamePositions={gameState.gamePositions}/>
        <div id="teamRoleDiv">
          <div id="team">
            Team: {playerTeam}
          </div>
          <div id="role">
            Your Role: {playerState.role}
          </div>
        </div>
        {gameState.currentTurn.status === "planning" ?
            <GamePlanningControl playerName={playerName} playerState={playerState} setPlayerState={setPlayerState} gameState={gameState} setGameState={setGameState}/>
            :
            <GamePlayerControls timer={timer} role={playerState.role} gameState={gameState} setGameState={setGameState}/>}
      </div>
  );

}

export default GamePage