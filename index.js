const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./src/routes/user");

const app = express();
mongoose.connect("mongodb://localhost:27017/userAiking", () => {
  console.log("Connect DB successfully");
});

app.use(cors());
app.use(express.json());

//ROUTES
app.use("/api/v1/user", userRoute);

// server chạy ở port
app.listen(8000, () => {
  console.log("server is running");
});
