// ----------------- Import de dependências ----------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const modelInjector = require('./helpers/model-injector');
const defMethods = require('./helpers/default-methods');
const validator = require('./helpers/validator');

// --------------- Import de regras de negócio -------------- //
const brLibrary = require('./business-rule/br-library');
const brAccess = require('./business-rule/br-access');
const brMedia = require('./business-rule/br-media');
const brUser = require('./business-rule/br-user');
const brGame = require('./business-rule/br-game');
const brLoan = require('./business-rule/br-loan');

// ------------------ Import de repositórios ---------------- //
const repoLibrary = require('./repositories/repo-library');
const repoToken = require('./repositories/repo-token');
const repoState = require('./repositories/repo-state');
const repoMedia = require('./repositories/repo-media');
const repoUser = require('./repositories/repo-user');
const repoGame = require('./repositories/repo-game');
const repoLoan = require('./repositories/repo-loan');


const privateRoute = passport.authenticate('jwt', { session: false });

// ------------------- Funções Exportadas ------------------- //
const routes = function (app) {

  app.route('/').get(defMethods.route, defMethods.requestHandler);

  app.route('/login')
    .post(modelInjector('user', 'token'), validator('access', 'login', 'body'),
      brAccess.logIn, repoToken.saveOrUpdate, defMethods.requestHandler);
  app.route('/refresh-token')
    .post(modelInjector('user', 'token'), validator('access', 'refreshToken', 'body'),
      brAccess.refreshToken, repoToken.saveOrUpdate, defMethods.requestHandler);


  app.route('/states').get(modelInjector('state'), repoState.search, defMethods.requestHandler);
  app.route('/states/:_id/cities').get(modelInjector('state'), validator('state', 'id', 'params'), repoState.findById, defMethods.requestHandler);


  app.route('/users')
    .get(modelInjector('user'), privateRoute, validator('user', 'search', 'query'), brUser.search, repoUser.search, defMethods.requestHandler)
    .post(modelInjector('user', 'state'), validator('user', 'create', 'body'), brUser.save, repoUser.save, defMethods.requestHandler);

  app.route('/users/:_id')
    .get(modelInjector('user'), privateRoute, validator('user', 'id', 'params'), repoUser.findById, defMethods.requestHandler)
    .delete(modelInjector('user'), privateRoute, validator('user', 'id', 'params'), brUser.remove, repoUser.remove, defMethods.requestHandler)
    .patch(
      modelInjector('user', 'state'), privateRoute, validator('user', 'id', 'params'), validator('user', 'update', 'body'),
      brUser.update, repoUser.update, defMethods.requestHandler
    );


  app.route('/games')
    .get(modelInjector('game', 'user'), privateRoute, validator('game', 'search', 'query'), brGame.search, repoGame.search, defMethods.requestHandler)
    .post(modelInjector('game', 'user'), privateRoute, validator('game', 'create', 'body'), brGame.save, repoGame.save, defMethods.requestHandler);

  app.route('/games/:_id')
    .get(modelInjector('game', 'user'), privateRoute, validator('game', 'id', 'params'), repoGame.findById, defMethods.requestHandler)
    .delete(modelInjector('game', 'user'), privateRoute, validator('game', 'id', 'params'), repoGame.remove, defMethods.requestHandler)
    .patch(
      modelInjector('game', 'user'), privateRoute, validator('game', 'id', 'params'), validator('game', 'update', 'body'),
      brGame.update, repoGame.update, defMethods.requestHandler
    );


  app.route('/media')
    .get(modelInjector('media', 'game', 'user'), privateRoute, validator('media', 'search', 'query'), brMedia.search, repoMedia.search, defMethods.requestHandler)
    .post(modelInjector('media', 'game', 'user'), privateRoute, validator('media', 'create', 'body'), brMedia.save, repoMedia.save, defMethods.requestHandler);

  app.route('/media/:_id')
    .get(modelInjector('media', 'game', 'user'), privateRoute, validator('media', 'id', 'params'), repoMedia.findById, defMethods.requestHandler)
    .delete(modelInjector('media', 'game', 'user'), privateRoute, validator('media', 'id', 'params'), repoMedia.remove, defMethods.requestHandler)
    .patch(
      modelInjector('media', 'game', 'user'), privateRoute, validator('media', 'id', 'params'), validator('media', 'update', 'body'),
      brMedia.update, repoMedia.update, defMethods.requestHandler
    );


  app.route('/library')
    .get(
      modelInjector('library', 'user'), privateRoute, validator('library', 'search', 'query'),
      brLibrary.search, repoLibrary.search, defMethods.requestHandler);


  app.route('/loans')
    .get(modelInjector('loan', 'user'), privateRoute, validator('loan', 'search', 'query'), brLoan.search, repoLoan.search, defMethods.requestHandler)
    .post(modelInjector('loan', 'media', 'user'), privateRoute, validator('loan', 'create', 'body'), brLoan.save, repoLoan.save, defMethods.requestHandler);

  app.route('/loans/:_id')
    .get(modelInjector('loan', 'user'), privateRoute, validator('loan', 'id', 'params'), repoLoan.findById, defMethods.requestHandler)
    .delete(modelInjector('loan', 'user'), privateRoute, validator('loan', 'id', 'params'), brLoan.remove, repoLoan.remove, defMethods.requestHandler)
    .patch(
      modelInjector('loan', 'user'), privateRoute, validator('loan', 'id', 'params'), validator('loan', 'update', 'body'),
      brLoan.update, repoLoan.update, defMethods.requestHandler
    );

};

// --------------------- Module Exports --------------------- //
module.exports = routes;
