import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    // 1. Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check admin privileges
    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required'
      });
    }

    // 4. Attach admin data to request
    req.admin = {
      id: decoded.id,
      isAdmin: true
    };

    next();

  } catch (error) {
    console.error('Admin auth error:', error);

    // Handle specific JWT errors
    let message = 'Authentication failed';
    if (error instanceof jwt.JsonWebTokenError) {
      message = 'Invalid token';
    } else if (error instanceof jwt.TokenExpiredError) {
      message = 'Token expired';
    }

    res.status(401).json({
      success: false,
      message
    });
  }
};

export default adminAuth;