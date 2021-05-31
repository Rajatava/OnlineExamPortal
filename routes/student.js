var express = require('express');
var router = express.Router();
const controller = require('../controllers/student.controller')


router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/get-marks', controller.getMarks);

module.exports = router;