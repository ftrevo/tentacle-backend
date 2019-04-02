// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        request.query.endpoint = 'search';

        request.query.aggregate = getAggregateObjectArray(
            request.query,
            { 'name': 1 },
            response.locals
        );

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const detail = async function (request, response, next) {
    try {
        request.query = { '_id': request.params._id, 'endpoint': 'detail', 'page': 0, 'limit': 1 };

        request.query.aggregate = getAggregateObjectArray(
            request.query,
            { 'name': 1 },
            response.locals
        );

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const searchHome = async function (request, response, next) {
    try {
        request.query.endpoint = 'home';

        request.query.aggregate = getAggregateObjectArray(
            request.query,
            { 'createdAt': -1 },
            response.locals
        );

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};


// --------------------- Funções Locais --------------------- //
function getAggregateObjectArray(query, queryOrder, locals) {
    let pagination = locals._UTIL.resolvePagination(query);

    let aggregatePipeline = [
        { '$match': getMatchQuery(query, locals._USER.state, locals._MONGOOSE.Types) },
        { '$sort': queryOrder },
        { '$project': getProjectObject(query.endpoint, locals._MONGOOSE.Types.ObjectId(locals._USER.state)) },
        { '$addFields': getAddFiedls() }
    ];

    if (query.endpoint !== 'detail') {
        aggregatePipeline.push({ '$project': getExcludeMediaListProjection() });
        aggregatePipeline.push({
            '$facet': {
                'count': [{ '$count': 'count' }],
                'list': [
                    { $skip: pagination.skip },
                    { $limit: pagination.max }
                ]
            }
        });
        aggregatePipeline.push({ '$unwind': '$count' });
        aggregatePipeline.push({ '$addFields': { 'count': '$count.count' } });
    }

    return aggregatePipeline;
};

function getMatchQuery(requestQuery, userState, mongooseTypes) {
    let matchQuery = {};

    let mediaPlatforms = 'PS3,PS4,XBOX360,XBOXONE,NINTENDO3DS,NINTENDOSWITCH';

    if (requestQuery.mediaPlatform) {
        mediaPlatforms = requestQuery.mediaPlatform;
    }

    Object.assign(matchQuery, getMediaQueryObject(mediaPlatforms, mongooseTypes.ObjectId(userState)));

    if (requestQuery.name) {
        matchQuery.name = new RegExp(requestQuery.name, 'i');
    }

    if (requestQuery._id) {
        matchQuery._id = mongooseTypes.ObjectId(requestQuery._id);
    }

    return matchQuery;
};

function getMediaQueryObject(mediaString, userState) {

    let query = {};

    if (mediaString.indexOf(',') === -1) {
        let fieldName = platformMediaList[mediaString] + '.ownerState';

        query[fieldName] = userState;

        return query;
    }

    query['$or'] = mediaString.split(',').map(function (singlePlatform) {
        let singlePlatformQuery = {};

        let fieldName = platformMediaList[singlePlatform] + '.ownerState';

        singlePlatformQuery[fieldName] = userState;

        return singlePlatformQuery;
    });

    return query;
};

function getProjectObject(endpoint, userState) {
    let projectObject = {
        '_id': 1, 'name': 1, 'createdAt': 1
    };

    Object.values(platformMediaList).forEach(function (platformMedia) {
        projectObject[platformMedia] = getFilterProjectionObject(platformMedia, userState);
    });

    if (endpoint === 'home' || endpoint === 'detail') {
        projectObject = {
            ...projectObject, ...{ 'aggregated_rating': 1, 'summary': 1, 'screenshots': 1 }
        };

        if (endpoint === 'detail') {
            projectObject = {
                ...projectObject,
                ...{
                    'id': 1, 'cover': 1, 'first_release_date': 1, 'game_modes': 1, 'updatedAt': 1,
                    'genres': 1, 'slug': 1, 'url': 1, 'videos': 1, 'formattedReleaseDate': 1
                }
            };
        }
    }

    return projectObject;
};

function getFilterProjectionObject(platformMedia, ownerState) {
    return { '$filter': getFilterObject(platformMedia, ownerState) };
};

function getFilterObject(platformMedia, ownerState) {
    return {
        'input': `$${platformMedia}`,
        'as': 'singleMedia',
        'cond': {
            '$eq': ['$$singleMedia.ownerState', ownerState]
        }
    };
};

function getAddFiedls() {
    let addFieldsObject = {}

    Object.values(platformMediaList).forEach(function (platformMedia) {
        addFieldsObject[`${platformMedia}Count`] = { '$size': `$${platformMedia}` };
    });

    return addFieldsObject;
};

function getExcludeMediaListProjection() {
    let removeFieldsObject = {}

    Object.values(platformMediaList).forEach(function (platformMedia) {
        removeFieldsObject[platformMedia] = 0;
    });

    return removeFieldsObject;
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
    'detail': detail,
    'search': search,
    'searchHome': searchHome
};
