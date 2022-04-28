const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader) {
        const token = authHeader
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                res.status(403).json({
                    "process": "authenticate",
                    "status": "invalid",
                    "detail" : "token isn't valid!"
                })
            }
            req.user = user
            next()
        })
    }
    else {
        return res.status(401).json({
            "process": "authenticate",
            "status": "fail",
            "detail" : "you aren't authenticated!"
        })
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        }
        else {
            res.status(403).json({
                "process": "authenticate",
                "status": "unauthorized",
                "detail" : "you aren't allowed!"
            })
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        }
        else {
            res.status(403).json({
                "process": "authenticate",
                "status": "unauthorized",
                "detail" : "you aren't allowed!"
            })
        }
    })
}
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }