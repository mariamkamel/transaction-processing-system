// middleware/authenticateUser.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    // Extract the JWT token from the request headers
    const tokenWithBearer = req.header('Authorization');
    if (!tokenWithBearer || !tokenWithBearer.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }
  
    const token = tokenWithBearer.slice(7); // Remove "Bearer " prefix
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, 'secret-key');
    console.log(decoded)
    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach the user object to the request for use in protected routes
    req.user = user;
    if (user.role === 'admin') {
        req.isAdmin = true; // Indicate that the user is an admin
    }
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
