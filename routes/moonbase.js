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
router.get('/:id', async (req, res) => {
    const moonbase = await MoonBase.find({ metamaskAddress: `${req.params.id}` })
    res.send(moonbase)
})

// create if data doesn't exist, and update if it does
router.put('/', async (req, res) => {
    const resJSON = req.body;

    // try update first
    const updateRes = MoonBase.updateOne(
        { metamaskAddress: resJSON.metamaskAddress },
        { data: resJSON.data },
        function (err, docs) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(docs)
            }
        }
    )

    // create if is first time saving
    if (updateRes.matchedCount === 0) {
        const moonbase = new MoonBase({
            metamaskAddress: resJSON.metamaskAddress,
            data: resJSON.data
        })

        try {
            const newMoonbase = await moonbase.save()
            res.send(newMoonbase)
        } catch {
            res.render(`${prefix}/new`, {
                moonbase: moonbase,
                errorMessage: `Error creating MoonBase from ${resJson}`
            })
        }
    }
})

module.exports = router