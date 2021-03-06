import {
    CATEGORY_ACTION,
    CATEGORY_ALL,
    CATEGORY_NATURE,
    CATEGORY_OBJECT,
    CATEGORY_PERSON,
    CATEGORY_RANDOM,
    CATEGORY_WORLD,
    MIN_PLAYERS_PER_TEAM,
    RESPONSE_JSON,
    RESPONSE_TEXT,
} from '../../properties';

export const TruncateString = (str, length) => {
    if(str.toString().length <= length) return str;
    return str.toString().substring(0, length) + "...";
};

export const TranslateTeamDisplayed = (teamNumber) => {
    return String.fromCharCode(teamNumber + 65);
};

export const PostRequest = (
    URL, reqBody, responseType, handler, errorHandler) => {
    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reqBody),
    }).then(response => {
        if (response.status === 200) {
            switch (responseType) {
                case RESPONSE_JSON:
                    return response.json();
                case RESPONSE_TEXT:
                    return response.text();
                default:
                    console.error('responseType provided invalid: ', responseType);
            }
        }
        throw new Error(response.statusText);
    }).then(data => handler(data)).catch(error => {
        if (errorHandler) errorHandler(error);
    });
};

export const IsWhiteTile = (gamePosition, team) => {
    return (gamePosition[team] % 7 === 6);
};

export const WordCategoryGivenPos = (gamePosition, team) => {
    const posMod = gamePosition[team] % 7;
    switch (posMod) {
        case 0:
            return CATEGORY_OBJECT;
        case 1:
            return CATEGORY_ACTION;
        case 2:
            return CATEGORY_NATURE;
        case 3:
            return CATEGORY_WORLD;
        case 4:
            return CATEGORY_PERSON;
        case 5:
            return CATEGORY_RANDOM;
        case 6:
            return CATEGORY_ALL;
        default:
            console.error('GamePosition Invalid: ', gamePosition);
            return '';
    }
};

export const CheckEnoughPlayers = (teams) => {
    // return true; // TODO: FOR DEVELOPMENT

    for (let i = 0; i < teams.length; i++) {
        if (teams[i].length < MIN_PLAYERS_PER_TEAM) {
            return false;
        }
    }
    return true;
};
