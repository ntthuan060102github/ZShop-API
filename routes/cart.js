const router = require('express').Router()

const Cart = require('../models/Cart')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

// Create
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const saved = await newCart.save()

        res.status(200).json({
            "process": "post cart",
            "status": "success",
            "detail" : saved
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "post cart",
            "status": "fail",
            "detail" : err
        })
    }
})

// Update 
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const updateCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true}
    )

    try {

        res.status(200).json({
            "process": "update cart",
            "status": "success",
            "detail" : updateCart
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "update cart",
            "status": "fail",
            "detail" : err
        })
    }
})

// Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id)

        res.status(200).json({
            "process": "delete cart",
            "status": "success",
            "detail" : deleteCart
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "delete cart",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get user cart
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.id})
        res.status(200).json({
            "process": "get cart",
            "status": "success",
            "detail" : cart
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get cart",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const queryLimit = Number(req.query.limit)

    try {
        const cart = await queryLimit ? Cart.find().limit(queryLimit) : Cart.find()

        res.status(200).json({
            "process": "get all carts",
            "status": "success",
            "detail" : cart
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get all carts",
            "status": "fail",
            "detail" : err
        })
    }
})

module.exports = router