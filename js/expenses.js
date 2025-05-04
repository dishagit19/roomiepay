document.addEventListener("DOMContentLoaded", () => {
  // Load expenses data
  loadExpenses()

  // Load roommates for contributor checkboxes
  loadRoommatesForContributors()

  // Handle add expense form submission
  const addExpenseForm = document.getElementById("add-expense-form")
  if (addExpenseForm) {
    addExpenseForm.addEventListener("submit", handleAddExpense)
  }

  // Handle expense search
  const expenseSearch = document.getElementById("expense-search")
  if (expenseSearch) {
    expenseSearch.addEventListener("input", function () {
      filterExpenses(this.value)
    })
  }
})

// Import necessary modules
import { ExpensesAPI } from "./expenses_api.js"
import { RoommatesAPI } from "./roommates_api.js"
import { formatCurrency, formatDate } from "./utils.js"

// Load expenses data
async function loadExpenses() {
  const tableBody = document.getElementById("expenses-table")

  try {
    const expenses = await ExpensesAPI.getAll()

    // Clear loading message
    tableBody.innerHTML = ""

    if (expenses.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No expenses found</td></tr>'
      return
    }

    // Add expenses to table
    expenses.forEach((expense) => {
      const row = document.createElement("tr")
      row.setAttribute("data-expense-id", expense.expense_id)

      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.description || "-"}</td>
        <td>${formatDate(expense.date)}</td>
        <td>${formatCurrency(expense.total_cost)}</td>
        <td>${expense.contributors.join(", ")}</td>
        <td>
          <button class="btn btn-sm btn-outline view-expense" data-id="${expense.expense_id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline delete-expense" data-id="${expense.expense_id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners to view and delete buttons
    addExpenseButtonListeners()
  } catch (error) {
    console.error("Failed to load expenses:", error)
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading expenses</td></tr>'
  }
}

// Add event listeners to expense action buttons
function addExpenseButtonListeners() {
  // View expense buttons
  const viewButtons = document.querySelectorAll(".view-expense")
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const expenseId = this.getAttribute("data-id")
      viewExpenseDetails(expenseId)
    })
  })

  // Delete expense buttons
  const deleteButtons = document.querySelectorAll(".delete-expense")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const expenseId = this.getAttribute("data-id")
      deleteExpense(expenseId)
    })
  })
}

// Load roommates for contributor checkboxes
async function loadRoommatesForContributors() {
  const checkboxesContainer = document.getElementById("contributors-checkboxes")

  try {
    const roommates = await RoommatesAPI.getAll()

    // Clear loading spinner
    checkboxesContainer.innerHTML = ""

    if (roommates.length === 0) {
      checkboxesContainer.innerHTML = "<p>No roommates found</p>"
      return
    }

    // Add checkboxes for each roommate
    roommates.forEach((roommate) => {
      const checkboxItem = document.createElement("div")
      checkboxItem.className = "checkbox-item"

      checkboxItem.innerHTML = `
        <input type="checkbox" id="contributor-${roommate.roommate_id}" name="contributors" value="${roommate.roommate_id}">
        <label for="contributor-${roommate.roommate_id}">${roommate.name}</label>
      `

      checkboxesContainer.appendChild(checkboxItem)
    })
  } catch (error) {
    console.error("Failed to load roommates for contributors:", error)
    checkboxesContainer.innerHTML = '<p class="text-danger">Error loading roommates</p>'
  }
}

// Handle add expense form submission
async function handleAddExpense(e) {
  e.preventDefault()

  // Get form values
  const name = document.getElementById("expense-name").value
  const description = document.getElementById("expense-description").value
  const totalCost = Number.parseFloat(document.getElementById("expense-cost").value)
  const date = document.getElementById("expense-date").value
  const category = document.getElementById("expense-category").value

  // Get selected contributors
  const contributorCheckboxes = document.querySelectorAll('input[name="contributors"]:checked')
  const contributors = Array.from(contributorCheckboxes).map((checkbox) => checkbox.value)

  if (contributors.length === 0) {
    alert("Please select at least one contributor")
    return
  }

  const expenseData = {
    name,
    description,
    total_cost: totalCost,
    date,
    category,
    contributors,
  }

  try {
    await ExpensesAPI.create(expenseData)

    // Reset form
    e.target.reset()

    // Show success message
    alert("Expense added successfully!")

    // Reload expenses list
    loadExpenses()
  } catch (error) {
    console.error("Failed to add expense:", error)
    alert("Failed to add expense. Please try again.")
  }
}

// View expense details
async function viewExpenseDetails(expenseId) {
  try {
    const expense = await ExpensesAPI.getById(expenseId)

    // Create modal content
    const modalContent = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Expense Details</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Name:</strong> ${expense.name}</p>
          <p><strong>Description:</strong> ${expense.description || "-"}</p>
          <p><strong>Date:</strong> ${formatDate(expense.date)}</p>
          <p><strong>Total Cost:</strong> ${formatCurrency(expense.total_cost)}</p>
          <p><strong>Category:</strong> ${expense.category}</p>
          <p><strong>Contributors:</strong> ${expense.contributors.join(", ")}</p>
          <p><strong>Cost per person:</strong> ${formatCurrency(expense.total_cost / expense.contributors.length)}</p>
        </div>
      </div>
    `

    // Create modal element
    const modalElement = document.createElement("div")
    modalElement.className = "modal"
    modalElement.innerHTML = modalContent

    // Add modal to body
    document.body.appendChild(modalElement)

    // Add event listener to close button
    const closeButton = modalElement.querySelector(".modal-close")
    closeButton.addEventListener("click", () => {
      document.body.removeChild(modalElement)
    })

    // Close modal when clicking on backdrop
    const backdrop = modalElement.querySelector(".modal-backdrop")
    backdrop.addEventListener("click", () => {
      document.body.removeChild(modalElement)
    })
  } catch (error) {
    console.error("Failed to view expense details:", error)
    alert("Failed to load expense details. Please try again.")
  }
}

// Delete expense
async function deleteExpense(expenseId) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this expense?")) {
    return
  }

  try {
    await ExpensesAPI.delete(expenseId)

    // Show success message
    alert("Expense deleted successfully!")

    // Reload expenses list
    loadExpenses()
  } catch (error) {
    console.error("Failed to delete expense:", error)
    alert("Failed to delete expense. Please try again.")
  }
}

// Filter expenses based on search input
function filterExpenses(searchTerm) {
  const rows = document.querySelectorAll("#expenses-table tr")

  searchTerm = searchTerm.toLowerCase()

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    if (text.includes(searchTerm)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}
