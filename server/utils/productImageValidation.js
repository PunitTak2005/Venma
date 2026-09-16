const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../../client/public');

function isValidProductImage(imagePath) {
  if (typeof imagePath !== 'string' || !imagePath.trim()) return false;

  const normalized = imagePath.trim();
  if (!normalized.startsWith('/generated-products/') || /placeholder|fallback/i.test(normalized)) return false;

  const resolvedPath = path.resolve(publicDir, `.${normalized}`);
  return resolvedPath.startsWith(publicDir) && fs.existsSync(resolvedPath);
}

function getValidProductImages(product) {
  const candidates = [product.thumbnail, ...(Array.isArray(product.images) ? product.images : [])];
  return [...new Set(candidates.filter(isValidProductImage))];
}

module.exports = { isValidProductImage, getValidProductImages };
