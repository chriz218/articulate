import React, { useState, useEffect } from 'react';
import GameWordCard from './GameWordCard';
import { TIME_PER_TURN } from '../properties';

let myInterval;

function GameControlsArticulating({ role, gameState: { currentTurn }, setGameState, broadcastGameState, nextTeam }) {
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
      console.log("Times Up!");
      clearInterval(myInterval)
    }
  }, [secondsLeft]);


  const Instructions = ({role}) => {
    let describersString = "";
    currentTurn.describer.map((each, index) => {
      if(index === 0) {
        describersString += each;
      } else {
        describersString += `, ${each}`;
      }
    });
    switch(role){
      case 'GUESSER':
        return (
            <div>
              Your teammate(s), {describersString},
              is describing a word, guess the word!
            </div>
        );
      case 'OPPONENT':
        return (
            <div>
              {describersString} from an opponent’s
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
          phase: "planning"
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
      {(role !== 'GUESSER') && <GameWordCard category={currentTurn.category}/>}
      <Instructions role={role}/>
      {(role === 'DESCRIBER') && (
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

export default GameControlsArticulating;