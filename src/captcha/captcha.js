const Fs = require('fs')
const Path = require("path")
const JWT = require("../helpers/jwt");
const { createCanvas } = require('canvas')
const { AttributeRequireError, TokenExpiredError, InvalidTokenError } = require("../helpers/errors")
const { generateProblem, generateRandomNumber } = require('../helpers/utils')
const { generateUUID } = require("../helpers/utils")

class Database {
  constructor (dbPath) {
    this.dbPath = dbPath;
  }
  
  async #readFile () {
    const jsonData = Fs.readFileSync(this.dbPath)
    return JSON.parse(jsonData) || []
  }

  async #writeFile (data) {
    Fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 4))
  }

  async writeToDatabase(data) {
    const fileData = await this.#readFile()
    fileData.push(data);
    this.#writeFile(fileData);
  }

  async find (id) {
    const data = await this.#readFile();
    return data.find((ob) => {
      return ob.id == id;
    })
  }
}

class Captcha extends Database {
  constructor () {
    super(Path.join(__dirname, 'database.json'));
  }

  async __docs__ () {
    return Fs.readFileSync(Path.join(__dirname, "README.md"), "UTF-8")
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
  
  async create(opts = { buffer: true, width, height }, userAgent) {
    if (!userAgent) throw new AttributeRequireError(400 ,"userAgent is must be require!");

    this.width = opts?.width;
    this.height = opts?.height;

    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    
    this.ctx.fillStyle = this.opts?.bgColor || 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.fillPeaper();
    this.ctx.fillStyle = "black";
    
    const { quiz, answer } = generateProblem();

    let [_x, _y] = [10, 10];

    for (let chunk of quiz) {
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

    const id = generateUUID();
    this.writeToDatabase({ id, userAgent, quizAnswer: answer });

    return {
      data, 
      token: JWT.sign({
        id, userAgent
      }),
    }
  }

  async check(token, answer, userAgent) {
    try {
      if (!userAgent) throw new AttributeRequireError(400, "userAgent is must be required!"); 

      const { id, userAgent: tokenUserAgent } = JWT.verify(token);
      if (userAgent !== tokenUserAgent) throw new InvalidTokenError(400, "Token is invalid!");
      
      const quiz = await this.find(id)
      if (!quiz) throw new QuizNotFoundError(400, "Captcha not found in database please try restarting.")
      
      if (quiz.quizAnswer != answer) return { correct: false }

      return { correct: true }
    } catch (error) {
      throw new TokenExpiredError(400, "token has expired");
    }
  }
}


module.exports = Captcha