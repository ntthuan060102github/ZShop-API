const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json({
                "process": "payment",
                "status": "fail",
                "detail" : stripeErr
            })
        }
        else {
            res.status(500).json({
                "process": "payment",
                "status": "success",
                "detail" : stripeRes
            })
        }
    })
})

module.exports = router