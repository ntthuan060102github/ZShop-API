const router = require('express').Router()

const Order = require('../models/Order')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

// Create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const saved = await newOrder.save()

        res.status(200).json({
            "process": "post order",
            "status": "success",
            "detail" : saved
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "post order",
            "status": "fail",
            "detail" : err
        })
    }
})

// Update 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true}
    )

    try {

        res.status(200).json({
            "process": "update order",
            "status": "success",
            "detail" : updateOrder
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "update order",
            "status": "fail",
            "detail" : err
        })
    }
})

// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deleteOrder = await Order.findByIdAndDelete(req.params.id)

        res.status(200).json({
            "process": "delete order",
            "status": "success",
            "detail" : deleteOrder
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "delete order",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get user order
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.id})
        res.status(200).json({
            "process": "get order",
            "status": "success",
            "detail" : orders
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get order",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const queryLimit = Number(req.query.limit)

    try {
        const orders = queryLimit ? await Order.find().limit(queryLimit) : await Order.find()

        res.status(200).json({
            "process": "get all orders",
            "status": "success",
            "detail" : orders
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get all orders",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ])
        res.status(200).json({
            "process": "get monthly income",
            "status": "success",
            "detail" : income
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get monthly income",
            "status": "fail",
            "detail" : err
        })
    }
})

module.exports = router