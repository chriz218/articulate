import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import HomePage from './components/HomePage/HomePage.js';
import RoomLobbyPage from './components/RoomLobbyPage/RoomLobbyPage';
import JoinRoomPage from './components/JoinRoomPage/JoinRoomPage.js';
import GamePage from './components/GamePage/GamePage.js';
import CreateRoomPage from './components/CreateRoomPage/CreateRoomPage';
import {BACKEND_ENDPOINT} from './properties';

function App() {
  let socket = io(BACKEND_ENDPOINT, {transports: ['websocket']});
  const [isHost, setIsHost] = useState(false);
  const [socketId, setSocketId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerTeam, setPlayerTeam] = useState(0);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [gameState, setGameState] = useState({teams: [[], []]});

  /** Cycle to the next team */
  const nextTeam = (currentTeam) => {
    if (currentTeam === (numberOfTeams - 1)) {
      return 0;
    } else {
      return (currentTeam + 1);
    }
  };

  /**
   * Broadcasts gameState updates so that all connected clients are in sync
   * Usually used inside a setGameState function
   * @param newGameState
   */
  function broadcastGameState(newGameState) {
    socket.emit('broadcastGameState', newGameState, () => {
      console.log('Broadcasting GameState: ', newGameState);
    });
  }

  /**
   * Receives a new gameState coming from another client that ran broadcastGameState()
   * Updates our own gameState to be in sync with other clients
   */
  useEffect(() => {
    socket.on('updateGameState', (newGameState) => {
      console.log('Updating GameState', newGameState);
      setGameState(newGameState);
    });
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() =>
            <HomePage
              socket={socket}
              setSocketId={setSocketId}
              socketId={socketId}
              setIsHost={setIsHost}
            />}
          />
          <Route exact path="/create" render={() =>
            <CreateRoomPage
              playerName={playerName}
              setPlayerName={setPlayerName}
              setNumberOfTeams={setNumberOfTeams}
            />}
          />
          <Route exact path="/join" render={() =>
            <JoinRoomPage
              playerName={playerName}
              setRoomCode={setRoomCode}
              setPlayerName={setPlayerName}
            />}
          />
          <Route exact path="/lobby" render={() =>
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
              playerTeam={playerTeam}
              setPlayerTeam={setPlayerTeam}
              broadcastGameState={broadcastGameState}
            />}
          />
          <Route exact path="/game" render={() =>
            <GamePage
              isHost={isHost}
              playerName={playerName}
              playerTeam={playerTeam}
              gameState={gameState}
              setGameState={setGameState}
              broadcastGameState={broadcastGameState}
              nextTeam={nextTeam}
            />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
