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
    return function () {
        return returnedObject;
    };
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

// --------------------- Module Exports --------------------- //
module.exports = {
    'getExecFunction': getExecFunction,
    'getExecObject': getExecObject,
    'getLeanObject': getLeanObject,
    'getPopulateObject': getPopulateObject,
    'getSortObject': getSortObject
};
