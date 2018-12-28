// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Jogos', function () {

    describe('## Create', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let createValidatorFunction = validator('game', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"title" is required', 'type': 'any.required' }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'title': 'Título',
                    'createdBy': 'Should be removed',
                    'updatedBy': 'Should be removed',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let createValidatorFunction = validator('game', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['title']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField', 'createdBy', 'updatedBy']);
        });
    });

    describe('## Id', function () {
        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let idValidatorFunction = validator('game', 'id', 'params');

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

            let idValidatorFunction = validator('game', 'id', 'params');

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
                    'title': 'Título',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let idValidatorFunction = validator('game', 'id', 'params');

            let nextObject = await idValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.params.should.have.properties(['title', '_id']);
        });
    });

    describe('## Search', function () {
        it('campos inválidos', async function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'createdBy': 'invalidCreatedBy',
                    'updatedBy': 'invalidUpdatedBy'
                }
            };

            let searchValidatorFunction = validator('game', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(3);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"createdBy" with value "invalidCreatedBy" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"updatedBy" with value "invalidUpdatedBy" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza e inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'updatedBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'title': 'tile',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let searchValidatorFunction = validator('game', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'title', 'createdBy', 'updatedBy', 'page', 'limit']);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Update', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let createValidatorFunction = validator('game', 'update', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"value" must contain at least one of [title]', 'type': 'object.missing' }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'title': 'Título',
                    'createdBy': 'Should be removed',
                    'updatedBy': 'Should be removed',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let updateValidatorFunction = validator('game', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['title']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField', 'createdBy', 'updatedBy']);
        });
    });
});