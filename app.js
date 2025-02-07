require("express-async-errors");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const connectDB = require("./utils/connectDB");

// Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const filmmakerRoutes = require("./routes/filmmaker");
const artistRoutes = require("./routes/artist");
const chatRoutes = require("./routes/chat");

// Custom middlewares
const middlewares = require("./utils/middleware");

// Cloudinary

app.use(express.json());
app.use(middlewares.extractToken);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Spotlighthub.. Have fun" });
});
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/filmmaker", filmmakerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/chat", chatRoutes);
app.use(middlewares.unknownEndpoints);
app.use(middlewares.errorHandler);

module.exports = app;
