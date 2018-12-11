// ----------------- Import de dependências ----------------- //
const jwt = require('jsonwebtoken');

// ------------------- Funções Exportadas ------------------- //
const logIn = async function (request, response, next) {
    try {
        let user = await response.locals._MODELS.user.findOne({ 'email': request.body.email }).exec();

        if (!user) {
            return next(getUserNotFoundObject());
        }

        let passwordMatch = await user.comparePassword(request.body.password);

        if (!passwordMatch) {
            return next({ 'isAuthDenied': true });
        }

        user = user.toObject();
        response.locals._UTIL.clearObject(user, ['password']);

        response.locals.data = getAuthorizationData(user);

        response.locals.message = 'Login realizado';
        response.locals.statusCode = 200;

        next();
    } catch (error) {
        next(error);
    }
};

//TODO CRIAR UMA TABELA COM TTL E SALVAR O TOKEN LÁ PARA CONTROLE
const refreshToken = async function (request, response, next) {
    try {
        let decodedUser = await jwt.decode(request.body.refreshToken);//CONTINUAR ESSA MERDA

        let user = await response.locals._MODELS.user.findById(response.locals.USER._id, { 'password': 0 }).lean().exec();

        if (!user) {
            return next(getUserNotFoundObject());
        }

        response.locals.data = getAuthorizationData(user);

        response.locals.message = 'Login realizado';
        response.locals.statusCode = 200;

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function getAuthorizationData(userToBeAuthorized) {
    return {
        'accessToken': jwt.sign(userToBeAuthorized, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXP_TIME }),
        'refreshToken': jwt.sign(userToBeAuthorized, process.env.APP_SECRET, { expiresIn: process.env.REFRESH_EXP_TIME }),
        'type': 'JWT'
    };
};

function getUserNotFoundObject() {
    return { 'isBusiness': true, 'message': 'Usuário não encontrado' };
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'logIn': logIn,
    'refreshToken': refreshToken
};
