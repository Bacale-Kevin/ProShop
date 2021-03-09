import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";

import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoutes.js";
import oderRoutes from "./routes/oderRoutes.js";

dotenv.config();

//connecting to the DB
connectDB();

const app = express();

//body parser middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", oderRoutes);

//Handling wrong URL routes by sending back 404 status code
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

//custom express error handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
