const mongoose = require('mongoose')

const atendimentoSchema = new mongoose.Schema({
  empresa: { type: String, enum: ['EGC', 'GWC', 'SEGINFO'], required: true },
  orgao: { type: String, required: true },
  canal: { type: String, enum: ['email', 'whatsapp'], required: true },
  assunto: { type: String, required: true },
  prioridade: { type: String, enum: ['baixa', 'media', 'alta'], default: 'media' },
  coluna: {
    type: String,
    enum: ['sinalizado', 'encaminhado', 'resolvido'],
    default: 'sinalizado'
  },
  tipo: { type: String, enum: ['ticket', 'ata', 'contrato', ''], default: '' },
  ticketsVinculados: [{ type: String }],
  ataContrato: { type: String, default: '' },
  encaminhadoPara: { type: String, default: '' },
  observacoes: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Atendimento', atendimentoSchema)