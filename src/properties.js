export const BACKEND_ENDPOINT = 'https://articulate-be.herokuapp.com/';
// export const BACKEND_ENDPOINT = 'http://localhost:5000/';

export const CREATE_ROOM = BACKEND_ENDPOINT + 'roomcreate';

export const RANDOM_WORD_GIVEN_USED = BACKEND_ENDPOINT + 'word/';
export const GET_ALL_WORDS = BACKEND_ENDPOINT + 'allWords';

export const TIME_PER_TURN = 60;

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
export const PHASE_ARTICULATING = 'articulating';
export const CATEGORY_OBJECT = 'object';
export const CATEGORY_ACTION = 'action';
export const CATEGORY_NATURE = 'nature';
export const CATEGORY_WORLD = 'world';
export const CATEGORY_PERSON = 'person';
export const CATEGORY_RANDOM = 'random';
export const CATEGORY_ALL = 'all';
export const RESPONSE_JSON = 'RESPONSE_JSON';
export const RESPONSE_TEXT = 'RESPONSE_TEXT';
export const SOCKET_EMIT_BROADCAST_GAMESTATE = 'broadcastGameState';
export const SOCKET_EMIT_JOIN_ROOM = 'joinRoom';
export const SOCKET_EMIT_SOCKETID = 'getSocketId';
export const SOCKET_ON_SOCKETID = 'socketId';
export const SOCKET_ON_PLAYER_JOINED_FAILED = 'playerJoinedFailed';
export const SOCKET_ON_PLAYER_JOINED = 'playerJoined';
export const SOCKET_ON_UPDATE_GAMESTATE = 'updateGameState';
