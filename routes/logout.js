var express = require('express');
var router = express.Router();
var check = require('./check')

router.get('/logout', check.checkLogin);
/* GET logout listing. */
router.get('/logout', function (req, res) {
  // 登出之后应该讲session中的user删除，并跳转到首页或者登录页面
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/')
});

module.exports = router;
