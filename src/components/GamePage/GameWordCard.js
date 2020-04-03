import React from 'react';
import {
    CATEGORY_ACTION,
    CATEGORY_ALL,
    CATEGORY_NATURE,
    CATEGORY_OBJECT,
    CATEGORY_PERSON,
    CATEGORY_RANDOM,
    CATEGORY_WORLD,
} from '../../properties';

/** Color for each category*/
const WordColor = (category) => {
    switch (category) {
        case CATEGORY_OBJECT:
            return 'cyan';
        case CATEGORY_ACTION:
            return '#FF7B00';
        case CATEGORY_NATURE:
            return 'green';
        case CATEGORY_WORLD:
            return 'blue';
        case CATEGORY_PERSON:
            return 'yellow';
        case CATEGORY_RANDOM:
            return 'red';
        case CATEGORY_ALL:
            return 'grey';
        default:
            console.error('Wrong Category: ', category);
            return 'white';
    }
};

function GameWordCard({category, word}) {
    return (
        <div id="Game-GeneratedWordDiv">
            <div id="Game-Word"
                 style={{'backgroundColor': WordColor(category)}}>
                {word === '' ? 'Chair' : word}
            </div>
        </div>
    );
}

export default GameWordCard;