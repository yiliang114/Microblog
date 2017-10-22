var express = require('express');
var router = express.Router();

/* GET reg listing. */
router.get('/', function (req, res) {
    res.send('reg page');
});

module.exports = router;