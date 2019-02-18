// ----------------- Import de dependências ----------------- //
const tenancyVwName = require('../models/tenancy').viewName;
const libraryVwName = require('../models/library').viewName;

const libraryVwObject = require('../models/views/vw-library');
const tenancyVwObject = require('../models/views/vw-tenancy');

// ------------------- Funções Exportadas ------------------- //
const createViews = function (db) {
    db.createCollection(tenancyVwName, tenancyVwObject);
    db.createCollection(libraryVwName, libraryVwObject);
};

// --------------------- Module Exports --------------------- //
module.exports = createViews;
