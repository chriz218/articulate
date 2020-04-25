import React, {useEffect} from 'react';
import {ToastContainer, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSSFiles/JoinRoomPage.css';
import {PAGE_HOME, PAGE_LOBBY} from '../../properties';

function JoinRoomPage({setPage, setRoomCode, playerName, setPlayerName}) {

    /** Reset Prop Values*/
    useEffect(() => {
        setRoomCode('');
        setPlayerName('');
    }, [setRoomCode, setPlayerName]);

    const handleJoin = () => {
        if (playerName) {
            setPage(PAGE_LOBBY);
        }
    };

    const handleCancel = () => {
        setPage(PAGE_HOME);
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <>
                <ToastContainer
                    draggable={false}
                    transition={Zoom}
                    autoClose={1950}
                    className="Join-FailJoinToast"/>
            </>
            <div>
                <div className="Join-Form">
                    <label className="Join-Label">Room Code:</label>
                    <input className="Join-Input" type="text" name="Room Code"
                           placeholder="Enter the room code..."
                           onChange={e => setRoomCode(e.target.value)}/>
                    <label className="Join-Label">Your name:</label>
                    <input className="Join-Input" type="text" name="Your name"
                           placeholder="Enter your name here..."
                           onChange={e => setPlayerName(e.target.value)}/>
                </div>
                <div id="Join-BtnDiv">
                    <button id="Join-JoinBtn" className="Join-Btns"
                            onClick={handleJoin}>Join
                    </button>
                    <button id="Join-CancelBtn" className="Join-Btns"
                            onClick={handleCancel}>Cancel
                    </button>
                </div>
            </div>
        </div>
    );

}

export default JoinRoomPage;