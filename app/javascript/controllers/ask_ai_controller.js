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
          const splitResponse = data.answer.split(".");
          // this.answerTarget.innerHTML = data.answer
          console.log(data);
          console.log(data.answer);
          console.log(data.answer.split("."));
          console.log(splitResponse);
          this.displayResult(splitResponse);
        })
    }

    displayResult(splitResponse) {
      const isNightmare = splitResponse[0].toLowerCase().includes("nightmare");
      let resultHtml = "";

      if (isNightmare) {
        resultHtml += "<p>Your had a nightmare.</p>";
        resultHtml += `<p><strong>Themes:</strong> ${splitResponse[1]}</p>`;
        resultHtml += `<p><strong>Emotions:</strong> ${splitResponse[2]}</p>`;
        resultHtml += "<p>Consult a professional to sleep better.</p>";
      } else {
        resultHtml += "<p>You had a sweet dream.</p>";
        resultHtml += `<p><strong>Themes:</strong> ${splitResponse[1]}</p>`;
        resultHtml += `<p><strong>Emotions:</strong> ${splitResponse[2]}</p>`;
        resultHtml += `<p><strong>Predictions:</strong> ${splitResponse[3]}</p>`;
      }

      this.answerTarget.innerHTML = resultHtml;
    }
  }
