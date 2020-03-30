import React, {useEffect} from 'react';
import '../../CSSFiles/RoomLobbyPage.css';
import {CREATE_ROOM} from '../../properties';
import PlayerListContainer from './PlayerListContainer';

// TODO : Check if number of players in each team are enough before allowing game to start

function RoomLobbyPage(
    { setPage, socket, socketId, isHost, playerName,
      numberOfTeams, roomCode, setRoomCode, gameState,
      setGameState, playerTeam, setPlayerTeam, broadcastGameState }
    ) {

  /**
   * Initial Load
   */
  useEffect(() => {
    if(isHost) {
      createRoom();
    }else {
      joinRoom({ playerName, socketId, roomCode });
    }
  }, []);

  /**
   * When host starts the game, and upon an updated gameState received
   * Checks gameState and redirects to GamePage to start the game
   */
  useEffect(() => {
    if(gameState.hasOwnProperty("currentState") && gameState.currentState !== "lobby") {
      setPage("game");
    }
  }, [gameState.currentState]);

  /**
   * Listens for new players joining the room
   * As Host, updates gameState and broadcasts it
   */
  useEffect(() => {
    socket.on("playerJoined", ({ playerName, socketId }) => {
      console.log("New Joiner: ", playerName);
      if(isHost){
        setGameState(prev => {
          const { teams } = prev;
          teams[0].push({playerName, socketId});
          const newGameState = { ...prev, teams };
          broadcastGameState(newGameState);
          return newGameState;
        });
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
        console.log("Room Created: ", data);
        setGameState(data);
        setRoomCode(data.roomCode);
        joinRoom({ playerName, socketId, roomCode: data.roomCode });
    })
  };

  /**
   * Runs for every player (including host) upon entering room
   * In hosts case, runs after retrieving the gameState
   * Defaults to Team 0
   * @param joinPayload
   */
  const joinRoom = (joinPayload) => {
    socket.emit('joinRoom', joinPayload, error => {
      if(error) alert(error);
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
        currentState: "game"
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  };

  const handleCancel = () => {
    setPage("home");
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
          <div className="BtnDiv">
            { isHost && <button type="button" id="PlayBtn" onClick={handleStartGame}>Play!</button>}
            <button id="CancelBtn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
  );

}

export default RoomLobbyPage;