import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import path from 'path';
import morgan from 'morgan';  

import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoutes.js";
import oderRoutes from "./routes/oderRoutes.js";

dotenv.config();

//connecting to the DB
connectDB();

const app = express();

app.use(morgan('combined'))
app.use(cors());
//body parser middleware
app.use(express.json());

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", oderRoutes);

//* Paypal
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();

//ready for production
if (process.env.NODE_ENV === "production") {
  //specifying that the build folder is static ready for production
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
  });
}

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
