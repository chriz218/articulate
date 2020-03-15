import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import './App.css';
import HomePage from './components/HomePage.js';
import RoomLobbyPage from './components/RoomLobbyPage';
import JoinRoomPage from './components/JoinRoomPage.js';
import GamePage from './components/GamePage.js';
import {BACKEND_ENDPOINT} from './properties';
import CreateRoomPage from './components/CreateRoomPage';


function App() {
  let socket = io(BACKEND_ENDPOINT);
  const [isHost, setIsHost] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [gameState, setGameState] = useState({ teams: [[]] });

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage socket={socket} setSocketId={setSocketId} socketId={socketId} setIsHost={setIsHost}/>
          </Route>
          <Route exact path="/create" component={CreateRoomPage}>
            <CreateRoomPage
                socket={socket}
                socketId={socketId}
                playerName={playerName}
                setPlayerName={setPlayerName}
                setNumberOfTeams={setNumberOfTeams}
            />
          </Route>
          <Route exact path="/join" component={JoinRoomPage}>
            <JoinRoomPage
                socket={socket}
                socketId={socketId}
                playerName={playerName}
                setRoomCode={setRoomCode}
                setPlayerName={setPlayerName}
            />
          </Route>
          <Route exact path="/lobby" component={RoomLobbyPage}>
            <RoomLobbyPage
                socket={socket}
                socketId={socketId}
                isHost={isHost}
                roomCode={roomCode}
                setRoomCode={setRoomCode}
                playerName={playerName}
                numberOfTeams={numberOfTeams}
                gameState={gameState}
                setGameState={setGameState}
            />
          </Route>
          <Route exact path="/game" component={GamePage}>
            <GamePage
                socket={socket}
                socketId={socketId}
                playerName={playerName}
                gameState={gameState}
            />
          </Route>  
        </Switch>  
      </BrowserRouter>
    </div>
  );
}

export default App;
