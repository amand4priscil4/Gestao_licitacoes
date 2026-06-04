const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const empenhoRoutes      = require('./routes/empenhos')
const orgaoRoutes        = require('./routes/orgaos')
const atendimentoRoutes  = require('./routes/atendimentos')
const produtoRoutes      = require('./routes/produtos')
const marcaRoutes        = require('./routes/marcas')
const ataContratoRoutes  = require('./routes/atascontratos')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gestao-licitacoes.vercel.app',
    'https://gestao-licitacoes-ten.vercel.app'
  ]
}))
app.use(express.json())

app.use('/api/empenhos',     empenhoRoutes)
app.use('/api/orgaos',       orgaoRoutes)
app.use('/api/atendimentos', atendimentoRoutes)
app.use('/api/produtos',     produtoRoutes)
app.use('/api/marcas',       marcaRoutes)
app.use('/api/atascontratos',ataContratoRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando!' })
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado!')
    app.listen(process.env.PORT || 3001, () => {
      console.log(`✅ Servidor rodando na porta ${process.env.PORT || 3001}`)
    })
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message)
  })