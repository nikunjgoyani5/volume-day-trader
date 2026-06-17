/**
 * Wraps async controller functions so errors go to error middleware.
 * Usage: router.get("/", asyncHandler(myController));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
