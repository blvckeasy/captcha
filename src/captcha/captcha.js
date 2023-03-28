const Fs = require('fs')
const Path = require("path")
const { createCanvas } = require('canvas')
const { generateProblem, generateRandomNumber } = require('../helpers/utils')
const JWT = require("../helpers/jwt");

class Database {
  constructor () {}
}

class Captcha {
  constructor (opts = {}) {
    this.width = opts?.width;
    this.height = opts?.height
  }

  async __docs__ () {
    return Fs.readFileSync(Path.join(__dirname, "README.md"), "utf-8")
  }

  async fillPeaper (count = this.height) {
    for (let i = 0; i < count; i++) {
      let x = generateRandomNumber(0, this.width);
      let y = generateRandomNumber(0, this.height);
      
      this.ctx.strokeStyle = `rgb(${generateRandomNumber(0, 256)},${generateRandomNumber(0, 256)},${generateRandomNumber(0, 1)})`
      this.ctx.beginPath()
      this.ctx.lineTo(x, y)
      this.ctx.lineTo(x + 5, y + 5)
      this.ctx.lineTo(x + 5, y + 5)
      this.ctx.lineTo(x + 15, y)
      this.ctx.lineTo(x + 15, y)
      this.ctx.lineTo(x + 20, y + 5)
      this.ctx.stroke()
    }
  }
  
  async create(opts = { buffer: true }) {
    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')

    this.ctx.fillStyle = this.opts?.bgColor || 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.fillPeaper();
    this.ctx.fillStyle = "black";
    
    const randomQuiz = generateProblem();

    let _x = 10;
    let _y = 10;

    for (let chunk of randomQuiz) {
      let fontSize = generateRandomNumber(Math.floor(this.height / 1.4 - 7), Math.floor(this.height / 1.4));
      this.ctx.font = `${fontSize}px Impact`
      let width = this.ctx.measureText(chunk).width
      _x += width;
      this.ctx.fillText(chunk, _x, _y + fontSize);
    }
    
    if (opts?.buffer) {
      var data = this.canvas.toBuffer()
    } else {
      var data = this.canvas.toDataURL()
    }

    return {
      data, 
      token: JWT.sign({
        data,
      }),
    }
  }

  async check(token) {}
}


module.exports = Captcha