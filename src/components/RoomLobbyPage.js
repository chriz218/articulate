import axios from 'axios'
import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/RoomLobbyPage.css';
import {CREATE_ROOM} from '../properties';
import PlayerListContainer from './PlayerListContainer';

function RoomLobbyPage(
    { socket, isHost, hasJoined, setHasJoined, socketId, playerName,
      numberOfTeams, roomCode, setRoomCode, gameState, setGameState,
      playerTeam, setPlayerTeam, broadcastGameState }
    ) {
  let history = useHistory();

  // Initial Load
  useEffect(() => {
    if(isHost) {
      createRoom();
    }else {
      joinRoom({ playerName, socketId, roomCode });
    }
  }, []);

  useEffect(() => {
    if(gameState.hasOwnProperty("currentState") && gameState.currentState !== "lobby") {
      history.push("/game");
    }
  }, [gameState]);

  // FOR HOST
  // New Player Joins Lobby
  useEffect(() => {
    socket.on("playerJoined", ({ playerName, socketId }) => {
      console.log("PLAYER JOINS: ", playerName);
      setGameState(prev => {
        const { teams } = prev;
        teams[0].push(
          {
            playerName: playerName,
            socketId: socketId
          }
        );
        const newGameState = { ...prev, teams };
        if(isHost) broadcastGameState(newGameState);
        return newGameState;
      });
    });
  });

  // HOST FUNCTIONS
  // Create Room and GameState
  const createRoom = () => {
    fetch(CREATE_ROOM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: {playerName, socketId}, numberOfTeams
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGameState(data);
        setRoomCode(data.roomCode);
        joinRoom({ playerName, socketId, roomCode: data.roomCode });
        broadcastGameState(data);
    })
  };

  // ALL PLAYER FUNCTIONS
  // Join Room
  const joinRoom = (joinPayload) => {
    socket.emit('joinRoom', joinPayload, error => {
      if(error) alert(error);
      setHasJoined(true);
      setPlayerTeam(0);
    });
  };

  const handleStartGame = () => {
    setGameState(prevGameState => {
      const currentTurn = {
        status: "planning",
        team: 0,
        category: "Object",
        word: "",
        describer: [],
        guesser: []
      };

      const gamePositions = [];
      for(let i = 0; i < numberOfTeams; i++) {
        gamePositions.push(0);
      }

      const newGameState = {
        ...prevGameState,
        currentState: "planning",
        currentTurn,
        gamePositions
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  };

  const handleCancel = () => {
    history.push("/")
  };

  return (
      <div>
        <h1>Articulate</h1>
        <form action="#" method="POST">
          <div className="form-content">
            <label>Room Code: {`${roomCode}`}</label>
            <label>Your name: {`${playerName}`}</label>
            <label>No. of Teams: {`${numberOfTeams}`}</label>
            <label>List of Players:</label>
            <PlayerListContainer
                socket={socket}
                socketId={socketId}
                gameState={gameState}
                setGameState={setGameState}
                setPlayerTeam={setPlayerTeam}
                playerTeam={playerTeam}
                broadcastGameState={broadcastGameState}
            />
          </div>
          <div className="BtnDiv">
            { isHost && <button type="button" id="PlayBtn" onClick={handleStartGame}>Play!</button>}
            <button id="CancelBtn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
  );

}

export default RoomLobbyPage;