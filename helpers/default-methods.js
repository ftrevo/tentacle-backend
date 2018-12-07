// ------------------- Funções Exportadas ------------------- //
const requestHandler = function (request, response, next) {
    response.locals._UTIL.handleRequests(
        response.locals.statusCode,
        {
            'message': response.locals.message,
            'data': response.locals.data
        },
        response);
};

const route = function (request, response, next) {
    response.locals.statusCode = 200;
    response.locals.message = 'Server is up!';
    response.locals.data = new Date();

    next();
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'requestHandler': requestHandler,
    'route': route
};