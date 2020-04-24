export const BACKEND_ENDPOINT = 'https://articulate-be.herokuapp.com/';
// export const BACKEND_ENDPOINT = 'http://localhost:5000/';

export const CREATE_ROOM = BACKEND_ENDPOINT + 'roomcreate';

export const RANDOM_WORD_GIVEN_USED = BACKEND_ENDPOINT + 'word/';
export const GET_ALL_WORDS = BACKEND_ENDPOINT + 'allWords';

export const TIME_PER_TURN = 10;
export const MIN_PLAYERS_PER_TEAM = 2;

/** Key Strings Constants */
export const PAGE_HOME = 'home';
export const PAGE_CREATE = 'create';
export const PAGE_JOIN = 'join';
export const PAGE_LOBBY = 'lobby';
export const PAGE_GAME = 'game';
export const STATE_LOBBY = 'lobby';
export const STATE_GAME = 'game';
export const ROLE_DESCRIBER = 'describer';
export const ROLE_GUESSER = 'guesser';
export const ROLE_OPPONENT = 'opponent';
export const PHASE_PLANNING = 'planning';
export const PHASE_PLANNING_SPECIAL = 'PHASE_PLANNING_SPECIAL';
export const PHASE_ARTICULATING = 'articulating';
export const PHASE_ARTICULATING_SPECIAL = 'PHASE_ARTICULATING_SPECIAL';
export const CATEGORY_OBJECT = 'object';
export const CATEGORY_ACTION = 'action';
export const CATEGORY_NATURE = 'nature';
export const CATEGORY_WORLD = 'world';
export const CATEGORY_PERSON = 'person';
export const CATEGORY_RANDOM = 'random';
export const CATEGORY_ALL = 'all';
export const RESPONSE_JSON = 'RESPONSE_JSON';
export const RESPONSE_TEXT = 'RESPONSE_TEXT';
export const SOCKET_EMIT_BROADCAST_TOAST = 'broadcastToast';
export const SOCKET_ON_GET_TOAST = 'getToast';