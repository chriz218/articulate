import React, { useState, useEffect } from 'react';
import GameWordCard from './GameWordCard';
import { TIME_PER_TURN } from '../../properties';

let myInterval;
let correctlyAnswered;
let alreadySkipped;

function GameControlsArticulating({ isHost, role, gameState: { currentTurn }, setGameState, broadcastGameState, nextTeam }) {
  const [secondsLeft, setSecondsLeft] = useState(TIME_PER_TURN);

  /** Upon load, initialise variables and start the countdown*/
  useEffect(() => {
    correctlyAnswered = 0;
    alreadySkipped = false;

    /** Set the first word*/
    changeWord();

    myInterval = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(prevSecondsLeft => (prevSecondsLeft - 1));
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    }
  }, []);

  /** Upon timer countdown reaching zero, go to next turn*/
  useEffect(() => {
    if (secondsLeft === 0) {
      console.log("Times Up!");
      clearInterval(myInterval);
      nextTurn();
    }
  }, [secondsLeft]);

  /** Instruction Text for Opponents and Guessers*/
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

  /** Update board positions and go to next turn*/
  function nextTurn() {
    setGameState(prevGameState => {
      let newGamePositions  = prevGameState.gamePositions;
      console.log("INCREASE POS: ", correctlyAnswered);
      newGamePositions[prevGameState.currentTurn.team] += correctlyAnswered;

      const newTeam = nextTeam(prevGameState.currentTurn.team);
      const newGameState = {
        ...prevGameState,
        currentTurn: {
          ...prevGameState.currentTurn,
          describer: [],
          guesser: [],
          team: newTeam,
          phase: "planning"
        },
        gamePositions: newGamePositions
      };
      broadcastGameState(newGameState);
      return newGameState;
    });
  }

  /** TODO: Implement fetching a random word from server
   * NEED TO FIGURE OUT HOW TO MAKE SURE EVERYONE HAS THE SAME WORD
  */
  function changeWord() {
    setGameState(prevGameState => {
      const newGameState = {
        ...prevGameState,
        currentTurn: {
          ...prevGameState.currentTurn,
          word: "Chair",
          category: "Object"
        }
      };
      return newGameState
    })
  }

  // TODO use changeWord function
  /** Plus one point*/
  const handleCorrect = () => {
    correctlyAnswered = correctlyAnswered + 1;
    console.log("INCREASE POINT: ", correctlyAnswered);
    changeWord();
  };

  // TODO Add nextWord function implementation
  const handleSkip = () => {
    if(!alreadySkipped) {
      alreadySkipped = true;
      changeWord();
    }
  };

  /** Stops timer, goes to nextTurn with no points*/
  const handleFoul = () => {
    clearInterval(myInterval);
    correctlyAnswered = 0;
    nextTurn();
  };

  return (
    <React.Fragment>
      <div id="wordCategory">
        Word Category: {currentTurn.category}
      </div>
      <div id="time">
        Seconds Left: {secondsLeft}
      </div>
      {(role !== 'GUESSER') && <GameWordCard category={currentTurn.category} word={currentTurn.word}/>}
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