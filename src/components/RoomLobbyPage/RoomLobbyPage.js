import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSSFiles/RoomLobbyPage.css';
import {
    CREATE_ROOM,
    PAGE_GAME,
    PAGE_HOME,
    PAGE_JOIN,
    RESPONSE_JSON,
    SOCKET_EMIT_JOIN_ROOM,
    SOCKET_ON_PLAYER_JOINED,
    SOCKET_ON_PLAYER_JOINED_FAILED,
    STATE_GAME,
    STATE_LOBBY,
} from '../../properties';
import PlayerListContainer from './PlayerListContainer';
import {CheckEnoughPlayers, PostRequest} from '../Util/util';

// TODO : Check if number of players in each team are enough before allowing game to start

function RoomLobbyPage(
    {
        setPage, socket, socketId, isHost, playerName,
        numberOfTeams, roomCode, setRoomCode, gameState,
        setGameState, playerTeam, setPlayerTeam, broadcastGameState,
    },
) {

    /**
     * Initial Load
     */
    useEffect(() => {
        if (isHost) {
            createRoom();
        } else {
            joinRoom({isHost, playerName, socketId, roomCode});
        }
    }, []);

    /**
     * When host starts the game, and upon an updated gameState received
     * Checks gameState and redirects to GamePage to start the game
     */
    useEffect(() => {
        if (gameState.hasOwnProperty('currentState') && gameState.currentState !== STATE_LOBBY) {
            setPage(PAGE_GAME);
        }
    }, [gameState.currentState]);

    /**
     * Listens for new players joining the room
     * As Host, updates gameState and broadcasts it
     */
    useEffect(() => {
        socket.on(SOCKET_ON_PLAYER_JOINED, (res) => {
            console.log('New Joiner: ', res.playerName);
            if (isHost) {
                if (playerName === res.playerName) {
                    setGameState(prevGameState => {
                        const {teams} = prevGameState;
                        teams[0] = [{playerName: res.playerName, socketId: res.socketId}];
                        const newGameState = {...prevGameState, teams};
                        broadcastGameState(newGameState);
                        return newGameState;
                    });
                } else {
                    setGameState(prevGameState => {
                        const {teams} = prevGameState;
                        teams[0].push({playerName: res.playerName, socketId: res.socketId});
                        const newGameState = {...prevGameState, teams};
                        broadcastGameState(newGameState);
                        return newGameState;
                    });
                }
            }
        });
    });

    /**
     * For joiners, fail if they entered a wrong room code
     */
    useEffect(() => {
        socket.on(SOCKET_ON_PLAYER_JOINED_FAILED, (res) => {
            if (res.playerName === playerName && res.socketId === socketId) {
                console.log(`Room Code ${roomCode} doesn't exist`);
                setPage(PAGE_JOIN);
                toast.error(`Room ${roomCode} does not exist`);
            }
        });
    });

    /**
     * HOST ONLY
     * Sends a POST request to the server
     * Server generates a corresponding starting gameState
     * Joins the room afterwards via socket.io
     */
    const createRoom = () => {
        PostRequest(CREATE_ROOM, {
            host: {playerName, socketId}, numberOfTeams,
        }, RESPONSE_JSON, data => {
            console.log('Room Created: ', data);
            setGameState(data);
            setRoomCode(data.roomCode);
            joinRoom({isHost, playerName, socketId, roomCode: data.roomCode});
        }, null);
    };

    /**
     * Runs for every player (including host) upon entering room
     * In hosts case, runs after retrieving the gameState
     * Defaults to Team 0
     * @param joinPayload
     */
    const joinRoom = (joinPayload) => {
        socket.emit(SOCKET_EMIT_JOIN_ROOM, joinPayload, error => {
            if (error) alert(error);
            setPlayerTeam(0);
        });
    };

    /**
     * HOST ONLY
     * Checks if player conditions are met
     * Starts the game by updating gameState and broadcasting it
     */
    const handleStartGame = () => {
        setGameState(prevGameState => {
            const newGameState = {
                ...prevGameState,
                currentState: STATE_GAME,
            };
            broadcastGameState(newGameState);
            return newGameState;
        });
    };

    const handleCancel = () => {
        setPage(PAGE_HOME);
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <form action="#" method="POST">
                <div className="form-content">
                    <label className="Lobby-Label">
                        Room Code: {`${roomCode}`}
                    </label>
                    <label className="Lobby-Label">
                        Your name: {`${playerName}`}
                    </label>
                    <label className="Lobby-Label">
                        No. of Teams: {`${gameState.numberOfTeams}`}
                    </label>
                    <label className="Lobby-Label">List of Players:</label>
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
                <div id="Lobby-BtnDiv">
                    {
                        isHost &&
                        <button className="Lobby-Btns" type="button" id="Lobby-PlayBtn"
                                onClick={handleStartGame} disabled={!CheckEnoughPlayers(numberOfTeams, gameState.teams)}>
                            Play!
                        </button>}
                    <button className="Lobby-Btns" id="Lobby-CancelBtn" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

}

export default RoomLobbyPage;