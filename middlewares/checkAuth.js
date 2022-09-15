if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const jwt = require('jsonwebtoken')

// this is to protect our private route /login
const checkAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('No token found')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, metamaskAddress) => {
        if (err) {
            return res.status(403).json('Invalid token!')
        }
        req.user = {
            metamask: metamaskAddress
        }
        next();
    })
}

module.exports = checkAuth