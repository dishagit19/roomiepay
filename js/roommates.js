document.addEventListener("DOMContentLoaded", () => {
  // Load roommates data
  loadRoommates()

  // Handle add roommate form submission
  const addRoommateForm = document.getElementById("add-roommate-form")
  if (addRoommateForm) {
    addRoommateForm.addEventListener("submit", handleAddRoommate)
  }
})

// Import necessary modules
import { RoommatesAPI } from "./roommates_api.js"
import { formatCurrency } from "./utils.js"

// Load roommates data
async function loadRoommates() {
  const tableBody = document.getElementById("roommates-table")

  try {
    const roommates = await RoommatesAPI.getAll()

    // Clear loading message
    tableBody.innerHTML = ""

    if (roommates.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No roommates found</td></tr>'
      return
    }

    // Add roommates to table
    roommates.forEach((roommate) => {
      const row = document.createElement("tr")

      // Determine balance class
      let balanceClass = ""
      if (roommate.balance > 0) {
        balanceClass = "text-danger"
      } else if (roommate.balance < 0) {
        balanceClass = "text-success"
      }

      row.innerHTML = `
        <td>${roommate.name}</td>
        <td>${roommate.phone}</td>
        <td class="${balanceClass}">${formatCurrency(roommate.balance)}</td>
        <td>
          <button class="btn btn-sm btn-outline edit-roommate" data-id="${roommate.roommate_id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline delete-roommate" data-id="${roommate.roommate_id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners to edit and delete buttons
    addRoommateButtonListeners()
  } catch (error) {
    console.error("Failed to load roommates:", error)
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading roommates</td></tr>'
  }
}

// Add event listeners to roommate action buttons
function addRoommateButtonListeners() {
  // Edit roommate buttons
  const editButtons = document.querySelectorAll(".edit-roommate")
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const roommateId = this.getAttribute("data-id")
      editRoommate(roommateId)
    })
  })

  // Delete roommate buttons
  const deleteButtons = document.querySelectorAll(".delete-roommate")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const roommateId = this.getAttribute("data-id")
      deleteRoommate(roommateId)
    })
  })
}

// Handle add roommate form submission
async function handleAddRoommate(e) {
  e.preventDefault()

  const nameInput = document.getElementById("roommate-name")
  const phoneInput = document.getElementById("roommate-phone")
  const balanceInput = document.getElementById("roommate-balance")

  const roommateData = {
    name: nameInput.value,
    phone: phoneInput.value,
    balance: Number.parseFloat(balanceInput.value) || 0,
  }

  try {
    await RoommatesAPI.create(roommateData)

    // Reset form
    e.target.reset()

    // Show success message
    alert("Roommate added successfully!")

    // Reload roommates list
    loadRoommates()
  } catch (error) {
    console.error("Failed to add roommate:", error)
    alert("Failed to add roommate. Please try again.")
  }
}

// Edit roommate
async function editRoommate(roommateId) {
  try {
    const roommate = await RoommatesAPI.getById(roommateId)

    // Prompt for new values
    const newName = prompt("Enter new name:", roommate.name)
    if (!newName) return

    const newPhone = prompt("Enter new phone:", roommate.phone)
    if (!newPhone) return

    const newBalance = prompt("Enter new balance:", roommate.balance)
    if (newBalance === null) return

    const updatedData = {
      name: newName,
      phone: newPhone,
      balance: Number.parseFloat(newBalance),
    }

    await RoommatesAPI.update(roommateId, updatedData)

    // Show success message
    alert("Roommate updated successfully!")

    // Reload roommates list
    loadRoommates()
  } catch (error) {
    console.error("Failed to edit roommate:", error)
    alert("Failed to edit roommate. Please try again.")
  }
}

// Delete roommate
async function deleteRoommate(roommateId) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this roommate?")) {
    return
  }

  try {
    await RoommatesAPI.delete(roommateId)

    // Show success message
    alert("Roommate deleted successfully!")

    // Reload roommates list
    loadRoommates()
  } catch (error) {
    console.error("Failed to delete roommate:", error)
    alert("Failed to delete roommate. Please try again.")
  }
}
