const router = require('express').Router()
const cryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// Register
router.post("/register", async (req, res) => {
    if (req.body.username && req.body.password && req.body.email) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        })
        
        try {
            const saved = await newUser.save()
            res.status(201).json({
                "process": "register",
                "status": "success",
                "detail" : saved
            })
        }
        catch (err) {
            res.status(500).json({
                "process": "register",
                "status": "fail",
                "detail" : err
            })
        }
    }
    else {
        res.status(401).json({
            "process": "register",
            "status": "fail",
            "detail" : "lack of information"
        })
    }
})

// Login
router.post("/login", async (req, res) => {
    if (req.body.username && req.body.password) {
        try {
            const user = await User.findOne({
                username: req.body.username
            })

            if (user)
            {
                const hashPasswordDB = cryptoJS.AES.
                                        decrypt(user.password, process.env.SECRET_KEY)
                const passwordDB = hashPasswordDB.toString(cryptoJS.enc.Utf8)
                // const hashPasswordReq = cryptoJS.AES.decrypt(passwordDB, req.body.password)
                // const passwordReq = hashPasswordRes.toString(cryptoJS.enc.Utf8)

                if (req.body.password /*passwordReq*/ === passwordDB)
                {
                    const accessToken = jwt.sign(
                        {
                            id: user._id,
                            isAdmin: user.isAdmin
                        }, 
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "3d"
                        }
                    )
                    const { password, ...otherInfo } = user._doc
                    res.status(200).json({
                        "process": "login",
                        "status": "success",
                        "detail" : {...otherInfo, "access token": accessToken}
                    })
                }
                else {
                    res.status(401).json({
                        "process": "login",
                        "status": "fail",
                        "detail" : "wrong password"
                    })
                }
            }
            else {
                res.status(401).json({
                    "process": "login",
                    "status": "fail",
                    "detail" : "account doesn't exist"
                })
            }
        }
        catch (err) {
            res.status(500).json({
                "process": "login",
                "status": "fail",
                "detail" : err
            })
        }
    }
    else {
        res.status(500).json({
            "process": "login",
            "status": "fail",
            "detail" : "lack of information"
        })
    }
})
module.exports = router