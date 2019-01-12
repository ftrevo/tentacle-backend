// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brGame = require('../../business-rule/br-game');
const util = require('../../helpers/util');

describe('# Regra de negócio de Jogo', function () {

    describe('## Save', function () {
        it('título já cadastrado', async function () {
            let requestMock = { 'body': { 'title': 'Título do jogo' } };
            let responseMock = getResponseMock(1);

            let nextObject = await brGame.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.createdBy).not.be.ok();
            should(requestMock.body.updatedBy).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Jogo já cadastrado'
                ]
            );
        });

        it('dados OK', async function () {
            let requestMock = { 'body': { 'title': 'Título do jogo' } };
            let responseMock = getResponseMock(0, undefined, 1);

            let nextObject = await brGame.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            should(requestMock.body.updatedBy).not.be.ok();
            requestMock.body.should.have.property('createdBy', responseMock.locals._USER._id);
        });
    });

    describe('## Update', function () {

        it('jogo não encontrado', async function () {
            let requestMock = { 'body': { 'title': 'Título do jogo' }, 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };
            let responseMock = getResponseMock(0, undefined, 1);

            let nextObject = await brGame.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.createdBy).not.be.ok();
            should(requestMock.body.updatedBy).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('isNotFound', true);
            nextObject.should.have.property('message', 'Jogo não encontrado');
        });

        it('dados OK', async function () {
            let requestMock = { 'body': { 'title': 'Título do jogo' }, 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };
            let responseMock = getResponseMock(0, requestMock.params, 1);

            let nextObject = await brGame.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            should(requestMock.body.createdBy).not.be.ok();
            requestMock.body.should.have.property('updatedBy', responseMock.locals._USER._id);
        });

        describe('### Campos já cadastrados', function () {
            it('título já cadastrado', async function () {
                let requestMock = { 'body': { 'title': 'Título do jogo' }, 'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } };
                let responseMock = getResponseMock(1, requestMock.params, 1);

                let nextObject = await brGame.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                should(requestMock.body.createdBy).not.be.ok();
                should(requestMock.body.updatedBy).not.be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Jogo já cadastrado'
                    ]
                );
            });
        });
    });

    describe('## Search', function () {
        let requestMock = { 'query': { 'title': 'Título', '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'page': 0, 'limit': 10 } };

        it('nome e paginação', async function () {
            let responseMock = getResponseMock(1);

            let nextObject = await brGame.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('title', /Título/i);
            requestMock.query.should.have.property('_id', requestMock.query._id);
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(countDocumentAmmount, findByIdObject, loggedUserId) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'game': {
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