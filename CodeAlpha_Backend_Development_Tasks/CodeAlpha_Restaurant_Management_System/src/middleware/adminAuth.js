function adminAuth(req, res, next) {
  const expectedKey = process.env.ADMIN_API_KEY || "changeme";
  const providedKey = req.header("x-admin-key");

  if (providedKey !== expectedKey) {
    return res.status(401).json({ message: "Unauthorized admin access." });
  }

  return next();
}

module.exports = adminAuth;
