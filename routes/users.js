if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const ethers = require('ethers')

const MoonBase = require('../models/moonbase')


// Get metamask nonce
router.get('/metamask/nonce', async (req, res) => {
    //https://stackoverflow.com/questions/30915424/express-what-is-the-difference-between-req-query-and-req-body
    const resJSON = req.query; //req.body

    if (resJSON.metamaskAddress === undefined) {
        res.status(500).send("Undefined!")
    }
    else if (ethers.utils.isAddress(resJSON.metamaskAddress) === false) {
        res.status(400).send("Invalid metamask address!")
    }
    else {
        const moonbase = await MoonBase.find(
            { metamaskAddress: resJSON.metamaskAddress.toLowerCase() },
            'nonce')
            .exec();

        // check if it is first login
        const nonce = moonbase?.[0]?.nonce;
        //TODO: dbl check if really only creates on very first login
        //should not have a case where metamask exist but not inside but no nonce

        // try update first if a metamask address exists but has no nonce
        if (nonce === undefined) {
            const newNonce = Math.floor(Math.random() * 1000000);
            MoonBase.updateOne(
                { metamaskAddress: resJSON.metamaskAddress.toLowerCase() },
                { nonce: newNonce },
                async function (err, docs) {
                    if (err) {
                        res.send(err)
                    }
                    // fallback to adding address and nonce as a new entry
                    else if (docs.matchedCount === 0) {
                        const newMoonbase = new MoonBase({
                            metamaskAddress: resJSON.metamaskAddress.toLowerCase(),
                            nonce: newNonce
                        })
                        await newMoonbase.save()
                        // https://stackoverflow.com/questions/59990864/what-is-the-difference-between-samesite-lax-and-samesite-strict
                        res.cookie('nonce', newNonce,
                            { httpOnly: true, sameSite: 'none', secure: true })
                            .status(200)
                            .send(`nonce`)
                    }
                    else {
                        res.status(400).send("Nothing happened!")
                    }
                }
            )
        }
        else {
            res.cookie('nonce', nonce,
                { httpOnly: true, sameSite: 'none', secure: true })
                .status(200)
                .send(`nonce`)
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const resJSON = req.body;
        // nonce verification
        const moonbase = await MoonBase.find(
            { metamaskAddress: resJSON.metamaskAddress.toLowerCase() },
            'nonce')
            .exec();
        if (parseInt(req.cookies.nonce) !== moonbase?.[0]?.nonce) {
            res.status(401).send('Invalid credentials')
        }
        else {
            // generate jtw token 
            const payload = {
                metamaskAddress: resJSON.metamaskAddress.toLowerCase()
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
            res.cookie('access_token', token,
                { httpOnly: true, sameSite: 'none', secure: true })
                .status(200)
                .send(`Welcome, ${resJSON.metamaskAddress.toLowerCase()}`)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
});

module.exports = router
