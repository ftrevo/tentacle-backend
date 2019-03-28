// ------------------- Funções Exportadas ------------------- //
const requestHandler = function (request, response, next) {
    if (response.locals.message && !Array.isArray(response.locals.message)) {
        response.locals.message = [response.locals.message];
    }

    response.locals._UTIL.handleRequests(
        response.locals.statusCode,
        response,
        {
            'message': response.locals.message,
            'data': response.locals.data
        }
    );
};

const route = function (request, response, next) {
    response.locals.statusCode = 200;
    response.locals.message = 'Server is up!';
    response.locals.data = new Date();

    next();
};

const version = function (request, response, next) {
    if (!request.headers['app-version'] || request.headers['app-version'] !== process.env.APP_VERSION) {
        return next({ 'isOutdated': true });
    }

    next();
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'version': version,
    'requestHandler': requestHandler,
    'route': route,
};
