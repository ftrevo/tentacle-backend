// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.media.countDocuments({
                'platform': request.body.platform,
                'game': request.body.game,
                'owner': response.locals._USER._id
            }).exec(),

            response.locals._MODELS.game.countDocuments({ '_id': request.body.game }).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateData(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        request.body.owner = response.locals._USER._id;

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.media.countDocuments(
                {
                    '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                    'game': request.body.game,
                    'platform': request.body.platform,
                    'owner': response.locals._USER._id
                }
            ).exec(),

            response.locals._MODELS.game.countDocuments({ '_id': request.body.game }).exec(),

            response.locals._MODELS.media.findById(request.params._id).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        if (!resolvedPromisses[2]) {
            return next({ 'isBusiness': true, 'message': 'Mídia não encontrada', 'isNotFound': true });
        } else if (resolvedPromisses[2].owner + '' !== response.locals._USER._id + '') {
            return next({ 'isForbidden': true });
        }

        let validationErrors = validateData(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

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

// --------------------- Funções Locais --------------------- //
function validateData(resolvedPromisses) {
    let validationErrors = [];

    if (resolvedPromisses[0] > 0) {
        validationErrors.push('Mídia já cadastrada');
    }

    if (resolvedPromisses[1] === 0) {
        validationErrors.push('Jogo não encontrado');
    }

    return validationErrors;
};
// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'search': search
};
