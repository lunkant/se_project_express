const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { Port = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "69e7448c306cce83b6ab1336",
  };
  next();
});

app.use("/", mainRouter);

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
