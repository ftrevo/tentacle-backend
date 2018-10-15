//TODO IMPLEMENTAR OS OUTROS MÉTODOS, SÓ O SAVE TÁ CERTO
const save = async function (request, response, next) {
    let usuarioInclusao = new response.locals._MODELS.Usuario(request.body);

    await usuarioInclusao.save();

    response.locals.message = 'Usuário salvo no banco.';
    response.locals.statusCode = 201;

    response.locals.data = usuarioInclusao.toObject();
    response.locals._UTIL.clearObject(response.locals.data, ['password']);
    response.location(`/users/${response.locals.data._id}`);

    next();
};

const update = async function (request, response, next) {
    let usuarioInclusao = new response.locals._MODELS.Usuario(request.body);

    await usuarioInclusao.save();

    response.locals.message = 'Usuário atualizado no banco.';
    response.locals.statusCode = 200;

    response.locals.data = usuarioInclusao.toObject();
    response.locals._UTIL.clearObject(response.locals.data, ['password']);
    response.location(`/users/${interfaceObject._id}`);

    next();
};

const find = async function (request, response, next) {
    let usuarioInclusao = new response.locals._MODELS.Usuario(request.body);

    await usuarioInclusao.save();

    response.locals.message = 'Usuário salvo no banco.';

    next();
};

module.exports = {
    'save': save,
    'update': update,
    'find': find
};

