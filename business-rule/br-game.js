// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.game.countDocuments({ 'title': new RegExp(`^${request.body.title}$`, 'i') }).exec(),
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

const update = async function (request, response, next) {
    try {
        let promisseStack = [];

        promisseStack.push(
            response.locals._MODELS.game.countDocuments(
                {
                    '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                    'title': new RegExp(`^${request.body.title}$`, 'i')
                }
            ).exec()
        );

        promisseStack.push(
            response.locals._MODELS.game.findById(request.params._id).exec()
        );

        let resolvedPromisses = await Promise.all(promisseStack);

        if (!resolvedPromisses[1]) {
            return next({ 'isBusiness': true, 'message': 'Jogo não encontrado', 'isNotFound': true });
        }

        let validationErrors = validateGameData(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        request.body.updatedBy = response.locals._USER._id;

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
function validateGameData(resolvedPromisses) {
    let validationErrors = [];

    if (resolvedPromisses[0] > 0) {
        validationErrors.push('Jogo já cadastrado');
    }

    return validationErrors;
};
// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'search': search
};
