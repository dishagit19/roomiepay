document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on desktop
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
    })
  }

  // Toggle sidebar on mobile
  const mobileSidebarToggle = document.getElementById("mobile-sidebar-toggle")

  if (mobileSidebarToggle && sidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 992 &&
      sidebar &&
      !sidebar.contains(event.target) &&
      event.target !== mobileSidebarToggle
    ) {
      sidebar.classList.remove("active")
    }
  })

  // Initialize accordion functionality
  const accordionButtons = document.querySelectorAll(".accordion-button")

  if (accordionButtons) {
    accordionButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.toggle("collapsed")
        const content = this.nextElementSibling

        if (content.classList.contains("show")) {
          content.classList.remove("show")
        } else {
          content.classList.add("show")
        }
      })
    })
  }
})
