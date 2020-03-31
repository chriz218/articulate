import React, {useEffect} from 'react';
import '../../CSSFiles/JoinRoomPage.css';

function JoinRoomPage({setPage, setRoomCode, playerName, setPlayerName}) {

    /** Reset Prop Values*/
    useEffect(() => {
        setRoomCode('');
        setPlayerName('');
    }, []);

    const handleJoin = () => {
        if (playerName) {
            setPage('lobby');
        }
    };

    const handleCancel = () => {
        setPage('home');
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <div>
                <div className="form">
                    <label>Room Code:</label>
                    <input type="text" name="Room Code"
                           placeholder="Enter the room code..."
                           onChange={e => setRoomCode(e.target.value)}/>
                    <label>Your name:</label>
                    <input type="text" name="Your name"
                           placeholder="Enter your name here..."
                           onChange={e => setPlayerName(e.target.value)}/>
                </div>
                <div className="BtnDiv">
                    <button className="JoinBtn" onClick={handleJoin}>Join
                    </button>
                    <button className="CancelBtn"
                            onClick={handleCancel}>Cancel
                    </button>
                </div>
            </div>
        </div>
    );

}

export default JoinRoomPage;