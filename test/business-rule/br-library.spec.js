// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brLibrary = require('../../business-rules/br-library');
const util = require('../../helpers/util');

describe('# Regra de negócio de Biblioteca', function () {

    describe('## Search', function () {

        it('id, nome e paginação', async function () {
            let requestMock = {
                'query': {
                    'name': 'Nome',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = getResponseMock();

            let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('name', /Nome/i);
            requestMock.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        describe('### Mídia', function () {

            it('uma única plataforma', async function () {
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
                requestMock.query.should.have.property('$or').with.lengthOf(1);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(2);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$ne': [] } },
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

        });
    });

    describe('## Search Home', function () {

        it('paginação', async function () {
            let requestMock = {
                'query': {
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = getResponseMock();

            let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        describe('### Mídia', function () {

            it('uma única plataforma', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(1);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock();

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(2);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$ne': [] } },
                    { 'mediaPs4': { '$ne': [] } }
                ]);
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
