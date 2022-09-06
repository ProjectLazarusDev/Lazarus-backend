if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const { sign } = require('jsonwebtoken')

router.post("/login", async (req, res) => {
    const resJSON = req.body;
    const accessToken = sign(
        { metamaskAddress: resJSON.metamaskAddress },
        process.env.ACCESS_TOKEN_KEY
    )

    res.json(accessToken)

    // const { username, password } = req.body;

    // const user = await Users.findOne({ where: { username: username } });

    // if (!user) res.json({ error: "User Doesn't Exist" });

    // bcrypt.compare(password, user.password).then(async (match) => {
    //   if (!match) res.json({ error: "Wrong Username And Password Combination" });

    //   const accessToken = sign(
    //     { username: user.username, id: user.id },
    //     "importantsecret"
    //   );
    //   res.json({ token: accessToken, username: username, id: user.id });
    // });

});

module.exports = router
