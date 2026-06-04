const mongoose = require('mongoose')

const itemAtaSchema = new mongoose.Schema({
  produto: { type: String, default: '' },
  marcaModelo: { type: String, default: '' },
  quantidade: { type: Number, default: 0 },
  valorUnitario: { type: Number, default: 0 },
  valorTotal: { type: Number, default: 0 },
})

const ataContratoSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  tipo: { type: String, enum: ['ata', 'contrato'], required: true },
  empresa: { type: String, enum: ['EGC', 'GWC', 'SEGINFO'], required: true },
  orgao: { type: String, required: true },
  dataAssinatura: { type: Date, default: null },
  dataVigencia: { type: Date, default: null },
  valor: { type: Number, default: 0 },
  status: { type: String, enum: ['vigente', 'encerrado', 'renovado'], default: 'vigente' },
  itens: [itemAtaSchema],
  observacoes: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('AtaContrato', ataContratoSchema)