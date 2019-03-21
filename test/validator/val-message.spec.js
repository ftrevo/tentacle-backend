// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Mensagens de notificação', function () {

    describe('## Create', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {
                    'action': 'action name',
                    'detail': 'detail info',
                    'recipient': '1221wfsdfet',
                    'title': 'title info'
                }
            };
            let validationFunction = validator('message', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            request.body.should.have.properties(['action', 'detail', 'recipient', 'title']);
        });

    });

    describe('## Search de Mensagens de notificação', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    'recipient': 'invalid',
                    'limit': 999
                }
            };

            let validationFunction = validator('message', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"limit" must be less than or equal to 100',
                    'type': 'number.max'
                }
            ]);

        });

        it('campo obrigatório', async function () {
            let request = {
                'query': {
                    'recipient': '5c8aabf4ef98bc11ac7bb540',
                    'limit': 10
                }
            };

            let validationFunction = validator('message', 'search', 'query');
            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);

        });
    });
});