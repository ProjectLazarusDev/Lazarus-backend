const express = require('express')
const router = express.Router()
const MoonBase = require('../models/moonbase')

const prefix = 'moonbases';

// get data of every metamask address
router.get('/', async (req, res) => {
    const moonbases = await MoonBase.find({})
    res.send(moonbases)
})

// get data based on metamask address as id
router.get('/metamask/:id', async (req, res) => {
    const moonbase = await MoonBase.find({ metamaskId: `${req.params.id}`})
    res.send(moonbase)
})

router.get('/:new', async (req, res) => {
    res.render(`${prefix}/new`, { moonbase: new MoonBase() })
})

//TODO: might need a check if there is existing data? first save vs subsequent save
router.post('/', async (req, res) => {
    const moonbase = new MoonBase({
        metamaskId: req.body.name
    })

    try {
        const newMoonbase = await moonbase.save()
        //res.redirect(`${prefix}/${newMoonbase.metamaskId}`);
        res.redirect(`${prefix}/`);
    } catch {
        res.render(`${prefix}/new`, {
            moonbase: moonbase,
            errorMessage: `Error creating MoonBase from ${req.body.name}`
        })
    }
})

module.exports = router