import React from 'react';

/** Color for each category*/
const WordColor = (category) => {
    switch (category) {
        case 'object':
            return 'cyan';
        case 'action':
            return '#FF7B00';
        case 'nature':
            return 'green';
        case 'world':
            return 'blue';
        case 'person':
            return 'yellow';
        case 'random':
            return 'red';
        case 'all':
            return 'grey';
        default:
            console.error('Wrong Category: ', category);
            return 'white';
    }
};

function GameWordCard({category, word}) {
    return (
        <div id="Game-GeneratedWordDiv">
            <div id="Game-Word" style={{'backgroundColor': WordColor(category)}}>
                {word === '' ? 'Chair' : word}
            </div>
        </div>
    );
}

export default GameWordCard;