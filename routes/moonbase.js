const express = require('express')
const router = express.Router()
const MoonBase = require('../models/moonbase')

const prefix = 'moonbases';

// get data of every metamask address
router.get('/', async (req, res) => {
    res.render(`${prefix}/index`)
})

router.get('/:new', async (req, res) => {
    //TODO: change to by id
    res.render(`${prefix}/new`, { moonbase: new MoonBase() })
})

// get data based on metamask address as id
router.get('/:id', async (req, res) => {
    //TODO: change to by id
    res.render(`${prefix}/new`)
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

// // New Meta Route
// router.get('/new', (req, res) => {
//     //res.render('metas/new', { meta: new MoonBase() })
// })

module.exports = router