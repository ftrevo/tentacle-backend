// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const authorizer = require('../../helpers/authorizer');

describe('# Authorizer', function () {

    describe('## Authorize', function () {
        let jwtPayload = {
            '_id': 'someRandomId'
        };

        describe('### Não autorizado', function () {
            it('- usuário não encontrado', function () {
                let request = { 'res': getResponseMock() };

                authorizer.validateUser(request, jwtPayload, function (error, validatedUser) {
                    should(error).be.ok();
                    should(validatedUser).not.be.ok();
                    error.should.have.property('isAuthDenied', true);
                });
            });

            it('- usuário desatualizado', function () {
                let request = { 'res': getResponseMock(getMockedUser(true)) };

                authorizer.validateUser(request, jwtPayload, function (error, validatedUser) {
                    should(error).be.ok();
                    should(validatedUser).not.be.ok();
                    error.should.have.property('isAuthDenied', true);
                });
            });
        });

        it(' autorizado', function () {
            let request = { 'res': getResponseMock(getMockedUser(false)) };

            authorizer.validateUser(request, jwtPayload, function (error, validatedUser) {
                should(error).not.be.ok();
                should(validatedUser).be.ok();
                validatedUser.should.have.property('_id', 'mockedUserId');
            });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(findByIdObject) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'user': {
                    'findById': getExecObject(findByIdObject)
                }
            }
        }
    };
};

function getExecObject(returnedObject) {
    return function () {
        return {
            exec: function () {
                return returnedObject;
            }
        };
    };
};

function getMockedUser(isUpdatedResponse) {
    return {
        '_id': 'mockedUserId',
        'isUpdated': function () {
            return isUpdatedResponse;
        }
    };
};