var express = require('express');
var router = express.Router();
var User = require('../db/models/user')
var Post = require('../db/models/post')

/* GET user listing. */
router.get('/u/:user', function (req, res, next) {
  User.get(req.params.user, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('/')
    }
    Post.get(user.name, function (err, posts) {
      if (err) {
        req.flash('error', err)
        return res.redirect('/')
      }
      res.render('user', {
        title: user.name,
        posts: posts
      })
    })
  })
});

module.exports = router;
