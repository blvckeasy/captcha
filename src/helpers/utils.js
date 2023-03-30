const Crypto = require("crypto")

function generateProblem () {
  const items = ['+', '-']

  let first_number = Math.floor(Math.random() * 50)
  let second_number = Math.floor(Math.random() * 11 + 1)
  let operator = items[Math.floor(Math.random()*items.length)]

  return `${first_number} ${operator} ${second_number} = ?`
}

function generateRandomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ Crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


module.exports = {
  generateProblem,
  generateRandomNumber,
  generateUUID
}