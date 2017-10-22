var express = require('express');
var router = express.Router();

/* GET logout listing. */
router.get('/', function (req, res) {
  res.send('logout page');
});

module.exports = router;
