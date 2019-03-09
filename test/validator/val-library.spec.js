// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Biblioteca de jogos', function () {

    describe('## Id', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let validationFunction = validator('library', 'id', 'params');

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

            let validationFunction = validator('library', 'id', 'params');

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

            let validationFunction = validator('library', 'id', 'params');

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
                    'mediaId': 'invalidMediaId',
                    'mediaOwner': 'invalidMediaOwner',
                    'limit': 999
                }
            };

            let validationFunction = validator('library', 'search', 'query');

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
                    'message': '"createdBy" with value "invalidCreatedBy" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"mediaId" with value "invalidMediaId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"mediaOwner" with value "invalidMediaOwner" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"limit" must be less than or equal to 100',
                    'type': 'number.max'
                }
            ]);
        });

        describe('### Plataforma', function () {
            it('parâmetro como string com , no final', async function () {
                let request = {
                    'query': {
                        'mediaPlatform': 'PS4,'
                    }
                };

                let validationFunction = validator('library', 'search', 'query');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    {
                        'message': '"mediaPlatform" with value "PS4," fails to match the required pattern: '
                            + '/^(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS)(,(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS))*$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });

            it('array com parâmetro inválido', async function () {
                let request = {
                    'query': {
                        'mediaPlatform': 'PS4,invalidPlatformString'
                    }
                };

                let validationFunction = validator('library', 'search', 'query');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    {
                        'message': '"mediaPlatform" with value "PS4,invalidPlatformString" fails to match the required pattern: '
                            + '/^(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS)(,(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS))*$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });

        });

        it('limpeza e inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdBy': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'mediaId': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'mediaOwner': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'mediaPlatform': 'PS4,PS3',
                    'name': 'name',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('library', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'createdBy', 'mediaId', 'mediaOwner', 'mediaPlatform', 'name', 'page', 'limit']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Search Home', function () {

        it('campos inválidos', async function () {
            let request = {
                'query': {
                    'limit': 999
                }
            };

            let validationFunction = validator('library', 'searchHome', 'query');

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

        describe('### Plataforma', function () {
            it('parâmetro como string com , no final', async function () {
                let request = {
                    'query': {
                        'mediaPlatform': 'PS4,'
                    }
                };

                let validationFunction = validator('library', 'searchHome', 'query');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    {
                        'message': '"mediaPlatform" with value "PS4," fails to match the required pattern: '
                            + '/^(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS)(,(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS))*$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });

            it('array com parâmetro inválido', async function () {
                let request = {
                    'query': {
                        'mediaPlatform': 'PS4,invalidPlatformString'
                    }
                };

                let validationFunction = validator('library', 'searchHome', 'query');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    {
                        'message': '"mediaPlatform" with value "PS4,invalidPlatformString" fails to match the required pattern: '
                            + '/^(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS)(,(PS4|PS3|XBOXONE|XBOX360|NINTENDOSWITCH|NINTENDO3DS))*$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });

        });

        it('limpeza e inserção de campos e dados OK', async function () {
            let request = {
                'query': {
                    'mediaPlatform': 'PS4,PS3',
                    'createdAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('library', 'searchHome', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['mediaPlatform', 'page', 'limit']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'randomField']);
        });
    });
});
