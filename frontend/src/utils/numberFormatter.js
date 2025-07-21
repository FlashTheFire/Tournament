/**
 * Unified Number Formatting Utility
 * 
 * Formatting Rules:
 * - 1-999: display with trailing "+" (e.g., "523+")
 * - 1,000-9,999: use "K" shorthand with one decimal (e.g., "2.3K")
 * - 10,000+: same "K" format (e.g., "12.5K")
 * 
 * Gracefully degrades on network/rendering issues
 */

export const formatNumber = (value, fallback = "0+") => {
  try {
    // Handle null, undefined, or invalid values
    if (value === null || value === undefined || isNaN(value)) {
      return fallback;
    }

    const num = Number(value);
    
    // Handle negative numbers
    if (num < 0) {
      return "0+";
    }

    // 1-999: display with trailing "+"
    if (num >= 1 && num <= 999) {
      return `${Math.floor(num)}+`;
    }
    
    // 1,000-9,999: use "K" shorthand with one decimal
    if (num >= 1000 && num <= 9999) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    
    // 10,000+: same "K" format
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    
    // Less than 1: show as "0+"
    return "0+";
    
  } catch (error) {
    console.warn('Number formatting error:', error);
    return fallback;
  }
};

/**
 * Format currency values (₹)
 * Same rules as formatNumber but with currency symbol
 */
export const formatCurrency = (value, fallback = "₹0+") => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return fallback;
    }

    const num = Number(value);
    
    if (num < 0) {
      return "₹0+";
    }

    // 1-999: display with trailing "+"
    if (num >= 1 && num <= 999) {
      return `₹${Math.floor(num)}+`;
    }
    
    // 1,000-9,999: use "K" shorthand with one decimal
    if (num >= 1000 && num <= 9999) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    
    // 10,000+: same "K" format
    if (num >= 10000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    
    return "₹0+";
    
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return fallback;
  }
};

/**
 * Format prize pool values - handles larger amounts
 * Special handling for millions
 */
export const formatPrizePool = (value, fallback = "₹0+") => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return fallback;
    }

    const num = Number(value);
    
    if (num < 0) {
      return "₹0+";
    }

    // Handle millions (1,000,000+)
    if (num >= 1000000) {
      return `₹${(num / 1000000).toFixed(1)}M`;
    }

    // Use regular currency formatting for smaller amounts
    return formatCurrency(num, fallback);
    
  } catch (error) {
    console.warn('Prize pool formatting error:', error);
    return fallback;
  }
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, fallback = "0%") => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return fallback;
    }

    const num = Number(value);
    return `${Math.round(num)}%`;
    
  } catch (error) {
    console.warn('Percentage formatting error:', error);
    return fallback;
  }
};

export default {
  formatNumber,
  formatCurrency,
  formatPrizePool,
  formatPercentage
};