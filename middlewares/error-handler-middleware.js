const ErrorHandler = (error, req, res, next) => {
    return res.status(error.code).json({
        message: error.message,
        status: error.status
    });
}

module.exports = ErrorHandler;