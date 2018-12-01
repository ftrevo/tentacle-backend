// --------------- Import de arquivos do core --------------- //
const validador = require('./helpers/validator');
const modelInjector = require('./helpers/model-injector');
const brUser = require('./business-rule/br-user');
const repoUser = require('./repositories/repo-user');
const defMethods = require('./helpers/default-methods');

// ------------------- Funções Exportadas ------------------- //
const routes = function (app) {
  app.get('/', defMethods.route, defMethods.requestHandler);

  app.route('/users')
    .get(validador('user', 'search', 'query'), modelInjector('user'), brUser.find, repoUser.find, defMethods.requestHandler)
    .post(validador('user', 'create', 'body'), modelInjector('user'), brUser.save, repoUser.save, defMethods.requestHandler);

  app.route('/users/:_id')
    .patch(
      validador('user', 'id', 'params'), validador('user', 'update', 'query'), modelInjector('user'),
      brUser.update, repoUser.update, defMethods.requestHandler
    );
};

// --------------------- Module Exports --------------------- //
module.exports = routes;