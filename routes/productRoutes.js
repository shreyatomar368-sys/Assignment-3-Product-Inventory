

const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getInventorySummary,
    updateStock
} = require("../controllers/productController");

// Create product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get low-stock products
router.get("/low-stock", getLowStockProducts);

// Get category-wise inventory summary
router.get("/summary", getInventorySummary);

// Update stock
router.patch("/:id/stock", updateStock);

// Get single product
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
