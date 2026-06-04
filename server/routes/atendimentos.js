const express = require('express')
const router = express.Router()
const Atendimento = require('../models/Atendimento')

router.get('/', async (req, res) => {
  try {
    const atendimentos = await Atendimento.find().sort({ createdAt: -1 })
    res.json(atendimentos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const atendimento = new Atendimento(req.body)
    await atendimento.save()
    res.status(201).json(atendimento)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const atendimento = await Atendimento.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(atendimento)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Atendimento.findByIdAndDelete(req.params.id)
    res.json({ message: 'Atendimento deletado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router