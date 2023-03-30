const Express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const cors = require("cors");
const mime = require("mime");
const path = require("path");
const Captcha = require("./captcha/captcha");


const app = Express();
const PORT = process.env.PORT || 1003;

// app.use(Express.urlencoded({ extended: false }));

app.use(Express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "*" }));
app.use(methodOverride("_method"));

app.engine('.hbs', exphbs.engine({ extname: ".hbs" }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))


app.get("/", (req, res) => {  
  let data = { title: "quiz", layout: "main" }
  return res.render('quiz', data)
})

app.get("/createQuiz", async (req, res) => {
  const { isBuffer } = req.query;
  const opts = { width: 200, height: 50 }
  const userAgent = req.headers["user-agent"];
  const captcha = new Captcha(opts);
  const quiz = await captcha.create({ buffer: Boolean(isBuffer) }, userAgent);
  return res.send(quiz);
})

app.listen(PORT, () => {
  console.log("app listening on *" + PORT + " port");
})





// app.use('/static', Express.static(Path.join(__dirname, 'public')))
// app.use(function (req, res, next) {
//   req.sendFile = function (filename) {
//     res.sendFile(Path.join(__dirname, "public", filename));
//   }
//   next();
// })