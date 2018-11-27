var RNUsuario = require('../regras-negocio/RegraNegocioUsuario');

var sinon = require('sinon');

var Usuario = require('../helpers/Usuario');

describe('Regra de negócio do Usuário', function () {
    var UsuarioMock = sinon.mock(Usuario);

    const requestMock = {
        body: {
            'name': 'nome',
            'phone': '12345',
            'email': 'aaaa@gmail.com'
        }
    };
    const responseMock = {
        status: () => ({
            json: obj => obj
        }),
        locals: {
            '_MODELS': {
                'Usuario': UsuarioMock
            }
        }
    };

    describe('#save', function () {
        it('Nome já cadastrado', function () {
            RNUsuario.save(requestMock, responseMock, function (object) {
                console.log(object);
            });
        });
    });
});