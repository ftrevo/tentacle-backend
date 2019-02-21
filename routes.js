// ----------------- Import de dependências ----------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const modelInjector = require('./helpers/model-injector');
const defMethods = require('./helpers/default-methods');
const validator = require('./helpers/validator');
const mailer = require('./helpers/mailer');

// --------------- Import de regras de negócio -------------- //
const brMediaLoan = require('./business-rule/br-media-loan');
const brLibrary = require('./business-rule/br-library');
const brAccess = require('./business-rule/br-access');
const brMedia = require('./business-rule/br-media');
const brUser = require('./business-rule/br-user');
const brGame = require('./business-rule/br-game');
const brLoan = require('./business-rule/br-loan');

// ------------------ Import de repositórios ---------------- //
const repoMediaLoan = require('./repositories/repo-media-loan');
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
    .post(modelInjector, validator('access', 'login', 'body'),
      brAccess.logIn, repoToken.update, defMethods.requestHandler);
  app.route('/refresh-token')
    .post(modelInjector, validator('access', 'refreshToken', 'body'),
      brAccess.refreshToken, repoToken.update, defMethods.requestHandler);


  app.route('/states').get(modelInjector, repoState.search, defMethods.requestHandler);
  app.route('/states/:_id/cities').get(modelInjector, validator('state', 'id', 'params'), repoState.findById, defMethods.requestHandler);


  app.route('/users')
    .get(modelInjector, privateRoute, validator('user', 'search', 'query'), brUser.search, repoUser.search, defMethods.requestHandler)
    .post(
      modelInjector, validator('user', 'create', 'body'),
      brUser.save, repoUser.save, brAccess.logInOnCreate, repoToken.save, defMethods.requestHandler
    );

  app.route('/users/:_id([0-9a-fA-F]{24})')
    .get(modelInjector, privateRoute, validator('user', 'id', 'params'), repoUser.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, validator('user', 'id', 'params'), brUser.remove, repoUser.remove, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('user', 'id', 'params'), validator('user', 'update', 'body'),
      brUser.update, repoUser.update, defMethods.requestHandler
    );

  app.route('/users/forgot-password')
    .post(modelInjector, validator('user', 'forgotPwd', 'body'), brUser.forgotPwd, repoUser.update, mailer.forgotPwd, defMethods.requestHandler);

  app.route('/users/restore-password')
    .post(modelInjector, validator('user', 'restorePwd', 'body'), brUser.restorePwd, repoUser.update, defMethods.requestHandler);


  app.route('/games')
    .get(modelInjector, privateRoute, validator('game', 'search', 'query'), brGame.search, repoGame.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('game', 'create', 'body'), brGame.save, repoGame.save, defMethods.requestHandler);

  app.route('/games/:_id([0-9a-fA-F]{24})')
    .get(modelInjector, privateRoute, validator('game', 'id', 'params'), repoGame.findById, defMethods.requestHandler);

  app.route('/games/remote')
    .get(modelInjector, privateRoute, validator('game', 'searchRemote', 'query'), brGame.searchRemote, defMethods.requestHandler)
    .post(modelInjector, privateRoute, brGame.saveRemote, repoGame.save, defMethods.requestHandler);


  app.route('/media')
    .get(modelInjector, privateRoute, validator('media', 'search', 'query'), brMedia.search, repoMedia.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('media', 'create', 'body'), brMedia.save, repoMedia.save, defMethods.requestHandler);

  app.route('/media/:_id')
    .get(modelInjector, privateRoute, validator('media', 'id', 'params'), repoMedia.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, validator('media', 'id', 'params'), repoMedia.remove, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('media', 'id', 'params'), validator('media', 'update', 'body'),
      brMedia.update, repoMedia.update, defMethods.requestHandler
    );


  app.route('/library')
    .get(
      modelInjector, privateRoute, validator('library', 'search', 'query'),
      brLibrary.search, repoLibrary.search, defMethods.requestHandler);

  app.route('/library/:_id')
    .get(
      modelInjector, privateRoute, validator('library', 'id', 'params'), repoLibrary.findById, defMethods.requestHandler);


  app.route('/loans')
    .get(modelInjector, privateRoute, validator('loan', 'search', 'query'), brLoan.search, repoLoan.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('loan', 'create', 'body'), brLoan.save, repoLoan.save, defMethods.requestHandler);

  app.route('/loans/:_id')
    .get(modelInjector, privateRoute, validator('loan', 'id', 'params'), repoLoan.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, validator('loan', 'id', 'params'), brLoan.remove, repoLoan.remove, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('loan', 'id', 'params'), validator('loan', 'update', 'body'),
      brLoan.update, repoLoan.update, defMethods.requestHandler
    );

  app.route('/media-loan')
    .get(modelInjector, privateRoute, validator('mediaLoan', 'search', 'query'), brMediaLoan.search, repoMediaLoan.search, defMethods.requestHandler)

  app.route('/media-loan/:_id')
    .get(modelInjector, privateRoute, validator('mediaLoan', 'id', 'params'), repoMediaLoan.findById, defMethods.requestHandler);
};

// --------------------- Module Exports --------------------- //
module.exports = routes;
