// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brGame = require('../../business-rules/br-game');
const testUtil = require('../test-util');

describe('# Regra de negócio de Jogo', function () {

    describe('## Search', function () {
        let requestMock = { 'query': { 'name': 'Nome', '_id': '1a2b3c4d5e6f1a2b3c4d5e6f', 'page': 0, 'limit': 10 } };

        it('nome e paginação', async function () {
            let responseMock = getResponseMock();

            let nextObject = await brGame.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('name', /Nome/i);
            requestMock.query.should.have.property('_id', requestMock.query._id);
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });

    describe('## Search Remote', function () {
        let requestMock = { 'query': { 'name': 'Nome', 'page': 0, 'limit': 10 } };

        it('IGDB error', async function () {
            let responseMock = getResponseMock(undefined, undefined, { 'statusCode': 404, 'body': 'HTTP 404' });

            let nextObject = await brGame.searchRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('statusCode', 500);
            nextObject.should.have.property('message', 'IGDB 404');
        });

        it('dados ok', async function () {
            let responseMock = getResponseMock(undefined, undefined,
                { 'statusCode': 200, 'body': '[ { "igdbData" : "OK", "first_release_date":1550016000 } ]' });

            let nextObject = await brGame.searchRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            responseMock.locals.should.have.property('statusCode', 200);
            responseMock.locals.should.have.property('data');
            responseMock.locals.data.should.have.property('list').with.lengthOf(1);
            responseMock.locals.data.list.should.containDeep(
                [
                    { 'igdbData': 'OK', 'first_release_date': new Date('2019-02-12 21:00:00.000 -0300'), 'formattedReleaseDate': '13/02/2019' }
                ]
            );
        });
    });

    describe('## Save Remote', function () {
        it('já cadastrado', async function () {
            let requestMock = { 'body': { 'id': 987654321 } };
            let responseMock = getResponseMock({ 'id': 987654321, 'name': 'Jogo 01' });

            let nextObject = await brGame.saveRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.should.have.property('body');
            requestMock.body.should.have.property('id', 987654321);
            requestMock.body.should.have.property('name', 'Jogo 01');
        });

        it('IGDB error', async function () {
            let requestMock = { 'body': { 'id': 987654321 } };
            let responseMock = getResponseMock(undefined, undefined, undefined, { 'statusCode': 403, 'body': 'HTTP 403' });

            let nextObject = await brGame.saveRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('statusCode', 500);
            nextObject.should.have.property('message', 'IGDB 403');
        });

        describe('### IGDB not found', function () {
            it('undefined', async function () {
                let requestMock = { 'body': { 'id': 987654321 } };
                let responseMock = getResponseMock(undefined, undefined, undefined, { 'statusCode': 200 });

                let nextObject = await brGame.saveRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('isNotFound', true);
                nextObject.should.have.property('message', 'Jogo não encontrado');
            });

            it('empty list', async function () {
                let requestMock = { 'body': { 'id': 987654321 } };
                let responseMock = getResponseMock(undefined, undefined, undefined, { 'statusCode': 200, 'body': '[]' });

                let nextObject = await brGame.saveRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('isNotFound', true);
                nextObject.should.have.property('message', 'Jogo não encontrado');
            });
        });

        it('dados OK', async function () {
            let requestMock = { 'body': { 'id': 987654321 } };
            let responseMock = getResponseMock(undefined, '1a2b3c4d5e6f1a2b3c4d5e6f', undefined,
                { 'statusCode': 200, 'body': '[{"first_release_date":1550016000, "id": 987654321}]' });

            let nextObject = await brGame.saveRemote(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.body.should.have.property('id', 987654321);
            requestMock.body.should.have.property('first_release_date', new Date('2019-02-12 21:00:00.000 -0300'));
            requestMock.body.should.have.property('formattedReleaseDate', '13/02/2019');
            requestMock.body.should.have.property('createdBy', '1a2b3c4d5e6f1a2b3c4d5e6f');
        });
    });


});

// --------------------- Funções Locais --------------------- //
function getResponseMock(findOneObject, loggedUserId, listIgdbObject, detailIgdbObject) {
    return testUtil.getBaseResponseMock(
        loggedUserId,
        {
            'game': {
                'findOne': testUtil.getExecObject(findOneObject)
            }
        },
        {
            'list': testUtil.getExecFunction(listIgdbObject),
            'detail': testUtil.getExecFunction(detailIgdbObject)
        }

    );
};
