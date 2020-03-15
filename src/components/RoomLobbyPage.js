import axios from 'axios'
import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/RoomLobbyPage.css';
import {CREATE_ROOM} from '../properties';

function RoomLobbyPage(
    { socket, isHost, socketId, playerName, numberOfTeams, roomCode, setRoomCode, gameState, setGameState }
    ) {
  let history = useHistory();

  useEffect(() => {
    socket.on('requestGameState', (newPlayer, error) => {
      if(isHost) {
        console.log("GAME STATE REQUESTED");
        setGameState(prev => {
          prev.teams[0].concat(
              {
                playerName: newPlayer.playerName,
                socketId: newPlayer.socketId
              })
        });
        socket.emit('broadcastGameState', gameState, error => {
          if (error) alert(error);
        });
        if (error) alert(error);
      }
    });
    socket.on('broadcastGameState', (gameState, error) => {
      setGameState(gameState);
      if(error) alert(error);
    });
    // FOR ALL
    // New Player Joins
    socket.on('playerJoined', { playerName, socketId }, (error) => {
      console.log("PLAYER JOINS: ", playerName);
      if(error) {
        alert(error);
      }
    });
  });


  // Initial Load
  useEffect(() => {
    if(isHost) {
      createRoom();
    }else{
      joinRoom();
    }
  }, []);

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
    })
  };
  // OTHER PLAYER FUNCTIONS
  // Join Room and fetch GameState
  const joinRoom = () => {
    socket.emit('joinRoom', {playerName, socketId, roomCode}, error => {
      if(error) alert(error);
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
            <div className="players-list">
              {gameState.teams.map(team => {
                return team.map(player => {
                  return <p>{player.playerName}</p>
                })
              })
              }
            </div>
          </div>
          <div className="BtnDiv">
            { isHost && <button type="submit" id="PlayBtn">Play!</button>}
            <button id="CancelBtn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
  );

}

export default RoomLobbyPage;