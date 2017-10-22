function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入')
    return res.redirect('/login')
  }
  next()
}
function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入')
    return res.redirect('/')
  }
  next()
}

module.exports = {
  checkLogin, checkNotLogin
};
