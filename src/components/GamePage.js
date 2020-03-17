import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Route, Link, useHistory } from "react-router-dom"
import '../CSSFiles/GamePage.css'

function Board({ boardBlock, index }) {
    return (
        <div className="boardBlock" id={"boardBlock" + index}>{boardBlock}</div>
    )
}


function GamePage() {
    const [boardBlocks, setBoardBlocks] = useState(['', '', '', '', '', '',
        '', '', '', '', '', '',
        '', '', '', '', '', '',
        '', '', '', 'D', '', '',
        '', 'AB', '', '', '', '',
        '', '', '', 'C', '', '',
        '', '', '', '', '', '']);


    const [timer, setTimer] = useState(60);

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <div className="board">
                {boardBlocks.map((boardBlock, index) => (
                    <Board index={index} boardBlock={boardBlock} />
                ))}
            </div>
            <div id="teamRoleDiv">
                <div id="team">
                    Team: A
                </div>
                <div id="role">
                    Your Role: Describer
                </div>
            </div>
            <div id="wordCategory">
                Word Category: Object
            </div>
            <div id="time">
                Seconds Left: {timer}
            </div>
            <div id="generatedWordDiv">
                <div id="word">
                    Rafael Nadal
                </div>
            </div>
            <div id="btnDiv">
                <button className="btn" id="correctBtn">Correct!</button>
                <button className="btn" id="skipBtn">Skip</button>
                <button className="btn" id="foulBtn">Foul!</button>
            </div>    
        </div>
    );

}

export default GamePage