require('dotenv').config();

// ----------------- Import de dependências ----------------- //
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const helmet = require('helmet')
const cors = require('cors');

// --------------- Import de arquivos do core --------------- //
const errorMapper = require('./helpers/error-mapper');
const authorizer = require('./helpers/authorizer');
const util = require('./helpers/util');
const routes = require('./routes');

const swaggerYaml = require('yamljs').load('./swagger.yaml');

// Conexão com o banco de dados
require('./helpers/datasource');

// Inicialização e configuração do app
const app = express();

app.use(helmet())
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

//Passport Middleware
app.use(passport.initialize());
authorizer.authorize(passport);

//Middleware para definição do Locals
app.all('*', (request, response, next) => {
    response.locals._UTIL = util;
    response.locals._MONGOOSE = mongoose;
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
    response.locals._UTIL.handleRequests(404, response);
});

//Inicialização do APP
app.listen(process.env.PORT, () => {
    console.log(`Servidor inicializado na porta ${process.env.PORT}.`);
});

module.exports = app;