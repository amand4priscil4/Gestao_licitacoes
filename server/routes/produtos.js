const express = require('express')
const router = express.Router()
const Produto = require('../models/Produtos')

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ nome: 1 })
    res.json(produtos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const produto = new Produto(req.body)
    await produto.save()
    res.status(201).json(produto)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(produto)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id)
    res.json({ message: 'Produto deletado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router