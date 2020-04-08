import React, {useEffect, useState} from 'react';
import GameWordCard from './GameWordCard';
import {CapitaliseFirstLetter, NextTeam, PostRequest, WordCategoryGivenPos} from '../Util/util';
import {
    PHASE_PLANNING,
    RANDOM_WORD_GIVEN_USED,
    RESPONSE_TEXT,
    ROLE_DESCRIBER,
    ROLE_GUESSER,
    TIME_PER_TURN,
} from '../../properties';
import GameInstruction from './GameInstructions';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let myInterval;
let correctlyAnswered;
let alreadySkipped;
let whiteTileFirstArrivals = [];
let goAgain = false;

function GameControlArticulating({playerRole, playerName, numberOfTeams, gameState, gameState: {usedWords, currentTurn, roomCode}, setGameState, broadcastGameState, broadcastToast}) {
    const [secondsLeft, setSecondsLeft] = useState(TIME_PER_TURN);

    /** Upon load, initialise variables and start the countdown*/
    useEffect(() => {
        correctlyAnswered = 0;
        alreadySkipped = false;

        for (let i = 0; i < numberOfTeams; i++) {
            whiteTileFirstArrivals.push([true,true,true,true,true])
        };


        /** Set the first word*/
        if (playerRole === ROLE_DESCRIBER) changeWord();

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
            toast.info('Time\'s up!');
            clearInterval(myInterval);
            // setWhiteTileSpecialStatus(false);
            nextTurn();
        }
    }, [secondsLeft]);

    /** Update board positions and go to next turn*/
    function nextTurn() {
        setGameState(prevGameState => {
            let newGamePositions = prevGameState.gamePositions;
            console.log('INCREASE POS: ', correctlyAnswered);
            newGamePositions[prevGameState.currentTurn.team] += correctlyAnswered;
            console.log(prevGameState.currentTurn.team);
            console.log(newGamePositions[prevGameState.currentTurn.team]);

            if ((newGamePositions[prevGameState.currentTurn.team] === 6 && whiteTileFirstArrivals[prevGameState.currentTurn.team][0] === true) || 
                (newGamePositions[prevGameState.currentTurn.team] === 13 && whiteTileFirstArrivals[prevGameState.currentTurn.team][1] === true) || 
                (newGamePositions[prevGameState.currentTurn.team] === 20 && whiteTileFirstArrivals[prevGameState.currentTurn.team][2] === true) || 
                (newGamePositions[prevGameState.currentTurn.team] === 27 && whiteTileFirstArrivals[prevGameState.currentTurn.team][3] === true) || 
                (newGamePositions[prevGameState.currentTurn.team] === 34 && whiteTileFirstArrivals[prevGameState.currentTurn.team][4] === true)) {
                    
                    console.log(whiteTileFirstArrivals[prevGameState.currentTurn.team][0]);

                    if (newGamePositions[prevGameState.currentTurn.team] === 6) {
                        whiteTileFirstArrivals[prevGameState.currentTurn.team][0] = false
                    } else if (newGamePositions[prevGameState.currentTurn.team] === 13) {
                        whiteTileFirstArrivals[prevGameState.currentTurn.team][1] = false
                    } else if (newGamePositions[prevGameState.currentTurn.team] === 20) {
                        whiteTileFirstArrivals[prevGameState.currentTurn.team][2] = false
                    } else if (newGamePositions[prevGameState.currentTurn.team] === 27) {
                        whiteTileFirstArrivals[prevGameState.currentTurn.team][3] = false
                    } else if (newGamePositions[prevGameState.currentTurn.team] === 34) {
                        whiteTileFirstArrivals[prevGameState.currentTurn.team][4] = false
                    }

                    console.log(whiteTileFirstArrivals[prevGameState.currentTurn.team][0]);

                    // setWhiteTileSpecialStatus(true)

                    // console.log(whiteTileSpecialStatus);
                    const sameTeam = prevGameState.currentTurn.team;
                    const newGameState = {
                        ...prevGameState,
                        currentTurn: {
                            ...prevGameState.currentTurn,
                            category: WordCategoryGivenPos(newGamePositions, sameTeam),
                            describer: [],
                            guesser: [],
                            team: sameTeam,
                            phase: PHASE_PLANNING,
                            whiteTileRule: true,
                        },
                        gamePositions: newGamePositions,
                    };
                    if (playerRole === ROLE_DESCRIBER) broadcastGameState(newGameState);
                    return newGameState
            } else {
                if (goAgain === true) {
                    const sameTeam = prevGameState.currentTurn.team;
                    const newGameState = {
                        ...prevGameState,
                        currentTurn: {
                            ...prevGameState.currentTurn,
                            category: WordCategoryGivenPos(newGamePositions, sameTeam),
                            describer: [],
                            guesser: [],
                            team: sameTeam,
                            phase: PHASE_PLANNING,
                            whiteTileRule: false,
                        },
                        gamePositions: newGamePositions,
                    };
                    if (playerRole === ROLE_DESCRIBER) broadcastGameState(newGameState);
                    console.log('Entered correctly')
                    goAgain = false;
                    return newGameState
                } else {
                    const newTeam = NextTeam(prevGameState.currentTurn.team, numberOfTeams);
                    const newGameState = {
                        ...prevGameState,
                        currentTurn: {
                            ...prevGameState.currentTurn,
                            category: WordCategoryGivenPos(newGamePositions, newTeam),
                            describer: [],
                            guesser: [],
                            team: newTeam,
                            phase: PHASE_PLANNING,
                            whiteTileRule: false,
                        },
                        gamePositions: newGamePositions,
                    };
                    console.log(newGameState.currentTurn)
                    if (playerRole === ROLE_DESCRIBER) broadcastGameState(newGameState);
                    return newGameState;
                }
            }
        });
    }

    /** TODO: Implement fetching a random word from server
     *
     */
    function changeWord() {
        PostRequest(RANDOM_WORD_GIVEN_USED + currentTurn.category,
            usedWords, RESPONSE_TEXT,
            data => {
                console.log('Random Word Chosen : ', data);
                setGameState(prevGameState => {
                    const newUsedWords = prevGameState.usedWords;

                    /** TODO : Only disabled for development
                     * To be uncommented once we have enough words
                     */
                        // newUsedWords[categoryKey].push(data);

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
            },
            error => {
                console.error(error, 'No words left');
            },
        );
    }

    const handleSuccess = () => {
        clearInterval(myInterval);
        correctlyAnswered = 1;
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word guessed by teammates!',
            toastType: 'success',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
        goAgain = true;
        console.log(goAgain);
        nextTurn();
    }

    const handleFailure = () => {
        clearInterval(myInterval);
        correctlyAnswered = 0;
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word guessed by opponent!',
            toastType: 'error',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
        goAgain = false;
        console.log(goAgain);
        nextTurn();
    }

    // TODO : Handle properly if no words left
    /** Plus one point*/
    const handleCorrect = () => {
        changeWord();
        correctlyAnswered = correctlyAnswered + 1;
        console.log('INCREASE POINT: ', correctlyAnswered);
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word guessed correctly!',
            toastType: 'success',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
    };

    const handleSkip = () => {
        alreadySkipped = true;
        changeWord();
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word has been skipped!',
            toastType: 'warn',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
    };

    /** Stops timer, goes to nextTurn with no points*/
    const handleFoul = () => {
        clearInterval(myInterval);
        correctlyAnswered = 0;
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: `${playerName} fouled!`,
            toastType: 'error',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
        nextTurn();
    };

    return (
        <React.Fragment>
            <div id="Game-WordCategory">
                Word Category: {CapitaliseFirstLetter(currentTurn.category)}
            </div>
            <div id="Game-Time">
                Seconds Left: {secondsLeft}
            </div>
            {
                (playerRole !== ROLE_GUESSER && gameState.currentTurn.whiteTileRule === false) &&
                <GameWordCard category={currentTurn.category} word={currentTurn.word}/>
            }
            {
                (playerRole === ROLE_DESCRIBER && gameState.currentTurn.whiteTileRule === true) &&
                <GameWordCard category={currentTurn.category} word={currentTurn.word}/>
            }
            <GameInstruction gameState={gameState} playerRole={playerRole} currentTurn={currentTurn}/>
            {
                (playerRole === ROLE_DESCRIBER && gameState.currentTurn.whiteTileRule === false) &&
                <div id="btnDiv">
                    <button className="Game-Btns" id="Game-CorrectBtn" onClick={handleCorrect}>
                        Correct!
                    </button>
                    <button className="Game-Btns" id="Game-SkipBtn" onClick={handleSkip} disabled={alreadySkipped}>
                        Skip
                    </button>
                    <button className="Game-Btns" id="Game-FoulBtn" onClick={handleFoul}>
                        Foul!
                    </button>
                </div>
            }
            {
                (playerRole === ROLE_DESCRIBER && gameState.currentTurn.whiteTileRule === true) &&
                <div id="btnDiv">
                    <button className="Game-Btns" id="Game-SuccessBtn" onClick={handleSuccess}>
                        Success
                    </button>
                    <button className="Game-Btns" id="Game-FailureBtn" onClick={handleFailure}>
                        Failure
                    </button>        
                </div>    
            }
        </React.Fragment>
    );
}

export default GameControlArticulating;