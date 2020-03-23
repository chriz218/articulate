import React from 'react';

const WordColor = (category) => {
  switch(category) {
    case "Object":
      return "cyan";
    case "Action":
      return "#FF7B00";
    case "Nature":
      return "green";
    case "World":
      return "blue";
    case "Person":
      return "yellow";
    case "Random":
      return "red";
    case "All":
      return "grey";
    default:
      console.log("Wrong Category: ", category);
      return "white";
  }
};

function GameWordCard({ category }) {

  return (
    <div id="generatedWordDiv">
      <div id="word" style={{"background-color": WordColor(category)}}>
        Rafael Nadal
      </div>
    </div>
  )
}

export default GameWordCard;