// ----------------- Import de dependências ----------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const modelInjector = require('./helpers/model-injector');
const defMethods = require('./helpers/default-methods');
const validador = require('./helpers/validator');

// --------------- Import de regras de negócio -------------- //
const brAccess = require('./business-rule/br-access');
const brMedia = require('./business-rule/br-media');
const brUser = require('./business-rule/br-user');
const brGame = require('./business-rule/br-game');

// ------------------ Import de repositórios ---------------- //
const repoToken = require('./repositories/repo-token');
const repoState = require('./repositories/repo-state');
const repoMedia = require('./repositories/repo-media');
const repoUser = require('./repositories/repo-user');
const repoGame = require('./repositories/repo-game');


const privateRoute = passport.authenticate('jwt', { session: false });

// ------------------- Funções Exportadas ------------------- //
const routes = function (app) {

  app.route('/').get(defMethods.route, defMethods.requestHandler);


  app.route('/login')
    .post(modelInjector('user', 'token'), validador('access', 'login', 'body'),
      brAccess.logIn, repoToken.saveOrUpdate, defMethods.requestHandler);
  app.route('/refresh-token')
    .post(modelInjector('user', 'token'), validador('access', 'refreshToken', 'body'),
      brAccess.refreshToken, repoToken.saveOrUpdate, defMethods.requestHandler);


  app.route('/states').get(modelInjector('state'), repoState.search, defMethods.requestHandler);
  app.route('/states/:_id/cities').get(modelInjector('state'), validador('state', 'id', 'params'), repoState.findById, defMethods.requestHandler);


  app.route('/users')
    .get(modelInjector('user'), privateRoute, validador('user', 'search', 'query'), brUser.search, repoUser.search, defMethods.requestHandler)
    .post(modelInjector('user', 'state'), validador('user', 'create', 'body'), brUser.save, repoUser.save, defMethods.requestHandler);

  app.route('/users/:_id')
    .get(modelInjector('user'), privateRoute, validador('user', 'id', 'params'), repoUser.findById, defMethods.requestHandler)
    .delete(modelInjector('user'), privateRoute, validador('user', 'id', 'params'), brUser.remove, repoUser.remove, defMethods.requestHandler)
    .patch(
      modelInjector('user', 'state'), privateRoute, validador('user', 'id', 'params'), validador('user', 'update', 'body'),
      brUser.update, repoUser.update, defMethods.requestHandler
    );


  app.route('/games')
    .get(modelInjector('game', 'user'), privateRoute, validador('game', 'search', 'query'), brGame.search, repoGame.search, defMethods.requestHandler)
    .post(modelInjector('game', 'user'), privateRoute, validador('game', 'create', 'body'), brGame.save, repoGame.save, defMethods.requestHandler);

  app.route('/games/:_id')
    .get(modelInjector('game', 'user'), privateRoute, validador('game', 'id', 'params'), repoGame.findById, defMethods.requestHandler)
    .delete(modelInjector('game', 'user'), privateRoute, validador('game', 'id', 'params'), repoGame.remove, defMethods.requestHandler)
    .patch(
      modelInjector('game', 'user'), privateRoute, validador('game', 'id', 'params'), validador('game', 'update', 'body'),
      brGame.update, repoGame.update, defMethods.requestHandler
    );


  app.route('/media')
    .get(modelInjector('media', 'game', 'user'), privateRoute, validador('media', 'search', 'query'), brMedia.search, repoMedia.search, defMethods.requestHandler)
    .post(modelInjector('media', 'game', 'user'), privateRoute, validador('media', 'create', 'body'), brMedia.save, repoMedia.save, defMethods.requestHandler);

  app.route('/media/:_id')
    .get(modelInjector('media', 'game', 'user'), privateRoute, validador('media', 'id', 'params'), repoMedia.findById, defMethods.requestHandler)
    .delete(modelInjector('media', 'game', 'user'), privateRoute, validador('media', 'id', 'params'), repoMedia.remove, defMethods.requestHandler)
    .patch(
      modelInjector('media', 'game', 'user'), privateRoute, validador('media', 'id', 'params'), validador('media', 'update', 'body'),
      brMedia.update, repoMedia.update, defMethods.requestHandler
    );
};

// --------------------- Module Exports --------------------- //
module.exports = routes;