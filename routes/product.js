const router = require('express').Router()

const Product = require('../models/Product')

const { verifyTokenAndAdmin } = require('./verifyToken')

// Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const saved = await newProduct.save()

        res.status(200).json({
            "process": "post product",
            "status": "success",
            "detail" : saved
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "post product",
            "status": "fail",
            "detail" : err
        })
    }
})

// Update 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true}
    )

    try {

        res.status(200).json({
            "process": "update product",
            "status": "success",
            "detail" : updateProduct
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "update product",
            "status": "fail",
            "detail" : err
        })
    }
})

// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({
            "process": "delete product",
            "status": "success",
            "detail" : deleteProduct
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "delete product",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json({
            "process": "get product",
            "status": "success",
            "detail" : product
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get product",
            "status": "fail",
            "detail" : err
        })
    }
})

// Get all products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const queryLimit = Number(req.query.limit)
    const queryCategory = req.query.category

    try {
        let products

        if (queryLimit) {
            products = await Product.find().limit(queryLimit)
        }
        else if (queryCategory) {
            products = await Product.find({categories: {
                $in: [queryCategory]
            }})
        }
        else {
            products = await Product.find()
        }

        res.status(200).json({
            "process": "get all products",
            "status": "success",
            "detail" : products
        })
    }
    catch (err) {
        res.status(500).json({
            "process": "get all products",
            "status": "fail",
            "detail" : err
        })
    }
})

module.exports = router