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

            let validationFunction = validator('user', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

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

            let validationFunction = validator('user', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

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

            let validationFunction = validator('user', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

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

            let validationFunction = validator('user', 'id', 'params');

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

            let validationFunction = validator('user', 'id', 'params');

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
                    'name': 'Jhon Doe',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let validationFunction = validator('user', 'id', 'params');

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
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'state': 'invalidState',
                    'limit': 999
                }
            };

            let validationFunction = validator('user', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(5);
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

            let validationFunction = validator('user', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'name', 'email', 'phone', 'state', 'city', 'page', 'limit']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField', 'password']);
        });
    });

    describe('## Update', function () {

        it('ao menos um campo opcional é obrigatório', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('user', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"value" must contain at least one of [name, email, phone, password, state, city]', 'type': 'object.missing' }
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

            let validationFunction = validator('user', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

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

            let validationFunction = validator('user', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['name', 'email', 'phone', 'password', 'state', 'city']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Forgot Password', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('user', 'forgotPwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"email" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'email': 'invalidEmail'
                }
            };

            let validationFunction = validator('user', 'forgotPwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"email" must be a valid email', 'type': 'string.email' }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'email': 'validemail@gmail.com',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('user', 'forgotPwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('email', 'validemail@gmail.com');
            request.body.should.not.have.any.properties(['_id', 'randomField']);
        });
    });

    describe('## Restore Password', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('user', 'restorePwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(3);
            nextObject.details.should.containDeep([
                { 'message': '"email" is required', 'type': 'any.required' },
                { 'message': '"token" is required', 'type': 'any.required' },
                { 'message': '"password" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'email': 'invalidEmail',
                    'token': 'invalidToken',
                    'password': '123'
                }
            };

            let validationFunction = validator('user', 'restorePwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(3);
            nextObject.details.should.containDeep([
                { 'message': '"email" must be a valid email', 'type': 'string.email' },
                { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' },
                {
                    'message': '"token" with value "invalidToken" fails to match the required pattern: /^[0-9A-Z]{5}$/',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'email': 'validemail@gmail.com',
                    'password': '123456',
                    'token': 'ABCDE',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('user', 'restorePwd', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('email', 'validemail@gmail.com');
            request.body.should.have.property('password', '123456');
            request.body.should.have.property('token', 'ABCDE');
            request.body.should.not.have.any.properties(['_id', 'randomField']);
        });
    });
});
