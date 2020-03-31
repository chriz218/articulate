import React from 'react';

function BoardTile({boardBlock, index}) {
    return (
        <div className="boardBlock" id={'boardBlock' + index}>{boardBlock}</div>
    );
}

function GameBoard({gamePositions}) {

    let boardBlocks = [];
    for (let i = 1; i <= 42; i++) {
        boardBlocks.push('');
    }
    gamePositions.forEach((position, team) => {
        boardBlocks[position] = boardBlocks[position].toString() +
            team.toString();
    });

    console.log('GamePositions: ', gamePositions);

    return (
        <React.Fragment>
            <div className="board">
                {boardBlocks.map((boardBlock, index) => (
                    <BoardTile key={index} index={index}
                               boardBlock={boardBlock}/>
                ))}
            </div>
        </React.Fragment>
    );
}

export default GameBoard;