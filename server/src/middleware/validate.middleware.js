function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    return next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        errors: result.error.flatten().fieldErrors,
      });
    }
    Object.assign(req.query, result.data);
    return next();
  };
}

module.exports = { validateBody, validateQuery };
