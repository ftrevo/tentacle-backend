// ----------------- Import de dependências ----------------- //
const mediaLoan = require('../models/media-loan');
const library = require('../models/library');

const mediaLoanVwObject = require('../models/views/vw-media-loan');
const libraryVwObject = require('../models/views/vw-library');

// ------------------- Funções Exportadas ------------------- //
const createViews = function (db) {
    db.createCollection(mediaLoan.viewName, mediaLoanVwObject);
    db.createCollection(library.viewName, libraryVwObject);
};

// --------------------- Module Exports --------------------- //
module.exports = createViews;
