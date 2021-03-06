// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.user(request.body);

        await toBeIncluded.save();

        response.locals._UTIL.setLocalsData(
            response,
            201,
            toBeIncluded.toObject(),
            'Usuário salvo'
        );

        response.locals._UTIL.clearObject(response.locals.data, ['password', 'token']);

        next();
    } catch (error) {
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let updated = await response.locals._MODELS.user.findOneAndUpdate(
            { '_id': request.params._id },
            request.body,
            { 'new': true }
        ).populate(
            {
                'path': 'state',
                'select': 'name initials'
            }
        );

        response.locals._UTIL.setLocalsData(
            response,
            200,
            updated.toObject(),
            'Usuário atualizado'
        );

        response.locals._UTIL.clearObject(response.locals.data, ['password', 'token']);

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.user.find(request.query, { 'password': 0, 'token': 0 })
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'name': 1 })
                .populate('state', 'name initials')
                .exec(),

            response.locals._MODELS.user.find(request.query).countDocuments().exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            { 'list': resolvedPromisses[0], 'count': resolvedPromisses[1] }
        );

        next();
    } catch (error) {
        next(error);
    }
};

const findById = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.user.findById(request.params._id, { 'password': 0, 'token': 0 }, { lean: true })
            .populate('state', 'name initials');

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Usuário não encontrado', 'isNotFound': true });
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Usuário encontrado'
        );

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
    'search': search
};

