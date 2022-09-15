if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

//TODO: might need a check if it is a valid metamask address?
router.post('/login', async (req, res) => {
    try {
        const resJSON = req.body;
        const payload = {
            metamaskAddress: resJSON.metamaskAddress
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.cookie('access_token', token, {
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
