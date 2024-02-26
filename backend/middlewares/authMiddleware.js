const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .send({ message: "Token no proporcionado correctamente" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token inválido" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };
