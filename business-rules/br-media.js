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

        let existsAndOwnerError = validateExistenceAndOwnership(resolvedPromisses[2], response.locals._USER);

        if (existsAndOwnerError) {
            return next(existsAndOwnerError);
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

const remove = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.media.findById(request.params._id).exec(),
            response.locals._MODELS.loan.find({ 'media': request.params._id }).sort({ 'requestedAt': -1 }).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let existsAndOwnerError = validateExistenceAndOwnership(resolvedPromisses[0], response.locals._USER);

        if (existsAndOwnerError) {
            return next(existsAndOwnerError);
        }

        request.body = { 'action': 'remove' };

        if (resolvedPromisses[1]) {
            let lastLoan = resolvedPromisses[1][0];

            if (resolvedPromisses[1].length !== 0) {
                if (lastLoan.loanDate && !lastLoan.returnDate) {
                    return next({ 'isBusiness': true, 'message': 'Mídia emprestada, espere a devolução para inativar o jogo.' });
                }

                if (resolvedPromisses[1].length > 1) {
                    request.body.action = 'deactivate';
                    request.body.active = false;
                }

                if (!lastLoan.loanDate) {
                    request.body.loanId = lastLoan._id;
                } else {
                    request.body.action = 'deactivate';
                    request.body.active = false;
                }
            }
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        if (request.query && request.query.mineOnly) {
            request.query.owner = response.locals._USER._id;
            response.locals._UTIL.clearObject(request.query, ['mineOnly']);
        }

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

function validateExistenceAndOwnership(media, owner) {
    if (!media) {
        return { 'isBusiness': true, 'message': 'Mídia não encontrada', 'isNotFound': true };
    }

    if (media.owner.toString() !== owner._id.toString()) {
        return { 'isForbidden': true };
    }
};
// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'search': search,
    'remove': remove
};
