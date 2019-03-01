// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = getLibraryQuery(request.query);

        response.locals._UTIL.clearObject(request.query, ['mediaId', 'mediaOwner', 'mediaPlatform']);

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const searchHome = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = getLibraryQuery(request.query);

        response.locals._UTIL.clearObject(request.query, ['mediaPlatform']);

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function getLibraryQuery(requestQuery) {
    if (requestQuery.mediaPlatform) {
        requestQuery['$or'] = requestQuery.mediaPlatform.split(',').map(function (singlePlatform) {
            let singlePlatformQuery = {};

            singlePlatformQuery[platformMediaList[singlePlatform]] = { '$ne': [] };

            return singlePlatformQuery;
        });
    }

    if (requestQuery.name) {
        requestQuery.name = new RegExp(requestQuery.name, 'i');
    }

    return requestQuery;
};

// --------------------- Objetos Locais --------------------- //
const platformMediaList = {
    'PS3': 'mediaPs3',
    'PS4': 'mediaPs4',
    'XBOX360': 'mediaXbox360',
    'XBOXONE': 'mediaXboxOne',
    'NINTENDO3DS': 'mediaNintendo3ds',
    'NINTENDOSWITCH': 'mediaNintendoSwitch'
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'search': search,
    'searchHome': searchHome
};
