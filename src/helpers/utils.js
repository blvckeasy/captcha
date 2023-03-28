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


module.exports = {
  generateProblem,
  generateRandomNumber
}