const express = require('express')
const router = express.Router()
const AtaContrato = require('../models/AtaContrato')

router.get('/', async (req, res) => {
  try {
    const atas = await AtaContrato.find().sort({ createdAt: -1 })
    res.json(atas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const ata = new AtaContrato(req.body)
    await ata.save()
    res.status(201).json(ata)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const ata = await AtaContrato.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(ata)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await AtaContrato.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deletado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router