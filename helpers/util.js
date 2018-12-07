// ------------------- Funções Exportadas ------------------- //
const resolvePagination = (params) => {
    let page = parseInt(params.page);
    let limit = parseInt(params.limit);

    clearObject(params, ['page', 'limit']);

    return { 'skip': page * limit, 'max': limit };
};

const handleRequests = (stausCodeNumber, body, response) => {
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
}

const transformObjectToQuery = (filter = {}) => {
    let mongodbFilter = {};

    Object.entries(filter).forEach(tuple => {
        if (
            (
                typeof tuple[1] === 'string'
                || tuple[1] instanceof String
            )
            && !tuple[1].match(/^[0-9a-fA-F]{24}$/)
            && isNaN(Date.parse(tuple[1]))
        ) {
            return mongodbFilter[tuple[0]] = new RegExp(tuple[1], 'i');
        }
        return mongodbFilter[tuple[0]] = tuple[1];
    });

    return mongodbFilter;
}

// --------------------- Module Exports --------------------- //
module.exports = {
    'clearObject': clearObject,
    'handleRequests': handleRequests,
    'resolvePagination': resolvePagination,
    'transformObjectToQuery': transformObjectToQuery
};