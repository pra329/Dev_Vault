const jwt = require('jsonwebtoken');

exports.optionalAuth = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return next();
        const token = authHeader.split(" ")[1];
        if(!token) return next();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or expired token",
            error: err.message
        })
    }
}