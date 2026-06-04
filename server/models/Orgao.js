const mongoose = require('mongoose')

const orgaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  municipio: { type: String, default: '' },
  estado: { type: String, default: '' },
  uasg: { type: String, default: '' },
  emails: [{ type: String }],
  telefones: [{ type: String }],
  observacoes: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Orgao', orgaoSchema)