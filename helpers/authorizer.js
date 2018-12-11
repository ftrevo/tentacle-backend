// ----------------- Import de dependências ----------------- //
const passportJwt = require('passport-jwt');

// ------------------- Funções Exportadas ------------------- //
const authorize = function (passport) {
    let options = {};

    options.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = process.env.APP_SECRET;
    options.passReqToCallback = true;

    passport.use(new passportJwt.Strategy(options, validateUser));
};

const validateUser = async function (request, jwt_payload, next) {
    try {
        request.res.locals._USER = await request.res.locals._MODELS.user.findById(jwt_payload._id, { 'password': 0 }).lean().exec();

        if (!request.res.locals._USER) {
            return next({ isAuthDenied: true });
        }

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = authorize;