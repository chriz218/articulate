import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/CreateRoomPage.css';

function CreateRoomPage() {

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
                    <input type="text" name="Room Code" placeholder="Will be randomly generated..." />
                    <label>Your name:</label>
                    <input type="text" name="Your name" placeholder="Enter your name here..." />
                    <label>No. of Teams:</label>
                    <select name="No. of Teams">
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