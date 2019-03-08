// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brAccess = require('../../business-rules/br-access');
const testUtil = require('../test-util');

describe('# Regra de negócio de Acesso', function () {

    before(function () {
        process.env.APP_SECRET = 'someRandomSecret';
        process.env.TOKEN_EXP_TIME = '1s';
    });

    after(function () {
        delete process.env.APP_SECRET;
        delete process.env.TOKEN_EXP_TIME;
    });

    describe('## Login', function () {
        let requestMock = { 'body': { 'password': '1234', 'email': 'emailtest@gmail.com' } };

        it('usuário não encontrado', async function () {
            let responseMock = getResponseMock();

            let nextObject = await brAccess.logIn(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message', 'Usuário não encontrado');
        });

        it('senha incorreta', async function () {
            let userMock = getUserMock(false);
            let responseMock = getResponseMock(userMock);

            let nextObject = await brAccess.logIn(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isAuthDenied', true);
        });

        it('tokens gerados', async function () {
            let userMock = getUserMock(true);
            let responseMock = getResponseMock(userMock);

            let nextObject = await brAccess.logIn(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            responseMock.locals.should.have.property('statusCode', 200);
            responseMock.locals.should.have.property('message', 'Login realizado');
            responseMock.locals.should.have.property('userId', 'randomId');
            responseMock.locals.should.have.property('data');
            responseMock.locals.data.should.have.property('tokenType', 'JWT');
            responseMock.locals.data.should.have.property('accessToken');
            responseMock.locals.data.should.have.property('refreshToken');
            responseMock.locals.data.refreshToken.should.be.a.String().and.match(/\.randomId\./);
        });
    });

    describe('## LogInOnCreate', function () {

        it('tokens gerados', async function () {
            let responseMock = getResponseMock();
            responseMock.locals.data = getUserMock();

            let nextObject = await brAccess.logInOnCreate(undefined, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            responseMock.locals.should.have.property('userId', 'randomId');
            responseMock.locals.should.have.property('data');
            responseMock.locals.data.should.have.property('tokenType', 'JWT');
            responseMock.locals.data.should.have.property('accessToken');
            responseMock.locals.data.should.have.property('refreshToken');
            responseMock.locals.data.refreshToken.should.be.a.String().and.match(/\.randomId\./);
        });
    });

    describe('## Refresh Token', function () {
        let requestMock = {
            'body': { 'refreshToken': 'af044be0-fd9c-11e8-9497-0b3f993f11d0.5c058e46a7d6682cf28f667d.ed5728a5-7f1d-4727-8ace-634a3b0f9471' }
        };

        describe('### Usuário não encontrado', function () {
            it('- user', async function () {
                let responseMock = getResponseMock();

                let nextObject = await brAccess.refreshToken(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isAuthDenied', true);
            });

            it('- token', async function () {
                let userMock = getUserMock(true);
                let responseMock = getResponseMock(userMock);

                let nextObject = await brAccess.refreshToken(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isAuthDenied', true);
            });

            it('- token expirado', async function () {
                let userMock = getUserMock();
                let tokenMock = getTokenMock(true);
                let responseMock = getResponseMock(undefined, userMock, tokenMock);

                let nextObject = await brAccess.refreshToken(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isAuthDenied', true);
            });
        });

        it('tokens gerados', async function () {
            let userMock = getUserMock(true);
            let tokenMock = getTokenMock(false);
            let responseMock = getResponseMock(undefined, userMock, tokenMock);

            let nextObject = await brAccess.refreshToken(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            responseMock.locals.should.have.property('statusCode', 200);
            responseMock.locals.should.have.property('message', 'Refresh Token realizado');
            responseMock.locals.should.have.property('userId', 'randomId');
            responseMock.locals.should.have.property('data');
            responseMock.locals.data.should.have.property('tokenType', 'JWT');
            responseMock.locals.data.should.have.property('accessToken');
            responseMock.locals.data.should.have.property('refreshToken');
            responseMock.locals.data.refreshToken.should.be.a.String().and.match(/\.randomId\./);
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(findOneObject, findByIdObject, findOneTokenObject) {
    return testUtil.getBaseResponseMock(
        undefined,
        {
            'user': {
                'findOne': testUtil.getExecObject(findOneObject),
                'findById': testUtil.getLeanObject(findByIdObject)
            },
            'token': {
                'findOne': testUtil.getExecObject(findOneTokenObject)
            }
        });
};

function getUserMock(comparePasswordResult) {
    return {
        '_id': 'randomId',
        'name': 'Jhon Doe',
        'password': 'randomEncodedPwd',
        'comparePassword': function () {
            return comparePasswordResult;
        },
        'toObject': function () {
            return {
                '_id': 'randomId',
                'name': 'Jhon Doe',
                'password': 'randomEncodedPwd'
            };
        }
    };
};

function getTokenMock(isExpiredResult) {
    return {
        'user': 'randomId',
        'isExpired': function () {
            return isExpiredResult;
        }
    };
};
