export const NextTeam = (currentTeam, numberOfTeams) => {
    return (currentTeam + 1) % numberOfTeams;
};

export const TranslateTeamDisplayed = (teamNumber) => {
    return String.fromCharCode(teamNumber + 65);
};

export const CapitaliseFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const WordCategoryGivenPos = (gamePosition, team) => {
    const posMod = gamePosition[team] % 7;
    switch (posMod) {
        case 0:
            return 'object';
        case 1:
            return 'action';
        case 2:
            return 'all';
        case 3:
            return 'world';
        case 4:
            return 'person';
        case 5:
            return 'random';
        case 6:
            return 'nature';
        default:
            console.error('GamePosition Invalid: ', gamePosition);
            return '';
    }
};


