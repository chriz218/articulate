import React from 'react';
import '../../CSSFiles/CreateRoomPage.css';

function CreateRoomPage({ setPage, playerName, setPlayerName, setNumberOfTeams }) {

  const handleCreate = () => {
    if(playerName) {
      setPage("lobby");
    }
  };

  const handleCancel = () => {
    setPage("home");
  };

  return (
      <div>
        <h1 className="ArticulateTitle">Articulate</h1>
        <div>
          <div className="form">
            <label>Your name:</label>
            <input type="text" name="Your name" placeholder="Enter your name here..." onChange={e => setPlayerName(e.target.value)}/>
            <label>No. of Teams:</label>
            <select className="selectTeamNo" name="No. of Teams" defaultValue="2" onChange={e => setNumberOfTeams(e.target.value)}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="BtnDiv">
            <button className="CreateBtn" onClick={handleCreate}>Create</button>
            <button className="CancelBtn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
  );

}

export default CreateRoomPage