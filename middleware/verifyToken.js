// This will verify our token isnt tampered with
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Get the token from the header
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token using JWT and your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assign the decoded user payload (e.g. userId) to the request object.
    // This means in any following middleware or route handler, we can access the authenticated user's ID directly.
    // Example: In a route, you can now use req.user.userId to get the user's ID.
    req.user = { userId: decoded.userId };

    next(); // proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = verifyToken;
