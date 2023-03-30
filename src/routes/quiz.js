const router = require("express").Router()
const QuizController = require("../controllers/quiz")

const controller = new QuizController() 


router.get("/", controller.GET)
router.get("/createQuiz", controller.CREATE_QUIZ)
router.post("/checkQuiz", controller.CHECK_QUIZ)


module.exports = router
