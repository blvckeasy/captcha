const router = require("express").Router()
const QuizController = require("../controllers/quiz")

const controller = new QuizController() 


router.get("/", controller.GET)

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Captcha rasmlarni olish uchun 
 * /createQuiz:
 *   get:
 *     summary: Quiz yaratadi 
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Response namunasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateQuizResponse'
 *       400:
 *         description: Hatolik habari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */
router.get("/createQuiz", controller.CREATE_QUIZ)

/**
 * @swagger
 * tags:
 *   - name: Quiz
 *     description: Captcha rasmlarini olish va tekshirish uchun API
 * 
 * /checkQuiz:
 *   post:
 *     summary: Quiz natijasini tekshiradi
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckQuizBody'
 * 
 *     responses:
 *       200:
 *         description: Quiz natijasi muvaffaqiyatli yakunlanganida qaytadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizResultResponse'
 * 
 *       400:
 *         description: So‘rov (Request Body) to‘liq emas yoki noto‘g‘ri
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/AttributeRequireError'
 *                 - $ref: '#/components/schemas/TokenExpiredError'
 *                 - $ref: '#/components/schemas/InvalidTokenError'
 *                 - $ref: '#/components/schemas/QuizNotFoundError'
 * 
 *       500:
 *         description: Server tomonida qandaydur xatolik yuz berganda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.post("/checkQuiz", controller.CHECK_QUIZ)


module.exports = router
