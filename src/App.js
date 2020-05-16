import React, {useEffect, useState} from 'react';
import './App.css';
import io from 'socket.io-client';
import {SobaParentContainer, withTeamProps} from 'soba-game';
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
    PAGE_GAMEOVER,
    PAGE_HOME,
    PAGE_JOIN,
    PAGE_LOBBY,
    SOCKET_EMIT_BROADCAST_TOAST,
    SOCKET_ON_GET_TOAST,
} from './properties';
import GameOverPage from './components/GameOverPage/GameOverPage';

const socketConnect = io(BACKEND_ENDPOINT, {transports: ['websocket']});

function App(
    {
        socket, socketId, gameState, setGameState, broadcastGameState, leaveRoom,
        isHost, setIsHost, roomCode, setRoomCode, playerName, setPlayerName,
        playerTeam, setPlayerTeam, numberOfTeams, setNumberOfTeams,
    },
) {
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
                        setPage={setPage}
                        numberOfTeams={numberOfTeams}
                        playerName={playerName}
                        playerTeam={playerTeam}
                        gameState={gameState}
                        setGameState={setGameState}
                        broadcastGameState={broadcastGameState}
                        broadcastToast={broadcastToast}
                    />
                );
            case PAGE_GAMEOVER:
                return (
                    <GameOverPage
                        setPage={setPage}
                        gameState={gameState}
                        setGameState={setGameState}
                        leaveRoom={leaveRoom}
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

const appWithTeamProps = withTeamProps(App, {
    defaultRoomCode: '',
    defaultIsHost: false,
    defaultPlayerName: '',
    defaultTeam: 0,
    defaultNumberOfTeams: 2,
});
export default SobaParentContainer(appWithTeamProps, socketConnect, {logging: true});
