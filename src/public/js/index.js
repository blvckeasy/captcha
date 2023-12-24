async function main() {

  const backendUrl = config.BACKEND_URL;

  console.log(backendUrl)

  const fieldset = document.getElementsByTagName("fieldset")[0];
  const img = document.createElement("img");
  const checkBtn = document.getElementsByClassName("checkBtn")[0];

  let response = await fetch(backendUrl + "/createQuiz")
  const { data: src, token } = await response.json();

  img.setAttribute('src', src);
  fieldset.insertBefore(img, fieldset.firstChild);

  checkBtn.addEventListener("click", async function (event) {
    const answerInput = document.getElementsByClassName("answer")[0];
    const errorParagraph = document.getElementsByClassName("error")[0];
    
    if (answerInput.value == "") {
      return errorParagraph.textContent = "Your answer must be required!";
    }

    let response = await fetch(backendUrl + "/checkQuiz", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        answer: answerInput.value
      })
    })
    let result = await response.json();
    console.log(result);

    if (!result.correct && typeof result.correct !== "undefined") {
      errorParagraph.textContent = result.message;
    } else if (result.correct) {
      console.log("ok");
      errorParagraph.textContent = null;
      alert(result.message)
    } else if (!result.ok) {
      alert(`${result.error.name}: ${result.error.message}`);
      return window.location = "/";
    }

    answerInput.value = ""
  })
}

main();