// --------------- Import de regras de negócio -------------- //
const brMediaLoan = require('./br-media-loan');
const brLibrary = require('./br-library');
const brAccess = require('./br-access');
const brMedia = require('./br-media');
const brUser = require('./br-user');
const brGame = require('./br-game');
const brLoan = require('./br-loan');
const brMessage = require('./br-message');

// --------------------- Module Exports --------------------- //
module.exports = {
    'access': brAccess,
    'game': brGame,
    'library': brLibrary,
    'loan': brLoan,
    'media': brMedia,
    'mediaLoan': brMediaLoan,
    'message': brMessage,
    'user': brUser
};
