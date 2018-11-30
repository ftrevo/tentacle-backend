const should = require('should');

const brUser = require('../business-rule/br-user');

describe('Regra de negócio do Usuário', function () {

    describe('#save', function () {

        it('Nome/Telefone/Email já cadastrados', function () {
            let requestMock = getRequestMock('Nome', '81 981818181', 'emailtest@gmail.com');
            let mockCount = getcountDocumentsMock(1);
            let responseMock = getResponseMock(mockCount);

            brUser.save(requestMock, responseMock, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isBusiness', true);
                nextObject.should.have.property('message').with.lengthOf(3);
                nextObject.message.should.containDeepOrdered(
                    [
                        'Nome já cadastrado.',
                        'Telefone já cadastrado.',
                        'E-mail já cadastrado.'
                    ]
                );
            });
        });

        it('Dados OK', function () {
            let requestMock = getRequestMock('Nome', '81 981818181', 'emailtest@gmail.com');
            let mockCount = getcountDocumentsMock(0);
            let responseMock = getResponseMock(mockCount);

            brUser.save(requestMock, responseMock, function (nextObject) {
                should(nextObject).not.be.ok();
            });
        });
    });
});

// --------------------- Funções Locais --------------------- //
function getRequestMock(name, phone, email) {
    return {
        body: {
            'name': name,
            'phone': phone,
            'email': email
        }
    };
};

function getResponseMock(mockCountDocuments) {
    return {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'Usuario': {
                    'countDocuments': mockCountDocuments
                }
            }
        }
    };
};

function getcountDocumentsMock(desiredMockCount) {
    return function () {
        return {
            exec: function () {
                return desiredMockCount;
            }
        };
    };
};