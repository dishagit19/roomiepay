// Re-export formatting utilities
import { formatCurrency, formatDate, formatPercentage } from "./utils/formatting.js"

export { formatCurrency, formatDate, formatPercentage }

/**
 * Get color class based on balance value
 * @param {number} balance - The balance value
 * @returns {string} CSS class name
 */
export function getBalanceColorClass(balance) {
  if (balance > 0) {
    return "text-danger" // Owes money
  } else if (balance < 0) {
    return "text-success" // Owed money
  }
  return "" // Neutral
}

/**
 * Truncate text if it exceeds a certain length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 30) {
  if (!text || text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + "..."
}
