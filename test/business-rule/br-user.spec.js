// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brUser = require('../../business-rule/br-user');
const util = require('../../helpers/util');

describe('# Regra de negócio do Usuário', function () {

    describe('## Save', function () {
        let requestMock = getRequestMock('body', 'Nome', '81 981818181', 'emailtest@gmail.com');

        it('telefone/email já cadastrados', async function () {
            let responseMock = getResponseMock(1, undefined, undefined, 1);

            let nextObject = await brUser.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(2);
            nextObject.message.should.containDeep(
                [
                    'Telefone já cadastrado',
                    'E-mail já cadastrado'
                ]
            );
        });

        it('estado/cidade incorretos', async function () {
            let responseMock = getResponseMock(0, undefined, undefined, 0);

            let nextObject = await brUser.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Dados inválidos para o campo Estado/Cidade'
                ]
            );
        });

        it('dados OK', async function () {
            let responseMock = getResponseMock(0, undefined, undefined, 1);

            let nextObject = await brUser.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });
    });

    describe('## Update', function () {
        let requestMock = getRequestMock('body', 'Nome', '81 981818181', 'emailtest@gmail.com');
        requestMock['params'] = { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' };

        it('não autorizado', async function () {
            let responseMock = getResponseMock(0, undefined, '1a1a1a1a1a1a2b2b2b2b2b2b');

            let nextObject = await brUser.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('usuário não encontrado', async function () {
            let responseMock = getResponseMock(0, undefined, requestMock.params._id);

            let nextObject = await brUser.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('isNotFound', true);
            nextObject.should.have.property('message', 'Usuário não encontrado');
        });

        it('estado/cidade incorretos', async function () {
            let userRequest = requestMock;
            userRequest.body.state = '1a2b3c4d5e6f1a2b3c4d5e6f';
            userRequest.body.city = 'Random City';

            let responseMock = getResponseMock(0, requestMock.params, requestMock.params._id, 0);

            let nextObject = await brUser.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Dados inválidos para o campo Estado/Cidade'
                ]
            );
        });

        it('dados OK', async function () {
            let userRequest = requestMock;
            userRequest.body.state = '1a2b3c4d5e6f1a2b3c4d5e6f';
            userRequest.body.city = 'Random City';

            let responseMock = getResponseMock(0, requestMock.params, requestMock.params._id, 1);

            let nextObject = await brUser.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });

        describe('### Campos já cadastrados', function () {
            it('telefone/email', async function () {
                let responseMock = getResponseMock(1, requestMock.params, requestMock.params._id, 1);

                let nextObject = await brUser.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                should(nextObject.isNotFound).not.be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(2);
                nextObject.message.should.containDeepOrdered(
                    [
                        'Telefone já cadastrado',
                        'E-mail já cadastrado'
                    ]
                );
            });

            it('somente telefone', async function () {
                let innerRequestMock = { 'body': { 'phone': '81 981818181' }, 'params': requestMock.params };
                let responseMock = getResponseMock(1, requestMock.params, requestMock.params._id, 1);

                let nextObject = await brUser.update(innerRequestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                should(nextObject.isNotFound).not.be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeepOrdered(
                    [
                        'Telefone já cadastrado'
                    ]
                );
            });

            it('somente email', async function () {
                let innerRequestMock = { 'body': { 'email': 'emailtest@gmail.com' }, 'params': requestMock.params };
                let responseMock = getResponseMock(1, requestMock.params, requestMock.params._id, 1);

                let nextObject = await brUser.update(innerRequestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                should(nextObject.isNotFound).not.be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeepOrdered(
                    [
                        'E-mail já cadastrado'
                    ]
                );
            });
        });
    });

    describe('## Remove', function () {
        let requestMock = getRequestMock('body', 'Nome', '81 981818181', 'emailtest@gmail.com');
        requestMock['params'] = { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' };

        it('não autorizado', async function () {
            let responseMock = getResponseMock(0, undefined, '1a1a1a1a1a1a2b2b2b2b2b2b');

            let nextObject = await brUser.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('dados OK', async function () {
            let responseMock = getResponseMock(0, requestMock.params, requestMock.params._id);

            let nextObject = await brUser.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });
    });

    describe('## Search', function () {
        let requestMock = { 'query': { 'name': 'Nome', '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'page': 0, 'limit': 10 } };

        it('nome e paginação', async function () {
            let responseMock = getResponseMock(1);

            let nextObject = await brUser.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('name', /Nome/i);
            requestMock.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });

    describe('## Forgot Password', function () {

        it('usuário não encontrado', async function () {
            let requestMock = { 'body': { 'email': 'randomemail@gmail.com' } };

            let responseMock = getResponseMock();

            let nextObject = await brUser.forgotPwd(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('isNotFound', true);
            nextObject.should.have.property('message', 'Usuário não encontrado');
        });

        it('dados OK', async function () {
            let requestMock = { 'body': { 'email': 'randomemail@gmail.com' } };

            let responseMock = getResponseMock(undefined, undefined, undefined, undefined, { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' });

            let nextObject = await brUser.forgotPwd(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.body.should.have.property('token');
            requestMock.body.should.not.have.property('email');
            requestMock.params.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
        });
    });

    describe('## Restore Password', function () {

        it('usuário não encontrado', async function () {
            let requestMock = { 'body': { 'email': 'randomemail@gmail.com' } };

            let responseMock = getResponseMock();

            let nextObject = await brUser.restorePwd(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('isNotFound', true);
            nextObject.should.have.property('message', 'Usuário não encontrado');
        });

        it('não autorizado', async function () {
            let requestMock = { 'body': { 'email': 'randomemail@gmail.com', 'token': 'AAAAA' } };

            let responseMock = getResponseMock(undefined, undefined, undefined, undefined, { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'token': 'BBBBB' });

            let nextObject = await brUser.restorePwd(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('dados OK', async function () {
            let requestMock = { 'body': { 'email': 'randomemail@gmail.com', 'token': 'AAAAA', 'password': 'someRandomPwd' } };

            let responseMock = getResponseMock(undefined, undefined, undefined, undefined, { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'token': 'AAAAA' });

            let nextObject = await brUser.restorePwd(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.body.should.have.property('password', 'someRandomPwd');
            requestMock.body.should.not.have.properties(['token', 'email']);
            requestMock.params.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getRequestMock(requestParamName, name, phone, email) {
    let mockedObject = {};

    if (name) {
        mockedObject.name = name;
    }

    if (phone) {
        mockedObject.phone = phone;
    }

    if (email) {
        mockedObject.email = email;
    }

    return { [requestParamName]: mockedObject };
};

function getResponseMock(countDocumentAmmount, findByIdObject, loggedUserId, stateCountDocumentAmmount, findOneUser) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'user': {
                    'countDocuments': getExecObject(countDocumentAmmount),
                    'findById': getExecObject(findByIdObject),
                    'findOne': getExecObject(findOneUser)
                },
                'state': {
                    'countDocuments': getExecObject(stateCountDocumentAmmount)
                }
            },
            '_MONGOOSE': {
                'Types': {
                    'ObjectId': function (desiredId) {
                        return desiredId;
                    }
                }
            },
            '_UTIL': util,
            '_USER': {
                '_id': loggedUserId
            }
        }
    };
};

function getExecObject(returnedObject) {
    return function () {
        return {
            exec: function () {
                return returnedObject;
            }
        };
    };
};
