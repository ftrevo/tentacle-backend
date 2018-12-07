// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brUser = require('../../business-rule/br-user');
const util = require('../../helpers/util');

describe('Regra de negócio do Usuário', function () {

    describe('#Save', function () {
        let requestMock = getRequestMock('body', 'Nome', '81 981818181', 'emailtest@gmail.com');

        it('nome/telefone/email já cadastrados', function () {
            let responseMock = getResponseMock(1);

            brUser.save(requestMock, responseMock, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(3);
                nextObject.message.should.containDeep(
                    [
                        'Nome já cadastrado',
                        'Telefone já cadastrado',
                        'E-mail já cadastrado'
                    ]
                );
            });
        });

        it('dados OK', function () {
            let responseMock = getResponseMock(0);

            brUser.save(requestMock, responseMock, function (nextObject) {
                should(nextObject).not.be.ok();
            });
        });
    });

    describe('#Update', function () {
        let requestMock = getRequestMock('body', 'Nome', '81 981818181', 'emailtest@gmail.com');
        requestMock['params'] = { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' };

        it('usuário não encontrado', function () {
            let responseMock = getResponseMock(0, undefined);

            brUser.update(requestMock, responseMock, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('isNotFound', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Usuário não encontrado',
                    ]
                );
            });
        });

        it('dados OK', function () {
            let responseMock = getResponseMock(0, requestMock.params);

            brUser.update(requestMock, responseMock, function (nextObject) {
                should(nextObject).not.be.ok();
            });
        });

        describe('#Campos já cadastrados', function () {
            it('nome/telefone/email', function () {
                let responseMock = getResponseMock(1, requestMock.params);

                brUser.update(requestMock, responseMock, function (nextObject) {
                    should(nextObject).be.ok();
                    should(nextObject.isNotFound).not.be.ok();
                    nextObject.should.have.property('isBusiness', true);
                    nextObject.should.have.property('message').with.lengthOf(3);
                    nextObject.message.should.containDeepOrdered(
                        [
                            'Nome já cadastrado',
                            'Telefone já cadastrado',
                            'E-mail já cadastrado'
                        ]
                    );
                });
            });

            it('somente nome', function () {
                let innerRequestMock = { 'body': { 'name': 'Nome' }, 'params': requestMock.params };
                let responseMock = getResponseMock(1, requestMock.params);

                brUser.update(innerRequestMock, responseMock, function (nextObject) {
                    should(nextObject).be.ok();
                    should(nextObject.isNotFound).not.be.ok();
                    nextObject.should.have.property('isBusiness', true);
                    nextObject.should.have.property('message').with.lengthOf(1);
                    nextObject.message.should.containDeepOrdered(
                        [
                            'Nome já cadastrado'
                        ]
                    );
                });
            });

            it('somente telefone', function () {
                let innerRequestMock = { 'body': { 'phone': '81 981818181' }, 'params': requestMock.params };
                let responseMock = getResponseMock(1, requestMock.params);

                brUser.update(innerRequestMock, responseMock, function (nextObject) {
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
            });

            it('somente email', function () {
                let innerRequestMock = { 'body': { 'email': 'emailtest@gmail.com' }, 'params': requestMock.params };
                let responseMock = getResponseMock(1, requestMock.params);

                brUser.update(innerRequestMock, responseMock, function (nextObject) {
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
    });

    describe('#Search', function () {
        let requestMock = { 'query': { 'name': 'Nome', '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'page': 0, 'limit': 10 } };

        it('nome e paginação', function () {
            let responseMock = getResponseMock(1);

            brUser.search(requestMock, responseMock, function (nextObject) {
                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('name', /Nome/i);
                requestMock.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.containDeep({ 'pagination': { 'skip': 0, 'max': 10 } });
            });
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

function getResponseMock(countDocumentAmmount, findByIdObject) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'user': {
                    'countDocuments': getExecObject(countDocumentAmmount),
                    'findById': getExecObject(findByIdObject)
                }
            },
            '_MONGOOSE': {
                'Types': {
                    'ObjectId': function (desiredId) {
                        return desiredId;
                    }
                }
            },
            '_UTIL': util
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