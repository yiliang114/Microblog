var express = require('express');
var router = express.Router();

/* GET user listing. */
router.get('/u/:user', function (req, res, next) {
  res.send('user page');
});

module.exports = router;
