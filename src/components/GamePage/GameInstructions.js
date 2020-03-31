import React from 'react';

// TODO : Styling

function GameInstruction({playerState: {role}, currentTurn}) {

    function PlanningInstruction() {
        switch (role) {
            case 'OPPONENT':
                return (
                    <React.Fragment>
                        <div>Your Opponent: Team {currentTurn.team} is planning
                            their turn.
                        </div>
                    </React.Fragment>
                );
            case '-':
            case 'DESCRIBER':
            case 'GUESSER':
                return (
                    <React.Fragment>
                        <div>All players in team needs to pick a role</div>
                        <div>At least one player per role</div>
                    </React.Fragment>
                );
            default:
                console.log('ERROR: Wrong role : ', role);
                return (<React.Fragment/>);
        }
    }

    switch (currentTurn.phase) {
        case 'planning':
            return PlanningInstruction();
        default:
            return (<React.Fragment/>);
    }
}

export default GameInstruction;