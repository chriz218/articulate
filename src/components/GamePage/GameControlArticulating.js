import React, {useEffect, useState} from 'react';
import GameWordCard from './GameWordCard';
import {IsWhiteTile, PostRequest, WordCategoryGivenPos} from '../Util/util';
import {Utils} from 'soba-game';
import {
    PHASE_ARTICULATING,
    PHASE_ARTICULATING_SPECIAL,
    PHASE_PLANNING,
    PHASE_PLANNING_SPECIAL,
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

function GameControlArticulating({playerRole, playerName, numberOfTeams, gameState: {usedWords, currentTurn, roomCode}, setGameState, broadcastGameState, broadcastToast}) {
    const [secondsLeft, setSecondsLeft] = useState(TIME_PER_TURN);

    /** Upon load, initialise variables and start the countdown*/
    useEffect(() => {
        correctlyAnswered = 0;
        alreadySkipped = false;

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
            if (playerRole === ROLE_DESCRIBER) nextTurn();
        }
    }, [secondsLeft]);

    /** Update board positions and go to next turn*/
    function nextTurn() {
        setGameState(prevGameState => {
            let newGamePositions = prevGameState.gamePositions;
            let phase = PHASE_PLANNING;
            let newTeam = Utils.NextTeam(prevGameState.currentTurn.team, numberOfTeams);

            // Evaluate new pos
            newGamePositions[prevGameState.currentTurn.team] += correctlyAnswered;

            // Win white tile condition go again
            if (prevGameState.currentTurn.phase === PHASE_ARTICULATING_SPECIAL && correctlyAnswered > 0) {
                newTeam = prevGameState.currentTurn.team;
            }

            // Landed on white tile
            if (prevGameState.currentTurn.phase === PHASE_ARTICULATING &&
                IsWhiteTile(prevGameState.gamePositions, prevGameState.currentTurn.team) &&
                correctlyAnswered > 0
            ) {
                newTeam = prevGameState.currentTurn.team;
                phase = PHASE_PLANNING_SPECIAL;
            }

            const newGameState = {
                ...prevGameState,
                currentTurn: {
                    ...prevGameState.currentTurn,
                    category: WordCategoryGivenPos(newGamePositions, newTeam),
                    describer: [],
                    guesser: [],
                    team: newTeam,
                    phase: phase,
                },
                turns: (prevGameState.turns + 1),
                gamePositions: newGamePositions,
            };
            broadcastGameState(newGameState);
            return newGameState;
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

    const handleSpecialSuccess = () => {
        clearInterval(myInterval);
        correctlyAnswered = 1;
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word guessed by teammates!',
            toastType: 'success',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
        nextTurn();
    };

    const handleSpecialFailure = () => {
        clearInterval(myInterval);
        correctlyAnswered = 0;
        const newToastObject = {
            roomCode: roomCode,
            toastMessage: 'Word guessed by opponent!',
            toastType: 'error',
            toastSenderName: playerName,
        };
        broadcastToast(newToastObject);
        nextTurn();
    };

    return (
        <React.Fragment>
            <div id="Game-WordCategory">
                Word Category: {Utils.CapitaliseFirstLetter(currentTurn.category)}
            </div>
            <div id="Game-Time">
                Seconds Left: {secondsLeft}
            </div>
            {
                (playerRole !== ROLE_GUESSER) &&
                <GameWordCard category={currentTurn.category} word={currentTurn.word}/>
            }
            <GameInstruction playerRole={playerRole} currentTurn={currentTurn}/>
            {
                (currentTurn.phase === PHASE_ARTICULATING && playerRole === ROLE_DESCRIBER) &&
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
                (currentTurn.phase === PHASE_ARTICULATING_SPECIAL && playerRole === ROLE_DESCRIBER) &&
                <div id="btnDiv">
                    <button className="Game-Btns" id="Game-SuccessBtn" onClick={handleSpecialSuccess}>
                        Success
                    </button>
                    <button className="Game-Btns" id="Game-FailureBtn" onClick={handleSpecialFailure}>
                        Failure
                    </button>
                </div>
            }
        </React.Fragment>
    );
}

export default GameControlArticulating;