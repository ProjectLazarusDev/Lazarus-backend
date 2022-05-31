const express = require('express')
const router = express.Router()
const Meta = require('../models/meta')
const syncReadFile = require('../utils/fileReader')

// if no id or fileid specified will return unrevealed data
router.get('/', (req, res) => {
    // parse the data as json
    const data = JSON.parse(syncReadFile('./public/meta/unrevealed.json'));
    res.send(data);
})

router.get('/:id/:fileId', (req, res) => {
    // parse the data as json
    const data = JSON.parse(syncReadFile(`./public/meta/${req.params.id}/${req.params.fileId}.json`));
    res.send(data);
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