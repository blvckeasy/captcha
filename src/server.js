const Express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const cors = require("cors");
const path = require("path");
const QuizRouter = require("./routes/quiz");
const errorHandler = require("./middlewares/error.handler")

const app = Express();
const PORT = process.env.PORT || 1003;

app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.static(path.join(process.cwd(), 'config')));
app.use(cors({ origin: "*" }));
app.use(methodOverride("_method"));
app.use(Express.json());

app.engine('.hbs', exphbs.engine({ extname: ".hbs" }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))

app.use(QuizRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("app listening on *" + PORT + " port");
})


module.exports = app