import axios from 'axios'
import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Route, Link, useHistory } from "react-router-dom"
import io from "socket.io-client";
import { BACKEND_ENDPOINT } from '../properties';
import '../CSSFiles/CreateRoomPage.css';

let socket;

function CreateRoomPage() {
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [numberOfTeams, setNumberOfTeams] = useState("");
    let history = useHistory();

    // Initial Load
    useEffect(() => {
        socket = io(BACKEND_ENDPOINT);
        socket.emit('createRoom', {}, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [BACKEND_ENDPOINT]);
    useEffect(() => {
        socket.on('roomCreated', (roomCode) => {
            console.log(roomCode);
            setRoomCode(roomCode);
        });
    });

    // Type in playerName
    useEffect(() => {
        socket.emit('setName', { playerName }, (error) => {
            console.log(playerName);
            if(error) {
                alert(error);
            }
        });
    }, [playerName]);

    // Set Number of Teams
    useEffect(() => {
        socket.emit('setNumberOfTeams', { numberOfTeams }, (error) => {
            console.log(numberOfTeams);
            if(error) {
                alert(error);
            }
        });
    }, [numberOfTeams]);

    const handleCancel = () => {
        history.push("/")
    };

    return (
        <div>
            <h1>Articulate</h1>
            <form action="#" method="POST">
                <div className="form-content">
                    <label>Room Code:</label>
                    <input readOnly type="text" name="Room Code" placeholder="Will be randomly generated..." value={roomCode}/>
                    <label>Your name:</label>
                    <input type="text" name="Your name" placeholder="Enter your name here..." onChange={e => setPlayerName(e.target.value)}/>
                    <label>No. of Teams:</label>
                    <select name="No. of Teams" onChange={e => setNumberOfTeams(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <label>List of Players:</label>
                    <div className="players-list">
                        List of players will be here
                    </div>
                </div>
                <div className="BtnDiv">
                    <button type="submit" id="PlayBtn">Play!</button>
                    <button id="CancelBtn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );

}

export default CreateRoomPage