const mongoose = require('mongoose')

const marcaSchema = new mongoose.Schema({
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  marca: { type: String, required: true },
  modelo: { type: String, default: '' },
  ativa: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Marca', marcaSchema)