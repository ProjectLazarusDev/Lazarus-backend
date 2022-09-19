const express = require('express')
const router = express.Router()
const MoonBase = require('../models/moonbase')
const checkAuth = require('../middlewares/checkAuth.js')

const prefix = 'moonbases';

// get data of every metamask address
router.get('/', async (req, res) => {
    const moonbases = await MoonBase.find({})
    res.send(moonbases)
})

// get data based on metamask address as id
router.get('/:id', async (req, res) => {
    const moonbase = await MoonBase.find({ metamaskAddress: `${req.params.id}` })

    const result = {
        metamaskAddress: moonbase?.[0]?.metamaskAddress,
        data: moonbase?.[0]?.data
    }

    res.send(result)
})

// create if data doesn't exist, and update if it does
router.put('/', checkAuth, async (req, res) => {
    const resJSON = req.body;

    // try update first
    const updateRes = MoonBase.updateOne(
        { metamaskAddress: resJSON.metamaskAddress.toLowerCase() },
        { data: resJSON.data },
        async function (err, docs) {
            if (err) {
                res.send(err)
            }
            // create if is first time saving
            else if (docs.matchedCount === 0) {
                const moonbase = new MoonBase({
                    metamaskAddress: resJSON.metamaskAddress.toLowerCase(),
                    data: resJSON.data
                })

                try {
                    const newMoonbase = await moonbase.save()
                    res.send(newMoonbase)
                } catch {
                    res.status(400).send(`Bad request creating MoonBase!`)
                }
            }
            else {
                res.send(docs)
            }
        }
    )
})

module.exports = router