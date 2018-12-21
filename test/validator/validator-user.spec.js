// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador do Usuário', function () {

    describe('## Create', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(6);
            nextObject.details.should.containDeep([
                { 'message': '"name" is required', 'type': 'any.required' },
                { 'message': '"email" is required', 'type': 'any.required' },
                { 'message': '"phone" is required', 'type': 'any.required' },
                { 'message': '"password" is required', 'type': 'any.required' },
                { 'message': '"state" is required', 'type': 'any.required' },
                { 'message': '"city" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'password': '1',
                    'state': 'invalidState',
                    'city': 'city'
                }
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(4);
            nextObject.details.should.containDeep([
                { 'message': '"email" must be a valid email', 'type': 'string.email' },
                {
                    'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                    'type': 'string.regex.base'
                },
                { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' },
                {
                    'message': '"state" with value "invalidState" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    'state': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'city': 'city',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            let nextObject = await createValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['name', 'email', 'phone', 'password', 'state', 'city']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Id', function () {
        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let idValidatorFunction = validator('user', 'id', 'params');

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

            let idValidatorFunction = validator('user', 'id', 'params');

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
                    'name': 'Jhon Doe',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let idValidatorFunction = validator('user', 'id', 'params');

            let nextObject = await idValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.params.should.have.properties(['name', '_id']);
        });
    });

    describe('## Search', function () {
        it('campos inválidos', async function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'state': 'invalidState'
                }
            };

            let searchValidatorFunction = validator('user', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(4);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                { 'message': '"email" must be a valid email', 'type': 'string.email' },
                {
                    'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"state" with value "invalidState" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza e inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    'state': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'city': 'city',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let searchValidatorFunction = validator('user', 'search', 'query');

            let nextObject = await searchValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'name', 'email', 'phone', 'state', 'city', 'page', 'limit']);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField', 'password']);
        });
    });

    describe('## Update', function () {

        it('ao menos um campo opcional é obrigatório', async function () {
            let request = {
                'body': {}
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"value" must contain at least one of [name, email, phone, password, state, city]', 'type': "object.missing" }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'password': '1',
                    'state': 'invalidState'
                }
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(4);
            nextObject.details.should.containDeep([
                { 'message': '"email" must be a valid email', 'type': 'string.email' },
                {
                    'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                    'type': 'string.regex.base'
                },
                { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' },
                {
                    'message': '"state" with value "invalidState" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    'state': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'city': 'city',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            let nextObject = await updateValidatorFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['name', 'email', 'phone', 'password', 'state', 'city']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField']);
        });
    });
});