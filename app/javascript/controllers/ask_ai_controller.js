  import { Controller } from "@hotwired/stimulus"

  // Connects to data-controller="ask-ai"
  export default class extends Controller {
    static targets = ['form', 'answer', 'button']

    connect() {
      console.log('stimulus controller connected')
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
          // console.log(data)
          // const dreamIndex = data.answer.indexOf("Dream")
          const themeIndex = data.answer.indexOf("Themes")
          const emotionIndex = data.answer.indexOf("Emotion")
          const predictionIndex = data.answer.indexOf("Predictions")

          const results = this.splitTheResponse(data.answer, themeIndex, emotionIndex, predictionIndex)
          const betterResults = results.map(item => item.replaceAll('\n', '').trim()).filter(item => item !== "")
          this.displayResult(betterResults);
        })
    }

    splitTheResponse(answer, themeIndex, emotionIndex, predictionIndex) {
      const dream = answer.slice(0, themeIndex)
      const theme = answer.slice(themeIndex, emotionIndex)
      const emotion = answer.slice(emotionIndex, predictionIndex)
      const prediction = answer.slice(predictionIndex, -1)
      return [dream, theme, emotion, prediction]
    }

    displayResult(splitResponse) {
      const isNightmare = splitResponse[0].toLowerCase().includes("nightmare");
      let resultHtml = "";

      if (isNightmare) {
        resultHtml += "<p>You had a nightmare.</p>";
        resultHtml += this.checkResult(splitResponse, ['theme', 'emotion']);
        resultHtml += "<p>Consult a professional to sleep better.</p>";
      } else {
        resultHtml += "<p>You had a sweet dream.</p>";
        resultHtml += this.checkResult(splitResponse, ['theme', 'emotion', 'prediction']);
      }

      resultHtml = `<div class="results-container">${resultHtml}</div>`;
      this.answerTarget.innerHTML = resultHtml;
      this.buttonTarget.removeAttribute('disabled');
    }

    checkResult(splitResponse, sections) {
      let resultHtml = "";
      let verticalCards = "";
      let horizontalCard = "";

      splitResponse.forEach((item) => {
        sections.forEach((word) => {
          if (item.split(":")[0].toLowerCase().includes(word)) {
            if (word === 'prediction') {
              horizontalCard = `<div class="card horizontal-card mb-3"><div class="card-body"><h5 class="card-title">${this.capitalizeFirstLetter(word)}</h5><p class="card-text dream-info">${item.split(":")[1]}</p></div></div>`;
            } else {
              verticalCards += `<div class="card vertical-card mb-3"><div class="card-body"><h5 class="card-title">${this.capitalizeFirstLetter(word)}</h5><p class="card-text dream-info">${item.split(":")[1]}</p></div></div>`;
            }
          }
        });
      });

      resultHtml = `<div class="vertical-cards">${verticalCards}</div>${horizontalCard}`;
      return resultHtml;
    }


    capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
