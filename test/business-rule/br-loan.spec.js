// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brLoan = require('../../business-rule/br-loan');
const util = require('../../helpers/util');

describe('# Regra de negócio de Empréstimo', function () {

    before(function () {
        process.env.DEFAULT_LOAN_TIME = '14 days';
    });

    after(function () {
        delete process.env.DEFAULT_LOAN_TIME;
    });

    describe('## Save', function () {
        let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

        it('mídia não encontrada', async function () {
            let responseMock = getResponseMock();

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Mídia não encontrada'
                ]
            );
        });

        it('mesmo dono', async function () {
            let responseMock = getResponseMock({ 'owner': '1a1a1a1a1a1a2b2b2b2b2b2b' }, undefined, '1a1a1a1a1a1a2b2b2b2b2b2b');

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Você não pode pegar emprestado sua própria mídia'
                ]
            );
        });

        it('já cadastrado', async function () {
            let responseMock = getResponseMock(
                { 'owner': '1a1a1a1a1a1a2b2b2b2b2b2b' },
                { 'requestedBy': '2b2b2b2b2b2b3c3c3c3c3c3c' },
                '2b2b2b2b2b2b3c3c3c3c3c3c'
            );

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Empréstimo já cadastrado'
                ]
            );
        });

        it('mídia emprestada para outra pessoa', async function () {
            let responseMock = getResponseMock(
                { 'owner': '1a1a1a1a1a1a2b2b2b2b2b2b' },
                { 'requestedBy': '2b2b2b2b2b2b3c3c3c3c3c3c' },
                '3c3c3c3c3c3c4d4d4d4d4d4d'
            );

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Mídia encontra-se emprestada no momento'
                ]
            );
        });

        it('dados OK', async function () {
            let responseMock = getResponseMock({ 'owner': '1a1a1a1a1a1a2b2b2b2b2b2b' }, undefined, '3c3c3c3c3c3c4d4d4d4d4d4d');

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });
    });

    describe('## Update', function () {

        it('mídia não encontrada', async function () {
            let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock();

            let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Empréstimo não encontrado'
                ]
            );
        });

        it('não autorizado', async function () {
            let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock(undefined, undefined, '1a1a1a1a1a1a2b2b2b2b2b2b', { 'mediaOwner': '2b2b2b2b2b2b3c3c3c3c3c3c' });

            let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        describe('### Lend', function () {

            it('já emprestado', async function () {
                let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }, 'body': { 'action': 'LEND' } };

                let responseMock = getResponseMock(
                    undefined,
                    undefined,
                    '2b2b2b2b2b2b3c3c3c3c3c3c',
                    { 'mediaOwner': '2b2b2b2b2b2b3c3c3c3c3c3c', 'loanDate': Date.now() }
                );

                let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Empréstimo já realizado'
                    ]
                );
            });

            it('dados OK', async function () {
                let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }, 'body': { 'action': 'LEND' } };

                let responseMock = getResponseMock(undefined, undefined, '3c3c3c3c3c3c4d4d4d4d4d4d', { 'mediaOwner': '3c3c3c3c3c3c4d4d4d4d4d4d' });

                let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                should(requestMock.body).be.ok();
                requestMock.body.should.have.property('loanDate').which.is.a.Number();
                requestMock.body.should.have.property('estimatedReturnDate').which.is.a.Date();
                requestMock.body.should.not.have.property('returnDate');
            });

        });

        describe('### Return', function () {

            it('não realizado', async function () {
                let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }, 'body': { 'action': 'RETURN' } };

                let responseMock = getResponseMock(
                    undefined,
                    undefined,
                    '2b2b2b2b2b2b3c3c3c3c3c3c',
                    { 'mediaOwner': '2b2b2b2b2b2b3c3c3c3c3c3c' }
                );

                let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Empréstimo não realizado'
                    ]
                );
            });

            it('já devolvido', async function () {
                let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }, 'body': { 'action': 'RETURN' } };

                let responseMock = getResponseMock(
                    undefined,
                    undefined,
                    '2b2b2b2b2b2b3c3c3c3c3c3c',
                    { 'mediaOwner': '2b2b2b2b2b2b3c3c3c3c3c3c', 'loanDate': Date.now(), 'returnDate': Date.now() }
                );

                let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Devolução já realizada'
                    ]
                );
            });

            it('dados OK', async function () {
                let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }, 'body': { 'action': 'RETURN' } };

                let responseMock = getResponseMock(undefined, undefined, '3c3c3c3c3c3c4d4d4d4d4d4d',
                    { 'mediaOwner': '3c3c3c3c3c3c4d4d4d4d4d4d', 'loanDate': Date.now() });

                let nextObject = await brLoan.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                should(requestMock.body).be.ok();
                requestMock.body.should.have.property('returnDate').which.is.a.Number();
                requestMock.body.should.not.have.property('loanDate');
                requestMock.body.should.not.have.property('estimatedReturnDate');
            });

        });
    });

    describe('## Remove', function () {
        let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

        it('empréstimo não encontrado', async function () {
            let responseMock = getResponseMock();

            let nextObject = await brLoan.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Empréstimo não encontrado'
                ]
            );
        });

        it('outro dono', async function () {
            let responseMock = getResponseMock(undefined, undefined, '1a1a1a1a1a1a2b2b2b2b2b2b', { 'requestedBy': '3c3c3c3c3c3c4d4d4d4d4d4d' });

            let nextObject = await brLoan.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('já efetivado', async function () {
            let responseMock = getResponseMock(
                undefined,
                undefined,
                '2b2b2b2b2b2b3c3c3c3c3c3c',
                { 'requestedBy': '2b2b2b2b2b2b3c3c3c3c3c3c', 'loanDate': Date.now() }
            );

            let nextObject = await brLoan.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Empréstimo já efetivado'
                ]
            );
        });

        it('dados OK', async function () {
            let responseMock = getResponseMock(undefined, undefined, '2b2b2b2b2b2b3c3c3c3c3c3c', { 'requestedBy': '2b2b2b2b2b2b3c3c3c3c3c3c' });

            let nextObject = await brLoan.remove(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });
    });

    describe('## Search', function () {

        it('dados básicos e paginação', async function () {

            let requestMock = {
                'query': {
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'requestedBy': '1a1a1a1a1a1a2b2b2b2b2b2b',
                    'media': '2b2b2b2b2b2b3c3c3c3c3c3c',
                    'mediaOwner': '3c3c3c3c3c3c4d4d4d4d4d4d',
                    'game': '4d4d4d4d4d4d5e5e5e5e5e5e',
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = getResponseMock();

            let nextObject = await brLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.query.should.have.property('requestedBy', '1a1a1a1a1a1a2b2b2b2b2b2b');
            requestMock.query.should.have.property('media', '2b2b2b2b2b2b3c3c3c3c3c3c');
            requestMock.query.should.have.property('mediaOwner', '3c3c3c3c3c3c4d4d4d4d4d4d');
            requestMock.query.should.have.property('game', '4d4d4d4d4d4d5e5e5e5e5e5e');
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(findByIdMediaObject, findOneLoanObject, loggedUserId, findByIdLoanObject) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'media': {
                    'findById': getExecObject(findByIdMediaObject)
                },
                'loan': {
                    'findOne': getExecObject(findOneLoanObject),
                    'findById': getExecObject(findByIdLoanObject)
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
