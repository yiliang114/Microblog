var express = require('express');
var router = express.Router();
var User = require('../db/models/user')
var utils = require('../db/models/utils')
var check = require('./check')

router.get('/reg', check.checkNotLogin);
/* GET reg listing. */
router.get('/reg', function (req, res) {
    res.render('reg', { title: '用户注册' });
});

router.post('/reg', check.checkNotLogin)
router.post('/reg', function (req, res) {
    // 检测两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
        // req.flash('error', '两次输入的口令不一致')
        utils.log('error', '两次输入的口令不一致')
        return res.redirect('/reg')
    }
    // 版本太老 todo
    // 生成口令的散列值
    // var md5 = crypto.createHash('md5')
    // var password = md5.update(req.body.password).digest('base64')

    // req.flash express3.x就被抛弃，换用connect-flash

    var newUser = new User({
        name: req.body.username,
        password: req.body.password
    })

    // 检测用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (user) {
            console.log('user:')
            console.log(user)
            err = 'username already exists.'
        }
        if (err) {
            req.flash('error', err)
            utils.log('error', err)
            return res.redirect('/reg')
        }
        // 如果不存在则新增用户
        newUser.save(function (err) {
            if (err) {
                req.flash('error', err)
                utils.log('error', err)
                return res.redirect('/reg')
            }
            req.session.user = newUser
            req.flash('success', '注册成功')
            utils.log('success', '注册成功')
            res.redirect('/')
        })
    })
})

module.exports = router;