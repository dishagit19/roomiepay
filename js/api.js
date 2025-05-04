// API Base URL
const API_BASE_URL = "https://your-backend.onrender.com/api"

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Request Failed:", error)
    throw error
  }
}

// API Functions for Roommates
const RoommatesAPI = {
  // Get all roommates
  getAll: () => fetchAPI("/roommates"),

  // Get a single roommate by ID
  getById: (id) => fetchAPI(`/roommates/${id}`),

  // Create a new roommate
  create: (data) =>
    fetchAPI("/roommates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a roommate
  update: (id, data) =>
    fetchAPI(`/roommates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a roommate
  delete: (id) =>
    fetchAPI(`/roommates/${id}`, {
      method: "DELETE",
    }),
}

// API Functions for Expenses
const ExpensesAPI = {
  // Get all expenses
  getAll: () => fetchAPI("/expenses"),

  // Get a single expense by ID
  getById: (id) => fetchAPI(`/expenses/${id}`),

  // Get recent expenses (limit to 5)
  getRecent: () => fetchAPI("/expenses/recent"),

  // Create a new expense
  create: (data) =>
    fetchAPI("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update an expense
  update: (id, data) =>
    fetchAPI(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an expense
  delete: (id) =>
    fetchAPI(`/expenses/${id}`, {
      method: "DELETE",
    }),

  // Get expenses by category
  getByCategory: () => fetchAPI("/expenses/by-category"),

  // Get expenses by roommate
  getByRoommate: () => fetchAPI("/expenses/by-roommate"),

  // Get monthly expense trends
  getMonthlyTrends: () => fetchAPI("/expenses/monthly-trends"),
}

// API Functions for Payments
const PaymentsAPI = {
  // Get all payments
  getAll: () => fetchAPI("/payments"),

  // Get a single payment by ID
  getById: (id) => fetchAPI(`/payments/${id}`),

  // Get payments by roommate
  getByRoommate: (roommateId) => fetchAPI(`/payments/roommate/${roommateId}`),

  // Create a new payment
  create: (data) =>
    fetchAPI("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a payment
  update: (id, data) =>
    fetchAPI(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a payment
  delete: (id) =>
    fetchAPI(`/payments/${id}`, {
      method: "DELETE",
    }),
}

// API Functions for Dashboard
const DashboardAPI = {
  // Get dashboard summary data
  getSummary: () => fetchAPI("/dashboard/summary"),

  // Get roommate balances
  getRoommateBalances: () => fetchAPI("/dashboard/roommate-balances"),
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

export { API_BASE_URL, RoommatesAPI, ExpensesAPI, PaymentsAPI, DashboardAPI, formatCurrency, formatDate }
