import React, {useEffect, useState} from 'react';
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
    const [page, setPage] = useState('home');

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

    function RenderPage() {
        switch (page) {
            case 'create':
                return (
                    <CreateRoomPage
                        setPage={setPage}
                        playerName={playerName}
                        setPlayerName={setPlayerName}
                        setNumberOfTeams={setNumberOfTeams}
                    />
                );
            case 'join':
                return (
                    <JoinRoomPage
                        setPage={setPage}
                        playerName={playerName}
                        setRoomCode={setRoomCode}
                        setPlayerName={setPlayerName}
                    />
                );
            case 'lobby':
                return (
                    <RoomLobbyPage
                        setPage={setPage}
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
                    />
                );
            case 'game':
                return (
                    <GamePage
                        numberOfTeams={numberOfTeams}
                        playerName={playerName}
                        playerTeam={playerTeam}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                    />
                );
            default:
                return (
                    <HomePage
                        setPage={setPage}
                        socket={socket}
                        setSocketId={setSocketId}
                        socketId={socketId}
                        setIsHost={setIsHost}
                    />
                );
        }
    }

    return (
        <div className="App">
            {RenderPage()}
        </div>
    );
}

export default App;
