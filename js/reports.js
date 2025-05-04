import { Chart } from "@/components/ui/chart"
import { ExpensesAPI } from "./expenses_api.js"
import { formatCurrency } from "./utils.js"

document.addEventListener("DOMContentLoaded", () => {
  // Load expenses by roommate chart
  loadExpensesByRoommateChart()

  // Load expenses by category chart
  loadExpensesByCategoryChart()

  // Load monthly expense trends chart
  loadMonthlyExpenseTrendsChart()
})

// Load expenses by roommate chart
async function loadExpensesByRoommateChart() {
  const chartContainer = document.getElementById("expenses-by-roommate-chart")

  try {
    const data = await ExpensesAPI.getByRoommate()

    // Remove loading spinner
    chartContainer.innerHTML = ""

    // Create canvas for chart
    const canvas = document.createElement("canvas")
    chartContainer.appendChild(canvas)

    // Prepare data for chart
    const labels = data.map((item) => item.name)
    const values = data.map((item) => item.total)

    // Create chart
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Expenses",
            data: values,
            backgroundColor: [
              "rgba(108, 92, 231, 0.7)",
              "rgba(0, 184, 148, 0.7)",
              "rgba(253, 203, 110, 0.7)",
              "rgba(232, 67, 147, 0.7)",
              "rgba(9, 132, 227, 0.7)",
            ],
            borderColor: [
              "rgba(108, 92, 231, 1)",
              "rgba(0, 184, 148, 1)",
              "rgba(253, 203, 110, 1)",
              "rgba(232, 67, 147, 1)",
              "rgba(9, 132, 227, 1)",
            ],
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
    console.error("Failed to load expenses by roommate chart:", error)
    chartContainer.innerHTML = '<p class="text-center text-danger">Error loading chart data</p>'
  }
}

// Load expenses by category chart
async function loadExpensesByCategoryChart() {
  const chartContainer = document.getElementById("expenses-by-category-chart")

  try {
    const data = await ExpensesAPI.getByCategory()

    // Remove loading spinner
    chartContainer.innerHTML = ""

    // Create canvas for chart
    const canvas = document.createElement("canvas")
    chartContainer.appendChild(canvas)

    // Prepare data for chart
    const labels = data.map((item) => item.category)
    const values = data.map((item) => item.total)

    // Create chart
    new Chart(canvas, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "rgba(108, 92, 231, 0.7)",
              "rgba(0, 184, 148, 0.7)",
              "rgba(253, 203, 110, 0.7)",
              "rgba(232, 67, 147, 0.7)",
              "rgba(9, 132, 227, 0.7)",
              "rgba(214, 48, 49, 0.7)",
            ],
            borderColor: [
              "rgba(108, 92, 231, 1)",
              "rgba(0, 184, 148, 1)",
              "rgba(253, 203, 110, 1)",
              "rgba(232, 67, 147, 1)",
              "rgba(9, 132, 227, 1)",
              "rgba(214, 48, 49, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = formatCurrency(context.raw)
                const percentage = Math.round(
                  (context.raw / context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100,
                )
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
          legend: {
            position: "right",
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to load expenses by category chart:", error)
    chartContainer.innerHTML = '<p class="text-center text-danger">Error loading chart data</p>'
  }
}

// Load monthly expense trends chart
async function loadMonthlyExpenseTrendsChart() {
  const chartContainer = document.getElementById("monthly-expense-trends-chart")

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
    console.error("Failed to load monthly expense trends chart:", error)
    chartContainer.innerHTML = '<p class="text-center text-danger">Error loading chart data</p>'
  }
}
