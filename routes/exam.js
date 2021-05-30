var express = require('express');
var router = express.Router();
const controller = require('../controllers/exam.controller')


router.post('/start', controller.startExam);
router.post('/save', controller.saveAns);
router.post('/submit', controller.endExam);

module.exports = router;