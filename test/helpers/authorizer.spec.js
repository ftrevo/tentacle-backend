// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const authorizer = require('../../helpers/authorizer');
const testUtil = require('../test-util');

describe('# Authorizer', function () {

    describe('## Authorize', function () {
        let jwtPayload = {
            '_id': 'someRandomId'
        };

        describe('### Não autorizado', function () {
            it('- usuário não encontrado', async function () {
                let request = { 'res': getResponseMock() };

                let doneObject = await authorizer.validateUser(request, jwtPayload, doneFunction);

                should(doneObject.error).be.ok();
                should(doneObject.validatedUser).not.be.ok();
                doneObject.error.should.have.property('isAuthDenied', true);
            });

            it('- usuário desatualizado', async function () {
                let request = { 'res': getResponseMock(getMockedUser(true)) };

                let doneObject = await authorizer.validateUser(request, jwtPayload, doneFunction);

                should(doneObject.error).be.ok();
                should(doneObject.validatedUser).not.be.ok();
                doneObject.error.should.have.property('isAuthDenied', true);
            });
        });

        it(' autorizado', async function () {
            let request = { 'res': getResponseMock(getMockedUser(false)) };

            let doneObject = await authorizer.validateUser(request, jwtPayload, doneFunction);

            should(doneObject.error).not.be.ok();
            should(doneObject.validatedUser).be.ok();
            doneObject.validatedUser.should.have.property('_id', 'mockedUserId');
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(findByIdObject) {
    return testUtil.getBaseResponseMock(
        undefined,
        {
            'user': {
                'findById': testUtil.getExecObject(findByIdObject)
            }
        }
    );
};

function getMockedUser(isUpdatedResponse) {
    return {
        '_id': 'mockedUserId',
        'isUpdated': function () {
            return isUpdatedResponse;
        }
    };
};

function doneFunction(error, validatedUser) {
    return {
        'error': error,
        'validatedUser': validatedUser
    };
};

