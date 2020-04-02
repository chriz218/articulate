import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';

// TODO : Styling

function GameInstruction({playerRole, currentTurn}) {

    function PlanningInstruction() {
        switch (playerRole) {
            case 'opponent':
                return (
                    <React.Fragment>
                        <div>
                            Your Opponent: Team {TranslateTeamDisplayed(
                            currentTurn.team)} is planning their turn.
                        </div>
                    </React.Fragment>
                );
            case '-':
            case 'describer':
            case 'guesser':
                return (
                    <React.Fragment>
                        <div>All players in team needs to pick a role</div>
                        <div>At least one player per role</div>
                    </React.Fragment>
                );
            default:
                console.log('ERROR: Wrong role : ', playerRole);
                return (<React.Fragment/>);
        }
    }

    switch (currentTurn.phase) {
        case 'planning':
            return PlanningInstruction();
        default:
            return null;
    }
}

export default GameInstruction;