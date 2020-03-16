import axios from 'axios'
import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/RoomLobbyPage.css';
import {CREATE_ROOM} from '../properties';

let hostJoined = false;

function RoomLobbyPage(
    { socket, isHost, socketId, playerName, numberOfTeams, roomCode, setRoomCode, gameState, setGameState }
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
        return { ...prev, teams };
      });
    });
  });
  // Broadcast gameState Changes
  useEffect(() => {
    if(isHost && hostJoined) {
      socket.emit('broadcastGameState', gameState, () => {
        console.log("Broadcasting GameState: ", gameState.roomCode);
      });
    }
  }, [gameState]);

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
    })
  };

  // ALL PLAYER FUNCTIONS
  // Join Room
  const joinRoom = (joinPayload) => {
    socket.emit('joinRoom', joinPayload, error => {
      if(error) alert(error);
      hostJoined = true;
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