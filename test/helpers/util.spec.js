// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const util = require('../../helpers/util');

describe('# Util', function () {

    describe('## Resolve Pagination', function () {
        it('gerar paginação e limpar campos', function () {
            let params = { 'page': 0, 'limit': 10 };

            let paginationObject = util.resolvePagination(params);

            should(paginationObject).be.ok();
            paginationObject.should.have.property('skip', 0);
            paginationObject.should.have.property('max', 10);
            params.should.not.have.property('page');
            params.should.not.have.property('limit');
        });
    });

    describe('## Clear Object', function () {
        it('limpar campos', function () {
            let params = { 'a': 'av', 'b': 'bv', 'c': { 'd': 'dv', 'e': { 'f': 'fv' } } };

            util.clearObject(params, ['b', 'c.d', 'c.e.f']);

            should(params).be.ok();
            params.should.containDeep({ 'a': 'av', 'c': { 'e': {} } });
            params.should.not.have.property('b');
            params.c.should.not.have.property('d');
        });
    });

    describe('## Transform Object to Query', function () {
        it('criar query criando campos string com regex', function () {
            let params = {
                'stringQuery': 'a',
                'numberInStringQuery': '1',
                'objectIdQuery': '5c1e6114453ece297e16a6b7',
                'dateQuery': '2018-12-22T16:52:57.486Z',
                'numberQuery': 1
            };

            let transformedQuery = util.transformObjectToQuery(params);

            should(transformedQuery).be.ok();
            transformedQuery.should.have.property('dateQuery', params.dateQuery);
            transformedQuery.should.have.property('numberQuery', params.numberQuery);
            transformedQuery.should.have.property('objectIdQuery', params.objectIdQuery);
            transformedQuery.should.have.property('stringQuery', /a/i);
            transformedQuery.should.have.property('numberInStringQuery', /1/i);
        });
    });

    describe('## Set Locals Data', function () {
        it('todos campos', function () {
            let response = { 'locals': {} };

            util.setLocalsData(
                response,
                200,
                { someRandomData: 'Dados' },
                'Mensagem'
            );

            should(response).be.ok();
            should(response.locals).be.ok();
            response.locals.should.have.property('statusCode', 200);
            response.locals.should.have.property('message', 'Mensagem');
            response.locals.should.have.property('data', { someRandomData: 'Dados' });
        });

        it('sem data', function () {
            let response = { 'locals': {} };

            util.setLocalsData(
                response,
                200,
                undefined,
                'Mensagem'
            );

            should(response).be.ok();
            should(response.locals).be.ok();
            response.locals.should.have.property('statusCode', 200);
            response.locals.should.have.property('message', 'Mensagem');
            response.locals.should.not.have.property('data');
        });

        it('sem message', function () {
            let response = { 'locals': {} };

            util.setLocalsData(
                response,
                200,
                { someRandomData: 'Dados' }
            );

            should(response).be.ok();
            should(response.locals).be.ok();
            response.locals.should.have.property('statusCode', 200);
            response.locals.should.have.property('data', { someRandomData: 'Dados' });
            response.locals.should.not.have.property('message', 'Mensagem');
        });
    });

    describe('## Media Platform Description', function () {

        it('PS3 ', function () {
            let platformDescription = util.getMediaPlatformDescription('PS3');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('PS3');
        });

        it('PS4 ', function () {
            let platformDescription = util.getMediaPlatformDescription('PS4');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('PS4');
        });

        it('XBOXONE ', function () {
            let platformDescription = util.getMediaPlatformDescription('XBOXONE');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('XONE');
        });

        it('XBO360 ', function () {
            let platformDescription = util.getMediaPlatformDescription('XBOX360');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('X360');
        });

        it('NINTENDO3DS ', function () {
            let platformDescription = util.getMediaPlatformDescription('NINTENDO3DS');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('3DS');
        });

        it('NINTENDOSWITCH ', function () {
            let platformDescription = util.getMediaPlatformDescription('NINTENDOSWITCH');

            should(platformDescription).be.ok();
            (platformDescription).should.be.eql('SWITCH');
        });
    });

});
