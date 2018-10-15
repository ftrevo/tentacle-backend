require('dotenv').config();

// ----------------- Import de dependências ----------------- //
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const express = require('express');
const YAML = require('yamljs');
const cors = require('cors');

// --------------- Import de arquivos do core --------------- //
const errorMapper = require('./helpers/errorMapper');
const Util = require('./helpers/util');
const routes = require('./routes');

// Inicialização e configuração do app
const swaggerYaml = YAML.load('./swagger.yaml');

// Conexão com o banco de dados
require('./helpers/datasource');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

//Middleware para definição do Locals
app.all('*', (request, response, next) => {
    response.locals._UTIL = Util;
    next();
});

//Definição de rotas
routes(app);

//Definição do middeware de erros
app.use(errorMapper);

//Definição do Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerYaml));

// Not Found Middleware
app.use((request, response, next) => {
    response.locals._UTIL.handleRequests(404, { 'message': 'Not Found.' }, response);
});

//Inicialização do APP
app.listen(process.env.PORT, () => {
    console.log(`Servidor inicializado na porta ${process.env.PORT}.`);
});

module.exports = app;