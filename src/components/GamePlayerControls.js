import React from 'react';
import GameWordCard from './GameWordCard';

function GamePlayerControls({ role, gameState: { currentTurn }, timer }) {
  const Instructions = ({role}) => {
    switch(role){
      case 'Guesser':
        return (
            <div>
              Your teammate, {currentTurn.describer[0]},
              is describing a word, guess the word!
            </div>
        );
      case 'Opponent':
        return (
            <div>
              {currentTurn.describer[0]} from an opponent’s
              team is describing a word, pay attention
              and catch the player if the player says the word
            </div>
        );
      default:
        return <div />;
    }
  };

  return (
    <React.Fragment>
      <div id="wordCategory">
        Word Category: {currentTurn.category}
      </div>
      <div id="time">
        Seconds Left: {timer}
      </div>
      {(role !== 'Guesser') && <GameWordCard category={currentTurn.category}/>}
      <Instructions role={role}/>
      {(role === 'Describer') && (
        <div id="btnDiv">
          <button className="btn" id="correctBtn">Correct!</button>
          <button className="btn" id="skipBtn">Skip</button>
          <button className="btn" id="foulBtn">Foul!</button>
        </div>
        )
      }
    </React.Fragment>
  )
}

export default GamePlayerControls;