import React, {useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSSFiles/RoomLobbyPage.css';
import {CREATE_ROOM, PAGE_GAME, PAGE_HOME, PAGE_JOIN, RESPONSE_JSON, STATE_GAME, STATE_LOBBY} from '../../properties';
import PlayerListContainer from './PlayerListContainer';
import {CheckEnoughPlayers, PostRequest} from '../Util/util';
import {Keys, SobaTeamLobbyContainer} from 'soba-game';
import {toast} from 'react-toastify';

function RoomLobbyPage(
    {
        /** Required props for SobaTeamLobbyContainer*/
        socket, isHost, gameState, setGameState,
        setPlayerTeam, playerName, playerTeam, broadcastGameState,

        numberOfTeams, roomCode, setRoomCode, setPage, socketId,
        error, isLoading, changeTeam, joinRoom,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Handling Errors
     */
    useEffect(() => {
        if (error.error) {
            switch (error.type) {
                case Keys.ERROR_PLAYER_NAME_TAKEN:
                    setPage(PAGE_JOIN);
                    toast.error(`Name ${playerName} has already been taken`);
                    console.log('Kicked out of room!');
                    return;
                case Keys.ERROR_INVALID_ROOM_CODE:
                    console.log(`Room Code ${roomCode} doesn't exist`);
                    setPage(PAGE_JOIN);
                    toast.error(`Room ${roomCode} does not exist`);
                    return;
                default:
                    console.error('INVALID ROOM CODE');
            }
        }
    }, [error, setPage, playerName, roomCode]);

    /**
     * When host starts the game, and upon an updated gameState received
     * Checks gameState and redirects to GamePage to start the game
     */
    useEffect(() => {
        if (gameState.hasOwnProperty('currentState') && gameState.currentState !== STATE_LOBBY) {
            setPage(PAGE_GAME);
        }
    }, [gameState, setPage]);

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
     * HOST ONLY
     * Starts the game by updating gameState and broadcasting it
     */
    const handleStartGame = () => {
        setGameState(prevGameState => {
            const currentState = STATE_GAME;
            const newGameState = {...prevGameState, currentState};
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
            {
                isLoading ?
                    <div>
                        LOADING........
                    </div>
                    :
                    <div>
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
                                gameState={gameState}
                                changeTeam={changeTeam}
                            />
                        </div>
                        <div id="Lobby-BtnDiv">
                            {
                                isHost &&
                                <button className="Lobby-Btns" type="button" id="Lobby-PlayBtn"
                                        onClick={handleStartGame}
                                        disabled={!CheckEnoughPlayers(gameState.teams)}>
                                    Play!
                                </button>}
                            <button className="Lobby-Btns" id="Lobby-CancelBtn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
            }
        </div>
    );

}

export default SobaTeamLobbyContainer(RoomLobbyPage);