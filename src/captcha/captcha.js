const Fs = require('fs')
const Path = require("path")
const JWT = require("../helpers/jwt");
const { createCanvas } = require('canvas')
const { AttributeRequireError, TokenExpiredError, InvalidTokenError, QuizNotFoundError } = require("../helpers/errors")
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
		Fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2))
	}

	async writeToDatabase(data) {
		const fileData = await this.#readFile()
		fileData.push(data);
		this.#writeFile(fileData);
	}

	async find (id) {
		const data = await this.#readFile();
		const foundQuiz = await data.find((ob) => {
			return ob.id == id && ob.attemps < 3;
		})
		if (foundQuiz) {
			foundQuiz.attemps += 1;
			this.#writeFile(data);
		}
		return foundQuiz
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
	
	async create(opts = { buffer, width, height }, userAgent) {
		if (!userAgent) throw new AttributeRequireError(400 ,"userAgent is must be require!");

		this.width = opts?.width;
		this.height = opts?.height;

		this.canvas = createCanvas(this.width, this.height)
		this.ctx = this.canvas.getContext('2d')
		
		this.ctx.fillStyle = this.opts?.bgColor || 'white';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.fillPeaper();
		this.ctx.fillStyle = "black";
		
		const { quiz, answer } = await generateProblem();

		
		let [_x, _y] = [10, 10];
		
		let fontSize = await generateRandomNumber(Math.floor(this.height / 1.4 - 7), Math.floor(this.height / 1.4));
		this.ctx.font = `${fontSize}px Impact`
		this.ctx.fillText(quiz, _x, this.canvas.height / 2 + 10);
		
		// for await (let chunk of quiz) {
			// 	let fontSize = await generateRandomNumber(Math.floor(this.height / 1.4 - 7), Math.floor(this.height / 1.4));
			// 	this.ctx.font = `${fontSize}px Impact`
			// 	let width = this.ctx.measureText(chunk).width
			// 	_x += width;
			// 	this.ctx.fillText(chunk + "", _x, _y + fontSize);
		// }

		let data;

		if (opts?.buffer) {
			data = this.canvas.toBuffer()
		} else {
			data = this.canvas.toDataURL()
		}

		const id = await generateUUID();
		await this.writeToDatabase({ id, userAgent, quizAnswer: answer, attemps: 0 });

		return {
			data, 
			token: JWT.sign({
				id, userAgent
			}),
		}
	}

	async check(token, answer, userAgent) {
		if (!userAgent) throw new AttributeRequireError(400, "userAgent is must be required!"); 

		const { id, userAgent: tokenUserAgent } = JWT.verify(token);
		if (userAgent !== tokenUserAgent) throw new InvalidTokenError(400, "Token is invalid!");
			
		const quiz = await this.find(id)
		if (!quiz) throw new QuizNotFoundError(400, "Captcha not found in database please try restarting.")
			
		if (quiz.quizAnswer != answer) return { correct: false, message: "Couldn't find it, please try again." }

		return { correct: true, message: "You have passed successfully." }
	}
}


module.exports = Captcha