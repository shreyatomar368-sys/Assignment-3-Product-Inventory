
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    reorderLevel: {
        type: Number,
        default: 10,
        min: 0
    },

    supplier: {
        type: String,
        default: "Not specified"
    }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
