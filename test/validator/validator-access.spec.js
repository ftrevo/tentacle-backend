// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validator de Acesso', function () {

    describe('## Login', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let loginValidationFunction = validator('access', 'login', 'body');

            let nextObject = await loginValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(2);
            nextObject.details.should.containDeep([
                { 'message': '"email" is required', 'type': 'any.required' },
                { 'message': '"password" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'email': 'invalidEmail',
                    'password': '1'
                }
            };

            let loginValidationFunction = validator('access', 'login', 'body');

            let nextObject = await loginValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(2);
            nextObject.details.should.containDeep([
                { 'message': '"email" must be a valid email', 'type': 'string.email' },
                { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'name': 'Should be removed',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let loginValidationFunction = validator('access', 'login', 'body');

            let nextObject = await loginValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['email', 'password']);
            request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField', 'name', 'phone']);
        });
    });


    describe('## Refresh Token', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let refreshTokenValidationFunction = validator('access', 'refreshToken', 'body');

            let nextObject = await refreshTokenValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"refreshToken" is required', 'type': 'any.required' }
            ]);
        });

        it('campos inválidos', async function () {
            let request = {
                'body': {
                    'refreshToken': 'invalidToken'
                }
            };

            let refreshTokenValidationFunction = validator('access', 'refreshToken', 'body');

            let nextObject = await refreshTokenValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"refreshToken" with value "invalidToken" fails to match the required pattern: ' +
                        '/^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\\.[0-9A-F]{24}' +
                        '\\.[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i',
                    'type': 'string.regex.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'name': 'Should be removed',
                    'email': 'shouldberemoved@gmail.com',
                    'refreshToken': 'af044be0-fd9c-11e8-9497-0b3f993f11d0.5c058e46a7d6682cf28f667d.ed5728a5-7f1d-4727-8ace-634a3b0f9471'
                }
            };

            let refreshTokenValidationFunction = validator('access', 'refreshToken', 'body');

            let nextObject = await refreshTokenValidationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('refreshToken');
            request.body.should.not.have.any.properties(['name', 'email']);
        });
    });
});