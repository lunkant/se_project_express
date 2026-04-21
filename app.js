const express = require("express");
const app = express();
const { Port = 3001 } = process.env;
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "69e7448c306cce83b6ab1336",
  };
  next();
});

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
