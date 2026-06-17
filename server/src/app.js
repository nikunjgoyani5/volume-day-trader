const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const apiRoutes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = [env.clientUrl, env.adminClientUrl].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

// All API routes under /api
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
