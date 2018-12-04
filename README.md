# Backend POC-MIDDLEWARE-PATTERN

Poc para estudo da pattern middleware.

### Scripts criados
* npm start - Instala as dependências e inicializa o projeto.
* npm test- Instala as dependências, executa os testes e gera os dados de code coverage.

### Variáveis de ambiente
Variáveis de ambiente para desenvolvimento. (Podem ser criadas em um arquivo na raiz chamado .env)
```
DB_URL=mongodb://localhost:27017/poc-middleware-pattern
PORT=3000
LOGGER_LEVEL=silly
MONGOOSE_DEBUG=true
```
#### TODO's
* Fazer os testes dos métodos do br-user e do validator user que faltaram
* Adicionar dados que faltam dos endpoints do SWAGGER
* Implementar autenticação
* Criar endpoint de detalhamento de usuário logado
