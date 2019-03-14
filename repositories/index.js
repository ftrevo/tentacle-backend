// ------------------ Import de repositórios ---------------- //
const repoMediaLoan = require('./repo-media-loan');
const repoLibrary = require('./repo-library');
const repoToken = require('./repo-token');
const repoState = require('./repo-state');
const repoMedia = require('./repo-media');
const repoUser = require('./repo-user');
const repoGame = require('./repo-game');
const repoLoan = require('./repo-loan');
const repoMessage = require('./repo-message')

// --------------------- Module Exports --------------------- //
module.exports = {
    'game': repoGame,
    'library': repoLibrary,
    'loan': repoLoan,
    'media': repoMedia,
    'mediaLoan': repoMediaLoan,
    'message': repoMessage,
    'state': repoState,
    'token': repoToken,
    'user': repoUser
};

