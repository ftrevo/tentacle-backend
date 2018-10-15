// ----------------- Import de dependências ----------------- //
const database = require('mongoose');

database.Promise = global.Promise;
database.set('debug', true);

database.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true });

database.connection.on('connected', () => {
    console.log('Conectado ao banco de dados ' + process.env.DB_URL);
});

database.connection.on('error', (errorConnectingToDatabase) => {
    console.log('Erro ao conectar ao banco de dados');
    throw (errorConnectingToDatabase);
});

module.exports = database;