const jwt = require('jsonwebtoken');

// ✅ For Admin Routes
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    req.user = decoded; // Attach user info to request
    next();

  } catch (error) {
    console.error('Auth Error (Admin):', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ For Normal User Routes
const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Forbidden: Users only' });
    }

    req.user = decoded; // Attach user info to request
    next();

  } catch (error) {
    console.error('Auth Error (User):', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyAdmin, verifyUser };
