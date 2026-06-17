const MIN_LENGTH = 8;

function validateNewPassword(password) {
  if (!password || typeof password !== "string") {
    return "New password is required";
  }
  if (password.length < MIN_LENGTH) {
    return `Password must be at least ${MIN_LENGTH} characters`;
  }
  return null;
}

module.exports = { validateNewPassword, MIN_LENGTH };
