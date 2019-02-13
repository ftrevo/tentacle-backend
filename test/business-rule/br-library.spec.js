// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brLibrary = require('../../business-rule/br-library');
const util = require('../../helpers/util');

describe('# Regra de negócio de Biblioteca', function () {

    describe('## Search', function () {

        it('id, título, criado por e paginação', async function () {
            let requestMock = {
                'query': {
                    'name': 'Nome',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = getResponseMock();

            let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('name', /Nome/i);
            requestMock.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.query.should.have.property('createdBy', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        describe('### Mídia', function () {
            it('owner', async function () {
                let requestMock = {
                    'query': {
                        'mediaOwner': '6f5e4d3c2b1a6f5e4d3c2b1a',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(6);;
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaPs4': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaXbox360': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaXboxOne': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaNintendo3ds': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaNintendoSwitch': { '$elemMatch': { 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('id', async function () {
                let requestMock = {
                    'query': {
                        'mediaId': '1a2b3c4d5e6f1a2b3c4d5e6f',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(6);;
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } },
                    { 'mediaPs4': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } },
                    { 'mediaXbox360': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } },
                    { 'mediaXboxOne': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } },
                    { 'mediaNintendo3ds': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } },
                    { 'mediaNintendoSwitch': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f' } } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('owner e id', async function () {
                let requestMock = {
                    'query': {
                        'mediaId': '1a2b3c4d5e6f1a2b3c4d5e6f',
                        'mediaOwner': '6f5e4d3c2b1a6f5e4d3c2b1a',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(6);;
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaPs4': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaXbox360': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaXboxOne': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaNintendo3ds': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } },
                    { 'mediaNintendoSwitch': { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('platform', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('mediaPs4', { '$ne': [] });
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('platform, owner e id', async function () {
                let requestMock = {
                    'query': {
                        'mediaId': '1a2b3c4d5e6f1a2b3c4d5e6f',
                        'mediaOwner': '6f5e4d3c2b1a6f5e4d3c2b1a',
                        'mediaPlatform': 'PS4',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('mediaPs4', { '$elemMatch': { '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'owner': '6f5e4d3c2b1a6f5e4d3c2b1a' } });
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock() {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_UTIL': util
        }
    };
};
