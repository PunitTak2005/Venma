/**
 * Formats a currency amount into Indian Rupee compact notation (K, Lakh, Crore).
 * Rules:
 * Below 1,000 -> ₹999
 * Thousands -> ₹26.5K
 * Lakhs (1,00,000+) -> ₹2.65L or ₹12.5L
 * Crores (1,00,00,000+) -> ₹2.5Cr or ₹3.4Cr
 * Removes unnecessary trailing .00
 */
export const formatINRCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const val = Math.abs(Number(amount));
  const sign = amount < 0 ? '-' : '';

  if (val < 1000) {
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(2).replace(/\.00$/, '');
    return `${sign}₹${formatted}`;
  }

  if (val < 100000) {
    // Thousands (1K to 99.9K)
    const kVal = val / 1000;
    const formatted = kVal % 1 === 0 ? kVal.toString() : kVal.toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${formatted}K`;
  }

  if (val < 10000000) {
    // Lakhs (1L to 99.99L)
    const lakhVal = val / 100000;
    const formatted = lakhVal % 1 === 0 ? lakhVal.toString() : lakhVal.toFixed(2).replace(/\.?0+$/, '');
    return `${sign}₹${formatted}L`;
  }

  // Crores (1Cr+)
  const croreVal = val / 10000000;
  const formatted = croreVal % 1 === 0 ? croreVal.toString() : croreVal.toFixed(2).replace(/\.?0+$/, '');
  return `${sign}₹${formatted}Cr`;
};

/**
 * Formats non-currency numbers into compact notation (e.g. 100 -> 100, 1200 -> 1.2K, 14500 -> 14.5K)
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const val = Math.abs(Number(num));
  const sign = num < 0 ? '-' : '';

  if (val < 1000) return `${sign}${val}`;

  if (val < 1000000) {
    const kVal = val / 1000;
    const formatted = kVal % 1 === 0 ? kVal.toString() : kVal.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}K`;
  }

  if (val < 10000000) {
    const mVal = val / 1000000;
    const formatted = mVal % 1 === 0 ? mVal.toString() : mVal.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}M`;
  }

  const croreVal = val / 10000000;
  const formatted = croreVal % 1 === 0 ? croreVal.toString() : croreVal.toFixed(2).replace(/\.?0+$/, '');
  return `${sign}${formatted}Cr`;
};

/**
 * Formats a product count with correct singular/plural grammar.
 * Examples: 0 → "0 Products", 1 → "1 Product", 24 → "24 Products"
 */
export const formatProductCount = (count = 0) =>
  `${count} ${count === 1 ? 'Product' : 'Products'}`;
