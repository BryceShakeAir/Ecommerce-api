const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const prodRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripeRouter= require("./routes/stripe");
const cors = require("cors");

dotEnv.config();

app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users",userRouter);

app.use("/api/auth",authRouter);

app.use("/api/products",prodRouter);

app.use("/api/carts",cartRouter);

app.use("/api/orders",orderRouter);

app.use("/api/checkout",stripeRouter);


mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("Connection successful")
).catch((err)=>console.log(err));

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running");
});