// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        updateLibraryQuery(request.query);

        response.locals._UTIL.clearObject(request.query, ['mediaId', 'mediaOwner', 'mediaPlatform']);

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function updateLibraryQuery(requestQuery) {
    if (requestQuery.mediaPlatform) {
        if (requestQuery.mediaId || requestQuery.mediaOwner) {
            requestQuery[platformMediaList[requestQuery.mediaPlatform]] = getSinglePlatformQuery(requestQuery.mediaId, requestQuery.mediaOwner);
        } else {
            requestQuery[platformMediaList[requestQuery.mediaPlatform]] = { '$ne': [] };
        }
    } else {
        if (requestQuery.mediaId || requestQuery.mediaOwner) {
            requestQuery['$or'] = getPlatformListQuery(requestQuery.mediaId, requestQuery.mediaOwner);
        }
    }

    if (requestQuery.name) {
        requestQuery.name = new RegExp(requestQuery.name, 'i');
    }
};

function getPlatformListQuery(idValue, ownerValue) {
    let platformQuery = [];

    Object.values(platformMediaList).forEach(function (singlePlatform) {
        let singlePlatformQuery = {};

        singlePlatformQuery[singlePlatform] = getSinglePlatformQuery(idValue, ownerValue);

        platformQuery.push(singlePlatformQuery);
    });

    return platformQuery;
};

function getSinglePlatformQuery(idValue, ownerValue) {
    return { '$elemMatch': getQueryObject(idValue, ownerValue) };
};

function getQueryObject(idValue, ownerValue) {
    let query = {};

    if (idValue) {
        query['_id'] = idValue;
    }

    if (ownerValue) {
        query['owner'] = ownerValue;
    }

    return query;
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
    'search': search
};
