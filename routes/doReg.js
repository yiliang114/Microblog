var express = require('express');
var router = express.Router();

/* GET doReg listing. */
router.get('/', function (req, res) {
    res.send('doReg page');
});

module.exports = router;