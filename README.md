# Backend Projeto Tentacle

Backend do projeto Tentacle

### Scripts criados
* npm start - Instala as dependências e inicializa o projeto.
* npm test- Instala as dependências, executa os testes e gera os dados de code coverage.

### Variáveis de ambiente
Variáveis de ambiente para desenvolvimento. (Podem ser criadas em um arquivo na raiz chamado .env)
```
DB_URL=mongodb://localhost:27017/tentacle
PORT=3000
LOGGER_LEVEL=silly
MONGOOSE_DEBUG=true
APP_SECRET=some-random-secret-from-this-project
TOKEN_EXP_TIME=1 hrs
REFRESH_EXP_TIME=2 hrs
```
#### TODO's
* CRUD de "jogos"
* Fluxos de negócio de empréstimo
