
const notFound = (req, res, next) => {
    res.status(404);

    next(new Error("Route not found"));
};

const errorHandler = (error, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (error.name === "CastError") {
        statusCode = 400;
    }

    if (error.name === "ValidationError") {
        statusCode = 400;
    }

    if (error.code === 11000) {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: error.code === 11000
            ? "SKU already exists"
            : error.message
    });
};

module.exports = {
    notFound,
    errorHandler
};
