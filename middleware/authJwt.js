const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/secretKey");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(token);
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
