function checkIfAdmin(req, res, next) {
  if (res.locals.isAdmin) {
    return next();
  }
  res.status(403).render('403');
}

module.exports = checkIfAdmin;
