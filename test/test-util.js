
// --------------- Import de arquivos do core --------------- //
const util = require('../helpers/util');

// ------------------- Funções Exportadas ------------------- //
const getPopulateObject = function (returnedObject) {
    return function () {
        return {
            'populate': function () {
                return {
                    'exec': getExecFunction(returnedObject)
                };
            },
            'exec': getExecFunction(returnedObject)
        };
    };
};

const getLeanObject = function (returnedObject) {
    return function () {
        return {
            'lean': function () {
                return {
                    'exec': getExecFunction(returnedObject)
                };
            },
            'exec': getExecFunction(returnedObject)
        };
    };
};

const getExecObject = function (returnedObject) {
    return function () {
        return {
            'exec': getExecFunction(returnedObject)
        };
    };
};

const getExecFunction = function (returnedObject) {
    return () => returnedObject;
};

const getSortObject = function (returnedObject) {
    return function () {
        return {
            'sort': function () {
                return {
                    'exec': getExecFunction(returnedObject)
                };
            }
        };
    };
};

const getBaseResponseMock = function (loggedUserId, modelsObject, igdbObject) {
    return {
        'locals': {
            '_UTIL': util,
            '_USER': {
                '_id': loggedUserId
            },
            '_MONGOOSE': {
                'Types': {
                    'ObjectId': (desiredId) => desiredId
                }
            },
            '_IGDB': igdbObject,
            '_MODELS': modelsObject
        }
    };
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'getBaseResponseMock': getBaseResponseMock,
    'getExecFunction': getExecFunction,
    'getExecObject': getExecObject,
    'getLeanObject': getLeanObject,
    'getPopulateObject': getPopulateObject,
    'getSortObject': getSortObject
};
