// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brMediaLoan = require('../../business-rules/br-media-loan');
const testUtil = require('../test-util');

describe('# Regra de negócio de Mídia/Empréstimo', function () {

    describe('## Search', function () {

        it('nome e paginação', async function () {
            let requestMock = {
                'query': {
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'page': 0, 'limit': 10
                }
            };

            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await brMediaLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('platform', /PS4/i);
            requestMock.query.should.have.property('_id', requestMock.query._id);
            requestMock.query.should.have.property('owner', requestMock.query.owner);
            requestMock.query.should.have.property('game', requestMock.query.game);
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        it('substituição do owner ', async function () {
            let requestMock = {
                'query': {
                    'owner': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'page': 0, 'limit': 10
                }
            };

            let ownerId = '112233445566778899001122';

            let responseMock = testUtil.getBaseResponseMock(ownerId);

            let nextObject = await brMediaLoan.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('owner', ownerId);
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });
    });
});

