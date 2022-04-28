const router = require('express').Router()
const cryptoJS = require('crypto-js')

const User = require('../models/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

// Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password || req.body.username) {
        req.body.password = cryptoJS.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString()
        
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true})

            res.status(200).json({
                "process": "update user",
                "status": "success",
                "detail" : updateUser
            })
        }
        catch (err) {
            res.status(500).json({
                "process": "update user",
                "status": "fail",
                "detail" : err
            })
        }
    }
    else {
        res.status(401).json({
            "process": "update user",
            "status": "fail",
            "detail" : "lack of information"
        })
    }
})

// Delete 
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            "process": "delete user",
            "status": "success",
            "detail" : ""
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "delete user",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...otherInfo } = user._doc
        res.status(200).json({
            "process": "get user",
            "status": "success",
            "detail" : otherInfo
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get user",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get all user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
        
        res.status(200).json({
            "process": "get all users",
            "status": "success",
            "detail" : users
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get all users",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1))

    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            },
            { 
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])

        res.status(200).json({
            "process": "get user stats",
            "status": "success",
            "detail" : data
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get user stats",
            "status": "fail",
            "detail" : err
        })
    }

})
module.exports = router