var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/login', function (req, res) {
    res.send('login page');
});

module.exports = router;