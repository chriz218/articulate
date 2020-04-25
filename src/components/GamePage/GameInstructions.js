import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';
import {Utils} from 'soba-game';
import {
    PHASE_ARTICULATING,
    PHASE_ARTICULATING_SPECIAL,
    PHASE_PLANNING,
    PHASE_PLANNING_SPECIAL,
    ROLE_DESCRIBER,
    ROLE_GUESSER,
    ROLE_OPPONENT,
} from '../../properties';

// TODO : Styling

const GameInstruction = ({playerRole, currentTurn}) => {

    const PlanningInstruction = () => {
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
                console.error('ERROR: Wrong role : ', playerRole);
                return null;
        }
    };

    const PlanningSpecialInstruction = () => {
        switch (playerRole) {
            case ROLE_OPPONENT:
                return (
                    <React.Fragment>
                        <div className="Game-Instruction">
                            Team {TranslateTeamDisplayed(currentTurn.team)} has landed on a white tile.
                            Team {TranslateTeamDisplayed(currentTurn.team)} is choosing their describer now.
                            Every team gets to guess the word. If Team {TranslateTeamDisplayed(
                            currentTurn.team)} guesses the word first, Team {TranslateTeamDisplayed(
                            currentTurn.team)} gets to go again.
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
                            Every team gets to guess the word. If your team guesses the word first, your team gets to go
                            again.
                        </div>
                    </React.Fragment>
                );
            default:
                console.error('ERROR: Wrong role : ', playerRole);
                return null;
        }
    };

    /** Instruction Text for Opponents and Guessers*/
    const ArticulatingInstruction = () => {
        const describersString = Utils.CommaBetweenWords(currentTurn.describer);
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

    const ArticulatingSpecialInstruction = () => {
        const describersString = Utils.CommaBetweenWords(currentTurn.describer);
        switch (playerRole) {
            case ROLE_GUESSER:
                return (
                    <div className="Game-GuesserOpponentJobs">
                        Your teammate, {describersString},
                        is describing a word, guess the word first and your team gets to go again!
                    </div>
                );
            case ROLE_OPPONENT:
                return (
                    <div className="Game-GuesserOpponentJobs">
                        {describersString} from Team {TranslateTeamDisplayed(
                        currentTurn.team)} is describing a word, guess the word first to stop
                        Team {TranslateTeamDisplayed(
                        currentTurn.team)} from going again!
                    </div>
                );
            default:
                return null;
        }
    };

    switch (currentTurn.phase) {
        case PHASE_PLANNING:
            return PlanningInstruction();
        case PHASE_PLANNING_SPECIAL:
            return PlanningSpecialInstruction();
        case PHASE_ARTICULATING:
            return ArticulatingInstruction();
        case PHASE_ARTICULATING_SPECIAL:
            return ArticulatingSpecialInstruction();
        default:
            return null;
    }
};

export default GameInstruction;