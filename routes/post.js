var express = require('express');
var router = express.Router();

/* GET post listing. */
router.get('/', function (req, res) {
    res.send('post page');
});

module.exports = router;
