
const mongoose = require("mongoose");

const db = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/product_inventory");
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("Database connection error:", error.message);
    }
};

module.exports = db;

