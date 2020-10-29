module.exports = {
  ensureAuthenticated: function(req, res, next) {
    let cookie = req.cookies['user'];
    if (cookie != undefined) return next();
    res.redirect('/login');
  },
  forwardAuthenticated: function(req, res, next) {
    let cookie = req.cookies['user'];
    if (cookie == undefined) return next();
    res.redirect('/');
  }
};