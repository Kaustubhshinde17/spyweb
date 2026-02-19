const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const protectClient = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'spyweb_secret_key');

      req.client = await Client.findById(decoded.id).select('-password');

      if (!req.client) {
        return res.status(401).json({ message: 'Not authorized, client not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectClient };
