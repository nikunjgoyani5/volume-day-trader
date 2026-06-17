const jwt = require("jsonwebtoken");

/**
 * Protects admin-only routes.
 * Client sends: Authorization: Bearer <token>
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = header.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  try {
    const payload = jwt.verify(token, secret);

    req.admin = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Use after requireAuth on admin-only routes.
 */
function requireAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = requireAuth;
module.exports.requireAdmin = requireAdmin;
