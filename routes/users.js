if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const MoonBase = require('../models/moonbase')

// Get metamask nonce
router.get('/metamask/nonce', async (req, res) => {

    const resJSON = req.body;
    const moonbase = await MoonBase.find(
        { metamaskAddress: resJSON.metamaskAddress },
        'nonce')
        .exec();

    // check if it is first login
    const nonce = moonbase?.[0]?.nonce;
    //TODO: dbl check if really only creates on very first login
    //should not have a case where metamask exist but not inside but no nonce
    if (nonce === undefined) {
        const newNonce = Math.floor(Math.random() * 1000000);
        MoonBase.updateOne(
            { metamaskAddress: resJSON.metamaskAddress },
            { nonce: newNonce },
            async function (err, docs) {
                if (err) {
                    res.send(err)
                }
                else if (docs.matchedCount === 0) {
                    const newMoonbase = new MoonBase({
                        metamaskAddress: resJSON.metamaskAddress,
                        nonce: newNonce
                    })
                    await newMoonbase.save()
                    res.send({ nonce: newNonce })
                }
                else {
                    res.send("Nothing happened!")
                }
            }
        )
    }
    else {
        res.send({ nonce: nonce })
    }
})

router.post('/login', async (req, res) => {
    try {
        const resJSON = req.body;
        // nonce verification
        const moonbase = await MoonBase.find(
            { metamaskAddress: resJSON.metamaskAddress },
            'nonce')
            .exec();
        if (resJSON.nonce !== moonbase?.[0]?.nonce) {
            res.status(401).send('Invalid credentials')
        }
        else {
            // generate jtw token 
            const payload = {
                metamaskAddress: resJSON.metamaskAddress
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .send(`Welcome, ${resJSON.metamaskAddress}`)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
});

module.exports = router
