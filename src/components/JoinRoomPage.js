import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/JoinRoomPage.css'

function JoinRoomPage() {

    let history = useHistory();

    const handleCancel = () => {
        history.push("/")
    }

    return (
        <div>
            <h1>Articulate</h1>
            <form action="#" method="POST">
                <div className="form-content">
                    <label>Room Code:</label>
                    <input type="text" name="Room Code" placeholder="Enter the room code..." />
                    <label>Your name:</label>
                    <input type="text" name="Your name" placeholder="Enter your name here..." />
                </div>
                <div className="BtnDiv">
                    <button type="submit" id="JoinBtn">Join</button>
                    <button id="CancelBtn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );

}

export default JoinRoomPage