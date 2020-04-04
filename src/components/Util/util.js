import {
    CATEGORY_ACTION,
    CATEGORY_ALL,
    CATEGORY_NATURE,
    CATEGORY_OBJECT,
    CATEGORY_PERSON,
    CATEGORY_RANDOM,
    CATEGORY_WORLD, RANDOM_WORD_GIVEN_USED, RESPONSE_JSON, RESPONSE_TEXT,
} from '../../properties';

export const NextTeam = (currentTeam, numberOfTeams) => {
    return (currentTeam + 1) % numberOfTeams;
};

export const TranslateTeamDisplayed = (teamNumber) => {
    return String.fromCharCode(teamNumber + 65);
};

export const CapitaliseFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const CommaBetweenWords = (words) => {
    let concatenatedString = '';
    words.map((each, index) => {
        if (index === 0) {
            concatenatedString += each;
        } else {
            concatenatedString += `, ${each}`;
        }
    });
    return concatenatedString;
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
    }).then(data => handler(data))
    .catch(error => errorHandler(error));
};

export const WordCategoryGivenPos = (gamePosition, team) => {
    const posMod = gamePosition[team] % 7;
    switch (posMod) {
        case 0:
            return CATEGORY_OBJECT;
        case 1:
            return CATEGORY_ACTION;
        case 2:
            return CATEGORY_ALL;
        case 3:
            return CATEGORY_WORLD;
        case 4:
            return CATEGORY_PERSON;
        case 5:
            return CATEGORY_RANDOM;
        case 6:
            return CATEGORY_NATURE;
        default:
            console.error('GamePosition Invalid: ', gamePosition);
            return '';
    }
};


