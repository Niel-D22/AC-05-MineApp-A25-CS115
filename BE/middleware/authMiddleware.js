const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token tidak ada" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    req.user = decoded;
    next();
  });
};

exports.onlyMainPlanner = (req, res, next) => {
  if (req.user.role !== "MainPlanner") {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};

exports.onlyShippingPlanner = (req, res, next) => {
  if (req.user.role !== "ShippingPlanner") {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};
