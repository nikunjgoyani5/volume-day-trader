/**
 * Global error handler (last middleware in app.js)
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Request failed";
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
