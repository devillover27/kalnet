const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function educatorOnly(req, res, next) {
  if (req.userRole !== "educator") {
    return res.status(403).json({ message: "Educator access required" });
  }
  next();
}

module.exports = { authMiddleware, educatorOnly };
