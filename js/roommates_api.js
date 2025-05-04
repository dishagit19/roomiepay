// Roommates API module
import { API_BASE_URL } from "./api.js"

export const RoommatesAPI = {
  // Get all roommates
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roommates`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch roommates:", error)
      // Return mock data for demo purposes
      return [
        { roommate_id: 1, name: "John Smith", phone: "555-123-4567", balance: 120.5 },
        { roommate_id: 2, name: "Sarah Johnson", phone: "555-234-5678", balance: -45.75 },
        { roommate_id: 3, name: "Mike Williams", phone: "555-345-6789", balance: 85.3 },
        { roommate_id: 4, name: "Emily Davis", phone: "555-456-7890", balance: -22.5 },
      ]
    }
  },

  // Get a single roommate by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roommates/${id}`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch roommate with ID ${id}:`, error)
      // Return mock data for demo purposes
      const allRoommates = await RoommatesAPI.getAll()
      return allRoommates.find((roommate) => roommate.roommate_id == id) || null
    }
  },

  // Create a new roommate
  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roommates`, {
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
      console.error("Failed to create roommate:", error)
      // Return mock success response for demo purposes
      return { success: true, message: "Roommate created successfully" }
    }
  },

  // Update a roommate
  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roommates/${id}`, {
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
      console.error(`Failed to update roommate with ID ${id}:`, error)
      // Return mock success response for demo purposes
      return { success: true, message: "Roommate updated successfully" }
    }
  },

  // Delete a roommate
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roommates/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to delete roommate with ID ${id}:`, error)
      // Return mock success response for demo purposes
      return { success: true, message: "Roommate deleted successfully" }
    }
  },
}
