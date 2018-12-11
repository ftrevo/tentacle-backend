// ----------------- Import de dependências ----------------- //
const jwt = require('jsonwebtoken');
const uuidV1 = require('uuid/v1');
const uuidV4 = require('uuid/v4');

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

        response.locals.userId = user._id;
        response.locals.data = getAuthorizationData(user);

        response.locals.message = 'Login realizado';
        response.locals.statusCode = 200;

        next();
    } catch (error) {
        next(error);
    }
};

const refreshToken = async function (request, response, next) {
    try {
        let splittedRefreshToken = request.body.refreshToken.split('.');

        let promisseStack = [
            response.locals._MODELS.user.findById(splittedRefreshToken[1], { 'password': 0 }).lean().exec(),
            response.locals._MODELS.token.findOne({ 'user': splittedRefreshToken[1], 'refreshToken': request.body.refreshToken }).exec(),
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        if (!resolvedPromisses[0] || !resolvedPromisses[1] || resolvedPromisses[1].isExpired()) {
            return next({ 'isAuthDenied': true });
        }

        response.locals.userId = resolvedPromisses[0]._id;
        response.locals.data = getAuthorizationData(resolvedPromisses[0]);

        response.locals.message = 'Refresh Token realizado';
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
        'refreshToken': `${uuidV1()}.${userToBeAuthorized._id}.${uuidV4()}`,
        'tokenType': 'JWT'
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
