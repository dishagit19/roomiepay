// Dashboard API module
import { API_BASE_URL } from "../api.js"

export const DashboardAPI = {
  // Get dashboard summary data
  getSummary: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error)
      // Return mock data for demo purposes
      return {
        totalExpenses: 967.55,
        totalPayments: 830.0,
        netBalance: 137.55,
      }
    }
  },

  // Get roommate balances
  getRoommateBalances: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/roommate-balances`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch roommate balances:", error)
      // Return mock data for demo purposes
      return [
        { name: "John Smith", balance: 120.5 },
        { name: "Sarah Johnson", balance: -45.75 },
        { name: "Mike Williams", balance: 85.3 },
        { name: "Emily Davis", balance: -22.5 },
      ]
    }
  },
}
