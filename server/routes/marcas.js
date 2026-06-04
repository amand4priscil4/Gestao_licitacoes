const express = require('express')
const router = express.Router()
const Marca = require('../models/Marca')

router.get('/', async (req, res) => {
  try {
    const marcas = await Marca.find().sort({ marca: 1 })
    res.json(marcas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const marca = new Marca(req.body)
    await marca.save()
    res.status(201).json(marca)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const marca = await Marca.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(marca)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Marca.findByIdAndDelete(req.params.id)
    res.json({ message: 'Marca deletada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router