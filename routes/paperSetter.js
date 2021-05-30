var express = require('express');
var router = express.Router();
const controller = require('../controllers/paperSetter.controller')


router.post('/signup', controller.signup);
router.post('/get-response', controller.getResponse);
router.post('/get-marks', controller.getMarks);
router.post('/set-marks', controller.setMarks);

module.exports = router;