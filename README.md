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
DEFAULT_LOAN_TIME=14 days
```
#### TODO's
* Revisão no arquivo do Swagger, adicionando os filtros faltantes e as descrições
* Alteração na remoção de jogos para possibilitar apenas se não houverem mídias registradas ao jogo
* Alteração na remoção de mídia para possibilitar apenas se não houverem empréstimos registrados
* Refatorar o arquivo de rotas, quebrando mesmo em múltiplos arquivos para melhor legibilidade
* Injetar por default o model de usuário
* Repensar a função genérica de validação para melhor usabilidade
* Revisar os objetos de populate nos repo's para unificação dos mesmos em uma constante no arquivo
* Criar opção de informar a ordenação das listas de maneira dinâmica
