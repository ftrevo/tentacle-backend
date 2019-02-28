// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.game.countDocuments({ 'name': new RegExp(`^${request.body.name}$`, 'i') }).exec(),
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateGameData(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        request.body.createdBy = response.locals._USER._id;

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);
        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const searchRemote = async function (request, response, next) {
    try {
        let pagination = response.locals._UTIL.resolvePagination(request.query);

        let igdbResponse = await response.locals._IGDB.list(request.query.name, pagination);

        if (igdbResponse.statusCode !== 200) {
            return next({ 'statusCode': 500, 'message': `IGDB ${igdbResponse.statusCode}` });
        }

        let list = JSON.parse(igdbResponse.body).map((singleGame) => {
            return transformUnixDate(singleGame, response);
        });

        response.locals._UTIL.setLocalsData(response, 200, { 'list': list });

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const saveRemote = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.game.countDocuments({ 'id': request.body.id }).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateGameData(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        let igdbResponse = await response.locals._IGDB.detail(request.body.id);

        if (igdbResponse.statusCode !== 200) {
            return next({ 'statusCode': 500, 'message': `IGDB ${igdbResponse.statusCode}` });
        }

        let igdbResponseBody = JSON.parse(igdbResponse.body || '[]');

        if (!igdbResponseBody || igdbResponseBody.length !== 1) {
            return next({ 'isBusiness': true, 'message': 'Jogo não encontrado', 'isNotFound': true });
        }

        request.body = transformUnixDate(igdbResponseBody[0], response);

        request.body.createdBy = response.locals._USER._id;

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function validateGameData(resolvedPromisses) {
    let validationErrors = [];

    if (resolvedPromisses[0] > 0) {
        validationErrors.push('Jogo já cadastrado');
    }

    return validationErrors;
};

function transformUnixDate(singleGame, response) {
    let releaseDate = new Date(singleGame.first_release_date * 1000);

    singleGame.first_release_date = releaseDate;
    singleGame.formattedReleaseDate = response.locals._UTIL.getUtcFormattedDateFromDate(releaseDate);

    return singleGame;
};


// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'saveRemote': saveRemote,
    'search': search,
    'searchRemote': searchRemote
};
