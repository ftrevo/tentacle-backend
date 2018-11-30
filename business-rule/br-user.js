// ------------------- Funções Exportadas ------------------- //
//TODO VALIDAR UNICO E AFINS AQUI
const save = async function (request, response, next) {

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
};

const update = async function (request, response, next) {
    let promisseStack = [
        response.locals._MODELS.user.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'name': request.body.name
            }
        ).exec(),
        response.locals._MODELS.user.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'phone': request.body.phone
            }
        ).exec(),
        response.locals._MODELS.user.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'email': request.body.email
            }
        ).exec()
    ];

    let resolvedPromisses = await Promise.all(promisseStack);

    let validationErrors = validateDataAlreadyRegistered(resolvedPromisses);

    if (validationErrors) {
        return next({ isBusiness: true, message: validationErrors });
    }

    next();
};

const find = async function (request, response, next) {
    next();
};

// --------------------- Funções Locais --------------------- //
function validateDataAlreadyRegistered(resolvedPromisses){
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
