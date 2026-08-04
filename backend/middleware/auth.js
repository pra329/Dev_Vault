const jwt = require('jsonwebtoken');

exports.auth = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            res.status(401).json({
                success: false,
                message: "Authorization header is missing"
            })
        }
        const token = authHeader.split(" ")[1];
        if(!token) {
            res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or expired token",
            error: err.message
        })
    }
}