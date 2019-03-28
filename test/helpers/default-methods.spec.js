// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const defaultMethods = require('../../helpers/default-methods');
const testUtil = require('../test-util');

describe('# Regra de negócio de métodos padrão', function () {

    before(function () {
        process.env.APP_VERSION = '1.1.0';
    });

    after(function () {
        delete process.env.APP_VERSION;
    });

    describe('## Route', function () {
        it('dados OK', async function () {
            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await defaultMethods.route({}, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();

            responseMock.locals.should.have.property('statusCode', 200);
            responseMock.locals.should.have.property('message', 'Server is up!');
            responseMock.locals.should.have.property('data').which.is.a.Date();
        });
    });

    describe('## Version', function () {
        it('sem versão', async function () {
            let requestMock = { 'headers': {} };

            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await defaultMethods.version(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isOutdated', true);
        });

        it('versão diferente', async function () {
            let requestMock = { 'headers': { 'app-version': '1.0.0' } };

            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await defaultMethods.version(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isOutdated', true);
        });

        it('dados OK', async function () {
            let requestMock = { 'headers': { 'app-version': '1.1.0' } };

            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await defaultMethods.version(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });
    });

    describe('## Request Handler', function () {
        it('mensagem string', async function () {
            let requestMock = { 'headers': { 'app-version': '1.1.0' } };

            let responseMock = getResponseMock();

            responseMock.locals.statusCode = 500;
            responseMock.locals.message = 'Mensagem String';

            let nextObject = await defaultMethods.requestHandler(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();


            responseMock.should.have.property('statusCode', 500);
            responseMock.should.have.property('body', { 'message': ['Mensagem String'], 'data': undefined });
        });

        it('mensagem array', async function () {
            let requestMock = { 'headers': { 'app-version': '1.1.0' } };

            let responseMock = getResponseMock();

            responseMock.locals.statusCode = 400;
            responseMock.locals.message = ['Mensagem 01', 'Mensagem 02'];

            let nextObject = await defaultMethods.requestHandler(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();


            responseMock.should.have.property('statusCode', 400);
            responseMock.should.have.property('body', { 'message': ['Mensagem 01', 'Mensagem 02'], 'data': undefined });
        });

        it('data', async function () {
            let requestMock = { 'headers': { 'app-version': '1.1.0' } };

            let responseMock = getResponseMock();

            responseMock.locals.statusCode = 200;
            responseMock.locals.message = ['Mensagem 01'];
            responseMock.locals.data = { 'field': 'value' };

            let nextObject = await defaultMethods.requestHandler(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();

            responseMock.should.have.property('statusCode', 200);
            responseMock.should.have.property('body', { 'message': ['Mensagem 01'], 'data': { 'field': 'value' } });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock() {
    let responseMock = testUtil.getBaseResponseMock();

    responseMock.status = statusFunction;

    return responseMock;
};

function statusFunction(statusCodeNumber) {
    self = this;

    self.statusCode = statusCodeNumber;
    return {
        'send': function (bodyObject) {
            self.body = bodyObject;
        }
    };
};

