import React, {useEffect} from 'react';
import '../../CSSFiles/CreateRoomPage.css';
import {PAGE_HOME, PAGE_LOBBY} from '../../properties';

function CreateRoomPage({setPage, playerName, setPlayerName, setNumberOfTeams}) {

    /** Reset Prop Values*/
    useEffect(() => {
        setPlayerName('');
        setNumberOfTeams(2);
    }, [setPlayerName, setNumberOfTeams]);

    const handleCreate = () => {
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
            <div>
                <div className="Create-Form">
                    <label className="Create-Label">Your name:</label>
                    <input className="Create-Input" type="text" name="Your name"
                           placeholder="Enter your name here..."
                           onChange={e => setPlayerName(e.target.value)}/>
                    <label className="Create-Label">No. of Teams:</label>
                    <select className="Create-SelectTeamNo" name="No. of Teams"
                            defaultValue="2"
                            onChange={e => setNumberOfTeams(e.target.value)}>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div id="Create-BtnDiv">
                    <button className="Create-Btns" id="Create-CreateBtn"
                            onClick={handleCreate}>Create
                    </button>
                    <button className="Create-Btns" id="Create-CancelBtn"
                            onClick={handleCancel}>Cancel
                    </button>
                </div>
            </div>
        </div>
    );

}

export default CreateRoomPage;