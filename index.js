const Fs = require('fs')
const { createCanvas } = require('canvas')
const { generateProblem, generateRandomNumber } = require('./utils')


async function fillPeaper (ctx, width, height) {
  let x = generateRandomNumber(0, width);
  let y = generateRandomNumber(0, height);
  
  ctx.strokeStyle = `rgb(${generateRandomNumber(0, 256)},${generateRandomNumber(0, 256)},${generateRandomNumber(0, 1)})`
  ctx.beginPath()
  ctx.lineTo(x, y)
  ctx.lineTo(x + 5, y + 5)
  ctx.lineTo(x + 5, y + 5)
  ctx.lineTo(x + 15, y)
  ctx.lineTo(x + 15, y)
  ctx.lineTo(x + 20, y + 5)
  ctx.stroke()
}

async function bootstrap () {
  const canvas = createCanvas(200, 50)
  const ctx = canvas.getContext('2d')

  const randomQuiz = generateProblem();
  
  let _x = 10;
  let _y = 10;

  for (let i = 0; i < 50; i++) {
    fillPeaper(ctx, canvas.width, canvas.height);
  }

  for (let chunk of randomQuiz) {
    let fontSize = generateRandomNumber(23, 30);
    ctx.font = `${fontSize}px Impact`
    width = ctx.measureText(chunk).width
    _x += width;
    ctx.fillText(chunk, _x, _y + fontSize);
  }
  
  return '<img src="' + canvas.toDataURL() + '" /> \n'
}

async function main () {
  Fs.unlink("hello.html", (...params) => {
    console.log(params)
  });
  for (let i = 0; i < 20; i++) {
    let data = await bootstrap();
    Fs.appendFileSync("hello.html", `<p>${i+1}-quiz:</p>\n`);
    Fs.appendFileSync("hello.html", data, {
      'encoding': 'utf-8'
    })
  }
}

main();