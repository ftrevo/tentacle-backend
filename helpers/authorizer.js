// ----------------- Import de dependências ----------------- //
const passportJwt = require('passport-jwt');

// ------------------- Funções Exportadas ------------------- //
/* istanbul ignore next */
const authorize = function (passport) {
    let options = {};

    options.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = process.env.APP_SECRET;
    options.passReqToCallback = true;

    passport.use(new passportJwt.Strategy(options, validateUser));
};

const validateUser = async function (request, jwt_payload, done) {
    try {
        request.res.locals._USER = await request.res.locals._MODELS.user.findById(jwt_payload._id, { 'password': 0 }).exec();

        if (!request.res.locals._USER || request.res.locals._USER.isUpdated(jwt_payload.updatedAt)) {
            return done({ 'isAuthDenied': true });
        }

        return done(null, request.res.locals._USER);
    } catch (error) {
        /* istanbul ignore next */
        done(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'authorize': authorize,
    'validateUser': validateUser
};