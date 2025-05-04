// Import or declare PaymentsAPI, formatCurrency, formatDate, and RoommatesAPI
// For example:
// import { PaymentsAPI } from './payments_api';
// import { RoommatesAPI } from './roommates_api';
// import { formatCurrency, formatDate } from './utils';

// Or declare them as global variables if they are defined elsewhere:
// const PaymentsAPI = window.PaymentsAPI;
// const RoommatesAPI = window.RoommatesAPI;
// const formatCurrency = window.formatCurrency;
// const formatDate = window.formatDate;

document.addEventListener("DOMContentLoaded", () => {
  // Load payments data
  loadPayments()

  // Load roommates for dropdown
  loadRoommatesForDropdown()

  // Handle add payment form submission
  const addPaymentForm = document.getElementById("add-payment-form")
  if (addPaymentForm) {
    addPaymentForm.addEventListener("submit", handleAddPayment)
  }

  // Handle roommate filter change
  const roommateFilter = document.getElementById("roommate-filter")
  if (roommateFilter) {
    roommateFilter.addEventListener("change", function () {
      filterPaymentsByRoommate(this.value)
    })
  }
})

// Load payments data
async function loadPayments() {
  const tableBody = document.getElementById("payments-table")

  try {
    const payments = await PaymentsAPI.getAll()

    // Clear loading message
    tableBody.innerHTML = ""

    if (payments.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No payments found</td></tr>'
      return
    }

    // Add payments to table
    payments.forEach((payment) => {
      const row = document.createElement("tr")
      row.setAttribute("data-roommate-id", payment.roommate_id)

      row.innerHTML = `
        <td>${payment.roommate_name}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td>${formatDate(payment.date)}</td>
        <td>${payment.mode}</td>
        <td>
          <button class="btn btn-sm btn-outline delete-payment" data-id="${payment.payment_id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners to delete buttons
    addPaymentButtonListeners()
  } catch (error) {
    console.error("Failed to load payments:", error)
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading payments</td></tr>'
  }
}

// Add event listeners to payment action buttons
function addPaymentButtonListeners() {
  // Delete payment buttons
  const deleteButtons = document.querySelectorAll(".delete-payment")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const paymentId = this.getAttribute("data-id")
      deletePayment(paymentId)
    })
  })
}

// Load roommates for dropdown
async function loadRoommatesForDropdown() {
  const roommateSelect = document.getElementById("payment-roommate")
  const roommateFilter = document.getElementById("roommate-filter")

  try {
    const roommates = await RoommatesAPI.getAll()

    if (roommates.length === 0) {
      if (roommateSelect) roommateSelect.innerHTML = '<option value="">No roommates found</option>'
      return
    }

    // Add options to payment form dropdown
    if (roommateSelect) {
      roommates.forEach((roommate) => {
        const option = document.createElement("option")
        option.value = roommate.roommate_id
        option.textContent = roommate.name
        roommateSelect.appendChild(option)
      })
    }

    // Add options to filter dropdown
    if (roommateFilter) {
      roommates.forEach((roommate) => {
        const option = document.createElement("option")
        option.value = roommate.roommate_id
        option.textContent = roommate.name
        roommateFilter.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Failed to load roommates for dropdown:", error)
    if (roommateSelect) roommateSelect.innerHTML = '<option value="">Error loading roommates</option>'
  }
}

// Handle add payment form submission
async function handleAddPayment(e) {
  e.preventDefault()

  // Get form values
  const roommateId = document.getElementById("payment-roommate").value
  const amount = Number.parseFloat(document.getElementById("payment-amount").value)
  const date = document.getElementById("payment-date").value
  const mode = document.getElementById("payment-mode").value

  if (!roommateId) {
    alert("Please select a roommate")
    return
  }

  const paymentData = {
    roommate_id: roommateId,
    amount,
    date,
    mode,
  }

  try {
    await PaymentsAPI.create(paymentData)

    // Reset form
    e.target.reset()

    // Show success message
    alert("Payment added successfully!")

    // Reload payments list
    loadPayments()
  } catch (error) {
    console.error("Failed to add payment:", error)
    alert("Failed to add payment. Please try again.")
  }
}

// Delete payment
async function deletePayment(paymentId) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this payment?")) {
    return
  }

  try {
    await PaymentsAPI.delete(paymentId)

    // Show success message
    alert("Payment deleted successfully!")

    // Reload payments list
    loadPayments()
  } catch (error) {
    console.error("Failed to delete payment:", error)
    alert("Failed to delete payment. Please try again.")
  }
}

// Filter payments by roommate
function filterPaymentsByRoommate(roommateId) {
  const rows = document.querySelectorAll("#payments-table tr")

  rows.forEach((row) => {
    if (!roommateId || row.getAttribute("data-roommate-id") === roommateId) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}
