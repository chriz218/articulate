import React from 'react';
import {TranslateTeamDisplayed} from '../Util/util';

function BoardTile({boardBlock, index}) {
    return (
        <div className="Game-BoardBlock" id={'Game-BoardBlock' + index}>{boardBlock}</div>
    );
}

function GameBoard({gamePositions}) {

    let boardBlocks = [];
    for (let i = 1; i <= 42; i++) {
        boardBlocks.push('');
    }
    gamePositions.forEach((position, team) => {
        boardBlocks[position] = boardBlocks[position].toString() + TranslateTeamDisplayed(team);
    });

    console.log('GamePositions: ', gamePositions);

    return (
        <React.Fragment>
            <div id="Game-Board">
                {boardBlocks.map((boardBlock, index) => (
                    <BoardTile key={index} index={index} boardBlock={boardBlock}/>
                ))}
            </div>
        </React.Fragment>
    );
}

export default GameBoard;