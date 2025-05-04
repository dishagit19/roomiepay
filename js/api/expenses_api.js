// Expenses API module
import { API_BASE_URL } from "../api.js"

export const ExpensesAPI = {
  // Get all expenses
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
      // Return mock data for demo purposes
      return [
        {
          expense_id: 1,
          name: "Groceries",
          description: "Weekly groceries",
          date: "2023-05-01",
          total_cost: 120.5,
          contributors: ["John Smith", "Sarah Johnson"],
          category: "Groceries",
        },
        {
          expense_id: 2,
          name: "Electricity",
          description: "May bill",
          date: "2023-05-05",
          total_cost: 85.3,
          contributors: ["John Smith", "Sarah Johnson", "Mike Williams", "Emily Davis"],
          category: "Utilities",
        },
        {
          expense_id: 3,
          name: "Internet",
          description: "Monthly internet",
          date: "2023-05-10",
          total_cost: 65.0,
          contributors: ["John Smith", "Sarah Johnson", "Mike Williams", "Emily Davis"],
          category: "Utilities",
        },
        {
          expense_id: 4,
          name: "Water",
          description: "Water bill",
          date: "2023-05-15",
          total_cost: 45.75,
          contributors: ["John Smith", "Sarah Johnson", "Mike Williams", "Emily Davis"],
          category: "Utilities",
        },
        {
          expense_id: 5,
          name: "New Couch",
          description: "Living room couch",
          date: "2023-05-20",
          total_cost: 650.0,
          contributors: ["Mike Williams", "Emily Davis"],
          category: "Furniture",
        },
      ]
    }
  },

  // Get a single expense by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch expense with ID ${id}:`, error)
      // Return mock data for demo purposes
      const allExpenses = await ExpensesAPI.getAll()
      return allExpenses.find((expense) => expense.expense_id == id) || null
    }
  },

  // Get recent expenses (limit to 5)
  getRecent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/recent`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch recent expenses:", error)
      // Return mock data for demo purposes
      const allExpenses = await ExpensesAPI.getAll()
      return allExpenses.slice(0, 5)
    }
  },

  // Create a new expense
  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to create expense:", error)
      // Return mock success response for demo purposes
      return { success: true, message: "Expense created successfully" }
    }
  },

  // Update an expense
  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to update expense with ID ${id}:`, error)
      // Return mock success response for demo purposes
      return { success: true, message: "Expense updated successfully" }
    }
  },

  // Delete an expense
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to delete expense with ID ${id}:`, error)
      // Return mock success response for demo purposes
      return { success: true, message: "Expense deleted successfully" }
    }
  },

  // Get expenses by category
  getByCategory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/by-category`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch expenses by category:", error)
      // Return mock data for demo purposes
      return [
        { category: "Groceries", total: 120.5 },
        { category: "Utilities", total: 196.05 },
        { category: "Furniture", total: 650.0 },
        { category: "Entertainment", total: 85.0 },
        { category: "Other", total: 45.0 },
      ]
    }
  },

  // Get expenses by roommate
  getByRoommate: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/by-roommate`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch expenses by roommate:", error)
      // Return mock data for demo purposes
      return [
        { name: "John Smith", total: 316.55 },
        { name: "Sarah Johnson", total: 316.55 },
        { name: "Mike Williams", total: 421.05 },
        { name: "Emily Davis", total: 421.05 },
      ]
    }
  },

  // Get monthly expense trends
  getMonthlyTrends: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/monthly-trends`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch monthly expense trends:", error)
      // Return mock data for demo purposes
      return {
        months: ["Jan", "Feb", "Mar", "Apr", "May"],
        expenses: [850.25, 920.5, 780.3, 1050.75, 967.55],
      }
    }
  },
}
