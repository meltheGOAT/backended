const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err) return res.sendStatus(403);
            req.user = decodedToken.UserInfo.username;
            req.roles = decodedToken.UserInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;