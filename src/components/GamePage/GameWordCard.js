import React from 'react';

/** Color for each category*/
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

function GameWordCard({ category, word }) {

  return (
    <div id="generatedWordDiv">
      <div id="word" style={{"backgroundColor": WordColor(category)}}>
        {word === "" ? "Chair" : word}
      </div>
    </div>
  )
}

export default GameWordCard;