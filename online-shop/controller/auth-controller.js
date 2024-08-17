const User = require('../models/users-model');
const ProductsClass = require('../models/products-model');
const authUtil = require('../util/auth-util');

async function getAdminPage(req, res) {
  if (res.locals.isAdmin) {
    const allProductData = await ProductsClass.getAllProductData();
    res.render('./admin/admin', { allProductData: allProductData });
  } else {
    res.status(403).render('403');
  }
}

function getLoginPage(req, res) {
  if (!req.session.errorData) {
    authUtil.resetSessionData(req);
  }

  const errorData = req.session.errorData;
  const inputData = req.session.inputData;

  authUtil.resetSessionData(req);

  res.render('login', { errorData: errorData, inputData: inputData });
}

function getSignupPage(req, res) {
  if (!req.session.errorData) {
    authUtil.resetSessionData(req);
  }

  const errorData = req.session.errorData;
  const inputData = req.session.inputData;

  authUtil.resetSessionData(req);

  res.render('signup', { errorData: errorData, inputData: inputData });
}

async function postSignupForm(req, res) {
  const userInputCorrect = await authUtil.checkSignUpFormInput(req);
  const userExists = await authUtil.checkIfUserExistsOnSignup(req);
  if (userInputCorrect && !userExists) {
    await new User(req.body['email'], req.body['signup-password']).createUser();
    res.redirect('/login');
    return;
  } else {
    res.redirect('/signup');
  }
}

async function postLoginPage(req, res) {
  const checkIfUserExists = await authUtil.checkIfUserExistsOnLogin(req);
  const checkPasswordMatch = await authUtil.checkPassword(req);
  const checkIfAdmin = await authUtil.checkIfUserIsAdmin(req);

  if (checkIfUserExists && checkPasswordMatch) {
    req.session.isAuth = true;
    req.session.loggedInEmail = req.body['login-email'];
  } else {
    res.redirect('/login');
    return;
  }

  if (checkIfAdmin) {
    req.session.isAdmin = true;
    req.session.save(function () {
      res.redirect('/admin');
    });
    return;
  } else {
    req.session.isAdmin = false;
    req.session.save(function () {
      res.redirect('/');
    });
    return;
  }
}

async function postLogout(req, res) {
  req.session.isAuth = false;
  req.session.isAdmin = false;
  req.session.loggedInEmail = '';
  authUtil.clearCheckoutSessionData(req);
  req.session.save(function () {
    res.redirect('/');
  });
  return;
}

module.exports = {
  getAdminPage: getAdminPage,
  getLoginPage: getLoginPage,
  getSignupPage: getSignupPage,
  postSignupForm: postSignupForm,
  postLoginPage: postLoginPage,
  postLogout: postLogout,
};
