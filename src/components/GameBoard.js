import React from 'react';

function BoardTile({ boardBlock, index }) {
  return (
      <div className="boardBlock" id={"boardBlock" + index}>{boardBlock}</div>
  )
}

function GameBoard({ gamePositions }) {

  let boardBlocks = [];
  for (let i = 1; i <= 42; i++) {
    boardBlocks.push('');
  }
  gamePositions.map((position, team) => {
    console.log(position, team);
    boardBlocks[position] = boardBlocks[position].toString() + team.toString();
  });

  return (
      <React.Fragment>
          <div className="board">
            {boardBlocks.map((boardBlock, index) => (
                <BoardTile index={index} boardBlock={boardBlock} />
            ))}
          </div>
      </React.Fragment>
  )
}

export default GameBoard;