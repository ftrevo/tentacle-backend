// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.user(request.body);

        await toBeIncluded.save();

        response.locals.message = 'Usuário salvo no banco.';
        response.locals.statusCode = 201;

        response.locals.data = toBeIncluded.toObject();
        response.locals._UTIL.clearObject(response.locals.data, ['password']);
        response.location(`/users/${response.locals.data._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let updated = await response.locals._MODELS.user.findOneAndUpdate({ '_id': request.params._id }, request.body, { 'new': true });

        response.locals.message = 'Usuário atualizado no banco.';
        response.locals.statusCode = 200;

        response.locals.data = updated.toObject();
        response.locals._UTIL.clearObject(response.locals.data, ['password']);
        response.location(`/users/${response.locals.data._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.user.find(request.query, { 'password': 0 })
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'name': 1 }).exec(),

            response.locals._MODELS.user.find(request.query).countDocuments().exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        response.locals.statusCode = 200;
        response.locals.data = { 'list': resolvedPromisses[0], 'count': resolvedPromisses[1] };

        next();
    } catch (error) {
        next(error);
    }
};

const findById = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.user.findById(request.params._id, { 'password': 0 }, { lean: true });

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Usuário não encontrado', 'isNotFound': true });
        }

        response.locals.data = foundObject;
        response.locals.message = 'Usuário encontrado';
        response.locals.statusCode = 200;

        response.location(`/users/${request.params._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.user.findByIdAndDelete(request.params._id, { 'select': { 'password': 0 } });

        response.locals.data = foundObject;
        response.locals.message = 'Usuário removido';
        response.locals.statusCode = 200;
        response.location(`/users/${request.params._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'findById': findById,
    'remove': remove,
    'search': search
};

