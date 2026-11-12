
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

const db = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

dotenv.config();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send("Product Inventory Management API");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
