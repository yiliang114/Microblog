var express = require('express');
var router = express.Router();
var User = require('../db/models/user')
var check = require('./check')

router.get('/login', check.checkNotLogin);
/* GET login listing. */
router.get('/login', function (req, res) {
    res.render('login', { title: '登入页面' });
});

router.post('/login', check.checkNotLogin)
router.post('/login', function (req, res) {
    // 版本太老 todo
    // 生成口令的散列值
    // var md5 = crypto.createHash('md5')
    // var password = md5.update(req.body.password).digest('base64')

    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在')
            return res.redirect('/login')
        }
        if (user.password != req.body.password) {
            req.flash('error', '用户口令错误')
            return res.redirect('/login')
        }
        req.session.user = user
        req.flash('success', '登入成功')
        res.redirect('/')
    })
});

module.exports = router;