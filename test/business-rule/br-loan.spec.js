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
        it('mídia não encontrada', async function () {
            let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

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
            let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

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
            let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

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
            let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

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
            let requestMock = { 'body': { 'media': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock(
                { 'owner': '1a1a1a1a1a1a2b2b2b2b2b2b', 'game': '9a9a9a9a9a9a8b8b8b8b8b8b', 'platform': 'PS4' },
                undefined,
                '3c3c3c3c3c3c4d4d4d4d4d4d'
            );

            let nextObject = await brLoan.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();

            requestMock.body.should.have.property('media', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.body.should.have.property('requestedBy', '3c3c3c3c3c3c4d4d4d4d4d4d');
            requestMock.body.should.have.property('mediaOwner', '1a1a1a1a1a1a2b2b2b2b2b2b');
            requestMock.body.should.have.property('game', '9a9a9a9a9a9a8b8b8b8b8b8b');
            requestMock.body.should.have.property('mediaPlatform', 'PS4');
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
            requestMock.query.should.have.property('returnDate', { '$exists': false });
            requestMock.query.should.not.have.any.properties(['mineOnly', 'showHistory', 'page', 'limit']);
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });


        it('substituição do owner devido ao campo mineOnly', async function () {
            let requestMock = {
                'query': {
                    'requestedBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'mineOnly': true,
                    'page': 0, 'limit': 10
                }
            };

            let responseMock = getResponseMock(undefined, undefined, '112233445566778899001122');

            let nextObject = await brLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('requestedBy', '112233445566778899001122');
            requestMock.query.should.have.property('returnDate', { '$exists': false });
            requestMock.query.should.not.have.any.properties(['mineOnly', 'showHistory', 'page', 'limit']);
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        it('showHistory', async function () {
            let requestMock = {
                'query': {
                    'showHistory': true,
                    'page': 0, 'limit': 10
                }
            };

            let responseMock = getResponseMock(undefined, undefined, '112233445566778899001122');

            let nextObject = await brLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('returnDate', { '$exists': true });
            requestMock.query.should.not.have.any.properties(['mineOnly', 'showHistory', 'page', 'limit']);
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        describe('### mediaPlatform', function () {
            it('apenas uma', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS3',
                        'page': 0, 'limit': 10
                    }
                };

                let responseMock = getResponseMock(undefined, undefined, '112233445566778899001122');

                let nextObject = await brLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('returnDate', { '$exists': false });
                requestMock.query.should.have.property('mediaPlatform', { '$in': ['PS3'] });
                requestMock.query.should.not.have.any.properties(['mineOnly', 'showHistory', 'page', 'limit']);
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('múltiplas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS3,PS4',
                        'page': 0, 'limit': 10
                    }
                };

                let responseMock = getResponseMock(undefined, undefined, '112233445566778899001122');

                let nextObject = await brLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('returnDate', { '$exists': false });
                requestMock.query.should.have.property('mediaPlatform', { '$in': ['PS3', 'PS4'] });
                requestMock.query.should.not.have.any.properties(['mineOnly', 'showHistory', 'page', 'limit']);
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });
        });

    });

    describe('## Remember Delivery', function () {

        it('não encontrado', async function () {
            let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock();

            let nextObject = await brLoan.rememberDelivery(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep([
                'Empréstimo não encontrado'
            ]);
        });

        it('não autorizado', async function () {
            let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock(undefined, undefined, '111111111111aaaaaaaaaaaa', { 'mediaOwner': '222222222222bbbbbbbbbbbb' });

            let nextObject = await brLoan.rememberDelivery(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('dados ok', async function () {
            let requestMock = { 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };

            let responseMock = getResponseMock(undefined, undefined, '111111111111aaaaaaaaaaaa', { 'mediaOwner': '111111111111aaaaaaaaaaaa' });

            let nextObject = await brLoan.rememberDelivery(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            responseMock.locals.should.have.property('data', { 'mediaOwner': '111111111111aaaaaaaaaaaa' });
            responseMock.locals.should.have.property('statusCode', 200);
            responseMock.locals.should.have.property('message', 'E-mail enviado com sucesso');
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
                    'findById': getPopulateObject(findByIdLoanObject)
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

function getPopulateObject(returnedObject) {
    return function () {
        return {
            'populate': function () {
                return {
                    'exec': execFunction(returnedObject)
                };
            },
            'exec': execFunction(returnedObject)
        };
    };
};

function getExecObject(returnedObject) {
    return function () {
        return {
            'exec': execFunction(returnedObject)
        };
    };
};

function execFunction(returnedObject) {
    return function () {
        return returnedObject;
    };
}
