// ----------------- Import de dependências ----------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const modelInjector = require('./helpers/model-injector');
const defMethods = require('./helpers/default-methods');
const validator = require('./helpers/validator');
const mailer = require('./helpers/mailer');

// --------------- Import de regras de negócio -------------- //
const br = require('./business-rules');

// ------------------ Import de repositórios ---------------- //
const repo = require('./repositories');

const privateRoute = passport.authenticate('jwt', { session: false });

// ------------------- Funções Exportadas ------------------- //
const routes = function (app) {

  app.route('/').get(defMethods.route, defMethods.requestHandler);

  app.route('/login')
    .post(modelInjector, validator('access', 'login', 'body'),
      br.access.logIn, repo.token.update, defMethods.requestHandler);
  app.route('/refresh-token')
    .post(modelInjector, validator('access', 'refreshToken', 'body'),
      br.access.refreshToken, repo.token.update, defMethods.requestHandler);


  app.route('/states').get(modelInjector, repo.state.search, defMethods.requestHandler);
  app.route('/states/:_id/cities').get(modelInjector, validator('state', 'id', 'params'), repo.state.findById, defMethods.requestHandler);


  app.route('/users')
    .get(modelInjector, privateRoute, validator('user', 'search', 'query'), br.user.search, repo.user.search, defMethods.requestHandler)
    .post(
      modelInjector, validator('user', 'create', 'body'),
      br.user.save, repo.user.save, br.access.logInOnCreate, repo.token.save, defMethods.requestHandler
    );

  app.route('/users/:_id([0-9a-fA-F]{24})')
    .get(modelInjector, privateRoute, validator('user', 'id', 'params'), repo.user.findById, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('user', 'id', 'params'), validator('user', 'update', 'body'),
      br.user.update, repo.user.update, defMethods.requestHandler
    );

  app.route('/users/forgot-password')
    .post(modelInjector, validator('user', 'forgotPwd', 'body'), br.user.forgotPwd, repo.user.update, mailer.forgotPwd, defMethods.requestHandler);

  app.route('/users/restore-password')
    .post(modelInjector, validator('user', 'restorePwd', 'body'), br.user.restorePwd, repo.user.update, defMethods.requestHandler);

  app.route('/users/profile')
    .get(modelInjector, privateRoute, br.user.profile, repo.user.findById, defMethods.requestHandler);

  app.route('/games')
    .get(modelInjector, privateRoute, validator('game', 'search', 'query'), br.game.search, repo.game.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('game', 'create', 'body'), br.game.save, repo.game.save, defMethods.requestHandler);

  app.route('/games/:_id([0-9a-fA-F]{24})')
    .get(modelInjector, privateRoute, validator('game', 'id', 'params'), repo.game.findById, defMethods.requestHandler);

  app.route('/games/remote')
    .get(modelInjector, privateRoute, validator('game', 'searchRemote', 'query'), br.game.searchRemote, defMethods.requestHandler)
    .post(modelInjector, privateRoute, br.game.saveRemote, repo.game.save, defMethods.requestHandler);


  app.route('/media')
    .get(modelInjector, privateRoute, validator('media', 'search', 'query'), br.media.search, repo.media.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('media', 'create', 'body'), br.media.save, repo.media.save, defMethods.requestHandler);

  app.route('/media/:_id')
    .get(modelInjector, privateRoute, validator('media', 'id', 'params'), repo.media.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, validator('media', 'id', 'params'),
      br.media.remove, repo.media.removeOrUpdate, repo.loan.removeFromMedia, mailer.mediaRemoved, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('media', 'id', 'params'), validator('media', 'update', 'body'),
      br.media.update, repo.media.update, defMethods.requestHandler
    );


  app.route('/library')
    .get(
      modelInjector, privateRoute, validator('library', 'search', 'query'),
      br.library.search, repo.library.search, defMethods.requestHandler);

  app.route('/library/:_id([0-9a-fA-F]{24})')
    .get(
      modelInjector, privateRoute, validator('library', 'id', 'params'), repo.library.findById, defMethods.requestHandler);

  app.route('/library/home')
    .get(
      modelInjector, privateRoute, validator('library', 'searchHome', 'query'),
      br.library.searchHome, repo.library.searchHome, defMethods.requestHandler);

  app.route('/loans')
    .get(modelInjector, privateRoute, validator('loan', 'search', 'query'), br.loan.search, repo.loan.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('loan', 'create', 'body'), br.loan.save, repo.loan.save, mailer.loanReminder, defMethods.requestHandler);

  app.route('/loans/:_id')
    .get(modelInjector, privateRoute, validator('loan', 'id', 'params'), repo.loan.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, validator('loan', 'id', 'params'), br.loan.remove, repo.loan.remove, defMethods.requestHandler)
    .patch(
      modelInjector, privateRoute, validator('loan', 'id', 'params'), validator('loan', 'update', 'body'),
      br.loan.update, repo.loan.update, defMethods.requestHandler
    );

  app.route('/loans/:_id/remember-delivery')
    .post(modelInjector, privateRoute, validator('loan', 'id', 'params'), br.loan.rememberDelivery, mailer.rememberDelivery, defMethods.requestHandler);

  app.route('/media-loan')
    .get(modelInjector, privateRoute, validator('mediaLoan', 'search', 'query'), br.mediaLoan.search, repo.mediaLoan.search, defMethods.requestHandler)

  app.route('/media-loan/:_id')
    .get(modelInjector, privateRoute, validator('mediaLoan', 'id', 'params'), repo.mediaLoan.findById, defMethods.requestHandler);

  app.route('/messages')
    .get(modelInjector, privateRoute, validator('message', 'search', 'query'), br.message.search, repo.message.search, defMethods.requestHandler)
    .post(modelInjector, privateRoute, validator('message', 'create', 'body'), repo.message.save, defMethods.requestHandler);

  app.route('/messages/:_id')
    .get(modelInjector, privateRoute, repo.message.findById, defMethods.requestHandler)
    .delete(modelInjector, privateRoute, br.message.remove, repo.message.remove, defMethods.requestHandler);
};

// --------------------- Module Exports --------------------- //
module.exports = routes;
