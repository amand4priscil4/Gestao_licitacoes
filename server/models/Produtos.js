const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
}, { timestamps: true })

module.exports = mongoose.model('Produto', produtoSchema)