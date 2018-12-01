// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.user.countDocuments({ 'name': request.body.name }).exec(),
            response.locals._MODELS.user.countDocuments({ 'phone': request.body.phone }).exec(),
            response.locals._MODELS.user.countDocuments({ 'email': request.body.email }).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateDataAlreadyRegistered(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ isBusiness: true, message: validationErrors });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.user.countDocuments(
                {
                    '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                    'name': request.body.name
                }
            ).exec(),
            response.locals._MODELS.user.countDocuments(
                {
                    '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                    'phone': request.body.phone
                }
            ).exec(),
            response.locals._MODELS.user.countDocuments(
                {
                    '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                    'email': request.body.email
                }
            ).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateDataAlreadyRegistered(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ isBusiness: true, message: validationErrors });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const find = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);
        response.locals._UTIL.clearObject(request.query, ['page', 'limit']);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);
        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function validateDataAlreadyRegistered(resolvedPromisses) {
    let validationErrors = [];

    if (resolvedPromisses[0] > 0) {
        validationErrors.push('Nome já cadastrado.');
    }

    if (resolvedPromisses[1] > 0) {
        validationErrors.push('Telefone já cadastrado.');
    }

    if (resolvedPromisses[2] > 0) {
        validationErrors.push('E-mail já cadastrado.');
    }

    return validationErrors;
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'find': find
};
