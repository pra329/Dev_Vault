exports.errorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        message : process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
    })
}