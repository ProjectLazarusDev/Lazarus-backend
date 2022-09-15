if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const { sign } = require('jsonwebtoken')

//TODO: might need a check if it is a valid metamask address?
router.post('/login', async (req, res) => {
    try {
        const resJSON = req.body;
        const accessToken = sign(
            { metamaskAddress: resJSON.metamaskAddress },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '1d' }
        )

        res.cookie('access_token', accessToken, {
            httpOnly: true
        }).status(200).json({
            metamaskAddress: resJSON.metamaskAddress
        })
    }
    catch (err) {
        res.status(500).json(err.message)
    }
});

module.exports = router
