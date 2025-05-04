import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Load dashboard data
  loadDashboardData()

  // Load roommate balances chart
  loadRoommateBalancesChart()

  // Load recent expenses
  loadRecentExpenses()

  // Load monthly trends chart
  loadMonthlyTrendsChart()
})

// Import necessary modules
import { DashboardAPI } from "./api/dashboard_api.js"
import { ExpensesAPI } from "./api/expenses_api.js"
import { formatCurrency, formatDate } from "./utils/formatting.js"

// Load dashboard summary data
async function loadDashboardData() {
  try {
    const data = await DashboardAPI.getSummary()

    // Update stats cards
    document.getElementById("total-expenses").textContent = formatCurrency(data.totalExpenses)
    document.getElementById("total-payments").textContent = formatCurrency(data.totalPayments)
    document.getElementById("net-balance").textContent = formatCurrency(data.netBalance)
  } catch (error) {
    console.error("Failed to load dashboard data:", error)
    document.getElementById("total-expenses").textContent = "Error loading data"
    document.getElementById("total-payments").textContent = "Error loading data"
    document.getElementById("net-balance").textContent = "Error loading data"
  }
}

// Load roommate balances chart
async function loadRoommateBalancesChart() {
  const chartContainer = document.getElementById("roommate-balances-chart")

  try {
    const data = await DashboardAPI.getRoommateBalances()

    // Remove loading spinner
    chartContainer.innerHTML = ""

    // Create canvas for chart
    const canvas = document.createElement("canvas")
    chartContainer.appendChild(canvas)

    // Prepare data for chart
    const labels = data.map((item) => item.name)
    const values = data.map((item) => item.balance)
    const backgroundColors = values.map((value) => (value >= 0 ? "rgba(0, 184, 148, 0.7)" : "rgba(231, 76, 60, 0.7)"))

    // Create chart
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Balance",
            data: values,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => color.replace("0.7", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => formatCurrency(context.raw),
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to load roommate balances chart:", error)
    chartContainer.innerHTML = '<p class="text-center text-danger">Error loading chart data</p>'
  }
}

// Load recent expenses
async function loadRecentExpenses() {
  const tableBody = document.getElementById("recent-expenses-table")

  try {
    const expenses = await ExpensesAPI.getRecent()

    // Clear loading message
    tableBody.innerHTML = ""

    if (expenses.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No recent expenses found</td></tr>'
      return
    }

    // Add expenses to table
    expenses.forEach((expense) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${formatDate(expense.date)}</td>
        <td>${formatCurrency(expense.total_cost)}</td>
        <td>${expense.contributors.join(", ")}</td>
      `

      tableBody.appendChild(row)
    })
  } catch (error) {
    console.error("Failed to load recent expenses:", error)
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading expenses</td></tr>'
  }
}

// Load monthly trends chart
async function loadMonthlyTrendsChart() {
  const chartContainer = document.getElementById("monthly-trends-chart")

  try {
    const data = await ExpensesAPI.getMonthlyTrends()

    // Remove loading spinner
    chartContainer.innerHTML = ""

    // Create canvas for chart
    const canvas = document.createElement("canvas")
    chartContainer.appendChild(canvas)

    // Create chart
    new Chart(canvas, {
      type: "line",
      data: {
        labels: data.months,
        datasets: [
          {
            label: "Monthly Expenses",
            data: data.expenses,
            borderColor: "rgba(108, 92, 231, 1)",
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: (value) => "$" + value,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => formatCurrency(context.raw),
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to load monthly trends chart:", error)
    chartContainer.innerHTML = '<p class="text-center text-danger">Error loading chart data</p>'
  }
}
