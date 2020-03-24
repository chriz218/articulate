import React, { useState, useEffect } from 'react';
import GameWordCard from './GameWordCard';
import { TIME_PER_TURN } from '../properties';

let myInterval;

function GamePlayerControls({ role, gameState: { currentTurn }, setGameState, broadcastGameState, nextTeam }) {
  const [secondsLeft, setSecondsLeft] = useState(TIME_PER_TURN);

  useEffect(() => {
    myInterval = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(prevSecondsLeft => (prevSecondsLeft - 1));
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    }
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      console.log("TIMES UP");
      clearInterval(myInterval)
    }
  }, [secondsLeft]);


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
        return <React.Fragment />;
    }
  };

  const handleCorrect = () => {

  };

  const handleSkip = () => {

  };

  const handleFoul = () => {
    clearInterval(myInterval);
    setGameState(prevGameState => {
      const newTeam = nextTeam(prevGameState.currentTurn.team);
      const newGameState = {
        ...prevGameState,
        currentTurn: {
          ...prevGameState.currentTurn,
          describer: [],
          guesser: [],
          team: newTeam,
          status: "planning"
        }
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  };

  return (
    <React.Fragment>
      <div id="wordCategory">
        Word Category: {currentTurn.category}
      </div>
      <div id="time">
        Seconds Left: {secondsLeft}
      </div>
      {(role !== 'Guesser') && <GameWordCard category={currentTurn.category}/>}
      <Instructions role={role}/>
      {(role === 'Describer') && (
        <div id="btnDiv">
          <button className="btn" id="correctBtn" onClick={handleCorrect}>Correct!</button>
          <button className="btn" id="skipBtn" onClick={handleSkip}>Skip</button>
          <button className="btn" id="foulBtn" onClick={handleFoul}>Foul!</button>
        </div>
        )
      }
    </React.Fragment>
  )
}

export default GamePlayerControls;