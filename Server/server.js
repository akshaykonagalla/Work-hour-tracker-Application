const authRoutes = require("./routes/authRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
13223
// ✅ IMPORT ROUTES (TOP)
const workRoutes = require("./routes/workRoutes");

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// ✅ 👉 PUT app.use HERE (VERY IMPORTANT)
app.use("/api/work", workRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect("mongodb+srv://akshay200205:konagalla@akshaykonagalla.ef2h7so.mongodb.net/?appName=akshaykonagalla")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});