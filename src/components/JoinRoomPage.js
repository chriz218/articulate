import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/JoinRoomPage.css'

function JoinRoomPage({ setRoomCode, playerName, setPlayerName }) {
    let history = useHistory();

    const handleJoin = async() => {
        if(playerName) {
            history.push("/lobby")
        }
    };

    const handleCancel = () => {
        history.push("/")
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <div>
                <div className="form">
                    <label>Room Code:</label>
                    <input type="text" name="Room Code" placeholder="Enter the room code..." onChange={e => setRoomCode(e.target.value)}/>
                    <label>Your name:</label>
                    <input type="text" name="Your name" placeholder="Enter your name here..." onChange={e => setPlayerName(e.target.value)}/>
                </div>
                <div className="BtnDiv">
                    <button className="JoinBtn" onClick={handleJoin}>Join</button>
                    <button className="CancelBtn" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );

}

export default JoinRoomPage