const Express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const cors = require("cors");
const path = require("path");
const Captcha = require("./captcha/captcha");
const Errors = require("./helpers/errors")


const app = Express();
const PORT = process.env.PORT || 1003;

app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "*" }));
app.use(methodOverride("_method"));
app.use(Express.json());

app.engine('.hbs', exphbs.engine({ extname: ".hbs" }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))


app.get("/", (req, res) => {  
  try {
    let data = { title: "quiz", layout: "main" }
    return res.render('quiz', data)
  } catch (error) {
    next(error);
  }
})

app.get("/createQuiz", async (req, res) => {
  try {
    const { isBuffer } = req.query;
    const userAgent = req.headers["user-agent"];
    
    const width = req.query?.width || 200;
    const height = req.query?.height || 50;

    const captcha = new Captcha();
    const quiz = await captcha.create({ buffer: Boolean(isBuffer), width, height }, userAgent);

    return res.send(quiz);
  } catch (error) {
    next(error);
  }
})

app.post("/checkQuiz", async (req, res, next) => {
  try {
    const { token, answer } = req.body;
    const userAgent = req.headers["user-agent"];

    const captcha = new Captcha();
    const result = await captcha.check(token, answer, userAgent);

    return res.send(result);
  } catch (error) {
    next(error);
  }
})

app.use(async (err, req, res, next) => {

  if (Object.keys(Errors).some(function (errorName) {
    return errorName === err.name
  })) {
    return res.send({
      ok: false,
      error: err,
      errorName: err.name,
      status: err.status,
    })
  }

  return res.send({
    ok: false,
    errorName: "InternalServerError",
    status: 500,
  })
})

app.listen(PORT, () => {
  console.log("app listening on *" + PORT + " port");
})