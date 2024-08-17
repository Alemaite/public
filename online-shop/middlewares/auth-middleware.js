function checkAuthStatus(req, res, next) {
  res.locals.isAuth = req.session.isAuth;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.loggedInEmail = req.session.loggedInEmail;
  next();
}

module.exports = checkAuthStatus;