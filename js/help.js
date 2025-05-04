document.addEventListener("DOMContentLoaded", () => {
  // Initialize accordion functionality
  initAccordion()
})

// Initialize accordion functionality
function initAccordion() {
  const accordionButtons = document.querySelectorAll(".accordion-button")

  if (accordionButtons) {
    accordionButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.toggle("collapsed")

        const content = document.getElementById(this.getAttribute("data-bs-target").substring(1))

        if (content.classList.contains("show")) {
          content.classList.remove("show")
        } else {
          content.classList.add("show")
        }
      })
    })
  }
}
