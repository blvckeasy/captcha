async function main() {
  const body = document.getElementsByTagName("body")[0];
  const img = document.createElement("img");

  const response = await fetch("http://localhost:1003/createQuiz")
  const { data: src } = await response.json();
  
  img.setAttribute('src', src);
  
  body.appendChild(img);
}

main();