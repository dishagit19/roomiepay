// Check if user is logged in
function checkAuth() {
  // Skip auth check for login page
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    return
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = localStorage.getItem("username")

  if (!isLoggedIn || !username) {
    // Redirect to login page
    window.location.href = "index.html"
  } else {
    // Update username display if element exists
    const usernameDisplay = document.getElementById("username-display")
    if (usernameDisplay) {
      usernameDisplay.textContent = username
    }
  }
}

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  checkAuth()

  // Handle login form
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      // Simple client-side authentication (for demo purposes)
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("username", username)
        window.location.href = "dashboard.html"
      } else {
        const errorElement = document.getElementById("login-error")
        errorElement.textContent = "Invalid username or password"
      }
    })
  }

  // Handle logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("username")
      window.location.href = "index.html"
    })
  }
})
