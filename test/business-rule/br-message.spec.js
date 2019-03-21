// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brAccess = require('../../business-rules/br-message');
const testUtil = require('../test-util');

describe('# Regra para Mensagem', function () {

    describe('## Search', function () {
        it('nome e paginação', async function () {
            let requestMock = {
                'query': {
                    'recipient': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let responseMock = getResponseMock(1, undefined, undefined, 1);

            let nextObject = await brMedia.seach(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            should(requestMock.body.owner).not.be.ok();
            nextObject.should.have.property('isBusiness', true);
        });

    });
});