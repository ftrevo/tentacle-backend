// --------------- Import de arquivos do core --------------- //
const Validador = require('./helpers/Validador');
const ModelInjector = require('./helpers/ModelInjector');
const RNUsuario = require('./regras-negocio/RegraNegocioUsuario');
const BancoUsuario = require('./banco-dados/BancoDadosUsuario');

module.exports = (app) => {
  app.get('/', (request, response) => {
    response.locals._UTIL.handleRequests(200, { 'message': 'Server is up!', 'data': new Date() }, response);
  });

  app.route('/usuarios')
    .get(
      Validador('Usuario', 'consulta', 'body'), ModelInjector('Usuario'), RNUsuario.find, BancoUsuario.find, handlerRequisicoes)
    .post(
      Validador('Usuario', 'criacao', 'body'), ModelInjector('Usuario'), RNUsuario.save, BancoUsuario.save, handlerRequisicoes);

  app.route('/usuarios/:_id')
    .put(
      Validador('Usuario', 'atualizacao', 'query'), ModelInjector('Usuario'), RNUsuario.update, BancoUsuario.update, handlerRequisicoes);
};

function handlerRequisicoes(request, response, next) {
  response.locals._UTIL.handleRequests(
    response.locals.statusCode,
    {
      'message': response.locals.message,
      'data': response.locals.data
    },
    response);
};

