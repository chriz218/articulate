import React from 'react';
import {CommaBetweenWords, TranslateTeamDisplayed} from '../Util/util';
import {PHASE_ARTICULATING, PHASE_PLANNING, ROLE_DESCRIBER, ROLE_GUESSER, ROLE_OPPONENT} from '../../properties';

// TODO : Styling

const GameInstruction = ({whiteTileSpecialStatus, playerRole, currentTurn}) => {

    const PlanningInstruction = () => {
        console.log(whiteTileSpecialStatus);
        if (whiteTileSpecialStatus === true) {
            switch (playerRole) {
                case ROLE_OPPONENT:
                    return (
                        <React.Fragment>
                            <div className="Game-Instruction">
                                Team {TranslateTeamDisplayed(currentTurn.team)} has landed on a white tile. Team {TranslateTeamDisplayed(currentTurn.team)} is choosing their describer now. 
                                Every team gets to guess the word. If Team {TranslateTeamDisplayed(currentTurn.team)} guesses the word first, Team {TranslateTeamDisplayed(currentTurn.team)} gets to go again.
                            </div>    
                        </React.Fragment>    
                    );
                case '-':
                case ROLE_DESCRIBER:
                case ROLE_GUESSER:
                    return (
                        <React.Fragment>
                            <div className="Game-Instruction">
                                Your team has landed on a white tile, choose your describer carefully. 
                                Every team gets to guess the word. If your team guesses the word first, your team gets to go again.
                            </div>
                        </React.Fragment>    
                    );          
            }
        } else {
            switch (playerRole) {
                case ROLE_OPPONENT:
                    return (
                        <React.Fragment>
                            <div className="Game-Instruction">
                                Team {TranslateTeamDisplayed(currentTurn.team)} is selecting its describer and guesser(s):
                            </div>
                        </React.Fragment>
                    );
                case '-':
                case ROLE_DESCRIBER:
                case ROLE_GUESSER:
                    return (
                        <React.Fragment>
                            <div className="Game-Instruction">Pick a role. Only ONE describer is allowed:</div>
                        </React.Fragment>
                    );
                default:
                    console.log('ERROR: Wrong role : ', playerRole);
                    return null;
            }
        }
    };

    /** Instruction Text for Opponents and Guessers*/
    const ArticulatingInstruction = () => {
        const describersString = CommaBetweenWords(currentTurn.describer);
        switch (playerRole) {
            case ROLE_GUESSER:
                return (
                    <div className="Game-GuesserOpponentJobs">
                        Your teammate, {describersString},
                        is describing a word, guess the word!
                    </div>
                );
            case ROLE_OPPONENT:
                return (
                    <div className="Game-GuesserOpponentJobs">
                        {describersString} from Team {TranslateTeamDisplayed(
                        currentTurn.team)} is describing a word, pay attention
                        and catch the player if the player says the word!
                    </div>
                );
            default:
                return null;
        }
    };

    switch (currentTurn.phase) {
        case PHASE_PLANNING:
            return PlanningInstruction();
        case PHASE_ARTICULATING:
            return ArticulatingInstruction();
        default:
            return null;
    }
};

export default GameInstruction;