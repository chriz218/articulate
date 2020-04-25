import React, {useEffect, useState} from 'react';
import './App.css';
import io from 'socket.io-client';
import {SobaParentContainer} from 'soba-game';
import HomePage from './components/HomePage/HomePage.js';
import RoomLobbyPage from './components/RoomLobbyPage/RoomLobbyPage';
import JoinRoomPage from './components/JoinRoomPage/JoinRoomPage.js';
import GamePage from './components/GamePage/GamePage.js';
import CreateRoomPage from './components/CreateRoomPage/CreateRoomPage';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';
import {
    BACKEND_ENDPOINT,
    PAGE_CREATE,
    PAGE_GAME,
    PAGE_HOME,
    PAGE_JOIN,
    PAGE_LOBBY,
    SOCKET_EMIT_BROADCAST_TOAST,
    SOCKET_ON_GET_TOAST,
} from './properties';

const socketConnect = io(BACKEND_ENDPOINT, {transports: ['websocket']});

function App(
    {
        socket, socketId,
        gameState, setGameState,
        broadcastGameState,
    },
) {
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [playerTeam, setPlayerTeam] = useState(0);
    const [numberOfTeams, setNumberOfTeams] = useState(2);
    const [page, setPage] = useState(PAGE_HOME);

    const playerNameRef = React.useRef(playerName);
    useEffect(() => {
        playerNameRef.current = playerName;
    }, [playerName]);

    function broadcastToast(newToastObject) {
        socket.emit(SOCKET_EMIT_BROADCAST_TOAST, newToastObject, () => {
            console.log('Broadcasting toastObject: ', newToastObject);
        });
    }

    /**
     * When one presses the correct or skip button during game
     * Sends a toast message to everyone else
     */
    useEffect(() => {
        socket.on(SOCKET_ON_GET_TOAST, (res) => {
            if (res.toastSenderName !== playerNameRef.current) {
                switch (res.toastType) {
                    case 'warn':
                        toast.warn(res.toastMessage);
                        return;
                    case 'success':
                        toast.success(res.toastMessage);
                        return;
                    case 'error':
                        toast.error(res.toastMessage);
                        return;
                    default:
                        console.error('Wrong toastType: ', res.toastType);
                }
            }
        });
        return () => {
            socket.off(SOCKET_ON_GET_TOAST);
        };
    });

    function RenderPage() {
        switch (page) {
            case PAGE_CREATE:
                return (
                    <CreateRoomPage
                        setPage={setPage}
                        playerName={playerName}
                        setPlayerName={setPlayerName}
                        setNumberOfTeams={setNumberOfTeams}
                    />
                );
            case PAGE_JOIN:
                return (
                    <JoinRoomPage
                        setPage={setPage}
                        playerName={playerName}
                        setRoomCode={setRoomCode}
                        setPlayerName={setPlayerName}
                    />
                );
            case PAGE_LOBBY:
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
            case PAGE_GAME:
                return (
                    <GamePage
                        numberOfTeams={numberOfTeams}
                        playerName={playerName}
                        playerTeam={playerTeam}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                        broadcastToast={broadcastToast}
                    />
                );
            default:
                return (
                    <HomePage
                        setPage={setPage}
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

export default SobaParentContainer(App, socketConnect);