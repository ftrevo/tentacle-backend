// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Mídia/Empréstimo de Jogos', function () {

    describe('## Id', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let validationFunction = validator('mediaLoan', 'id', 'params');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"_id" is required', 'type': 'any.required' }
            ]);
        });

        it('campo inválido', async function () {
            let request = {
                'params': {
                    '_id': 'invalidId'
                }
            };

            let validationFunction = validator('mediaLoan', 'id', 'params');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'params': {
                    'platform': 'PS4',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let validationFunction = validator('mediaLoan', 'id', 'params');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.params.should.have.properties(['platform', 'game', '_id']);
        });
    });

    describe('## Search', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'platform': 'invalidPlatform',
                    'game': 'invalidGame',
                    'active': 'invalidActive',
                    'limit': 999
                }
            };

            let validationFunction = validator('mediaLoan', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(5);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"platform" must be one of [PS4, PS3, XBOXONE, XBOX360, NINTENDOSWITCH, NINTENDO3DS]',
                    'type': 'any.allowOnly'
                },
                {
                    'message': '"game" with value "invalidGame" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"active" must be a boolean',
                    'type': 'boolean.base'
                },
                {
                    'message': '"limit" must be less than or equal to 100',
                    'type': 'number.max'
                }
            ]);
        });

        it('limpeza e inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4',
                    'active': true,
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('mediaLoan', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'platform', 'game', 'active', 'page', 'limit']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField']);
        });
    });
});
