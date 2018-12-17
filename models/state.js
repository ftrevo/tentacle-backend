// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema de Estado - Cidade
const StateSchema = new mongoose.Schema({
  initials: {
    type: String
  },
  name: {
    type: String
  },
  cities: [{
    type: String
  }]
}, { versionKey: false, timestamps: false });

module.exports = mongoose.model('State', StateSchema);
