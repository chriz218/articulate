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
  let socket = io(BACKEND_ENDPOINT, {transports: ['websocket']});
  const [isHost, setIsHost] = useState(false);
  const [hostJoined, setHostJoined] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState(0);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [gameState, setGameState] = useState({ teams: [[],[]] });

  useEffect(() => {
    if(!isHost) {
      socket.on('updateGameState', (newGameState) => {
        console.log("UPDATING GAME STATE");
        setGameState(newGameState);
      });
    }
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage
                socket={socket}
                setSocketId={setSocketId}
                socketId={socketId}
                setIsHost={setIsHost}/>
          </Route>
          <Route exact path="/create" component={CreateRoomPage}>
            <CreateRoomPage
                playerName={playerName}
                setPlayerName={setPlayerName}
                setNumberOfTeams={setNumberOfTeams}
            />
          </Route>
          <Route exact path="/join" component={JoinRoomPage}>
            <JoinRoomPage
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
                hostJoined={hostJoined}
                setHostJoined={setHostJoined}
                roomCode={roomCode}
                setRoomCode={setRoomCode}
                playerName={playerName}
                numberOfTeams={numberOfTeams}
                gameState={gameState}
                setGameState={setGameState}
                playerTeam={playerTeam}
                setPlayerTeam={setPlayerTeam}
            />
          </Route>
          <Route exact path="/game" component={GamePage}>
            <GamePage
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
        </Switch>  
      </BrowserRouter>
    </div>
  );
}

export default App;
