const express = require('express')
const router = express.Router()
const Orgao = require('../models/Orgao')
const Empenho = require('../models/Empenho')

router.get('/', async (req, res) => {
  try {
    const orgaos = await Orgao.find().sort({ nome: 1 })
    res.json(orgaos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const orgao = await Orgao.findById(req.params.id)
    const empenhos = await Empenho.find({ orgao: orgao.nome }).sort({ createdAt: -1 })
    res.json({ ...orgao.toObject(), empenhos })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const orgao = new Orgao(req.body)
    await orgao.save()
    res.status(201).json(orgao)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const orgao = await Orgao.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(orgao)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Orgao.findByIdAndDelete(req.params.id)
    res.json({ message: 'Órgão deletado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router