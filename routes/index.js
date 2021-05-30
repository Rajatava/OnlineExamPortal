var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
    res.send('Back End Service of Online Exam Portal');
})

//router.get('/adminlogin');

module.exports = router;