/**
 * Controller = handles HTTP request & response (the "C" in MVC)
 * Does not talk to DB directly for simple routes; uses models/services when needed.
 */
function getHealth(req, res) {
  res.json({
    ok: true,
    message: "API is running",
    database: "volumedaytrader",
  });
}

module.exports = {
  getHealth,
};
