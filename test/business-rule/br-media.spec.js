// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brMedia = require('../../business-rule/br-media');
const util = require('../../helpers/util');

describe('# Regra de negócio de Jogo', function () {

    describe('## Save', function () {
        it('mídia já cadastrada', async function () {
            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                }
            };
            let responseMock = getResponseMock(1, undefined, undefined, 1);

            let nextObject = await brMedia.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.owner).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Mídia já cadastrada'
                ]
            );
        });

        it('jogo não encontrado', async function () {
            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                }
            };
            let responseMock = getResponseMock(0, undefined, undefined, 0);

            let nextObject = await brMedia.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.owner).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Jogo não encontrado'
                ]
            );
        });

        it('dados OK', async function () {
            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                }
            };
            let responseMock = getResponseMock(0, undefined, 1, 1);

            let nextObject = await brMedia.save(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.body.should.have.property('owner', responseMock.locals._USER._id);
        });
    });

    describe('## Update', function () {

        it('mídia não encontrada', async function () {
            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                },
                'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }
            };
            let responseMock = getResponseMock(0, undefined, 1, 1);

            let nextObject = await brMedia.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.owner).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('isNotFound', true);
            nextObject.should.have.property('message', 'Mídia não encontrada');
        });

        it('jogo não encontrado', async function () {
            let ownerId = '112233445566778899001122';

            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                },
                'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }
            };
            let responseMock = getResponseMock(0, { '_id': requestMock.params._id, 'owner': ownerId }, ownerId, 0);

            let nextObject = await brMedia.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.owner).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
            nextObject.should.have.property('message').with.lengthOf(1);
            nextObject.message.should.containDeep(
                [
                    'Jogo não encontrado'
                ]
            );
        });

        it('outro dono', async function () {
            let ownerId = '112233445566778899001122';

            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                },
                'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }
            };
            let responseMock = getResponseMock(0, { '_id': requestMock.params._id, 'owner': ownerId }, '123456789012123456789012', 1);

            let nextObject = await brMedia.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isForbidden', true);
        });

        it('dados OK', async function () {
            let ownerId = '112233445566778899001122';

            let requestMock = {
                'body': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4'
                },
                'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }
            };
            let responseMock = getResponseMock(0, { '_id': requestMock.params._id, 'owner': ownerId }, ownerId, 1);

            let nextObject = await brMedia.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
        });

        describe('### Campos já cadastrados', function () {
            it('mídia já cadastrado', async function () {
                let ownerId = '112233445566778899001122';

                let requestMock = {
                    'body': {
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                        'platform': 'PS4'
                    },
                    'params': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                };
                let responseMock = getResponseMock(1, { '_id': requestMock.params._id, 'owner': ownerId }, ownerId, 1);

                let nextObject = await brMedia.update(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                should(requestMock.body.owner).not.be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(1);
                nextObject.message.should.containDeep(
                    [
                        'Mídia já cadastrada'
                    ]
                );
            });
        });
    });

    describe('## Search', function () {

        it('nome e paginação', async function () {
            let requestMock = {
                'query': {
                    'owner': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'page': 0, 'limit': 10
                }
            };

            let responseMock = getResponseMock(1);

            let nextObject = await brMedia.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('platform', /PS4/i);
            requestMock.query.should.have.property('_id', requestMock.query._id);
            requestMock.query.should.have.property('owner', requestMock.query.owner);
            requestMock.query.should.have.property('game', requestMock.query.game);
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        it('substituicao do owner devido ao campo mineOnly', async function () {
            let requestMock = {
                'query': {
                    'owner': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'mineOnly': true,
                    'page': 0, 'limit': 10
                }
            };

            let ownerId = '112233445566778899001122';

            let responseMock = getResponseMock(1, undefined, ownerId);

            let nextObject = await brMedia.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('owner', ownerId);
            requestMock.query.should.not.have.property('mineOnly');
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(countMediaDocAmmount, findByIdObject, loggedUserId, countGameDocAmmount) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'media': {
                    'countDocuments': getExecObject(countMediaDocAmmount),
                    'findById': getExecObject(findByIdObject)
                },
                'game': {
                    'countDocuments': getExecObject(countGameDocAmmount),
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