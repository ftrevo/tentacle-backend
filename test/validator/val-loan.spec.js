// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Empréstimo', function () {

    describe('## Create', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let createValidatorFunction = validator('loan', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"media" is required', 'type': 'any.required' }
            ]);
        });

        it('dados inválidos', async function () {
            let request = {
                'body': {
                    'media': 'invalidMedia'
                }
            };

            let createValidatorFunction = validator('loan', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"media" with value "invalidMedia" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'media': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'requestedAt': 'Should be removed',
                    'mediaOwner': 'Should be removed',
                    '_id': 'Should be removed'
                }
            };

            let createValidatorFunction = validator('loan', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('media', '1a2b3c4d5e6f1a2b3c4d5e6f');
            request.body.should.not.have.any.properties(['_id', 'requestedAt', 'mediaOwner']);
        });
    });

    describe('## Id', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let idValidatorFunction = validator('loan', 'id', 'params');

            let nextObject = await idValidatorFunction(request, null, nextFunction = nextObject => nextObject);

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

            let idValidatorFunction = validator('loan', 'id', 'params');

            let nextObject = await idValidatorFunction(request, null, nextFunction = nextObject => nextObject);

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
                    'media': 'Mídia',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let idValidatorFunction = validator('loan', 'id', 'params');

            let nextObject = await idValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.params.should.have.properties(['media', '_id']);
        });
    });

    describe('## Search', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'media': 'invalidMedia',
                    'requestedBy': 'invalidRequestedBy',
                    'mediaOwner': 'invalidMediaOwner',
                    'game': 'invalidGame',
                    'limit': 999
                }
            };

            let searchValidatorFunction = validator('loan', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(6);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"media" with value "invalidMedia" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"requestedBy" with value "invalidRequestedBy" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"mediaOwner" with value "invalidMediaOwner" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"game" with value "invalidGame" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"limit" must be less than or equal to 100',
                    'type': 'number.max'
                }
            ]);
        });

        it('limpeza, inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'requestedBy': '1a1a1a1a1a1a2b2b2b2b2b2b',
                    'media': '2b2b2b2b2b2b3c3c3c3c3c3c',
                    'mediaOwner': '3c3c3c3c3c3c4d4d4d4d4d4d',
                    'game': '4d4d4d4d4d4d5e5e5e5e5e5e',
                    'estimatedReturnDate': 'Should be removed',
                    'loanDate': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };
            let searchValidatorFunction = validator('loan', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.property('_id', '1a2b3c4d5e6f1a2b3c4d5e6f');
            request.query.should.have.property('requestedBy', '1a1a1a1a1a1a2b2b2b2b2b2b');
            request.query.should.have.property('media', '2b2b2b2b2b2b3c3c3c3c3c3c');
            request.query.should.have.property('mediaOwner', '3c3c3c3c3c3c4d4d4d4d4d4d');
            request.query.should.have.property('game', '4d4d4d4d4d4d5e5e5e5e5e5e');
            request.query.should.have.property('limit', 10);
            request.query.should.have.property('page', 0);
            request.query.should.not.have.any.properties(['estimatedReturnDate', 'loanDate', 'randomField']);
        });
    });

    describe('## Update', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let updateValidatorFunction = validator('loan', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"action" is required', 'type': 'any.required' }
            ]);
        });

        it('campo inválido', async function () {
            let request = {
                'body': {
                    'action': 'invalidAction'
                }
            };

            let updateValidatorFunction = validator('loan', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"action" must be one of [LEND, RETURN]',
                    'type': 'any.allowOnly'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'action': 'LEND',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let updateValidatorFunction = validator('loan', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('action', 'LEND');
            request.body.should.not.have.property('_id');
        });
    });
});
