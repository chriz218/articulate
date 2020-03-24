import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/GamePage.css'
import GameBoard from './GameBoard';
import GamePlayerControls from './GamePlayerControls';
import GamePlanningControl from './GamePlanningControl';


function GamePage({ playerName, playerTeam, gameState, setGameState, broadcastGameState, nextTeam }) {
  const [playerState, setPlayerState] = useState({role: '-'});

  const GameControlPanel = () => {
    switch(gameState.currentTurn.status){
      case "planning":
        return (
            <GamePlanningControl
                playerName={playerName}
                playerState={playerState}
                setPlayerState={setPlayerState}
                gameState={gameState}
                setGameState={setGameState}
                broadcastGameState={broadcastGameState}
            />
        );
      case "articulating":
        return (
            <GamePlayerControls
                role={playerState.role}
                gameState={gameState}
                setGameState={setGameState}
                broadcastGameState={broadcastGameState}
                nextTeam={nextTeam}
            />
        );
      default:
        console.log("ERROR: WRONG STATUS - ", gameState.currentTurn.status);
        return;
    }
  };

  // New Turn
  useEffect(() => {
    if(playerTeam === gameState.currentTurn.team){
      setPlayerState({
        role: "-"
      });
    }else {
      setPlayerState({
        role: "Opponent"
      });
    }

    setGameState(prevGameState => {
      console.log("NEW GAME STATE");
      const newCurrentTurn = {
        ...prevGameState.currentTurn,
        describer: [],
        guesser: []
      };
      const newGameState = {
        ...prevGameState,
        currentTurn: newCurrentTurn
      };
      return newGameState;
    });

  }, [gameState.currentTurn.team]);

  return (
      <div>
        <h1 className="ArticulateTitle">Articulate</h1>
        <GameBoard gamePositions={gameState.gamePositions}/>
        <div id="team" >Current Turn: Team {gameState.currentTurn.team}</div>
        <div id="teamRoleDiv">
          <div id="team">
            Your Team: {playerTeam}
          </div>
          <div id="role">
            Your Role: {(playerTeam === gameState.currentTurn.team) ? playerState.role : "Opponent"}
          </div>
        </div>
        {GameControlPanel()}
      </div>
  );

}

export default GamePage