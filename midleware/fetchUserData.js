const jwt = require('jsonwebtoken');

const fetchUserData = (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send("Please authenticate with valid token");
    }
    try {
        const data = jwt.verify(token, "pavan")
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send("Please authenticate with valid token");
    }
}

module.exports = fetchUserData