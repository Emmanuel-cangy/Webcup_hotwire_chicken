  import { Controller } from "@hotwired/stimulus"

  // Connects to data-controller="ask-ai"
  export default class extends Controller {
    static targets = ['form', 'answer', 'button']

    connect() {
      console.log('stimulus controller connected')
      console.log(this.buttonTarget.se)
    }

    send(event) {
      event.preventDefault()
      console.log('sending request')
      this.buttonTarget.setAttribute('disabled', '');
      fetch(this.formTarget.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(this.formTarget)
      })
        .then(response => response.json())
        .then((data) => {
          // replace all \n from answer into '.' to be able to separate in arrays.
          // then remove empty strings from array and trim each item
          const splitResponse = data.answer.replaceAll('\n', '.').split(".")
            .filter(item => item !== "").map(item => item.trim());
          console.log(splitResponse);
          this.displayResult(splitResponse);
        })
    }

    displayResult(splitResponse) {
      const isNightmare = splitResponse[0].toLowerCase().includes("nightmare");
      let resultHtml = "";

      if (isNightmare) {
        resultHtml += "<p>Your had a nightmare.</p>";
        resultHtml += this.checkResult(splitResponse, ['theme', 'emotion']);
        resultHtml += "<p>Consult a professional to sleep better.</p>";
      } else {
        resultHtml += "<p>You had a sweet dream.</p>";
        resultHtml += this.checkResult(splitResponse, ['theme', 'emotion', 'prediction']);
      }
      this.answerTarget.innerHTML = resultHtml;
      this.buttonTarget.removeAttribute('disabled')
    }

    checkResult(splitResponse, sections) {
      let resultHtml = "";
      splitResponse.forEach((item) => {
        sections.forEach((word) => {
          if (item.split(":")[0].toLowerCase().includes(word)) {
            resultHtml += `<div class="dream-${word}"><strong>${this.capitalizeFirstLetter(word)}:</strong><span class="dream-info">${item.split(":")[1]}</span></div>`;
          }
        });
      });
      return resultHtml;
    }

    capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
