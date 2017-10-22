var express = require('express');
var router = express.Router();
var Post = require('../db/models/post')

/* GET index page. */
router.get('/', function (req, res) {
  Post.get(null, function (err, posts) {
    if (err) {
      posts = []
    }
    res.render('index', { title: '首页', posts: posts });
  })

});

module.exports = router;
