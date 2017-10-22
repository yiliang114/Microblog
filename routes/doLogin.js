var express = require('express');
var router = express.Router();

/* GET doLogin listing. */
router.get('/', function (req, res) {
  res.send('doLogin page');
});

module.exports = router;
