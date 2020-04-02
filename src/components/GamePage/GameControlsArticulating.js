import React, {useState, useEffect} from 'react';
import GameWordCard from './GameWordCard';
import {
    CREATE_ROOM,
    RANDOM_WORD_GIVEN_USED,
    TIME_PER_TURN,
} from '../../properties';

let myInterval;
let correctlyAnswered;
let alreadySkipped;

function GameControlsArticulating({isHost, playerState, gameState: {usedWords, currentTurn}, setGameState, broadcastGameState, nextTeam}) {
    const [secondsLeft, setSecondsLeft] = useState(TIME_PER_TURN);

    /** Upon load, initialise variables and start the countdown*/
    useEffect(() => {
        correctlyAnswered = 0;
        alreadySkipped = false;

        /** Set the first word*/
        if (playerState.role === 'DESCRIBER') changeWord();

        myInterval = setInterval(() => {
            if (secondsLeft > 0) {
                setSecondsLeft(prevSecondsLeft => (prevSecondsLeft - 1));
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    }, []);

    /** Upon timer countdown reaching zero, go to next turn*/
    useEffect(() => {
        if (secondsLeft === 0) {
            console.log('Times Up!');
            clearInterval(myInterval);
            nextTurn();
        }
    }, [secondsLeft]);

    /** Instruction Text for Opponents and Guessers*/
    const Instructions = ({playerState}) => {
        let describersString = '';
        currentTurn.describer.map((each, index) => {
            if (index === 0) {
                describersString += each;
            } else {
                describersString += `, ${each}`;
            }
        });
        switch (playerState.role) {
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
                return null;
        }
    };

    /** Update board positions and go to next turn*/
    function nextTurn() {
        setGameState(prevGameState => {
            let newGamePositions = prevGameState.gamePositions;
            console.log('INCREASE POS: ', correctlyAnswered);
            newGamePositions[prevGameState.currentTurn.team] += correctlyAnswered;

            const newTeam = nextTeam(prevGameState.currentTurn.team);
            const newGameState = {
                ...prevGameState,
                currentTurn: {
                    ...prevGameState.currentTurn,
                    describer: [],
                    guesser: [],
                    team: newTeam,
                    phase: 'planning',
                },
                gamePositions: newGamePositions,
            };
            broadcastGameState(newGameState);
            return newGameState;
        });
    }

    /** TODO: Implement fetching a random word from server
     * NEED TO FIGURE OUT HOW TO MAKE SURE EVERYONE HAS THE SAME WORD
     */
    function changeWord() {
        const categoryKey = currentTurn.category.toLowerCase();
        fetch(RANDOM_WORD_GIVEN_USED + categoryKey, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(usedWords),
        }).then(response => {
            if (response.status === 200) return response.text();
            throw new Error('No words left');
        }).then(data => {
            console.log('Random Word Chosen : ', data);
            setGameState(prevGameState => {
                const newUsedWords = prevGameState.usedWords;
                newUsedWords[categoryKey].push(data);
                const newGameState = {
                    ...prevGameState,
                    usedWords: newUsedWords,
                    currentTurn: {
                        ...prevGameState.currentTurn,
                        word: data,
                    },
                };
                broadcastGameState(newGameState);
                return newGameState;
            });
        }).catch(error => {
            console.error('Error: ', error);
        });
    }

    // TODO : Handle properly if no words left
    /** Plus one point*/
    const handleCorrect = () => {
        changeWord();
        correctlyAnswered = correctlyAnswered + 1;
        console.log('INCREASE POINT: ', correctlyAnswered);
    };

    // TODO Add nextWord function implementation
    const handleSkip = () => {
        if (!alreadySkipped) {
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
            <div id="Game-WordCategory">
                Word Category: {currentTurn.category}
            </div>
            <div id="Game-Time">
                Seconds Left: {secondsLeft}
            </div>
            {(playerState.role !== 'GUESSER') &&
            <GameWordCard category={currentTurn.category}
                          word={currentTurn.word}/>}
            <Instructions playerState={playerState}/>
            {(playerState.role === 'DESCRIBER') && (
                <div id="btnDiv">
                    <button className="Game-Btns" id="Game-CorrectBtn"
                            onClick={handleCorrect}>Correct!
                    </button>
                    <button className="Game-Btns" id="Game-SkipBtn"
                            onClick={handleSkip}>Skip
                    </button>
                    <button className="Game-Btns" id="Game-FoulBtn"
                            onClick={handleFoul}>Foul!
                    </button>
                </div>
            )
            }
        </React.Fragment>
    );
}

export default GameControlsArticulating;