const express = require('express');
var router = express.Router();
const controller = require('../controllers/paper.controller')


router.post('/set', controller.setPaper);
router.post('/add-qna', controller.addQna);
router.post('/update-qna', controller.updateQna);
router.post('/drop-qna', controller.dropQna);
router.post('/drop', controller.dropPaper);

module.exports = router;