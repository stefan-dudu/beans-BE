const express = require("express");
const morgan = require("morgan");

const beansRouter = require("./routes/beansRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("This is the middleware 🌍");
  next();
});

// Routes
app.use("/api/v1/beans", beansRouter);
app.use("/api/v1/users", userRouter);
module.exports = app;
