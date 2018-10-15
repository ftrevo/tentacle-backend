//TODO VALIDAR UNICO E AFINS AQUI
const save = async function (request, response, next) {

    let promisseStack = [
        response.locals._MODELS.Usuario.countDocuments({ 'name': request.body.name }).exec(),
        response.locals._MODELS.Usuario.countDocuments({ 'phone': request.body.phone }).exec(),
        response.locals._MODELS.Usuario.countDocuments({ 'email': request.body.email }).exec()
    ];

    let resolvedPromisses = await Promise.all(promisseStack);

    let validationError = [];

    if (resolvedPromisses[0] > 0) {
        validationError.push('Nome já cadastrado.');
    }

    if (resolvedPromisses[1] > 0) {
        validationError.push('Telefone já cadastrado.');
    }

    if (resolvedPromisses[2] > 0) {
        validationError.push('E-mail já cadastrado.');
    }

    if (validationError) {
        return next({ isBusiness: true, message: validationError });
    }

    next();
};

const update = async function (request, response, next) {
    let promisseStack = [
        response.locals._MODELS.Usuario.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'name': request.body.name
            }
        ).exec(),
        response.locals._MODELS.Usuario.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'phone': request.body.phone
            }
        ).exec(),
        response.locals._MODELS.Usuario.countDocuments(
            {
                '_id': { '$ne': ObjectId(request.params._id) },
                'email': request.body.email
            }
        ).exec()
    ];

    let resolvedPromisses = await Promise.all(promisseStack);

    let validationError = [];

    if (resolvedPromisses[0] > 0) {
        validationError.push('Nome já cadastrado.');
    }

    if (resolvedPromisses[1] > 0) {
        validationError.push('Telefone já cadastrado.');
    }

    if (resolvedPromisses[2] > 0) {
        validationError.push('E-mail já cadastrado.');
    }

    if (validationError) {
        return next({ isBusiness: true, message: validationError });
    }

    next();
};

const find = async function (request, response, next) {
    next();
};

module.exports = {
    'save': save,
    'update': update,
    'find': find
};
