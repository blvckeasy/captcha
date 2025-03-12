const methodOverride = require("method-override");
const swaggerUi = require("swagger-ui-express");
const exphbs = require("express-handlebars");
const swaggerJsdoc = require("swagger-jsdoc");
const Express = require("express");
const YAML = require("yamljs");
const cors = require("cors");
const path = require("path");

const QuizRouter = require("./routes/quiz");
const errorHandler = require("./middlewares/error.handler");

const app = Express();
const PORT = process.env.PORT || 3333;


app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(path.join(__dirname, "public")));
app.use(Express.static(path.join(process.cwd(), "config")));
app.use(cors({ origin: "*" }));
app.use(methodOverride("_method"));
app.use(Express.json());

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));


app.use(QuizRouter);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mini Captcha",
            version: "1.0.0",
            description: "Xavfsizlikni oshirish maqsadida ishlab chiqilgan captcha dasturi",
        },
    },
    apis: [path.join(__dirname, "./routes/*.js")],
};
const specs = swaggerJsdoc(options);
const swaggerDocument = YAML.load(path.join(__dirname, "helpers", "swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup({ ...specs, ...swaggerDocument }));

app.use(errorHandler);


app.listen(PORT, () => {
    console.log("app listening on *" + PORT + " port");
});

module.exports = app;
