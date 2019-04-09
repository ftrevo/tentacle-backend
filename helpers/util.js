const mediaPlatform = {
    'PS4': 'PS4',
    'PS3': 'PS3',
    'XBOXONE': 'XONE',
    'XBOX360': 'X360',
    'NINTENDOSWITCH': 'SWITCH',
    'NINTENDO3DS': '3DS'
};
// ------------------- Funções Exportadas ------------------- //
const resolvePagination = (params) => {
    let page = parseInt(params.page);
    let limit = parseInt(params.limit);

    clearObject(params, ['page', 'limit']);

    return { 'skip': page * limit, 'max': limit };
};

/* istanbul ignore next */
const handleRequests = (stausCodeNumber, response, body) => {
    return response.status(stausCodeNumber).send(body);
};

const clearObject = (requestParams, arrayParamsToRemove = []) => {
    arrayParamsToRemove.forEach(elementToRemove => {
        if (elementToRemove.includes('.')) {
            let pathToObject = elementToRemove.split('.');

            pathToObject.reduce((acc, key, index) => {
                if (acc) {
                    if (index === pathToObject.length - 1) {
                        delete acc[key];
                        return true;
                    }
                    return acc[key];
                }
            }, requestParams);
        } else {
            delete requestParams[elementToRemove];
        }
    });
};

const transformObjectToQuery = (filter = {}) => {
    let mongodbFilter = {};

    Object.entries(filter).forEach(tuple => {
        if (
            (typeof tuple[1] === 'string' || tuple[1] instanceof String)
            && !tuple[1].match(/^[0-9a-fA-F]{24}$/)
            && !tuple[1].match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        ) {
            return mongodbFilter[tuple[0]] = new RegExp(tuple[1], 'i');
        }
        return mongodbFilter[tuple[0]] = tuple[1];
    });

    return mongodbFilter;
};

const setLocalsData = (response, statusCode, data, message) => {
    response.locals.statusCode = statusCode;

    if (data) {
        response.locals.data = data;
    }

    if (message) {
        response.locals.message = message;
    }
};

const getUtcFormattedDateFromDate = (targetDate) => {
    return `${((targetDate.getUTCDate()) + '').padStart(2, '0')}/${((targetDate.getUTCMonth() + 1) + '').padStart(2, '0')}/${targetDate.getFullYear()}`;
}

const getMediaPlatformDescription = (value) => {
    return mediaPlatform[value];
}

// --------------------- Module Exports --------------------- //
module.exports = {
    'clearObject': clearObject,
    'getUtcFormattedDateFromDate': getUtcFormattedDateFromDate,
    'getMediaPlatformDescription': getMediaPlatformDescription,
    'handleRequests': handleRequests,
    'resolvePagination': resolvePagination,
    'setLocalsData': setLocalsData,
    'transformObjectToQuery': transformObjectToQuery
};
