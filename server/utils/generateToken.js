const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'venma_jwt_secret_super_secure_key_2026_production', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'venma_jwt_refresh_secret_key_2026_production', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
