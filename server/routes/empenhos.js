const express = require('express')
const router = express.Router()
const Empenho = require('../models/Empenho')

router.get('/', async (req, res) => {
  try {
    const empenhos = await Empenho.find().sort({ createdAt: -1 })
    res.json(empenhos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const empenho = new Empenho(req.body)
    await empenho.save()
    res.status(201).json(empenho)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const empenho = await Empenho.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(empenho)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Empenho.findByIdAndDelete(req.params.id)
    res.json({ message: 'Empenho deletado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router