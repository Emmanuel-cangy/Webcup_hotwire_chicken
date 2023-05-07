import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="alerts"
export default class extends Controller {
  connect() {
    let timeToClose = 4500
    if (this.element.classList.contains('alert-warning')) {
      timeToClose = 8500
    }
    setTimeout(() => {this.element.firstElementChild.click()}, timeToClose)
  }
}
