// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const util = require('../../helpers/util');

describe('Util', function () {

    describe('#ResolvePagination', function () {
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

    describe('#CelarObject', function () {
        it('limpar campos', function () {
            let params = { 'a': 'av', 'b': 'bv', 'c': { 'd': 'dv', 'e': { 'f': 'fv' } } };

            util.clearObject(params, ['b', 'c.d', 'c.e.f']);

            should(params).be.ok();
            params.should.containDeep({ 'a': 'av', 'c': { 'e': {} } });
            params.should.not.have.property('b');
            params.c.should.not.have.property('d');
        });
    });

});