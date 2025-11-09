const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const mailRoutes = require("./routes/mailRoutes");

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(
  cors({
    origin: ["https://biplab-biswas.netlify.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use("/api/mail", mailRoutes);
