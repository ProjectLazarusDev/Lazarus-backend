const express = require('express')
const router = express.Router()
const Meta = require('../models/meta')

// All Meta Route
router.get('/', (req, res) => {
    res.render('metas/index')
})

// New Meta Route
router.get('/new', (req, res) => {
    res.render('metas/new', { meta: new Meta() })
})

// Create Meta Route
router.post('/', (req, res) => {
    res.send('Create')
})

module.exports = router