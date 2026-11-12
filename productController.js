
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// Create a product
const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
});

// Get all products with filtering, sorting and pagination
const getProducts = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = {};

    if (sort === "price") {
        sortOption.price = 1;
    } else if (sort === "-price") {
        sortOption.price = -1;
    } else if (sort === "name") {
        sortOption.name = 1;
    } else if (sort === "-name") {
        sortOption.name = -1;
    } else {
        sortOption.createdAt = -1;
    }

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        products
    });
});

// Get a single product
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        product
    });
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// Get low-stock products
const getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        $expr: {
            $lte: ["$quantity", "$reorderLevel"]
        }
    });

    res.status(200).json({
        success: true,
        totalLowStockProducts: products.length,
        products
    });
});

// Category-wise inventory summary
const getInventorySummary = asyncHandler(async (req, res) => {
    const summary = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                totalProducts: { $sum: 1 },
                totalQuantity: { $sum: "$quantity" },
                totalInventoryValue: {
                    $sum: { $multiply: ["$price", "$quantity"] }
                }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        summary
    });
});

// Update product stock
const updateStock = asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    if (quantity === undefined || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
        res.status(400);
        throw new Error("Please provide a valid non-negative stock quantity");
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { quantity: Number(quantity) },
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        product
    });
});

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getInventorySummary,
    updateStock
};
