// ----------------- Import de dependências ----------------- //
const mediaLoanVwName = require('../models/media-loan').viewName;
const libraryVwName = require('../models/library').viewName;

const mediaLoanVwObject = require('../models/views/vw-media-loan');
const libraryVwObject = require('../models/views/vw-library');

// ------------------- Funções Exportadas ------------------- //
const createViews = function (db) {
    db.createCollection(mediaLoanVwName, mediaLoanVwObject);
    db.createCollection(libraryVwName, libraryVwObject);
};

// --------------------- Module Exports --------------------- //
module.exports = createViews;
