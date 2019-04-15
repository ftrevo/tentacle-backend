// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Jogos', function () {

    describe('## Id', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let validationFunction = validator('game', 'id', 'params');

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

            let validationFunction = validator('game', 'id', 'params');

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
                    'name': 'Nome',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let validationFunction = validator('game', 'id', 'params');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.params.should.have.properties(['name', '_id']);
        });
    });

    describe('## Search', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'createdBy': 'invalidCreatedBy',
                    'updatedBy': 'invalidUpdatedBy',
                    'limit': 999
                }
            };

            let validationFunction = validator('game', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(4);
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
                    'createdBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'updatedBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'name': 'name',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('game', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'name', 'createdBy', 'updatedBy', 'page', 'limit']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Search Remote', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    'name': 'name',
                    'limit': 999
                }
            };

            let validationFunction = validator('game', 'searchRemote', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"limit" must be less than or equal to 50',
                    'type': 'number.max'
                }
            ]);
        });

        it('campos obrigatórios', async function () {
            let request = {
                'query': {}
            };

            let validationFunction = validator('game', 'searchRemote', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"name" is required', 'type': 'any.required' }
            ]);
        });

        it('limpeza, inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    'name': 'name',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('game', 'searchRemote', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['name', 'page', 'limit']);
            request.query.limit.should.be.eql(25);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.property('randomField');
        });
    });

    describe('## Create Remote', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('game', 'createRemote', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"id" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'id': 'invalidId'
                }
            };

            let validationFunction = validator('game', 'createRemote', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"id" must be a number',
                    'type': 'number.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'id': 987654321,
                    'createdBy': 'Should be removed',
                    '_id': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('game', 'createRemote', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('id', 987654321);
            request.body.should.not.have.any.properties(['_id', 'randomField', 'createdBy']);
        });
    });
});
