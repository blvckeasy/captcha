const Captcha = require("../captcha/captcha");


class QuizController {
  constructor () {}

  async GET (req, res, next) {
    try {
      console.log("ok");
      let data = { title: "quiz", layout: "main" }
      return res.render('quiz', data)
    } catch (error) {
      next(error);
    }
  }

  async CREATE_QUIZ(req, res, next) {
    try {
      console.log("keldi");
      const { isBuffer } = req.query;
      const userAgent = req.headers["user-agent"];
      
      const width = req.query?.width || 200;
      const height = req.query?.height || 50;
  
      const captcha = new Captcha();
      const quiz = await captcha.create({ buffer: Boolean(isBuffer), width, height }, userAgent);

      console.log("quiz")
  
      return res.send(quiz);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async CHECK_QUIZ (req, res, next) {
    try {
      const { token, answer } = req.body;
      const userAgent = req.headers["user-agent"];
  
      const captcha = new Captcha();
      const result = await captcha.check(token, answer, userAgent);
  
      return res.send(result);
    } catch (error) {
      next(error);
    }
  }
}


module.exports = QuizController