  import { Controller } from "@hotwired/stimulus"

  // Connects to data-controller="ask-ai"
  export default class extends Controller {
    static targets = ['form', 'answer']

    connect() {
      console.log('stimulus controller connected')
    }

    send(event) {
      event.preventDefault()
      console.log('sending request')

      fetch(this.formTarget.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(this.formTarget)
      })
        .then(response => response.json())
        .then((data) => {
          console.log(data.answer)
          this.answerTarget.innerHTML = data.answer
        })
    }
  }
