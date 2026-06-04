const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  item: { type: String, default: '' },
  produto: { type: String, default: '' },
  quantidade: { type: Number, default: 1 },
  valorUnitario: { type: Number, default: 0 },
  valorTotal: { type: Number, default: 0 },
  marcaModelo: { type: String, default: '' },
})

const reforcoSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  observacao: { type: String, default: '' },
})

const empenhoSchema = new mongoose.Schema({
  ticket: { type: String, required: true, unique: true },
  orgao: { type: String, required: true },
  empresa: { type: String, enum: ['EGC', 'GWC', 'SEGINFO'], required: true },
  empenho: { type: String, default: '' },
  uasg: { type: String, default: '' },
  pregao: { type: String, default: '' },
  dataRecebimento: { type: Date, default: null },
  dataLimite: { type: Date, default: null },
  dataSolicitacao: { type: Date, default: null },
  descricao: { type: String, default: '' },
  itens: [itemSchema],
  valor: { type: Number, default: 0 },
  modulo: {
    type: String,
    enum: ['empenhos', 'solicitacoes', 'faturados'],
    default: 'empenhos'
  },
  colunaEmpenho: {
    type: String,
    enum: ['recebido', 'listado', 'faturamento'],
    default: 'recebido'
  },
  colunasolicitacao: {
    type: String,
    enum: ['enviada', 'aceita', 'negada', 'cancelada'],
    default: 'enviada'
  },
  tipoSolicitacao: {
    type: String,
    enum: ['dispensa', 'tmm', 'reequilibrio', ''],
    default: ''
  },
  itensSolicitados: [{ type: Number }],
  marcaAtual: { type: String, default: '' },
  marcaSubstituta: { type: String, default: '' },
  marcaAntiga: { type: String, default: '' },
  marcaNova: { type: String, default: '' },
  reforcos: [reforcoSchema],
  historico: [{
    data: { type: Date, default: Date.now },
    tipo: { type: String },
    descricao: { type: String }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Empenho', empenhoSchema)