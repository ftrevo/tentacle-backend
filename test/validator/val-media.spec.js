// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('# Validador de Mídia de Jogos', function () {

    describe('## Create', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('media', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(2);
            nextObject.details.should.containDeep([
                { 'message': '"platform" is required', 'type': 'any.required' },
                { 'message': '"game" is required', 'type': 'any.required' }
            ]);
        });

        it('dados inválidos', async function () {
            let request = {
                'body': {
                    'platform': 'invalidPlatform',
                    'game': 'invalidGame'
                }
            };

            let validationFunction = validator('media', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(2);
            nextObject.details.should.containDeep([
                {
                    'message': '"game" with value "invalidGame" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"platform" must be one of [PS4, PS3, XBOXONE, XBOX360, NINTENDOSWITCH, NINTENDO3DS]',
                    'type': 'any.allowOnly'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'platform': 'PS4',
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'owner': 'Should be removed',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('media', 'create', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.properties(['platform']);
            request.body.should.not.have.any.properties(['_id', 'owner', 'randomField', 'createdBy', 'updatedBy']);
        });

        describe('### Campo Plataforma', function () {

            it('- PS4', async function () {
                let request = {
                    'body': {
                        'platform': 'PS4',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'PS4');
                request.body.should.have.property('game', '1a2b3c4d5e6f1a2b3c4d5e6f');
            });

            it('- PS3', async function () {
                let request = {
                    'body': {
                        'platform': 'PS3',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'PS3');
            });

            it('- XBOXONE', async function () {
                let request = {
                    'body': {
                        'platform': 'XBOXONE',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'XBOXONE');
            });

            it('- XBOX360', async function () {
                let request = {
                    'body': {
                        'platform': 'XBOX360',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'XBOX360');
            });

            it('- NINTENDOSWITCH', async function () {
                let request = {
                    'body': {
                        'platform': 'NINTENDOSWITCH',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'NINTENDOSWITCH');
            });

            it('- NINTENDO3DS', async function () {
                let request = {
                    'body': {
                        'platform': 'NINTENDO3DS',
                        'game': '1a2b3c4d5e6f1a2b3c4d5e6f'
                    }
                };

                let validationFunction = validator('media', 'create', 'body');

                let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                request.body.should.have.property('platform', 'NINTENDO3DS');
            });
        });
    });

    describe('## Id', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'params': {}
            };

            let validationFunction = validator('media', 'id', 'params');

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

            let validationFunction = validator('media', 'id', 'params');

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

            let validationFunction = validator('media', 'id', 'params');

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
                    'owner': 'invalidOwner',
                    'platform': 'invalidPlatform',
                    'mineOnly': 'invalidMineOnly',
                    'game': 'invalidGame',
                    'active': 'invalidActive',
                    'page': 'invalidPage',
                    'limit': 999
                }
            };

            let validationFunction = validator('media', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(8);
            nextObject.details.should.containDeep([
                {
                    'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                    'type': 'string.regex.base'
                },
                {
                    'message': '"owner" with value "invalidOwner" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
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
                    'message': '"mineOnly" must be a boolean',
                    'type': 'boolean.base'
                },
                {
                    'message': '"active" must be a boolean',
                    'type': 'boolean.base'
                },
                {
                    'message': '"page" must be a number',
                    'type': 'number.base'
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
                    'owner': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'game': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'platform': 'PS4',
                    'mineOnly': true,
                    'active': false,
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('media', 'search', 'query');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.query.should.have.properties(['_id', 'owner', 'platform', 'game', 'page', 'limit', 'mineOnly', 'active']);
            request.query.limit.should.be.eql(10);
            request.query.page.should.be.eql(0);
            request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField']);
        });
    });

    describe('## Update', function () {

        it('campos obrigatórios', async function () {
            let request = {
                'body': {}
            };

            let validationFunction = validator('media', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                { 'message': '"active" is required', 'type': 'any.required' }
            ]);
        });

        it('dados inválidos', async function () {
            let request = {
                'body': {
                    'active': 'invalidActive'
                }
            };

            let validationFunction = validator('media', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).be.ok();
            nextObject.should.have.property('isJoi', true);
            nextObject.should.have.property('details').with.lengthOf(1);
            nextObject.details.should.containDeep([
                {
                    'message': '"active" must be a boolean',
                    'type': 'boolean.base'
                }
            ]);
        });

        it('limpeza de campos e dados OK', async function () {
            let request = {
                'body': {
                    'active': true,
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let validationFunction = validator('media', 'update', 'body');

            let nextObject = await validationFunction(request, null, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            request.body.should.have.property('active', true);
            request.body.should.not.have.any.properties(['_id', 'randomField', 'createdBy', 'updatedBy']);
        });

    });
});
